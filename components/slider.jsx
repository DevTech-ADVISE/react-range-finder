var React = require('react');
var interact = require('interact.js');

module.exports = React.createClass({
  getInitialState: function() {
    var x = this.props.x;
    var value = this.props.valueLookup.byLocation[x];

    return { x: x, value: value };
  },

  consts: {
    textMargin: 16
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
        var x = event.clientX;
        var value = self.props.valueLookup.byLocation[x];

        self.setState({x: x, value: value});
        self.props.onDragMove(value, x);
      })
      .on('dragend', function (event) {
        var x = event.clientX;
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

  makeLabel: function(x, y) {
    var textPadding = 2;

    var charCount = this.state.value.toString().length;
    var charWidth = 6;
    var heightAdjustment = 1;
    var yAdjustment = -1;

    var bgWidth = 6 * charCount + 2 * textPadding;
    var bgHeight = 10 + 2 * textPadding + heightAdjustment;
    var bgX = x - bgWidth/2;
    var bgY = y - bgHeight + yAdjustment + this.props.fontSize/2;

    var pointWidth = 6;
    var pointHeight = 8;

    var midX = x;
    var leftX = x - pointWidth/2;
    var rightX = x + pointWidth/2;

    var topY = bgY + bgHeight;
    var bottomY = topY + pointHeight;

    var points =
      leftX + "," + topY + " " +
      midX + "," + bottomY + " " +
      rightX + "," + topY + " ";

    return (
      <g>
        <rect
          x={bgX} y={bgY}
          width={bgWidth} height={bgHeight}
          fill="black"/>
        <text
          x={x} y={y}
          textAnchor="middle"
          fontSize={this.props.fontSize}
          fill="white">
          {this.state.value}
        </text>
        <polyline
          fill="black"
          stroke="black"
          strokeWidth="1"
          points={points} />
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

    var label = this.makeLabel(x, handleY - textMargin - handleSize);

    return (
      <g className="rf-slider">
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
          stroke="blue"
          fill="white"
          ref="topSlider"
          className="rf-slider-handle"/>
        <circle
          cx={x} cy={handleY + height}
          r={handleSize}
          strokeWidth="2"
          stroke="blue"
          fill="white"
          className="rf-slider-handle"/>
        {label}
        <rect
          x={ghostX} y={ghostY}
          width={ghostSize} height={ghostSize}
          opacity={ghostOpacity}/>
        <rect
          x={ghostX} y={ghostY + height + ghostHeightOffsetFactor * ghostSize}
          width={ghostSize} height={ghostSize}
          opacity={ghostOpacity}/>
        <rect
          x={handleX - ghostBarOffset} y={handleY + handleSize}
          width={handleSize + handleSize/2} height={height}
          opacity={ghostOpacity}/>
      </g>
    )
  }
});