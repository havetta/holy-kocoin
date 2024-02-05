import { ref } from "vue";

export default {
  setup(props, { attrs, emit, expose, slots }) {


    const list = ref([
      { id: 0, text: '123' },
      { id: 1, text: '435' },
      { id: 2, text: 'W5454' }
    ])
    
    return {
      list,
    }
  },
  template: `
  <ul>
    <li
      v-for="item in list"
      >{{ item.text }}</li>
  </ul>
  `
}
