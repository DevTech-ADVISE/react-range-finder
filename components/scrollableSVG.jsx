var react = require('react');
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
    scrollWidth: 10,
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
    var self = this;

    interact(this.refs.scrollBar.getDOMNode())
      .draggable({
        restrict: {
          restriction: self.refs.scrollArea.getDOMNode(),
        }
      })
      .on('dragmove', function (event) {
        self.scrollElement(event.dy);
      });
  },

  // componentDidUpdate: function() {
  //   var self = this;

  //   interact(this.refs.scrollBar.getDOMNode())
  //     .draggable({
  //       restrict: {
  //         targets: this.props.snapGrid,
  //         range: Infinity,
  //       }
  //     });
  // },

  makeViewBox: function() {
    var height = this.props.maxDisplayedHeight < this.props.height
      ? this.props.maxDisplayedHeight
      : this.props.height;

    return "0 " + this.state.offsetY + " " + this.props.width + " " + height;
  },

  onWheel: function(event) {
    this.scrollElement(event.deltaY);
  },

  scrollElement: function(deltaY) {
    var newOffset = this.state.offsetY + deltaY;

    newOffset = Math.min(newOffset, this.props.height - this.props.maxDisplayedHeight);
    newOffset = Math.max(newOffset, 0);

    this.setState({offsetY: newOffset});
  },

  render: function() {
    if(this.props.maxDisplayedHeight > this.props.height) {
      return <g className={this.props.className}>{this.props.children}</g>;
    }

    var actualWidth = this.props.width;
    var actualHeight = this.props.maxDisplayedHeight;

    var scrollX = this.props.width - this.consts.scrollWidth;
    var scrollWidth = this.consts.scrollWidth;

    var scrollAreaY = this.props.y;
    var scrollAreaHeight = this.props.maxDisplayedHeight;

    var scrollBarHeight = this.props.maxDisplayedHeight * this.props.maxDisplayedHeight / this.props.height;

    var effectiveBarArea = this.props.maxDisplayedHeight - scrollBarHeight;
    var effectiveOffsetMax = this.props.height - this.props.maxDisplayedHeight;

    var scrollBarY = this.props.y + this.state.offsetY / effectiveOffsetMax * effectiveBarArea;

    return (
      <g className={this.props.className}>
        <svg
          x={this.props.x} y={this.props.y}
          width={actualWidth} height={actualHeight}
          viewBox={this.makeViewBox()}
          onWheel={this.onWheel}>
          {this.props.children}
        </svg>
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
      </g>
    );
  },
});

module.exports = ScrollableSVG;