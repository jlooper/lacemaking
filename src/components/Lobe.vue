<template>
  <div class="hello">
    <h1>Inference</h1>
    <img src="@/assets/cheese2.jpg" ref="img1" />
    <div>
      <button class="button" @click="getImage()">Infer</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  methods: {
    async getImage() {
      const image1 = this.$refs.img1;
      await axios({
        method: "post",
        url:
          "http://localhost:38100/predict/dfcf37f4-6d77-46c0-be7f-86dc9c45efd9",
        data: JSON.stringify({
          inputs: {
            Image: image1,
          },
        }),
      }).then(function (response) {
        console.log(response);
      });
    },
  },
  created() {},
};
</script>