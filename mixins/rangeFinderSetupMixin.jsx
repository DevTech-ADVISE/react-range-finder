var SetupMixin = {
  setGroupedSeries: function() {
    this.seriesMapping = [];
    this.seriesGrouping = [];
    
    if(this.props.series.length === 0) {
      return;
    }

    var series = this.props.series.slice(); //copies array

    var seriesLabels = this.props.schema.series;
    var valueLabel = this.props.schema.value;

    if(typeof seriesLabels === "string") {
      seriesLabels = [seriesLabels];
    }

    var sortFields = seriesLabels.slice();
    sortFields.push(valueLabel);
    
    series.sort(this.getSortFunction(sortFields));

    var seriesMapping = this.mapSeries(series);
    this.seriesMapping = seriesMapping;

    var seriesGrouping = [];

    if(seriesLabels.length === 1) {
      return;
    }

    var categoryStartIndex = 0;
    var seriesNames = seriesMapping[0].seriesNames;
    var currentCategory = seriesNames[seriesNames.length - 2];

    for(var i=1; i < seriesMapping.length; i++) {
      seriesNames = seriesMapping[i].seriesNames;
      var newCategory = seriesNames[seriesNames.length - 2];

      if(newCategory !== currentCategory) {
        seriesGrouping.push({
          categoryName: currentCategory,
          startIndex: categoryStartIndex,
          count: i - categoryStartIndex
        });

        currentCategory = newCategory;
        categoryStartIndex = i;
      }
    }

    seriesGrouping.push({
      categoryName: currentCategory,
      startIndex: categoryStartIndex,
      count: seriesMapping.length - categoryStartIndex
    });

    this.seriesGrouping = seriesGrouping;
  },

  mapSeries: function(sortedSeries) {
    var seriesLabels = this.props.schema.series;
    var valueLabel = this.props.schema.value;

    if(typeof seriesLabels === "string") {
      seriesLabels = [seriesLabels];
    }

    var seriesMapping = [];

    var coverage = [];
    var currentSeries = null;
    var start = null;
    var end = null;

    var colorIndeces = [];
    seriesLabels.forEach(function() { colorIndeces.push(0); });

    sortedSeries.forEach(function(item) {
      var value = item[valueLabel];

      if(currentSeries === null) {
        currentSeries = item;
        start = value;
        end = value;

        return;
      }
      
      var mismatchedIndex = this.getMismatchedIndex(item, currentSeries);

      if(mismatchedIndex !== -1) {
        coverage.push({start: start, end: end});

        var seriesNames = [];
        seriesLabels.forEach(function(label) {
          seriesNames.push(currentSeries[label]);
        });

        seriesMapping.push({seriesNames: seriesNames, coverage: coverage, colorIndeces: colorIndeces});


        colorIndeces = colorIndeces.slice(); //Copy array by value
        colorIndeces[mismatchedIndex] += 1;

        for(var i = mismatchedIndex + 1; i < colorIndeces.length; i++) {
          colorIndeces[i] = 0;
        }

        coverage = [];
        currentSeries = item;
        start = value;
      } else if(value > end + this.props.stepSize) {
        coverage.push({start: start, end: end});
        start = value;
      }
      
      end = value;
    }, this);

    //cleanup the last one
    coverage.push({start: start, end: end});

    var seriesNames = [];
    seriesLabels.forEach(function(label) {
      seriesNames.push(currentSeries[label]);
    });

    seriesMapping.push({seriesNames: seriesNames, coverage: coverage, colorIndeces: colorIndeces});

    return seriesMapping;
  },

  getMismatchedIndex: function(series1, series2) {
    var seriesLabels = this.props.schema.series;

    if(typeof seriesLabels === "string") {
      seriesLabels = [seriesLabels];
    }

    for (var i = 0; i < seriesLabels.length; i++) {
      var label = seriesLabels[i];

      if(series1[label] !== series2[label]) {
        return i;
      }
    }

    return -1;
  },

  //Get sort function that sorts in order of array given.
  getSortFunction: function(fieldList) {
    return function(a, b) {
      for(var key in fieldList) {
        var sortField = fieldList[key];

        if(a[sortField] > b[sortField]) {
          return 1;
        }

        if(a[sortField] < b[sortField]) {
          return -1;
        }
      }

      return 0;
    };
  },

  setYearValues: function() {
    var totalSeries = this.seriesMapping.length;
    var valueKey = this.props.schema.value;

    var seriesDensity = []; //slicing becomes way easier with arrays.

    this.props.series.forEach(function(item) {
      var value = item[valueKey];

      if(value === null) {
        return;
      }

      if(!seriesDensity[value]) {
        seriesDensity[value] = 0;
      }

      seriesDensity[value] += 1;
    }, this);

    this.seriesDensity = seriesDensity;
  },

  setValueRange: function() {
    if(this.props.series.length === 0) {
      return;
    }

    var start = null;
    var end = null;

    var value = this.props.schema.value;

    this.props.series.forEach(function(item){
      if(start === null || item[value] < start) {
        start = item[value];
      }

      if(end === null || item[value] > end) {
        end = item[value];
      }
    });

    this.setState({start: start, end: end});
  },
};

module.exports = SetupMixin;