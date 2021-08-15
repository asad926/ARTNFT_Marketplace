import React, { Component } from 'react';
import SiteSymb from './icon/site_symb.png';
import { FaArrowLeft } from "react-icons/fa";
import axios from 'axios';
const { create } = require('ipfs-http-client')
const ipfs = create({ 
host: "ipfs.infura.io",
port: "5001",
protocol: "https",})
let web3;
let nft1155;
let uploadFile = null;
class creatMultiple extends Component {
    state = {onSale: false }

    nftOnSale = (e)=> {
        this.setState({onSale: e.target.checked});
    }
    state = {onSale: false, 
        selectedFile: null,
        previewText:"Prevlew of your new collectible", 
        properties: [{key:"", value:""}]}
element = React.createRef();

componentDidMount() {
     nft1155 = this.props.data.nft1155;
     web3 = this.props.data.web3;
   
 }

handleInput = async (e) => {
   e.preventDefault()
   const inputFile = e?.target?.files[0];
   uploadFile = inputFile;
   if (inputFile) {
     const base64 = await this.toBase64(inputFile)
     this.setState({selectedFile:base64, previewText:""})
   }

   // document.getElementById('inputfile').click()
 }
toBase64 = file => new Promise((resolve, reject) => {
   const reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = () => resolve(reader.result);
   reader.onerror = error => reject(error);
 });

