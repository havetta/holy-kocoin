
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import { fetchJson } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';
export default {
  template: `
<div class="flex flex-col min-h-screen">
  <div class="hero flex flex-col items-center justify-center bg-cover bg-no-repeat py-20">
    <h1 class="text-5xl font-bold text-center">Innovating AI Needs Focus</h1>
    <p class="text-xl text-center mt-4">
      "Business AI in Industries & CX uses computational and generative AI technologies 
      to solve customer specific business problems, leveraging data from across enterprise."
    </p>
    <a href="/?page=test2" class="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-8 inline-block">Get Started</a>
  </div>
  <div class="business-ai px-4 py-16 bg-gray-200">
    <h2 class="text-3xl font-bold text-center">Business AI in Industries & CX</h2>
    <p class="text-lg text-center my-4">
      It is offered as an embedded cloud native capability OR combined with partner 
      business themes, we support our customers embrace AI in a sustainable and value-focused way 
      to keep their edge as an intelligent enterprise.
    </p>
    <p class="text-center font-bold underline">Find the Current Industry-Powered AI Capabilities here</p>
  </div>
  <div class="ai-capabilities grid grid-cols-3 gap-4 px-4 py-8">
    <div class="ai-capability bg-white border rounded-md p-4 text-center">
      <h3 class="text-xl font-bold mb-2">Industry</h3>
      <p class="text-base">Messaging (short, medium)</p>
    </div>
    <div class="ai-capability bg-white border rounded-md p-4 text-center">
      <h3 class="text-xl font-bold mb-2">Product Marketing</h3>
      <p class="text-base">Why Differentiator</p>
    </div>
    <div class="ai-capability bg-white border rounded-md p-4 text-center">
      <h3 class="text-xl font-bold mb-2">Industry Solution Marketing</h3>
      <p class="text-base"></p>
    </div>
    <div class="ai-capability bg-white border rounded-md p-4 text-center">
      <h3 class="text-xl font-bold mb-2">LO Message</h3>
      <p class="text-base">Open: Description long</p>
    </div>
    <div class="ai-capability bg-white border rounded-md p-4 text-center">
      <h3 class="text-xl font-bold mb-2">L1 Message by Persona</h3>
      <p class="text-base">Open: Description (short, medium, long) (related to customer persona see next slide)</p>
    </div>
  </div>
</div>
  `,

//! /////////////////////////////////////////////////////////

  setup(props, { attrs, emit, expose, slots }) {

    return {
      ...globalStore,
      globalVars,

mycomponent: h("div", { class: "bg-red-200", innerHTML: "hello" }), //, slots.default({ text: name.value })),


    };
  },
  mounted() {
    if (this.mounted) this.mounted();
  },
}
