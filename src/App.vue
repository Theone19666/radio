<template>
  <v-app>
    <v-main>
      <h2 class="pa-3 text-center">
        Определение местоположения радиприёмников и траектории движения
        радиопередачика
      </h2>
      <v-layout class="main-layout pa-3 align-center flex-column">
        <Figure />
        <v-flex class="column">
          <FileInput />
          <Button />
          <PointsList />
        </v-flex>
      </v-layout>
      <ErrorMessage />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FileInput from "./components/FileInput";
import Figure from "./components/Figure";
import Button from "./components/Button";
import PointsList from "./components/PointsList";
import ErrorMessage from "./components/ErrorMessage";

@Component({
  components: { FileInput, Figure, Button, PointsList, ErrorMessage }
})
export default class App extends Vue {}
</script>

<style lang="scss" scoped>
.column {
  @media all and (max-width: 993px), all and (min-width: 1500px) {
    width: 100%;
    max-width: 500px;
  }
}
</style>
