var React = require('react');
var interact = require('interact.js');

module.exports = React.createClass({
  getInitialState: function() {
    return {x: this.props.x, y: this.props.y};
  },

  getDefaultProps: function() {
    return {
      x: 20,
      y: 20,
      lineHeight: 60,
      radius: 5
    }
  },

  componentDidMount: function() {
    var self = this;

    interact(self.getDOMNode())
      .draggable({
        snap: {
          targets: [
            interact.createSnapGrid({ x: 20 })
          ],
          range: Infinity,
          elementOrigin: { x: 0, y: 0 }
        },
        inertia: true,
        restrict: {
          restriction: document.getElementById("svg"),
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
          endOnly: false
        }
      })
      .on('dragmove', function (event) {
        console.log(event);
        self.setState({x: event.pageX});
      });
  },

  render: function() {
    return (
      <g className="slider">
        <circle className="circle" cx={this.state.x} cy={this.state.y} r={this.props.radius} />
        <line x1={this.state.x} y1={this.state.y} x2={this.state.x} y2={this.state.y + this.props.lineHeight} strokeWidth="2" stroke="black"/>
        <circle className="circle" cx={this.state.x} cy={this.state.y + this.props.lineHeight} r={this.props.radius} />
      </g>
    )
  }
});