import { ref } from "vue";

export default {
  setup(props, { attrs, emit, expose, slots }) {
    const state = ref({
      count: 0
    })

    const additup = () => {
      state.value.count++
    }

    return {
      additup,
      state,
    }
  },
  mounted() {
    console.log(`mounted`)
  },
  template: `
    <button @click="additup()" class="bg-yellow-400 rounded-full p-2 text-xl">
      Buy Amount {{ state.count }}
    </button>
  `
}
