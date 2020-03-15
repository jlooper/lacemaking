<template>
  <div class="hello">
    <h1>Inference</h1>
    <img src="@/assets/cat.jpg" ref="img1" @load="getImage" />
  </div>
</template>

<script>
import * as tf from "@tensorflow/tfjs";
const MODEL_URL = "/models/model.json";
const classNames = ["cat", "dog"];
export default {
  name: "HelloWorld",
  data() {
    return {
      model: MODEL_URL
    };
  },
  methods: {
    async loadModel(tensor) {
      let model = await tf.loadLayersModel(MODEL_URL);
      this.startInference(tensor, model);
    },
    showPrediction(top5) {
      top5.forEach(function(p) {
        console.log(p, p.className, p.probability);
      });
    },
    async startInference(tensor, model) {
      let predictions = await model.predict(tensor).data();
      console.log(predictions);
      let top5 = Array.from(predictions)
        .map(function(p, i) {
          return {
            probability: p,
            className: classNames[i] // we are selecting the value from the obj
          };
        })
        .sort(function(a, b) {
          return b.probability - a.probability;
        })
        .slice(0, 2);
      this.showPrediction(top5);
    },
    getImage() {
      const image1 = this.$refs.img1;

      let tensor = tf.browser
        .fromPixels(image1, 3)
        .resizeNearestNeighbor([160, 160]) // change the image size
        .expandDims()
        .toFloat()
        .reverse(-1); // RGB -> BGR*/

      this.loadModel(tensor);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
