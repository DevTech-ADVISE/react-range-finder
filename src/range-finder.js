var React = require('react');

var SetupMixin = require('./mixins/rangeFinderSetupMixin.js');
var MakerMixin = require('./mixins/componentMakerMixin.js');
var CalcMixin = require('./mixins/calculatedPropertyMixin.js');

var ScrollableSVG = require('./components/scrollableSVG.js');

var Opentip = require('opentip');
require('opentip/css/opentip.css');

require('../styles/rangeFinderStyles.css');

Opentip.styles.close = {
  extends: "standard",
  offset: [-3,-3],
  background: "#CFCFCF",
  borderColor: "#CFCFCF",
  className: "rf-tooltip"
};

Opentip.defaultStyle = "close";

var RangeFinder = React.createClass({
  getInitialState: function() {

    var selectedRange = this.props.selectedRange || {};

    var start = selectedRange.start || this.props.start;
    var end = selectedRange.end || this.props.end;

    start = Math.max(start, this.props.start);
    end = Math.min(end, this.props.end);

    start = Math.min(start, end); //Limit start to end value

    return {
      start: start,
      end: end,
      coverageOffset: 0
    };
  },

  mixins: [SetupMixin, MakerMixin, CalcMixin],

  consts: {
    barMarginTop: 0,
    barMarginLeft: 160,
    barMarginRight: 25,
    barMarginBottom: 10,
    coverageBarMargin: 10,
    labelCharacterLimit: 20,
    tickSize: 10,
    sliderMargin: 5,
    sliderRadius: 5,
    labelSideMargin: 1,
    labelVertMargin: 2,
    textMargin: 20,
    textSize: 15,
    densityBadgeMargin: 45,
    gradientId: "mainGradient",
    scrollWidth: 10,
    borderRadius: 5,
    coverageGap: 4,
  },

  getDefaultProps: function() {
    return {
      barWidth: 700,
      barHeight: 50,
      coverageBarHeight: 20,
      maxCoverageHeight: 750,
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

    selectedRange: React.PropTypes.shape({
      start: React.PropTypes.number,
      end: React.PropTypes.number,
    }),

    stepSize: React.PropTypes.number,

    title: React.PropTypes.string,
    consts: React.PropTypes.object,

    series: React.PropTypes.arrayOf(React.PropTypes.object),
    schema: React.PropTypes.shape({
      series: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.string]).isRequired,
      value: React.PropTypes.string.isRequired,
      colorScheme: React.PropTypes.array,
      metadata: React.PropTypes.string,
    }),

    onStartDragMove: React.PropTypes.func,
    onStartDragEnd: React.PropTypes.func,
    onEndDragMove: React.PropTypes.func,
    onEndDragEnd: React.PropTypes.func,
  },

  componentWillMount: function() {
    for (var key in this.props.consts) {
      this.consts[key] = this.props.consts[key];
    }

    this.barX = this.consts.barMarginLeft;
    this.barY = this.consts.barMarginTop;
  },

  //function for outputting tag/class guide
  //Ignore this
  reportCoverage: function(element, indent) {
    var classPart = element.className && element.className.baseVal ? " class='" + element.className.baseVal + "'" : "";
    if(!element.children || element.children.length === 0) {
      if(!element.tagName) return "";
      return indent + "<" + element.tagName + classPart + "/>\n";
    }

    var toReturn = indent + "<" + element.tagName + classPart + ">\n";
    
    for(var key in element.children) {
      var child = element.children[key];
      toReturn += this.reportCoverage(child, indent + "  ");
    }
    

    toReturn += indent + "</" + element.tagName + ">\n";

    return toReturn;
  },

  calculateCoverage: function(start, end) {
    if(!this.needsCoverage) {
      return 0;
    }
    
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
    var snapGrid = this.snapGrid;
    var gradient = null; //this.makeGradient();

    var ticks = this.makeTicks(snapGrid);
    var sliders = this.makeSliders(snapGrid);

    var coverage = this.makeCoverage();
    var coverageGrouping = this.makeCoverageGrouping();
    var gapFillers = this.makeGapFillers();
    var unselected = this.makeUnselectedOverlay();

    var titleX = this.consts.barMarginLeft / 2;

    var valueLabelY = this.barY + (this.props.barHeight - this.consts.tickSize) / 2 + this.consts.textSize / 2;

    var coverageDetails = null;
    var densityLabel = null;

    if(coverage.length > 0) {
      var barBottom = this.barY + this.props.barHeight + this.consts.coverageGap;

      coverageDetails = (
        <ScrollableSVG
          y={barBottom}
          width={this.componentWidth} height={this.fullCoverageHeight}
          maxDisplayedHeight={this.props.maxCoverageHeight}
          scrollWidth={this.consts.scrollWidth}
          className="rf-coverage-section">
          <rect
            x={0} y={0}
            width={this.effectiveWidth}
            height={this.fullCoverageHeight}
            className="rf-coverage-background"
            fill="#F4F4F4" />
          {coverage}
          {coverageGrouping}
        </ScrollableSVG>
      )

      var density = this.calculateCoverage(this.state.start, this.state.end);
      densityLabel = 
        <text
          x={titleX}
          y={this.barY + this.props.barHeight/2 + this.consts.textSize}
          fontSize={12}
          textAnchor="middle"
          className="rf-label rf-label-bold rf-density-label">
          {Math.floor(100 * density) + "% coverage"}
        </text>;
    }

    var topBarWidth = this.effectiveWidth;
    var topBarHeight = this.props.barHeight + this.consts.borderRadius;

    if(this.needsScrollBar) {
      topBarWidth += this.consts.scrollWidth;
    }

    var offset = 100 - 100 * (this.consts.borderRadius / topBarHeight);
    offset += "%"

    return (
      <svg
        id={this.props.id}
        width={this.componentWidth}
        height={this.componentHeight}
        className="range-finder">
        <defs>
          <linearGradient id={this.consts.gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#CFCFCF" stopOpacity="100%"/>
            <stop offset={offset} stopColor="#CFCFCF" stopOpacity="100%"/>
            <stop offset={offset} stopColor="#CFCFCF" stopOpacity="0%"/>
            <stop offset="100%" stopColor="#CFCFCF" stopOpacity="0%"/>
          </linearGradient>
        </defs>
        <rect
          x={0} y={this.barY}
          width={topBarWidth} height={topBarHeight}
          rx={this.consts.borderRadius} ry={this.consts.borderRadius}
          stroke={"url(#" + this.consts.gradientId + ")"}
          fill={"url(#" + this.consts.gradientId + ")"}
          className="rf-range-bar"/>
        <text
          x={titleX}
          y={this.barY + this.props.barHeight/2}
          textAnchor="middle"
          className="rf-label rf-label-bold rf-title-label">
          {this.props.title}
        </text>
        <text
          x={this.barX}
          y={valueLabelY}
          fontSize={this.consts.textSize}
          textAnchor="start"
          className="rf-label rf-label-bold rf-value-label">
          {this.props.start}
        </text>
        <text
          x={this.effectiveWidth - this.consts.labelSideMargin}
          y={valueLabelY}
          fontSize={this.consts.textSize}
          textAnchor="end"
          className="rf-label rf-label-bold rf-value-label">
          {this.props.end}
        </text>
        {densityLabel}
        <g className="rf-ticks">{ticks}</g>
        {coverageDetails}
        {gapFillers}
        {unselected}
        {sliders}
      </svg>
    )
  }
});

module.exports = RangeFinder