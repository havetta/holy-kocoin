import { ref } from "vue";

export default {
  setup(props, { attrs, emit, expose, slots }) {


    const list = ref([
      { id: 0, text: 'Vegetables' },
      { id: 1, text: 'Cheese' },
      { id: 2, text: 'Whatever else humans are supposed to eat' }
    ])
    
    return {
      groceryList,
    }
  },
  template: `
  <ul>
    <li
      v-for="item in list"
      :id="item"
      >{{ item.id }}</li>
  </ul>
  `
}
