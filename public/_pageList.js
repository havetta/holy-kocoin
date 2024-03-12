import demo from './demo/_sectionList.js';
import test from './test/_sectionList.js';
import __mxp from './__mxp/_sectionList.js';

import { ref } from 'vue';

export const pageList = ref([
//||
  { shortpgname: 'demo', sectionList: demo },
  { shortpgname: 'test', sectionList: test },
  { shortpgname: '__mxp', sectionList: __mxp },
//||
]);