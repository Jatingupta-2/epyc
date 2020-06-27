const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
var multer = require('multer');
const nodemailer = require("nodemailer");

var Jimp = require('jimp');

var fs = require('fs')
var path = require('path')
var Canvas = require('canvas')
const cron = require('node-cron');

// const zlib = require('zlib');

const crypto = require("crypto");

/* Models */
const UserModel = mongoose.model('User')

// var archiver = require('archiver');

const { zip } = require('zip-a-folder');


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
    
      let imgRaw = 'assets/nixonletterfullblock.jpg';
      let imgLogo =   'assets/emoji.png'; //a 155px x 72px logo
      
      // 'exports/my_image.png'
      
     

      let  id = crypto.randomBytes(16).toString("hex");
      let  id2 = crypto.randomBytes(16).toString("hex");
      let imgActive = 'clone/'+id+'.png';
      let imgExported = 'exports/'+id+'.png';
      
      let textData = {
        text: req.body.name, //the text to be rendered on the image
        maxWidth: 1025, //image width - 10px margin left - 10px margin right
        maxHeight: 625, //logo height + margin
        // placementX: 10, // 10px in on the x axis
        // placementY: 1024-(72+20)-10 //bottom of the image: height - maxHeight - margin 
        placementX: 850, // 10px in on the x axis
        placementY: 50 //bottom of the image: height - maxHeight - margin
      };

      // .then(() => {
  var CanvasPlus = require('pixl-canvas-plus');
  var canvas = new CanvasPlus();

  canvas.loadFont("./app/controllers/fonts/Almarai_Bold.ttf");

  canvas.create({
    "width": 300,//800,
    "height": 50,//200,
    "background": ""
  });

  // Note: Fonts are handled differently in the browser vs. Node.js.
  // Please see https://github.com/jhuckaby/canvas-plus#fonts for details.
  canvas.text({
    "text": req.body.name,
    "font": "./app/controllers/fonts/Almarai_Bold.ttf",
    "size": 30,
    "color": "#00000",
    "gravity": "northeast",
    "overflow": "wrap",
    "marginX": 0,//10,
    "marginY": 0,//10
  });
  // canvas.transform({
	// 	"fliph": true
	// });

  canvas.write({ "format": "png" }, function (err, buf) {
    if (err) throw err;

    // 'buf' will be a binary buffer containing final image...
    // ;
    require('fs').writeFileSync('exports/'+id2+'.png', buf);
    // res.send(require('fs').writeFileSync('exports/my_image.png', buf))
  });
// })


      
      //read template & clone raw image 
      Jimp.read(imgRaw)
        .then(tpl => (tpl.clone().write(imgActive)))
      
        //read cloned (active) image
        .then(() => (Jimp.read(imgActive)))
      
        //combine logo into image
        .then(tpl => (
          
          Jimp.read('exports/'+id2+'.png').then(logoTpl => {
            logoTpl.opacity(1);
            return tpl.composite(logoTpl, 
              0,//1025, 
              0,//200, 
              
              [Jimp.BLEND_DESTINATION_OVER, 1, 1]);
          })
        ))
      
        //load font	
        
        // .then(imgRaw => (
         
        //   Jimp.loadFont('./app/controllers/fonts/Wreckout.fnt').then(font => ([imgRaw, font]))
        // ))
          
        // //add footer text
        // .then(data => {
      
        //   imgRaw = data[0];
        //   font = data[1];
        
        //   return imgRaw.print(font, textData.placementX, textData.placementY, {
        //     text: textData.text,
        //     alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        //     alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        //   }, textData.maxWidth, textData.maxHeight);
        // })
      
        //export image

        .then(async(imgRaw) => {
          require('fs').unlink('exports/'+id2+'.png')
          var a = await imgRaw.getBase64Async('image/jpeg')
          res.send(a);
          // var fs = require('fs');
          // var filePath = req.file.path; 
          // fs.unlinkSync(filePath);
         
          console.log('exported file: ' + imgExported);
        })
        // .then(imgRaw => (
        //   imgRaw.quality(100).write(imgExported)
          
        //   ))

        //   .then(data=>{
        //     fs.unlink(imgActive)

        //     //Call this if required to delete the image automatically after 24 hours
        //     // setTimeout(() => {
        //     //   fs.unlinkSync(imgExported)
        //     // }, 1000*60*60*24);

        //     res.send('/uploads/'+id+'.png')
        //   })

        //catch errors
        .catch(err => {
          console.error(err);
        });
  })
  
}

