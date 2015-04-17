var React = require('react');
var Slider = require('../components/slider.js');
var CoverageBar = require('../components/coverageBar.js');

var tinyColor = require('tinycolor2');

var ComponentMakerMixin = {
  makeTicks: function(snapGrid) {
    var y1 = this.barY + this.props.barHeight;
    var y2 = y1 - this.consts.tickSize;

    var ticks = [];

    for(var key in snapGrid) {
      var x = snapGrid[key].x;

      ticks.push(
        <line
          key={"tick" + key}
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
    var seriesDensity = this.seriesDensity;
    var length = this.props.end - this.props.start;
    var count = 0;

    if(length === 0) {
      return null;
    }

    var factor = 1/length;

    var gradientInfo = [];

    this.seriesDensity.forEach(function(density, id) {
      var color = this.calculateDensityColor(density);
      var midOffset = count++ / length;
      var prevOffset = midOffset - factor;
      var nextOffset = midOffset + factor;
      
      var lowerOffset = 100 * Math.max((midOffset + prevOffset) / 2, 0) + "%";
      var higherOffset = 100 * Math.min((nextOffset + midOffset) / 2, 1) + "%";

      gradientInfo.push(<stop key={id + "l"} offset={lowerOffset} stopColor={color} />);
      gradientInfo.push(<stop key={id + "h"} offset={higherOffset} stopColor={color} />);
    }, this);

    return (
      <defs>
        <linearGradient id={this.consts.gradientId}>
          {gradientInfo}
        </linearGradient>
      </defs>
    );
  },

  makeSliders: function(snapGrid) {
    var leftX = this.barX;
    var rightX = this.barX + this.props.barWidth;

    var valueLookup = {};
    valueLookup.byValue = {};
    valueLookup.byLocation = {};

    for (var key in snapGrid) {
      var xLocation = snapGrid[key].x;
      var value = snapGrid[key].value;

      valueLookup.byValue[value] = xLocation;
      valueLookup.byLocation[xLocation] = value;
    }

    var startSnapGrid = [];
    var endSnapGrid = [];

    for (var key in snapGrid) {
      var snapObject = snapGrid[key];
      var x = snapObject.x;

      if(x <= valueLookup.byValue[this.state.end]) {
        startSnapGrid.push(snapObject);
      }
      if(x >= valueLookup.byValue[this.state.start]) {
        endSnapGrid.push(snapObject);
      }
    }

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
        onDragMove={this.onStartDragMove}
        onDragEnd={this.onStartDragEnd}/>
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
        onDragMove={this.onEndDragMove}
        onDragEnd={this.onEndDragEnd}/>
    );

    return sliders;
  },

  onStartDragMove: function(start, xLocation) {
    this.setState({start: start, startSliderX: xLocation});

    this.props.onStartDragMove(start);
    this.props.onDragMove(start, this.state.end);
  },

  onEndDragMove: function(end, xLocation) {
    this.setState({end: end, endSliderX: xLocation});

    this.props.onEndDragMove(end);
    this.props.onDragMove(this.state.start, end);
  },

  onStartDragEnd: function(start) {
    this.setState({start: start});

    this.props.onStartDragEnd(start);
    this.props.onDragEnd(start, this.state.end);
  },

  onEndDragEnd: function(end) {
    this.setState({end: end});

    this.props.onEndDragEnd(end);
    this.props.onDragEnd(this.state.start, end);
  },

  makeCoverage: function() {
    if(!this.needsCoverage) {
      return [];
    }

    var x = this.barX;
    var startY = Math.floor(this.consts.coverageBarMargin/2);

    var dashSize = this.props.barWidth / this.stepCount;

    var colors = this.makeColors();

    var previousCategory = null;
    var yOffset = 0

    var coverageBars = []

    this.seriesMapping.forEach(function(series, id) {
      var label = series.seriesNames[series.seriesNames.length - 1];
      var seriesText =
        "<span class='rf-label-bold'>" + 
        series.seriesNames.join("<br/>") +
        "</span>";


      if(series.seriesNames.length > 1) {
        var category = series.seriesNames[series.seriesNames.length - 2];

        if(previousCategory !== category) {
          previousCategory = category;
          yOffset += this.coverageBarSpacing;
        }
      }

      var y =
        startY +
        id * this.coverageBarSpacing +
        yOffset;

      coverageBars.push(
        <CoverageBar
          key={"coverage" + id}
          x={x}
          y={y}
          width={this.props.barWidth}
          height={this.props.coverageBarHeight}
          color={colors[id]}
          start={this.props.start}
          end={this.props.end}
          coverage={series.coverage}
          dashSize={dashSize}
          textMargin={this.consts.textMargin}
          label={this.truncateText(label, this.consts.labelCharacterLimit)}
          tooltip={seriesText}/>
      );

      var lineY = y - this.consts.coverageBarMargin/2;// + this.coverageHeight + this.consts.coverageBarMargin;

      coverageBars.push(
        <line
          key={"line" + id}
          x1={0} y1={lineY}
          x2={x} y2={lineY}
          stroke="#D7D7D7"/>
      );

    }, this);

    return coverageBars;
  },

  makeColors: function() {
    var colors = ["black", "gray"];

    if(!this.needsCoverage) {
      return colors;
    }

    if(this.props.schema && this.props.schema.colors) {
      colors = this.props.schema.colors;
    }

    var seriesMapping = this.seriesMapping;

    if(typeof colors === "string") {
      return seriesMapping.map(function(item) {
        return colors;
      });
    }

  //   return seriesMapping.map(function(item) {
  //     return colors[item.colorIndex];
  //   });
  // },

    return seriesMapping.map(this.findColor);
  },

  //Old function for finding proper color
  findColor: function(series) {
    var colorIndeces = series.colorIndeces;

    var selectedColor = this.props.schema.colors;

    var end = colorIndeces.length - 1;

    //loop through color indeces, finding the correct color to apply
    for(var i = 0; i < colorIndeces.length; i++) {
      var colorIndex = colorIndeces[i];

      //get the next color according to the color index
      var newColor = selectedColor[colorIndex % selectedColor.length];

      //CASE: color list is less deep than series/category list
      //
      //(except on the last loop, when we expect a string)
      //if the new color is a string, instead of sending the new color,
      //find the selected color from the last index in the indeces.
      //This will solve the issue of exitting too early
      if(i < end && typeof newColor === "string") {
        return selectedColor[colorIndeces[end] % selectedColor.length];
      }

      //assing the selected color  and re-iterate
      selectedColor = newColor;
    }

    //CASE: The color list is deeper than the series/category list
    //
    //Get the first color we can find down in the heirarchy
    while(typeof selectedColor !== "string") {
      selectedColor = selectedColor[0];
    }
  
    return selectedColor;
  },

  truncateText: function(text, charLimit) {
    if(text === null || text.length <= charLimit + 3) { // +3 for the dots.
      return text;
    }
    return text.substring(0, charLimit) + "...";
  },

  makeCoverageGrouping: function() {
    if(!this.needsGrouping) {
      return [];
    }

    return this.seriesGrouping.map(function(grouping, id) {
      var name = this.truncateText(grouping.categoryName, this.consts.labelCharacterLimit);


      var startY = (grouping.startIndex + id) * this.coverageBarSpacing;
      var endY = startY + grouping.count * this.coverageBarSpacing - this.consts.coverageBarMargin;
      var rightX = this.barX;
      var leftX = rightX - this.consts.textMargin;
      var textY = startY + this.props.coverageBarHeight - Math.floor(this.consts.textSize/2);
      var textX = this.consts.textMargin;

      var yAdjust = 7;

      var separator = id === 0 ?
        null :
        <line
          x1={0} y1={startY}
          x2={this.effectiveWidth} y2={startY}
          strokeWidth="2"
          className="rf-category-divider"
          stroke="#B0B0B0" />


      return (
        <g key={"separator" + id}>
          <rect
            x={0} y={startY}
            width={this.effectiveWidth} height={this.coverageBarSpacing}
            className="rf-category-background"
            fill="#E2E2E2" />
            {separator}
          <text
            x={textX}
            y={textY + yAdjust}
            textAnchor="start"
            className="rf-label rf-label-bold rf-category-label">
            {name}
          </text>
        </g>
      );
    }, this);
  },

  makeGapFillers: function() {
    var startX = 0;
    var startWidth = this.state.startSliderX;

    var endX = this.state.endSliderX;
    var endWidth = this.componentWidth - this.state.endSliderX;

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
    var endX = this.state.endSliderX;
    var y = this.barBottom;

    var startWidth = this.state.startSliderX - this.barX;
    var endWidth = this.barX + this.props.barWidth - this.state.endSliderX;

    var height = 
      Math.floor(this.consts.coverageBarMargin/2) +
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
  },
};

module.exports = ComponentMakerMixin;