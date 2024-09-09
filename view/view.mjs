//controller
import { Controller } from "../controller/controller.mjs";

//Asi se importa un json
//json
//import { objectJson} from "data/archivoJson" assert { type: json }
//import { objectJson} from "data/archivoJson" with { type: json } Esta es la actual

//document = global.document;
import { createDOMFile } from "../helpers/createDOMFile.js";



const panelCreateFolder = () => {

  
  let div = document.createElement('div');
  div.innerHTML = /* html */ `
  <div class="main__create-folder">

        

        <div class="main__create-folder__header">
          <div class="main__create-folder__header__icon">
            <i class="ti ti-folder-filled"></i>
          </div>
          <input type="text" name="" id="" placeholder="new folder" class="main__create-folder__header__input">
        </div>

        <p class="main__create-folder__path">C:/User/Usuario/Downloads/work/app.js</p>

        
        
        <div class="main__create-folder__actions">
          <button class="main__create-folder__actions__create-btn">CREATE</button>
          <button class="main__create-folder__actions__cancel-btn">CANCEL</button>
        </div>

      </div>`;

  return div;
}






class cors extends HTMLElement { };


import { BaseFile } from "../components/BaseFile.js";
import { CreateFolderPanel } from "../components/CreateFolderPanel.js";
import { CreateFilePanel } from "../components/createFilePanel.js";
import { FileInfoPanel } from "../components/fileInfoPanel.js";
import { FolderInfoPanel } from "../components/folderInfoPanel.js";

export class FileListView {
  static async init() {
    this.parent = document.querySelector('.main')
    this.$fileListContent = document.querySelector(".main__content");
    this.$backBtn = document.querySelector(".header__tools__back-btn");
    this.$path = document.querySelector(".main__info__path");
    //this.createBtn = "";

    this.$searchBtn = document.querySelector(".header__search__search-btn");

    this.$searchInput = document.querySelector(".header__search__input");
    this.$createBtn = document.querySelector('.header__tools__create__create-btn');
    this.$createFolderBtn = document.querySelector('.header__tools__create__create-folder-btn');
    this.createFileBtn = document.querySelector('.header__tools__create__create-file-btn');

    try {
      await this.render();
      this.addEvents();
    } catch (err) {
      console.error(err);
    }
  }
  

  static async render() {
    try {
      this.$fileListContent.innerHTML = "";
      let fileList = await Controller.getCurrentFileList();
      let pathText = await Controller.getPath();
      let fragment = document.createDocumentFragment();
      let element;


      //console.log("🚀 ~ FileListView ~ render ~ fileList:", fileList)

      this.$path.textContent = pathText.join("/");

      //console.log(window.scrollY);
      //window.scrollY = 134;
      window.scrollTo(0, 0);

      if (fileList.length == 0) {
        //.log(fileList);
        let parent = document.createElement('div');
        parent.classList.add('main__content__empty');
        element = document.createElement('i');
        element.classList.add('ti', 'ti-box-off');
        

        //console.log(element);

        parent.appendChild(element);
        fragment.appendChild(parent);
        //console.log(parent);
        this.$fileListContent.appendChild(parent);
        //console.log(this.$fileListContent);
        return;
      }



      for (let i = 0; i < fileList.length; i++) {
        element = createDOMFile(fileList[i]);

        fragment.appendChild(element);
      }

      this.$fileListContent.appendChild(fragment);
    } catch (err) {
      console.error(err);
    }
  }

  static async createFile() {}



  /* static async createFolder(name) {
    try {
      await Controller.setNewFolder(name);
    } catch (err) { console.error(err) }
  } */



  static async delete(element) { }
  


  static async addEvents() {

    const findFileElement = (e, className, type) => {
      let parent = e.target.closest(`.${className}`);
      if (
        e.target.classList.contains(className) &&
        e.target.getAttribute("data-type") == type
      ) {
        return e.target;
      } else if (type && parent && parent.getAttribute("data-type") == type) {
        return parent;
      } else if (!type && parent) {
        return parent;
      } else return false;
    }




    document.addEventListener("click", async (e) => {
      let element = findFileElement(e, "main__content__file", 'folder');
      if (element) {
        try {
          await Controller.setCurrentFileList(element.id);
        } catch (err) {
          console.error(err);
        }
      }
    });


    document.addEventListener("click", async (e) => {
      let element = findFileElement(e, "main__content__file", "file");
      if (element) {
        try {
          //await Controller.setCurrentFileList(element.id);
          console.info('Soy un file', element.id);
        } catch (err) {
          console.error(err);
        }
      }
    });


    const findElementByClass = (e, className) => {
      //let parent = e.target.closest(`.${className}`);
      //console.info(e.target)
      if (e.target.classList.contains(className)) {
        return e.target;
      } else if (e.target.closest(`.${className}`)) {
        //console.info(e.target.closest(`.${className}`));
        return e.target.closest(`.${className}`);
      } else return false;
    }





    document.addEventListener('click', async e => {
      let element = findElementByClass(e, "header__tools__create__create-folder-btn");
      if (element) {
        try {
          let $parent = this.parent;
          let createFolderPanel = new CreateFolderPanel({ $parent});
          await createFolderPanel.render();
        } catch (err) {
          console.error(err);
        }
      }
    })

    document.addEventListener('click', async e => {
      let element = findElementByClass(e, "header__tools__create__create-file-btn");
      //console.info(e.target)
      if (element) {
        try {
          //console.info('HOLA')
          let $parent = this.parent;
          let createFilePanel = new CreateFilePanel({ $parent });
          await createFilePanel.render();
        } catch (err) {
          console.error(err);
        }
      }
    })



    document.addEventListener("contextmenu", async (e) => {
      e.preventDefault();
      let element = findElementByClass(e, "main__content__file");
      console.info("element", element);
      if (element && element.getAttribute("data-type") == "file") {
        try {
          let $parent = this.parent;
          let fileInfoPanel = new FileInfoPanel({ $parent });
          await fileInfoPanel.render(element.getAttribute("id"));
        } catch (err) {
          console.error(err);
        }
      }
    });


    document.addEventListener("contextmenu", async (e) => {
      e.preventDefault();
      let element = findElementByClass(e, "main__content__file");
      console.info('Entrando :V')
      console.info("element", element);
      if (element && element.getAttribute("data-type") == "folder") {
        try {
          console.info('HOLA BRO')
          let $parent = this.parent;
          let folderInfoPanel = new FolderInfoPanel({ $parent });
          await folderInfoPanel.render(element.getAttribute("id"));
        } catch (err) {
          console.error(err);
        }
      }
    });





    this.$backBtn.addEventListener("click", async (e) => {
      try {
        await Controller.back();
      } catch (err) {
        console.error(err);
      }
    });

    this.$searchBtn.addEventListener("click", (e) => {
      //if ()
    });



  }

}
