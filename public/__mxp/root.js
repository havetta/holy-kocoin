export default {
  template: `
<div class="relative min-h-screen lg:flex">

  <sidebar/>

  <main id="content" class="flex-1 pb-12 space-y-6 overflow-y-auto lg:h-screen md:space-y-8">

    <section class="grid grid-cols-1 gap-8 px-6 xl:grid-cols-3 2xl:grid-cols-4 md:grid-cols-2">

      <list class=""/>

      <detail class="border border-gray-200 dark:border-gray-700 md:rounded-lg shadow-lg shadow-r-5"/>

      <preview class="md:col-span-2 md:row-span-2 gap-x-8"/>

    </section>

  </main>
</div>
`}
