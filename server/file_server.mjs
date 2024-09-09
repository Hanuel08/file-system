//import { readFile } from "node:fs";
//import { writeFile } from "node:fs";
//import { readFileSync } from "node:fs";


import { createServer } from "node:http";


//ctrl + Alt + L
//let PORT;

import {
  resolve,
  sep,
  normalize,
  join,
  dirname,
  basename,
  extname,
} from "node:path";

const methods = Object.create(null);

//let PORT;

createServer((request, response) => {
  //const whiteList = ["http://127.0.0.1:5502/fileSystem.html", ];
  //console.log(cors({ origin: whiteList }));
  console.log('method', request.method);

  let handler = methods[request.method] || notAllowed;

  

  //console.log('request.method:', request.method);
  //console.log('response', response);
  //console.log('handler', handler);
  //console.log('request.body', request.body);
  //console.log('response.body', response.body)

  /* Access-Control-Allow-Methods: GET, POST, PUT, DELETE // Allowed methods
     Access-Control-Allow-Headers: Content-Type // Allowed headers */

  /* access-control-allow-credentials:true */

  /* const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
} */

  /* res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, 
    Accept, x-client-key, x-client-token, x-client-secret, Authorization"); */

  /* res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, 
    Accept, x-client-key, x-client-token, x-client-secret, Authorization"); */

  handler(request)
    .catch((error) => {
      console.info('error request', error.status)
      if (error.status != null) return error;
      return { body: String(error), status: 500 };
    })
    .then(({ body, status = 200, type = "text/plain" }) => {
      //console.log("body", body);
      response.writeHead(status, {
        "Content-Type": type,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "MKCOL, GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
        //"Access-Control-Max-Age": 86400,
        /* "access-control-allow-credentials": true,
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token,x-client-secret, Authorization", */
      });

      /* Cuando el valor de body es un readable stream, este tendrá un método pipe que se utiliza para reenviar todo el contenido de un flujo de lectura a un writable stream */
      console.info('status of request', status);
      //console.info('response', response);
      if (body && body.pipe) body.pipe(response);
      else response.end(body);
    });
}).listen(56425, async function () {
  //PORT = this.address().port;
  console.log(`Puerto libre: http://localhost:${this.address().port}`);
  //console.log(`¡Escuchando! (puerto ${this.address().port})`);
});

async function notAllowed(request) {
  ///console.info('NO ESTA PERMITIDO BRO', request.method)
  return {
    status: 405,
    body: `Método ${request.method} no permitido.`,
  };
}

import { parse } from "node:url";
//import { basename, resolve, sep } from "node:path";

//const baseDirectory = process.cwd();
const baseDirectory = "c:\\Users\\Usuario\\Downloads";
console.log(baseDirectory);

function urlPath(url) {
  let { pathname } = new URL(url, "http://d");

  //console.info('pathname', pathname);
  //console.info('deconde pathname', decodeURIComponent(pathname).slice(1))
  let path;
  //path = resolve(decodeURIComponent(pathname).slice(1));
  if (decodeURIComponent(pathname).slice(1) == '') path = resolve(baseDirectory);
  else path = resolve(decodeURIComponent(pathname).slice(1))

  //console.info('rsolve decode', path);

  if (path != baseDirectory && !path.startsWith(baseDirectory + sep)) {
    throw { status: 403, body: "Prohibido" };
  }
  //console.info('urlPath', path)
  return path;
}

import { createReadStream } from "node:fs";
import { stat, readdir } from "node:fs/promises";

/* El paquete mime-types conoce el tipo correcto para una gran cantidad de extensiones de archivo. */
import { lookup } from "mime-types";

const consol = {};

import { isStringObject } from "node:util/types";



//headers: { "Content-Type": "application/json" }
methods.GET = async function (request) {
  console.info('request', request.url);
  let path = urlPath(request.url);
  //console.log('request.url', request.url);
  console.log('path', path);

  consol["request-url"] = request.url;
  consol.path = path;

  let stats;

  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return { status: 404, body: "Archivo no encontrado" };
  }

  /* let created = validateTime(stats.birthtime.toString());
  let changed = validateTime(stats.ctime.toString());
  let opened = validateTime(stats.atime.toString()); */

  /* let created = stats.birthtime.toString();
  let changed = stats.ctime.toString();
  let opened = stats.atime.toString(); */

  //created = cleanTime(created)

  //let date = /^(\w+?\s\w+?\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2})\s/.exec(birthtime);
  //console.info('file', stats);


  /* birthtime: Este es el momento en que el archivo fue creado. Sin embargo, su valor es específico del sistema de archivos. En algunos sistemas (como en ext4 de Linux), podría ser la misma que ctime.

  mtime: Se actualiza cuando el contenido del archivo cambia.

  atime: Se actualiza cada vez que se lee el archivo, aunque en algunos sistemas modernos este tiempo podría no actualizarse con cada lectura para mejorar el rendimiento.

  ctime: Se actualiza cuando el contenido del archivo cambia o cuando se cambia la metadata (como permisos, nombre, etc.). */

  const file = {
    name: basename(path),
    path: path.split(sep),
    //date: date[1],
    parent: basename(dirname(path)),
    history: {
      created: stats.birthtime.toString(),
      changed: stats.ctime.toString(),
      opened: stats.atime.toString(),
    },
    //in bytes
    //size: stats.size,
  };

  consol.stats = stats;

  if (stats.isDirectory()) {
    Object.assign(file, { type: "folder", contentNames: await readdir(path) });
    console.info(file);
    return {
      body: JSON.stringify(file),
      headers: { "Content-Type": "application/json" },
    };
  } else {
    Object.assign(file, {
      type: lookup(path),
      format: extname(path),
      size: stats.size,
    });
    console.info(file);
    return {
      body: JSON.stringify(file),
      headers: { "Content-Type": "application/json" },
    };
  }


};

import { rmdir, unlink, mkdir } from "node:fs/promises";

methods.OPTIONS = async function (request) {
  //let path = urlPath(request.url);
  //console.info("headers", request.headers);
  //console.info('path', path);

  //console.info('method', request.method);
  let methodSended = request.headers["access-control-request-method"];
  console.info('methodSended', methodSended);

  console.info("methods", methods[methodSended]);


  if (methods[methodSended]) return { status: 204 };
  else return notAllowed(request);
}

methods.DELETE = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return { status: 204 };
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return { status: 204 };
};

import { createWriteStream } from "node:fs";
//import { isStringObject } from "node:util/types";

function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", resolve);

    console.info('from', from);
    console.info('to', to)
    /* usamos pipe para mover datos de un flujo legible a uno escribible, en este caso del request al archivo */
    from.pipe(to);
  });
}

methods.PUT = async function (request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  console.info('dime bro');
  return { status: 204 };
};

methods.MKCOL = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    await mkdir(path);
    return { status: 204 };
  }
  if (stats.isDirectory()) return { status: 204 };
  else return { status: 400, body: "Not a directory" };
};




//export { PORT };