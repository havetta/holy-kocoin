import { ref } from "vue";
import state from "../datatypes/state.js"

export default {
  setup(props, { attrs, emit, expose, slots }) {
    return {
      state,
    }
  },
  template: `
  <div>
    <form>
      <input :value="state.list.find(i => i?.id === state.selectedId)?.name" placeholder="Name" />
      <textarea :value="state.list.find(i => i?.id === state.selectedId)?.description" placeholder="Description"></textarea>
    </form>

<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded">
  Button
</button>

<button class="btn btn-blue">
  Button
</button>
  </div>
  `
}
