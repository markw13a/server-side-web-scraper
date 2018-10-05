import React from 'react';
import {
    updateQueryParam, 
    updateQueryParamMulti,
    getUrlParameter,
    sortByCategory
} from '../C';

class JobListings extends React.Component {
    constructor(props){
        super(props);

        const resultsPerPage = getUrlParameter(location.search, "resultsPerPage") || 50;
        const page = getUrlParameter(location.search, "page") || 0;

        const data = {
            // generalise updateQueryParam to be able to construct urls?
            value: fetch(`/data/opportunities?resultsPerPage=${resultsPerPage}&page=${page}`),
            ready: false
        }

        this.state = {
            data,
            params: {
                collectionSize: null,
                sortBy: getUrlParameter(location.search, "sortBy"),
                resultsPerPage,
                page
            }
        };
    }
    componentDidMount(){
        const {data} = this.state;

        //Set flag to show asynchronous data is ready for use.
        //Doesn't seem to be a nicer way to handle this. Tolerable for now.
        data.value
        .then(results => results.json())
        .then(value => {
            this.setState({
                data: {value: value.data, ready: true},
                params: Object.assign(this.state.params, {collectionSize: value.collectionSize})
            });
        });
    }
    render() {
        const {data, params} = this.state;
        const {sortBy, resultsPerPage} = params;

        if(!data.ready) return <h1>Loading</h1>;
        sortByCategory(sortBy, data.value);

        return (
            <div>
                {/* <SearchBox /> */}
                <PageControls resultsPerPage={resultsPerPage} master={this} />
                <JobList data={data.value} master={this} />
                <PageSelector params={params} />
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
        master.setState({params: Object.assign(master.state.params, {[param]: value})});
    };
    return (
        <div className="job-list">
            <table>
                <tr>
                    <th onClick={() => onClick("sortBy", "jobTitle")}> Job Title </th>
                    <th onClick={() => onClick("sortBy", "company")}> Company </th>
                    <th onClick={() => onClick("sortBy", "location")}> Location </th>
                    <th onClick={() => onClick("sortBy", "salary")}> Salary </th>
                    <th onClick={() => onClick("sortBy", "website")}> Extracted from </th>
                    <th onClick={() => onClick("sortBy", "deadline")}> Closing date </th>
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
                            <td>{job.deadline.split("T")[0].replace(/-/g,"/")}</td>
                        </tr>);
                })}
            </table>
        </div>
    );
};

const SearchBox = () => {
    return(
        <form action="/" method="get">
            <input type="text" name="query" />
            <input type="submit" value="Search" />
        </form>
    );
};

const PageControls = ({resultsPerPage, master}) => {
    const options = ["25", "50", "100", "200"];

    // as pagination only takes effect when pulling from db
    // need to trigger a page render with this
    const onChange = v => {
        window.location.href = updateQueryParamMulti({
            "resultsPerPage" : v.target.value,
            "page" : 0
        });
        // side-effect: reset page to 0
        // master.setState({params: Object.assign(master.state.params, {"resultsPerPage": v.target.value, page: 0})});
    }

    return (
        <div>
            <select className="pull-right" name="Results per page" onChange={onChange} id="resultsPerPage" >
                {options.map( v =>
                    <option key={v} selected={v == resultsPerPage}> 
                        {v} 
                    </option>
                )}
            </select>
            <span className="pull-right">Results per page</span>
        </div>
    );
};

const PageSelector = ({params}) => {
    const {page, collectionSize, resultsPerPage} = params;
    const numberOfPages = Math.ceil(collectionSize / resultsPerPage);
    const arr = Array.from({length: numberOfPages}, (e, i) => i);
    console.warn([numberOfPages, arr]);
    // feels ham-fisted, but without onclick href would be determined on render
    // user may have changed url in other ways since that time.
    const onClick = (i) => {
        window.location.href = updateQueryParam("page", i);
    }

    return (
        <div className="center">
            <span>Results Page: </span>
            {
                arr.map((e) => <a className={"large-text " + (e == page ? "bold underline" : "") } onClick={() => onClick(e)}> {e + 1} </a>)
            }
        </div>
    );
};

module.exports = {
    JobListings,
    SearchBox
};