 addNewInput = ()=>{
     var properties = document.getElementById('propertyInputs').getElementsByTagName("input");
    let p1 =properties[properties.length-2].value;
    let p2 = properties[properties.length-1].value;
    if(p1 !== "" && p2 !== ""){
         this.setState({
       properties: this.state.properties.concat([{key: "", value: ""}])
     });
    }
   
 }


async nftContract(nftsURI,royalty,tokenSupply) {
let account = await web3.eth.getAccounts();

let supply = await nft1155.methods.totalNftTypes().call();
let id = parseInt(supply);
const nftTransaction = await nft1155.methods.mint(id+1,[[account[0],parseInt(royalty)*100]],parseInt(tokenSupply),"/"+(id+1)).send({from:account[0]});
}

async addedToIpfs() {
const added = await ipfs.add(uploadFile, {
progress: (prog) => console.log(`received: ${prog}`),
});
let v1CID = added.cid.toV1()
return v1CID.toBaseEncodedString('base32');
}

upload = async()=>{

let formD = document.forms["nftDetails"];
let data = new FormData(formD);
let royalty = formD.elements["nftRoyalty"].value;
let tokenSupply = formD.elements["nftSupply"].value;
console.warn(uploadFile);
let v1CID = await this.addedToIpfs();

data.append("ipfsHash",v1CID);
let link = "http://localhost:9000/upload";
try{
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
         console.log(JSON.stringify(response.data.nftsURI))
         let nftsURI = response.data.nftsURI;
         this.nftContract(nftsURI, royalty, tokenSupply);
     } else {
         console.log("Error occurred")
     }
 }
).catch(e => {
console.log(e)
})

}catch(e){
console.log(e)
}
}

    render() { 
        return ( 
            <div>
                <div className = "my-4" onClick={this.props.action}>
                    <h5 className = "ml-4" style = {{}}>
                        <span style = {{cursor: "pointer", userSelect: "none"}}>
                        <FaArrowLeft />
                            Manage collectible type 
                        </span>
                    </h5>
                </div>
                <h3 className = "ml-5"><span> Create Multiple Collectible </span></h3>
                <div className = "creatSingle_boxed d-flex flex-wrap pt-4">
                    
                    <div className = "pb-5">
                    <form className = "form" id="nftDetails" encType="multipart/form-data">
                        <div className = "mb-4">
                            <h4> Upload file: </h4>
                            <div className = "text-center p-4 mt-4 mb-4" style = {{border: "2px dashed rgb(221, 221, 221)", borderRadius: "40px"}}>
                                <label htmlFor="nft_file" className = "my-3">
                                    <span className = "btn" style = {{borderRadius: "50px", backgroundColor: "#e6b000", border: "1px solid #e6b000", color: "white", fontWeight: "600"}}> Choose file </span>
                                </label>
                                <div className = "text-muted"> PNG, GIF, WEBP, MP4 or MP3. Max 30mb </div>
                                <input type="file" onChange={this.handleInput} id="nft_file" name="nft_file" accept="image/png,image/jpeg,image/gif,image/webp,image/avif,video/mp4,video/x-m4v,video/quicktime,video/*" style={{display:'none'}}/>
                            </div>
                        </div>
                        <div className = "my-4">
                            <div className = "d-flex justify-content-between">
                                <div>
                                    <h4> Put on sale </h4>
                                    <div className = "text-muted"> You’ll receive bids on this item </div>
                                </div>
                                <div className = "mb-2">
                                    <label className = "switch">
                                        <input type="checkbox" onChange={this.nftOnSale} />
                                        <span className = "slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {this.state.onSale?
                        <div className = "my-4">
                        <h4>Instant sale price</h4>
                        <p className = "text-muted"> Enter the price for which the item will be instantly sold </p>
                        <div className = "mb-3 d-flex">
                            <input type="text" id="nftPrice" name="nftPrice" className = "creatSingle_switch_formControl" style = {{width: "100%", borderBottom: "1px solid hsla(0,0%,39.2%,.2)"}} />
                            <select className = "ml-3 creatSingle_switch_formControl" style = {{borderBottom: "1px solid hsla(0,0%,39.2%,.2)"}} name="tokenType" id="tokenType">
                                <option style = {{height: "2em"}} value="eth">BNB</option>
                                <option style = {{height: "2em"}} value="exis"> DOG </option>
                            </select>
                        </div>
                    </div>
                        :<> </>}
                        <div className = "my-4">
                            <h4> Choose collection </h4>
                            <div className = "mt-3 d-flex">
                                <div className = "align-items-center text-center bg-light  align-items-center justify-content-center" style = {{width: "100px", height: "100px", borderRadius: "20px", border: " 1px solid hsla(0,0%,39.2%,.2)", cursor: "pointer", }}>
                                    <img src={SiteSymb} alt="not found!" style = {{width: "50px", height: "50px",marginTop: "10px"}} />
                                    <span className = "" style = {{fontWeight: "700", fontSize: "80%"}}> JGNNFT </span>
                                </div>
                            </div>
                        </div>
                        <div className = "my-4">
                            <h4> Name </h4>
                            <div className = "mt-3">
                                <input id="nftName" name="nftName" style = {{borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderLeft: "none", borderRight: "none", borderTop: "none", width: "100%"}} type="text" placeholder="e.g. “redeemable Cards with logo”" />
                            </div>
                        </div>
                        <div className = "my-4">
                            <h4> Description <span style = {{fontSize: "80%", fontWeight: "400", color: "gray"}}> (Optional) </span></h4>
                            <div className = "mt-3">
                                <input id="nftDescription" name="nftDescription" style = {{borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderLeft: "none", borderRight: "none", borderTop: "none", width: "100%"}} type="text" placeholder="e.g. “After purchasing you’ll able to get real cards”" />
                            </div>
                        </div>
                        <div className = "d-flex">
                            <div style = {{width: "100%"}}>
                                <div className = "my-4">
                                    <h4> Royalties </h4>
                                    <div className = "mt-3" style = {{position: "relativ"}}>
                                        <input id="nftRoyalty" name="nftRoyalty" style = {{borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderLeft: "none", borderRight: "none", borderTop: "none", width: "100%"}} type="text" placeholder="e.g. 10%" />
                                        <span style = {{top: "5px", right: "10px", position: "absolute", color: "gray"}}>%</span>
                                        <span style = {{color: "gray", fontSize: "80%", fontWeight: "400",}}> Suggested: 10%, 20%, 30% </span>
                                    </div>
                                </div>
                            </div>
                            <div className = "ml-3" style = {{width: "100%"}}>
                                <div className = "my-4">
                                    <h4> Number of copies </h4>
                                    <div className = "mt-3" style = {{position: "relativ"}}>
                                        <input id="nftSupply" name="nftSupply" style = {{borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderLeft: "none", borderRight: "none", borderTop: "none", width: "100%"}} type="text" placeholder="e.g. 10" />
                                        <span style = {{top: "5px", right: "10px", position: "absolute", color: "gray"}}>%</span>
                                        <span style = {{color: "gray", fontSize: "80%", fontWeight: "400",}}> Amount of tokens </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className = "my-4">
                            <h4>  Properties  <span style = {{fontSize: "80%", fontWeight: "400", color: "gray"}}> (Optional) </span></h4>
                            <div className = "mt-3">
                                
                            </div>
                            <div className = "mt-3" id="propertyInputs">
                            {this.state.properties.map((properties, index) => (
                                <div className = "d-flex mb-2">
                                    <input id={`key${index + 1}`} name={`key${index + 1}`} style = {{borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderLeft: "none", borderRight: "none", borderTop: "none", width: "100%", marginRight: "15px"}} type="text" placeholder="e.g. Size" onChange={this.addNewInput} />
                                    <input id={`value${index + 1}`} name={`value${index + 1}`} style = {{borderBottom: "1px solid hsla(0,0%,39.2%,.2)", borderLeft: "none", borderRight: "none", borderTop: "none", width: "100%"}} type="text" placeholder="e.g. M" onChange={this.addNewInput} />
                                </div>
                            ))}
                            </div>
                        </div>
                        
                        </form>
                        <div className = "my-5">
                            <button onClick={this.upload} className = "btn px-4" style = {{backgroundColor: "#e6b000", borderColor: "#e6b000", color: "#fff", fontWeight: "600"}}> Create Now </button>
                        </div>
                    </div>

                    <div className = "mb-5" style = {{marginLeft: "50px", order: "2"}}>
                        <h4 className = "mb-4"> Preview </h4>
                        <div className = "py-4 d-flex justify-content-center align-items-center" style = {{border: "1px solid rgb(221, 221, 221)", borderRadius: "40px", width: "300px", height:"400px", maxWidth: "100%"}}>
                        <div>
                        <div className = "text-muted"> {this.state.previewText} </div>

                                        <img
                                          src={this.state.selectedFile}
                                          alt=""
                                          style={{ width: "100%"}}
                                        />
                                      </div>
                        </div>
                    </div>
                    
                </div>
            </div>
         );
    }
}
 
export default creatMultiple;