export const insertDOM = ($parent, $element) => {
  let fragment = document.createDocumentFragment();
  fragment.appendChild($element);
  $parent.appendChild(fragment);
};
