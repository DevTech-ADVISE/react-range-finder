var React = require('react');
var RangeFinder = require('./range-finder.jsx');
var dataGenerator = require('./sampleDataGenerator');

var start = 1915;
var end = 2015;
var colors = ["red", "orange", "green", "blue", "black", "grey"];

var series = dataGenerator(start, end, colors);

React.render(
  <RangeFinder 
    start={start}
    end={end}
    series={series}/>,
  document.getElementById('content'));