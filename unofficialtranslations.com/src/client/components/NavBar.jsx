import React from 'react';

class NavBar extends React.Component {
    constructor(props){
        super(props);
    }
    
    render(){
        return (
            <div className="NavBar">
                <ul>
                    <li><a href="/"> Home </a></li>
                    <li><a href="/about"> About </a></li>
                </ul>
            </div>
        );
    }
}

module.exports = NavBar;