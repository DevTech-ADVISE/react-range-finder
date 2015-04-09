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
      scrollMod: 20,
    };
  },

  consts: {
    scrollWidth: 15,
    scrollButtonMargin: 3,
  },

  propTypes: {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    //maxDisplayedWidth: React.PropTypes.number.isRequired, //Future plan?
    maxDisplayedHeight: React.PropTypes.number.isRequired,
  },

  componentDidMount: function() {
    this.setInteraction();
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
          2 * self.consts.scrollButtonMargin -
          2 * self.consts.scrollWidth;

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
          width={actualWidth} height={actualHeight}
          className={this.props.className}>
          {this.props.children}
        </svg>
      );
    }

    var actualWidth = this.props.width;
    var actualHeight = this.props.maxDisplayedHeight;

    var scrollX = this.props.width - this.consts.scrollWidth;
    var scrollWidth = this.consts.scrollWidth;

    var scrollAreaY = this.props.y + this.consts.scrollButtonMargin + scrollWidth;
    var scrollAreaHeight =
      this.props.maxDisplayedHeight -
      2 * this.consts.scrollButtonMargin -
      2 * scrollWidth;

    var scrollBarHeight = scrollAreaHeight * this.props.maxDisplayedHeight / this.props.height;

    var effectiveBarArea = scrollAreaHeight - scrollBarHeight;
    var effectiveOffsetMax = this.props.height - this.props.maxDisplayedHeight;

    var scrollBarY = scrollAreaY + this.state.offsetY / effectiveOffsetMax * effectiveBarArea;

    var topScrollButtonY = this.props.y;
    var bottomScrollButtonY = this.props.y +
      this.props.maxDisplayedHeight -
      this.consts.scrollWidth;

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

        {this.makeTriangle(scrollX, topScrollButtonY, scrollWidth, scrollWidth, "up")}
        <rect 
          x={scrollX} y={topScrollButtonY}
          width={scrollWidth} height={scrollWidth}
          fill="gray" opacity="0.5"
          onClick={this.scrollElement.bind(this, -this.props.scrollMod)}
          className="rf-scroll-button"/>

        <rect ref="scrollArea"
          x={scrollX} y={scrollAreaY}
          width={scrollWidth} height={scrollAreaHeight}
          fill="gray" opacity="0.5"
          className="rf-scroll-area"/>
        <rect ref="scrollBar"
          x={scrollX} y={scrollBarY}
          width={scrollWidth} height={scrollBarHeight}
          fill="gray" opacity="0.8"
          className="rf-scroll-bar"/>

        {this.makeTriangle(scrollX, bottomScrollButtonY, scrollWidth, scrollWidth, "down")}
        <rect 
          x={scrollX} y={bottomScrollButtonY}
          width={scrollWidth} height={scrollWidth}
          fill="gray" opacity="0.5"
          onClick={this.scrollElement.bind(this, this.props.scrollMod)}
          className="rf-scroll-button"/>
      </g>
    );
  },
});

module.exports = ScrollableSVG;