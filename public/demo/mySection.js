
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import { fetchJson, func } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';
export default {
  template: `
<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">Workforce Software Solutions</h1>
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-gray-100 p-4 rounded shadow-md">
        <h2 class="text-xl font-bold mb-2">Human Resources</h2>
        <ul class="list-disc space-y-2">
          <li>SAP Absence and Leave Management</li>
        </ul>
      </div>
      <div class="bg-gray-100 p-4 rounded shadow-md">
        <h2 class="text-xl font-bold mb-2">Workforce Management</h2>
        <ul class="list-disc space-y-2">
          <li>SAP Workforce Forecasting and Scheduling</li>
          <li>SAP Time Attendance Management</li>
        </ul>
      </div>
      <div class="bg-gray-100 p-4 rounded shadow-md">
        <h2 class="text-xl font-bold mb-2">Talent Management</h2>
        <ul class="list-disc space-y-2">
          <li>Text Recruiting Automation and Conversational AI (Paradox)</li>
          <li>Beamery Talent Lifecycle Management</li>
        </ul>
      </div>
      <div class="bg-gray-100 p-4 rounded shadow-md">
        <h2 class="text-xl font-bold mb-2">Other Solutions</h2>
        <ul class="list-disc space-y-2">
          <li>Axonify - Driving frontline performance</li>
          <li>ATOSS Staff inefficiency Suite</li>
        </ul>
      </div>
    </div>
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
