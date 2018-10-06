import React from 'react';

class NewArticle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form action="/rest" method="post">
                <div>
                    <label for="endpoint-title">Endpoint:</label>
                    <input type="text" id="endpoint-title" name="endpoint-title" />
                </div>
                <div>
                    <label for="link">Link to original article:</label>
                    <input type="text" id="link" name="link" />
                </div>
                <div>
                    <label for="password">Admin password:</label>
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