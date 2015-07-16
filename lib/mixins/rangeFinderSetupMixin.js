var SetupMixin = {
  componentWillMount: function() {
    this.setupSeries(this.props.data);
  },

  componentWillUpdate: function(nextProps) {
    if(this.props === nextProps) {
      return;
    }

    this.setupSeries(nextProps.data);
  },

  setupSeries: function(data) {
    if(data === null) {
      return;
    }

    this.setValueRange(data);
    this.setGroupedSeries(data);
    this.setYearValues(data);
  },

  setGroupedSeries: function(data) {
    if(data.length === 0) {
      return;
    }

    this.dataMapping = [];
    this.dataGrouping = [];

    data = data.slice(); //copies array

    var dataLabels = this.props.rowLabelProperties;
    var valueLabel = this.props.valueProperty;

    if(typeof dataLabels === 'string') {
      dataLabels = [dataLabels];
    }

    var sortFields = dataLabels.slice();
    sortFields.push(valueLabel);

    data.sort(this.getSortFunction(sortFields));

    var dataMapping = this.mapSeries(data);
    this.dataMapping = dataMapping;

    var dataGrouping = [];

    if(dataLabels.length === 1) {
      return;
    }

    var categoryStartIndex = 0;
    var dataNames = dataMapping[0].dataNames;
    var currentCategory = dataNames[dataNames.length - 2];

    for(var i = 1; i < dataMapping.length; i++) {
      dataNames = dataMapping[i].dataNames;
      var newCategory = dataNames[dataNames.length - 2];

      if(newCategory !== currentCategory) {
        dataGrouping.push({
          categoryName: currentCategory,
          startIndex: categoryStartIndex,
          count: i - categoryStartIndex
        });

        currentCategory = newCategory;
        categoryStartIndex = i;
      }
    }

    dataGrouping.push({
      categoryName: currentCategory,
      startIndex: categoryStartIndex,
      count: dataMapping.length - categoryStartIndex
    });

    this.dataGrouping = dataGrouping;
  },

  mapSeries: function(sortedSeries) {
    var dataLabels = this.props.rowLabelProperties;
    var valueLabel = this.props.valueProperty;
    var metadataLabel = this.props.metadataProperty;

    if(typeof dataLabels === 'string') {
      dataLabels = [dataLabels];
    }

    var dataMapping = [];

    var coverage = [];
    var currentSeries = null;
    var start = null;
    var end = null;

    var colorIndeces = [];
    dataLabels.forEach(function() { colorIndeces.push(0); });

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
        if(start !== null && end !== null) {
          coverage.push({start: start, end: end});
        }

        var mismatchedDataNames = [];
        dataLabels.forEach(function(label) {
          mismatchedDataNames.push(currentSeries[label]);
        });

        var dataMap = {
          dataNames: mismatchedDataNames,
          coverage: coverage,
          colorIndeces: colorIndeces
        };

        if(metadataLabel) {
          dataMap.metadata = currentSeries[metadataLabel];
        }

        dataMapping.push(dataMap);


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
    if(start !== null && end !== null) {
      coverage.push({start: start, end: end});
    }

    var dataNames = [];
    dataLabels.forEach(function(label) {
      dataNames.push(currentSeries[label]);
    });

    dataMapping.push({dataNames: dataNames, coverage: coverage, colorIndeces: colorIndeces});

    return dataMapping;
  },

  getMismatchedIndex: function(data1, data2) {
    var dataLabels = this.props.rowLabelProperties;

    if(typeof dataLabels === 'string') {
      dataLabels = [dataLabels];
    }

    for (var i = 0; i < dataLabels.length; i++) {
      var label = dataLabels[i];

      if(data1[label] !== data2[label]) {
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

  setYearValues: function(data) {
    var totalSeries = this.dataMapping.length;
    var valueKey = this.props.valueProperty;

    var dataDensity = []; //slicing becomes way easier with arrays.

    data.forEach(function(item) {
      var value = item[valueKey];

      if(value === null) {
        return;
      }

      if(!dataDensity[value]) {
        dataDensity[value] = 0;
      }

      dataDensity[value] += 1;
    }, this);

    dataDensity.forEach(function(count, id, list) {
      list[id] = count / totalSeries;
    });

    this.dataDensity = dataDensity;
  },

  getValueRange: function(data) {
    if(data.length === 0) {
      return {min: this.props.min, max: this.props.max};
    }

    var start = this.props.min || null;
    var end = this.props.max || null;

    var value = this.props.valueProperty;

    data.forEach(function(item){
      if(item[value] === null) {
        return;
      }

      if(start === null || item[value] < start) {
        start = item[value];
      }

      if(end === null || item[value] > end) {
        end = item[value];
      }
    });

    return {min: start, max: end};
  },

  isEqualData: function(newData, oldData) {
    if(newData === oldData) {
      return true;
    }

    if(newData.length !== oldData.length) {
      return false;
    }

    oldData.forEach(function(data, index) {
      for (var key in data) {
        if(newData[index][key] !== data[key]) {
          return false;
        }
      }
    });

    return true;
  },

  setValueRange: function(data) {
    var oldData = this.props.data;
    if(this.isEqualData(data, oldData)) {
      return;
    }

    var newState = this.getValueRange(data);
    newState.start = Math.max(newState.min, this.state.start);
    newState.end = Math.min(newState.max, this.state.end);
    this.setState(newState);
  }
};

module.exports = SetupMixin;