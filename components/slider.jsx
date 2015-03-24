var React = require('react');
var interact = require('interact.js');

module.exports = React.createClass({
  getInitialState: function() {
    var x = this.props.x;
    var value = this.props.valueLookup.byLocation[x];

    return { x: x, value: value };
  },

  consts: {
    textMargin: 2
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

  render: function() {
    var x = this.state.x;
    var y = this.props.y;
    var height = this.props.height;
    var handleSize = this.props.handleSize;
    var handleAnchor = this.props.handleAnchor;
    var textMargin = this.consts.textMargin;

    var handleOffset = handleSize * handleAnchor;
    var handleX = x - handleOffset;
    var handleY = y - 0.5 * handleSize;
    return (
      <g className="rf-slider">
        <text
          x={x} y={handleY - textMargin}
          textAnchor={handleAnchor === 0 ? "start" : "end"}
          className="rf-label rf-slider-label">
          {this.state.value}
        </text>
        <rect
          x={handleX} y={handleY}
          width={handleSize} height={handleSize}
          strokeWidth="2"
          stroke="black"
          className="rf-slider-handle"/>
        <line
          x1={x} y1={y}
          x2={x} y2={y + height}
          strokeWidth="2"
          stroke="black"
          className="rf-slider-bar"/>
        <rect
          x={handleX} y={handleY + height}
          width={handleSize} height={handleSize}
          strokeWidth="2"
          stroke="black"
          className="rf-slider-handle"/>
      </g>
    )
  }
});