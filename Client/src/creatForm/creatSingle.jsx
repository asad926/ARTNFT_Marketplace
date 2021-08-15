import React, { Component } from 'react';
import SiteSymb from './icon/site_symb.png';
import { FaArrowLeft } from "react-icons/fa";
import "./creatSingle.css";
import axios from 'axios';
import Modal from "react-modal";
import Auction from "../nfts/artAuction"
import ClipLoader from "react-spinners/ClockLoader";


const { create } = require('ipfs-http-client')
const ipfs = create({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
})
let web3;
let nft721;
let auctionContract, auction;
let uploadFile = null;
const override = "display: block;margin: 0 auto;border-color: #6610f2;";
class creatSingle extends Component {
    state = {
        onSale: false,
        selectedFile: null,
        previewText: "Prevlew of your new collectible",
        properties: [{ key: "", value: "" }],
        loading: true,
        modalIsOpen: false,
        loadingText:""
    }
    element = React.createRef();

    componentDidMount() {
        nft721 = this.props.data.nft721;
        auctionContract = this.props.data.auctionContract;
        web3 = this.props.data.web3;
        auction = new Auction();
    }

    createAuction = async () => {
        let supply = await nft721.methods.totalSupply().call();
        supply++;
    }

    nftOnSale = (e) => {
        this.setState({ onSale: e.target.checked });
    }
    handleInput = async (e) => {
        e.preventDefault()
        const inputFile = e?.target?.files[0];
        uploadFile = inputFile;
        if (inputFile) {
            const base64 = await this.toBase64(inputFile)
            this.setState({ selectedFile: base64, previewText: "" })
        }

        // document.getElementById('inputfile').click()
    }
    toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    addNewInput = () => {
        var properties = document.getElementById('propertyInputs').getElementsByTagName("input");
        let p1 = properties[properties.length - 2].value;
        let p2 = properties[properties.length - 1].value;
        if (p1 !== "" && p2 !== "") {
            this.setState({
                properties: this.state.properties.concat([{ key: "", value: "" }])
            });
        }

    }


    async nftContract(nftURI, nftImage, royalty, formD) {
        this.setState({loadingText:"Minting new NFT token..."})
        let account = await web3.eth.getAccounts();
        let supply = await nft721.methods.totalSupply().call();
        supply++;
        const nftTransaction = await nft721.methods.mint(parseInt(supply), [[account[0], parseInt(royalty) * 100]], nftURI+parseInt(supply)).send({ from: account[0] });
        this.saveNftDB(formD, nftImage, nftURI+supply, nftTransaction.events.Transfer)
    }

    async addedToIpfs() {
        const added = await ipfs.add(uploadFile, {
            progress: (prog) => {console.log(`received: ${prog}`); this.setState({loadingText:"Uploading to IPFS.("+prog/1024+"KB)"})},
        });
        let v1CID = added.cid.toV1()
        return v1CID.toBaseEncodedString('base32');
    }

    jsonProperties = () => {
        var properties = document.getElementById('propertyInputs').getElementsByTagName("input");
        let data = '[';
        for (let i = 0; i < properties.length; i = i + 2) {
            if (properties[i].value) {
                let key = properties[i].value;
                let value = properties[i + 1].value;
                data = data + '{"' + key + '":"' + value + '"}'
                if (properties[i + 2].value)
                    data = data + ',';
            }
        }
        data = data + ']';

        return data;
    }

