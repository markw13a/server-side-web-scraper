import React from 'react';
import { render } from 'react-dom';
import {
    JobListings,
} from './components/JobListings.jsx';
import NavBar from './components/NavBar.jsx';

const CompiledPage = () => {
  return (
    <div className="grid-wrapper">
      <header>
        <NavBar />
      </header>
      <div id="blurb">
        <h2>
          About
          <br /> <br />
        </h2>
        <p>
          This page is intended to help non-EU citizens to find work in the UK. The table below contains a list of current vacancies being advertised by companies on the UK's "Register of license sponsors".
          You can arrange the table by job title, company, location, website or closing date by clicking on the corresponding table heading.
          <br /> <br />
          If you have (somehow) found your way here from the wider internet, please feel free to make use of this site.
        </p>
      </div>
      <div id="main-content">
        <JobListings />
      </div>
      <div id="lhs" className="side-margin" />
      <div id="rhs" className="side-margin" />
      <div id="footer">
        <h4>Site created by Mark W. 2018</h4>      
      </div>
    </div>
  );
};

render(
  <CompiledPage />,
  document.querySelector('body')
);
