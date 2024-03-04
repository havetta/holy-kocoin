import { computed, reactive, ref } from 'vue';

import { pageList } from './_pageList.js';

export const globalVars = reactive({
  currSectionId: 0,
});

const currPgName = ref('');

export const globalStore = {
  pageList,
  currPgName,
  currentSectionList: computed(
    () =>
      pageList?.value?.find(
        (i) => i?.shortpgname === currPgName?.value,
      )?.sectionList,
  ),
};
