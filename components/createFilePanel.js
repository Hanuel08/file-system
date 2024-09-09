import { Controller } from "../controller/controller.mjs";
import { createTemplate } from "../utils/createTemplate.js";
import { insertDOM } from "../utils/insertDOM.js";
import { fileTypesIcons } from "../utils/fileTypesIcons.js";

let $template =
  /* html */
  `<div class="main__create-file">
        <div class="main__create-file__header">
          <div class="main__create-file__header__icon">
            <i class="ti ti-file-filled"></i>
          </div>
          <input type="text" name="" id="" placeholder="new file.txt" class="main__create-file__header__input">
        </div>

        <p class="main__create-file__path"></p>

        <textarea class="main__create-file__content" id="" placeholder="Ingresa el contenido del archivo"></textarea>

        <div class="main__create-file__actions">
          <button class="main__create-file__actions__cancel-btn">CANCEL</button>
          <button class="main__create-file__actions__create-btn">CREATE</button>
        </div>
      </div>`;


createTemplate($template, { id: "template-create-file-panel" });




export class CreateFilePanel {
  #state = { mode: 'close' }

  constructor({ $parent }) {
    this.$parent = $parent;
  }

  assign() {
    this.$DOM = document.querySelector(".main__create-file");
    this.$name = document.querySelector(".main__create-file__header__input");
    this.$contentFile = document.querySelector(".main__create-file__content");
    this.$cancelBtn = document.querySelector('.main__create-file__actions__cancel-btn');
    this.$createBtn = document.querySelector('.main__create-file__actions__create-btn');
    this.$icon = document.querySelector(".main__create-file__header__icon .ti");
  }

  async render() {
    try {
      let $template = document.getElementById("template-create-file-panel").content;
      
      let $clone = document.importNode($template, true);
      let path = await Controller.getPath();
      $clone.querySelector('.main__create-file__path').textContent = path.join('/');

      insertDOM(this.$parent, $clone);
      this.#state.mode = 'open';
      console.info($clone);

      this.assign();
      this.events();
    } catch(err) { console.error(err) }
  }

  events() {

    const cancel = (e)=> {
      if (
        e.target.matches(".main__create-file__actions__cancel-btn") &&
        this.#state.mode == "open"
      ) {
        this.#state.mode = "close";
        this.$DOM.remove();
        document.removeEventListener("click", cancel);
        document.removeEventListener('click', createFile)
      }
    }

    const createFile = async (e) => {
      if (e.target.matches(".main__create-file__actions__create-btn")) {
        let newFileName = this.$name.value;
        let newFileContent = this.$contentFile.value;

        if (newFileName.length === 0) newFileName = this.$name.getAttribute('placeholder');

        try {
          await Controller.setNewFile({ name: newFileName, content: newFileContent });
          this.$cancelBtn.click();
        } catch(err) { console.error(err) }

      }
    }


    const changeIcon = (e) => {
      let name = this.$name.value;
      const nameRegExp = /^.+?\.(\w+)/g;
      let result = nameRegExp.exec(name);
      let extname;

      if (!result && this.$icon.classList.contains("ti-file-filled")) {
        return;
      } else if (result && fileTypesIcons.hasOwnProperty(result[1])) {
        console.info(fileTypesIcons.hasOwnProperty(result[1]));
        extname = result[1];
      } else {
        extname = "txt";
      } 
      
      this.$icon.className = "";
      this.$icon.classList.add(...fileTypesIcons[extname]);
      return;
    }

    this.$name.addEventListener('change', changeIcon);
    document.addEventListener('click', cancel);
    document.addEventListener('click', createFile);
  }
}