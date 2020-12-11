# Getting Started - TensorFlow.js

There are a few key elements in the main export directory. Your model in json format (model.json), its weights as binary shard files (.bin),
and signature.json which contains information about your Lobe project.

With these, you are ready to use your model!
If you want to see an example of how to use this model, there are instructions below for running a quick test script.

## Example Contents

`signature.json` is created by Lobe and contains information about the model such as label names and the image size and shape the model expects.

`tfjsExample.ts` is a simple typescript script to test your exported model. It takes a path to an image on your file system, prepares the image and returns the predicted class and confidence level.

`package.json` is where the Node libraries and version information required to run the script are found.

## Run Example

You will need Node installed on your computer.

Install the the dependencies for the example:

`npm install`

Run the example and see the model output:

`npm run predict path/to/your/image`

Please see `package.json` for details on how the `predict` script runs the example.

If you are on MacOs Catalina, you may run into errors with installation. There is [documentation](https://www.npmjs.com/package/@tensorflow/tfjs-node/v/2.0.0-rc.3) that provides instructions on what to check to get past the issue.
