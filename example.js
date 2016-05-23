var React = require('react');
var ReactDOM = require('react-dom');
var RangeFinder = require('./src/react-range-finder.js');
var dataGenerator = require('./sampleDataGenerator');

var start = 1990;
var end = 2015;

var series = dataGenerator.makeData(start, end);
var schema = dataGenerator.makeSchema();
console.log(series)
function log(message) {
  console.log(message);
}

function onStartDragMove(value) {
  log("Current start year: " + value);
}

function onEndDragMove(value) {
  log("Current end year: " + value);
}

function onDragMove(start, end) {
  log("Current year set: " + start + " " + end);
}

function onStartDragEnd(value) {
  log("Selected start year: " + value);
}

function onEndDragEnd(value) {
  log("Selected end year: " + value);
}

function onDragEnd(start, end) {
  log("Date Range: " + start + "-" + end + ", " + (end - start + 1) + " years selected");
}

var RemoveOnClickLabel = React.createClass({
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
    return text.substring(0, charLimit) + "...";
  },

  onClick: function() {
    this.props.removeData(this.props.dataProperty, this.props.labelText);
  },

  render: function() {
    var label = this.truncateText(this.props.labelText, this.props.charLimit);

    return (
      <text
        className={this.props.className}
        x={this.props.labelX}
        y={this.props.labelY}
        onClick={this.onClick}
        data-tip={this.props.tooltip}>
        {label}
      </text>
    );
  }
});

var RangeFinderTester = React.createClass({
  getInitialState: function() {
    return {data: series};
  },

  removeData: function(dataProp, labelText) {
    var newData = this.state.data.filter(function(data) {
      return data[dataProp] !== labelText;
    });

    this.setState({data: newData});
  },

  update: function() {
    var min = parseInt(ReactDOM.findDOMNode(this.refs.min).value);
    var max = parseInt(ReactDOM.findDOMNode(this.refs.max).value);

    var newData = dataGenerator.makeData(min, max);

    this.setState({data: newData});
  },

  render: function() {
    if(this.state.data.length === 0) {
      return <div>You must have data (i.e. refresh the page)</div>
    }


    var clickLabelProps = {removeData: this.removeData};

    return (
      <div>
        <input type="number" ref="min"/> --- <input type="number" ref="max"/> --- <button onClick={this.update}>Update Min/Max</button>
        <br/><br/>
        <RangeFinder
          id="yearSelector"
          data={this.state.data}
          rowLabelProperties={schema.series}
          valueProperty={schema.value}
          metadataProperty={schema.metadata}
          colors={schema.colors}
          coverageLabel={RemoveOnClickLabel}
          coverageLabelProps={clickLabelProps}
          onDrag={onDragMove}
          onDragRangeStart={onStartDragMove}
          onDragRangeEnd={onEndDragMove}
          onRelease={onDragEnd}
          onReleaseRangeStart={onStartDragEnd}
          onReleaseRangeEnd={onEndDragEnd}/>
      </div>
    )
  }
});

ReactDOM.render(
  <RangeFinderTester/>,
  document.getElementById('content'));
