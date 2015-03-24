react-range-finder
==================

Range Finder is a tool that allows you to select a numeric range bewtween a start and an end point. Optionally, you can pass a data set ("series") to show coverage for that range.

[Click here for a live demo](http://yeahbuthats.github.io/react-range-finder/)

Properties
==========

Required
--------

* **start**: (Number) The minimum number.
* **end**: (Number) The maximum number.

Callbacks
---------

* **onStartDragMove**: (function(value)) Called when the start slider is moved.
* **onStartDragEnd**: (function(value)) Called when the start slider is released.
* **onEndDragMove**: (function(value)) Called when the end slider is moved.
* **onEndDragEnd**: (function(value)) Called when the end slider is released.

Optional
--------

### Sizing ###

* **barWidth**: (Number, 300) The width of the main bar. Note that the actual svg element will be 100px wider than that to accommodate labels.
* **barHeight**: (Number, 10) The height of the main bar.
* **stepSize**: (Number, 1) The increment each tick represents. Note that changing this value also changes the valid numbers (e.g. changing this to 5 with start of 0 would mean you can only select 0, 5, 10, etc.).

### Series-Related ###

* **coverageBarHeight**: (Number, 8) The height of each coverage bar.
* **series**: (array of objects) The series data aggregate. The objects should be like rows from a database query. At least one of the properties should be numeric.
* **schema**: (object) This is how the series data will be read. Must have series and value, can optionally have colors.
    * **schema.series**: (array of strings or one string) This is the keys of the data to be sorted on. If you want to sort on more than one key, you can specify an array, which will sort on that order.
    * **schema.value**: (String) This is the key to draw the coverage of values from. The data using this key must be either numeric or null.
    * **schema.colors**: (multidimensional array of strings which are CSS colors) This is your color scheme. Simplest case: You have series: "series_name" and colors: ["red", "blue"]. The first coverage bar will be red, the second blue, the third red, the fourth blue, etc. The colors will loop.  
    If you want to color each series separately but have a color scheme for each series set (e.g. series: ["series_category", "series_name"]) you can pass in a multidemensional color array.

Styles
======

Below is a diagram of the structure. If you see `...` after an element, it means that element can be repeated. Changing the width or height of things (especially any rects) is not recommended.

    <svg class="range-finder">
    <g class="rf-ticks"> //tick marks on top
        <line/>... //each tick mark
    </g>
    <text class="rf-label rf-value-label"/> //start label
    <rect class="rf-range-bar"/> //main range bar
    <text class="rf-label rf-value-label"/> //end label
    <svg class="rf-coverage-section">
        <g class="rf-coverage"> //coverage bars: see below
            <line class="rf-coverage-line"/> //dashed line
            <rect class="rf-coverage-bar"/>... //coverage bars
            <text class="rf-label rf-coverage-label"/> //right hand label
        </g>...
    </svg>
    <g class="rf-category"> //left hand category label and grouping lines
        <text class="rf-label rf-category-label"/> //label
        <polyline class="rf-category-grouping"/> //grouping line
    </g>...
    <g class="rf-slider">
        <text class="rf-label rf-slider-label"/>
        <rect class="rf-slider-handle"/>
        <line class="rf-slider-bar"/>
        <rect class="rf-slider-handle"/>
    </g> (*2)
    </svg>

In the case of there being too many coverage bars, the `rf-coverage-section` is replaces as follows:

    <g class="rf-coverage-section">
        <svg>
            <g class="rf-coverage"> //coverage bars: see below
                <line class="rf-coverage-line"/> //dashed line
                <rect class="rf-coverage-bar"/>... //coverage bars
                <text class="rf-label rf-coverage-label"/> //right hand label
            </g>...
        </svg>
        <rect class="rf-scroll-area" />
        <rect class="rf-scroll-bar" />
    </g>
