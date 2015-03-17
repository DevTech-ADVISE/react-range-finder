var React = require('react');
var RangeFinder = require('./range-finder.jsx');
var dataGenerator = require('./sampleDataGenerator');

var start = 1915;
var end = 2015;

var series = dataGenerator.makeData(start, end);
var schema = dataGenerator.makeSchema();

function onStartDragMove(value) {
  console.log("Current start year: " + value);
}

function onEndDragMove(value) {
  console.log("Current end year: " + value);
}

function onDragMove(start, end) {
  console.log("Current year set:", start, end);
}

function reportRange()
{
  console.log("Date Range: " + start + "-" + end);
}

function onStartDragEnd(value) {
  console.log("Selected start year: " + value);
}

function onEndDragEnd(value) {
  console.log("Selected end year: " + value);
}

function onDragEnd(start, end) {
  console.log("Date Range: " + start + "-" + end + ", " + (end - start + 1) + " years selected");
}

React.render(
  <RangeFinder 
    start={start}
    end={end}
    series={series}
    schema={schema}
    onStartDragMove={onStartDragMove}
    onEndDragMove={onEndDragMove}
    onDragMove={onDragMove}
    onStartDragEnd={onStartDragEnd}
    onEndDragEnd={onEndDragEnd}
    onDragEnd={onDragEnd}/>,
  document.getElementById('content'));