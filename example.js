var React = require('react');
var RangeFinder = require('./lib/react-range-finder.jsx');
var dataGenerator = require('./sampleDataGenerator');


var start = 1965;
var end = 2015;

var series = dataGenerator.makeData(start, end);
var schema = dataGenerator.makeSchema();

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
        data-ot={this.props.tooltip}>
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

  render: function() {
    if(this.state.data.length === 0) {
      return <div>You must have data (i.e. refresh the page)</div>
    }


    var clickLabelProps = {removeData: this.removeData};

    return (
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
    )
  }
});

React.render(
  <RangeFinderTester/>,
  document.getElementById('content'));