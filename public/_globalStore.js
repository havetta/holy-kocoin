import { computed, ref } from 'vue';

import _micropageList from './_micropageList.js';

export const micropageList = _micropageList;

export const selectedPgName = ref('');

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
