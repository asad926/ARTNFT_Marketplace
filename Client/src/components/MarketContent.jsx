import React, { Component } from 'react';
import ItemCard from './ItemCard';
class marketContent extends Component {
    state = {  }
    render() { 
        return (  
            <div className = "d-flex flex-wrap">
                <ItemCard />
                <ItemCard />
                <ItemCard />
                <ItemCard />
                <ItemCard />
            </div>
        );
    }
}
 
export default marketContent;