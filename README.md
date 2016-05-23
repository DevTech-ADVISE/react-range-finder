# react-range-finder [![Build Status](https://travis-ci.org/BI/react-range-finder.png)](https://travis-ci.org/BI/react-range-finder)


Range Finder is a tool that allows you to select a numeric range bewtween a start and an end point. Optionally, you can pass a data set ("series") to show coverage for that range.

[Click here for a live demo](http://yeahbuthats.github.io/react-range-finder/)

## Development

* Development server `npm run dev`.
* Continuously run tests on file changes `npm run watch-test`;
* Run tests: `npm test`;
* Build `npm run build`;

Properties
==========

Callbacks
---------

* **onDrag**: (function(start, end)) Called when either slider is moved.
* **onDragRangeStart**: (function(value)) Called when the start slider is moved.
* **onDragRangeEnd**: (function(value)) Called when the end slider is moved.
* **onRelease**: (function(start, end)) Called when either slider is released.
* **onReleaseRangeStart**: (function(value)) Called when the start slider is released.
* **onReleaseRangeEnd**: (function(value)) Called when the end slider is released.

Optional
--------

* **min**: (Number) The minimum number.
* **max**: (Number) The maximum number.
* **selectedRange**: ({start: Number, end: Number}) The initial selected range of the sliders (defaults to the entire range). `start` and `end` are both optional (i.e. you can pass in only one without the other).
* **title**: (String, "Value Range") The title displayed at the upper left.


### Sizing ###

* **width**: (Number, 860) The width of the range finder, not including margins. 
* **height**: (Number, 800) The height of the range finder, not including margins
* **barHeight**: (Number, 50) The height of the main bar.
* **labelColumnWidth**: (Number, 160) The width of the title and data label column on the left.
* **stepSize**: (Number, 1) The increment each tick represents. Note that changing this value also changes the valid numbers (e.g. changing this to 5 with start of 0 would mean you can only select 0, 5, 10, etc.).

### Data-Coverage ###

* **coverageBarHeight**: (Number, 8) The height of each coverage bar.
* **data**: (array of objects) The series data aggregate. The objects should be like rows from a database query. At least one of the properties should be numeric.
* **rowLabelProperties**: (array of strings or one string) This is the keys of the data to be sorted on. If you want to sort on more than one key, you can specify an array, which will sort on that order.
* **valueProperty**: (String) This is the key to draw the coverage of values from. The data using this key must be either numeric or null.
* **colors**: (multidimensional array of strings which are CSS colors) This is your color scheme. Simplest case: You have series: "series_name" and colors: ["red", "blue"]. The first coverage bar will be red, the second blue, the third red, the fourth blue, etc. The colors will loop.  
If you want to color each series separately but have a color scheme for each series set (e.g. series: ["series_category", "series_name"]) you can pass in a multidemensional color array.
* **metadataProperty**: (String) This is an extra data field that can get tacked on in the tooltip.

### Consts ###

You can set the `consts` property to overwrite the default consts. Below is a list with their defaults:

    marginTop: 0
    marginLeft: 0
    marginRight: 40
    marginBottom: 40
    coverageBarMargin: 10
    labelCharacterLimit: 20
    tickSize: 10
    sliderMargin: 5
    sliderRadius: 5
    ghostSize: 30
    labelSideMargin: 1
    labelVertMargin: 2
    textMargin: 20
    textSize: 15
    densityBadgeMargin: 45
    scrollWidth: 10
    borderRadius: 5
    coverageGap: 4

Example:

    <RangeFinder 
      id="yearSelector"
      min={1950}
      max={2015}
      selectedRange={{start: 1995}}
      data={data}
      rowLabelProperties={['country', 'someDemographic']}
      valueProperty={'year'}
      colors={[['red', 'darkred'], ['limegreen', 'darkgreen']]}
      onDrag={function(startValue, endValue){console.log("Starting year: " + startValue + ", Ending year: " + endValue)}}/>

Styles
======

Below is a diagram of the structure. If you see `...` after an element, it means that element can be repeated. Changing the width or height of things (especially any rects) is not recommended.

    <svg class='range-finder'>
      <rect class='rf-range-bar'/>
      <text class='rf-label rf-title-label'/> //Value Finder title
      <text class='rf-label rf-value-label'/> //start label
      <text class='rf-label rf-value-label'/> //end label
      <text class='rf-label rf-density-label'/> //density label
      <g class='rf-ticks'> //tick marks on top
        <line/>... //each tick mark
      </g>
      <svg class='rf-coverage-section'>
        <rect class='rf-coverage-background'/>
        <g class='rf-coverage'> //coverage bars: see below
          <line class='rf-coverage-line'/> //dashed line
          <rect class='rf-coverage-bar'/>... //coverage bars
          <text class='rf-label rf-coverage-label'/> //right hand label
        </g>...
        <g>
          <rect class='rf-category-background'/>
          <text class='rf-label rf-category-label'/>
        </g>...
      </svg>
      <g class='rf-slider'> //slider
        <line class='rf-slider-bar'/> //slider line
        <circle class='rf-slider-handle'/> //top handle
        <circle class='rf-slider-handle'/> //bottom handle
        <g class='rf-value-indicator'>
            <rect class='rf-value-indicator-balloon'/>
            <text class='rf-label rf-value-indicator-label'/>
            <polyline class='rf-value-indicator-balloon'/>
        </g>
      </g> (*2)
      <rect class='rf-unselected'/> //unselected range
      <rect class='rf-unselected'/> //unselected range
    </svg>

In the case of there being too many coverage bars, the `rf-coverage-section` is replaces as follows:

    <g class='rf-coverage-section'>
      <svg>
        <rect class='rf-coverage-background'/>
        <g class='rf-coverage'> //coverage bars
          <line class='rf-coverage-line'/> //dashed line
          <rect class='rf-coverage-bar'/>... //coverage bars
          <text class='rf-label rf-coverage-label'/> //right hand label
        </g>...
        <g>
          <rect class='rf-category-background'/>
          <text class='rf-label rf-category-label'/>
        </g>...
      </svg>
      <polyline class='rf-scroll-arrow'/>
      <rect class='rf-scroll-button'/>
      <rect class='rf-scroll-area'/>
      <rect class='rf-scroll-bar'/>
      <polyline class='rf-scroll-arrow'/>
      <rect class='rf-scroll-button'/>
    </g>
