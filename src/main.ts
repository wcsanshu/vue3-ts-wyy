import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

// 引入全局样式文件
import "./assets/scss/index.scss"
import "normalize.css"
import { Lazyload, Skeleton } from "vant"
import "animate.css"
import loadingDirective from "./components/Vloading/directive"
import noResultDirective from "./components/no-result/directive"
import { setupStore } from "@/store/index"

const app = createApp(App)
setupStore(app)
app
  .use(router)
  .use(Lazyload)
  .use(Skeleton)

  .directive("loading", loadingDirective)
  .directive("no-result", noResultDirective)
  .mount("#app")
