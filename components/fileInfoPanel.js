import { Controller } from "../controller/controller.mjs";
import { CleanDate } from "../utils/CleanDate.js";
import { fileTypesIcons } from "../utils/fileTypesIcons.js";
import { createTemplate } from "../utils/createTemplate.js";
import { insertDOM } from "../utils/insertDOM.js";

let $template =
  /* html */
  `<div class="main__file-info" id="">
        
        <div class="main__file-info__header">
          <div class="main__file-info__header__icon">
            <i class="ti ti-file-filled"></i>
          </div>
          <p class="main__file-info__header__title">file.txt</p>
        </div>

        <div class="main__file-info__content">

          <div class="main__file-info__content__title">
            <div class="main__file-info__content__title__icon">
              <i class="ti ti-file-filled"></i>
            </div>
            <input type="text" name="" id="" class="main__file-info__content__title__name" placeholder="file.txt">
          </div>

          <hr class="main__file-info__content__line">

          <div class="main__file-info__content__section type">
            <p class="main__file-info__content__section__label">Type:</p>
            <p class="main__file-info__content__section__value">text/html</p>
          </div>

          <div class="main__file-info__content__section format">
            <p class="main__file-info__content__section__label">Format:</p>
            <p class="main__file-info__content__section__value">.txt</p>
          </div>

          <hr class="main__file-info__content__line">

          <div class="main__file-info__content__section parent">
            <p class="main__file-info__content__section__label">Parent:</p>
            <p class="main__file-info__content__section__value">Usuario</p>
          </div>

          <div class="main__file-info__content__section path">
            <p class="main__file-info__content__section__label">Path:</p>
            <p class="main__file-info__content__section__value">C:/Usuario/file.txt</p>
          </div>

          <div class="main__file-info__content__section size">
            <p class="main__file-info__content__section__label">Size:</p>
            <p class="main__file-info__content__section__value">345 MB</p>
          </div>

          <hr class="main__file-info__content__line">

          <div class="main__file-info__content__section created">
            <p class="main__file-info__content__section__label">Created:</p>
            <p class="main__file-info__content__section__value">martes, 24 febrero 2024, 8:32:23 pm</p>
          </div>

          <div class="main__file-info__content__section changed">
            <p class="main__file-info__content__section__label">Changed:</p>
            <p class="main__file-info__content__section__value">jueves, 4 maro 2024, 8:32:23 pm</p>
          </div>

          <div class="main__file-info__content__section opened">
            <p class="main__file-info__content__section__label">Opened:</p>
            <p class="main__file-info__content__section__value">lunes, 27 junio 2024, 8:32:23 pm</p>
          </div>

          <hr class="main__file-info__content__line">

          <div class="main__file-info__content__actions">
            <button class="main__file-info__content__actions__read-btn info-btn">READ</button>
            <button class="main__file-info__content__actions__edit-btn info-btn">EDIT</button> 
            <button class="main__file-info__content__actions__save-btn info-btn">SAVE</button> 
          </div>

        </div>
      </div>`;


createTemplate($template, { id: "template-file-info-panel" });

export class FileInfoPanel {
  #state = { mode: "close" };

  constructor({ $parent }) {
    this.$parent = $parent;
  }


  assign() {
    this.$DOM = document.getElementById(this.id);

    this.readBtn = document.querySelector('.main__file-info__content__actions__read-btn');
    this.editBtn = document.querySelector('.main__file-info__content__actions__edit-btn');
    this.saveBtn = document.querySelector('.main__file-info__content__actions__save-btn');
  }



  selectTemplateElements($template) {
    const $headerIcon = $template.querySelector(".main__file-info__header__icon .ti");
    const $headerTitle = $template.querySelector('.main__file-info__header__title');
    const $icon = $template.querySelector('.main__file-info__content__title__icon .ti');

    const $inputName = $template.querySelector('.main__file-info__content__title__name');
    const $typeText = $template.querySelector(
      ".main__file-info__content__section.type .main__file-info__content__section__value"
    );

    const $formatText = $template.querySelector(
      ".main__file-info__content__section.format .main__file-info__content__section__value"
    );

    const $parentText = $template.querySelector(
      ".main__file-info__content__section.parent .main__file-info__content__section__value"
    );

    const $pathText = $template.querySelector(
      ".main__file-info__content__section.path .main__file-info__content__section__value"
    );

    const $sizeText = $template.querySelector(
      ".main__file-info__content__section.size .main__file-info__content__section__value"
    );

    const $createdText = $template.querySelector(
      ".main__file-info__content__section.created .main__file-info__content__section__value"
    );

    const $changedText = $template.querySelector(
      ".main__file-info__content__section.changed .main__file-info__content__section__value"
    );

    const $openedText = $template.querySelector(
      ".main__file-info__content__section.opened .main__file-info__content__section__value"
    );

    return {
      $headerIcon,
      $headerTitle,
      $icon,
      $inputName,
      $typeText, 
      $formatText,
      $parentText, 
      $pathText,
      $sizeText,
      $createdText,
      $changedText,
      $openedText
    }
  }




  async render(fileId) {
    try {
      let $template = document.getElementById("template-file-info-panel").content;

      let { name, path, parent, history, type, format, size } = await Controller.getFile(parseInt(fileId));
      const { created, changed, opened } = history;

      const {
        $headerIcon,
        $headerTitle,
        $icon,
        $inputName,
        $typeText,
        $formatText,
        $parentText,
        $pathText,
        $sizeText,
        $createdText,
        $changedText,
        $openedText
      } = this.selectTemplateElements($template);
      


      this.name = name;
      this.id = `file-info-${fileId}`;
      
      if (format && fileTypesIcons.hasOwnProperty(format.slice(1))) format = format.slice(1);
      else format = "txt";

      const iconClass = fileTypesIcons[format].join(' ');
      $headerIcon.className = iconClass;
      $icon.className = iconClass;


      $headerTitle.textContent = name;
      $inputName.value = name;
      $typeText.textContent = type;
      $formatText.textContent = format;
      $parentText.textContent = parent;
      $pathText.textContent = path.join('/');
      $sizeText.textContent = size;
      $createdText.textContent = CleanDate.largeFormat(created);
      $changedText.textContent = CleanDate.largeFormat(changed);
      $openedText.textContent = CleanDate.largeFormat(opened);

      let $clone = document.importNode($template, true);
      $clone.querySelector(".main__file-info").setAttribute('id', this.id);

      insertDOM(this.$parent, $clone);
      this.#state.mode = "open";

      this.assign();
      this.events();
    } catch (err) {
      console.error(err);
    }
  }

  events() {
    
    
    const exit = (e) => {
      if (!e.target.closest(".main__file-info") && this.#state.mode == "open") {
        this.$DOM.remove();
        this.#state.mode = "close";
        document.removeEventListener("click", exit);
      }

      return;
    }

    document.addEventListener("click", exit);

    
  }
}
