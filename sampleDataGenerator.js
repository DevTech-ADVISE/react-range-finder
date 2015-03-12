function random(min, max) {
  max = max + 1;
  return Math.floor(Math.random() * (max - min)) + min;
}

function makeYearRange(start, end) {
  if(start > end) {
    return null;
  }

  var coverage = {};

  var start1 = random(start, end);
  var start2 = random(start, end);
  coverage.start = start1 < start2 ? start1 : start2; //tend towards a lower start

  var end1 = random(coverage.start, end);
  var end2 = random(coverage.start, end);
  coverage.end = end1 > end2 ? end1 : end2; //tend towards a higher end

  return coverage;
}

function makeYearSets(start, end) {
  var coverage = [];

  var coverageBarCount = random(1, 4);

  while (coverageBarCount-- > 0) {
    var coverageBar = makeYearRange(start, end);

    if(coverageBar === null) {
      return coverage;
    }

    coverage.push(coverageBar);
    
    start = coverageBar.end + 1;
  }

  return coverage;
}

function makeMajorSeries() {
  var seriesCount = random(2, 4);

  var majorSeries = [];

  do {
    majorSeries.push("MS_" + seriesCount);
  } while (--seriesCount > 0);

  return majorSeries;
}

function makeMinorSeries() {
  var seriesCount = random(2, 4);

  var minorSeries = [];

  do {
    minorSeries.push("ms_" + seriesCount);
  } while (--seriesCount > 0);

  return minorSeries;
}

function clusterSeries(majorSeries, minorSeries) {
  var seriesCluster = [];

  for(var majorKey in majorSeries) {
    for(var minorKey in minorSeries) {
      var major = majorSeries[majorKey];
      var minor = minorSeries[minorKey];

      //add 10% chance minor series is not paired with major
      if(random(1, 10) !== 1) {
        seriesCluster.push({major: major, minor: minor});
      }
    }
  }

  return seriesCluster;
}

function addYearData(seriesCluster, start, end) {
  var dataSet = [];

  for (var key in seriesCluster) {
    var seriesPair = seriesCluster[key];

    var yearSets = makeYearSets(start, end);

    for(var yearKey in yearSets) {
      var yearSet = yearSets[yearKey];

      for(var year = yearSet.start; year <= yearSet.end; year++) {
        dataSet.push({major: seriesPair.major, minor: seriesPair.minor, year: year});
      }
    }
  }

  return dataSet;
}

function makeData(start, end) {
  var majorSeries = makeMajorSeries();
  var minorSeries = makeMinorSeries();

  var seriesCluster = clusterSeries(majorSeries, minorSeries);

  var fakeDataSet = addYearData(seriesCluster, start, end)

  return fakeDataSet;
}

function makeSchema() {
  return {series:['major', 'minor'], value:'year'};
}

module.exports.makeData = makeData;
module.exports.makeSchema = makeSchema;