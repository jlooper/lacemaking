<template>
  <div class="hello">
    <div class="my-8">
      <image-uploader
        :preview="true"
        :className="['fileinput', { 'fileinput--loaded': hasImage }]"
        capture="environment"
        :debug="1"
        doNotResize="gif"
        :autoRotate="true"
        outputFormat="string"
        @input="setImage"
        @onComplete="predictImage"
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
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Upload",
  data() {
    return {
      msg: "Vue Image Upload and Resize Demo",
      hasImage: false,
      image: null,
    };
  },
  methods: {
    setImage(output) {
      this.hasImage = true;
      this.image = output;
    },
    predictImage() {
      /*axios({
        method: "post",
        url:
          "http://localhost:38100/predict/dfcf37f4-6d77-46c0-be7f-86dc9c45efd9",
        data: JSON.stringify({
          inputs: {
            Image: this.image,
          },
        }),
      }).then(function (response) {
        console.log(response);
      });*/

      var data = JSON.stringify({
        inputs: {
          Image: this.image,
        },
      });

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          console.log(this.responseText);
        }
      });

      xhr.open(
        "POST",
        "http://localhost:38100/predict/dfcf37f4-6d77-46c0-be7f-86dc9c45efd9"
      );

      xhr.send(data);
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
