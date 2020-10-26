<template>
  <v-btn @click="onClick" class="primary v-btn--block">Нарисовать точки</v-btn>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Button extends Vue {
  $eventBus!: Vue;
  onClick() {
    this.$eventBus.$emit("draw-points");
  }
}
</script>
