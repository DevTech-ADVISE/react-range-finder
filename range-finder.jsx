var React = require('react');

var NumberNav = require('./components/number-navigator.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {x: 50, y: 50};
  },

  render: function() {
    var width = 300;

    return (
      <svg id="svg" width="400" height="400">
        <NumberNav x={this.state.x} y={this.state.y} width={width} />
      </svg>
    )
  }
});