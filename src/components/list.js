import state from "../datatypes/state.js";

export default {
  setup(props, { attrs, emit, expose, slots }) {

    return {
      state,
      addnew: () => {
        state.value.list.push({
          id: crypto.randomUUID(),
          name: "Change.This.Name",
        });
      },
    };
  },
  template: `
  <select v-model="state.selectedId" class="select select-bordered w-full max-w-xs">
    <option v-for="item in state.list" :key="item.id" :value="item.id">{{ item.name }}</option>
  </select>

  <button @click="addnew" class="btn btn-primary">Add</button>
  <button @click="addnew" class="buton">Add New</button>
  <ul>
    <li v-for="item in state.list">{{ item.name }}</li>
  </ul>
  `,
};