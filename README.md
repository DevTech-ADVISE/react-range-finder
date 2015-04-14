react-range-finder
==================

Range Finder is a tool that allows you to select a numeric range between a start and an end point. Optionally, you can pass a data set ("series") to show coverage for that range.

[Click here for a live demo](http://bi.github.io/react-range-finder/)

Properties
==========

Callbacks
---------
* **onDrag**: (function(startValue, endValue)) Called when either the start slider or the end slider is moved.
* **onRelease**: (function(startValue, endValue)) Called when either the start slider or the end slider is released.
* **onDragRangeStart**: (function(value)) Called when the start slider is moved. 
* **onReleaseRangeStart**: (function(value)) Called when the start slider is released.
* **onDragRangeEnd**: (function(value)) Called when the end slider is moved.
* **onReleaseRangeEnd**: (function(value)) Called when the end slider is released.

Optional
--------

### Sizing ###

* **barWidth**: (Number) The width of the main bar. Note that the actual svg element will be 100px wider to accommodate labels. Defaults to 300px.
* **barHeight**: (Number) The height of the main bar. Defaults to 10px.
* **stepSize**: (Number) The increment each tick represents. Note that changing this value also changes the valid numbers (e.g. changing this to 5 with start of 0 would mean you can only select 0, 5, 10, etc.). Defaults to 1.

### Data Coverage ###

Start and End values will be inferred from the dataset if there is one.
* **start**: (Number) The minimum number.
* **end**: (Number) The maximum number.

* **coverageBarHeight**: (Number) The height of each coverage bar. Defaults to 8px.
* **data**: (array of objects) The objects should be like rows from a database query. At least one of the properties should be numeric. 
* **rowLabelProperties**: (array of strings or one string) Labels for each coverage row. These are the keys of the data to be sorted on. If you want to sort on more than one key, you can specify an array, which will be sorted in the order the key appears in the array.
* **valueProperty**: (String) This is the key to draw the coverage of values from. The data using this key must be either numeric or null.
* **colors**: (multidimensional array of strings which are CSS colors) This is your color scheme. Simplest case: You have series: "series_name" and colors: ["red", "blue"]. The first coverage bar will be red, the second blue, the third red, the fourth blue, etc. The colors will loop.  
If you want to color each series separately but have a color scheme for each series set (e.g. series: ["series_category", "series_name"]) you can pass in a multidemensional color array.

Example:
```js
<RangeFinder 
    id="yearSelector"
    start={1950}
    end={2005}
    data={data}
    rowLabelProperties={['country', 'someDemographic']}
    valueProperty={'year'}
    colors={[['red', 'darkred'], ['limegreen', 'darkgreen']]}
    onDrag={function(startValue, endValue){console.log("Starting year: " + startValue + ", Ending year: " + endValue)}}/>
```

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

In the case of there being too many coverage bars, the `rf-coverage-section` is replaced as follows:

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
