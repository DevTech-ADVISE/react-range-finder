var React = require('react');


module.exports = React.createClass({
  getInitialState: function() {
    return {};
  },

  propTypes: {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number,
    color: React.PropTypes.string,

    start: React.PropTypes.number.isRequired,
    end: React.PropTypes.number.isRequired,
    coverage: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        start: React.PropTypes.number.isRequired,
        end: React.PropTypes.number.isRequired
      })
    ).isRequired
  },

  getDefaultProps: function() {
    return {
      height: 5,
      color: "black"
    };
  },

  makeCoverageBar: function(barStart, barEnd) {
    var start = this.props.start;
    var end = this.props.end;
    var width = this.props.width;

    var range = end - start;
    var barRange = barEnd - barStart;
    var barOffset = barStart - start;

    var barWidth = width * barRange / range;
    var barX = this.props.x + width * barOffset / range;

    return (
      <rect
        x={barX}
        y={this.props.y}
        width={barWidth}
        height={this.props.height}
        fill={this.props.color}/>
    );
  },

  makeCoverageBars: function() {
    return this.props.coverage.map(function (item) {
      return this.makeCoverageBar(item.start, item.end);
    }, this);
  },

  render: function() {
    var bars = this.makeCoverageBars();

    var x1 = this.props.x;
    var x2 = this.props.x + this.props.width;

    var y = this.props.y + this.props.height/2;
    
    return (
      <g>
        <line x1={x1} y1={y} x2={x2} y2={y} strokeWidth="1" stroke={this.props.color}/>
        {bars}
      </g>
    );
  }
});