const express = require('express')
const app = express()
const path = require('path')
const crypto = require('crypto')
const mongoose = require('mongoose')
const multer = require('multer')
const Grid = require('gridfs-stream')
const methodOverRide = require('method-override')
const GridfsStorage = require('multer-gridfs-storage')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(methodOverRide('_method'))
app.use(express.json())
const mongoURL = 'mongodb://localhost:27017/fileUpload'

const conn = mongoose.createConnection(mongoURL)

var gfs = ''
conn.once('open', () => {
  console.log('Database connected')
  //Initialize Stram
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('uploads')
})
//Initialize Storage Engine
var storage = new GridfsStorage({
  url: mongoURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({
  storage
});
app.get('/getdata', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({files:'No files'})
    } else if (err) return res.json(err)
    else{
      files.map(file=>{
        if(file.contentType.includes('image')){
          file.isImage = true
        }
        else
        file.isImage = false
      })
      return res.json(files)
    }
  })
})

/*
 @route: /upload
 desc: uploading file to db
*/
app.post('/upload', upload.single('file'), (req, res) => {
  // console.log('requested')
  console.log(req.file)
  res.json({file:req.file})
  // res.redirect('http://localhost:3000')
})

/*
 @route: /file/filename
 desc: get a file from database and render as image
*/
app.get('/getfile/:filename', (req, res) => {
  gfs.files.findOne({
    filename: req.params.filename
  }, (err, file) => {
    if (!file) return res.status(404).json({
      err: 'File not exists'
    })
    else if (err) return res.json(err)
    else {
        const readStream = gfs.createReadStream(file.filename)
        readStream.pipe(res)
    }
  })
})

/*
@route /files/:id DELETE
@desc delete a file from DB
*/
app.delete('/files/:id',(req,res)=>{
  gfs.remove({_id:req.params.id,root:'uploads'},(err,gridStorage)=>{
    if(err)
    return res.status(404).json({err:err})
  })
  res.redirect('/')
})
app.listen('8080', function () {
  console.log('listening on port 8080')
})