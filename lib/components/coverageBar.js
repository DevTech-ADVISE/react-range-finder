var React = require('react');
var Opentip = require('opentip');

require('opentip/css/opentip.css');

Opentip.styles.close = {
  extends: 'standard',
  offset: [-3, -3],
  borderRadius: 2,
  borderColor: '#333333',
  background: '#333333',
  className: 'rf-tooltip'
};

Opentip.defaultStyle = 'close';


var CoverageBar = React.createClass({
  getInitialState: function() {
    return {};
  },

  propTypes: {
    charLimit: React.PropTypes.number,
    color: React.PropTypes.string,
    coverage: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        start: React.PropTypes.number,
        end: React.PropTypes.number
      })
    ).isRequired,
    coverageLabelProps: React.PropTypes.object,
    dataProperty: React.PropTypes.string,
    height: React.PropTypes.number,
    label: React.PropTypes.string,
    labelWidth: React.PropTypes.number,
    max: React.PropTypes.number.isRequired,
    min: React.PropTypes.number.isRequired,
    openTipOptions: React.PropTypes.object,
    textMargin: React.PropTypes.number,
    tooltip: React.PropTypes.string,
    width: React.PropTypes.number.isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired
  },

  getDefaultProps: function() {
    return {
      height: 5,
      textMargin: 20,
      color: 'black',
      openTipOptions: {delay: 0, hideDelay: 0, showEffectDuration: 0, hideEffectDuration: 0, tipJoint: 'top left', stem: false, offset: [3, 10]}
    };
  },

  makeCoverageBar: function(barStart, barEnd, id) {
    var tooltip = barStart + ' to ' + barEnd;

    var start = this.props.min;
    var end = this.props.max + this.props.stepSize;
    var width = this.props.width;

    barEnd += this.props.stepSize;

    var range = end - start;
    var barRange = barEnd - barStart;
    var barOffset = barStart - start;

    var barWidth = width * barRange / range;
    var barX = this.props.x + width * barOffset / range;

    barWidth = Math.max(barWidth, 1);

    var y = this.props.y + (this.props.height - this.props.barHeight) / 2;

    return (
      <rect
        key={'coverageBar' + id}
        x={barX}
        y={y}
        width={barWidth}
        height={this.props.barHeight}
        fill={this.props.color}
        ref={this.createTooltip.bind(this, tooltip)}
        className='rf-coverage-bar'/>
    );
  },

  createTooltip: function(tooltip, component) {
    if(component === null) {
      return;
    }

    if(component.tooltip) {
      return;
    }

    component.tooltip = new Opentip(React.findDOMNode(component), tooltip, this.props.openTipOptions);
  },

  render: function() {
    var dataDensity = 0;

    var bars = this.props.coverage.map(function (item, id) {
        dataDensity += item.end - item.start + 1;
        return this.makeCoverageBar(item.start, item.end, id);
      }, this);

    dataDensity /= this.props.max - this.props.min + 1;

    var x1 = this.props.x;
    var x2 = this.props.x + this.props.width;

    var y = this.props.y + this.props.height / 2;
    var textYAdjust = 5;

    var CoverageLabel = this.props.coverageLabel;

    return (
      <g className='rf-coverage'>
        <line
          x1={x1} y1={y}
          x2={x2} y2={y}
          strokeWidth='1'
          stroke={this.props.color}
          strokeDasharray='5, 5'
          className='rf-coverage-line'/>

        {bars}

        <CoverageLabel
          coveragePercentage={Math.floor(dataDensity * 100)}
          x={this.props.x} y={this.props.y}
          width={this.props.labelWidth} height={this.props.height}
          labelText={this.props.label}
          dataProperty={this.props.dataProperty}
          labelX={this.props.textMargin}
          labelY={y + textYAdjust}
          charLimit={this.props.charLimit}
          className='rf-label rf-coverage-label'
          {...this.props.coverageLabelProps}/>
      </g>
    );
  }
});

module.exports = CoverageBar;