import React, { Component } from 'react';
import "./creatSingle_switch.css";
class creatSingle_switch extends Component {
    state = {  }
    render() { 
        return ( 
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
         );
    }
}
 
export default creatSingle_switch;