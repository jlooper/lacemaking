<template>
  <div class="hello">
    <h1>Inference</h1>
    <img src="@/assets/cheese5.jpg" ref="img1" @load="getImage" />
    <div>
      <h2 v-if="prediction != ''">Prediction: {{ prediction }}</h2>
    </div>
  </div>
</template>

<script>
import * as tf from "@tensorflow/tfjs";
const CLASS_NAMES = [
  "bloomy",
  "blue",
  "fresh",
  "hard",
  "semi-soft",
  "washed-rind",
];

const MODEL_URL = "/models/cheese/model.json";

export default {
  name: "HelloWorld",
  data() {
    return {
      prediction: "",
    };
  },
  methods: {
    getImage() {
      //step 1, get the image
      const image1 = this.$refs.img1;

      let tensor = tf.browser
        .fromPixels(image1, 3)
        .resizeNearestNeighbor([224, 224]) // be sure to change the image size
        .expandDims()
        .toFloat()
        .reverse(-1);
      this.loadModel(tensor);
    },
    async loadModel(tensor) {
      //step 2, load model, start inference
      let model = await tf.loadGraphModel(MODEL_URL);
      this.startInference(tensor, model);
      console.log(tensor, model);
    },
    async startInference(tensor, model) {
      //step 3, inference
      let prediction = await model.predict(tensor).data();
      console.log("prediction", prediction);

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
      //console.log(classification);
      classification.forEach(function (p) {
        console.log(p);
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
