import { Controller } from "../controller/controller.mjs";
import { createTemplate } from "../utils/createTemplate.js";
import { insertDOM } from "../utils/insertDOM.js";

let $template = /* html */ 
    `<div class="main__create-folder">
        <div class="main__create-folder__header">
          <div class="main__create-folder__header__icon">
            <i class="ti ti-folder-filled"></i>
          </div>
          <input type="text" name="" id="" placeholder="new folder" class="main__create-folder__header__input">
        </div>

        <p class="main__create-folder__path"></p>

        <div class="main__create-folder__actions">
          <button class="main__create-folder__actions__cancel-btn">CANCEL</button>
          <button class="main__create-folder__actions__create-btn">CREATE</button>
        </div>
      </div>`;


createTemplate($template, { id: "template-create-folder-panel" });










export class CreateFolderPanel {
  #state = { mode: 'close' }

  constructor({ $parent }) {
    this.$parent = $parent;
    //this.path = path;
  }

  assign() {
    this.$DOM = document.querySelector(".main__create-folder");
    this.$input = document.querySelector(".main__create-folder__header__input");
    this.$cancelBtn = document.querySelector('.main__create-folder__actions__cancel-btn');
    this.$createBtn = document.querySelector('.main__create-folder__actions__create-btn')
  }

  async render() {
    try {
      let path = await Controller.getPath();
      let $template = document.getElementById("template-create-folder-panel").content;
      let $clone = document.importNode($template, true);
      $clone.querySelector('.main__create-folder__path').textContent = path.join('/');
      insertDOM(this.$parent, $clone);
      this.#state.mode = 'open';
      this.assign();
      this.events();
    } catch(err) { console.error(err) }
  }

  events() {

    const cancel = (e)=> {
      if (
        e.target.matches(".main__create-folder__actions__cancel-btn") &&
        this.#state.mode == "open"
      ) {
        this.#state.mode = "close";
        this.$DOM.remove();
        document.removeEventListener("click", cancel);
        document.removeEventListener('click', createFolder)
      }
    }

    const createFolder = async (e) => {
      if (e.target.matches(".main__create-folder__actions__create-btn")) {
        let newFolderName = this.$input.value;
        if (newFolderName.length === 0) newFolderName = this.$input.getAttribute('placeholder')

        try {
          await Controller.setNewFolder({ name: newFolderName });
          this.$cancelBtn.click();
        
        } catch(err) { console.error(err) }

      }
    }

    document.addEventListener('click', cancel);
    document.addEventListener('click', createFolder);
    
  }
}
      
