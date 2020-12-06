const http = require('http');
const formidable = require('formidable');
const path=require ('path');
fs = require("fs"),
PNG = require('pngjs').PNG;


const {grayScale} = require("./IOhandler");

var mainPage = fs.readFileSync("main.html");
var photoPage= fs.readFileSync("album.html"); 
let cssStyles = fs.readFileSync("main.css");

let uploadedFile = "";

const server = http.createServer((req, res) => {
  if (req.url === "/main.css") {
    res.writeHead(200, {"Content-Type": "text/css"});
    res.end(cssStyles);
  } else if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
    const form = formidable({ multiples: true, keepExtensions: true, uploadDir: path.join(__dirname, 'uploads')});
    form.parse(req);
    const newPathIn =form.uploadDir;
    const newPathOut = `${__dirname}/uploadgrayscaled`

    form.on("file", function(field, file) {
      uploadedFile = file.name;
      fs.rename(file.path, `${newPathIn}/${uploadedFile}`, err => {
        if (err) {
           console.log(err.message);
        }
     });
    });

    form.on('end', () => {
      grayScale(`${newPathIn}/${uploadedFile}`, newPathOut)
         .then(value => res.end(photoPage))
         .catch(err => res.end(err.message))
    });
  } else {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(mainPage);
  }
 
});
 
 server.listen(8080, () => {
   console.log('Server listening on http://localhost:8080/ ...');
 });


