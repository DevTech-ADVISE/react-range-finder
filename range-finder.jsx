var React = require('react');
var SetupMixin = require('./mixins/rangeFinderSetupMixin.jsx');
var MakerMixin = require('./mixins/componentMakerMixin.jsx');

var ScrollableSVG = require('./components/scrollableSVG.jsx');


require('opentip');
require('opentip/css/opentip.css');

require('./styles/rangeFinderStyles.css');

var RangeFinder = React.createClass({
  getInitialState: function() {
    return {
      start: this.props.start,
      end: this.props.end,
      startSliderX: this.consts.barMarginLeft,
      endSliderX: this.consts.barMarginLeft + this.props.barWidth,
      coverageOffset: 0
    };
  },

  mixins: [SetupMixin, MakerMixin],

  consts: {
    barMarginTop: 60,
    barMarginLeft: 120,
    barMarginRight: 120,
    barMarginBottom: 50,
    coverageBarMargin: 10,
    labelCharacterLimit: 10,
    tickMargin: 2,
    tickSize: 5,
    sliderRadius: 5,
    sliderMargin: 5,
    textMargin: 5,
    densityBadgeMargin: 45,
  },

  getDefaultProps: function() {
    return {
      barWidth: 300,
      barHeight: 10,
      coverageBarHeight: 8,
      maxCoverageHeight: 300,
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
    maxCoverageHeight: React.PropTypes.number,

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
    this.setYearValues();
  },

  makeSnapGrid: function() {
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

  calculateCoverage: function(start, end) {
    var totalSeries = this.seriesMapping.length;

    var seriesDensity = this.seriesDensity;

    var sum = 0;

    for(var i = start; i <= end; i++) {
      sum += seriesDensity[i];
    }

    return sum / (totalSeries * (end - start + 1));
  },

  render: function() {
    var snapGrid = this.makeSnapGrid();

    var ticks = this.makeTicks(snapGrid);
    var sliders = this.makeSliders(snapGrid);

    var coverage = this.makeCoverage();
    var coverageGrouping = this.makeCoverageGrouping();
    var unselected = this.makeUnselectedOverlay();

    var width =
      this.props.barWidth +
      this.consts.barMarginLeft +
      this.consts.barMarginRight;

    var height = 
      this.consts.barMarginTop +
      this.consts.barMarginBottom +
      this.consts.tickSize +
      this.consts.tickMargin +
      this.props.barHeight;

    var density = this.calculateCoverage(this.state.start, this.state.end)
    var densityLabel = Math.floor(100 * density) + "% coverage";

    var startX = this.valueLookup.byValue[this.state.start];
    var endX = this.valueLookup.byValue[this.state.end];

    var densityX = startX + (endX - startX) / 2;

    if(coverage.length > 0) {
      var fullCoverageHeight = this.seriesMapping.length * (this.props.coverageBarHeight + this.consts.coverageBarMargin);

      var coverageHeight = fullCoverageHeight > this.props.maxCoverageHeight
        ? this.props.maxCoverageHeight
        : fullCoverageHeight;

      height += coverageHeight;

      var barBottom = this.barY + this.props.barHeight + Math.ceil(this.consts.coverageBarMargin/2);

      coverageDetails = (
        <ScrollableSVG
          y={barBottom}
          width={width} height={fullCoverageHeight}
          maxDisplayedHeight={this.props.maxCoverageHeight}
          className="rf-coverage-section">
          {coverage}
          {coverageGrouping}
        </ScrollableSVG>
      )
    }

    return (
      <svg id={this.props.id} width={width} height={height} className="range-finder">
        <g className="rf-ticks">{ticks}</g>
        <text
          x={this.barX - this.consts.textMargin}
          y={this.barY + this.props.barHeight}
          textAnchor="end"
          className="rf-label rf-value-label">
          {this.props.start}
        </text>
        <rect
          x={this.barX} y={this.barY}
          width={this.props.barWidth} height={this.props.barHeight} 
          fill="darkgreen"
          stroke="darkgreen"
          className="rf-range-bar"/>
        <text
          x={this.barX + this.props.barWidth + this.consts.textMargin}
          y={this.barY + this.props.barHeight}
          textAnchor="start"
          className="rf-label rf-value-label">
          {this.props.end}
        </text>
        <text
          x={densityX}
          y={this.barY - this.consts.densityBadgeMargin}
          textAnchor="middle"
          className="rf-label rf-density-label">
          {densityLabel}
        </text>
        {coverageDetails}
        {sliders}
        {unselected}
      </svg>
    )
  }
});

module.exports = RangeFinder