let imageProcess_new= (req, res) => {  

  // uploadFile(req, res, (err) => {
    let arr =[]
    // console.log(req.body)
  req.body.pages.forEach((e,index) => {

      let imgRaw = 'assets/'+req.body.book+'/'+e.page+'.png';
      let  id = crypto.randomBytes(16).toString("hex");
      let  id2 = crypto.randomBytes(16).toString("hex");
      let imgActive = 'clone/'+id+'.png';
      let imgExported = 'exports/'+id+'.png';

  var CanvasPlus = require('pixl-canvas-plus');
  var canvas = new CanvasPlus();

  canvas.loadFont("./app/controllers/fonts/"+req.body.text+".ttf");

  canvas.create({
    "width": e.box_height,//800,
    "height": e.box_width,//200,
    "background": ""
  });

  canvas.text({
    "text": e.name,
    "font": "./app/controllers/fonts/"+req.body.text+".ttf",
    "size": 24,
    "color": e.color,
    "gravity": req.body.gravity,
    "overflow": "wrap",
    "marginX": 0,//10,
    "marginY": 0,//10
  });

  canvas.write({ "format": "png" }, function (err, buf) {
    if (err) throw err;
    require('fs').writeFileSync('exports/'+id2+'.png', buf);
  });

      
      //read template & clone raw image 
      Jimp.read(imgRaw)
        // .then(tpl => (tpl.clone().write(imgActive)))

        // .then(() => (Jimp.read(imgActive)))

        .then(tpl => (
          
          Jimp.read('exports/'+id2+'.png').then(logoTpl => {
            fs.unlink('exports/'+id2+'.png')
            logoTpl.opacity(1);
            return tpl.composite(logoTpl, 
              e.box_top,//1025, 
              e.box_left,//200, 
              
              [Jimp.BLEND_DESTINATION_OVER, 1, 1]);
          })
        ))
        .then(async(imgRaw) => {
         
          var a = await imgRaw.getBase64Async('image/jpeg')
          arr.push(a)
          // require('fs').unlink(imgActive)
          // require('fs').unlink('exports/'+id2+'.png')
          if(index==req.body.pages.length-1){
            res.send(arr);
            console.log('exported file: ' + imgExported);
          }
        })
        //catch errors
        .catch(err => {
          console.error(err);
        });
  // }) 
});
  
}

let imageProcess_Wrap=(req, res) =>{
  var CanvasPlus = require('pixl-canvas-plus');
  var canvas = new CanvasPlus();
  
  canvas.loadFont( "./app/controllers/fonts/Wreckout.otf" ); 

  canvas.create({
    "width": 200,
    "height": 200,
    "background": ""
  });
  
  // Note: Fonts are handled differently in the browser vs. Node.js.
  // Please see https://github.com/jhuckaby/canvas-plus#fonts for details.
  canvas.text({
    "text": "Now is the time for all good men to come to the aid of their country.  The quick brown fox jumps over the lazy dog.  Grumpy Wizards make toxic brew for the Evil Queen and Jack.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "font": "./app/controllers/fonts/Wreckout.otf",
    "size": 18,
    "color": "#000000",
    "gravity": "northwest",
    "overflow": "wrap",
    "marginX": 10,
    "marginY": 10
  });
  
  canvas.write({"format":"png"}, function(err, buf) {
    if (err) throw err;
  
    // 'buf' will be a binary buffer containing final image...
    ;
    res.send(require('fs').writeFileSync('exports/my_image.png', buf))
  });
}

