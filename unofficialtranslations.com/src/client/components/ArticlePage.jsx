import React from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import Footer from './Footer';

class ArticlePage extends React.Component {
    constructor(props){
        super(props);

        const articleName = window.location.pathname.match(/article\/([^\/]*$)/);
        const endpointTitle = articleName && articleName[1] ? articleName[1] : null;

        this.state = {
            endpointTitle,
            data: {
                value: null,
                resolved: false
            },
            sourceOrTarget: "targetLanguage"
        };
    };

    // retrieve article data from back-end
    componentDidMount() {
        const {endpointTitle} = this.state;
        axios.get('/rest/get' + '/' + endpointTitle)
            .then(value => {
                this.setState({data: {value: value.data.data[0], resolved: true}});
            });
    };

    render() {
        const {sourceOrTarget} = this.state;
        let {value, resolved} = this.state.data;
        
        return (
            <div className="ArticlePage Page"> 
                <NavBar />
                {resolved ?
                    <div className="container">
                        <div className="other">
                            <LanguageSwitcher article={value} sourceOrTarget={sourceOrTarget} thisRef={this} />
                            <a href={value.link} target="_blank">Original article >></a>                      
                        </div>
                        <Article article={value} sourceOrTarget={sourceOrTarget} />
                    </div> 
                    : null}
                <Footer />
            </div>
        );
    };
}

/**
 * @param articles json object containing article data
 */
const Article = ({article, sourceOrTarget}) => {
    if( !article ) {
        console.warn("No data found for given endpointTitle", article);
        return null;
    }
    return (
            <div className="article">
                <h2 className="title">{article[sourceOrTarget + 'Title']}</h2>
                <div className="imgContainer"><img src={article.image} /></div>                    
                <div className="blurb"><small>{article.blurb}</small></div>
                <div className="text" dangerouslySetInnerHTML={{__html: article[sourceOrTarget + 'Text']}} />
            </div>
    );
};


const LanguageSwitcher = ({article, sourceOrTarget, thisRef}) => {
    return (
        <div className="languageSwitcher"> 
            <label for="targetLanguage" className={sourceOrTarget === 'targetLanguage' ? 'checked' : ''}>
                <input type="checkbox" id="targetLanguage" name="targetLanguage" onChange={() => {thisRef.setState({sourceOrTarget: "targetLanguage"})}} />
                {article.targetLanguage}
            </label>
            <label for="sourceLanguage" className={sourceOrTarget === 'sourceLanguage' ? 'checked' : ''}>
                <input type="checkbox" id="sourceLanguage" name="sourceLanguage" onChange={() => {thisRef.setState({sourceOrTarget: "sourceLanguage"})}}></input>
                {article.sourceLanguage}
            </label>
        </div>
    );
};

module.exports = ArticlePage;