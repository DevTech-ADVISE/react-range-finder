var React = require('react');
var RangeFinder = require('./range-finder.jsx');

var start = 1990;
var end = 2015;
var colors = ["red", "orange", "green", "blue", "black", "grey"];

var series = [];

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function makeCoverageRange(start, end) {
  if(start > end) {
    return null;
  }

  var coverage = {};

  end += 1;

  var start1 = random(start, end);
  var start2 = random(start, end);
  coverage.start = start1 < start2 ? start1 : start2; //tend towards a lower start

  var end1 = random(coverage.start, end);
  var end2 = random(coverage.start, end);
  coverage.end = end1 > end2 ? end1 : end2; //tend towards a higher end

  return coverage;
}

function makeCoverage(start, end) {
  var coverage = [];

  var coverageBars = Math.floor(Math.random() * 5);

  if(coverageBars === 0) {
    coverage.push({start: start, end: end});

    return coverage;
  }

  while (coverageBars-- > 0) {
    var coverageBar = makeCoverageRange(start, end);

    if(coverageBar === null) {
      return coverage;
    }

    coverage.push(coverageBar);
    
    start = coverageBar.end + 1;
  }

  return coverage;
}

function makeSeries(seriesNumber) {
  var series = {};
  series.start = start;
  series.end = end;

  series.color = colors[seriesNumber];

  series.coverage = makeCoverage(start, end);

  return series;
}

for(var i=0; i<colors.length; i++) {
  series.push(makeSeries(i));
}

React.render(
  <RangeFinder 
    start={1990}
    end={2015}
    series={series}/>,
  document.getElementById('content'));