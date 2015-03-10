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
        var x = event.clientX;
        var value = self.props.valueLookup.byLocation[x];
        self.setState({x: x, value: value});
      });
  },

  render: function() {
    var y = this.props.y;
    return (
      <g className="slider">
        <text x={this.state.x} y={y - this.props.radius - this.consts.textMargin} textAnchor="middle">{this.state.value}</text>
        <circle className="circle" cx={this.state.x} cy={y} r={this.props.radius} />
        <line x1={this.state.x} y1={y} x2={this.state.x} y2={y + this.props.height} strokeWidth="2" stroke="black"/>
        <circle className="circle" cx={this.state.x} cy={y + this.props.height} r={this.props.radius} />
      </g>
    )
  }
});