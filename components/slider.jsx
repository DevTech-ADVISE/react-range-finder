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
      height: 60,
      radius: 5
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
        self.setState({x: event.pageX});
      });
  },

  render: function() {
    return (
      <g className="slider">
        <circle className="circle" cx={this.state.x} cy={this.state.y} r={this.props.radius} />
        <line x1={this.state.x} y1={this.state.y} x2={this.state.x} y2={this.state.y + this.props.height} strokeWidth="2" stroke="black"/>
        <circle className="circle" cx={this.state.x} cy={this.state.y + this.props.height} r={this.props.radius} />
      </g>
    )
  }
});