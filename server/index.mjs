import { createServer } from "node:http";
import { createReadStream, createWriteStream } from "node:fs";
import { stat, readdir, mkdir, unlink, rm } from "node:fs/promises";
import { resolve, sep, join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC_DIR = resolve(__dirname, "../public");
const PORT = parseInt(process.env.PORT || "3000");
const BASE_DIR = resolve(process.env.BASE_DIR || process.cwd());

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function json(data, status = 200) {
  return { body: JSON.stringify(data), status, type: "application/json" };
}

function text(body, status = 200) {
  return { body: String(body), status, type: "text/plain" };
}

function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", resolve);
    from.pipe(to);
  });
}

function serveStatic(urlPath) {
  let filePath = urlPath === "/" ? "/index.html" : urlPath;
  return resolve(PUBLIC_DIR, "." + filePath);
}

function apiPath(url) {
  const { pathname } = new URL(url, "http://localhost");
  const decoded = decodeURIComponent(pathname).slice("/api".length + 1);
  const path = decoded ? resolve(decoded) : resolve(BASE_DIR);

  if (path !== BASE_DIR && !path.startsWith(BASE_DIR + sep)) {
    throw { status: 403, body: "Forbidden" };
  }
  return path;
}

// ── API methods ──

const api = {};

api.GET = async (request) => {
  const path = apiPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (e) {
    if (e.code === "ENOENT") return text("Not found", 404);
    throw e;
  }

  if (stats.isDirectory()) {
    const entries = await readdir(path, { withFileTypes: true });
    const items = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = join(path, entry.name);
        try {
          const entryStat = await stat(entryPath);
          return {
            name: entry.name,
            type: entry.isDirectory()
              ? "folder"
              : extname(entry.name).slice(1) || "file",
            isDirectory: entry.isDirectory(),
            size: entryStat.size,
            created: entryStat.birthtime.toISOString(),
            modified: entryStat.mtime.toISOString(),
            path: entryPath.split(sep),
          };
        } catch {
          return null;
        }
      })
    );

    const filtered = items.filter(Boolean);
    filtered.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    return json({
      name: basename(path),
      path: path.split(sep),
      type: "folder",
      items: filtered,
    });
  }

  const mime = MIME_TYPES[extname(path).toLowerCase()] || "application/octet-stream";
  return { body: createReadStream(path), type: mime };
};

api.DELETE = async (request) => {
  const path = apiPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (e) {
    if (e.code === "ENOENT") return text("Not found", 404);
    throw e;
  }
  if (stats.isDirectory()) await rm(path, { recursive: true });
  else await unlink(path);
  return text("Deleted", 204);
};

api.PUT = async (request) => {
  const path = apiPath(request.url);
  const dir = dirname(path);
  try {
    await stat(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
  await pipeStream(request, createWriteStream(path));
  return text("Created", 201);
};

api.MKCOL = async (request) => {
  const path = apiPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (e) {
    if (e.code === "ENOENT") {
      await mkdir(path, { recursive: true });
      return text("Created", 201);
    }
    throw e;
  }
  if (stats.isDirectory()) return text("Already exists", 200);
  return text("Not a directory", 400);
};

api.OPTIONS = () => text("", 204);

// ── Server ──

const server = createServer(async (request, response) => {
  try {
    const { pathname } = new URL(request.url, "http://localhost");
    let result;

    if (pathname.startsWith("/api/")) {
      const handler = api[request.method] || (() => text("Method not allowed", 405));
      result = await handler(request);
    } else if (request.method === "GET") {
      const filePath = serveStatic(pathname);
      let stats;
      try {
        stats = await stat(filePath);
      } catch {
        result = text("Not found", 404);
      }
      if (stats) {
        const mime =
          MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream";
        result = { body: createReadStream(filePath), type: mime, status: 200 };
      }
    } else {
      result = text("Method not allowed", 405);
    }

    response.writeHead(result.status, {
      "Content-Type": result.type || "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, MKCOL, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    if (result.body && result.body.pipe) result.body.pipe(response);
    else response.end(result.body);
  } catch (e) {
    const status = e.status || 500;
    response.writeHead(status, { "Content-Type": "text/plain" });
    response.end(e.body || "Internal server error");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Serving files from: ${BASE_DIR}`);
});
