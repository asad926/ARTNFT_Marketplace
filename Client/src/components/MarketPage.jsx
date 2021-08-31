import React, { Component } from 'react';
import bsc_logo from '../Icons/bsc-logo.svg';
import { FaSearch } from "react-icons/fa";
import UpperBody from './UpperBody';
import ItemCard from './ItemCard';
import { Link } from "react-router-dom";
import axios from 'axios';

class MarketPage extends Component {

  state = {
    data: []
  }

  componentDidMount() {
    let self = this;
    this.loadDB();
    if(window.etherem)
    window.ethereum.on('accountsChanged', async function (accounts) {
      self.loadDB()
    })
  }

  loadDB = async function () {
    try {
      let link = "/nfts";
      let res = await axios.get(link);
      if (res.status === 200) {

        this.setState({ data: res.data });
      }

    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <ul className="nav nav-tabs justify-content-center" role="tablist">
          <li className="nav-item">
            <a className="nav_link_tab_decoration nav-link active" data-toggle="tab" href="#all">All</a>
          </li>
          <li className="nav-item">
            <a className="nav_link_tab_decoration nav-link" data-toggle="tab" href="#digitalArt">Digital Art</a>
          </li>
          <li className="nav-item">
            <a className="nav_link_tab_decoration nav-link" data-toggle="tab" href="#gameItems">Game Items</a>
          </li>
          <li className="nav-item">
            <a className="nav_link_tab_decoration nav-link" data-toggle="tab" href="#collectibles">Collectibles</a>
          </li>
          <li className="nav-item">
            <a className="nav_link_tab_decoration nav-link" data-toggle="tab" href="#collectibles">Art Tickets</a>
          </li>
          <li className="nav-item">
            <div className="nav_link_tab_decoration nav-link" data-toggle="tab" href="#collectibles"></div>
          </li>
          <li className="nav-item">
            <Link to={"/create"}><label className="nav_link_tab_decoration nav-link">Create</label></Link>
          </li>
        </ul>
        <UpperBody />
        <div className="tab-content" style={{ backgroundColor: "rgb(243, 244, 247)" }}>
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
                      nftData = {el}
                    />

                  </div>
                </div>
              );
            })}

          </div>

        </div>
      </div>
    );
  }
}

export default MarketPage;