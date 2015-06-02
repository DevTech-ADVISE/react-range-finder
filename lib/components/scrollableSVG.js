var React = require('react');
var interact = require('interact.js');

var ScrollableSVG = React.createClass({
  getInitialState: function() {
    return { offsetY: 0 };
  },

  getDefaultProps: function() {
    return {
      x: 0,
      y: 0,
    };
  },

  consts: {
    scrollBarPadding: 2,
    gradientId: "scrollBarGradient",
  },

  propTypes: {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    scrollWidth: React.PropTypes.number.isRequired,
    maxDisplayedHeight: React.PropTypes.number.isRequired,
  },

  componentDidMount: function() {
    this.setInteraction();
  },

  componentWillReceiveProps: function(newProps) {
    var curChildren = this.props.children;
    var newChildren = newProps.children;

    if(React.Children.count(curChildren) !== React.Children.count(newChildren))
    {
      this.setState({offsetY: 0});
    }
  },
  
  setInteraction: function() {
    if(this.props.height <= this.props.maxDisplayedHeight) {
      return;
    }

    var self = this;

    interact(this.refs.scrollBar.getDOMNode())
      .draggable({
        restrict: {
          restriction: self.refs.scrollArea.getDOMNode(),
        }
      })
      .on('dragmove', function (event) {
        var scrollAreaHeight =
          self.props.maxDisplayedHeight -
          2 * self.consts.scrollBarPadding;

        var scrollFactor = self.props.height / scrollAreaHeight;
        
        self.scrollElement(scrollFactor * event.dy);
      });
  },

  makeViewBox: function() {
    var height = this.props.maxDisplayedHeight < this.props.height
      ? this.props.maxDisplayedHeight
      : this.props.height;

    return "0 " + this.state.offsetY + " " + this.props.width + " " + height;
  },

  onWheel: function(event) {
    this.scrollElement(event.deltaY);
    event.preventDefault();
    event.returnValue = false;
  },

  scrollElement: function(deltaY) {
    var newOffset = this.state.offsetY + deltaY;
    
    newOffset = Math.min(newOffset, this.props.height - this.props.maxDisplayedHeight);
    newOffset = Math.max(newOffset, 0);

    this.setState({offsetY: newOffset});
  },

  makeTriangle: function(x, y, width, height, direction) {
    var pointY = y + height * (direction === "up" ? 0.25 : 0.75);
    var baseY = y + height * (direction === "up" ? 0.75 : 0.25);

    var leftBaseX = x + width * 0.25;
    var pointX = x + width * 0.5;
    var rightBaseX = x + width * 0.75;

    var points =
      leftBaseX + "," + baseY + " " +
      pointX + "," + pointY + " " +
      rightBaseX + "," + baseY + " ";

    return (
      <polyline
        fill="black"
        stroke="black"
        strokeWidth="1"
        opacity="0.8"
        points={points}
        className="rf-scroll-arrow" />
    );
  },

  onTouchStart: function(event) {
    var initialTouch = event.targetTouches[0];

    this.touchY = initialTouch.pageY;
  },

  onTouchMove: function(event) {
    var newTouch = event.targetTouches[0];

    this.scrollElement(this.touchY - newTouch.pageY);

    this.touchY = newTouch.pageY;

    event.preventDefault();
    event.returnValue = false;
  },

  render: function() {
    if(this.props.maxDisplayedHeight >= this.props.height) {
      return (
        <svg
          x={this.props.x} y={this.props.y}
          width={this.props.width} height={this.props.height}
          className={this.props.className}>
          {this.props.children}
        </svg>
      );
    }

    var actualWidth = this.props.width;
    var actualHeight = this.props.maxDisplayedHeight;

    var scrollAreaX = this.props.width - this.props.scrollWidth;
    var scrollAreaWidth = this.props.scrollWidth;

    var scrollBarX = scrollAreaX + this.consts.scrollBarPadding;
    var scrollBarWidth = scrollAreaWidth - 2 * this.consts.scrollBarPadding;

    var scrollAreaY = this.props.y;
    var scrollAreaHeight = this.props.maxDisplayedHeight;

    var scrollBarHeight = (scrollAreaHeight - 2 * this.consts.scrollBarPadding) * this.props.maxDisplayedHeight / this.props.height;

    var effectiveBarArea = scrollAreaHeight - scrollBarHeight - 2 * this.consts.scrollBarPadding;
    var effectiveOffsetMax = this.props.height - this.props.maxDisplayedHeight;

    var scrollBarY = scrollAreaY + this.consts.scrollBarPadding + this.state.offsetY / effectiveOffsetMax * effectiveBarArea;

    var topScrollButtonY = this.props.y;
    var bottomScrollButtonY = this.props.y +
      this.props.maxDisplayedHeight -
      this.props.scrollWidth;

    return (
      <g className={this.props.className}>
        <svg
          x={this.props.x} y={this.props.y}
          width={actualWidth} height={actualHeight}
          viewBox={this.makeViewBox()}
          onWheel={this.onWheel}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}>
          <rect //Fixes mouse wheel scrolling on blank parts
            x={0} y={0}
            width={actualWidth} height={this.props.height}
            opacity="0"/>
          {this.props.children}
        </svg>

        <defs>
          <linearGradient id={this.consts.gradientId}>
            <stop offset="0%" stopColor="#CFCFCF"/>
            <stop offset="10%" stopColor="white"/>
            <stop offset="90%" stopColor="white"/>
            <stop offset="100%" stopColor="#CFCFCF"/>
          </linearGradient>
        </defs>

        <rect ref="scrollArea"
          x={scrollAreaX} y={scrollAreaY}
          width={scrollAreaWidth} height={scrollAreaHeight}
          fill={"url(#" + this.consts.gradientId + ")"}
          className="rf-scroll-area"/>
        <rect ref="scrollBar"
          x={scrollBarX} y={scrollBarY}
          width={scrollBarWidth} height={scrollBarHeight}
          rx={scrollBarWidth/2} ry={scrollBarWidth/2}
          fill="#989898"
          className="rf-scroll-bar"/>
      </g>
    );
  },
});

module.exports = ScrollableSVG;