import { Model } from "../model/model.mjs";
import { FileListView } from "../view/view.mjs";


export class Controller {
  

  
  static async init() {
    await Model.init();
    await FileListView.init();
    //console.info(Model.currentFileList);
  }

  static async getCurrentFileList() {
    
    try {
      let currentFileList = await Model.getCurrentFileList();
    //console.log("🚀 ~ Controller ~ getCurrentFileList ~ currentFileList:", currentFileList)
    //console.info(currentFileList);
      return currentFileList;
    } catch (err) { console.error(err) }
  }



  static async setCurrentFileList(id) {
    for (let i = 0; i < Model.currentFileList.length; i++) {
      if (
        Model.currentFileList[i].type == "folder" &&
        Model.currentFileList[i].id == id
      ) {
        await Model.setCurrentFolder(Model.currentFileList[i]);
        break;
      }
    }

    //Model.getCurrentFileList();
    FileListView.render();
  }

  

  static async back() {
    try {
      let history = await Model.getHistory();
      if (history.count <= 1) return;
      await Model.previousFolder();
      FileListView.render();
    } catch (err) { console.error(err) }
  }

  static async getPath() {
    try {
      let path = await Model.getPath();
      return path;
    } catch (err) { console.error(err) }
  }
  
  static async setNewFolder({ name }) {
    try {
      await Model.createFolder({ name });
      FileListView.render();
    } catch (err) { console.error() };
  }


  static async setNewFile({ name, content }) {
    try {
      await Model.createFile({ name, content });
      FileListView.render();
    } catch(err) { console.error(err) }
  }


  static async getFile(id) {
    try {
      //console.info('controller recibi', id);
      //console.info('type', typeof id);
      let files = await this.getCurrentFileList();
      //console.info('controller files', files);
      
      let file = files.find(el => el.id === id);

      if (file) return file;
      else return 'not found';

    } catch (err) { console.error(err) }
    
  }


  



}


await Controller.init();

