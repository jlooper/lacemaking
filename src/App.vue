<template>
  <div id="app">
    <LocalAPI />
  </div>
</template>

<script>
import LocalAPI from "./components/LocalAPI.vue";
export default {
  name: "App",
  components: {
    LocalAPI,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
