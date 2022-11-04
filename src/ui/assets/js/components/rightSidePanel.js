import { state, panelState } from "app"

export default {
  setup(props, { attrs, emit, expose, slots }) {
    return {
      panelState,
      state,
    }
  },
  template: `
    <div v-show="panelState.openSidePanel" class="fixed bottom-0 flex flex-col max-w-full bg-white bg-clip-padding shadow-sm outline-none transition duration-500 ease-in-out text-gray-700 top-0 right-0 border-none w-96" tabindex="-1">
    <div class="bg-gray-200 flex items-center justify-between p-4">
      <h5 class="mb-0 leading-normal font-semibold">
        List of CCXT supported exchanges
      </h5>
      <button @click="panelState.openSidePanel = false" type="button" class="btn-close box-content text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline" aria-label="Close">
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="flex justify-center flex-grow p-4 overflow-y-auto">
      <div class="bg-white rounded-lg border border-gray-200 text-gray-900">
        <button
          v-for="item in state.ccxt?.exchanges"
          disabled=""
          class="
            text-left
            px-6
            py-2
            border-gray-200
            w-full
            rounded-b-lg
            focus:outline-none focus:ring-0
            text-gray-400
            cursor-default
          "
          type="button"
        >
          {{ item }}
        </button>
      </div>
    </div>
  </div>
  `
}
