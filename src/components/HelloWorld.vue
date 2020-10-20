<template>
  <div class="hello">
    <h1>Inference</h1>
    <img src="@/assets/flower5.jpg" ref="img1" @load="getImage" />
  </div>
</template>

<script>
import * as tf from "@tensorflow/tfjs";
/*const CLASS_NAMES = [
  "semi-soft",
  "blue",
  "washed-rind",
  "hard",
  "bloomy",
  "fresh"
];*/
//
const CLASS_NAMES = ["yax", "muyal", "nah"];

const MODEL_URL = "/models/glyphs/model.json";
export default {
  name: "HelloWorld",
  methods: {
    getImage() {
      //step 1, get the image
      const image1 = this.$refs.img1;

      let tensor = tf.browser
        .fromPixels(image1, 3)
        .resizeNearestNeighbor([150, 150]) // be sure to change the image size
        .expandDims()
        .toFloat()
        .reverse(-1);
      this.loadModel(tensor);
    },
    async loadModel(tensor) {
      //step 2, load model, start inference
      let model = await tf.loadLayersModel(MODEL_URL);
      this.startInference(tensor, model);
    },
    async startInference(tensor, model) {
      //step 3, inference
      let prediction = await model.predict(tensor).data();
      console.log("prediction", prediction);
      //bug: probability is always '1'?
      let classification = Array.from(prediction)
        .map(function (p, i) {
          return {
            probability: p,
            className: CLASS_NAMES[i],
          };
        })
        .sort(function (a, b) {
          return b.probability - a.probability;
        })
        .slice(0, 1);
      this.showPrediction(classification);
    },
    showPrediction(classification) {
      //step 4 - classify
      console.log(classification);
      classification.forEach(function (p) {
        console.log("probability", p);
      });
    },
  },
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
