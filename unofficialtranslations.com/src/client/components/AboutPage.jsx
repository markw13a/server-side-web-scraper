import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

class AboutPage extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return(
            <div className="Page AboutPage">
                <NavBar />
                    <div className="container">
                        This site is a repository for various bits and pieces that I have translated for practice. If you need to contact me, you can do so by sending an email to admin@unofficialtranslations.com
                    </div>
                <Footer />
            </div>
        );
    }
}

module.exports = AboutPage;