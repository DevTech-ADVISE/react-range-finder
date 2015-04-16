var React = require('react');
var interact = require('interact.js');

module.exports = React.createClass({
  getInitialState: function() {
    var x = this.props.x;
    var value = this.props.valueLookup.byLocation[x];

    return { x: x, value: value };
  },

  consts: {
    textMargin: 12,
    borderRadius: 4,
  },

  getDefaultProps: function() {
    return {
      height: 60,
      handleSize: 10,
      onDragMove: function(value) {},
      onDragEnd: function(value) {}
    };
  },

  componentDidMount: function() {
    var self = this;

    interact(self.getDOMNode())
      .draggable({
        snap: {
          targets: this.props.snapGrid,
          range: Infinity,
        }
      })
      .on('dragmove', function (event) {
        var x = event.pageX;
        var value = self.props.valueLookup.byLocation[x];

        self.setState({x: x, value: value});
        self.props.onDragMove(value, x);
      })
      .on('dragend', function (event) {
        var x = event.pageX;
        var value = self.props.valueLookup.byLocation[x];

        self.props.onDragEnd(value);
      });
  },

  componentDidUpdate: function() {
    var self = this;

    interact(self.getDOMNode())
      .draggable({
        snap: {
          targets: this.props.snapGrid,
          range: Infinity,
        }
      });
  },

  clamp: function(value, min, max) {
    value = Math.min(value, max);
    value = Math.max(value, min);
    return value;
  },

  restrictToGrid: function(midX, width) {
    var thisLeft = midX - width/2;
    var thisRight = thisLeft + width;

    var startX = this.props.snapGrid[0].x;
    var endX = this.props.snapGrid[this.props.snapGrid.length - 1].x;

    var startRight = startX + width/2;
    var endLeft = endX - width/2;

    var startOverlapAdjust = Math.max(startRight - thisLeft, 0)/2;
    var endOverlapAdjust = Math.max(thisRight - endLeft, 0)/2;

    return thisLeft + startOverlapAdjust - endOverlapAdjust;
  },

  makeLabel: function(x, y) {
    if(this.state.x === this.props.x) {
      return null;
    }

    var tailOffsetY = -12;

    var pointWidth = 16;
    var pointHeight = 10;

    var bgWidth = 48;
    var bgHeight = 25;
    var bgX = this.restrictToGrid(x, bgWidth);
    var bgY = y - bgHeight - pointHeight + tailOffsetY;

    var textX = bgX + bgWidth/2;
    var textY = bgY + bgHeight * 0.65;

    var midX = x;
    var leftX = Math.max(x - pointWidth/2, bgX);
    var rightX = Math.min(x + pointWidth/2, bgX + bgWidth);

    var baseY = bgY + bgHeight;
    var bottomY = baseY + pointHeight;
    var topY = baseY - this.consts.borderRadius;

    var points =
      rightX + "," + topY + " " +
      rightX + "," + baseY + " " +
      midX + "," + bottomY + " " +
      leftX + "," + baseY + " " +
      leftX + "," + topY;

    return (
      <g className="rf-value-indicator">
        <polyline
          fill="white"
          points={points} 
          className="rf-value-indicator-balloon"/>
        <rect
          x={bgX} y={bgY}
          rx={this.consts.borderRadius} ry={this.consts.borderRadius}
          width={bgWidth} height={bgHeight}
          fill="white"
          className="rf-value-indicator-balloon"/>
        <text
          x={textX} y={textY}
          textAnchor="middle"
          fontSize={this.props.fontSize}
          fill="red"
          className="rf-label rf-value-indicator-label">
          {this.state.value}
        </text>
      </g>
    )
  },

  render: function() {
    var x = this.state.x;
    var y = this.props.y;
    var height = this.props.height;
    var handleSize = this.props.handleSize;
    var textMargin = this.consts.textMargin;

    var handleOffset = handleSize;
    var handleX = x - handleOffset;
    var handleY = y;

    var ghostSizeModifier = 4;
    var ghostSize = ghostSizeModifier * handleSize;
    var ghostXOffset = ghostSize;

    var ghostYOffsetFactor = 0.65;
    var ghostHeightOffsetFactor = 2 * ghostYOffsetFactor - 1;

    var ghostX = x - ghostXOffset;
    var ghostY = y - ghostYOffsetFactor * ghostSize;
    var ghostOpacity = 0;

    var ghostBarOffset = 0;

    var label = this.makeLabel(x, handleY);

    return (
      <g className="rf-slider" draggable="true">
        <line
          x1={x} y1={y}
          x2={x} y2={y + height}
          strokeWidth="2"
          stroke="black"
          className="rf-slider-bar"/>
        <circle
          cx={x} cy={handleY}
          r={handleSize}
          strokeWidth="2"
          stroke="#376893"
          fill="white"
          ref="topSlider"
          className="rf-slider-handle"/>
        <circle
          cx={x} cy={handleY + height}
          r={handleSize}
          strokeWidth="2"
          stroke="#376893"
          fill="white"
          className="rf-slider-handle"/>
        {label}
        <circle
          cx={x} cy={handleY}
          r={ghostSize}
          opacity={ghostOpacity}/>
        <circle
          cx={x} cy={handleY + height}
          r={ghostSize}
          opacity={ghostOpacity}/>
        <rect
          x={x - ghostSize/2} y={handleY}
          width={ghostSize} height={height}
          opacity={ghostOpacity}/>
      </g>
    )
  }
});