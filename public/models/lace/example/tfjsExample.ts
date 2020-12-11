/*
 -------------------------------------------------------------
  Copyright (c) Microsoft Corporation.  All rights reserved.
 -------------------------------------------------------------
 */
import * as tf from '@tensorflow/tfjs-node';
import { promises as fs, readFileSync } from 'fs';


class ImageModel {
  signature: any;
  modelPath: string;
  height: number;
  width: number;
  outputName: string;
  outputKey = "Confidences";
  classes: string[];
  model?: tf.GraphModel;

  constructor(signaturePath: string) {
    const signatureData = readFileSync(signaturePath, "utf8");
    this.signature = JSON.parse(signatureData);
    this.modelPath = `file://../${this.signature.filename}`;
    [this.width, this.height] = this.signature.inputs.Image.shape.slice(1,3);
    this.outputName = this.signature.outputs[this.outputKey].name;
    this.classes = this.signature.classes.Label;
  }

  async load() {
    this.model = await tf.loadGraphModel(this.modelPath);
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
    }
  }

  predict(image: tf.Tensor) {
      /*
      Given an input image decoded by tensorflow as a tensor,
      preprocess the image into pixel values of [0,1], center crop to a square
      and resize to the image input size, then run the prediction!
       */
      if(!!this.model){
        const [imgHeight, imgWidth] = image.shape.slice(0,2);
        // convert image to 0-1
        const normalizedImage = tf.div(image, tf.scalar(255));
        // make into a batch of 1 so it is shaped [1, height, width, 3]
        const reshapedImage: tf.Tensor4D = normalizedImage.reshape([1, ...normalizedImage.shape]);
        // center crop and resize
        let top = 0;
        let left = 0;
        let bottom = 1;
        let right = 1;
        if (imgHeight != imgWidth) {
          // the crops are normalized 0-1 percentage of the image dimension
          const size = Math.min(imgHeight, imgWidth);
          left = (imgWidth - size) / 2 / imgWidth;
          top = (imgHeight - size) / 2 / imgHeight;
          right = (imgWidth + size) / 2 / imgWidth;
          bottom = (imgHeight + size) / 2 / imgHeight;
        }
        const croppedImage = tf.image.cropAndResize(
          reshapedImage, [[top, left, bottom, right]], [0], [this.height, this.width]
        );
        const results = this.model.execute(
          {[this.signature.inputs.Image.name]: croppedImage}, this.outputName
        ) as tf.Tensor;
        const resultsArray = results.dataSync();
        return {
          [this.outputKey]: this.classes.reduce(
              (acc, class_, idx) => {
                return {[class_]: resultsArray[idx], ...acc}
              }, {}
            )
        }
      } else {
        console.error("Model not loaded, please await this.load() first.");
      }
  }
}


async function main(imgPath: string) {
  // read the file from the input path
  const image = await fs.readFile(imgPath);
  // decode the image into a tensor
  const decodedImage = tf.node.decodeImage(image, 3);
  // create and load our model
  const model = new ImageModel('../signature.json');
  await model.load();
  // run the prediction
  const results = model.predict(decodedImage);
  console.log(results);
  // cleanup
  model.dispose();
}


const args = process.argv.slice(2);
if (args.length !== 1) {
  console.log(`Please specify one argument - the path to your image. Found args: ${args}`);
  process.exit();
}
const imgPath = args[0];
main(imgPath);
