<template>
  <v-overlay v-if="message">
    <v-alert type="error">{{ message }}</v-alert>
  </v-overlay>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class ErrorMessage extends Vue {
  message = "";

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => (this.message = ""), 3000);
  }

  created() {
    this.$eventBus.$on("show-error-message", (data: string) => {
      this.showMessage(data);
    });
  }

  beforeDestroy() {
    this.$eventBus.$off("show-error-message");
  }
}
</script>
