import { shallowRef, watch} from "vue";
import state from "../_datatypes/state.js"
import { post } from "../_datatypes/shared.js";

export default {
  setup(props, { attrs, emit, expose, slots }) {
    return {
      state,
      del: () => {},
      save: () => {
        console.log(state?.value?.list?.find(i => i?.id === state?.value?.selectedId));
        post("/components/", {
          id: crypto.randomUUID(),
          acronym: "Change.This.Name",
          texthtml: state?.value?.list?.find(i => i?.id === state?.value?.selectedId)?.html
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
