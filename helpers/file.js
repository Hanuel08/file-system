import { createSize } from "../utils/createSize.js";
//import { validateTime } from "../utils/validateTime.js";
//import { cleanTime } from "../utils/CleanDate.js";

class File {
  constructor({ name, path, id, type, parent, history, format, size }) {
    this.name = name;
    this.path = path;
    //this.date = date;
    this.parent = parent;
    //console.info(created, changed, opened);
    /* this.created = cleanTime(validateTime(created));
    this.changed = cleanTime(validateTime(changed));
    this.opened = cleanTime(validateTime(opened)); */
    this.history = history;
    this.type = type || "";
    this.id = id;
    this.format = format;
    this.size = createSize(size);
  }

  //async open() {}
}

File.prototype.open = async function () {};

export { File };
