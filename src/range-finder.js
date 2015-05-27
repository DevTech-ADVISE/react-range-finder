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
  findValue: function() {
    for(var key in arguments) {
      var arg = arguments[key];

      if(arg || arg === 0) {
        return arg;
      }
    }

    return 0;
  },

  getInitialState: function() {

    var selectedRange = this.props.selectedRange || {};

    var valueRange = this.getValueRange(this.props.data);

    var min = this.findValue(this.props.min, valueRange.min, selectedRange.start, 0);
    var max = this.findValue(this.props.max, valueRange.max, selectedRange.end, 100);

    var start = selectedRange.start || min;
    var end = selectedRange.end || max;

    start = Math.max(start, min);
    end = Math.min(end, max);

    start = Math.min(start, end); //Limit start to end value

    return {
      min: min,
      max: max,
      start: start,
      end: end,
      coverageOffset: 0
    };
  },

  mixins: [SetupMixin, MakerMixin, CalcMixin],

  consts: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 40,
    marginBottom: 40,
    coverageBarMargin: 10,
    labelCharacterLimit: 20,
    tickSize: 10,
    sliderMargin: 5,
    sliderRadius: 5,
    ghostSize: 30,
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
      width: 860,
      height: 800,
      headerBarHeight: 50,
      labelColumnWidth: 160,
      coverageBarHeight: 20,
      maxCoverageHeight: 750,
      stepSize: 1,
      data: [],
      title: "Value Range",
      densityLowColor: {r: 0, g: 0, b: 0},
      densityMidColor: null,
      densityHighColor: {r: 255, g: 255, b: 255},
      onDragRangeStart: function() {},
      onReleaseRangeStart: function() {},
      onDrag: function() {},
      onDragRangeEnd: function() {},
      onReleaseRangeEnd: function() {},
      onRelease: function() {},
    };
  },

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    headerBarHeight: React.PropTypes.number,
    labelColumnWidth: React.PropTypes.number,
    maxCoverageHeight: React.PropTypes.number,

    coverageBarHeight: React.PropTypes.number,

    min: React.PropTypes.number,
    max: React.PropTypes.number,

    selectedRange: React.PropTypes.shape({
      start: React.PropTypes.number,
      end: React.PropTypes.number,
    }),

    stepSize: React.PropTypes.number,

    title: React.PropTypes.string,
    consts: React.PropTypes.object,

    data: React.PropTypes.arrayOf(React.PropTypes.object),
    schema: React.PropTypes.shape({
      data: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.string]).isRequired,
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

    this.barX = this.props.labelColumnWidth;
    this.barY = this.consts.marginTop;
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
    
    var dataDensity = this.dataDensity;

    var sum = 0;

    for(var i = start; i <= end; i++) {
      if(dataDensity[i]) {
        sum += dataDensity[i];
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

    var titleX = this.props.labelColumnWidth / 2;

    var valueLabelY = this.barY + (this.props.headerBarHeight - this.consts.tickSize) / 2 + this.consts.textSize / 2;

    var coverageDetails = null;
    var densityLabel = null;

    if(coverage.length > 0) {
      var barBottom = this.barY + this.props.headerBarHeight + this.consts.coverageGap;

      coverageDetails = (
        <ScrollableSVG
          y={barBottom}
          width={this.props.width} height={this.fullCoverageHeight}
          maxDisplayedHeight={this.coverageHeight}
          scrollWidth={this.consts.scrollWidth}
          className="rf-coverage-section">
          <rect
            x={0} y={0}
            width={this.props.width}
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
          y={this.barY + this.props.headerBarHeight/2 + this.consts.textSize}
          fontSize={12}
          textAnchor="middle"
          className="rf-label rf-label-bold rf-density-label">
          {Math.floor(100 * density) + "% coverage"}
        </text>;
    }

    var topBarWidth = this.props.width;
    var topBarHeight = this.props.headerBarHeight + this.consts.borderRadius;

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
          y={this.barY + this.props.headerBarHeight/2}
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
          {this.state.min}
        </text>
        <text
          x={this.props.width - this.consts.labelSideMargin}
          y={valueLabelY}
          fontSize={this.consts.textSize}
          textAnchor="end"
          className="rf-label rf-label-bold rf-value-label">
          {this.state.max}
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