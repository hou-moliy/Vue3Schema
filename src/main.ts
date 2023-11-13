import { createApp } from "vue";
import router from "./router";
import App from "./App";
import "reset-css";
import draggable from "vuedraggable";
// 注册全局组件
const app = createApp(App);
app.component("vue-draggable", draggable);
app.use(router).mount("#app");
