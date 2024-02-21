
export default { 
  template: `
<component :is="logo"></component>
  `,

//! /////////////////////////////////////////////////////////

  setup(props, { attrs, emit, expose, slots }) {
return { clickme: () => { console.log('clickme', "quote")}, };
  },
}