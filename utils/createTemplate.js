import { insertDOM } from "./insertDOM.js";

export const createTemplate = ($content, { id }) => {
  let $template = document.createElement("template");
  $template.setAttribute("id", id);
  $template.innerHTML = $content;
  insertDOM(document.querySelector("body"), $template);
};
