// const tesseract = require('node-tesseract-ocr')
var tesseract = require('tesseract.js')
const path = require('path')
const getColors = require('get-image-colors')
const sharp = require('sharp');

tesseract.recognize(
  './images/croppedImage.jpg',
  'eng', {
    logger: m => m
  }
).then(({
  data: {
    text
  }
}) => {
  console.log('text2', text);
})




// original image
let originalImage = './images/airte-bg1.jpg';

// file name for cropped image
let outputImage = './images/croppedImage.jpg';

sharp(originalImage).extract({
    width: 200,
    height: 100,
    left: 200,
    top: 80
  }).toFile(outputImage)
  .then(function (new_file_info) {
    console.log("Image cropped and saved");
  })
  .catch(function (err) {
    console.log(err);
  });


getColors(path.join(__dirname, './images/airtel-bg2.jpg')).then(colors => {
  // colors.map(color => color.hex())
  console.log(colors.map(color => color.hex()))
})

// ocr.recognize("./../OpenCV-Image-Processing/images/hello.JPG", config)
// .then(text => {
//     console.log("Result", text)
// })
// .catch(error => {
//     console.log(error.message)
// })

// const result =  tesseract.recognize("./../OpenCV-Image-Processing/images/hello.JPG", {
//     load_system_dawg: 0,
//     tessedit_char_whitelist: "0123456789",
//     presets: ["tsv"],
//   })

// const createWorker = require('tesseract.js')

// const worker = createWorker({
//   logger: m => console.log(m)
// });

// (async () => {
//   await worker.load();
//   await worker.loadLanguage('eng');
//   await worker.initialize('eng');
//   const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
//   console.log(text);
//   await worker.terminate();
// })();