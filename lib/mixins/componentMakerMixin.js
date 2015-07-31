var React = require('react');
var Slider = require('../components/slider.js');
var CoverageBar = require('../components/coverageBar.js');

var tinyColor = require('tinycolor2');

var ComponentMakerMixin = {
  makeTicks: function(snapGrid) {
    var y1 = this.barY + this.props.headerBarHeight;
    var y2 = y1 - this.consts.tickSize;

    var ticks = [];

    for(var key in snapGrid) {
      var x = snapGrid[key].x;

      ticks.push(
        <line
          key={'tick' + key}
          x1={x} y1={y1}
          x2={x} y2={y2}
          strokeWidth="1"
          stroke="#A8A8A8" />
      );
    }

    return ticks;
  },

  calculateDensityColor: function(factor) {
    var scale = 100 * factor;

    var fromColor = tinyColor(this.props.densityLowColor);
    var toColor = tinyColor(this.props.densityHighColor);

    if(this.props.densityMidColor === null) {
      return tinyColor.mix(fromColor, toColor, scale).toRgbString();
    }

    scale *= 2;

    switch(scale) {
      case 0:
        return tinyColor(this.props.densityLowColor).toRgbString();
      case 100:
        return tinyColor(this.props.densityMidColor).toRgbString();
      case 200:
        return tinyColor(this.props.densityHighColor).toRgbString();
    }

    if(scale > 100) {
      scale -= 100;
      fromColor = tinyColor(this.props.densityMidColor);
      toColor = tinyColor(this.props.densityHighColor);
    } else {
      fromColor = tinyColor(this.props.densityLowColor);
      toColor = tinyColor(this.props.densityMidColor);
    }

    return tinyColor.mix(fromColor, toColor, scale).toRgbString();
  },

  makeGradient: function() {
    var length = this.state.max - this.state.min;
    var count = 0;

    if(length === 0) {
      return null;
    }

    var factor = 1 / length;

    var gradientInfo = [];

    this.dataDensity.forEach(function(density, id) {
      var color = this.calculateDensityColor(density);
      var midOffset = count++ / length;
      var prevOffset = midOffset - factor;
      var nextOffset = midOffset + factor;

      var lowerOffset = 100 * Math.max((midOffset + prevOffset) / 2, 0) + '%';
      var higherOffset = 100 * Math.min((nextOffset + midOffset) / 2, 1) + '%';

      gradientInfo.push(<stop key={id + 'l'} offset={lowerOffset} stopColor={color} />);
      gradientInfo.push(<stop key={id + 'h'} offset={higherOffset} stopColor={color} />);
    }, this);

    return (
      <defs>
        <linearGradient id={this.consts.gradientId}>
          {gradientInfo}
        </linearGradient>
      </defs>
    );
  },

  scrollUpdaterFunc: function(){},

  handleSliderScroll: function(deltaY) {
    this.scrollUpdaterFunc(deltaY);
  },

  makeSliders: function(snapGrid) {
    var valueLookup = this.valueLookup;

    var leftX = valueLookup.byValue[this.state.start];
    var rightX = valueLookup.byValue[this.state.end + this.props.stepSize];

    var startSnapGrid = [];
    var endSnapGrid = [];

    for (var key in snapGrid) {
      var snapObject = snapGrid[key];
      var x = snapObject.x;

      if(x < rightX) {
        startSnapGrid.push(snapObject);
      }
      if(x > leftX) {
        endSnapGrid.push(snapObject);
      }
    }

    var stepWidth = this.coverageWidth / this.stepCount;
    var ghostSize = this.consts.ghostSize;

    //move the left side over more bcause that's where the content is
    var startX = snapGrid[0].x - ghostSize;
    var endX = snapGrid[snapGrid.length - 1].x + stepWidth;


    var sliders = [];

    sliders.push(
      <Slider
        key="leftSlider"
        x={leftX}
        y={this.sliderY}
        height={this.sliderHeight}
        handleSize={this.consts.sliderRadius}
        fontSize={this.consts.textSize}
        snapGrid={startSnapGrid}
        valueLookup={valueLookup}
        startX={startX}
        endX={rightX}
        onScroll={this.handleSliderScroll}
        ghostSize={ghostSize}
        valueOffset={0}
        onDrag={this.onDragRangeStart}
        onRelease={this.onReleaseRangeStart}/>
    );
    sliders.push(
      <Slider
        key="rightSlider"
        x={rightX}
        y={this.sliderY}
        height={this.sliderHeight}
        handleSize={this.consts.sliderRadius}
        fontSize={this.consts.textSize}
        snapGrid={endSnapGrid}
        valueLookup={valueLookup}
        startX={leftX}
        endX={endX}
        onScroll={this.handleSliderScroll}
        ghostSize={ghostSize}
        valueOffset={-this.props.stepSize}
        onDrag={this.onDragRangeEnd}
        onRelease={this.onReleaseRangeEnd}/>
    );

    return sliders;
  },

  onDragRangeStart: function(start) {
    this.setState({start: start});
    this.props.onDragRangeStart(start);
    this.props.onDrag(start, this.state.end);
  },

  onDragRangeEnd: function(end) {
    this.setState({end: end});

    this.props.onDragRangeEnd(end);
    this.props.onDrag(this.state.start, end);
  },

  onReleaseRangeStart: function(start) {
    this.setState({start: start});

    this.props.onReleaseRangeStart(start);
    this.props.onRelease(start, this.state.end);
  },

  onReleaseRangeEnd: function(end) {
    this.setState({end: end});

    this.props.onReleaseRangeEnd(end);
    this.props.onRelease(this.state.start, end);
  },

  makeCoverage: function() {
    if(!this.needsCoverage) {
      return [];
    }

    var x = this.barX;
    var startY = 0;

    var colors = this.makeColors();

    var previousCategory = null;
    var yOffset = 0;

    var coverageBars = [];

    this.dataMapping.forEach(function(data, id) {
      var label = data.dataNames[data.dataNames.length - 1];
      var dataText = this.props.toolTipText(data);

      if(data.dataNames.length > 1) {
        var category = data.dataNames[data.dataNames.length - 2];

        if(previousCategory !== category) {
          previousCategory = category;
          yOffset += this.coverageBarSpacing;
        }
      }

      var y =
        startY +
        id * this.coverageBarSpacing +
        yOffset;

      var dataPropIndex = this.props.rowLabelProperties.length - 1;
      var dataProperty = this.props.rowLabelProperties[dataPropIndex];

      coverageBars.push(
        <CoverageBar
          key={'coverage' + id}
          x={x}
          y={y}
          width={this.coverageWidth}
          height={this.coverageBarSpacing}
          barHeight={this.props.coverageBarHeight}
          color={colors[id]}
          min={this.state.min}
          max={this.state.max}
          coverage={data.coverage}
          stepSize={this.props.stepSize}
          textMargin={this.consts.textMargin}
          coverageLabel={this.props.coverageLabel}
          coverageLabelProps={this.props.coverageLabelProps}
          label={label}
          labelWidth={this.props.labelColumnWidth}
          dataProperty={dataProperty}
          charLimit={this.consts.labelCharacterLimit}
          tooltip={dataText}/>
      );

      var lineY = y;// + this.coverageHeight + this.consts.coverageBarMargin;

      coverageBars.push(
        <line
          key={'line' + id}
          x1={0} y1={lineY}
          x2={x} y2={lineY}
          stroke="#D7D7D7"/>
      );

    }, this);

    return coverageBars;
  },

  makeColors: function() {
    var colors = ['black', 'gray'];

    if(!this.needsCoverage) {
      return colors;
    }

    if(this.props.schema && this.props.colors) {
      colors = this.props.colors;
    }

    var dataMapping = this.dataMapping;

    if(typeof colors === 'string') {
      return dataMapping.map(function() {
        return colors;
      });
    }

  //   return dataMapping.map(function(item) {
  //     return colors[item.colorIndex];
  //   });
  // },

    return dataMapping.map(this.findColor);
  },

  //Old function for finding proper color
  findColor: function(data) {
    var colorIndeces = data.colorIndeces;

    var selectedColor = this.props.colors || ['black', 'gray'];

    var end = colorIndeces.length - 1;

    //loop through color indeces, finding the correct color to apply
    for(var i = 0; i < colorIndeces.length; i++) {
      var colorIndex = colorIndeces[i];

      //get the next color according to the color index
      var newColor = selectedColor[colorIndex % selectedColor.length];

      //CASE: color list is less deep than data/category list
      //
      //(except on the last loop, when we expect a string)
      //if the new color is a string, instead of sending the new color,
      //find the selected color from the last index in the indeces.
      //This will solve the issue of exitting too early
      if(i < end && typeof newColor === 'string') {
        return selectedColor[colorIndeces[end] % selectedColor.length];
      }

      //assing the selected color  and re-iterate
      selectedColor = newColor;
    }

    //CASE: The color list is deeper than the data/category list
    //
    //Get the first color we can find down in the heirarchy
    while(typeof selectedColor !== 'string') {
      selectedColor = selectedColor[0];
    }

    return selectedColor;
  },

  truncateText: function(text, charLimit) {
    if(!text || text.length <= charLimit + 3) { // +3 for the dots.
      return text;
    }
    return text.substring(0, charLimit) + '...';
  },

  makeCoverageGrouping: function() {
    if(!this.needsGrouping) {
      return [];
    }

    var categoryIndex = Math.max(this.props.rowLabelProperties.length - 2, 0);
    var categoryProperty = this.props.rowLabelProperties[categoryIndex];

    return this.dataGrouping.map(function(grouping, id) {
      var startY = (grouping.startIndex + id) * this.coverageBarSpacing;
      var textY = startY + this.consts.coverageBarMargin / 2 + this.props.coverageBarHeight / 2;// - Math.floor(this.consts.textSize / 2);
      var textX = this.consts.textMargin;

      var yAdjust = 5;

      var separator = id === 0 ?
        null :
        (<line
          x1={0} y1={startY}
          x2={this.props.width} y2={startY}
          strokeWidth="2"
          className="rf-category-divider"
          stroke="#B0B0B0" />);

      var CoverageLabel = this.props.coverageLabel;

      return (
        <g key={'separator' + id}>
          <rect
            x={this.consts.marginLeft} y={startY}
            width={this.props.width} height={this.coverageBarSpacing}
            className="rf-category-background"
            fill="#E2E2E2" />
            {separator}
          <CoverageLabel
            x={this.consts.marginLeft} y={startY}
            width={this.props.width} height={this.coverageBarSpacing}
            labelText={grouping.categoryName}
            dataProperty={categoryProperty}
            labelX={textX}
            labelY={textY + yAdjust}
            charLimit={this.consts.labelCharacterLimit}
            className="rf-label rf-label-bold rf-category-label"
            {...this.props.coverageLabelProps}/>
        </g>
      );
    }, this);
  },

  makeGapFillers: function() {
    var startX = 0;
    var startWidth = this.valueLookup.byValue[this.state.start];

    var endX = this.valueLookup.byValue[this.state.end + this.props.stepSize];
    var endWidth = this.barX + this.coverageWidth - endX;

    if(this.needsScrollBar) {
      endWidth += this.consts.scrollWidth;
    }

    var y = this.barBottom;
    var height = this.consts.coverageGap;

    var gapFillers = [];

    gapFillers.push(
      <rect
        key="unselectedStart"
        x={startX} y={y}
        width={startWidth} height={height}
        fill="#B0B0B0"
        className="rf-gap-filler"/>
    );

    gapFillers.push(
      <rect
        key="unselectedEnd"
        x={endX} y={y}
        width={endWidth} height={height}
        fill="#B0B0B0"
        className="rf-gap-filler"/>
    );

    return gapFillers;
  },

  makeUnselectedOverlay: function() {
    var startX = this.barX;
    var endX = this.valueLookup.byValue[this.state.end + this.props.stepSize];
    var y = this.barBottom;

    var startWidth = this.valueLookup.byValue[this.state.start] - this.barX;
    var endWidth = this.barX + this.coverageWidth - endX;

    var height =
      Math.floor(this.consts.coverageBarMargin / 2) +
      this.coverageHeight;

    var unselectedRanges = [];

    unselectedRanges.push(
      <rect
        key="unselectedStart"
        x={startX} y={y}
        width={startWidth} height={height}
        fill="black" opacity="0.5"
        stroke="black" strokeWidth="1"
        className="rf-unselected"/>
    );

    unselectedRanges.push(
      <rect
        key="unselectedEnd"
        x={endX} y={y}
        width={endWidth} height={height}
        fill="black" opacity="0.5"
        stroke="black" strokeWidth="1"
        className="rf-unselected"/>
    );

    return unselectedRanges;
  }
};

module.exports = ComponentMakerMixin;