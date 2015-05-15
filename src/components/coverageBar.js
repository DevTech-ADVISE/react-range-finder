var React = require('react');


var CoverageBar = React.createClass({
  getInitialState: function() {
    return {};
  },

  propTypes: {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number,
    color: React.PropTypes.string,

    textMargin: React.PropTypes.number,
    label: React.PropTypes.string,
    tooltip: React.PropTypes.string,

    min: React.PropTypes.number.isRequired,
    max: React.PropTypes.number.isRequired,
    coverage: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        start: React.PropTypes.number,
        end: React.PropTypes.number
      })
    ).isRequired
  },

  getDefaultProps: function() {
    return {
      height: 5,
      textMargin: 20,
      color: "black"
    };
  },

  makeCoverageBar: function(barStart, barEnd, id) {
    var tooltip = barStart + " to " + barEnd;

    var start = this.props.min;
    var end = this.props.max + this.props.stepSize;
    var width = this.props.width;

    barEnd += this.props.stepSize;

    var range = end - start;
    var barRange = barEnd - barStart;
    var barOffset = barStart - start;

    var barWidth = width * barRange / range;
    var barX = this.props.x + width * barOffset / range;

    barWidth = Math.max(barWidth, 1);

    return (
      <rect
        key={"coverageBar" + id}
        data-ot={tooltip}
        data-ot-show-effect-duration="0"
        x={barX}
        y={this.props.y}
        width={barWidth}
        height={this.props.height}
        fill={this.props.color}
        className="rf-coverage-bar"/>
    );
  },

  render: function() {
    var dataDensity = 0;
    var dashSize = Math.max(this.props.dashSize, 1);

    var bars = this.props.coverage.map(function (item, id) {
        dataDensity += item.end - item.start + 1;
        return this.makeCoverageBar(item.start, item.end, id);
      }, this);

    dataDensity /= this.props.max - this.props.min + 1;

    var x1 = this.props.x;
    var x2 = this.props.x + this.props.width;

    var y = this.props.y + this.props.height/2;
    var textYAdjust = 5;

    var tooltip = this.props.tooltip;
    tooltip += "<br/><br/>" + Math.floor(dataDensity * 100) + "% covered";

    return (
      <g className="rf-coverage">
        <line
          x1={x1} y1={y}
          x2={x2} y2={y}
          strokeWidth="1"
          stroke={this.props.color}
          strokeDasharray={dashSize + ", " + dashSize}
          className="rf-coverage-line"/>

        {bars}

        <text
          data-ot={tooltip}
          x={this.props.textMargin}
          y={y + textYAdjust}
          textAnchor="start"
          fill="#29333F"
          dangerouslySetInnerHTML={{__html: this.props.label}}
          className="rf-label rf-coverage-label"/>
      </g>
    );
  }
});

module.exports = CoverageBar