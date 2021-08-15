import React, { Component } from 'react';
import TRMbanner from '../Icons/TRM-banner.jpeg';
import "./UpperBody.css";
class upperBody extends Component {
    state = {  }
    render() { 
        return ( 
            <div className = "upperbody_category_banner">
                <div className = "market-content-container">
                    <div style = {{order: ""}}>
                        <div style = {{fontWeight: "700", fontSize: "36px", lineHeight: "120%", color: "white", width: "325px", marginBottom: "20px"}}>
                            Neon District: Exclusive new items added
                        </div>
                        <button className = "btn" style = {{height: "37px", color: "#fff", backgroundColor: "#7927ff", borderColor: "#7927ff", fontWeight: "700"}}> Explore items </button>
                    </div>
                    <img src={TRMbanner} alt="" height = "261px" />
                </div>
                
            </div>
         );
    }
}
 
export default upperBody;