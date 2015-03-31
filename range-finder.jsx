var React = require('react');

var SetupMixin = require('./mixins/rangeFinderSetupMixin.jsx');
var MakerMixin = require('./mixins/componentMakerMixin.jsx');
var CalcMixin = require('./mixins/calculatedPropertyMixin.jsx');

var ScrollableSVG = require('./components/scrollableSVG.jsx');

var Opentip = require('opentip');
require('opentip/css/opentip.css');

require('./styles/rangeFinderStyles.css');

Opentip.styles.close = {
  extends: "standard",
  offset: [-3,-3],
};

Opentip.defaultStyle = "close";

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

  mixins: [SetupMixin, MakerMixin, CalcMixin],

  consts: {
    barMarginTop: 60,
    barMarginLeft: 120,
    barMarginRight: 25,
    barMarginBottom: 50,
    coverageBarMargin: 10,
    labelCharacterLimit: 10,
    tickSize: 15,
    sliderMargin: 5,
    sliderRadius: 4,
    textMargin: 5,
    textSize: 10,
    densityBadgeMargin: 45,
    gradientId: "mainGradient",
  },

  getDefaultProps: function() {
    return {
      barWidth: 300,
      barHeight: 30,
      coverageBarHeight: 8,
      maxCoverageHeight: 300,
      stepSize: 1,
      series: [],
      title: "Value Range",
      densityLowColor: {r: 0, g: 0, b: 0},
      densityMidColor: null,
      densityHighColor: {r: 255, g: 255, b: 255},
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

    title: React.PropTypes.string,

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
  },

  makeSnapGrid: function() {
    var start = this.props.start;
    var end = this.props.end;

    var stepWidth = this.props.barWidth / this.stepCount;

    var snapTargets = [];

    for(var i = 0; i <= this.stepCount; i++) {
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
      if(seriesDensity[i]) {
        sum += seriesDensity[i];
      }
    }

    return sum / (end - start + 1);
  },

  render: function() {
    var snapGrid = this.makeSnapGrid();
    var gradient = null; //this.makeGradient();

    var ticks = this.makeTicks(snapGrid);
    var sliders = this.makeSliders(snapGrid);

    var coverage = this.makeCoverage();
    var coverageGrouping = this.makeCoverageGrouping();
    var unselected = this.makeUnselectedOverlay();

    var density = this.calculateCoverage(this.state.start, this.state.end);
    var densityLabel = Math.floor(100 * density) + "% coverage";

    var startX = this.state.startSliderX;
    var endX = this.state.endSliderX;

    var densityX = startX + (endX - startX) / 2;

    if(coverage.length > 0) {
      var barBottom = this.barY + this.props.barHeight + Math.ceil(this.consts.coverageBarMargin/2);

      coverageDetails = (
        <ScrollableSVG
          y={barBottom}
          width={this.componentWidth} height={this.fullCoverageHeight}
          maxDisplayedHeight={this.props.maxCoverageHeight}
          className="rf-coverage-section">
          {coverage}
          {coverageGrouping}
        </ScrollableSVG>
      )
    }

    return (
      <svg id={this.props.id} width={this.componentWidth} height={this.componentHeight} className="range-finder">
        {gradient}
        <rect
          x={this.barX} y={this.barY}
          width={this.props.barWidth} height={this.props.barHeight} 
          fill="#DDD"
          stroke="black"
          className="rf-range-bar"/>
        <text
          x={this.barX - this.consts.textMargin}
          y={this.barY + this.props.barHeight/2}
          textAnchor="end"
          className="rf-label rf-title-label">
          {this.props.title}
        </text>
        <text
          x={this.barX + this.consts.textMargin}
          y={this.barY + this.consts.textSize}
          fontSize={this.consts.textSize}
          textAnchor="start"
          className="rf-label rf-value-label">
          {this.props.start}
        </text>
        <text
          x={this.barX + this.props.barWidth - this.consts.textMargin}
          y={this.barY + this.consts.textSize}
          fontSize={this.consts.textSize}
          textAnchor="end"
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
        <g className="rf-ticks">{ticks}</g>
        {coverageDetails}
        {sliders}
        {unselected}
      </svg>
    )
  }
});

module.exports = RangeFinder