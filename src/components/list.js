import state from "../datatypes/state.js"

export default {
  setup(props, { attrs, emit, expose, slots }) {
    return {
      state,
      addnew: () => {
        state.value.list.push({ id: crypto.randomUUID(), name: 'xxx', description: 'des dff <h1>fdsf</h1>' });
      },
    }
  },
  template: `
  <select v-model="state.selectedId">
    <option v-for="item in state.list" :key="item.id" :value="item.id">{{ item.name }}</option>
  </select>

  <button @click="addnew">Add New</button>
  <ul>
    <li v-for="item in state.list">{{ item.name }}</li>
  </ul>
  `
}
