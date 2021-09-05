var express = require('express');
var router = express.Router();
var DB = require('./nftsDB');

/* GET home page. */
router.get('/',async function(req, res, next) {
try{
   let data = await DB.getNftsData()
res.json(data);
}catch(e){console.log(e)}

});

router.get('/:id',async function(req, res, next) {
   let nftId = req.params.id;
   try{
    let data = await DB.getNftData(nftId)
    res.json(data);
 }catch(e){console.log(e)}
});

router.post('/save',async function(req, res, next) {
    let nft = req.body;
    try{
     await DB.insertNftsData(nft)
  }catch(e){console.log(e)}
  res.sendStatus(200);
 });

 router.post('/update/:id',async function(req, res, next) {
   let id = req.params.id;
   let nft = req.body;
   try{
    await DB.updateNftsData(id,nft)
 }catch(e){console.log(e)}
 res.sendStatus(200);
});

router.post('/bid/:id',async function(req, res, next) {
   let id = req.params.id;
   let bid = req.body;
   try{
    await DB.updateBidData(id,bid)
 }catch(e){console.log(e)}
res.sendStatus(200);
});

router.post('/auction/:id',async function(req, res, next) {
   let id = req.params.id;
   let owner = req.body;
   if(owner.newOwner)
   try{
    await DB.updateAuctionData(id,owner.newOwner)
 }catch(e){console.log(e)}
res.sendStatus(200);
});

 router.get('/user/:address',async function(req, res, next) {
   let add = req.params.address;
   try{
    let data = await DB.getUserNfts(add)
    res.json(data);
 }catch(e){console.log(e)}
});

module.exports = router;
