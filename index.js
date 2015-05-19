var React = require('react');
var RangeFinder = require('./src/range-finder.js');
var dataGenerator = require('./sampleDataGenerator');


var start = 1965;
var end = 2015;

var series = dataGenerator.makeData(start, end);
var schema = dataGenerator.makeSchema();

function log(message) {
  console.log(message);
}

function onStartDragMove(value) {
  log("Current start year: " + value);
}

function onEndDragMove(value) {
  log("Current end year: " + value);
}

function onDragMove(start, end) {
  log("Current year set: " + start + " " + end);
}

function onStartDragEnd(value) {
  log("Selected start year: " + value);
}

function onEndDragEnd(value) {
  log("Selected end year: " + value);
}

function onDragEnd(start, end) {
  log("Date Range: " + start + "-" + end + ", " + (end - start + 1) + " years selected");
}

React.render(
  <RangeFinder 
    id="yearSelector"
    data={series}
    rowLabelProperties={schema.series}
    valueProperty={schema.value}
    metadataProperty={schema.metadata}
    colors={schema.colors}
    onDrag={onDragMove}
    onDragRangeStart={onStartDragMove}
    onDragRangeEnd={onEndDragMove}
    onRelease={onDragEnd}
    onReleaseRangeStart={onStartDragEnd}
    onReleaseRangeEnd={onEndDragEnd}/>,
  document.getElementById('content'));