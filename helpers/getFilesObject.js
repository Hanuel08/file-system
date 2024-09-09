import { Folder } from "./folder.js";
import { File } from "./file.js";
import { PORT } from "../const/const.js";


let idFile = -1;

export async function getFilesObjects(file) {
  return fetch(`http://localhost:${PORT}/${file || ""}`, { method: "GET" })
    .then((response) => response.text())
    .then((result) => {
      const responseObject = JSON.parse(result);

      idFile++;
      responseObject.id = idFile;
      
      if (responseObject.type == "folder") {
        //const { name, path, date, type, parent, content } = responseObject;
        //let folder = new Folder(responseObject);

        return new Folder(responseObject);
      }
      //const { name, path, date, type, parent, format, size } = responseObject;
      return new File(responseObject);
    })
    .catch((err) => console.error(err));
}
