import { ref } from "vue";

export default {
  setup(props, { attrs, emit, expose, slots }) {
    const state = ref({
      count: 0
    })

    const groceryList = ref([
      { id: 0, text: 'Vegetables' },
      { id: 1, text: 'Cheese' },
      { id: 2, text: 'Whatever else humans are supposed to eat' }
    ])

    const additup = () => {
      state.value.count++
      groceryList.value.push({
        id: Math.floor(Math.random() * 100),
        text: new Date().toLocaleString(),
      })
    }

    return {
      additup,
      groceryList,
      state,
    }
  },
  mounted() {
    console.log(`mybutton mounted`)
  },
  template: `
  <button @click="additup()" class="bg-blue-400 text-white rounded-full m-8 p-2 text-xl">
    Add item {{ state.count }}
  </button>

  <ul>
    <li
      v-for="item in groceryList"
      :id="item"
      >{{ item.id }}</li>
  </ul>
  `
}
