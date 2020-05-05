const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')

var Jimp = require('jimp');

var fs = require('fs')
var path = require('path')
var Canvas = require('canvas')

/* Models */
const UserModel = mongoose.model('User')


// start user signup function 

let signUpFunction = (req, res) => {

  

}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {
    
}


// end of the login function 


let logout = (req, res) => {
  
} // end of the logout function.

let imageProcess= (req, res) => {

    let imgRaw = 'assets/download.png';
    // let imgLogo = 'assets/nixonletterfullblock.jpg'; //a 155px x 72px logo
    //---
    
    // let imgActive = 'assets/export1233.png';
    // let imgExported = 'assets/export12.png';
    
    let textData = {
      text: 'Jatin test', //the text to be rendered on the image
      maxWidth: 225, //image width - 10px margin left - 10px margin right
      maxHeight: 225, //logo height + margin
      // placementX: 10, // 10px in on the x axis
      // placementY: 1024-(72+20)-10 //bottom of the image: height - maxHeight - margin 
      placementX: 20, // 10px in on the x axis
      placementY: 20 //bottom of the image: height - maxHeight - margin
    };
    
    //read template & clone raw image 
    Jimp.read(imgRaw)
    //   .then(tpl => (tpl.clone().write(imgActive)))
    
      //read cloned (active) image
    //   .then(() => (Jimp.read(imgActive)))
    
      //combine logo into image
      // .then(tpl => (
      //   Jimp.read(imgLogo).then(logoTpl => {
      //     logoTpl.opacity(0.2);
      //     return tpl.composite(logoTpl, 512-75, 512, [Jimp.BLEND_DESTINATION_OVER, 0.2, 0.2]);
      //   })
      // ))
    
      //load font	
      .then(imgRaw => (
        Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => ([imgRaw, font]))
      ))
        
      //add footer text
      .then(data => {
    
        imgRaw = data[0];
        font = data[1];
      
        return imgRaw.print(font, textData.placementX, textData.placementY, {
          text: textData.text,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, textData.maxWidth, textData.maxHeight);
      })
    
      //export image
    //   .then(imgRaw => (imgRaw.quality(100).write(imgExported)))
    
      //log exported filename
      .then(async(imgRaw) => { 
        var a = await imgRaw.getBase64Async('image/jpeg')
        res.send(a);
        // console.log('exported file: ' + imgExported);
      })

      
    
      //catch errors
      .catch(err => {
        console.error(err);
      });
    


    // TruckModel.find()
    //     .select('-__v -_id')
    //     .lean()
    //     .exec((err, result) => {
    //         if (err) {
    //             console.log(err)
    //             logger.error(err.message, 'Truck Controller: getAll', 10)
    //             let apiResponse = response.generate(true, 'Failed To Find ', 500, null)
    //             res.send(apiResponse)
    //         }
    //         else if (check.isEmpty(result)) {
    //             logger.error('null', 'Truck Controller: getAll', 10)
    //             let apiResponse = response.generate(true, 'No Truck found', 500, null)
    //             res.send(apiResponse)
    //         }
    //         else {

    //             let apiResponse = response.generate('false', 'All Details', 200, result)

    //             console.log(apiResponse)
    //             console.log(apiResponse.data[0].sentRequests)
    //             res.send(apiResponse);
    //         }
    //     })
  
}


let imgProcess2=(req,res)=>{
  function fontFile (name) {
    return path.join(__dirname, '/fonts/', name)
  }
  
  Canvas.registerFont(fontFile('ITCEDSCR.ttf'), {family: 'ITCEDSCR'})
  
  var canvas = Canvas.createCanvas(255, 255)
  var ctx = canvas.getContext('2d')
  
  var Image = Canvas.Image;
  var img = new Image();
  img.src = 'assets/download.png';
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  
  ctx.font = '8pt ITCEDSCR'
  ctx.fillText('यह मिसिसिपी है',80, 190)
  
  canvas.createPNGStream().pipe(fs.createWriteStream( 'assets/download111.png'))
  canvas.createJPEGStream().pipe(fs.createWriteStream( 'assets/download111.jpg'))
}


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout,
    imageProcess:imgProcess2

}// end exports