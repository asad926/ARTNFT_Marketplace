import getWeb3 from "./connectWallet";
import ArtAuction from "../contracts/ArtAuction.json"
import DOGToken from "../contracts/DOGToken.json"
let artAuction, dogToken,web3,address ;
class Auction {

   constructor(){
      this.loadContracts();
  }

  loadContracts=async()=>{
    web3 = await getWeb3();
    let account = await web3.eth.getAccounts();
    address = account[0];
    artAuction = new web3.eth.Contract(
      ArtAuction.abi, ArtAuction.contractAddress);
    dogToken = new web3.eth.Contract(
      DOGToken.abi, DOGToken.contractAddress);
  }

    nftBid = async(id,price) =>{
    console.log("NFT ID: " + id+":Price:"+parseFloat(price)+price.includes('BNB'))
    let transaction;
    try{
      
      let pr = parseFloat(price)
      if(price.includes('DOG')){
      transaction = await dogToken.methods.approve(ArtAuction.contractAddress,web3.utils.toWei(""+pr,"ether")).send({from:address});
      if(transaction.status)
      transaction = await artAuction.methods.bidOnAuction(id,web3.utils.toWei(""+pr,"ether")).send({from:address})
      }else{
      transaction = await artAuction.methods.bidOnAuction(id,0).send({from:address,value:web3.utils.toWei(""+pr,"ether")})
      }
       console.log("Bid Transaction: "+transaction)
       return transaction.status;
    }catch(e){console.log(e)} 
     }

     createAuction=async(nftId,price,type,deadline)=>{
       try{
      let transaction = await artAuction.methods.createAuction(nftId,deadline,""+price,type).send({from:address})
      console.log("Auction Transaction: " + transaction)
      return transaction.status;
       }catch(e){console.log(e); return false} 
    }
    auctionId=async()=>{
      let count = await artAuction.methods.getCount().call();
      console.log("Auction Id: " + count);
      return count;
    }

    cancelAuction=async(auctionId)=>{
      try{
      let transaction = await artAuction.methods.cancelAuction(auctionId).send({from:address})
      console.log("Auction Transaction: " + transaction)
      return transaction.status;
    }catch(e){console.log(e); return false}
    }
    claimAuction=async(auctionId)=>{
      try{
      let transaction = await artAuction.methods.finalizeAuction(auctionId).send({from:address})
      console.log("Auction Transaction: " + transaction)
      return transaction.status;
    }catch(e){console.log(e); return false}
    }
    }
export default Auction;