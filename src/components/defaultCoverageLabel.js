var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');
var React = require('react');

var DefaultCoverageLabel = createReactClass({
  propTypes: {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    labelText: PropTypes.string.isRequired,
    dataProperty: PropTypes.string.isRequired,
    tooltip: PropTypes.string,

    //These props are suggested, mostly
    labelX: PropTypes.number.isRequired,
    labelY: PropTypes.number.isRequired,
    charLimit: PropTypes.number.isRequired,
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
