var PropertyCalculatorMixin = {
  //The full height of the entire component
  calcComponentHeight: function() {
    return this.consts.barMarginTop +
      this.consts.barMarginBottom +
      this.consts.tickSize +
      this.consts.tickMargin +
      this.props.barHeight +
      this.calcCoverageHeight();
  },

  //the full width of the entire component
  calcComponentWidth: function() {
    return this.props.barWidth +
      this.consts.barMarginLeft +
      this.consts.barMarginRight;
  },

  //The full height of the coverage bars
  calcFullCoverageHeight: function() {
    return (this.seriesMapping.length + this.seriesGrouping.length) *
        (this.props.coverageBarHeight + this.consts.coverageBarMargin);
  },

  //the actual displayed height of the coverage bars
  calcCoverageHeight: function() {
    var fullHeight = this.calcFullCoverageHeight();

    return Math.min(fullHeight, this.props.maxCoverageHeight);
  },

  //the starting Y position of the sliders
  calcSliderY: function() {
    return this.consts.barMarginTop -
      this.consts.sliderRadius -
      this.consts.sliderMargin -
      this.consts.tickMargin -
      this.consts.tickSize;
  },

  //the height of each slider
  calcSliderHeight: function() {
    return  2 * this.consts.sliderRadius +
      2 * this.consts.sliderMargin +
      this.consts.tickSize +
      this.consts.tickMargin +
      this.props.barHeight +
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

  updateCalculations: function() {
    this.componentHeight = this.calcComponentHeight();
    this.componentWidth = this.calcComponentWidth();
    this.fullCoverageHeight = this.calcFullCoverageHeight();
    this.coverageHeight = this.calcCoverageHeight();
    this.sliderY = this.calcSliderY();
    this.sliderHeight = this.calcSliderHeight();
    this.coverageBarSpacing = this.calcCoverageBarSpacing();
    this.stepCount = this.calcStepCount();
  },

  componentDidUpdate: function() {
    this.updateCalculations();
  },

  componentWillMount: function() {
    this.updateCalculations();
  },
};

module.exports = PropertyCalculatorMixin;