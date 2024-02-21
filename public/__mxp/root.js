export default {
  template: `
<div class="relative min-h-screen lg:flex">

  <sidebar/>

  <main id="content" class="flex-1 pb-12 space-y-6 overflow-y-auto lg:h-screen md:space-y-8">

    <section class="grid grid-cols-1 gap-8 gap-y-2 px-6 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 md:grid-cols-3">

      <list class="col-span-1"/>

      <detail class="col-span-2 border border-gray-200 dark:border-gray-700 md:rounded-lg shadow-lg shadow-r-5"/>

      <preview class="xl:col-span-2 lg:col-span-3 md:col-span-3 md:row-span-2 gap-x-8"/>

    </section>

  </main>
</div>
`}
