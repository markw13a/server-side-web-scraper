import React from 'react';
import {
    initDB, 
    downloadJobs} from '../../../resources/C';

class JobListings extends React.Component {
    constructor(props){
        super(props);

        const db = {
            value: initDB(),
            ready: false
        }
        const data = {
            value: db.value.then(db => downloadJobs({db})),
            ready: false
        }

        this.state = {
            db,
            data
        };
    }
    componentDidMount(){
        const {db, data} = this.state;
        //Set flag to show asynchronous bits are ready for use.
        //Doesn't seem to be a nicer way to handle this. Tolerable for now.
        db.value.then(value => this.setState({db: {value, ready: true}}));
        data.value.then(value => this.setState({data: {value, ready: true}}));
    }
    render() {
        const {req} = this.props;
        const {db, data} = this.state;

        if(!data.ready) return <h1>Loading</h1>;

        return (
            <div>
                <SearchBox />
                {data.value}
            </div>
        );
    }
}

const SearchBox = () => {
    return(
        <form action="/jobs" method="get">
            <input type="text" name="query" />
            <input type="submit" value="Search" />
        </form>
    );
};

const fetchDataFromDB = () => {
    return {};
};

module.exports = {
    JobListings,
    SearchBox
};
