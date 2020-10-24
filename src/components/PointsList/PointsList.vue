<template>
  <v-list>
    <v-list-item v-for="(point, index) of points" :key="index">
      <v-list-item-content>
        <v-list-item-title
          >Точка {{ index + 1 }}: x: {{ point.x }}, y:
          {{ point.y }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Point } from "../../interfaces";
@Component
export default class PointsList extends Vue {
  points: Point[] = [];
  $eventBus!: Vue;
  created() {
    this.$eventBus.$on("get-points", (data: Point[]) => {
      this.points = data;
    });
  }

  beforeDestroy() {
    this.$eventBus.$off("get-points");
  }
}
</script>
