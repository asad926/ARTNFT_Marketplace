import React, { Component } from 'react';
import "./mainPage.css";
import icon from '../Icons/art_logo.png';
import b_icon from '../Icons/ART-icon.png';
import CreateSingle from './creatSingle';
import CreateMultiple from './creatMultiple';
import  Nft721 from "../contracts/ArtNft721.json"
import  Nft1155 from "../contracts/ArtNft1155.json"
import  Auction from "../contracts/ArtAuction.json"
import getWallet from "../nfts/connectWallet"

const { ethereum } = window;
let web3;
class mainPage extends Component {

    stateHandler = this.stateHandler.bind(this);

    state = { formComponent: "main",
              nft721: null, nft1155: null, auctionContract: null,web3: null            
             }
    loadSingle = () => {
          this.setState({ formComponent:"single"})
    }
    loadMultiple = () => {
          this.setState({ formComponent:"multiple"})
    }

    stateHandler() {
        this.setState({
            formComponent: "main"
        });
    }

    componentDidMount() {
        let self = this;
        if(this.isMetaMaskInstalled)
        this.connectToMetaMask();
        else console.log("Please install metamask!!");
      if(window.ethereum)
      window.ethereum.on('accountsChanged', async function (accounts) {
        self.connectToMetaMask()
      })
      
  }
  

isMetaMaskInstalled() {
    return Boolean(ethereum && ethereum.isMetaMask);
  }
  
  async  connectToMetaMask() {
    if(this.isMetaMaskInstalled)
    try {
      //Will Start the MetaMask Extension
      web3 = await getWallet();
      let account = await web3.eth.getAccounts();
     // this.setConnectBtn("Create")
      this.setState({web3: web3});
      let n721 = new web3.eth.Contract(
        Nft721.abi, Nft721.contractAddress);

        this.setState({nft721: n721});
      
      let n1155 = new web3.eth.Contract(
            Nft1155.abi, Nft1155.contractAddress);
        this.setState({nft1155: n1155});
        let auction = new web3.eth.Contract(
            Auction.abi, Auction.contractAddress);
        this.setState({auctionContract: auction});

  
    } catch (error) {
      console.error(error);
    }else console.log("Please install metamask!!");
  }

    render() { 
        if(this.state.formComponent === "single"){return(<CreateSingle action={this.stateHandler} data={this.state} />)}
        if(this.state.formComponent === "multiple"){return(<CreateMultiple action={this.stateHandler} data={this.state}/>)}
        return ( 
            <div className = "container-fluid p-0" style = {{borderLeft: "25px solid rgba(111,111,111,0)", borderRight: "25px solid rgba(111,111,111,0)"}}>
                <div className = "container-fluid p-0 text-center">
                    <h1>Create Collectible</h1>
                    <h5 className = "mt-4 mx-auto" style = {{maxWidth: "750px", lineHeight: "2em", fontWeight: "700"}}>Choose “single” if you want your collectible to be one of a kind or “Multiple” if you want to sell one collectible multiple times.</h5>
                    <div className = "py-5 mx-auto d-flex flex-wrap justify-content-around" style = {{maxWidth: "800px"}}>
                        <div onClick={this.loadSingle} className = "sp_card_create" style = {{cursor: "pointer", transition: "all .2s", padding: "40px", width: "330px", borderRadius: "50px", boxShadow: "10px 15px 25px 0 rgb(0 0 0 / 20%)"}}>
                            <div className = "pt-5 pb-5 d-flex justify-content-center" style = {{height: "220px"}}>
                                <img className = "ml-2 mr-2" style = {{height: "100%"}} src= {icon} alt="not found!" />
                            </div>
                            <div className = "text-center">
                                <div className = "d-flex flex-wrap justify-content-center" style = {{fontWeight: "700"}}>Single</div>
                                <div className = "d-flex flex-wrap justify-content-center" style = {{color:"gray"}}>BEP-721</div>
                            </div>
                        </div>
                        <div  onClick={this.loadMultiple} className = "sp_card_create" style = {{cursor: "pointer", transition: "all .2s", padding: "40px", width: "330px", borderRadius: "50px", boxShadow: "10px 15px 25px 0 rgb(0 0 0 / 20%)"}}>
                            <div className = "pt-5 pb-5 mx-auto d-flex justify-content-center" style = {{height: "220px"}}>
                                <img className = "ml-2 mr-2" style = {{height: "100%"}} src= {b_icon} alt="not found!" />
                            </div>
                            <div className = "text-center">
                                <div className = "d-flex flex-wrap justify-content-center" style = {{fontWeight: "700"}}>Multiple</div>
                                <div className = "d-flex flex-wrap justify-content-center" style = {{color:"gray"}}>BEP-1155</div>
                            </div>
                        </div>
                    </div>
                    <h5 className = "mt-4 mx-auto" style = {{maxWidth: "750px", lineHeight: "2em", fontWeight: "700"}}>We do not own your private keys and cannot access your funds without your confirmation.</h5>
                </div>
            </div>
         );
        }
    }
export default mainPage;
