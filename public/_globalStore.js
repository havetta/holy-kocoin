import { computed, ref } from 'vue';

import _micropageList from './_micropageList.js';

const micropageList = _micropageList;

const selectedPgName = ref('');

export const globalStore = {
  micropageList,
  selectedPgName,
  currentList: computed(
    () =>
      micropageList?.value?.find(
        (i) => i?.shortpgname === selectedPgName?.value,
      )?.componentList,
  ),
};
