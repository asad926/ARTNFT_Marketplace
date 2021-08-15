import React, { Component } from "react";
import Default_avatar from "../Icons/avatardefault.png";
import { FiShare2 } from "react-icons/fi";
import Modal from "react-modal";
import getWallet from "../nfts/connectWallet"
import axios from 'axios';
import ItemCard from './ItemCard';
import "./My_Collection.css";
let web3, self, account;
class my_Collection extends Component { 
  
  state = {
    data:[],
    bidData:[],
    myCollection: "myCollection_tabs myCollection_tabs_on",
    my_bids: "myCollection_tabs",
    tab_myCollection: "myCollection_tab_show",
    tab_my_bids: "myCollection_tab_hide",
    modalState: true,
    modalIsOpen: false,
}

componentDidMount(){
self = this;
console.log("Nfts Loeaded.....")
self.loadDB(); 
self.openModal();
if(window.ethereum)
window.ethereum.on('accountsChanged', async function (accounts) {
  self.loadDB(); 
})
}

loadDB = async function(){
  try{
    web3 = await getWallet();
    console.log("Web3: "+ web3);
    account = await web3.eth.getAccounts();
    let link = "/nfts/user/"+account[0];
    let res = await axios.get(link);
    if(res.status === 200){
     console.log("NFTs loaded: "+JSON.stringify(res.data))
     this.setState({data:res.data});

    }
    let url = "/nfts";
    let result = await axios.get(url);
    let bids = [];
    if(result.status === 200){
     result.data.forEach((nft)=>{
       if(nft.auction)
          if(nft.auction.bids.find(e=>e.account === account[0])){
            bids.push(nft);
            console.log("bids loaddeded: " + nft)
          }
       
     })
    }
    this.setState({bidData:bids});
  
  }catch(e){
    console.log(e)
  }
}

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

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  Handle_Show = () => {
    this.setState({ modalState: false });
  };

  Active_myCollection = () => {
    this.setState({ myCollection: "myCollection_tabs myCollection_tabs_on" });
    this.setState({ my_bids: "myCollection_tabs" });
    this.setState({ tab_myCollection: "myCollection_tab_show" });
    this.setState({ tab_my_bids: "myCollection_tab_hide" });
  };
  Active_my_bids = () => {
    this.setState({ myCollection: "myCollection_tabs" });
    this.setState({ my_bids: "myCollection_tabs myCollection_tabs_on" });
    this.setState({ tab_myCollection: "myCollection_tab_hide" });
    this.setState({ tab_my_bids: "myCollection_tab_show" });
  };
  render() {
    return (
      <div style={{ backgroundColor: "#f5f5f5" }}>
        <div style={{ minHeight: "120px" }} className="myCollection_box py-1">
          <div className="d-flex flex-wrap align-items-center my-4">
            <div style={{ marginLeft: "30px" }}>
              <span className="myCollection_ui_avatar">
                <img
                  className="myCollection_ui_avatar_icon"
                  src={Default_avatar}
                  alt=""
                />
              </span>
            </div>
            <div className="btn mx-3 myCollection_share_btn">
              <FiShare2 className="mr-2" />
              <span>SHARE</span>
            </div>
          </div>
          <div className></div>
        </div>
        <div className="myCollection_box">
          <span
            className={this.state.myCollection}
            onClick={this.Active_myCollection}
          >
            My Collection
          </span>
          <span className={this.state.my_bids} onClick={this.Active_my_bids}>
            My Bids
          </span>
          <hr style={{ marginTop: "25px" }} />
        </div>
        <div className="myCollection_box">
          <div className={this.state.tab_myCollection}>
            <div className="d-flex justify-content-end mt-4 pr-2">
              <div className="d-flex align-items-center">
                <span className="mr-3">Sort:</span>
                <select
                  class="form-select myCollection_sort_field"
                  aria-label="Sort"
                >
                  <option selected value="all">
                    All
                  </option>
                  <option value="available_for_sale">Available for sale</option>
                  <option value="most_liked">Most Liked</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="highest_price">Highest price</option>
                  <option value="recently_added">Recently added</option>
                </select>
              </div>
            </div>
            <div className="pb-5">
              <div className="myCollection_list_main_prod justify-content-center">
                {this.state.data.length > 0?
              <div className = "d-flex flex-wrap">
                    {this.state.data.map((el, i) => {
                        return (
                          <div
                            style={{ width: "25%" }}
                          >
                            <div
                              className="ant-col"
                              style={{
                                paddingLeft: 11,
                                paddingRight: 11,
                                flex: "1 1 auto",
                              }}
                            >
                              
                                <ItemCard
                                  nftData={el}
                                />
                            
                            </div>
                          </div>
                        );
                      })}

                     </div>
                     :<div>You have not any NFT... </div>}
              </div>
            </div>
          </div>
          <div className={this.state.tab_my_bids}>
            <div className="d-flex justify-content-end mt-4 pr-2">
              <div className="d-flex align-items-center">
                <span className="mr-3">Sort:</span>
                <select
                  class="form-select myCollection_sort_field"
                  aria-label="Sort"
                >
                  <option selected value="all">
                    All
                  </option>
                  <option value="available_for_sale">Available for sale</option>
                  <option value="most_liked">Most Liked</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="highest_price">Highest price</option>
                  <option value="recently_added">Recently added</option>
                </select>
              </div>
            </div>
            <div className="pb-5">
              <div className="myCollection_list_main_prod justify-content-center">
              {this.state.bidData.length > 0?
              <div className = "d-flex flex-wrap">
                    {this.state.bidData.map((el, i) => {
        
                        return (
                         
                                <ItemCard
                                  nftData={el}
                                />
                            
                        );
                      })}

                     </div>
                     :<div>You don't bid on any NFT... </div>}
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={this.customStyles}
            contentLabel="Example Modal"
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
              <h4 style={{ textAlign: "center" }}> Welcome </h4>
              <div className="mt-4 text-center">
                <label>
                  <span className="myCollection_ui_avatar">
                    <img
                      className="myCollection_ui_avatar_icon"
                      src={Default_avatar}
                      alt=""
                    />
                  </span>
                  <div className="mt-1 text-center">
                    <span style={{ fontSize: "80%", fontWeight: "400" }}>
                      {" "}
                      Choose Profile Picture{" "}
                    </span>
                  </div>
                </label>
              </div>
              <div>
                <div className="mt-3">
                  <h5 style={{ fontWeight: "700" }}> Display Name* </h5>
                  <input
                    className="form-control myCollection_model_form_control"
                    type="text"
                    placeholder="Enter your display name"
                  />
                  <small style={{ color: "#808080" }}>
                    {" "}
                    Only use letters, numbers, underscores and emojis{" "}
                  </small>
                </div>
                <div className="mt-3">
                  <h5 style={{ fontWeight: "700" }}> Bio </h5>
                  <input
                    className="form-control myCollection_model_form_control"
                    type="text"
                    placeholder="Tell us a little about yourself"
                  />
                  <small style={{ color: "#808080" }}> URLs are allowed </small>
                </div>
                <div className="mt-3 text-center">
                  <span class="btn myCollection_model_Next_btn">Next</span>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default my_Collection;
