import __mxp from './__mxp/_componentList.js';
import test from './test/_componentList.js';
import { ref } from 'vue';

// import AccountInfo from './AccountInfo/_componentList.js';
// import AccountInfoDetail from './AccountInfoDetail/_componentList.js';

export const micropageList = ref(
  //||
  [
    {
      shortpgname: '__mxp', componentList: __mxp,
    },
    {
      shortpgname: 'test', componentList: test,
    },
  ],
  //||
);
