import { computed, reactive, ref, shallowRef } from "vue";
import { pageList } from "./_pageList.js";

const currPgName = ref("");

export const globalStore = {
  currPgName,
  pageList,
  currSectionList: computed(
    () =>
      pageList?.value?.find((i) => i?.shortpgname === currPgName?.value)
        ?.sectionList
  ),
};

export const globalVars = reactive({
  currSection: 0,
});
