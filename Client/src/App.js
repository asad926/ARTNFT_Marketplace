import MainPage from './creatForm/mainPage'
import React, {Component} from 'react';
import './App.css';
import NaveBar from './components/NavBar';
import Home from './Home';
import ItemCardDetail from './components/ItemCardDetail';
import MyCollections from './components/My_Collection';
import Footer from './components/Footer';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

class App extends Component {
  state = {
 };

 render () {
  return ( 
    <BrowserRouter>
     <NaveBar />
        <Switch>
          <Route path='/' component = {Home} exact/>
          <Route path = '/nft/:id' component = {ItemCardDetail} />
          <Route path = '/create' component = {MainPage} />
          <Route path = '/collections' component = {MyCollections} />
        </Switch>
      <Footer />
    </BrowserRouter>
  );
  }
}

export default App;


