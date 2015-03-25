var Slider = require('../components/slider.jsx');
var CoverageBar = require('../components/coverageBar.jsx');

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

  makeSliders: function(snapGrid) {
    var leftX = this.barX;
    var leftY = this.barY - this.consts.sliderRadius - this.consts.sliderMargin - this.consts.tickMargin - this.consts.tickSize;

    var rightX = this.barX + this.props.barWidth;
    var rightY = leftY;

    var coverageHeight = 0;

    if(this.seriesMapping) {
      coverageHeight = this.seriesMapping.length * (this.props.coverageBarHeight + this.consts.coverageBarMargin);
      
      if(this.props.maxCoverageHeight < coverageHeight) {
        coverageHeight = this.props.maxCoverageHeight;
      }

      coverageHeight += Math.ceil(this.consts.coverageBarMargin/2);
    }

    var sliderHeight = 
      2 * this.consts.sliderRadius +
      2 * this.consts.sliderMargin +
      this.consts.tickSize +
      this.consts.tickMargin +
      this.props.barHeight +
      coverageHeight;

    var valueLookup = {};
    valueLookup.byValue = {};
    valueLookup.byLocation = {};

    for (var key in snapGrid) {
      var xLocation = snapGrid[key].x;
      var value = snapGrid[key].value;

      valueLookup.byValue[value] = xLocation;
      valueLookup.byLocation[xLocation] = value;
    }

    this.valueLookup = valueLookup;

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
        y={leftY}
        height={sliderHeight}
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
        y={rightY}
        height={sliderHeight}
        handleAnchor={0}
        snapGrid={endSnapGrid}
        valueLookup={valueLookup}
        onDragMove={this.onEndDragMove}
        onDragEnd={this.onEndDragEnd}/>
    );

    return sliders;
  },

  onStartDragMove: function(start, xLocation) {
    this.setState({startSliderX: xLocation});

    this.props.onStartDragMove(start);
    this.props.onDragMove(start, this.state.end);
  },

  onEndDragMove: function(end, xLocation) {
    this.setState({endSliderX: xLocation});

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

    var yearCount = (this.props.end - this.props.start) / this.props.stepSize;
    var dashSize = this.props.barWidth / yearCount;

    var colors = this.makeColors();

    return this.seriesMapping.map(function(series, id) {
      var y = startY + id * (this.props.coverageBarHeight + this.consts.coverageBarMargin);

      var label = series.seriesNames[series.seriesNames.length - 1];
      var seriesText = series.seriesNames.join("<br/>");

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

      var barSpacing = this.consts.coverageBarMargin + this.props.coverageBarHeight;

      var startY = barBottom + grouping.startIndex * barSpacing;
      var endY = startY + grouping.count * barSpacing - this.consts.coverageBarMargin;
      var rightX = this.barX;
      var leftX = rightX - this.consts.textMargin;
      var textY = startY + (endY - startY) / 2;
      var textX = leftX - this.consts.textMargin;

      var points = this.makePointList(leftX, rightX, startY, endY);

      return (
        <g key={"grouping" + id} className="rf-category">
          <text
            data-ot={grouping.categoryName}
            x={textX}
            y={textY}
            textAnchor="end"
            className="rf-label rf-category-label">
            {name}
          </text>
          <polyline
            fill="none"
            stroke="black"
            strokeWidth="1"
            points={points}
            className="rf-category-grouping" />
        </g>
      );
    }, this);
  },

  makePointList: function(leftX, rightX, startY, endY) {
    return rightX + ',' + startY + ' ' +
           leftX + ',' + startY + ' ' +
           leftX + ',' + endY + ' ' +
           rightX + ',' + endY;
  },

  makeUnselectedOverlay: function() {
    var startX = this.barX;
    var endX = this.state.endSliderX;
    var y = this.barY;

    var startWidth = this.state.startSliderX - this.barX;
    var endWidth = this.barX + this.props.barWidth - this.state.endSliderX;

    var coverageHeight = 0;

    if(this.seriesMapping) {
      coverageHeight = this.seriesMapping.length *
        (this.consts.coverageBarMargin + this.props.coverageBarHeight);

      if(coverageHeight > this.props.maxCoverageHeight) {
        coverageHeight = this.props.maxCoverageHeight;
      }

      coverageHeight += Math.ceil(this.consts.coverageBarMargin/2);
    }

    var height = 
      this.props.barHeight +
      coverageHeight;

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