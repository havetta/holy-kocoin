import { ref } from "vue";

export default ref({
  list: [
    {id: 1, name: 'test', template: '<component :is="logo"></component>'},
    {id: 2, name: 'logo', template: '<logo />'},
    {id: 3, name: 'test2', template: '<flowbite />'}
  ],
  selectedId: 1,
})
