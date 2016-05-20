var data = [];

var start = 1;
var mid = 6;
var end = 10;

var series = 'series';
var value = 'value';
var colors = ['red','darkred','limegreen','darkgreen','dodgerblue','darkblue'];

function makeRange(label, start, end) {
  var arr = [];

  for(var i = start; i <= end; i++) {
    var dataObj = {};
    dataObj[series] = label;
    dataObj[value] = i;

    arr.push(dataObj);
  }

  return arr;
}

data = data.concat(makeRange('r1', start, end));
data = data.concat(makeRange('r2', mid, end));

var React = require('react');
var TestUtils = require('react-addons-test-utils')
var RangeFinder = require('../dist/react-range-finder');

var controler = function(){};

var RangeFinderRenderer = React.createClass({
  getInitialState: function() {
    return this.props;
  },

  componentDidMount: function() {
    controler = this.controlState;
  },

  controlState: function(newState) {
    this.setState(newState);
  },

  render: function() {
    return <RangeFinder {...this.state}/>
  }
});

describe('Range Finder', function() {
  var scryClass = TestUtils.scryRenderedDOMComponentsWithClass;
  var findClass = TestUtils.findRenderedDOMComponentWithClass;

  it('Shows value indicators', function() {
    var rangeFinder = TestUtils.renderIntoDocument(
      <RangeFinderRenderer
        id='yearSelector'
        min={start}
        max={end}
        data={data}
        rowLabelProperties={series}
        valueProperty={value}
        colors={colors}/>
    );

    var newStart = start + 1;
    var newEnd = end - 1;

    var indicators = scryClass(rangeFinder, 'rf-value-indicator');
    expect(indicators.length).toBe(0);

    var newRange = {start: newStart};
    controler({selectedRange: newRange});
    indicators = scryClass(rangeFinder, 'rf-value-indicator');
    expect(indicators.length).toBe(1);

    newRange = {start: newStart, end: newEnd};
    controler({selectedRange: newRange});
    indicators = scryClass(rangeFinder, 'rf-value-indicator');
    expect(indicators.length).toBe(2);

    newRange = {start: start, end: newEnd};
    controler({selectedRange: newRange});
    indicators = scryClass(rangeFinder, 'rf-value-indicator');
    expect(indicators.length).toBe(1);

    newRange = {start: start, end: end};
    controler({selectedRange: newRange});
    indicators = scryClass(rangeFinder, 'rf-value-indicator');
    expect(indicators.length).toBe(0);
  });

  it('Shows proper data density', function() {
    var rangeFinder = TestUtils.renderIntoDocument(
      <RangeFinderRenderer
        id='yearSelector'
        data={data}
        rowLabelProperties={series}
        valueProperty={value}
        colors={colors}/>
    );
    var density, newRange;

    density = findClass(rangeFinder, 'rf-density-label').props.children;
    expect(density).toBe('75% coverage');

    newRange = {end: mid-1};
    controler({selectedRange: newRange});
    density = findClass(rangeFinder, 'rf-density-label').props.children;
    expect(density).toBe('50% coverage');

    newRange = {start: mid, end: end};
    controler({selectedRange: newRange});
    density = findClass(rangeFinder, 'rf-density-label').props.children;
    expect(density).toBe('100% coverage');
  });

});
