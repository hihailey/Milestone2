/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 * 
 * Created Date: Nov 13
 * Author: Hailey Kim
 * 
 */

const unzipper = require('unzipper'),
  fs = require("fs"),
  PNG = require('pngjs').PNG,
  path = require('path');


/**
 * Description: decompress file from given pathIn, write to given pathOut 
 *  
 * @param {string} pathIn 
 * @param {string} pathOut 
 * @return {promise}
 */

const unzip = (pathIn, pathOut) => {
 
  return new Promise ( (resolve, reject) => {
    if (fs.existsSync(pathIn)){ // 파일이 있는지 없는지 확인 유무  Sync 를 써도되나??????
      fs.createReadStream(pathIn)
      .pipe(unzipper.Extract({ path: pathOut })) //unzipper
      .on('error',(err) => { reject (err)}) 
      .on('close', ()=>resolve("Extraction operation complete.") ) 
    } else {
      reject("There is no file in this folder")
    }
  })
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path 
 * 
 * @param {string} path 
 * @return {promise}
 */

const readDir = dir => {

  let newFiles =[];
  
  return new Promise ( (resolve, reject) => {

    fs.readdir(dir, (err,files) => { //파일을 하나하나씩 확인해야함
      if (err) {
        reject (err);
      } else {
        for(let i = 0; i<files.length; i++){
          if( files[i].includes('.png') ){   //.join want to ask
            newFiles.push(files[i])                    
          }else{
          }
        }
        resolve(newFiles);
        }
          // let lst = ["hi", "bye"]; => lst.join(",")
})

})};

/*
const readDir = dir => {
  return new Promise ( (resolve, reject) => {
    fs.readdir(dir, (err,files) => { //파일을 하나하나씩 확인해야함
      if (err) {
        return reject (err);
      } 
        resolve(files.filter(file => path.extname(file) === ".png"));  
    })    
  })
};
*/

  // path.basename path.extname
 // ["in.png", "in2.png", ".DS_STORE", "MACOSX"] => filter => ["in.png", "in2.png",]


/**
 * Description: Read in png file by given pathIn, 
 * convert to grayscale and write to given pathOut
 * 
 * @param {string} filePath 
 * @param {string} pathProcessed 
 * @return {promise}
 */


const grayScale = (pathIn, pathOut) => {

  return new Promise((resolve, reject) => {

    fs.createReadStream(pathIn)
      .pipe(
        new PNG({
          filterType: 4,
        })
      )
      .on("parsed", function () { //Loop through the pixel array
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;
    
            // Get RGB
            // let red = this.data[idx];
            // let green = this.data[idx + 1];
            // let blue = this.data[idx + 2];
    
            // let gray = (red + green + blue) / 3;
            // this.data[idx] = gray;
            // this.data[idx + 1] = gray;

            let grey = this.data[idx] * 0.299 + this.data[idx + 1] * 0.587 + this.data[idx + 2] * 0.114;

            
            this.data[idx] = grey;
            this.data[idx + 1] = grey;
            this.data[idx + 2] = grey;

          }
        }
    this.pack().pipe(fs.createWriteStream(`${pathOut}/${path.basename(pathIn)}`))
      .on("close", () => resolve("Picture "))
  })
  .on("error", () => reject("Error occured"))


    
  })

};

module.exports = {
  unzip,
  readDir,
  grayScale
};



// This code
/*let obj = {
  color: "red"
};

let newColor = obj.color;
newColor = "blue";*/