import{D as s,o as d,j as i,B as t,E as o,G as n,e}from"./index-5d4b1b48.js";const r={},p=a=>(o("data-v-e4f64ad9"),a=a(),n(),a),l={class:"card"},c=t('<h3 data-v-e4f64ad9>Documentation</h3><p class="bg-primary border-round p-3" data-v-e4f64ad9>This page covers the Vite version, for Nuxt 3 visit the <a href="https://github.com/primefaces/sakai-nuxt" class="font-bold bg-primary hover:underline" data-v-e4f64ad9>sakai-nuxt</a> repository instead.</p><h5 data-v-e4f64ad9>Getting Started</h5><p data-v-e4f64ad9> Sakai is an application template for Vue based on the <a href="https://github.com/vuejs/create-vue" class="font-medium text-primary hover:underline" data-v-e4f64ad9>create-vue</a>, the recommended way to start a <strong data-v-e4f64ad9>Vite-powered</strong> Vue projects. To get started, clone the <a href="https://github.com/primefaces/sakai-vue" class="font-medium text-primary hover:underline" data-v-e4f64ad9>repository</a> from GitHub and install the dependencies with npm or yarn. </p><pre class="app-code" data-v-e4f64ad9><code data-v-e4f64ad9> npm install </code></pre><p data-v-e4f64ad9>or</p><pre class="app-code" data-v-e4f64ad9><code data-v-e4f64ad9> yarn </code></pre><p data-v-e4f64ad9>Next step is running the application using the serve script and navigate to <i data-v-e4f64ad9>http://localhost:5173/</i> to view the application. That is it, you may now start with the development of your application using the Sakai template.</p><pre class="app-code" data-v-e4f64ad9><code data-v-e4f64ad9> npm run dev </code></pre><h5 data-v-e4f64ad9>Structure</h5><p data-v-e4f64ad9>Sakai consists of a couple folders, demos and layout have been separated so that you can easily remove what is not necessary for your application.</p><ul class="line-height-3" data-v-e4f64ad9><li data-v-e4f64ad9><span class="text-primary font-medium" data-v-e4f64ad9>src/layout</span>: Main layout files, needs to be present</li><li data-v-e4f64ad9><span class="text-primary font-medium" data-v-e4f64ad9>src/views</span>: Demo pages</li><li data-v-e4f64ad9><span class="text-primary font-medium" data-v-e4f64ad9>public/demo</span>: Assets used in demos</li><li data-v-e4f64ad9><span class="text-primary font-medium" data-v-e4f64ad9>public/layout</span>: Assets used in layout</li><li data-v-e4f64ad9><span class="text-primary font-medium" data-v-e4f64ad9>src/assets/demo</span>: Styles used in demos</li><li data-v-e4f64ad9><span class="text-primary font-medium" data-v-e4f64ad9>src/assets/layout</span>: SCSS files of the main layout</li></ul><h5 data-v-e4f64ad9>Menu</h5><p data-v-e4f64ad9>Main menu is defined at <span class="text-primary font-medium" data-v-e4f64ad9>src/layout/AppMenu.vue</span> file.</p><h5 data-v-e4f64ad9>Integration with Existing Vite Applications</h5><p data-v-e4f64ad9>Only the folders that are related to the layout needs to move in to your project. We&#39;ve created a short tutorial with details.</p>',16),f=p(()=>e("div",{class:"video-container"},[e("iframe",{className:"video",width:"560",height:"315",src:"https://www.youtube.com/embed/AHeSjJFR3ZE",frameborder:"0",allowfullscreen:""})],-1)),u=t(`<h5 data-v-e4f64ad9>PrimeVue Theme</h5><p data-v-e4f64ad9>Sakai theming is based on the PrimeVue theme being used. Default theme is <b data-v-e4f64ad9>lara-light-indigo</b>.</p><h5 data-v-e4f64ad9>SASS Variables</h5><p data-v-e4f64ad9>In case you&#39;d like to customize the main layout variables, open <b data-v-e4f64ad9>_variables.scss</b> file under src/layout folder. Saving the changes will be reflected instantly at your browser.</p><h6 data-v-e4f64ad9>src/layout/_variables.scss</h6><pre class="app-code" data-v-e4f64ad9>            /* General */
            <br data-v-e4f64ad9>
            $scale:14px; /* main font size */
            <br data-v-e4f64ad9>
            $borderRadius:12px; /* border radius of layout element e.g. card, sidebar */
            <br data-v-e4f64ad9>
            $transitionDuration:.2s; /* transition duration of layout elements e.g. sidebar, overlay menus */
        </pre>`,6),v=[c,f,u];function h(a,m){return d(),i("div",l,v)}const b=s(r,[["render",h],["__scopeId","data-v-e4f64ad9"]]);export{b as default};
