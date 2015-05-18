var PropertyCalculatorMixin = {
  //The full height of the entire component
  calcComponentHeight: function(props, state) {
    return this.consts.barMarginTop +
      this.consts.barMarginBottom +
      props.barHeight +
      this.calcCoverageHeight(props, state);
  },

  //the full width of the entire component
  calcComponentWidth: function(props, state) {
    return props.barWidth +
      this.consts.barMarginLeft +
      this.consts.scrollWidth;
  },

  calcEffectiveHeight: function(props, state) {
    return this.consts.barMarginTop +
      props.barHeight +
      this.consts.coverageBarMargin/2 +
      this.calcCoverageHeight(props, state);
  },

  //the full width of the entire component
  calcEffectiveWidth: function(props, state) {
    return props.barWidth +
      this.consts.barMarginLeft;
  },

  //The full height of the coverage bars
  calcFullCoverageHeight: function(props, state) {
    return (this.calcCoverageBarCount(props, state) + this.calcCoverageGroupingCount(props, state)) *
        (props.coverageBarHeight + this.consts.coverageBarMargin);
  },

  //the actual displayed height of the coverage bars
  calcCoverageHeight: function(props, state) {
    var fullHeight = this.calcFullCoverageHeight(props, state);

    return Math.min(fullHeight, props.maxCoverageHeight);
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
    return this.consts.barMarginTop +
      props.barHeight;
  },

  calcNeedsScrollBar: function(props, state) {
    return this.calcFullCoverageHeight(props, state) > props.maxCoverageHeight;
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

    var stepWidth = props.barWidth / stepCount;

    var snapTargets = [];

    for(var i = 0; i <= stepCount; i++) {
      var x = this.consts.barMarginLeft + i * stepWidth;
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
    this.componentHeight = this.calcComponentHeight(props, state);
    this.componentWidth = this.calcComponentWidth(props, state);
    this.effectiveHeight = this.calcEffectiveHeight(props, state);
    this.effectiveWidth = this.calcEffectiveWidth(props, state);
    this.fullCoverageHeight = this.calcFullCoverageHeight(props, state);
    this.coverageHeight = this.calcCoverageHeight(props, state);
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