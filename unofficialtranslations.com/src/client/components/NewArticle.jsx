import React from 'react';

class NewArticle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form action="/rest/create" method="post">
                <div>
                    <label for="endpointTitle">Endpoint: </label>
                    <input type="text" id="endpointTitle" name="endpointTitle" />
                </div>
                <div>
                    <label for="sourceLanguageTitle">Source language title: </label>
                    <input type="text" id="sourceLanguageTitle" name="sourceLanguageTitle" />
                </div>
                <div>
                    <label for="sourceLanguageText">Source language text: </label>
                    <textarea id="sourceLanguageText" name="sourceLanguageText" />
                </div>
                <div>
                    <label for="targetLanguageTitle">Target language title: </label>
                    <input type="text" id="targetLanguageTitle" name="targetLanguageTitle" />
                </div>
                <div>
                    <label for="targetLanguageText">Target language text: </label>
                    <textarea id="targetLanguageText" name="targetLanguageText" />
                </div>
                <div>
                    <label for="link">Link to original article: </label>
                    <input type="text" id="link" name="link" />
                </div>
                <div>
                    <label for="password">Admin password: </label>
                    <input type="text" id="password" name="password" />
                </div>            
                <div class="button">
                    <button type="submit">Submit</button>
                </div>
            </form>
        );
    }
}

module.exports = NewArticle;