var React = require('react');
var Slider = require('./components/slider.jsx');
var CoverageBar = require('./components/coverageBar.jsx');


require('opentip');
require('opentip/css/opentip.css');

var RangeFinder = React.createClass({
  getInitialState: function() {
    return {
      start: this.props.start,
      end: this.props.end
    };
  },

  consts: {
    barMarginTop: 50,
    barMarginLeft: 120,
    barMarginRight: 120,
    barMarginBottom: 20,
    coverageBarMargin: 10,
    labelCharacterLimit: 10,
    tickMargin: 2,
    tickSize: 5,
    sliderRadius: 5,
    sliderMargin: 5,
    textMargin: 5
  },

  getDefaultProps: function() {
    return {
      barWidth: 300,
      barHeight: 10,
      coverageBarHeight: 8,
      stepSize: 1,
      series: [],
      onStartDragMove: function(value) {},
      onStartDragEnd: function(value) {},
      onDragMove: function(start, end) {},
      onEndDragMove: function(value) {},
      onEndDragEnd: function(value) {},
      onDragEnd: function(start, end) {},
    };
  },

  propTypes: {
    barWidth: React.PropTypes.number,
    barHeight: React.PropTypes.number,
    coverageBarHeight: React.PropTypes.number,

    start: React.PropTypes.number.isRequired,
    end: React.PropTypes.number.isRequired,

    stepSize: React.PropTypes.number,

    series: React.PropTypes.arrayOf(React.PropTypes.object),
    schema: React.PropTypes.shape({
      series: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.string]).isRequired,
      value: React.PropTypes.string.isRequired,
      colorScheme: React.PropTypes.array
    }),

    onStartDragMove: React.PropTypes.func,
    onStartDragEnd: React.PropTypes.func,
    onEndDragMove: React.PropTypes.func,
    onEndDragEnd: React.PropTypes.func,
  },

  componentWillMount: function() {
    this.barX = this.consts.barMarginLeft;
    this.barY = this.consts.barMarginTop;

    if(this.props.series.length === 0) {
      return;
    }

    this.setValueRange();
    this.setGroupedSeries();
  },

  setGroupedSeries: function() {
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
      this.seriesGrouping = null;
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

  getSnapGrid: function() {
    var start = this.props.start;
    var end = this.props.end;

    var stepCount = (end - start) / this.props.stepSize;
    var stepWidth = this.props.barWidth / stepCount;

    var snapTargets = [];

    for(var i = 0; i <= stepCount; i++) {
      var x = this.barX + i * stepWidth;
      var value = start + i * this.props.stepSize;

      snapTargets.push({ x: x, value: value });
    }

    return snapTargets;
  },

  makeTicks: function(snapGrid) {
    var y1 = this.barY - this.consts.tickMargin;
    var y2 = y1 - this.consts.tickSize;

    var ticks = [];

    for(var key in snapGrid) {
      var x = snapGrid[key].x;

      ticks.push(<line key={"tick"+key} x1={x} y1={y1} x2={x} y2={y2} strokeWidth="1" stroke="grey" />);
    }

    return ticks;
  },

  makeSliders: function(snapGrid) {
    var leftX = this.barX;
    var leftY = this.barY - this.consts.sliderRadius - this.consts.sliderMargin - this.consts.tickMargin - this.consts.tickSize;

    var rightX = this.barX + this.props.barWidth;
    var rightY = leftY;

    var sliderHeight = 
      2 * this.consts.sliderRadius +
      2 * this.consts.sliderMargin +
      this.consts.tickSize +
      this.consts.tickMargin +
      this.props.barHeight +
      this.seriesMapping.length * (this.props.coverageBarHeight + this.consts.coverageBarMargin);

    var valueLookup = {};
    valueLookup.byValue = {};
    valueLookup.byLocation = {};

    for (var key in snapGrid) {
      var xLocation = snapGrid[key].x;
      var value = snapGrid[key].value;

      valueLookup.byValue[value] = xLocation;
      valueLookup.byLocation[xLocation] = value;
    }

    var startSnapGrid = [];
    var endSnapGrid = [];

    for (var key in snapGrid) {
      var snapObject = snapGrid[key];
      var x = snapObject.x;

      if(x <= valueLookup.byValue[this.state.end]) {
        startSnapGrid.push(snapObject);
      }
      if(x >= valueLookup.byValue[this.state.start]) {
        endSnapGrid.push(snapObject);
      }
    }

    var sliders = [];

    sliders.push(
      <Slider
        key="leftSlider"
        x={leftX}
        y={leftY}
        height={sliderHeight}
        handleAnchor={1}
        snapGrid={startSnapGrid}
        valueLookup={valueLookup}
        onDragMove={this.onStartDragMove}
        onDragEnd={this.onStartDragEnd}/>
    );
    sliders.push(
      <Slider
        key="rightSlider"
        x={rightX}
        y={rightY}
        height={sliderHeight}
        handleAnchor={0}
        snapGrid={endSnapGrid}
        valueLookup={valueLookup}
        onDragMove={this.onEndDragMove}
        onDragEnd={this.onEndDragEnd}/>
    );

    return sliders;
  },

  onStartDragMove: function(start) {
    this.props.onStartDragMove(start);
    this.props.onDragMove(start, this.state.end);
  },

  onEndDragMove: function(end) {
    this.props.onEndDragMove(end);
    this.props.onDragMove(this.state.start, end);
  },

  onStartDragEnd: function(start) {
    this.setState({start: start});
    this.props.onStartDragEnd(start);
    this.props.onDragEnd(start, this.state.end);
  },

  onEndDragEnd: function(end) {
    this.setState({end: end});
    this.props.onEndDragEnd(end);
    this.props.onDragEnd(this.state.start, end);
  },

  makeCoverage: function() {
    var x = this.barX;
    var barBottom = this.barY + this.props.barHeight + this.consts.coverageBarMargin;

    var yearCount = (this.props.end - this.props.start) / this.props.stepSize;
    var dashSize = this.props.barWidth / yearCount;

    var colors = this.makeColors();

    return this.seriesMapping.map(function(series, id) {
      var y = barBottom + id * (this.props.coverageBarHeight + this.consts.coverageBarMargin);
      var label = series.seriesNames[series.seriesNames.length - 1];
      var seriesText = series.seriesNames.join("<br/>");

      return (
          <g key={"coverage" + id}>
            <CoverageBar
              x={x}
              y={y}
              width={this.props.barWidth}
              height={this.props.coverageBarHeight}
              color={colors[id]}
              start={this.props.start}
              end={this.props.end}
              coverage={series.coverage}
              dashSize={dashSize}/>
            <text
              data-ot={seriesText}
              x={x + this.props.barWidth + this.consts.textMargin}
              y={y + this.props.coverageBarHeight}
              height={this.props.coverageBarHeight}
              textAnchor="start">
                {this.truncateText(label, this.consts.labelCharacterLimit)}
            </text>
          </g>
      );
    }, this);
  },

  makeColors: function() {
    var colors = this.props.schema.colors || ["black", "gray"];
    var seriesMapping = this.seriesMapping;

    if(typeof colors === "string") {
      return seriesMapping.map(function(item) {
        return colors;
      });
    }

    return seriesMapping.map(function(item) {
      var colorIndeces = item.colorIndeces;
      var selectedColor = colors;

      for(var i = 0; i < colorIndeces.length; i++) {
        var colorIndex = colorIndeces[i];

        if(typeof selectedColor === "string") {
          return selectedColor;
        }

        selectedColor = selectedColor[colorIndex % selectedColor.length];
      }

      while(typeof selectedColor !== "string") {
        selectedColor = selectedColor[0];
      }

      return selectedColor;
    });
  },

  truncateText: function(text, charLimit) {
    if(text.length <= charLimit + 3) { // +3 for the dots.
      return text;
    }
    return text.substring(0, charLimit) + "...";
  },

  makeCoverageGrouping: function() {
    if(this.seriesGrouping === null) {
      return null;
    }

    return this.seriesGrouping.map(function(grouping, id) {
      var name = this.truncateText(grouping.categoryName, this.consts.labelCharacterLimit);
      var barBottom = this.barY + this.props.barHeight + this.consts.coverageBarMargin;

      var barSpacing = this.consts.coverageBarMargin + this.props.coverageBarHeight;

      var startY = barBottom + grouping.startIndex * barSpacing;
      var endY = startY + grouping.count * barSpacing - this.consts.coverageBarMargin;
      var rightX = this.barX;
      var leftX = rightX - this.consts.textMargin;
      var textY = startY + (endY - startY) / 2;
      var textX = leftX - this.consts.textMargin;

      var points = this.makePointList(leftX, rightX, startY, endY);

      return (
        <g key={"grouping" + id}>
          <text
            data-ot={grouping.categoryName}
            x={textX}
            y={textY}
            textAnchor="end">
            {name}
          </text>
          <polyline fill="none" stroke="black" strokeWidth="1" points={points} />
        </g>
      );
    }, this);
  },

  makePointList: function(leftX, rightX, startY, endY) {
    return rightX + ',' + startY + ' ' +
           leftX + ',' + startY + ' ' +
           leftX + ',' + endY + ' ' +
           rightX + ',' + endY;
  },

  render: function() {
    var snapGrid = this.getSnapGrid();

    var ticks = this.makeTicks(snapGrid);
    var sliders = this.makeSliders(snapGrid);

    var coverage = this.makeCoverage();
    var coverageGrouping = this.makeCoverageGrouping();

    var width =
      this.props.barWidth +
      this.consts.barMarginLeft +
      this.consts.barMarginRight;

    var height = 
      this.consts.barMarginTop +
      this.consts.barMarginBottom +
      this.consts.tickSize +
      this.consts.tickMargin +
      this.props.barHeight +
      coverage.length * (this.props.coverageBarHeight + this.consts.coverageBarMargin);

    return (
      <svg id={this.props.id} width={width} height={height}>
        <g>{ticks}</g>
        <text x={this.barX - this.consts.textMargin} y={this.barY + this.props.barHeight} textAnchor="end">{this.props.start}</text>
        <rect x={this.barX} y={this.barY} width={this.props.barWidth} height={this.props.barHeight} fill="darkgreen" stroke="darkgreen"></rect>
        <text x={this.barX + this.props.barWidth + this.consts.textMargin} y={this.barY + this.props.barHeight} textAnchor="start">{this.props.end}</text>
        {coverage}
        {coverageGrouping}
        {sliders}
      </svg>
    )
  }
});

module.exports = RangeFinder