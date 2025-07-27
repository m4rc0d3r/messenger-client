import { defineStore } from "pinia";
import { ref } from "vue";

import type { Config } from "./config";
import { NodeEnv } from "./config";

const useConfigStore = defineStore("config", () => {
  const config = ref<Config>({
    nodeEnv: NodeEnv.dev,
    serverApp: {
      httpUrl: "",
      websocketUrl: "",
    },
  });

  function setConfig(value: Config) {
    config.value = value;
  }

  return {
    config,
    setConfig,
  };
});

export { useConfigStore };
