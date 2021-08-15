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
    console.log("Nfts Loeaded.....")
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
        console.log("NFTs loaded: " + JSON.stringify(res.data))

        this.setState({ data: res.data });
        console.log("Data loaded:" + JSON.stringify(res.data[0].info[0].nftID))
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
          <div className="container-fluid" style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="button" className="btn" data-toggle="collapse" data-target="#filter">Filter Items</button>
            <button type="button" className="btn" data-toggle="" data-target="">Latest First</button>
          </div>
          <div id="filter" className="collapse pt-5" style={{ backgroundColor: "white" }}>
            <div className="d-flex flex-wrap justify-content-center">
              <div style={{ marginRight: "150px" }}>
                <h4>Type</h4>
                <input style={{ cursor: "pointer" }} id="alll" type="radio" name="type" value="all" />
                <label className="pl-4" style={{ cursor: "pointer" }} htmlFor="alll">All</label>
                <br />
                <input style={{ cursor: "pointer" }} id="auction" type="radio" name="type" value="auction" />
                <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="auction">Auction</label>
                <br />
                <input style={{ cursor: "pointer" }} id="directSale" type="radio" name="type" value="directSale" />
                <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="directSale">Direct Sale</label>
              </div>
              <div className="" style={{ marginRight: "150px" }}>
                <h4>Collection</h4>
                <div className="d-flex">
                  <span className="p-2">
                    <FaSearch style={{ color: "#7927ff", width: "10px" }} />
                  </span>
                  <input type="text" name="" id="search_collection" placeholder="Search Collection" />
                </div>
                <div className="" style={{ height: "85px", overflow: "auto" }}>
                  <input style={{ cursor: "pointer" }} id="collection_all" type="radio" name="collection" value="collection_all" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="collection_all">All</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="0xBitcoinMemes" type="radio" name="collection" value="0xBitcoinMemes" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="0xBitcoinMemes">0xBitcoinMemes</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="6ix9ineDigitalCollection" type="radio" name="collection" value="6ix9ineDigitalCollection" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="6ix9ineDigitalCollection">6ix9ine Digital Collection</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="AhegaoDAO-MaticNFTs" type="radio" name="collection" value="AhegaoDAO-MaticNFTs" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="AhegaoDAO-MaticNFTs">Ahegao DAO - Matic NFTs</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="asset" type="radio" name="collection" value="asset" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="asset">ASSET</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="battle_racers" type="radio" name="collection" value="battle_racers" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="battle_racers">Battle Racers</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="BFH_Unit" type="radio" name="collection" value="BFH_Unit" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="BFH_Unit">BFH:Unit</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="BigFatSexyCollectibleCard" type="radio" name="collection" value="BigFatSexyCollectibleCard" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="BigFatSexyCollectibleCard">Big Fat Sexy Collectible Card</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="BlastPremierChickenCoop" type="radio" name="collection" value="BlastPremierChickenCoop" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="BlastPremierChickenCoop">Blast Premier Chicken Coop</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="BlockTimeBuddies" type="radio" name="collection" value="BlockTimeBuddies" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="BlockTimeBuddies">BlockTimeBuddies</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="BruceTheGoose_L2" type="radio" name="collection" value="BruceTheGoose_L2" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="BruceTheGoose_L2">BruceTheGoose L2</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="ChiaraMagni" type="radio" name="collection" value="ChiaraMagni" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="ChiaraMagni">Chiara Magni</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="ChristmasSpecial2020" type="radio" name="collection" value="ChristmasSpecial2020" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="ChristmasSpecial2020">Christmas Special 2020</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="CoinArtist50K" type="radio" name="collection" value="CoinArtist50K" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="CoinArtist50K">Coin Artist 50K</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="Cr0wn_Gh0ul" type="radio" name="collection" value="Cr0wn_Gh0ul" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="Cr0wn_Gh0ul">Cr0wn_Gh0ul</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="CryptoColosseum" type="radio" name="collection" value="CryptoColosseum" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="CryptoColosseum">Crypto Colosseum</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="CryptoPick" type="radio" name="collection" value="CryptoPick" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="CryptoPick">CryptoPick</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="CryptoWaggles" type="radio" name="collection" value="CryptoWaggles" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="CryptoWaggles">CryptoWaggles</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="DeTijd" type="radio" name="collection" value="DeTijd" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="DeTijd">De Tijd</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="Digivatar_ProfanityParaffins" type="radio" name="collection" value="Digivatar_ProfanityParaffins" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="Digivatar_ProfanityParaffins">Digivatar - Profanity Paraffins Collection</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="eeth" type="radio" name="collection" value="eeth" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="eeth">EETHs</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="EmblemVaultV2" type="radio" name="collection" value="EmblemVaultV2" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="EmblemVaultV2">Emblem Vault V2</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="Ethermon" type="radio" name="collection" value="Ethermon" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="Ethermon">Ethermon</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="Flight" type="radio" name="collection" value="Flight" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="Flight">Flight</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="Fruit" type="radio" name="collection" value="Fruit" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="Fruit">Fruit</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="IndelibleInk" type="radio" name="collection" value="IndelibleInk" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="IndelibleInk">Indelible Ink</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="jade_landf0wl" type="radio" name="collection" value="jade_landf0wl" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="jade_landf0wl">jade_landf0wl</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="JurassicAsylum" type="radio" name="collection" value="JurassicAsylum" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="JurassicAsylum">Jurassic Asylum</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="KiwiNFT" type="radio" name="collection" value="KiwiNFT" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="KiwiNFT">KiwiNFT</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="KredeumNFTs" type="radio" name="collection" value="KredeumNFTs" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="KredeumNFTs">Kredeum NFTs</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="LoganPaulDigitalCollectibles" type="radio" name="collection" value="LoganPaulDigitalCollectibles" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="LoganPaulDigitalCollectibles">Logan Paul Digital Collectibles</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="MARBLE-NFT" type="radio" name="collection" value="MARBLE-NFT" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="MARBLE-NFT">MARBLE-NFT</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="MarcoModonesi" type="radio" name="collection" value="MarcoModonesi" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="MarcoModonesi">Marco Modonesi</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="MATIC_SAINTS" type="radio" name="collection" value="MATIC_SAINTS" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="MATIC_SAINTS">MATIC SAINTS</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="Meowximus" type="radio" name="collection" value="Meowximus" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="Meowximus">Meowximus</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="MoCDA_Exhibitions" type="radio" name="collection" value="MoCDA_Exhibitions" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="MoCDA_Exhibitions">MoCDA Exhibitions</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="MyGallery" type="radio" name="collection" value="MyGallery" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="MyGallery">MyGallery</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="NeonDistrict" type="radio" name="collection" value="NeonDistrict" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="NeonDistrict">Neon District</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="NFTs_tipsFoundation" type="radio" name="collection" value="NFTs_tipsFoundation" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="NFTs_tipsFoundation">NFTs.tips Foundation</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="NonFungibleMatic_V2" type="radio" name="collection" value="NonFungibleMatic_V2" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="NonFungibleMatic_V2">Non-Fungible Matic V2</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="OpenNFTs" type="radio" name="collection" value="OpenNFTs" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="OpenNFTs">Open NFTs</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="PolygonNFT_Minter" type="radio" name="collection" value="PolygonNFT_Minter" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="PolygonNFT_Minter">Polygon NFT Minter</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="Puzzle_in_aBag" type="radio" name="collection" value="Puzzle_in_aBag" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="Puzzle_in_aBag">Puzzle in a Bag</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="SapienMedicine" type="radio" name="collection" value="SapienMedicine" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="SapienMedicine">Sapien Medicine</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="TOKENIZED_TWEETS" type="radio" name="collection" value="TOKENIZED_TWEETS" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="TOKENIZED_TWEETS">TOKENIZED TWEETS</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="TradeRaceManager_byIOI" type="radio" name="collection" value="TradeRaceManager_byIOI" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="TradeRaceManager_byIOI">Trade Race Manager by IOI</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="UniqueOne" type="radio" name="collection" value="UniqueOne" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="UniqueOne">Unique One</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="Venly" type="radio" name="collection" value="Venly" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="Venly">Venly</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="WakaWakasArcades" type="radio" name="collection" value="WakaWakasArcades" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="WakaWakasArcades">WakaWakas Arcades</label>
                  <br />
                  <input style={{ cursor: "pointer" }} id="WiV_Wine" type="radio" name="collection" value="WiV_Wine" />
                  <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="WiV_Wine">WiV Wine</label>
                </div>
              </div>
              <div className="">
                <h4>Blockchain</h4>
                <input style={{ cursor: "pointer" }} id="blockchain_all" type="radio" name="blockchain" value="blockchain_all" />
                <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="blockchain_all">All</label>
                <br />
                <input style={{ cursor: "pointer" }} id="bsc" type="radio" name="blockchain" value="bsc" />

                <label style={{ cursor: "pointer" }} className="pl-4" htmlFor="bsc"><img style={{ width: "20px" }} src={bsc_logo} alt="not found" />BSC</label>
              </div>
            </div>
          </div>
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