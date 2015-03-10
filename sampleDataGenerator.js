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

function makeSeries(start, end, color) {
  var series = {};
  series.start = start;
  series.end = end;

  series.color = color;

  series.coverage = makeCoverage(start, end);

  return series;
}

function makeSeriesList(start, end, colors) {
  var series = [];

  for(var i=0; i<colors.length; i++) {
    series.push(makeSeries(start, end, colors[i]));
  }

  return series;
}

module.exports = makeSeriesList;