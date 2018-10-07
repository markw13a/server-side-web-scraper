import React from 'react';
import { render } from 'react-dom';

import NewArticle from './components/NewArticle';
import DeletePage from './components/DeletePage';
import IndexPage from './components/IndexPage';
import ErrorPage from './components/ErrorPage';

const pages = {
    '/': IndexPage,
    '/rest/delete': DeletePage,
    '/rest/create': NewArticle
}

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
        const Page = pages[pathname] || ErrorPage;

        return <Page />;
    };
}

render(
    <Main />,
    document.querySelector('body')
);

module.exports = Main;