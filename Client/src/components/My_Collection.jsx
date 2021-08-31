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
    data: [],
    bidData: [],
    myCollection: "myCollection_tabs myCollection_tabs_on",
    my_bids: "myCollection_tabs",
    tab_myCollection: "myCollection_tab_show",
    tab_my_bids: "myCollection_tab_hide",
    modalState: true,
    modalIsOpen: false,
    selectedFile: null,
    user: {}
  }

  componentDidMount() {
    self = this;
    self.loadDB();
    if (window.ethereum)
      window.ethereum.on('accountsChanged', async function (accounts) {
        self.loadDB();
      })
  }

  upload = async () => {
    // this.setState({loadingText:"Uploading NFT Image to Server..."})
    // this.openModal();

    let formD = document.forms["userData"];
    let data = new FormData(formD);
    data.append("account", account[0])

    let link = "/save";
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
            this.closeModal();
            localStorage.setItem("userData", response.data);
            this.setState({ user: response.data });
            let profileImage = response.data.pic;
            console.log("Profile Pic: " + profileImage)
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

  loadDB = async function () {
    let self = this;
    try {
      web3 = await getWallet();
      account = await web3.eth.getAccounts();
      const userNfts = axios.get("/nfts/user/" + account[0]);
      const userData = axios.get("/user/" + account[0]);
      const nfts = axios.get("/nfts");
      // you could also use destructuring to have an array of responses
      await axios.all([userNfts, userData, nfts]).then(axios.spread(function (res1, res2, res3) {
        console.log(res1.data);
        self.setState({ data: res1.data });
        console.log(res2.data);
        if(!res2.data) self.openModal();
        self.setState({ user: res2.data });
        console.log(res3.data);
        var bids;
        res.data.forEach((nft) => {
                  if (nft.auction)
                    if (nft.auction.bids.find(e => e.account === account[0])) {
                      bids.push(nft);
                    }
                })
                self.setState({ bidData: bids });
      }));
        } catch (e) {
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

    handleInput = async (e) => {
      e.preventDefault()
      const inputFile = e?.target?.files[0];
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

    render() {
      return (
        <div style={{ backgroundColor: "#f5f5f5" }}>
          <div style={{ minHeight: "120px" }} className="myCollection_box py-1">
            <div className="d-flex flex-wrap align-items-center my-4">
              <div style={{ marginLeft: "30px" }}>
                <span onClick={this.openModal} className="myCollection_ui_avatar">
                  <img
                    className="myCollection_ui_avatar_icon"
                    src={!this.state.user.pic ? Default_avatar : "http://" + this.state.user.pic}
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
                <div className="justify-content-center">
                  {this.state.data.length > 0 ?
                    <div className="d-flex flex-wrap">
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
                    : <div>You have not any NFT... </div>}
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
                  {this.state.bidData.length > 0 ?
                    <div className="d-flex flex-wrap">
                      {this.state.bidData.map((el, i) => {

                        return (

                          <ItemCard
                            nftData={el}
                          />

                        );
                      })}

                    </div>
                    : <div>You don't bid on any NFT... </div>}
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
                <form className="form" id="userData" encType="multipart/form-data">
                  <div className="mt-4 text-center">
                    <label for="profile_pic">
                      <span className="myCollection_ui_avatar">
                        <img
                          className="myCollection_ui_avatar_icon"
                          src={this.state.selectedFile?this.state.selectedFile:this.state.user.pic ?"http://"+this.state.user.pic: Default_avatar}
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
                    <input onChange={this.handleInput} type="file" id="profile_pic" name="profile_pic" style={{ display: 'none' }} />
                  </div>
                  <div>
                    <div className="mt-3">
                      <h5 style={{ fontWeight: "700" }}> Display Name* </h5>
                      <input
                        id="user_name"
                        name="user_name"
                        className="form-control myCollection_model_form_control"
                        type="text"
                        placeholder="Enter your display name"
                        value={this.state.user.name}
                      />
                      <small style={{ color: "#808080" }}>
                        {" "}
                        Only use letters, numbers, underscores and emojis{" "}
                      </small>
                    </div>
                    <div className="mt-3">
                      <h5 style={{ fontWeight: "700" }}> Bio </h5>
                      <input
                        id="user_bio"
                        name="user_bio"
                        className="form-control myCollection_model_form_control"
                        type="text"
                        placeholder="Tell us a little about yourself"
                        value={this.state.user.bio}
                      />
                      <small style={{ color: "#808080" }}> URLs are allowed </small>
                    </div>
                    <div className="mt-3 text-center">
                      <span onClick={this.upload} class="btn myCollection_model_Next_btn">Save</span>
                    </div>
                  </div>
                </form>
              </div>
            </Modal>
          </div>
        </div>
      );
    }
  }

  export default my_Collection;
