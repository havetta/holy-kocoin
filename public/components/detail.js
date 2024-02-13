import { ref, shallowRef, watch} from "vue";
import state from "../datatypes/state.js"
import components from "../datatypes/components.js"

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
      instance,
      state,
    }
  },
  template: `
  <div>
    <form>
      <label for="name">Name</label>
      <input :value="state.list.find(i => i?.id === state.selectedId)?.name" placeholder="Name" type="text" />
      <textarea :value="state.list.find(i => i?.id === state.selectedId)?.template" placeholder="Template"></textarea>
    </form>

    <component :is="instance"></component>

    <button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded">
      Blue
    </button>

    <button class="btn-green">
      Green
    </button>
  </div>
  `
}
