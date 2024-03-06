import home from "./home.js";
import editform from "./editform.js";
import list from "./list.js";
import listPagesAdd from "./listPagesAdd.js";
import listPages from "./listPages.js";
import listSectionAdd from "./listSectionAdd.js";
import listSections from "./listSections.js";
import preview from "./preview.js";
import sidebar from "./sidebar.js";

export default [
  { name: "home", instance: home }, 
  { name: "editform", instance: editform }, 
  { name: "list", instance: list }, 
  { name: "listPagesAdd", instance: listPagesAdd }, 
  { name: "listPages", instance: listPages }, 
  { name: "listSectionAdd", instance: listSectionAdd }, 
  { name: "listSections", instance: listSections }, 
  { name: "preview", instance: preview }, 
  { name: "sidebar", instance: sidebar }
];