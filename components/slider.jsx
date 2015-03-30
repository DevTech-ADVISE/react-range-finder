var React = require('react');
var interact = require('interact.js');
var Opentip = require('opentip');

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
        self.valueTooltip.setContent(value);
      })
      .on('dragend', function (event) {
        var x = event.clientX;
        var value = self.props.valueLookup.byLocation[x];

        self.props.onDragEnd(value);
      });

    this.valueTooltip =
    new Opentip(
      this.getDOMNode(),
      this.state.value,
      { target: this.refs.topSlider.getDOMNode(), 
        tipJoint: "bottom",
        offset: [this.props.handleSize,0],
        showEffectDuration: 0,
        hideEffectDuration: 0,
        hideOn: "none",
        showOn: "creation",
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
    //var handleAnchor = this.props.handleAnchor;
    var textMargin = this.consts.textMargin;

    var handleOffset = handleSize;// * handleAnchor;
    var handleX = x - handleOffset;
    var handleY = y - handleSize;

    var ghostSizeModifier = 4;
    var ghostSize = ghostSizeModifier * handleSize;
    var ghostXOffset = ghostSize;// * handleAnchor;

    var ghostYOffsetFactor = 0.65;
    var ghostHeightOffsetFactor = 2 * ghostYOffsetFactor - 1;

    var ghostX = x - ghostXOffset;// + (2*handleAnchor-1) * (handleSize/2);
    var ghostY = y - ghostYOffsetFactor * ghostSize;
    var ghostOpacity = 0;

    var ghostBarOffset = 0;//(1 - handleAnchor) * handleSize/2;
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