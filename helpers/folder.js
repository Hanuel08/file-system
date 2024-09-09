import { getFilesObjects } from "./getFilesObject.js";
//import { validateTime } from "../utils/validateTime.js";
//import { cleanTime } from "../utils/CleanDate.js";

class Folder {
  //static #state = { update: false };

  constructor({ name, path, id, type, parent, history, contentNames }) {
    this.name = name;
    this.path = path;
    //this.date = date;
    this.id = id;
    this.type = type;
    this.parent = parent;
    //console.info(created, changed, opened);
    this.history = history;
    //this.created = cleanTime(validateTime(created));
    //this.changed = cleanTime(validateTime(changed));
    //this.opened = cleanTime(validateTime(opened));
    this.contentNames = contentNames;
    this.files = [];
  }
}

Folder.prototype.update = async function () {
  let path = this.path.join("/");
  try {
    let updatedFolder = await getFilesObjects(`${path}`);
    return updatedFolder;
  } catch (err) {
    console.error(err);
  }
};

Folder.prototype.getFiles = async function (update = false) {
  if (this.files.length === this.contentNames.length && !update)
    return this.files;
  let path = this.path.join("/");

  let file, result;
  let files = [];

  for (let i = 0; i < this.contentNames.length; i++) {
    file = this.contentNames[i];
    try {
      result = await getFilesObjects(`${path}/${file}`);
    } catch (err) {
      console.error(err);
    }

    files.push(result);
  }
  this.files = files;
  return files;
};

export { Folder };
