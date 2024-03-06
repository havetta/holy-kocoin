import __mxp from './__mxp/_sectionList.js';
import test from './test/_sectionList.js';
import { ref } from 'vue';

export const pageList = ref([
  //||
  { shortpgname: 'test', sectionList:test},
  { shortpgname: '__mxp', sectionList:__mxp},
  //||
]);
