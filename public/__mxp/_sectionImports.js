import home from "./home.js";
import editform from "./editform.js";
import list from "./list.js";
import listDialogAdd from "./listDialogAdd.js";
import listPages from "./listPages.js";
import listSections from "./listSections.js";
import preview from "./preview.js";
import sidebar from "./sidebar.js";

export default [
  { name: "home", instance: home }, 
  { name: "editform", instance: editform }, 
  { name: "list", instance: list }, 
  { name: "listDialogAdd", instance: listDialogAdd }, 
  { name: "listPages", instance: listPages }, 
  { name: "listSections", instance: listSections }, 
  { name: "preview", instance: preview }, 
  { name: "sidebar", instance: sidebar }
];