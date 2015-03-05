var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {};
  },

  getDefaultProps: function() {
    return {
      x: 20,
      y: 20,
      lineHeight: 60,
      radius: 5
    }
  },

  render: function() {
    return (
      <g className="slider">
        <circle className="circle" cx={this.props.x} cy={this.props.y} r={this.props.radius} />
        <line x1={this.props.x} y1={this.props.y} x2={this.props.x} y2={this.props.y + this.props.lineHeight} stroke-width="2" stroke="black"/>
        <circle className="circle" cx={this.props.x} cy={this.props.y + this.props.lineHeight} r={this.props.radius} />
      </g>
    )
  }
});