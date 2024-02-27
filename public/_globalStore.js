import { computed, ref } from 'vue';

import { micropageList } from './_micropageList.js';

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
