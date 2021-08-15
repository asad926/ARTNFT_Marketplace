import React, { Component } from 'react';
import BinanceLogo from '../Icons/binance-logo.svg';
import axios from 'axios';
import Modal from "react-modal";
import Auction from "../nfts/artAuction"
import getWallet from '../nfts/connectWallet';
import  AuctionContract from "../contracts/ArtAuction.json"
import Token from "../contracts/DOGToken.json"


let auction, web3, account, nftData;
class itemCardDetail extends Component {
    state = {
        nft: {},
        owner: [],
        info: {},
        history: {},
        properties: [],
        date: "",
        nftBtn: "BID ON ITEM",
        balance:0,
        dogBalance:0,
        errors:"",
        latestBid: {},
        auctionTimer:"00:00:00",
        bidType:"BNB",
        currentBid:0
    }

    clickBid = async () => {
        if (this.state.nftBtn === "BID ON ITEM") {
            if(this.state.nft.auction){
                let contract = new web3.eth.Contract(
                    AuctionContract.abi, AuctionContract.contractAddress);
                let bid = await contract.methods.getCurrentBid(this.state.nft.auction.auction_id).call(); 
                this.setState({latestBid:bid});
                this.setState({currentBid:parseFloat(bid[0])/1e18.toFixed(3)})
                if(bid[0]<=0){
                    this.setState({currentBid:this.state.nft.price})
                }
                }
            this.openBidModal();
        }  else if (this.state.nftBtn === "CANCEL THIS AUCTION") {
            this.cancelAuction();
        }else if(this.state.nftBtn === "PLACE ON SALE") {
            this.openModal();
        }else if(this.state.nftBtn === "WINNER:CLAIM BID") {
            this.claimAuction();
        }
    }

