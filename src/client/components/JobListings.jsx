import React from 'react';
import {
    updateQueryParam, 
    sortByCategory
} from '../C';

class JobListings extends React.Component {
    constructor(props){
        super(props);

        const data = {
            value: fetch("/data/opportunities"),
            ready: false
        }

        this.state = {
            data,
            params: {}
        };
    }
    componentDidMount(){
        const {data, params} = this.state;
        const {sortBy} = params;
        console.warn(this.state);
        //Set flag to show asynchronous data is ready for use.
        //Doesn't seem to be a nicer way to handle this. Tolerable for now.
        data.value
        .then(results => results.json())
        .then(value => {
            sortByCategory(sortBy, value);
            this.setState({data: {value, ready: true}});
        });
    }
    render() {
        const {data} = this.state;

        if(!data.ready) return <h1>Loading</h1>;
        console.warn(window.location);
        return (
            <div>
                <SearchBox />
                <JobList data={data.value} master={this} />
            </div>
        );
    }
}

/**
 * 
 * @param data Array of Objects 
 */
const JobList = ({data, master}) => {
    const onClick = (param, value) => {
        if(!param || !value) console.warn("JobListings.jsx, JobList -- no param or value provided to onClick");
        window.history.pushState(null, null, updateQueryParam(param, value));
        //Push param & value to state
        master.setState((state) => {params: Object.assign(state.params, {[param]: value})});
    };

    return (
        <div className="job-list">
            <table>
                <tr>
                    <th onClick={() => onClick("sortBy", "jobTitle")}> Job Title </th>
                    <th onClick={() => window.history.pushState(null, null, updateQueryParam("sortBy", "company"))}> Company </th>
                    <th onClick={() => window.history.pushState(null, null, updateQueryParam("sortBy", "location"))}> Location </th>
                    <th onClick={() => window.history.pushState(null, null, updateQueryParam("sortBy", "salary"))}> Salary </th>
                    <th onClick={() => window.history.pushState(null, null, updateQueryParam("sortBy", "website"))}> Extracted from </th>
                    <th onClick={() => window.history.pushState(null, null, updateQueryParam("sortBy", "deadline"))}> Closing date </th>
                </tr>
                {data.map(job => {
                    return (
                        <tr>
                            <td>{job.jobTitle}</td>
                            <td>{job.companyName}</td>
                            <td>{job.jobLocation}</td>
                            <td>{job.salary}</td>
                            <td>
                                <a href={job.website} target="_blank" rel="noopener noreferrer">
                                    {job.website}
                                </a>
                            </td>
                            <td>{job.deadline}</td>
                        </tr>);
                })}
            </table>
        </div>
    );
};

const SearchBox = () => {
    return(
        <form action="/jobs" method="get">
            <input type="text" name="query" />
            <input type="submit" value="Search" />
        </form>
    );
};

module.exports = {
    JobListings,
    SearchBox
};
