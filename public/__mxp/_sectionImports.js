import editform from './editform.js';
import list from './list.js';
import listButtons from './listButtons.js';
import listPages from './listPages.js';
import listParts from './listParts.js';
import preview from './preview.js';
import home from './home.js';
import sidebar from './sidebar.js';
//||
export default [
  { name: 'editform', instance: editform },
  { name: 'listButtons', instance: listButtons },
  { name: 'listPages', instance: listPages },
  { name: 'listParts', instance: listParts },
  { name: 'list', instance: list },
  { name: 'preview', instance: preview },
  { name: 'home', instance: home },
  { name: 'sidebar', instance: sidebar },
];