    createAuction = async () => {
        let nftId = this.props.match.params.id
        let price = document.getElementById("nftPrice").value;
        let type = document.getElementById("tokenType").value;
        let deadline = document.getElementById("deadline").value;
        let totaltime = (new Date().getTime() / 1000) + deadline * 86400;
        let auctionId = await auction.auctionId();

        let res = await auction.createAuction(nftId, price * 1e18, type.toLowerCase(), parseInt(totaltime))
       if(!res) return;
        let auctionData = {
            auction_id: auctionId,
            price: price+type,
            onAuction: true,
            time:parseInt(totaltime),
            bids: []
        }
        let link = "nfts/update/"+nftId;
        try {
            axios({
                method: "POST",
                url: link,
                data: auctionData,
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
                ,
                timeout: 5000,
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log("Success, firm added")
                        console.log(JSON.stringify(response.data))
                        window.location.reload();
                    } else {
                        console.log("Error occurred")
                    }
                }
                ).catch(e => {
                    console.log(e)
                })

        } catch (e) {
            console.log(e)
        }
    }

    cancelAuction = async () => {
        let id = nftData.info[0].nftID

        let auctionId;
        if (nftData.auction.onAuction) {
            auctionId = nftData.auction.auction_id;
        }
        console.log("Aution ID sdad: " + auctionId);
        if (auctionId === "null") return;
        let res = await auction.cancelAuction(auctionId);
        if(!res) return;
       
        let link = "/nfts/auction/" + id;
        try {
            axios({
                method: "POST",
                data:{},
                url: link,
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log("Success, firm added")
                        console.log(JSON.stringify(response.data))
                        window.location.reload();
                    } else {
                        console.log("Error occurred")
                    }
                }
                ).catch(e => {
                    console.log(e)
                })

        } catch (e) {
            console.log(e)
        }
    }

    claimAuction = async () => {
        let id = nftData.info[0].nftID

        let auctionId;
        if (nftData.auction.onAuction) {
            auctionId = nftData.auction.auction_id;
        }
        console.log("Aution ID sdad: " + auctionId);
        if (auctionId === "null") return;
        let res = await auction.claimAuction(auctionId);
        if(!res) return;
       
        let link = "/nfts/auction/" + id;
        try {
            axios({
                method: "POST",
                data:{newOwner: account[0]},
                url: link,
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log("Success, firm added")
                        console.log(JSON.stringify(response.data))
                        //window.location.reload();
                    } else {
                        console.log("Error occurred")
                    }
                }
                ).catch(e => {
                    console.log(e)
                })

        } catch (e) {
            console.log(e)
        }
    }


    componentDidMount=async()=> {
        let self = this;
        web3 = await getWallet();
        account = await web3.eth.getAccounts();
        this.loadDB();
        auction = new Auction();
        this.getUserBalance()
        if(window.ethereum)
        window.ethereum.on('accountsChanged', async function (accounts) {
            self.loadDB()
          })
    }

    loadDB = async function () {
        try {
            let nftId = this.props.match.params.id;
            let link = "/nfts/" + nftId;
            let res = await axios.get(link);
            if (res.status === 200) {
                nftData = res.data;
                this.setState({ nft: res.data })
                this.setState({ owner: res.data.owners })
                this.setState({ properties: res.data.properties })
                this.setState({ info: res.data.info[0] })
                this.setState({ history: res.data.history[0] })
                let date = new Date(res.data.history[0].date).toISOString().split('T')[0]
                this.setState({ date: date })

                if (res.data.price === '0' && res.data.owners[1].name === account[0]) {
                    this.setState({ nftBtn: "PLACE ON SALE" })
                }
                else if (res.data.price !== '0' && res.data.owners[1].name === account[0]) {
                    this.setState({ nftBtn: "CANCEL THIS AUCTION" })
                }
                else if (res.data.price === '0') {
                    this.setState({ nftBtn: "NOT ON SALE" })
                }

                if(nftData.price.includes("DOG")){
                    this.setState({bidType:"DOG"})
                }
                setInterval(() => {
                    this.auctionTime();
                })

                if(nftData.auction && nftData.price !== "0"){
                    if(!nftData.auction.bids) return;
                    if(!nftData.auction.bids.find(b => b.account === account[0])) return;
                    let contract = new web3.eth.Contract(
                        AuctionContract.abi, AuctionContract.contractAddress);
                    let bid = await contract.methods.getCurrentBid(nftData.auction.auction_id).call(); 
                    console.log("Bid Account: " + bid[1])
                    if(bid[1]==="0x0000000000000000000000000000000000000000") return;
                    let currentTime = parseInt(new Date().getTime()/1000);

                    if(bid[1] === account[0]){
                        this.setState({nftBtn:"BID WINNING"})
                        if(currentTime>=nftData.auction.time)
                        this.setState({nftBtn:"WINNER:CLAIM BID"});
                    }
                    else{
                        this.setState({nftBtn:"PLACE HIGH BID"})
                    }
                    }
            }

        } catch (e) {
            console.log(e)
        }
    }

     getUserBalance = async () => {
        let dogToken = new web3.eth.Contract(
            Token.abi, Token.contractAddress);
        let dog = await dogToken.methods.balanceOf(account[0]).call();
        this.setState({dogBalance:parseFloat(dog / 1e18).toFixed(3)})
        var balance = await web3.eth.getBalance(account[0]);
        this.setState({balance:parseFloat(balance / 1e18).toFixed(3)})
    }

     auctionTime = async () => {
        if (nftData.auction) {
            if(!nftData.auction.onAuction) return;
            let time = nftData.auction.time
            let currentTime = parseInt(new Date().getTime() / 1000);
            time = time - currentTime;
            if (parseInt(time) <= 0) {
                time = "Auction Ended"
            } else {
                var seconds = time;
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                var days = Math.floor(hours / 24);

                hours = hours - (days * 24);
                minutes = minutes - (days * 24 * 60) - (hours * 60);
                seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
                time = days + " D:" + hours + " H:" + minutes + " M:" + seconds + " S";
                this.setState({auctionTimer: time});
            }
        }

    }

    bidAuction = async () => {
        let id = nftData.info[0].nftID
        let auctionId;
        if (nftData.auction.onAuction) {
            auctionId = nftData.auction.auction_id;
        }
        let price = document.getElementById("bidPrice").value;
        let type = document.getElementById("bidType").value;
        let res = await auction.nftBid(auctionId, price+type)
        if(!res) return;
        let bid = {
            amount: price + type,
            account: account[0]
        }
        try {
            let link = "/nfts/bid/" + id;
            let res = await axios.post(link, bid);
            if (res.status === 200) {
                window.location.reload();
            }

        } catch (e) {
            console.log(e)
        }
    }

     validateBid = (e) => {
        //let currentBid = (parseFloat(this.state.latestBid[0])/1e18).toFixed(3);
        console.log("Price Changed: "+e.target.value)
        if(e.target.value > parseFloat(this.state.currentBid)){
            this.setState({isBid:false});
            this.setState({errors:""})
        }
        else{
            this.setState({isBid:false});
            this.setState({errors:"Must greater than last Bid!"})
        }
    };
    customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
        },
    };
    openModal = () => {
        this.setState({ modalIsOpen: true });
    };

    closeModal = () => {
        this.setState({ modalIsOpen: false });
    };

    openBidModal = () => {
        this.setState({ bidModalIsOpen: true });
    };

    closeBidModal = () => {
        this.setState({ bidModalIsOpen: false });
    };
    render() {
        return (
            <div className="container-fluid">

                <div className="row">
                    <div className="col-sm-7">
                        <img src={"http://" + this.state.nft.image} alt="Not found" width="100%" className="img-fluid img-thumbnail ml-2 mr-2" />
                    </div>
                    <div className="col-sm-5 border border-brown">
                        <div className="ml-2 p-5">
                            <div className="row p-0">
                                <div className="col-sm-8">
                                    <p className="text-muted" style={{ fontSize: "14px" }}>{this.state.nft.type} </p>
                                </div>
                                <div className="col-sm-4 text-right">
                                    <span class="fab fa-cloudsmith"></span>
                                </div>
                            </div>
                            <div>
                                <span className="badge badge-info" style={{ backgroundColor: "#f2e9ff" }}>
                                    <img src={BinanceLogo} alt="not found" width="24" />
                                </span>
                            </div>
                            <p>{this.state.nft.description}</p>
                            <p className="text-muted m-0" style={{ fontSize: "12px" }}>LIST PRICE </p>
                            <h4 className="text-primary">
                                <span>{this.state.nft.price}</span>
                            </h4>
                            <button onClick={this.clickBid} disabled={this.state.nftBtn==="NOT ON SALE"} className=" btn btn-block" style={{ backgroundColor: "#7927ff", color: "#fff", borderColor: "#7927ff" }}>{this.state.nftBtn}</button>
                            <p className="text-muted" style={{ float: 'right' }}>{this.state.auctionTimer}</p>
                        </div>

                        <div className="border border-brown p-5 mt-5">
                            <button className="btn btn-block text-left font-weight-bold" data-toggle="collapse" data-target="#iteminfo">Item info</button>
                            <div id="iteminfo" className="collapse">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <p className="text-muted mb-0 mt-4">LIST DATE</p>
                                        <p>{this.state.date}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <p className="text-muted mb-0 mt-4">CHAIN</p>
                                        <p>BSC</p>
                                    </div>
                                </div>
                                <p className="text-muted">CONTRACT ADDRESS</p>
                                <a style={{ textDecorationLine: "none" }} href={"https://testnet.bscscan.com/address/" + this.state.info.contractAddress}>{this.state.info.contractAddress}</a>
                                <div className="row">
                                    <div className="col-sm-6"></div>
                                    <div className="col-sm-6"></div>
                                </div>
                            </div>
                            <button className="btn btn-block text-left font-weight-bold mt-4 mb-4" data-toggle="collapse" data-target="#ceeinfo">Collection info</button>
                            <div id="ceeinfo" className="collapse">
                                {this.state.owner.map((el, i) => {
                                    return (
                                        <div>
                                            <h6 className="mt-4 mb-4">{el.role}</h6>
                                            <p>{el.name}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="container-fluid">
                            <ul className="nav nav-tabs" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" data-toggle="tab" href="#properties">Properties</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="tab" href="#stats">Stats</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="tab" href="#boosts">Boosts</a>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div id="properties" className="container tab-pane active"><br />
                                    {this.state.properties.map((el, i) => {
                                        return (
                                            <div>
                                                <h6 className="mt-4 mb-4">{Object.keys(el) + "(" + el[Object.keys(el)] + ")"}</h6>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div id="stats" className="container tab-pane"><br />
                                    <p>No stats found for this asset</p>
                                </div>
                                <div id="boosts" className="container tab-pane"><br />
                                    <p>No boosts found for this asset</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={this.customStyles}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                >
                    <div class="content">
                        <div>
                            <button
                                onClick={this.closeModal}
                                type="button"
                                class="close"
                                data-dismiss="modal"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="my-4">
                            <h4>Auction sale price</h4>
                            <p className="text-muted"> Enter the price for which the item will be start auction. </p>
                            <div className="mb-3 d-flex">
                                <input type="text" id="nftPrice" name="nftPrice" style={{ width: "100%", borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderRadius: '0', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                                <select className="ml-3" style={{ width: "50%", borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderRadius: '0', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} name="tokenType" id="tokenType">
                                    <option style={{ height: "2em" }} value="BNB">BNB</option>
                                    <option style={{ height: "2em" }} value="DOG"> DOG </option>
                                </select>
                            </div>
                            <div className="mb-3 d-flex">
                                <label className="text-muted" style={{ width: "100%" }}>Sale Deadline</label>
                                <select className="ml-3" style={{ width: "50%", borderBottom: "1px solid hsla(0,0%,39.2%,.2)", float: "right", borderRadius: '0', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} name="deadline" id="deadline">
                                    <option style={{ height: "2em" }} value="1">1 Day</option>
                                    <option style={{ height: "2em" }} value="3"> 3 Days </option>
                                    <option style={{ height: "2em" }} value="5">5 Days</option>
                                    <option style={{ height: "2em" }} value="7"> 7 Days</option>
                                    <option style={{ height: "2em" }} value="10">10 Days</option>
                                </select>
                            </div>
                            <button onClick={this.createAuction} className=" btn btn-block" style={{ width: "50%", marginRight: "25%", marginLeft: "25%", align: "center", backgroundColor: "#7927ff", color: "#fff", borderColor: "#7927ff" }}>Place On Auction</button>

                        </div>
                    </div>
                </Modal>

                <Modal
                isOpen={this.state.bidModalIsOpen}
                onRequestClose={this.closeBidModal}
                style={this.customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <div class="content">
                    <div>
                        <button
                            onClick={this.closeBidModal}
                            type="button"
                            class="close"
                            data-dismiss="modal"
                        >
                            &times;
                        </button>
                    </div>
                    <div className="my-4">
                        <h4>bid on Auction</h4>
                        <p className="text-muted"> Enter the your bid price for auction. </p>
                        <div className="mb-3 d-flex">
                            <input onChange={this.validateBid} type="text" id="bidPrice" placeholder={"Last bid:"+this.state.currentBid} name="nftPrice" style={{ width: "100%", borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderRadius: '0', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                            <br/><span style={{color: "red"}}>{this.state.errors}</span>
                            <select disabled className="ml-3" style={{ width: "50%", borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderRadius: '0', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} name="bidType" id="bidType">
                                <option selected={this.state.bidType==="BNB"} style={{ height: "2em" }} value="BNB">BNB</option>
                                <option selected={this.state.bidType==="DOG"} style={{ height: "2em" }} value="DOG"> DOG </option>
                            </select>
                        </div>
                        <div style={{ width: "50%", marginRight: "25%", marginLeft: "25%" }}>
                            <p className="text-muted"> {this.state.bidType==="BNB"?this.state.balance + this.state.bidType:this.state.dogBalance + this.state.bidType} </p>
                            <button disabled={this.state.isBid} onClick={this.bidAuction} className=" btn btn-block" style={{ backgroundColor: "#7927ff", color: "#fff", borderColor: "#7927ff" }}>Place Bid</button>

                        </div>

                    </div>
                </div>
            </Modal>
            </div>

            
        );
    }
}

export default itemCardDetail;