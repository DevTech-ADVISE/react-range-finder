// jest.dontMock('../src/range-finder.js');
// jest.dontMock('../src/mixins/calculatedPropertyMixin.js');
// jest.dontMock('../src/mixins/componentMakerMixin.js');
// jest.dontMock('../src/mixins/rangeFinderSetupMixin.js');
// jest.dontMock('../src/components/coverageBar.js');
// jest.dontMock('../src/components/scrollableSVG.js');
// jest.dontMock('../src/components/slider.js');
// jest.dontMock('interact.js');

jest.autoMockOff();

var data = [];

var start = 1;
var mid = 6;
var end = 10;

var series = "series";
var value = "value";
var colors = ["red","darkred","limegreen","darkgreen","dodgerblue","darkblue"];

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

data = data.concat(makeRange("r1", start, end));
data = data.concat(makeRange("r2", mid, end));

var React = require('react/addons');
var RangeFinder = require('../src/range-finder.js');

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
  var TestUtils = React.addons.TestUtils;

  var scryClass = TestUtils.scryRenderedDOMComponentsWithClass;
  var findClass = TestUtils.findRenderedDOMComponentWithClass;

  it('Shows value indicators', function() {
    var rangeFinder = TestUtils.renderIntoDocument(
      <RangeFinderRenderer 
        id="yearSelector"
        data={data}
        rowLabelProperties={series}
        valueProperty={value}
        colors={colors}/>
    );

    var newStart = start + 1;
    var newEnd = end - 1;

    var indicators = scryClass(rangeFinder, 'rf-value-indeicators');
    expect(indicators.length).toBe(0);

    var newRange = {start: newStart};
    controler({selectedRange: newRange});
    indicators = scryClass(rangeFinder, 'rf-value-indeicators');
    expect(indicators.length).toBe(1);

    newRange = {start: newStart, end: newEnd};
    controler({selectedRange: newRange});
    indicators = scryClass(rangeFinder, 'rf-value-indeicators');
    expect(indicators.length).toBe(2);

    newRange = {end: newEnd};
    controler({selectedRange: newRange});
    indicators = scryClass(rangeFinder, 'rf-value-indeicators');
    expect(indicators.length).toBe(1);

    newRange = {};
    controler({selectedRange: newRange});
    indicators = scryClass(rangeFinder, 'rf-value-indeicators');
    expect(indicators.length).toBe(0);
  });

  it('Shows proper data density', function() {
    var rangeFinder = TestUtils.renderIntoDocument(
      <RangeFinderRenderer 
        id="yearSelector"
        data={data}
        rowLabelProperties={series}
        valueProperty={value}
        colors={colors}/>
    );

    var density = findClass(rangeFinder, 'rf-density-label').props.children;
    expect(density).toBe("75% coverage");

    var newRange = {end: mid-1};
    controler({selectedRange: newRange});
    indicators = scryClass(rangeFinder, 'rf-value-indeicators');
    expect(density).toBe("50% coverage");

    var newRange = {start: mid};
    controler({selectedRange: newRange});
    indicators = scryClass(rangeFinder, 'rf-value-indeicators');
    expect(density).toBe("100% coverage");
  });

});