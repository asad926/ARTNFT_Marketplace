import React, { Component } from 'react';
import art_logo from '../Icons/art_logo.png';
import Twitter from '../Icons/twitter-icon.svg';
import LinkIn from '../Icons/lin-icon.svg';
import Discord from '../Icons/discord.svg';
class Footer extends Component {
    state = {  }
    render() { 
        return ( 
            <div style = {{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexDirection: "column"}}>
                <div style = {{backgroundColor: "#7927ff", display: "flex", justifyContent: "center", width: "100%"}}>
                    <div style = {{width: "842px"}}>
                        <div style = {{height: "200px", display: "flex", justifyContent: "space-between"}}>
                            <div style = {{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                <div style = {{display: "flex", alignItems: "center", marginBottom: "18px"}}>
                                    <img src={art_logo} alt="" width = "100px" />
                                </div>
                                <div style = {{color: "#7927ff", display: "flex"}}>
                                    <a href="https://twitter.com/artnft_io" style = {{marginRight: "11px", textDecorationLine: "none", color: "#7927ff", backgroundColor: "transparent"}}>
                                        <img src={Twitter} alt="" height = "24px" />
                                    </a>
                                    <a href="https://www.linkedin.com/company/artnft-io" style = {{marginRight: "11px", textDecorationLine: "none", color: "#7927ff", backgroundColor: "transparent"}}>
                                        <img src={LinkIn} alt="" height = "24px" />
                                    </a>
                                    <a href="https://discord.gg/7Sn2nHC3Ep" style = {{marginRight: "11px", textDecorationLine: "none", color: "#7927ff", backgroundColor: "transparent"}}>
                                        <img src={Discord} alt="" height = "24px" style = {{backgroundColor: "#fff", borderRadius: "50%", padding: "3px"}} />
                                    </a>
                                </div>
                                
                            </div>
                            <div style = {{display: "flex", alignItems: "center"}}>
                                <div style = {{display: "flex", flexDirection: "column", marginRight: "75px"}}>
                                    <p style = {{fontSize: "16px", lineHeight: "22px", color: "#fff", marginBottom: "10px", fontWeight: "700"}}>Products</p>
                                    <div style = {{fontSize: "16px", lineHeight: "22px", color: "#fff", marginBottom: "10px", textDecorationLine: "none"}}> NFT Tools </div>
                                    <div  style = {{fontSize: "16px", lineHeight: "22px", color: "#fff", textDecorationLine: "none"}}> Art Wallet </div>
                                </div>
                                <div style = {{display: "flex", flexDirection: "column"}}>
                                    <p style = {{fontSize: "16px", lineHeight: "22px", color: "#fff", marginBottom: "10px", fontWeight: "700"}}>Support</p>
                                    <div  style = {{fontSize: "16px", lineHeight: "22px", color: "#fff", marginBottom: "10px", textDecorationLine: "none"}}>  FAQ  </div>
                                    <div  style = {{fontSize: "16px", lineHeight: "22px", color: "#fff", textDecorationLine: "none"}}>  Contact Us  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style = {{backgroundColor: "#590dd7", display: "flex", justifyContent: "center", width: "100%"}}>
                    <div style = {{width: "842px"}}>
                        <div style = {{height: "72px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <div style = {{fontSize: "14px", lineHeight: "19px", color: "#fff"}}>© ArtNft — All rights reserved</div>
                            <div>
                                <div  style = {{marginRight: "32px", fontSize: "14px", lineHeight: "19px", color: "#fff", textDecorationLine: "none"}}> Privacy Policy </div>
                                <div  style = {{marginRight: "32px", fontSize: "14px", lineHeight: "19px", color: "#fff", textDecorationLine: "none"}}> Terms of Use </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default Footer;