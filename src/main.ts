import { createApp } from "vue";
import router from "./router";
import App from "./App";
console.log(App);
createApp(App).use(router).mount("#app");
