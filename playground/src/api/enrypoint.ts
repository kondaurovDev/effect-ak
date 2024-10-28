export const htmlPage = (
  componentPath: string
) =>
  `
  <!DOCTYPE html>
  <html lang="ru">
  <head>
    <meta charset="UTF-8">
    <title>Effect-ak playground</title>
    <link href="./vendor/css/vuetify:dist:vuetify.min" rel="stylesheet">
  </head>
  <body>
  <script type="importmap">
    {
      "imports": {
        "vue": "./vendor/js/vue:dist:vue.esm-browser",
        "vuetify": "./vendor/js/vuetify:dist:vuetify.esm"
      }
    }
  </script>
    <div id="app"></div>

    <script type="module">
      import { createApp } from "vue";
      import { createVuetify } from "vuetify";

      const vuetify = createVuetify();
          
      import App2 from './js/${componentPath}';

      createApp(App2).use(vuetify).mount('#app');
    </script>
  </body>
  </html>
`