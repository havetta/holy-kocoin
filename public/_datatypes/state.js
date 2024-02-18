import { ref } from "vue";

export default ref({
  list: [
    {id: 1, name: `test`, texthtml: `<component :is="logo"></component>`, textscript: `setup() { return { clickme: () => { console.log('clickme', "quote")}, }; },`},
    {id: 2, name: 'logo', texthtml: '<logo />', textscript: `setup() { return { clickme: () => { console.log('clickme')}, }; },`},
    {id: 3, name: 'test2', texthtml: '<flowbite />', textscript: `setup() { return { clickme: () => { console.log('clickme')}, }; },`},
  ],
  selectedId: 1,
})
