const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
var multer = require('multer');

var Jimp = require('jimp');

var fs = require('fs')
var path = require('path')
var Canvas = require('canvas')
const cron = require('node-cron');

const crypto = require("crypto");

/* Models */
const UserModel = mongoose.model('User')


// start user signup function 

let signUpFunction = (req, res) => {

  

}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {
    res.send("Success")
}


// end of the login function 


let logout = (req, res) => {
  
} // end of the logout function.

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		//cb(null, '../frontend/src/assets/uploads')
		//cb(null, '../frontend/uploads')
		cb(null, './uploads')
	}
	,
	filename: function (req, file, cb) {

		var fileObj = {
			"image/png": ".png",
			"image/jpeg": ".jpeg",
			"image/jpg": ".jpg",
			"application/pdf": ".pdf"
			// "application/msword": ".doc",
			// "text/plain": ".txt"
		};
		if (fileObj[file.mimetype] == undefined) {
			cb(new Error("file format not valid"));

			// cb(null, file.fieldname + '-' + Date.now() + fileObj[file.mimetype])
		} else {
			cb(null, file.fieldname + '-' + Date.now() + fileObj[file.mimetype])
		}
	}
})

var upload = multer({
	storage: storage
});

var uploadFile = upload.single('file')


// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//       cb(null, 'uploads/');
//   },

//   // By default, multer removes file extensions so let's add them back
//   filename: function(req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// var upload = multer({dest:'uploads/'});

// var upload = multer({ dest: 'uploads/' })


let imageProcessOld_bkp= (req, res) => {

  // let upload2 = multer({ storage: storage }).single('profile_pic');

  uploadFile(req, res, (err) => {
    
    // if (err instanceof multer.MulterError) {
    //   console.log("nijnhjb")
    //   console.log(err);
    // }
    // else if (err) {
    //   console.log(err);
    //   res.json({ "status": 500, "message": "Only PDF, JPG,JPEG, PNG file types are allowed" })
    //   res.status(500).send()
    // }
    // else {
  
    
  // console.log(req)
      // console.log(req.file.path)
      let imgRaw = 'assets/download.png';
      let imgLogo = 'assets/download111.jpg'; //a 155px x 72px logo
      //---
      // let  idClone = crypto.randomBytes(16).toString("hex");
      // let imgActive = 'clone/'+idClone+'.png';

      // let dt= new Date();
      let  id = crypto.randomBytes(16).toString("hex");
      let imgActive = 'clone/'+id+'.png';
      let imgExported = 'exports/'+id+'.png';
      
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
        .then(tpl => (tpl.clone().write(imgActive)))
      
        //read cloned (active) image
        .then(() => (Jimp.read(imgActive)))
      
        //combine logo into image
        .then(tpl => (
          Jimp.read(imgLogo).then(logoTpl => {
            logoTpl.opacity(1);
            return tpl.composite(logoTpl, 110, 110, [Jimp.BLEND_DESTINATION_OVER, 1, 1]);
          })
        ))
      
        //load font	
        
        .then(imgRaw => (
         
          Jimp.loadFont('./app/controllers/fonts/abc2.fnt').then(font => ([imgRaw, font]))
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
        .then(imgRaw => (
          imgRaw.quality(100).write(imgExported)
          
          ))

          .then(data=>{
            fs.unlink(imgActive)
            // setTimeout(() => {
            //   fs.unlinkSync(imgExported)
            // }, 1000*60);

            res.send('/uploads/'+id+'.png')
          })
        
      
        //log exported filename
        // .then(async(imgRaw) => {

          // var a = await imgRaw.getBase64Async('image/jpeg')
          // res.send({"img":a});
          // var fs = require('fs');
          // var filePath = req.file.path; 
          // fs.unlinkSync(filePath);
         
          // console.log('exported file: ' + imgExported);
        // })
     
        //catch errors
        .catch(err => {
          console.error(err);
        });
  
      // }
  })
  
}




let imgProcessOld_Canvas=(req,res)=>{
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

let imageProcess= (req, res) => {  

  uploadFile(req, res, (err) => {
    
      let imgRaw = 'assets/download.png';
      let imgLogo = 'assets/downloadlogo.png'; //a 155px x 72px logo

      let  id = crypto.randomBytes(16).toString("hex");
      let imgActive = 'clone/'+id+'.png';
      let imgExported = 'exports/'+id+'.png';
      
      let textData = {
        text: req.body.name, //the text to be rendered on the image
        maxWidth: 225, //image width - 10px margin left - 10px margin right
        maxHeight: 225, //logo height + margin
        // placementX: 10, // 10px in on the x axis
        // placementY: 1024-(72+20)-10 //bottom of the image: height - maxHeight - margin 
        placementX: 20, // 10px in on the x axis
        placementY: 20 //bottom of the image: height - maxHeight - margin
      };
      
      //read template & clone raw image 
      Jimp.read(imgRaw)
        .then(tpl => (tpl.clone().write(imgActive)))
      
        //read cloned (active) image
        .then(() => (Jimp.read(imgActive)))
      
        //combine logo into image
        .then(tpl => (
          Jimp.read(imgLogo).then(logoTpl => {
            logoTpl.opacity(1);
            return tpl.composite(logoTpl, 50, 50, [Jimp.BLEND_DESTINATION_OVER, 1, 1]);
          })
        ))
      
        //load font	
        
        .then(imgRaw => (
         
          Jimp.loadFont('./app/controllers/fonts/abc2.fnt').then(font => ([imgRaw, font]))
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
        .then(imgRaw => (
          imgRaw.quality(100).write(imgExported)
          
          ))

          .then(data=>{
            fs.unlink(imgActive)

            //Call this if required to delete the image automatically after 24 hours
            // setTimeout(() => {
            //   fs.unlinkSync(imgExported)
            // }, 1000*60*60*24);

            res.send('/uploads/'+id+'.png')
          })

        //catch errors
        .catch(err => {
          console.error(err);
        });
  })
  
}

let cronJobs= (req, res) => {

 
  cron.schedule('1 * * *', function() {
   
    console.log("Cron Running")
    fs.readdirSync('./exports').forEach(function (file) {      
      fs.stat('./exports/'+file, (err,stats)=>{   
        var OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000)
        if(OneDay>stats.birthtime){        
          // fs.unlink('./exports/'+file)
          fs.unlink('./exports/'+file, err => {
            if (err) throw err;
            console.log("Exported images succesfully deleted");
          });
        }
      })
    });

});

}


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout,
    imageProcess:imageProcess,
    startCron:cronJobs

}// end exports