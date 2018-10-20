import React from 'react';
import { render } from 'react-dom';

import NewArticle from './components/NewArticle';
import DeletePage from './components/DeletePage';
import IndexPage from './components/IndexPage';
import ArticlePage from './components/ArticlePage';
import AboutPage from './components/AboutPage';
import ErrorPage from './components/ErrorPage';

const pages = {
    article: ArticlePage,
    about: AboutPage,
    rest:{
        delete: DeletePage,
        create: NewArticle
    }
};

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pathname: null
        }
    };

    componentWillMount() {
        this.setState({pathname: window.location.pathname});
    }

    render() {
        const {pathname} = this.state;

        // first entry will always be [""]
        const pathBits = pathname.split("/").slice(1);

        // Iterate through pages object
        // Should return a React Component to be used
        // IndexPage is set as a default below
        let Page = pathBits.reduce( (pages, pathBit) => {
            // Want to stop if we have already found a React Component
            if ( React.Component.isPrototypeOf(pages) ) return pages;
            
            if( !pages ) return null;
            
            return pages[pathBit];
        }, pages);

        if( !Page ) Page = IndexPage;

        return <Page />;
    };
}

render(
    <Main />,
    document.querySelector('body')
);

module.exports = Main;