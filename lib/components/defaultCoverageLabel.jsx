var React = require('react');

var DefaultCoverageLabel = React.createClass({
  propTypes: {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    labelText: React.PropTypes.string.isRequired,
    dataProperty: React.PropTypes.string.isRequired,
    tooltip: React.PropTypes.string,

    //These props are suggested, mostly
    labelX: React.PropTypes.number.isRequired,
    labelY: React.PropTypes.number.isRequired,
    charLimit: React.PropTypes.number.isRequired,
  },

  truncateText: function(text, charLimit) {
    if(!text || text.length <= charLimit + 3) { // +3 for the dots.
      return text;
    }
    return text.substring(0, charLimit) + '...';
  },

  render: function() {
    var label = this.truncateText(this.props.labelText, this.props.charLimit);

    return (
      <text
        className={this.props.className}
        x={this.props.labelX}
        y={this.props.labelY}
        data-tip={this.props.tooltip}>
        {label}
      </text>
    );
  }
});

module.exports = DefaultCoverageLabel;