    upload = async () => {
        this.setState({loadingText:"Uploading NFT Image to Server..."})
        this.openModal();
        
        let jsonProp = this.jsonProperties();

        let formD = document.forms["nftDetails"];
        let royalty = formD.elements["nftRoyalty"].value;
        let data = new FormData(formD);
        data.append("properties", jsonProp)
        console.warn(uploadFile);
        let v1CID = await this.addedToIpfs();

        data.append("ipfsHash", v1CID);
        let link = "http://localhost:9000/upload";
        try {
            axios({
                method: "POST",
                url: link,
                data: data,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
                ,
                timeout: 3000,
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log("Success, firm added")
                        let nftImage = response.data.nftImage;
                        let nftURI = "http://"+response.data.server+"/nfts/";
                        this.nftContract(nftURI, nftImage, royalty, formD);
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

    saveNftDB = async (farmData, nftImage, nftURI, nftTransaction) => {
        let jsonProp = this.jsonProperties();
        let nftName = farmData.elements["nftName"].value;
        let nftDescription = farmData.elements["nftDescription"].value;
        let nftPrice;
        let tokenType;
        let auctionData = {};
        let price = "";
        if (this.state.onSale) {
            nftPrice = farmData.elements["nftPrice"].value;
            tokenType = farmData.elements["tokenType"].value;
            price = nftPrice + tokenType;
            try {
                let deadline = farmData.elements["deadline"].value;
                let totaltime = (new Date().getTime() / 1000) + deadline * 86400;
                let nftId = nftTransaction.returnValues.tokenId;
                let auctionId = await auctionContract.methods.getCount().call();
                this.setState({loadingText:"Placing this NFT on Auction..."})
                await auction.createAuction(nftId, nftPrice * 1e18, tokenType.toLowerCase(), parseInt(totaltime));
                auctionData = {
                    auction_id: auctionId,
                    onAuction: true,
                    time: parseInt(totaltime),
                }
            } catch (e) { console.log(e) }
        } else {
            price = "0";
        }


        this.setState({loadingText:"Uploading NFT data to Server..."})

        let data = {
            name: nftName,
            price: price,
            type: "Single Item",
            description: nftDescription,
            image: nftImage,
            metadata: nftURI,
            owners: [
                {
                    role: 'CREATOR',
                    name: nftTransaction.returnValues.to,
                },
                {
                    role: 'OWNER',
                    name: nftTransaction.returnValues.to,
                },
            ],
            history: [
                {
                    action: 'The NFT was minted',
                    date: Date.now(),
                },
            ],
            info: [
                {
                    nftID: nftTransaction.returnValues.tokenId,
                    mintTransaction: nftTransaction.transactionHash,
                    contractAddress: nftTransaction.address
                },
            ],
            properties: JSON.parse(jsonProp),
            auction: auctionData
        }

        let link = "http://localhost:9000/nfts/save";
        try {
            axios({
                method: "POST",
                url: link,
                data: data,
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
        this.closeModal();
    }

    customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "30%"
        },
    };

    openModal = () => {
        this.setState({ modalIsOpen: true });
    };

    closeModal = () => {
        this.setState({ modalIsOpen: false });
    };


    render() {
        return (
            <div>
                <div className="my-4" onClick={this.props.action}>
                    <h5 className="ml-4" style={{}}>
                        <span style={{ cursor: "pointer", userSelect: "none" }}>
                            <i><FaArrowLeft /></i>
                            Manage collectible type
                        </span>
                    </h5>
                </div>
                <h3 className="ml-5"><span> Create Single Collectible </span></h3>
                <div className="creatSingle_boxed d-flex flex-wrap pt-4">

                    <div className="pb-5">
                        <form className="form" id="nftDetails" encType="multipart/form-data">
                            <div className="mb-4">
                                <h4> Upload file: </h4>
                                <div className="text-center p-4 mt-4 mb-4" style={{ border: "2px dashed rgb(221, 221, 221)", borderRadius: "40px" }}>
                                    <label htmlFor="nft_file" className="my-3">
                                        <span className="btn" style={{ borderRadius: "50px", backgroundColor: "#e6b000", border: "1px solid #e6b000", color: "white", fontWeight: "600" }}> Choose file </span>
                                    </label>
                                    <div className="text-muted"> PNG, GIF, WEBP, MP4 or MP3. Max 30mb </div>
                                    <input type="file" onChange={this.handleInput} id="nft_file" name="nft_file" accept="image/png,image/jpeg,image/gif,image/webp,image/avif,video/mp4,video/x-m4v,video/quicktime,video/*" style={{ display: 'none' }} />
                                </div>
                            </div>
                            <div className="my-4">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h4> Put on sale </h4>
                                        <div className="text-muted"> You’ll receive bids on this item </div>
                                    </div>
                                    <div className="mb-2">
                                        <label className="switch">
                                            <input type="checkbox" onChange={this.nftOnSale} />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {this.state.onSale ?
                                <div className="my-4">
                                    <h4>Instant sale price</h4>
                                    <p className="text-muted"> Enter the price for which the item will be instantly sold </p>
                                    <div className="mb-3 d-flex">
                                        <input type="text" id="nftPrice" name="nftPrice" className="creatSingle_switch_formControl" style={{ width: "100%", borderBottom: "1px solid hsla(0,0%,39.2%,.2)" }} />
                                        <select className="ml-3 creatSingle_switch_formControl" style={{ borderBottom: "1px solid hsla(0,0%,39.2%,.2)" }} name="tokenType" id="tokenType">
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
                                </div>
                                : <> </>}
                            <div className="my-4">
                                <h4> Choose collection </h4>
                                <div className="mt-3 d-flex">
                                    <div className="align-items-center text-center bg-light  align-items-center justify-content-center" style={{ width: "100px", height: "100px", borderRadius: "20px", border: " 1px solid hsla(0,0%,39.2%,.2)", cursor: "pointer", }}>
                                        <img src={SiteSymb} alt="not found!" style={{ width: "50px", height: "50px", marginTop: "10px" }} />
                                        <span id="nftCollection" name="nftCollection" style={{ fontWeight: "700", fontSize: "80%" }}> JGNNFT </span>
                                    </div>
                                </div>
                            </div>
                            <div className="my-4">
                                <h4> Name </h4>
                                <div className="mt-3">
                                    <input id="nftName" name="nftName" style={{ borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderLeft: "none", borderRight: "none", borderTop: "none", width: "100%" }} type="text" placeholder="e.g. “redeemable Cards with logo”" />
                                </div>
                            </div>
                            <div className="my-4" >
                                <h4> Description <span style={{ fontSize: "80%", fontWeight: "400", color: "gray" }}> (Optional) </span></h4>
                                <div className="mt-3">
                                    <input id="nftDescription" name="nftDescription" style={{ borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderLeft: "none", borderRight: "none", borderTop: "none", width: "100%" }} type="text" placeholder="e.g. “After purchasing you’ll able to get real cards”" />
                                </div>
                            </div>
                            <div className="d-flex">
                                <div style={{ width: "100%" }}>
                                    <div className="my-4">
                                        <h4> Royalties </h4>
                                        <div className="mt-3" style={{ position: "relativ" }}>
                                            <input id="nftRoyalty" name="nftRoyalty" style={{ borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderLeft: "none", borderRight: "none", borderTop: "none", width: "100%" }} type="text" placeholder="e.g. 10%" />
                                            <span style={{ color: "gray", fontSize: "80%", fontWeight: "400", }}> Suggested: 10%, 20%, 30% </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="my-4">
                                <h4>  Properties  <span style={{ fontSize: "80%", fontWeight: "400", color: "gray" }}> (Optional) </span></h4>
                                <div className="mt-3">

                                </div>
                                <div className="mt-3" id="propertyInputs">
                                    {this.state.properties.map((properties, index) => (
                                        <div className="d-flex mb-2">
                                            <input id={`key${index + 1}`} name={`key${index + 1}`} style={{ borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderLeft: "none", borderRight: "none", borderTop: "none", width: "100%", marginRight: "15px" }} type="text" placeholder="e.g. Size" onChange={this.addNewInput} />
                                            <input id={`value${index + 1}`} name={`value${index + 1}`} style={{ borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderLeft: "none", borderRight: "none", borderTop: "none", width: "100%" }} type="text" placeholder="e.g. M" onChange={this.addNewInput} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </form>
                        <div className="my-5">
                            <button className="btn px-4" style={{ backgroundColor: "#e6b000", borderColor: "#e6b000", color: "#fff", fontWeight: "600" }} onClick={this.upload}> Create Now </button>
                        </div>
                    </div>


                    <div className="mb-5" style={{ marginLeft: "50px", order: "2" }}>
                        <h4 className="mb-4"> Preview </h4>
                        <div className="py-4 d-flex justify-content-center align-items-center" style={{ border: "1px solid rgb(221, 221, 221)", borderRadius: "40px", width: "300px", height: "400px", maxWidth: "100%" }}>
                            <div>
                                <div className="text-muted"> {this.state.previewText} </div>

                                <img
                                    src={this.state.selectedFile}
                                    alt=""
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
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
                            <h4>Alerts</h4>
                            <p className="text-muted"> {this.state.loadingText}</p>
                            <div className="mb-3 d-flex">
                                <div className="sweet-loading" style={{marginLeft:"40%",marginRight:"40%"}}>
                                    <ClipLoader css={override} size={60} color={"#123abc"} loading={this.state.modalIsOpen} speedMultiplier={1.5} />
                                </div>
                            </div>


                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default creatSingle;