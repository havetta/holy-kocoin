import { computed, reactive, ref, shallowRef } from "vue";
import { pageList } from "./_pageList.js";

const currPgName = ref("");

export const globalStore = {
  pageList,
  currPgName,
  currSectionList: computed(
    () =>
      pageList?.value?.find((i) => i?.shortpgname === currPgName?.value)
        ?.sectionList
  ),
  previewComponent: shallowRef({ template: '<span/>' }),
};

export const globalVars = reactive({
  currSection: 0,
});
