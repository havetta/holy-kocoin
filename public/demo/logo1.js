
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import { fetchJson, func } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';
export default {
  template: `

  <div class="container mx-auto px-4 py-8">

    <h1 class="text-3xl font-bold text-center mb-8">DATA from MXP</h1>

    <ul class="list-disc space-y-2">

      <li v-for="item in globalVars.hot_topic_v2">{{item.description}}</li>
    </ul>

  </div>
  `,

//! /////////////////////////////////////////////////////////

  setup(props, { attrs, emit, expose, slots }) {

    const localVars = reactive({});

    return {
      ...globalStore,
      globalVars,
      localVars,



    };
  },
  mounted() {
    if (this.mounted) this.mounted(this);
  },
}
