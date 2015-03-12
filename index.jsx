var React = require('react');
var RangeFinder = require('./range-finder.jsx');
var dataGenerator = require('./sampleDataGenerator');

var start = 1915;
var end = 2015;

var series = dataGenerator.makeData(start, end);
var schema = dataGenerator.makeSchema();

function onStartDragMove(value) {
  console.log("start year: " + value);
}

function onEndDragMove(value) {
  console.log("start year: " + value);
}

function reportRange()
{
  console.log("Date Range: " + start + "-" + end);
}

function onStartDragEnd(value) {
  start = value;
  reportRange();
}

function onEndDragEnd(value) {
  end = value;
  reportRange();
}

React.render(
  <RangeFinder 
    start={start}
    end={end}
    series={series}
    schema={schema}
    onStartDragMove={onStartDragMove}
    onEndDragMove={onEndDragMove}
    onStartDragEnd={onStartDragEnd}
    onEndDragEnd={onEndDragEnd}/>,
  document.getElementById('content'));