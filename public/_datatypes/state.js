import { ref } from "vue";

export default ref({
  list: [
    {id: 1, acronym: `test`, texthtml: `<component :is="logo"></component>`, textscript: `setup() { return { clickme: () => { console.log('clickme', "quote")}, }; },`},
    {id: 2, acronym: 'logo', texthtml: '<logo />', textscript: `setup() { return { clickme: () => { console.log('clickme')}, }; },`},
    {id: 3, acronym: 'test2', texthtml: '<flowbite />', textscript: `setup() { return { clickme: () => { console.log('clickme')}, }; },`},
  ],
  selectedId: 1,
})
