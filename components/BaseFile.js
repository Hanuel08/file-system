import { fileTypesIcons } from "../utils/fileTypesIcons.js";


class BaseFile {
  
  static render() {
    
  }
}



const createDOMFile = (file) => {
  const $template = document.getElementById("template-file").content;

  let { name, date, id, type } = file;

  $template.querySelector(".main__content__file").setAttribute("id", id);
  $template.querySelector(".main__content__file__info__name").textContent =
    name;
  $template.querySelector(
    ".main__content__file__info__specifications__type"
  ).textContent = type;
  $template.querySelector(
    ".main__content__file__info__specifications__date"
  ).textContent = date;

  let $clone;
  if (!type || type != "folder") {
    let { format, size } = file;

    $template.querySelector(
      ".main__content__file__info__specifications__size"
    ).textContent = size;

    $clone = document.importNode($template, true);
    $clone
      .querySelector(".main__content__file")
      .setAttribute("data-type", "file");

    let extname = format.slice(1);

    if (!fileTypesIcons[extname]) {
      $clone
        .querySelector(".main__content__file__icon i")
        .classList.add(...fileTypesIcons["txt"]);
    } else {
      $clone
        .querySelector(".main__content__file__icon i")
        .classList.add(...fileTypesIcons[extname]);
    }
  } else {
    $clone = document.importNode($template, true);
    $clone
      .querySelector(".main__content__file")
      .setAttribute("data-type", type);
    $clone
      .querySelector(".main__content__file__icon i")
      .classList.add("ti", "ti-folder-filled");
  }
  return $clone;
};


export { BaseFile }