var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var multer = require('multer');
var fs = require('fs');
require('dotenv').config();
var DBRouter = require('./routes/DB');
var DB = require('./routes/nftsDB');
var app = express();
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = './res/Nfts/Images/'
    fs.mkdirSync(path, { recursive: true })
    cb(null, './res/Nfts/Images')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '_' + Date.now() + '.' + extension)
  }
})
const upload = multer({ storage: storage, limits: { fileSize: 8 * 1024 * 1024 } }).single("nft_file");
app.use(cors());

app.use(express.json({ limit: 8 * 1024 }));
app.use(express.urlencoded({ extended: true, }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'res/Nfts/Images')));
app.use(express.static(path.join(__dirname, './Client/build')));
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    let nfts = {
      ipfsHash: "https://" + req.body.ipfsHash + ".ipfs.dweb.link",
      server: req.header('host'),
      nftImage: req.header('host') + '/' + req.file.filename,
    }
    if (err) {
      console.log(err);
      res.status(400).json({ error: err.code });
    }
    res.json(nfts);
  });
});

app.post("/save", (req, res) => {
  const uploadUser = multer({ storage: storage, limits: { fileSize: 8 * 1024 * 1024 } }).single("profile_pic");
  uploadUser(req, res, async(err) => {
    let user = {
      account : req.body.account,
      name: req.body.user_name,
      bio: req.body.user_bio,
      pic: req.header('host') + '/' + req.file.filename,
    }
    try {
      await DB.insertUserData(user)
    } catch (e) { console.log(e) }
    res.sendStatus(200);
    if (err) {
      console.log(err);
      res.status(400).json({ error: err.code });
    }
    res.json(user);
  });
});

app.get("/user/:account", async(req, res) => {
  let data
  let account = req.params.account;
   try{ 
    data = await DB.getUserData(account)
 }catch(e){console.log(e)
  if(!data)
  res.status(400).json({ error: e.code });}
  res.json(data);
});

app.use('/nfts', DBRouter);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./Client/build/index.html")
  );
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
