var React = require('react');
var Slider = require('./slider.jsx');

var tickBuffer = 2;
var tickSize = 5;

module.exports = React.createClass({
  getInitialState: function() {
    return {

    };
  },

  getDefaultProps: function() {
    return {
      x: 50,
      y: 50,
      width: 300,
      height: 10,
      start: 1990,
      end: 2015,
      stepSize: 1
    };
  },

  getSnapGrid: function() {
    var start = this.props.start;
    var end = this.props.end;

    var stepCount = (end - start) / this.props.stepSize;
    var stepWidth = this.props.width / stepCount;

    var snapTargets = [];

    for(var i = 0; i <= stepCount; i++) {
      var x = this.props.x + i * stepWidth;

      snapTargets.push({ x: x });
    }

    return snapTargets;

  },

  makeTicks: function(snapGrid) {
    var y1 = this.props.y - tickBuffer;
    var y2 = y1 - tickSize;

    var ticks = [];

    for(var key in snapGrid) {
      var x = snapGrid[key].x;

      ticks.push(<line x1={x} y1={y1} x2={x} y2={y2} strokeWidth="1" stroke="grey" />);
    }

    return ticks;
  },

  makeSliders: function(snapGrid) {
    var leftX = this.props.x;
    var leftY = this.props.y - 12;

    var rightX = this.props.x + this.props.width;
    var rightY = leftY;

    var sliderHeight = 50;

    var sliders = [];

    sliders.push(<Slider x={leftX} y={leftY} height={sliderHeight} snapGrid={snapGrid} />);
    sliders.push(<Slider x={rightX} y={rightY} height={sliderHeight} snapGrid={snapGrid} />);

    return sliders;
  },

  render: function() {
    var snapGrid = this.getSnapGrid();

    var ticks = this.makeTicks(snapGrid);
    var sliders = this.makeSliders(snapGrid);

    return (
      <g>
        {ticks}
        <rect x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height} fill="darkgreen" stroke="darkgreen"/>
        {sliders}
      </g>
    )
  }
});