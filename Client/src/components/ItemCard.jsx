import React, { useState, useEffect } from 'react';
import BinanceLogo from '../Icons/binance-logo.svg';
import verified from '../Icons/verified.svg';
import "./ItemCard.css";
import { Link } from "react-router-dom";
import Auction from "../nfts/artAuction"
import Modal from "react-modal";
import axios from 'axios';
import getWallet from '../nfts/connectWallet';
import Token from "../contracts/DOGToken.json"
import  AuctionContract from "../contracts/ArtAuction.json"

let auction, web3,account;
export default function ItemCard({ nftData }) {
    const [nftBtn, setNftBtn] = useState("Bid");
    const [balance, setBalance] = useState(0);
    const [dogBalance, setDogBalance] = useState(0);
    const [bidModalIsOpen, setBidModalIsOpen] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [auctionTimer, setAuctionTimer] = useState("00:00:00");
    const [isBid, setIsBid] = useState(false);
    const [latestBid, setLatestBid] = useState(0);
    const [errors, setErrors] = useState("");

    useEffect(async() => {
        web3 = await getWallet()
        account = await web3.eth.getAccounts();
        auction = new Auction();
        checkNftStatus();
        getUserBalance()
        const interval = setInterval(() => {
            auctionTime();
            
        })
    }, []);

    const click = async () => {
        if (nftBtn === "Bid" || nftBtn === "Bid Higher") {
            if(nftData.auction){
                let contract = new web3.eth.Contract(
                    AuctionContract.abi, AuctionContract.contractAddress);
                let bid = await contract.methods.getCurrentBid(nftData.auction.auction_id).call(); 
                setLatestBid(bid)
                }
            openBidModal();
            checkBidStatus()
        } else if (nftBtn === "Cancel Auction") {
            cancelAuction();
        } else if("Create Auction") {
            openModal();
        }else if(this.state.nftBtn === "Winner:Claim Bid") {
            claimAuction();
        }
    }

    const bidAuction = async () => {
        let id = nftData.info[0].nftID
        let price = document.getElementById("bidPrice").value;
        let type = document.getElementById("bidType").value;
        let auctionId;
        if (nftData.auction.onAuction) {
            auctionId = nftData.auction.auction_id;
        }
        let res = await auction.nftBid(auctionId, price)
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

    const checkBidStatus =async () => {
        let currentBid = (parseFloat(latestBid[0])/1e18).toFixed(3);
        if(nftData.price.includes("BNB")&&balance<=0.00&&balance<=currentBid){
            setIsBid(true)
        }else if(nftData.price.includes("DOG")&&dogBalance<=0.00&&dogBalance<=currentBid){
            setIsBid(true)
        }
    }

    const createAuction = async () => {
        let id = nftData.info[0].nftID
        let price = document.getElementById("nftPrice").value;
        let type = document.getElementById("tokenType").value;
        let deadline = document.getElementById("deadline").value;
        let totaltime = (new Date().getTime() / 1000) + deadline * 86400;
        let auctionId = await auction.auctionId();
        let res = await auction.createAuction(id, price * 1e18, type.toLowerCase(), parseInt(totaltime))
        if(!res) return;
        let auctionData = {
            auction_id: auctionId,
            price: price + type,
            onAuction: true,
            time: parseInt(totaltime),
            bids: []
        }
        let link = "/nfts/update/" + id;
        try {
            axios({
                method: "POST",
                url: link,
                data: auctionData,
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log("Success, firm added")
                        console.log(JSON.stringify(response.data))
                        Location.reload(false)
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

    const claimAuction = async () => {
        let id = nftData.info[0].nftID

        let auctionId;
        if (nftData.auction.onAuction) {
            auctionId = nftData.auction.auction_id;
        }
        if (auctionId === "null") return;
        let res = await auction.cancelAuction(auctionId);
        if(!res) return;
        
        let link = "/nfts/auction/" + id;
        try {
            axios({
                method: "POST",
                url: link,
                data:{newOwner:account[0]},
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log("Success, firm added")
                        Location.reload(false)
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

    const cancelAuction = async () => {
        let id = nftData.info[0].nftID

        let auctionId;
        if (nftData.auction.onAuction) {
            auctionId = nftData.auction.auction_id;
        }
        if (auctionId === "null") return;
        let res = await auction.cancelAuction(auctionId);
        if(!res) return;
        
        let link = "/nfts/auction/" + id;
        try {
            axios({
                method: "POST",
                url: link,
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log("Success, firm added")
                        Location.reload(false)
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

    const checkNftStatus = async () => {
        let owner = nftData.owners[1].name;

        if (nftData.price === '0' && owner === account[0]) {
            setNftBtn("Create Auction")
        }
        else if (nftData.price !== '0' && owner === account[0]) {
            setNftBtn("Cancel Auction")
        }
        else if (nftData.price === '0') {
            setNftBtn("Not On Sale")
        }
       else
        if(nftData.auction){
            if(!nftData.auction.bids) return;
            if(!nftData.auction.bids.find(b => b.account === account[0])) return;
            let contract = new web3.eth.Contract(
                AuctionContract.abi, AuctionContract.contractAddress);
            let bid = await contract.methods.getCurrentBid(nftData.auction.auction_id).call(); 
            if(bid[1]==="0x0000000000000000000000000000000000000000") return;
            let currentTime = parseInt(new Date().getTime()/1000);

            if(bid[1] === account[0]){
                setNftBtn("Wining Bid")
                if(currentTime>=nftData.auction.time)
                        setNftBtn("Winner:Claim Bid");
            }
            else{
                setNftBtn("Bid Higher")
            }
            }
    }

    const getUserBalance = async () => {
        let dogToken = new web3.eth.Contract(
            Token.abi, Token.contractAddress);
        let dog = await dogToken.methods.balanceOf(account[0]).call();
        setDogBalance(parseFloat(dog / 1e18).toFixed(3))
        var balance = await web3.eth.getBalance(account[0]);
        setBalance(parseFloat(balance / 1e18).toFixed(3))
    }

    const auctionTime = async () => {
        if (nftData.auction) {
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
                setAuctionTimer(time);
            }
        }

    }


    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
        },
    };
    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };
    const openBidModal = () => {
        setBidModalIsOpen(true);
    };

    const closeBidModal = () => {
        setBidModalIsOpen(false);
    };
    const validateBid = (e) => {
        let currentBid = (parseFloat(latestBid[0])/1e18).toFixed(3);
        if(e.target.value >= currentBid){
            setIsBid(false);
            setErrors("")
        }
        else{
           setIsBid(true);
           setErrors("Must greater than last Bid!")
        }
    };


    return (
        <div className="item-card" >
            <Link style={{ textDecorationLine: "none" }} to={`/nft/${nftData.info[0].nftID}`}>
                <div className="item-card--thumbnail">
                    <img className="nft-image__vertical card-img-top" src={"http://" + nftData.image} alt="No Found" />
                </div>
                <div className="item-card--body">
                    <div className="title">
                        <h6 className="contract-name">ART NFT Minter</h6>
                        <img src={verified} alt="" height="16" />
                    </div>
                    <h5>{nftData.name}</h5>
                    <p className="text-muted">{nftData.type}</p>
                    <p className="text-muted" style={{ float: 'right' }}>{auctionTimer}</p>

                    <div style={{ display: "flex", margin: "9px 0 12px" }}>
                        <span style={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center" }}>
                            <span className="item_card_badge">
                                <img src={BinanceLogo} alt="Not found" height="12" />
                            </span>
                        </span>

                    </div>
                </div>
            </Link>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="">
                    <div className="text-muted" style={{ fontSize: "10px" }}>LIST PRICE</div>
                    <div style={{ color: "#7927ff", lineHeight: "16px", fontSize: "16px", fontWeight: "700", }}>
                        <span>{nftData.price}</span>
                    </div>
                </div>
                <button onClick={click} disabled={nftBtn === "Not On Sale"} className="btn itemcard_button_buy" style={{ color: "white", backgroundColor: " #7927ff", borderColor: "#7927ff" }}>{nftBtn}</button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <div class="content">
                    <div>
                        <button
                            onClick={closeModal}
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
                        <button onClick={createAuction} className=" btn btn-block" style={{ width: "50%", marginRight: "25%", marginLeft: "25%", align: "center", backgroundColor: "#7927ff", color: "#fff", borderColor: "#7927ff" }}>Place Auction</button>

                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={bidModalIsOpen}
                onRequestClose={closeBidModal}
                style={customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <div class="content">
                    <div>
                        <button
                            onClick={closeBidModal}
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
                            <input onChange={validateBid} type="text" id="bidPrice" placeholder={"Last bid:"+(parseFloat(latestBid[0])/1e18).toFixed(3)} name="nftPrice" style={{ width: "100%", borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderRadius: '0', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                            <br/><span style={{color: "red"}}>{errors}</span>
                            <select disabled className="ml-3" style={{ width: "50%", borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderRadius: '0', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} name="bidType" id="bidType">
                                <option selected={nftData.price.includes("BNB")} style={{ height: "2em" }} value="BNB">BNB</option>
                                <option selected={nftData.price.includes("DOG")} style={{ height: "2em" }} value="DOG"> DOG </option>
                            </select>
                        </div>
                        <div style={{ width: "50%", marginRight: "25%", marginLeft: "25%" }}>
                            <p className="text-muted"> {nftData.price.includes("BNB") ? balance + "BNB" : dogBalance + "DOG"} </p>
                            <button disabled={isBid} onClick={bidAuction} className=" btn btn-block" style={{ backgroundColor: "#7927ff", color: "#fff", borderColor: "#7927ff" }}>Place Bid</button>

                        </div>

                    </div>
                </div>
            </Modal>
        </div>
    );
}