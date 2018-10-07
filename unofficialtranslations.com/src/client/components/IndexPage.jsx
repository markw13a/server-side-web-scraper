import React from 'react';
import axios from 'axios';

class IndexPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            data: {
                value: null,
                resolved: false
            }
        };
    };

    // retrieve article data from back-end
    componentDidMount() {
        axios.get('http://unofficialtranslations.com/rest/get')
            .then(value => {
                this.setState({data: {value: value.data.data, resolved: true}});
            });
    };

    render() {
        const {value, resolved} = this.state.data;

        return (
            <div className="IndexPage"> 
                {resolved ? <ArticlesList articles={this.state.data.value} /> : null}
            </div>
        );
    };
}

/**
 * @param articles json object containing info on articles
 */
const ArticlesList = ({articles}) => {
    if( !articles ) return null;

    return (
        articles.map( article => (
            <div className="article">
                <h2>{article.targetLanguageTitle}</h2>
                <small>{article.date}</small>
                <img src={article.image} />
                <div className="blurb">{article.blurb}</div>
            </div>
        ))
    );
};

module.exports = IndexPage;