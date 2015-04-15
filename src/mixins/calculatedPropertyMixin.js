var PropertyCalculatorMixin = {
  //The full height of the entire component
  calcComponentHeight: function() {
    return this.consts.barMarginTop +
      this.consts.barMarginBottom +
      this.props.barHeight +
      this.calcCoverageHeight();
  },

  //the full width of the entire component
  calcComponentWidth: function() {
    return this.props.barWidth +
      this.consts.barMarginLeft +
      this.consts.scrollWidth;
  },

  calcEffectiveHeight: function() {
    return this.consts.barMarginTop +
      this.props.barHeight +
      this.consts.coverageBarMargin/2 +
      this.calcCoverageHeight();
  },

  //the full width of the entire component
  calcEffectiveWidth: function() {
    return this.props.barWidth +
      this.consts.barMarginLeft;
  },

  //The full height of the coverage bars
  calcFullCoverageHeight: function() {
    if(!this.seriesMapping) {
      return 0;
    }
    return (this.calcCoverageBarCount() + this.calcCoverageGroupingCount()) *
        (this.props.coverageBarHeight + this.consts.coverageBarMargin);
  },

  //the actual displayed height of the coverage bars
  calcCoverageHeight: function() {
    var fullHeight = this.calcFullCoverageHeight();

    return Math.min(fullHeight, this.props.maxCoverageHeight);
  },

  //the starting Y position of the sliders
  calcSliderY: function() {
    return this.calcBarBottom();
  },

  //the height of each slider
  calcSliderHeight: function() {
    return this.consts.sliderRadius +
      this.calcCoverageHeight();
  },

  //The total space a coverage bar represents (bar and margin)
  calcCoverageBarSpacing: function() {
    return this.props.coverageBarHeight +
    this.consts.coverageBarMargin;
  },

  calcStepCount: function() {
    return (this.props.end - this.props.start) / this.props.stepSize;
  },

  calcBarBottom: function() {
    return this.consts.barMarginTop +
      this.props.barHeight;
  },

  calcNeedsScrollBar: function() {
    return this.calcFullCoverageHeight() > this.props.maxCoverageHeight;
  },

  calcNeedsCoverage: function() {
    return this.seriesMapping && this.seriesMapping.length > 0;
  },

  calcNeedsGrouping: function() {
    return this.seriesGrouping && this.seriesGrouping.length > 0;
  },

  calcCoverageBarCount: function() {
    if(!this.seriesMapping) {
      return 0;
    }

    return this.seriesMapping.length;
  },

  calcCoverageGroupingCount: function() {
    if(!this.seriesGrouping) {
      return 0;
    }

    return this.seriesGrouping.length;
  },

  updateCalculations: function() {
    this.componentHeight = this.calcComponentHeight();
    this.componentWidth = this.calcComponentWidth();
    this.effectiveHeight = this.calcEffectiveHeight();
    this.effectiveWidth = this.calcEffectiveWidth();
    this.fullCoverageHeight = this.calcFullCoverageHeight();
    this.coverageHeight = this.calcCoverageHeight();
    this.sliderY = this.calcSliderY();
    this.sliderHeight = this.calcSliderHeight();
    this.coverageBarSpacing = this.calcCoverageBarSpacing();
    this.stepCount = this.calcStepCount();
    this.barBottom = this.calcBarBottom();
    this.needsScrollBar = this.calcNeedsScrollBar();
    this.needsCoverage = this.calcNeedsCoverage();
    this.needsGrouping = this.calcNeedsGrouping();
    this.coverageBarCount = this.calcCoverageBarCount();
    this.coverageGroupingCount = this.calcCoverageGroupingCount();
  },

  componentDidUpdate: function() {
    this.updateCalculations();
  },

  componentWillMount: function() {
    this.updateCalculations();
  },
};

module.exports = PropertyCalculatorMixin;