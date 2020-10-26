<template>
  <v-file-input
    class="file-input"
    placeholder="Выберите файл с данными"
    @change="onFileChange"
  ></v-file-input>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class FileInput extends Vue {
  $eventBus!: Vue;
  onFileChange(file: Blob) {
    if (!file) {
      this.$eventBus.$emit("data-received", "");
      return;
    }
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = () => {
      this.$eventBus.$emit("data-received", reader.result);
    };

    reader.onerror = () => {
      console.log(reader.error);
      this.$eventBus.$emit(
        "show-error-message",
        "Что-то не так с файлом, который вы выбрали"
      );
    };
  }
}
</script>
