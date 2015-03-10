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

    start: React.PropTypes.number.isRequired,
    end: React.PropTypes.number.isRequired,

    stepSize: React.PropTypes.number,

    series: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        color: React.PropTypes.string,

        start: React.PropTypes.number.isRequired,
        end: React.PropTypes.number.isRequired,
        coverage: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            start: React.PropTypes.number.isRequired,
            end: React.PropTypes.number.isRequired
          })
        ).isRequired
      })
    ),

    onStartDragMove: React.PropTypes.func,
    onStartDragEnd: React.PropTypes.func,
    onEndDragMove: React.PropTypes.func,
    onEndDragEnd: React.PropTypes.func,
  },

  componentWillMount: function() {
    this.barX = this.consts.barMargin;
    this.barY = this.consts.barMargin;
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
      this.props.series.length * (this.props.coverageBarHeight + this.consts.coverageBarMargin);

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

    return this.props.series.map(function(series, id) {
      var y = barBottom + id * (this.props.coverageBarHeight + this.consts.coverageBarMargin);

      return (
        <CoverageBar
          x={x}
          y={y}
          width={this.props.barWidth}
          height={this.props.coverageBarHeight}
          color={series.color}
          start={series.start}
          end={series.end}
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
        <text x={this.barX - this.consts.textMargin} y={this.barY} textAnchor="end">{this.props.start}</text>
        <rect x={this.barX} y={this.barY} width={this.props.barWidth} height={this.props.barHeight} fill="darkgreen" stroke="darkgreen"/>
        <text x={this.barX + this.props.barWidth + this.consts.textMargin} y={this.barY} textAnchor="start">{this.props.end}</text>
        {coverage}
        {sliders}
      </svg>
    )
  }
});