let cronJobs= (req, res) => {

 
  cron.schedule('0 * * * *', function() {
   
    console.log("Cron Running")
    fs.readdirSync('./exports').forEach(function (file) {      
      fs.stat('./exports/'+file, (err,stats)=>{   
        var OneDay = new Date().getTime() - (1 * 24 * 60 * 60 * 1000)
        // console.log(OneDay)
        // console.log(stats.birthtime)
        // if(OneDay<stats.birthtime){ 
       
        //   console.log("Early not delete")
        //      }
        // else 
        if(OneDay>stats.birthtime){   
          // console.log("Late pls delete")
             // fs.unlink('./exports/'+file)
          fs.unlink('./exports/'+file, err => {
            if (err) throw err;
            console.log("Exported image succesfully deleted");
          });
           }
        // if(OneDay<stats.birthtime){        
        //   // fs.unlink('./exports/'+file)
        //   fs.unlink('./exports/'+file, err => {
        //     if (err) throw err;
        //     console.log("Exported images succesfully deleted");
        //   });
        // }
      })
    });

});

}


// async..await is not allowed in global scope, must use a wrapper
let sendmail=async (req,res)=>{
  let email= req.body.email

  console.log(req.body.email)
  console.log(req.body.senders)

 
  let  id = crypto.randomBytes(16).toString("hex");

  var dir="purchased/"+id
  var dir2=""
  // var idnew= id
  var array=[]
  array=JSON.parse(req.body.senders)

  console.log(array)
  console.log("length = "+array.length)

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
     dir2="purchased/"+id+"/exports/"
    fs.mkdirSync(dir2);



    (array).forEach((e1,index) => {
      console.log(e1)

      var inStr = fs.createReadStream(e1);
      var outStr = fs.createWriteStream(dir+'/'+e1);

      inStr.pipe(outStr);

    });
    }

    var sendDir=dir+'.zip'

    await zip(dir, sendDir);

    // await fs.unlinkSync(dir)

    var rimraf = require("rimraf");
  rimraf(dir, function () { console.log("done"); });





  // const directoryFiles = fs.readdirSync(dir);


  // Promise.all(directoryFiles.map(filename => {
  //   return new Promise((resolve, reject) => {
  //     const fileContents = fs.createReadStream(`${dir}/${filename}`);
  //     const writeStream = fs.createWriteStream(`${dir}/${filename}.gz`);
  //     const zip = zlib.createGzip();
  //     fileContents.pipe(zip).pipe(writeStream).on('finish', (err) => {
  //       if (err) return reject(err);
  //       else resolve();
  //     })
  //   })
  // }))
  //   .then(console.log('done'));



                async function main(){
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                      service:'gmail' ,// true for 465, false for other ports
                      tls: { rejectUnauthorized: false },
                      auth: {
                        user: 'noreplyjatingupta@gmail.com', // generated ethereal user
                        pass: 'Jatin@123' // generated ethereal password
                      }
                    });
                  
                    // setup email data with unicode symbols
                    let mailOptions = {
                      from: "noreplyjatingupta@gmail.com", // sender address
                      to: email, // list of receivers
                      subject: "Forgot Password", // Subject line
                      text: `Use the Password -  for Login.
                              Do Change it after First Login`, // plain text body
                              attachments:[
                                {
                                  filename: 'book.zip',
                                  path: sendDir
                                }
                              ]
                    };                                      
                    // send mail with defined transport object
                    let info = await transporter.sendMail(mailOptions)
                  
                    console.log("Message sent: %s", info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                  
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    let apiResponse= response.generate(false, 'Mail Sent Successfully', 200, null)
                    console.log(apiResponse)
                    res.send(apiResponse)
                    
                  }main().catch(console.error);
}


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout,
    imageProcess:imageProcess_new,
    startCron:cronJobs,
    mail:sendmail,
    imageProcess_Wrap:imageProcess_Wrap

}// end exports