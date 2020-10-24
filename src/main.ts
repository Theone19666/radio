import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Object.defineProperty(Vue.prototype, "$eventBus", {
  get: function() {
    return this.$root.bus;
  }
});

new Vue({
  data: {
    bus: new Vue({})
  },
  vuetify,
  render: h => h(App)
}).$mount("#app");
