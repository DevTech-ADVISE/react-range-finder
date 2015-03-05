var React = require('react');
var interact = require('interact.js');

var Slider = require('./components/slider.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {x: 20, y: 20};
  },

  componentWillMount: function() {
    var self = this;

    interact(".slider")
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

        self.setState({x: event.pageX});
      });
  },

  render: function() {
    return (
      <svg id="svg" width="400" height="400">
        <Slider x={this.state.x} y={this.state.y}/>
      </svg>
    )
  }
});