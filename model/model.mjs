//let PORT = 5204;
//import { PORT } from "../server/file_server.mjs";
//console.info('PORT', PORT);
import { Controller } from "../controller/controller.mjs";
import { FileListView } from "../view/view.mjs";

import { PORT } from "../const/const.js";
import { createSize } from "../utils/createSize.js";
import { Stack } from "../helpers/stack.js";


/* import { Folder } from "../helpers/folder.js";


import { File } from "../helpers/file.js"; */

import { getFilesObjects } from "../helpers/getFilesObject.js";


export class Model {
  
  static #state = { update: false }

  static async init() {
    try {
      this.history = new Stack();
      this.currentFolder = await getFilesObjects(); 
      this.history.push(this.currentFolder);
      await this.update();
    } catch(err) { console.error(err) }
  }



  static async getCurrentFileList() {
    try {
      let currentFileList = await this.currentFolder.getFiles();
      return currentFileList;
    } catch (err) {
      console.error(err);
    }
  }



  static async update() {
    try {
      if (this.#state.update) {
        this.currentFolder = await this.currentFolder.update();
        if (this.history.peek().name == this.currentFolder.name) this.history.pop();
      }
      
      if (this.history.peek().name != this.currentFolder.name) this.history.push(this.currentFolder);

      this.currentFileList = await this.getCurrentFileList();
      this.#state.update = false;
      console.info(this.currentFolder);
    } catch (err) { console.error(err) }
  }
  
  static async setCurrentFolder(folder) {

    try {
      this.currentFolder = folder;
      await this.update();
    } catch(err) { console.error(err) }
  }



  static async previousFolder() {
    this.history.pop();
    try {
      await this.setCurrentFolder(this.history.peek());
    } catch (err) { console.error(err) }
  }


  static getPath() {
    return this.currentFolder.path;
  }

  static async getHistory() {
    return this.history;
  }


  static async createFolder({ name }) {
    try {

      //let path = await this.getPath()
      console.info('path', this.getPath());
      //console.info('name', name)
      await fetch(`http://localhost:${PORT}/${this.getPath().join("/")}/${name}`, { method: "MKCOL" });
      //this.currentFileList = await this.currentFolder.getFiles();
      this.#state.update = true;
      await this.update();
    } catch (err) { console.error(err) }
  }

  static async createFile({ name, content }) {
    try {
      await fetch(`http://localhost:${PORT}/${this.getPath().join("/")}/${name}`, {
        method: "PUT",
        body: /* JSON.stringify(content) */content,
      });

      this.#state.update = true;
      await this.update();
    } catch (err) { console.error(err) }
  }


  
  

  

  static async getArchives() {
    
  }


}


