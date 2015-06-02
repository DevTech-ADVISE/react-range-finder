var PropertyCalculatorMixin = {
  //The full height of the entire component
  calcFullComponentHeight: function(props, state) {
    return props.height;
  },

  //the full width of the entire component
  calcFullComponentWidth: function(props, state) {
    return props.width;
  },

  //The height of the visible parts of the component
  calcComponentHeight: function(props, state) {
    return this.calcFullComponentHeight(props, state) -
      this.consts.marginTop -
      this.consts.marginBottom;
  },

  //the width of the visible parts of the component
  calcComponentWidth: function(props, state) {
    return this.calcFullComponentWidth(props, state) -
      this.consts.marginLeft -
      this.consts.marginRight;
  },

  calcCoverageWidth: function(props, state) {
    return this.calcComponentWidth(props, state) -
      this.calcScrollBarWidth(props, state) -
      this.props.labelColumnWidth;
  },

  calcCoverageHeight: function(props, state) {
    return Math.min(this.calcAllocatedHeight(props, state), this.calcFullCoverageHeight(props, state));
  },

  //The full height of the coverage bars
  calcFullCoverageHeight: function(props, state) {
    return (this.calcCoverageBarCount(props, state) + this.calcCoverageGroupingCount(props, state)) *
        (props.coverageBarHeight + this.consts.coverageBarMargin);
  },

  //the starting Y position of the sliders
  calcSliderY: function(props, state) {
    return this.calcBarBottom(props, state) + this.consts.coverageGap/2;
  },

  //the height of each slider
  calcSliderHeight: function(props, state) {
    var coverageHeight = this.calcCoverageHeight(props, state);

    if(coverageHeight === 0) {
      return 0;
    }

    return coverageHeight + this.consts.coverageGap/2;
  },

  //The total space a coverage bar represents (bar and margin)
  calcCoverageBarSpacing: function(props, state) {
    return props.coverageBarHeight +
    this.consts.coverageBarMargin;
  },

  calcStepCount: function(props, state) {
    //+1 due to start/end not being able to overlap
    return (state.max - state.min) / props.stepSize + 1;
  },

  calcBarBottom: function(props, state) {
    return this.consts.marginTop +
      props.headerBarHeight;
  },

  calcAllocatedHeight: function(props, state) {
    return props.height -
      this.consts.marginTop - 
      props.headerBarHeight -
      this.consts.coverageBarMargin/2 -
      this.consts.marginBottom;
  },

  calcNeedsScrollBar: function(props, state) {
    return this.calcFullCoverageHeight(props, state) > this.calcAllocatedHeight(props, state);
  },

  calcScrollBarWidth: function(props, state) {
    return this.calcNeedsScrollBar(props, state) ? this.consts.scrollWidth : 0;
  },

  calcNeedsCoverage: function(props, state) {
    return this.dataMapping && this.dataMapping.length > 0;
  },

  calcNeedsGrouping: function(props, state) {
    return this.dataGrouping && this.dataGrouping.length > 0;
  },

  calcCoverageBarCount: function(props, state) {
    if(!this.dataMapping) {
      return 0;
    }

    return this.dataMapping.length;
  },

  calcCoverageGroupingCount: function(props, state) {
    if(!this.dataGrouping) {
      return 0;
    }

    return this.dataGrouping.length;
  },

  makeSnapGrid: function(props, state) {
    var start = state.min;
    var end = state.max;

    var stepCount = this.calcStepCount(props, state);

    var stepWidth = this.calcCoverageWidth(props, state) / stepCount;

    var snapTargets = [];

    for(var i = 0; i <= stepCount; i++) {
      var x = props.labelColumnWidth + i * stepWidth;
      var value = start + i * props.stepSize;

      snapTargets.push({ x: x, value: value, isEndPoint: i === 0 || i === stepCount });
    }

    return snapTargets;
  },

  makeValueLookup: function(props, state) {
    var snapGrid = this.makeSnapGrid(props, state);

    var valueLookup = {};
    valueLookup.byValue = {};
    valueLookup.byLocation = {};
    valueLookup.isEndPoint = {};

    for (var key in snapGrid) {
      var xLocation = snapGrid[key].x;
      var value = snapGrid[key].value;

      valueLookup.byValue[value] = xLocation;
      valueLookup.byLocation[xLocation] = value;
      valueLookup.isEndPoint[xLocation] = snapGrid[key].isEndPoint;
    }

    return valueLookup;
  },

  updateCalculations: function(props, state) {
    this.fullComponentHeight = this.calcFullComponentHeight(props, state);
    this.fullComponentWidth = this.calcFullComponentWidth(props, state);
    this.componentHeight = this.calcComponentHeight(props, state);
    this.componentWidth = this.calcComponentWidth(props, state);
    this.coverageWidth = this.calcCoverageWidth(props, state);
    this.coverageHeight = this.calcCoverageHeight(props, state);
    this.fullCoverageHeight = this.calcFullCoverageHeight(props, state);
    this.sliderY = this.calcSliderY(props, state);
    this.sliderHeight = this.calcSliderHeight(props, state);
    this.coverageBarSpacing = this.calcCoverageBarSpacing(props, state);
    this.stepCount = this.calcStepCount(props, state);
    this.barBottom = this.calcBarBottom(props, state);
    this.needsScrollBar = this.calcNeedsScrollBar(props, state);
    this.needsCoverage = this.calcNeedsCoverage(props, state);
    this.needsGrouping = this.calcNeedsGrouping(props, state);
    this.coverageBarCount = this.calcCoverageBarCount(props, state);
    this.coverageGroupingCount = this.calcCoverageGroupingCount(props, state);

    this.snapGrid = this.makeSnapGrid(props, state);
    this.valueLookup = this.makeValueLookup(props, state);
  },

  componentWillUpdate: function(props, state) {
    this.updateCalculations(props, state);
  },

  componentWillMount: function() {
    this.updateCalculations(this.props, this.state);
  },
};

module.exports = PropertyCalculatorMixin;