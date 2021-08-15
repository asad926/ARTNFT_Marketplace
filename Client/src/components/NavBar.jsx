import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Logo01 from '../Icons/art_logo.png';
import search_icon from '../Icons/search-icon.svg';
import getWallet from "../nfts/connectWallet"
import Default_avatar from "../Icons/avatardefault.png";

const { ethereum } = window;
let web3
class navBar extends Component {
    state = {
        metaMask : false,
        account : ""
    }

    componentDidMount() {
        if (this.isMetaMaskInstalled) {
            this.connectToMetaMask();
        }
        else console.log("Please install metamask!!");
        let self = this;
        if(window.ethereum)
        ethereum.on('accountsChanged', async function (accounts) {
            self.connectToMetaMask()
        })

    }

    connectWallet=()=>{
        if (this.isMetaMaskInstalled) {
            this.connectToMetaMask();
        }
        else console.log("Please install metamask!!");

    }

    isMetaMaskInstalled=()=> {
        return Boolean(ethereum && ethereum.isMetaMask);
    }

     connectToMetaMask=async ()=> {
        if (this.isMetaMaskInstalled)
            try {
                //Will Start the MetaMask Extension
                web3 = await getWallet();
                console.log("Web3 :" + web3);
                let accounts = await web3.eth.getAccounts();
                // this.setConnectBtn("Create")
                let acc = accounts[0].substring(0,6)+"......"+accounts[0].substring(36,42)
                this.setState({ metaMask: true, account: acc });

            } catch (error) {
                console.error(error);
            } else console.log("Please install metamask!!");
    }

    render() {
        return (
            <nav className="navbar">
                <ul className="nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            <img src={Logo01} alt="VenlyMarkiet Beta" width="80" />
                            <span className="badge badge-primary ml-2">ART-NFT</span>
                        </Link>
                    </li>
                </ul>


                <ul className="nav">
                    <li className="nav-item input-group navbar_input ">
                        <img style={{ marginRight: "10px", width: "20px" }} alt="" src={search_icon} />
                        <input className="navbar_input" type="text" placeholder="Search Market" />
                    </li>
                </ul>


                <ul className="nav">

                    <li className="nav-item">
                        {this.state.metaMask?
                        <Link to="/collections">
                        <img
                            style={{width:"15%", float: "right"}}
                            className="nav-link"
                            src={Default_avatar}
                            alt=""
                        /><br/>
                        <label style={{float: "right"}}>{this.state.account}</label>
                        </Link>:
                            <div style={{ backgroundColor: "#af48ff", borderColor: "#af48ff", color: "white" }} onClick={this.connectWallet} className="btn nav-link font-weight-bold">Connect</div>
                    }
                    </li>
                </ul>
            </nav>
        );
    }
}

export default navBar;