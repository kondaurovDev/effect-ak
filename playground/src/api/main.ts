import { HttpApi, HttpApiBuilder, FileSystem, Path, HttpApiGroup } from "@effect/platform";
import { Effect, Layer, pipe } from "effect";

import { VoiceApi } from "./voice-api.js";

const htmlPage =
  `
  <!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Vue Приложение</title>
  <!-- Опционально: Стили или другие мета-теги -->
</head>
<body>
  <!-- Место для монтирования Vue-приложения -->
  <div id="app"></div>

  <!-- Подключение Vue и компонента через модульные скрипты -->
  <script type="module">
    // Импортируйте функцию создания приложения из Vue
    import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
    
    // Импортируйте ваш скомпилированный компонент
    import App2 from './out/res.js';

    // Создайте и смонтируйте Vue-приложение
    createApp(App2).mount('#app');
  </script>
</body>
</html>
`

export class BackendApi
  extends HttpApi.empty.add(VoiceApi) {

  static live =
    HttpApiBuilder.api(BackendApi)
      .pipe(
        Layer.provide(
          HttpApiBuilder.group(BackendApi, "voiceApi", handlers =>
            handlers
              .handle("transcribeHtmlPage", () =>
                Effect.succeed(htmlPage)
              )
              .handle("vueComponent", () =>
                Effect.tryPromise(() => fs)
                Effect.succeed(htmlPage)
              )
              .handle("echo", () => Effect.succeed("echo :)"))
              .handle("root", () => Effect.succeed(1))
          )
        )
      )
}
