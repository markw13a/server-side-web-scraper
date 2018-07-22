import React from "react";

class NavBar extends React.Component {
    render(){
        return (
            <div className="nav-bar">
			    <div id = "black-background"></div>
			    <a href="/">
				    <img src="/images/logo.png" alt="home" />
			    </a>
		    </div>
        );
    }
}

module.exports =  NavBar;