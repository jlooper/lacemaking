<template>
  <div class="hello">
    <h1>Inference</h1>
    <img :src="preview" ref="img1" @load="getImage"/>
     <div class="my-8">
      <image-uploader
        :preview="false"
        :className="['fileinput', { 'fileinput--loaded': hasImage }]"
        capture="environment"
        :debug="1"
        doNotResize="gif,jpg,jpeg,png"
        :autoRotate="true"
        outputFormat="string"
        @input="setImage"
        
      >
        <label for="fileInput" slot="upload-label">
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
            >
              <path
                class="path1"
                d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"
              ></path>
            </svg>
          </figure>
          <span class="upload-caption">{{
            hasImage ? "Replace" : "Click to upload"
          }}</span>
        </label>
      </image-uploader>
    </div>
    <div>
      <h2 v-if="prediction != ''"> 

        <span v-for="p in prediction" :key=p.id>
          {{p.class}} {{p.probability}}<br/>
        </span>
          
      </h2>
      <h2 v-else>
        <span v-if="hasImage">Calculating...</span></h2>
    </div>
  </div>
</template>

<script>
import * as tf from "@tensorflow/tfjs";
import signature from "@/assets/signature.json";
const MODEL_URL = "/models/cheese/model.json";

export default {
  name: "HelloWorld",
  data() {
    return {
      prediction: "",
      model: "",
      preview: "",
      hasImage: false,
      image: null,
      outputKey: "Labels",
      classes: signature.classes.Label,
      shape: signature.inputs.Image.shape.slice(1, 3),
      inputName: signature.inputs.Image.name,
    };
  },
  methods: {
    setImage(output) {
      this.prediction = "";
      this.hasImage = true;
      this.preview = output;
      
    },
    getImage() {
      //step 1, get the image
      const image = this.$refs.img1;
      let imageTensor = tf.browser.fromPixels(image, 3);
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
          signature.outputs[this.outputKey].name
        );
        const resultsArray = results.dataSync();
        this.showPrediction(resultsArray);
      } else {
        console.error("Model not loaded, please await this.load() first.");
      }
    },
    showPrediction(classification) {
      //step 4 - classify
      let classes = Array.from(this.classes)
      let predictions = Array.from(classification)
        .map(function (p, i) {
          return {
            id: i,
            probability: Math.floor(p * 100) + '%',
            class: classes[i],
          };
        })
        
        
        this.prediction = predictions;
        //stop the model inference
        this.dispose()
        
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#fileInput {
  display: none;
}
h1,
h2 {
  font-weight: normal;
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
.my-8 {
  margin-top: 4rem;
  margin-bottom: 4rem;
}
</style>
