import "@/stylesheets/main.css";
import "@/stylesheets/reset.css";

import { createApp } from "vue";

import App from "@/App.vue";
import router from "@/router";
import { pinia } from "@/stores/pinia";
import { either } from "fp-ts";
import { createConfig, NodeEnv, useConfigStore } from "./config";

const eitherConfig = createConfig({
  ...import.meta.env,
  ...(import.meta.env.DEV && { NODE_ENV: NodeEnv.dev }),
  ...(import.meta.env.PROD && { NODE_ENV: NodeEnv.prod }),
});
if (either.isLeft(eitherConfig)) throw eitherConfig.left;

useConfigStore(pinia).setConfig(eitherConfig.right);

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount("#app");
