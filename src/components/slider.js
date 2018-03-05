var PropTypes = require('prop-types');
var React = require('react');
var createReactClass = require('create-react-class');
var ReactDOM = require('react-dom');
var interact = require('interact.js');

var Slider = createReactClass({
  displayName: 'Slider',

  getInitialState: function() {
    var x = this.props.x;

    return { x: x };
  },

  consts: {
    borderRadius: 4
  },

  propTypes: {
    handleSize: PropTypes.number,
    height: PropTypes.number,
    onDrag: PropTypes.func,
    onRelease: PropTypes.func,
    onScroll: PropTypes.func,
    valueOffset: PropTypes.number
  },

  componentDidMount: function() {
    var self = this;

    interact(ReactDOM.findDOMNode(self))
      .draggable({
        snap: {
          targets: this.props.snapGrid,
          range: Infinity
        }
      })
      .origin('parent')
      .on('dragmove', function (event) {
        var x = Math.floor(event.pageX);
        var value = self.props.valueLookup.byLocation[x] + self.props.valueOffset;

        self.setState({x: x});
        self.props.onDrag(value);
      })
      .on('dragend', function (event) {
        var x = Math.floor(event.pageX);
        var value = self.props.valueLookup.byLocation[x] + self.props.valueOffset;

        self.props.onRelease(value);
      });
  },

  componentWillReceiveProps: function (newProps) {
    if(this.props.x !== newProps.x) {
      this.setState({ x: newProps.x });
    }
  },

  componentDidUpdate: function() {
    var self = this;

    interact(ReactDOM.findDOMNode(self))
      .draggable({
        snap: {
          targets: self.props.snapGrid,
          range: Infinity
        }
      });
  },

  restrictToGrid: function(midX, width) {
    var thisLeft = midX - width / 2;
    var thisRight = thisLeft + width;

    var startX = this.props.startX;
    var endX = this.props.endX;

    var startRight = startX + width / 2;
    var endLeft = endX - width / 2;

    var startOverlapAdjust = Math.max(startRight - thisLeft, 0) / 2;
    var endOverlapAdjust = Math.max(thisRight - endLeft, 0) / 2;

    return thisLeft + startOverlapAdjust - endOverlapAdjust;
  },

  makeLabel: function(x, y) {
    if(this.props.valueLookup.isEndPoint[x]) {
      return null;
    }

    var tailOffsetY = -12;

    var pointWidth = 16;
    var pointHeight = 10;

    var bgWidth = 48;
    var bgHeight = 25;
    var bgX = this.restrictToGrid(x, bgWidth);
    var bgY = y - bgHeight - pointHeight + tailOffsetY;

    var textX = bgX + bgWidth / 2;
    var textY = bgY + bgHeight * 0.65;

    var midX = x;
    var leftX = Math.max(x - pointWidth / 2, bgX);
    var rightX = Math.min(x + pointWidth / 2, bgX + bgWidth);

    var baseY = bgY + bgHeight;
    var bottomY = baseY + pointHeight;
    var topY = baseY - this.consts.borderRadius;

    var points =
      rightX + ',' + topY + ' ' +
      rightX + ',' + baseY + ' ' +
      midX + ',' + bottomY + ' ' +
      leftX + ',' + baseY + ' ' +
      leftX + ',' + topY;

    var value = this.props.valueLookup.byLocation[x] + this.props.valueOffset;


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
          {value}
        </text>
      </g>
    );
  },

  onTouchStart: function(event) {
    var initialTouch = event.targetTouches[0];

    this.touchY = initialTouch.pageY;
  },

  onTouchMove: function(event) {
    var newTouch = event.targetTouches[0];

    this.props.onScroll(this.touchY - newTouch.pageY);

    this.touchY = newTouch.pageY;

    event.preventDefault();
    event.returnValue = false;
  },

  onWheel: function(event) {
    this.props.onScroll(event.deltaY);
    event.preventDefault();
    event.returnValue = false;
  },

  render: function() {
    var x = this.state.x;
    var y = this.props.y;
    var height = this.props.height;
    var handleSize = this.props.handleSize;

    var handleY = y;

    var ghostSize = this.props.ghostSize;

    var ghostX = this.restrictToGrid(x, ghostSize * 2) + ghostSize;
    var ghostOpacity = 0;

    var label = this.makeLabel(x, handleY);

    return (
      <g className="rf-slider' draggable='true"
          onWheel={this.onWheel}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}>
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
          cx={ghostX} cy={handleY}
          r={ghostSize}
          opacity={ghostOpacity}/>
        <circle
          cx={ghostX} cy={handleY + height}
          r={ghostSize}
          opacity={ghostOpacity}/>
        <rect
          x={ghostX - ghostSize} y={handleY}
          width={ghostSize * 2} height={height}
          opacity={ghostOpacity}/>
      </g>
    );
  },
});

module.exports = Slider;