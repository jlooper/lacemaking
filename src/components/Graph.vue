<template>
  <div class="hello">
    <h1>Inference</h1>
    <img src="@/assets/cheese6.jpg" ref="img1" @load="getImage" />
    <div>
      <h2 v-if="prediction != ''">Prediction: {{ prediction }}</h2>
    </div>
  </div>
</template>

<script>
import * as tf from "@tensorflow/tfjs";
import sig from "@/assets/signature.json";
const MODEL_URL = "/models/cheese/model.json";

export default {
  name: "HelloWorld",
  data() {
    return {
      prediction: "",
      model: "",
      outputKey: "Labels",
      classes: sig.classes.Label,
      shape: sig.inputs.Image.shape.slice(1, 3),
      inputName: sig.inputs.Image.name,
    };
  },
  methods: {
    getImage() {
      //step 1, get the image
      const image = this.$refs.img1;
      let imageTensor = tf.browser.fromPixels(image, 3);
      //todo crop image
      this.loadModel(imageTensor);
    },
    async loadModel(imageTensor) {
      //step 2, load model, start inference
      this.model = await tf.loadGraphModel(MODEL_URL);
      this.predict(imageTensor);
    },

    dispose() {
      if (this.model) {
        this.model.dispose();
      }
    },

    predict(image) {
      if (this.model) {
        const [imgHeight, imgWidth] = image.shape.slice(0, 2);
        // convert image to 0-1
        const normalizedImage = tf.div(image, tf.scalar(255));
        let norm = normalizedImage.reshape([1, ...normalizedImage.shape]);
        //const reshapedImage = tf.tensor4d(norm, "float32");
        const reshapedImage = norm;
        // center crop and resize
        let top = 0;
        let left = 0;
        let bottom = 1;
        let right = 1;
        if (imgHeight != imgWidth) {
          const size = Math.min(imgHeight, imgWidth);
          left = (imgWidth - size) / 2 / imgWidth;
          top = (imgHeight - size) / 2 / imgHeight;
          right = (imgWidth + size) / 2 / imgWidth;
          bottom = (imgHeight + size) / 2 / imgHeight;
        }
        const croppedImage = tf.image.cropAndResize(
          reshapedImage,
          [[top, left, bottom, right]],
          [0],
          [this.shape[0], this.shape[1]]
        );
        const results = this.model.execute(
          { [this.inputName]: croppedImage },
          sig.outputs[this.outputKey].name
        );
        const resultsArray = results.dataSync();
        this.showPrediction(resultsArray);
      } else {
        console.error("Model not loaded, please await this.load() first.");
      }
    },
    showPrediction(classification) {
      //step 4 - classify
      console.log(classification);
      for (var i = 0; i < classification.length; i++) {
        if (classification[i] == 1) {
          this.prediction = this.classes[i];
        }
      }
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
