var React = require('react');
var Slider = require('./components/slider.jsx');
var CoverageBar = require('./components/coverageBar.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      start: this.props.start,
      end: this.props.end
    };
  },

  consts: {
    barMargin: 50,
    coverageBarMargin: 5,
    tickMargin: 2,
    tickSize: 5,
    sliderRadius: 5,
    sliderMargin: 5,
    textMargin: 5
  },

  getDefaultProps: function() {
    return {
      start: 0,
      end: 100,
      barWidth: 300,
      barHeight: 10,
      coverageBarHeight: 8,
      stepSize: 1,
      series: [],
      onStartDragMove: function(value) {},
      onStartDragEnd: function(value) {},
      onEndDragMove: function(value) {},
      onEndDragEnd: function(value) {}
    };
  },

  propTypes: {
    barWidth: React.PropTypes.number,
    barHeight: React.PropTypes.number,
    coverageBarHeight: React.PropTypes.number,

    start: React.PropTypes.number,
    end: React.PropTypes.number,

    stepSize: React.PropTypes.number,

    series: React.PropTypes.arrayOf(React.PropTypes.object),
    schema: React.PropTypes.shape({
      series: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.string]).isRequired,
      value: React.PropTypes.string.isRequired
    }),

    onStartDragMove: React.PropTypes.func,
    onStartDragEnd: React.PropTypes.func,
    onEndDragMove: React.PropTypes.func,
    onEndDragEnd: React.PropTypes.func,
  },

  componentWillMount: function() {
    this.barX = this.consts.barMargin;
    this.barY = this.consts.barMargin;

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
    console.log(seriesMapping);
    this.seriesMapping = seriesMapping;
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

    sortedSeries.forEach(function(item) {
      var value = item[valueLabel];

      if(currentSeries === null) {
        currentSeries = item;
        start = value;
      } else if(!this.doesMatchSeries(item, currentSeries)) {
        coverage.push({start: start, end: end});

        var seriesNames = [];
        seriesLabels.forEach(function(label) {
          seriesNames.push(item[label]);
        });

        seriesMapping.push({seriesNames: seriesNames, coverage: coverage});

        coverage = [];
        currentSeries = item;
        start = value;
      } else if(value > end + this.props.stepSize) {
        coverage.push({start: start, end: end});
        start = value;
      }
      
      end = value;
    }, this);

    return seriesMapping;
  },

  doesMatchSeries: function(series1, series2) {
    var seriesLabels = this.props.schema.series;

    if(typeof seriesLabels === "string") {
      seriesLabels = [seriesLabels];
    }

    for (var key in seriesLabels) {
      var label = seriesLabels[key];

      if(series1[label] !== series2[label]) {
        return false;
      }
    }

    return true;
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

      ticks.push(<line x1={x} y1={y1} x2={x} y2={y2} strokeWidth="1" stroke="grey" />);
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
        x={leftX}
        y={leftY}
        height={sliderHeight}
        handleAnchor={1}
        snapGrid={startSnapGrid}
        valueLookup={valueLookup}
        onDragMove={this.props.onStartDragMove}
        onDragEnd={this.onStartDragEnd}/>
    );
    sliders.push(
      <Slider
        x={rightX}
        y={rightY}
        height={sliderHeight}
        handleAnchor={0}
        snapGrid={endSnapGrid}
        valueLookup={valueLookup}
        onDragMove={this.props.onEndDragMove}
        onDragEnd={this.onEndDragEnd}/>
    );

    return sliders;
  },

  onStartDragEnd: function(value) {
    this.setState({start: value});
    this.props.onStartDragEnd(value);
  },

  onEndDragEnd: function(value) {
    this.setState({end: value});
    this.props.onEndDragEnd(value);
  },

  makeCoverage: function() {
    var x = this.consts.barMargin;
    var barBottom = this.consts.barMargin + this.props.barHeight + this.consts.coverageBarMargin;

    var yearCount = (this.props.end - this.props.start) / this.props.stepSize;
    var dashSize = this.props.barWidth / yearCount;



    return this.seriesMapping.map(function(series, id) {
      var y = barBottom + id * (this.props.coverageBarHeight + this.consts.coverageBarMargin);

      return (
        <CoverageBar
          x={x}
          y={y}
          width={this.props.barWidth}
          height={this.props.coverageBarHeight}
          color={series.color}
          start={this.state.start}
          end={this.state.end}
          coverage={series.coverage}
          dashSize={dashSize}/>
      );
    }, this);
  },

  render: function() {
    var snapGrid = this.getSnapGrid();

    var ticks = this.makeTicks(snapGrid);
    var sliders = this.makeSliders(snapGrid);

    var coverage = this.makeCoverage();

    var width = this.props.barWidth + 2 * this.consts.barMargin;
    var height = 
      2 * this.consts.barMargin +
      this.consts.tickSize +
      this.consts.tickMargin +
      this.props.barHeight +
      coverage.length * (this.props.coverageBarHeight + this.consts.coverageBarMargin);

    return (
      <svg width={width} height={height}>
        {ticks}
        <text x={this.barX - this.consts.textMargin} y={this.barY + this.props.barHeight} textAnchor="end">{this.props.start}</text>
        <rect x={this.barX} y={this.barY} width={this.props.barWidth} height={this.props.barHeight} fill="darkgreen" stroke="darkgreen"/>
        <text x={this.barX + this.props.barWidth + this.consts.textMargin} y={this.barY + this.props.barHeight} textAnchor="start">{this.props.end}</text>
        {coverage}
        {sliders}
      </svg>
    )
  }
});