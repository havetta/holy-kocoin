import listPagesAdd from "./listPagesAdd.js";
import home from "./home.js";
import editform from "./editform.js";
import list from "./list.js";
import listSectionAdd from "./listSectionAdd.js";
import listPages from "./listPages.js";
import listSections from "./listSections.js";
import preview from "./preview.js";
import sidebar from "./sidebar.js";

export default [
  { name: "listPagesAdd", instance: listPagesAdd }, 
  { name: "home", instance: home }, 
  { name: "editform", instance: editform }, 
  { name: "list", instance: list }, 
  { name: "listSectionAdd", instance: listSectionAdd }, 
  { name: "listPages", instance: listPages }, 
  { name: "listSections", instance: listSections }, 
  { name: "preview", instance: preview }, 
  { name: "sidebar", instance: sidebar }
];