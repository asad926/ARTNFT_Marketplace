const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_ADDON_URI;
var dbo;
var database = "bph88zeerdzrnfn";
module.exports = {

  insertNftsData: function (nfts, callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
      if (err) throw err;
      dbo = client.db(database);
      dbo.collection("nfts").insertOne(nfts, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        client.close();
      });
    })
  },
  insertUserData: function (user, callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
      if (err) throw err;
      dbo = client.db(database);
      var collection = dbo.collection('users');
      const query = { account: user.account };
      const update = { $set: user };
      const options = {upsert: true };
      collection.updateOne(query, update, options,function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        client.close();
      });
    })
  },

  updateNftsData: function (id, nfts, callback) {
    console.log("Update Id: " + id);
    let pr = nfts.price;
    delete nfts.price;
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
      if (err) throw err;
      dbo = client.db(database);
      dbo.collection("nfts").updateOne({ info: { $elemMatch: { nftID: id } } }, { $set: { auction: nfts, price: pr } }, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        client.close();
      });
    })
  },
  updateAuctionData: function (id, newOwner, callback) {
    console.log("Update Id: " + id);
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
      if (err) throw err;
      dbo = client.db(database);
      if (newOwner)
        dbo.collection("nfts").updateOne({ info: { $elemMatch: { nftID: id } }, "owners.role": "OWNER" }, { $set: { "owners.$.name": newOwner, price: "0", "auction.onAuction": false, "auction.time": 0 } }, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
          client.close();
        })
      else
        dbo.collection("nfts").updateOne({ info: { $elemMatch: { nftID: id } } }, { $set: { price: "0", "auction.onAuction": false, "auction.time": 0 } }, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
          client.close();
        })
    })
  },
  updateBidData: function (id, bid, callback) {
    console.log("Update Id: " + id);
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
      if (err) throw err;
      dbo = client.db(database);
      dbo.collection("nfts").updateOne({ info: { $elemMatch: { nftID: id } } }, { $push: { "auction.bids": bid } }, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        client.close();
      });
    })
  },
  getNftsData: async function () {

    let client = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
    var dbo = client.db(database);
    let collection = dbo.collection("nfts");
    let res = await collection.find({}).toArray();
    console.log(res);
    return res;
  }
  ,
  getNftData: async function (id) {
    let client = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
    var dbo = client.db(database);
    let collection = dbo.collection("nfts");
    let res = await collection.findOne({ info: { $elemMatch: { nftID: id } } });
    console.log(res);
    return res;
  },
  getUserData: async function (account) {
    let client = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
    var dbo = client.db(database);
    let collection = dbo.collection("users");
    let res = await collection.findOne({ account: account });
    console.log(res);
    return res;
  },
  getUserNfts: async function (address) {
    let client = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
    var dbo = client.db(database);
    let collection = dbo.collection("nfts");

    let res = await collection.find({ owners: { $elemMatch: { name: address } } }).toArray();
    console.log(res);
    return res;
  }
  ,
  getNftAuction: async function (id) {
    let client = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
    var dbo = client.db(database);
    let collection = dbo.collection("nfts");
    let res = await collection.findOne({ auction: { $elemMatch: { nftID: id } } });
    console.log(res);
    return res;
  }
}