var Slider = require('../components/slider.jsx');
var CoverageBar = require('../components/coverageBar.jsx');

var tinyColor = require('tinycolor2');

var ComponentMakerMixin = {
  makeTicks: function(snapGrid) {
    var y1 = this.barY - this.consts.tickMargin;
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
          stroke="grey" />
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
    var factor = 1/length;
    var count = 0;

    if(length === 0) {
      return null;
    }

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
        handleAnchor={1}
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
        handleAnchor={0}
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
    if(!this.seriesMapping) {
      return [];
    }

    var x = this.barX;
    var startY = Math.floor(this.consts.coverageBarMargin/2);

    var dashSize = this.props.barWidth / this.stepCount;

    var colors = this.makeColors();

    var previousCategory = null;
    var yOffset = 0;

    return this.seriesMapping.map(function(series, id) {
      var label = series.seriesNames[series.seriesNames.length - 1];
      var seriesText = series.seriesNames.join("<br/>");

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

      return (
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
          label={this.truncateText(label, this.consts.labelCharacterLimit)}
          tooltip={seriesText}/>
      );
    }, this);
  },

  makeColors: function() {
    var colors = ["black", "gray"];

    if(!this.seriesMapping) {
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

    return seriesMapping.map(function(item) {
      var colorIndeces = item.colorIndeces;
      var selectedColor = colors;

      for(var i = 0; i < colorIndeces.length; i++) {
        var colorIndex = colorIndeces[i];

        if(typeof selectedColor === "string") {
          return selectedColor;
        }

        selectedColor = selectedColor[colorIndex % selectedColor.length];
      }

      //gets the first color if the color array is deeper than the mapping
      while(typeof selectedColor !== "string") {
        selectedColor = selectedColor[0];
      }

      return selectedColor;
    });
  },

  truncateText: function(text, charLimit) {
    if(text.length <= charLimit + 3) { // +3 for the dots.
      return text;
    }
    return text.substring(0, charLimit) + "...";
  },

  makeCoverageGrouping: function() {
    if(!this.seriesGrouping) {
      return [];
    }

    return this.seriesGrouping.map(function(grouping, id) {
      var name = this.truncateText(grouping.categoryName, this.consts.labelCharacterLimit);
      var barBottom = Math.floor(this.consts.coverageBarMargin/2);

      var startY = barBottom + (grouping.startIndex + id) * this.coverageBarSpacing;
      var endY = startY + grouping.count * this.coverageBarSpacing - this.consts.coverageBarMargin;
      var rightX = this.barX;
      var leftX = rightX - this.consts.textMargin;
      var textY = startY + this.props.coverageBarHeight;
      var textX = leftX - this.consts.textMargin;

      return (
        <text
          data-ot={grouping.categoryName}
          x={textX}
          y={textY}
          textAnchor="end"
          className="rf-label rf-category-label">
          {name}
        </text>
      );
    }, this);
  },

  makeUnselectedOverlay: function() {
    var startX = this.barX;
    var endX = this.state.endSliderX;
    var y = this.barY;

    var startWidth = this.state.startSliderX - this.barX;
    var endWidth = this.barX + this.props.barWidth - this.state.endSliderX;

    var height = 
      this.props.barHeight +
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