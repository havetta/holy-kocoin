import { shallowRef, watch} from "vue";
import state from "../datatypes/state.js"
import { post } from "../js/common/shared.js";

export default {
  setup(props, { attrs, emit, expose, slots }) {
    const instance = shallowRef({template:'<span></span>'});

    watch(() => state, async (old, cur) => {
      const componentName = state.value.list.find(i => i?.id === state.value?.selectedId)?.name;
      try {
        instance.value = (await import(`../components/${componentName}.js?t=${Date.now()}`)).default;
      } catch(e) {
        instance.value = (await import(`../components/${componentName}.js`)).default;
      }
    }, { deep: true });

    return {
      state,
      instance,
      del: () => {},
      save: () => {
        console.log(state?.value?.list?.find(i => i?.id === state?.value?.selectedId));
        post({
          id: crypto.randomUUID(),
          name: "Change.This.Name",
          html: state?.value?.list?.find(i => i?.id === state?.value?.selectedId)?.html
        });
      },
    }
  },
  template: `
  <div>
    <form>
      <label for="name">Name</label>
      <input :value="state.list.find(i => i?.id === state.selectedId)?.name" placeholder="Name" type="text" />
      <textarea :value="state.list.find(i => i?.id === state.selectedId)?.texthtml" placeholder="Html"></textarea>
      <textarea :value="state.list.find(i => i?.id === state.selectedId)?.textscript" placeholder="Script"></textarea>
    </form>

    <button class="btn-blue" @click="save()">
      Save
    </button>

    <button class="btn-green" @click="del()">
      Delete
    </button>
  </div>
  `
}
