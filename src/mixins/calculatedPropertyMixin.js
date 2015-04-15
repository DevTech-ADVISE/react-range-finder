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
    return this.calcBarBottom(props, state);
  },

  //the height of each slider
  calcSliderHeight: function(props, state) {
    return this.consts.sliderRadius +
      this.calcCoverageHeight(props, state);
  },

  //The total space a coverage bar represents (bar and margin)
  calcCoverageBarSpacing: function(props, state) {
    return props.coverageBarHeight +
    this.consts.coverageBarMargin;
  },

  calcStepCount: function(props, state) {
    return (props.end - props.start) / props.stepSize;
  },

  calcBarBottom: function(props, state) {
    return this.consts.barMarginTop +
      props.barHeight;
  },

  calcNeedsScrollBar: function(props, state) {
    return this.calcFullCoverageHeight(props, state) > props.maxCoverageHeight;
  },

  calcNeedsCoverage: function(props, state) {
    return this.seriesMapping && this.seriesMapping.length > 0;
  },

  calcNeedsGrouping: function(props, state) {
    return this.seriesGrouping && this.seriesGrouping.length > 0;
  },

  calcCoverageBarCount: function(props, state) {
    if(!this.seriesMapping) {
      return 0;
    }

    return this.seriesMapping.length;
  },

  calcCoverageGroupingCount: function(props, state) {
    if(!this.seriesGrouping) {
      return 0;
    }

    return this.seriesGrouping.length;
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
  },

  componentWillUpdate: function(props, state) {
    this.updateCalculations(props, state);
  },

  componentWillMount: function() {
    this.updateCalculations(this.props, this.state);
  },
};

module.exports = PropertyCalculatorMixin;