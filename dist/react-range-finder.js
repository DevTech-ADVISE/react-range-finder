(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("interact.js"), require("opentip"), require("tinycolor2"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom", "interact.js", "opentip", "tinycolor2"], factory);
	else if(typeof exports === 'object')
		exports["ReactRangeFinder"] = factory(require("react"), require("react-dom"), require("interact.js"), require("opentip"), require("tinycolor2"));
	else
		root["ReactRangeFinder"] = factory(root["React"], root["ReactDOM"], root["interact"], root["Opentip"], root["tinyColor"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_18__, __WEBPACK_EXTERNAL_MODULE_19__, __WEBPACK_EXTERNAL_MODULE_21__, __WEBPACK_EXTERNAL_MODULE_26__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var PropTypes = __webpack_require__(1);
	var React = __webpack_require__(11);

	var createReactClass = __webpack_require__(12);

	var SetupMixin = __webpack_require__(15);
	var MakerMixin = __webpack_require__(16);
	var CalcMixin = __webpack_require__(27);

	var ScrollableSVG = __webpack_require__(28);
	var DefaultCoverageLabel = __webpack_require__(29);

	__webpack_require__(30);

	var RangeFinder = createReactClass({
	  displayName: 'RangeFinder',

	  findValue: function findValue(args) {

	    for (var key in args) {
	      var arg = args[key];

	      if (arg || arg === 0) {
	        return arg;
	      }
	    }

	    return 0;
	  },

	  getInitialState: function getInitialState() {
	    var selectedRange = this.props.selectedRange || {};

	    var valueRange = this.getValueRange(this.props);

	    var min = this.findValue([this.props.min, valueRange.min, selectedRange.start, 0]);
	    var max = this.findValue([this.props.max, valueRange.max, selectedRange.end, 100]);

	    var start = selectedRange.start || min;
	    var end = selectedRange.end || max;

	    start = Math.max(start, min);
	    end = Math.min(end, max);

	    start = Math.min(start, end); //Limit start to end value

	    return {
	      min: min,
	      max: max,
	      start: start,
	      end: end
	    };
	  },

	  mixins: [SetupMixin, MakerMixin, CalcMixin],

	  consts: {
	    marginTop: 0,
	    marginLeft: 0,
	    marginRight: 40,
	    marginBottom: 40,
	    coverageBarMargin: 10,
	    labelCharacterLimit: 20,
	    tickSize: 10,
	    sliderRadius: 5,
	    ghostSize: 30,
	    labelSideMargin: 1,
	    textMargin: 20,
	    textSize: 15,
	    gradientId: 'mainGradient',
	    scrollWidth: 10,
	    borderRadius: 5,
	    coverageGap: 4
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      width: 860,
	      height: 800,
	      headerBarHeight: 50,
	      labelColumnWidth: 160,
	      coverageBarHeight: 20,
	      maxCoverageHeight: 750,
	      stepSize: 1,
	      selectedRange: null,
	      data: [],
	      title: 'Value Range',
	      coverageLabel: DefaultCoverageLabel,
	      coverageLabelProps: {},
	      densityLowColor: { r: 0, g: 0, b: 0 },
	      densityMidColor: null,
	      densityHighColor: { r: 255, g: 255, b: 255 },
	      onDragRangeStart: function onDragRangeStart() {},
	      onReleaseRangeStart: function onReleaseRangeStart() {},
	      onDrag: function onDrag() {},
	      onDragRangeEnd: function onDragRangeEnd() {},
	      onReleaseRangeEnd: function onReleaseRangeEnd() {},
	      onRelease: function onRelease() {},
	      onUpdateData: function onUpdateData() {}
	    };
	  },

	  propTypes: {
	    width: PropTypes.number,
	    height: PropTypes.number,
	    headerBarHeight: PropTypes.number,
	    labelColumnWidth: PropTypes.number,
	    maxCoverageHeight: PropTypes.number,

	    coverageBarHeight: PropTypes.number,

	    min: PropTypes.number,
	    max: PropTypes.number,

	    selectedRange: PropTypes.shape({
	      start: PropTypes.number,
	      end: PropTypes.number
	    }),

	    stepSize: PropTypes.number,

	    title: PropTypes.string,
	    consts: PropTypes.object,

	    //coverageLabel: React.PropTypes.element,
	    coverageLabelProps: PropTypes.object,

	    data: PropTypes.arrayOf(PropTypes.object).isRequired,
	    rowLabelProperties: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]).isRequired,
	    valueProperty: PropTypes.string.isRequired,
	    metadataProperty: PropTypes.string,
	    colors: PropTypes.array,

	    onStartDragMove: PropTypes.func,
	    onStartDragEnd: PropTypes.func,
	    onEndDragMove: PropTypes.func,
	    onEndDragEnd: PropTypes.func,
	    onUpdateData: PropTypes.func
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(props) {
	    this.updateSelectedRange(props.selectedRange, this.props.selectedRange);
	  },

	  updateSelectedRange: function updateSelectedRange(newRange, oldRange) {
	    if (newRange === null) {
	      return;
	    }

	    if (oldRange === null) {
	      this.setState(newRange);
	      return;
	    }

	    if (newRange.start === oldRange.start && newRange.end === oldRange.end) {
	      return;
	    }

	    newRange.start = Math.max(newRange.start, this.state.min);
	    newRange.end = Math.min(newRange.end, this.state.max);

	    this.setState(newRange);
	  },

	  componentWillMount: function componentWillMount() {
	    if (this.props.data === null || this.props.data.length === 0) {
	      throw new Error('You must supply some data');
	    }

	    for (var key in this.props.consts) {
	      this.consts[key] = this.props.consts[key];
	    }

	    this.barX = this.props.labelColumnWidth;
	    this.barY = this.consts.marginTop;
	  },

	  calculateCoverage: function calculateCoverage(start, end) {
	    if (!this.needsCoverage) {
	      return 0;
	    }

	    var dataDensity = this.dataDensity;

	    var sum = 0;

	    for (var i = start; i <= end; i++) {
	      if (dataDensity[i]) {
	        sum += dataDensity[i];
	      }
	    }

	    return sum / (end - start + 1);
	  },

	  setScrollUpdater: function setScrollUpdater(func) {
	    this.scrollUpdaterFunc = func;
	  },

	  render: function render() {
	    var snapGrid = this.snapGrid;
	    var gradient = null; //this.makeGradient();

	    var ticks = this.makeTicks(snapGrid);
	    var sliders = this.makeSliders(snapGrid);

	    var coverage = this.makeCoverage();
	    var coverageGrouping = this.makeCoverageGrouping();
	    var gapFillers = this.makeGapFillers();
	    var unselected = this.makeUnselectedOverlay();

	    var titleX = this.props.labelColumnWidth / 2;

	    var valueLabelY = this.barY + (this.props.headerBarHeight - this.consts.tickSize) / 2 + this.consts.textSize / 2;

	    var coverageDetails = null;
	    var densityLabel = null;

	    if (coverage.length > 0) {
	      var barBottom = this.barY + this.props.headerBarHeight + this.consts.coverageGap;

	      coverageDetails = React.createElement(
	        ScrollableSVG,
	        {
	          y: barBottom,
	          width: this.componentWidth, height: this.fullCoverageHeight,
	          maxDisplayedHeight: this.coverageHeight,
	          scrollWidth: this.consts.scrollWidth,
	          setScrollUpdater: this.setScrollUpdater,
	          className: 'rf-coverage-section' },
	        React.createElement('rect', {
	          x: 0, y: 0,
	          width: this.props.width,
	          height: this.fullCoverageHeight,
	          className: 'rf-coverage-background',
	          fill: '#F4F4F4' }),
	        coverage,
	        coverageGrouping
	      );

	      var density = this.calculateCoverage(this.state.start, this.state.end);
	      densityLabel = React.createElement(
	        'text',
	        {
	          x: titleX,
	          y: this.barY + this.props.headerBarHeight / 2 + this.consts.textSize,
	          fontSize: 12,
	          textAnchor: 'middle',
	          className: 'rf-label rf-label-bold rf-density-label' },
	        Math.floor(100 * density) + '% coverage'
	      );
	    }

	    var topBarWidth = this.componentWidth;
	    var topBarHeight = this.props.headerBarHeight + this.consts.borderRadius;

	    var offset = 100 - 100 * (this.consts.borderRadius / topBarHeight);
	    offset += '%';

	    return React.createElement(
	      'svg',
	      {
	        id: this.props.id,
	        width: this.fullComponentWidth,
	        height: this.fullComponentHeight,
	        className: 'range-finder' },
	      React.createElement(
	        'defs',
	        null,
	        React.createElement(
	          'linearGradient',
	          { id: this.consts.gradientId, x1: '0%', x2: '0%', y1: '0%', y2: '100%' },
	          React.createElement('stop', { offset: '0%', stopColor: '#CFCFCF', stopOpacity: '100%' }),
	          React.createElement('stop', { offset: offset, stopColor: '#CFCFCF', stopOpacity: '100%' }),
	          React.createElement('stop', { offset: offset, stopColor: '#CFCFCF', stopOpacity: '0%' }),
	          React.createElement('stop', { offset: '100%', stopColor: '#CFCFCF', stopOpacity: '0%' })
	        )
	      ),
	      React.createElement('rect', {
	        x: 0, y: this.barY,
	        width: topBarWidth, height: topBarHeight,
	        rx: this.consts.borderRadius, ry: this.consts.borderRadius,
	        stroke: 'url(#' + this.consts.gradientId + ')',
	        fill: 'url(#' + this.consts.gradientId + ')',
	        className: 'rf-range-bar' }),
	      React.createElement(
	        'text',
	        {
	          x: titleX,
	          y: this.barY + this.props.headerBarHeight / 2,
	          textAnchor: 'middle',
	          className: 'rf-label rf-label-bold rf-title-label' },
	        this.props.title
	      ),
	      React.createElement(
	        'text',
	        {
	          x: this.barX,
	          y: valueLabelY,
	          fontSize: this.consts.textSize,
	          textAnchor: 'start',
	          className: 'rf-label rf-label-bold rf-value-label' },
	        this.state.min
	      ),
	      React.createElement(
	        'text',
	        {
	          x: this.componentWidth - this.consts.labelSideMargin,
	          y: valueLabelY,
	          fontSize: this.consts.textSize,
	          textAnchor: 'end',
	          className: 'rf-label rf-label-bold rf-value-label' },
	        this.state.max
	      ),
	      densityLabel,
	      React.createElement(
	        'g',
	        { className: 'rf-ticks' },
	        ticks
	      ),
	      coverageDetails,
	      gapFillers,
	      unselected,
	      sliders
	    );
	  }
	});

	module.exports = RangeFinder;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	if (process.env.NODE_ENV !== 'production') {
	  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
	    Symbol.for &&
	    Symbol.for('react.element')) ||
	    0xeac7;

	  var isValidElement = function(object) {
	    return typeof object === 'object' &&
	      object !== null &&
	      object.$$typeof === REACT_ELEMENT_TYPE;
	  };

	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  module.exports = __webpack_require__(3)(isValidElement, throwOnDirectAccess);
	} else {
	  // By explicitly using `prop-types` you are opting into new production behavior.
	  // http://fb.me/prop-types-in-prod
	  module.exports = __webpack_require__(10)();
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var emptyFunction = __webpack_require__(4);
	var invariant = __webpack_require__(5);
	var warning = __webpack_require__(6);
	var assign = __webpack_require__(7);

	var ReactPropTypesSecret = __webpack_require__(8);
	var checkPropTypes = __webpack_require__(9);

	module.exports = function(isValidElement, throwOnDirectAccess) {
	  /* global Symbol */
	  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

	  /**
	   * Returns the iterator method function contained on the iterable object.
	   *
	   * Be sure to invoke the function with the iterable as context:
	   *
	   *     var iteratorFn = getIteratorFn(myIterable);
	   *     if (iteratorFn) {
	   *       var iterator = iteratorFn.call(myIterable);
	   *       ...
	   *     }
	   *
	   * @param {?object} maybeIterable
	   * @return {?function}
	   */
	  function getIteratorFn(maybeIterable) {
	    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }

	  /**
	   * Collection of methods that allow declaration and validation of props that are
	   * supplied to React components. Example usage:
	   *
	   *   var Props = require('ReactPropTypes');
	   *   var MyArticle = React.createClass({
	   *     propTypes: {
	   *       // An optional string prop named "description".
	   *       description: Props.string,
	   *
	   *       // A required enum prop named "category".
	   *       category: Props.oneOf(['News','Photos']).isRequired,
	   *
	   *       // A prop named "dialog" that requires an instance of Dialog.
	   *       dialog: Props.instanceOf(Dialog).isRequired
	   *     },
	   *     render: function() { ... }
	   *   });
	   *
	   * A more formal specification of how these methods are used:
	   *
	   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
	   *   decl := ReactPropTypes.{type}(.isRequired)?
	   *
	   * Each and every declaration produces a function with the same signature. This
	   * allows the creation of custom validation functions. For example:
	   *
	   *  var MyLink = React.createClass({
	   *    propTypes: {
	   *      // An optional string or URI prop named "href".
	   *      href: function(props, propName, componentName) {
	   *        var propValue = props[propName];
	   *        if (propValue != null && typeof propValue !== 'string' &&
	   *            !(propValue instanceof URI)) {
	   *          return new Error(
	   *            'Expected a string or an URI for ' + propName + ' in ' +
	   *            componentName
	   *          );
	   *        }
	   *      }
	   *    },
	   *    render: function() {...}
	   *  });
	   *
	   * @internal
	   */

	  var ANONYMOUS = '<<anonymous>>';

	  // Important!
	  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
	  var ReactPropTypes = {
	    array: createPrimitiveTypeChecker('array'),
	    bool: createPrimitiveTypeChecker('boolean'),
	    func: createPrimitiveTypeChecker('function'),
	    number: createPrimitiveTypeChecker('number'),
	    object: createPrimitiveTypeChecker('object'),
	    string: createPrimitiveTypeChecker('string'),
	    symbol: createPrimitiveTypeChecker('symbol'),

	    any: createAnyTypeChecker(),
	    arrayOf: createArrayOfTypeChecker,
	    element: createElementTypeChecker(),
	    instanceOf: createInstanceTypeChecker,
	    node: createNodeChecker(),
	    objectOf: createObjectOfTypeChecker,
	    oneOf: createEnumTypeChecker,
	    oneOfType: createUnionTypeChecker,
	    shape: createShapeTypeChecker,
	    exact: createStrictShapeTypeChecker,
	  };

	  /**
	   * inlined Object.is polyfill to avoid requiring consumers ship their own
	   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	   */
	  /*eslint-disable no-self-compare*/
	  function is(x, y) {
	    // SameValue algorithm
	    if (x === y) {
	      // Steps 1-5, 7-10
	      // Steps 6.b-6.e: +0 != -0
	      return x !== 0 || 1 / x === 1 / y;
	    } else {
	      // Step 6.a: NaN == NaN
	      return x !== x && y !== y;
	    }
	  }
	  /*eslint-enable no-self-compare*/

	  /**
	   * We use an Error-like object for backward compatibility as people may call
	   * PropTypes directly and inspect their output. However, we don't use real
	   * Errors anymore. We don't inspect their stack anyway, and creating them
	   * is prohibitively expensive if they are created too often, such as what
	   * happens in oneOfType() for any type before the one that matched.
	   */
	  function PropTypeError(message) {
	    this.message = message;
	    this.stack = '';
	  }
	  // Make `instanceof Error` still work for returned errors.
	  PropTypeError.prototype = Error.prototype;

	  function createChainableTypeChecker(validate) {
	    if (process.env.NODE_ENV !== 'production') {
	      var manualPropTypeCallCache = {};
	      var manualPropTypeWarningCount = 0;
	    }
	    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
	      componentName = componentName || ANONYMOUS;
	      propFullName = propFullName || propName;

	      if (secret !== ReactPropTypesSecret) {
	        if (throwOnDirectAccess) {
	          // New behavior only for users of `prop-types` package
	          invariant(
	            false,
	            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	            'Use `PropTypes.checkPropTypes()` to call them. ' +
	            'Read more at http://fb.me/use-check-prop-types'
	          );
	        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
	          // Old behavior for people using React.PropTypes
	          var cacheKey = componentName + ':' + propName;
	          if (
	            !manualPropTypeCallCache[cacheKey] &&
	            // Avoid spamming the console because they are often not actionable except for lib authors
	            manualPropTypeWarningCount < 3
	          ) {
	            warning(
	              false,
	              'You are manually calling a React.PropTypes validation ' +
	              'function for the `%s` prop on `%s`. This is deprecated ' +
	              'and will throw in the standalone `prop-types` package. ' +
	              'You may be seeing this warning due to a third-party PropTypes ' +
	              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
	              propFullName,
	              componentName
	            );
	            manualPropTypeCallCache[cacheKey] = true;
	            manualPropTypeWarningCount++;
	          }
	        }
	      }
	      if (props[propName] == null) {
	        if (isRequired) {
	          if (props[propName] === null) {
	            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
	          }
	          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
	        }
	        return null;
	      } else {
	        return validate(props, propName, componentName, location, propFullName);
	      }
	    }

	    var chainedCheckType = checkType.bind(null, false);
	    chainedCheckType.isRequired = checkType.bind(null, true);

	    return chainedCheckType;
	  }

	  function createPrimitiveTypeChecker(expectedType) {
	    function validate(props, propName, componentName, location, propFullName, secret) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== expectedType) {
	        // `propValue` being instance of, say, date/regexp, pass the 'object'
	        // check, but we can offer a more precise error message here rather than
	        // 'of type `object`'.
	        var preciseType = getPreciseType(propValue);

	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createAnyTypeChecker() {
	    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
	  }

	  function createArrayOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
	      }
	      var propValue = props[propName];
	      if (!Array.isArray(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
	      }
	      for (var i = 0; i < propValue.length; i++) {
	        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createElementTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!isValidElement(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createInstanceTypeChecker(expectedClass) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!(props[propName] instanceof expectedClass)) {
	        var expectedClassName = expectedClass.name || ANONYMOUS;
	        var actualClassName = getClassName(props[propName]);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createEnumTypeChecker(expectedValues) {
	    if (!Array.isArray(expectedValues)) {
	      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
	      return emptyFunction.thatReturnsNull;
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      for (var i = 0; i < expectedValues.length; i++) {
	        if (is(propValue, expectedValues[i])) {
	          return null;
	        }
	      }

	      var valuesString = JSON.stringify(expectedValues);
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createObjectOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
	      }
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
	      }
	      for (var key in propValue) {
	        if (propValue.hasOwnProperty(key)) {
	          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	          if (error instanceof Error) {
	            return error;
	          }
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createUnionTypeChecker(arrayOfTypeCheckers) {
	    if (!Array.isArray(arrayOfTypeCheckers)) {
	      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
	      return emptyFunction.thatReturnsNull;
	    }

	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (typeof checker !== 'function') {
	        warning(
	          false,
	          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
	          'received %s at index %s.',
	          getPostfixForTypeWarning(checker),
	          i
	        );
	        return emptyFunction.thatReturnsNull;
	      }
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	        var checker = arrayOfTypeCheckers[i];
	        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
	          return null;
	        }
	      }

	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createNodeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!isNode(props[propName])) {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      for (var key in shapeTypes) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          continue;
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createStrictShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      // We need to check all keys in case some are required but missing from
	      // props.
	      var allKeys = assign({}, props[propName], shapeTypes);
	      for (var key in allKeys) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          return new PropTypeError(
	            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
	            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
	            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
	          );
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }

	    return createChainableTypeChecker(validate);
	  }

	  function isNode(propValue) {
	    switch (typeof propValue) {
	      case 'number':
	      case 'string':
	      case 'undefined':
	        return true;
	      case 'boolean':
	        return !propValue;
	      case 'object':
	        if (Array.isArray(propValue)) {
	          return propValue.every(isNode);
	        }
	        if (propValue === null || isValidElement(propValue)) {
	          return true;
	        }

	        var iteratorFn = getIteratorFn(propValue);
	        if (iteratorFn) {
	          var iterator = iteratorFn.call(propValue);
	          var step;
	          if (iteratorFn !== propValue.entries) {
	            while (!(step = iterator.next()).done) {
	              if (!isNode(step.value)) {
	                return false;
	              }
	            }
	          } else {
	            // Iterator will provide entry [k,v] tuples rather than values.
	            while (!(step = iterator.next()).done) {
	              var entry = step.value;
	              if (entry) {
	                if (!isNode(entry[1])) {
	                  return false;
	                }
	              }
	            }
	          }
	        } else {
	          return false;
	        }

	        return true;
	      default:
	        return false;
	    }
	  }

	  function isSymbol(propType, propValue) {
	    // Native Symbol.
	    if (propType === 'symbol') {
	      return true;
	    }

	    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
	    if (propValue['@@toStringTag'] === 'Symbol') {
	      return true;
	    }

	    // Fallback for non-spec compliant Symbols which are polyfilled.
	    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
	      return true;
	    }

	    return false;
	  }

	  // Equivalent of `typeof` but with special handling for array and regexp.
	  function getPropType(propValue) {
	    var propType = typeof propValue;
	    if (Array.isArray(propValue)) {
	      return 'array';
	    }
	    if (propValue instanceof RegExp) {
	      // Old webkits (at least until Android 4.0) return 'function' rather than
	      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	      // passes PropTypes.object.
	      return 'object';
	    }
	    if (isSymbol(propType, propValue)) {
	      return 'symbol';
	    }
	    return propType;
	  }

	  // This handles more types than `getPropType`. Only used for error messages.
	  // See `createPrimitiveTypeChecker`.
	  function getPreciseType(propValue) {
	    if (typeof propValue === 'undefined' || propValue === null) {
	      return '' + propValue;
	    }
	    var propType = getPropType(propValue);
	    if (propType === 'object') {
	      if (propValue instanceof Date) {
	        return 'date';
	      } else if (propValue instanceof RegExp) {
	        return 'regexp';
	      }
	    }
	    return propType;
	  }

	  // Returns a string that is postfixed to a warning about an invalid type.
	  // For example, "undefined" or "of type array"
	  function getPostfixForTypeWarning(value) {
	    var type = getPreciseType(value);
	    switch (type) {
	      case 'array':
	      case 'object':
	        return 'an ' + type;
	      case 'boolean':
	      case 'date':
	      case 'regexp':
	        return 'a ' + type;
	      default:
	        return type;
	    }
	  }

	  // Returns class name of the object, if any.
	  function getClassName(propValue) {
	    if (!propValue.constructor || !propValue.constructor.name) {
	      return ANONYMOUS;
	    }
	    return propValue.constructor.name;
	  }

	  ReactPropTypes.checkPropTypes = checkPropTypes;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (process.env.NODE_ENV !== 'production') {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	var emptyFunction = __webpack_require__(4);

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction;

	if (process.env.NODE_ENV !== 'production') {
	  var printWarning = function printWarning(format) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    var argIndex = 0;
	    var message = 'Warning: ' + format.replace(/%s/g, function () {
	      return args[argIndex++];
	    });
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };

	  warning = function warning(condition, format) {
	    if (format === undefined) {
	      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }

	    if (format.indexOf('Failed Composite propType: ') === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }

	    if (!condition) {
	      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	        args[_key2 - 2] = arguments[_key2];
	      }

	      printWarning.apply(undefined, [format].concat(args));
	    }
	  };
	}

	module.exports = warning;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	module.exports = ReactPropTypesSecret;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	if (process.env.NODE_ENV !== 'production') {
	  var invariant = __webpack_require__(5);
	  var warning = __webpack_require__(6);
	  var ReactPropTypesSecret = __webpack_require__(8);
	  var loggedTypeFailures = {};
	}

	/**
	 * Assert that the values match with the type specs.
	 * Error messages are memorized and will only be shown once.
	 *
	 * @param {object} typeSpecs Map of name to a ReactPropType
	 * @param {object} values Runtime values that need to be type-checked
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @param {string} componentName Name of the component for error messages.
	 * @param {?Function} getStack Returns the component stack.
	 * @private
	 */
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
	  if (process.env.NODE_ENV !== 'production') {
	    for (var typeSpecName in typeSpecs) {
	      if (typeSpecs.hasOwnProperty(typeSpecName)) {
	        var error;
	        // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
	          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
	        } catch (ex) {
	          error = ex;
	        }
	        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
	        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error.message] = true;

	          var stack = getStack ? getStack() : '';

	          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
	        }
	      }
	    }
	  }
	}

	module.exports = checkPropTypes;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var emptyFunction = __webpack_require__(4);
	var invariant = __webpack_require__(5);
	var ReactPropTypesSecret = __webpack_require__(8);

	module.exports = function() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === ReactPropTypesSecret) {
	      // It is still safe when called from React.
	      return;
	    }
	    invariant(
	      false,
	      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	      'Use PropTypes.checkPropTypes() to call them. ' +
	      'Read more at http://fb.me/use-check-prop-types'
	    );
	  };
	  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  };
	  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
	    array: shim,
	    bool: shim,
	    func: shim,
	    number: shim,
	    object: shim,
	    string: shim,
	    symbol: shim,

	    any: shim,
	    arrayOf: getShim,
	    element: shim,
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim,
	    exact: getShim
	  };

	  ReactPropTypes.checkPropTypes = emptyFunction;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	var React = __webpack_require__(11);
	var factory = __webpack_require__(13);

	if (typeof React === 'undefined') {
	  throw Error(
	    'create-react-class could not find the React object. If you are using script tags, ' +
	      'make sure that React is being loaded before create-react-class.'
	  );
	}

	// Hack to grab NoopUpdateQueue from isomorphic React
	var ReactNoopUpdateQueue = new React.Component().updater;

	module.exports = factory(
	  React.Component,
	  React.isValidElement,
	  ReactNoopUpdateQueue
	);


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	var _assign = __webpack_require__(7);

	var emptyObject = __webpack_require__(14);
	var _invariant = __webpack_require__(5);

	if (process.env.NODE_ENV !== 'production') {
	  var warning = __webpack_require__(6);
	}

	var MIXINS_KEY = 'mixins';

	// Helper function to allow the creation of anonymous functions which do not
	// have .name set to the name of the variable being assigned to.
	function identity(fn) {
	  return fn;
	}

	var ReactPropTypeLocationNames;
	if (process.env.NODE_ENV !== 'production') {
	  ReactPropTypeLocationNames = {
	    prop: 'prop',
	    context: 'context',
	    childContext: 'child context'
	  };
	} else {
	  ReactPropTypeLocationNames = {};
	}

	function factory(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
	  /**
	   * Policies that describe methods in `ReactClassInterface`.
	   */

	  var injectedMixins = [];

	  /**
	   * Composite components are higher-level components that compose other composite
	   * or host components.
	   *
	   * To create a new type of `ReactClass`, pass a specification of
	   * your new class to `React.createClass`. The only requirement of your class
	   * specification is that you implement a `render` method.
	   *
	   *   var MyComponent = React.createClass({
	   *     render: function() {
	   *       return <div>Hello World</div>;
	   *     }
	   *   });
	   *
	   * The class specification supports a specific protocol of methods that have
	   * special meaning (e.g. `render`). See `ReactClassInterface` for
	   * more the comprehensive protocol. Any other properties and methods in the
	   * class specification will be available on the prototype.
	   *
	   * @interface ReactClassInterface
	   * @internal
	   */
	  var ReactClassInterface = {
	    /**
	     * An array of Mixin objects to include when defining your component.
	     *
	     * @type {array}
	     * @optional
	     */
	    mixins: 'DEFINE_MANY',

	    /**
	     * An object containing properties and methods that should be defined on
	     * the component's constructor instead of its prototype (static methods).
	     *
	     * @type {object}
	     * @optional
	     */
	    statics: 'DEFINE_MANY',

	    /**
	     * Definition of prop types for this component.
	     *
	     * @type {object}
	     * @optional
	     */
	    propTypes: 'DEFINE_MANY',

	    /**
	     * Definition of context types for this component.
	     *
	     * @type {object}
	     * @optional
	     */
	    contextTypes: 'DEFINE_MANY',

	    /**
	     * Definition of context types this component sets for its children.
	     *
	     * @type {object}
	     * @optional
	     */
	    childContextTypes: 'DEFINE_MANY',

	    // ==== Definition methods ====

	    /**
	     * Invoked when the component is mounted. Values in the mapping will be set on
	     * `this.props` if that prop is not specified (i.e. using an `in` check).
	     *
	     * This method is invoked before `getInitialState` and therefore cannot rely
	     * on `this.state` or use `this.setState`.
	     *
	     * @return {object}
	     * @optional
	     */
	    getDefaultProps: 'DEFINE_MANY_MERGED',

	    /**
	     * Invoked once before the component is mounted. The return value will be used
	     * as the initial value of `this.state`.
	     *
	     *   getInitialState: function() {
	     *     return {
	     *       isOn: false,
	     *       fooBaz: new BazFoo()
	     *     }
	     *   }
	     *
	     * @return {object}
	     * @optional
	     */
	    getInitialState: 'DEFINE_MANY_MERGED',

	    /**
	     * @return {object}
	     * @optional
	     */
	    getChildContext: 'DEFINE_MANY_MERGED',

	    /**
	     * Uses props from `this.props` and state from `this.state` to render the
	     * structure of the component.
	     *
	     * No guarantees are made about when or how often this method is invoked, so
	     * it must not have side effects.
	     *
	     *   render: function() {
	     *     var name = this.props.name;
	     *     return <div>Hello, {name}!</div>;
	     *   }
	     *
	     * @return {ReactComponent}
	     * @required
	     */
	    render: 'DEFINE_ONCE',

	    // ==== Delegate methods ====

	    /**
	     * Invoked when the component is initially created and about to be mounted.
	     * This may have side effects, but any external subscriptions or data created
	     * by this method must be cleaned up in `componentWillUnmount`.
	     *
	     * @optional
	     */
	    componentWillMount: 'DEFINE_MANY',

	    /**
	     * Invoked when the component has been mounted and has a DOM representation.
	     * However, there is no guarantee that the DOM node is in the document.
	     *
	     * Use this as an opportunity to operate on the DOM when the component has
	     * been mounted (initialized and rendered) for the first time.
	     *
	     * @param {DOMElement} rootNode DOM element representing the component.
	     * @optional
	     */
	    componentDidMount: 'DEFINE_MANY',

	    /**
	     * Invoked before the component receives new props.
	     *
	     * Use this as an opportunity to react to a prop transition by updating the
	     * state using `this.setState`. Current props are accessed via `this.props`.
	     *
	     *   componentWillReceiveProps: function(nextProps, nextContext) {
	     *     this.setState({
	     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
	     *     });
	     *   }
	     *
	     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
	     * transition may cause a state change, but the opposite is not true. If you
	     * need it, you are probably looking for `componentWillUpdate`.
	     *
	     * @param {object} nextProps
	     * @optional
	     */
	    componentWillReceiveProps: 'DEFINE_MANY',

	    /**
	     * Invoked while deciding if the component should be updated as a result of
	     * receiving new props, state and/or context.
	     *
	     * Use this as an opportunity to `return false` when you're certain that the
	     * transition to the new props/state/context will not require a component
	     * update.
	     *
	     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
	     *     return !equal(nextProps, this.props) ||
	     *       !equal(nextState, this.state) ||
	     *       !equal(nextContext, this.context);
	     *   }
	     *
	     * @param {object} nextProps
	     * @param {?object} nextState
	     * @param {?object} nextContext
	     * @return {boolean} True if the component should update.
	     * @optional
	     */
	    shouldComponentUpdate: 'DEFINE_ONCE',

	    /**
	     * Invoked when the component is about to update due to a transition from
	     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
	     * and `nextContext`.
	     *
	     * Use this as an opportunity to perform preparation before an update occurs.
	     *
	     * NOTE: You **cannot** use `this.setState()` in this method.
	     *
	     * @param {object} nextProps
	     * @param {?object} nextState
	     * @param {?object} nextContext
	     * @param {ReactReconcileTransaction} transaction
	     * @optional
	     */
	    componentWillUpdate: 'DEFINE_MANY',

	    /**
	     * Invoked when the component's DOM representation has been updated.
	     *
	     * Use this as an opportunity to operate on the DOM when the component has
	     * been updated.
	     *
	     * @param {object} prevProps
	     * @param {?object} prevState
	     * @param {?object} prevContext
	     * @param {DOMElement} rootNode DOM element representing the component.
	     * @optional
	     */
	    componentDidUpdate: 'DEFINE_MANY',

	    /**
	     * Invoked when the component is about to be removed from its parent and have
	     * its DOM representation destroyed.
	     *
	     * Use this as an opportunity to deallocate any external resources.
	     *
	     * NOTE: There is no `componentDidUnmount` since your component will have been
	     * destroyed by that point.
	     *
	     * @optional
	     */
	    componentWillUnmount: 'DEFINE_MANY',

	    /**
	     * Replacement for (deprecated) `componentWillMount`.
	     *
	     * @optional
	     */
	    UNSAFE_componentWillMount: 'DEFINE_MANY',

	    /**
	     * Replacement for (deprecated) `componentWillReceiveProps`.
	     *
	     * @optional
	     */
	    UNSAFE_componentWillReceiveProps: 'DEFINE_MANY',

	    /**
	     * Replacement for (deprecated) `componentWillUpdate`.
	     *
	     * @optional
	     */
	    UNSAFE_componentWillUpdate: 'DEFINE_MANY',

	    // ==== Advanced methods ====

	    /**
	     * Updates the component's currently mounted DOM representation.
	     *
	     * By default, this implements React's rendering and reconciliation algorithm.
	     * Sophisticated clients may wish to override this.
	     *
	     * @param {ReactReconcileTransaction} transaction
	     * @internal
	     * @overridable
	     */
	    updateComponent: 'OVERRIDE_BASE'
	  };

	  /**
	   * Similar to ReactClassInterface but for static methods.
	   */
	  var ReactClassStaticInterface = {
	    /**
	     * This method is invoked after a component is instantiated and when it
	     * receives new props. Return an object to update state in response to
	     * prop changes. Return null to indicate no change to state.
	     *
	     * If an object is returned, its keys will be merged into the existing state.
	     *
	     * @return {object || null}
	     * @optional
	     */
	    getDerivedStateFromProps: 'DEFINE_MANY_MERGED'
	  };

	  /**
	   * Mapping from class specification keys to special processing functions.
	   *
	   * Although these are declared like instance properties in the specification
	   * when defining classes using `React.createClass`, they are actually static
	   * and are accessible on the constructor instead of the prototype. Despite
	   * being static, they must be defined outside of the "statics" key under
	   * which all other static methods are defined.
	   */
	  var RESERVED_SPEC_KEYS = {
	    displayName: function(Constructor, displayName) {
	      Constructor.displayName = displayName;
	    },
	    mixins: function(Constructor, mixins) {
	      if (mixins) {
	        for (var i = 0; i < mixins.length; i++) {
	          mixSpecIntoComponent(Constructor, mixins[i]);
	        }
	      }
	    },
	    childContextTypes: function(Constructor, childContextTypes) {
	      if (process.env.NODE_ENV !== 'production') {
	        validateTypeDef(Constructor, childContextTypes, 'childContext');
	      }
	      Constructor.childContextTypes = _assign(
	        {},
	        Constructor.childContextTypes,
	        childContextTypes
	      );
	    },
	    contextTypes: function(Constructor, contextTypes) {
	      if (process.env.NODE_ENV !== 'production') {
	        validateTypeDef(Constructor, contextTypes, 'context');
	      }
	      Constructor.contextTypes = _assign(
	        {},
	        Constructor.contextTypes,
	        contextTypes
	      );
	    },
	    /**
	     * Special case getDefaultProps which should move into statics but requires
	     * automatic merging.
	     */
	    getDefaultProps: function(Constructor, getDefaultProps) {
	      if (Constructor.getDefaultProps) {
	        Constructor.getDefaultProps = createMergedResultFunction(
	          Constructor.getDefaultProps,
	          getDefaultProps
	        );
	      } else {
	        Constructor.getDefaultProps = getDefaultProps;
	      }
	    },
	    propTypes: function(Constructor, propTypes) {
	      if (process.env.NODE_ENV !== 'production') {
	        validateTypeDef(Constructor, propTypes, 'prop');
	      }
	      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
	    },
	    statics: function(Constructor, statics) {
	      mixStaticSpecIntoComponent(Constructor, statics);
	    },
	    autobind: function() {}
	  };

	  function validateTypeDef(Constructor, typeDef, location) {
	    for (var propName in typeDef) {
	      if (typeDef.hasOwnProperty(propName)) {
	        // use a warning instead of an _invariant so components
	        // don't show up in prod but only in __DEV__
	        if (process.env.NODE_ENV !== 'production') {
	          warning(
	            typeof typeDef[propName] === 'function',
	            '%s: %s type `%s` is invalid; it must be a function, usually from ' +
	              'React.PropTypes.',
	            Constructor.displayName || 'ReactClass',
	            ReactPropTypeLocationNames[location],
	            propName
	          );
	        }
	      }
	    }
	  }

	  function validateMethodOverride(isAlreadyDefined, name) {
	    var specPolicy = ReactClassInterface.hasOwnProperty(name)
	      ? ReactClassInterface[name]
	      : null;

	    // Disallow overriding of base class methods unless explicitly allowed.
	    if (ReactClassMixin.hasOwnProperty(name)) {
	      _invariant(
	        specPolicy === 'OVERRIDE_BASE',
	        'ReactClassInterface: You are attempting to override ' +
	          '`%s` from your class specification. Ensure that your method names ' +
	          'do not overlap with React methods.',
	        name
	      );
	    }

	    // Disallow defining methods more than once unless explicitly allowed.
	    if (isAlreadyDefined) {
	      _invariant(
	        specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED',
	        'ReactClassInterface: You are attempting to define ' +
	          '`%s` on your component more than once. This conflict may be due ' +
	          'to a mixin.',
	        name
	      );
	    }
	  }

	  /**
	   * Mixin helper which handles policy validation and reserved
	   * specification keys when building React classes.
	   */
	  function mixSpecIntoComponent(Constructor, spec) {
	    if (!spec) {
	      if (process.env.NODE_ENV !== 'production') {
	        var typeofSpec = typeof spec;
	        var isMixinValid = typeofSpec === 'object' && spec !== null;

	        if (process.env.NODE_ENV !== 'production') {
	          warning(
	            isMixinValid,
	            "%s: You're attempting to include a mixin that is either null " +
	              'or not an object. Check the mixins included by the component, ' +
	              'as well as any mixins they include themselves. ' +
	              'Expected object but got %s.',
	            Constructor.displayName || 'ReactClass',
	            spec === null ? null : typeofSpec
	          );
	        }
	      }

	      return;
	    }

	    _invariant(
	      typeof spec !== 'function',
	      "ReactClass: You're attempting to " +
	        'use a component class or function as a mixin. Instead, just use a ' +
	        'regular object.'
	    );
	    _invariant(
	      !isValidElement(spec),
	      "ReactClass: You're attempting to " +
	        'use a component as a mixin. Instead, just use a regular object.'
	    );

	    var proto = Constructor.prototype;
	    var autoBindPairs = proto.__reactAutoBindPairs;

	    // By handling mixins before any other properties, we ensure the same
	    // chaining order is applied to methods with DEFINE_MANY policy, whether
	    // mixins are listed before or after these methods in the spec.
	    if (spec.hasOwnProperty(MIXINS_KEY)) {
	      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
	    }

	    for (var name in spec) {
	      if (!spec.hasOwnProperty(name)) {
	        continue;
	      }

	      if (name === MIXINS_KEY) {
	        // We have already handled mixins in a special case above.
	        continue;
	      }

	      var property = spec[name];
	      var isAlreadyDefined = proto.hasOwnProperty(name);
	      validateMethodOverride(isAlreadyDefined, name);

	      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
	        RESERVED_SPEC_KEYS[name](Constructor, property);
	      } else {
	        // Setup methods on prototype:
	        // The following member methods should not be automatically bound:
	        // 1. Expected ReactClass methods (in the "interface").
	        // 2. Overridden methods (that were mixed in).
	        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
	        var isFunction = typeof property === 'function';
	        var shouldAutoBind =
	          isFunction &&
	          !isReactClassMethod &&
	          !isAlreadyDefined &&
	          spec.autobind !== false;

	        if (shouldAutoBind) {
	          autoBindPairs.push(name, property);
	          proto[name] = property;
	        } else {
	          if (isAlreadyDefined) {
	            var specPolicy = ReactClassInterface[name];

	            // These cases should already be caught by validateMethodOverride.
	            _invariant(
	              isReactClassMethod &&
	                (specPolicy === 'DEFINE_MANY_MERGED' ||
	                  specPolicy === 'DEFINE_MANY'),
	              'ReactClass: Unexpected spec policy %s for key %s ' +
	                'when mixing in component specs.',
	              specPolicy,
	              name
	            );

	            // For methods which are defined more than once, call the existing
	            // methods before calling the new property, merging if appropriate.
	            if (specPolicy === 'DEFINE_MANY_MERGED') {
	              proto[name] = createMergedResultFunction(proto[name], property);
	            } else if (specPolicy === 'DEFINE_MANY') {
	              proto[name] = createChainedFunction(proto[name], property);
	            }
	          } else {
	            proto[name] = property;
	            if (process.env.NODE_ENV !== 'production') {
	              // Add verbose displayName to the function, which helps when looking
	              // at profiling tools.
	              if (typeof property === 'function' && spec.displayName) {
	                proto[name].displayName = spec.displayName + '_' + name;
	              }
	            }
	          }
	        }
	      }
	    }
	  }

	  function mixStaticSpecIntoComponent(Constructor, statics) {
	    if (!statics) {
	      return;
	    }

	    for (var name in statics) {
	      var property = statics[name];
	      if (!statics.hasOwnProperty(name)) {
	        continue;
	      }

	      var isReserved = name in RESERVED_SPEC_KEYS;
	      _invariant(
	        !isReserved,
	        'ReactClass: You are attempting to define a reserved ' +
	          'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
	          'as an instance property instead; it will still be accessible on the ' +
	          'constructor.',
	        name
	      );

	      var isAlreadyDefined = name in Constructor;
	      if (isAlreadyDefined) {
	        var specPolicy = ReactClassStaticInterface.hasOwnProperty(name)
	          ? ReactClassStaticInterface[name]
	          : null;

	        _invariant(
	          specPolicy === 'DEFINE_MANY_MERGED',
	          'ReactClass: You are attempting to define ' +
	            '`%s` on your component more than once. This conflict may be ' +
	            'due to a mixin.',
	          name
	        );

	        Constructor[name] = createMergedResultFunction(Constructor[name], property);

	        return;
	      }

	      Constructor[name] = property;
	    }
	  }

	  /**
	   * Merge two objects, but throw if both contain the same key.
	   *
	   * @param {object} one The first object, which is mutated.
	   * @param {object} two The second object
	   * @return {object} one after it has been mutated to contain everything in two.
	   */
	  function mergeIntoWithNoDuplicateKeys(one, two) {
	    _invariant(
	      one && two && typeof one === 'object' && typeof two === 'object',
	      'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'
	    );

	    for (var key in two) {
	      if (two.hasOwnProperty(key)) {
	        _invariant(
	          one[key] === undefined,
	          'mergeIntoWithNoDuplicateKeys(): ' +
	            'Tried to merge two objects with the same key: `%s`. This conflict ' +
	            'may be due to a mixin; in particular, this may be caused by two ' +
	            'getInitialState() or getDefaultProps() methods returning objects ' +
	            'with clashing keys.',
	          key
	        );
	        one[key] = two[key];
	      }
	    }
	    return one;
	  }

	  /**
	   * Creates a function that invokes two functions and merges their return values.
	   *
	   * @param {function} one Function to invoke first.
	   * @param {function} two Function to invoke second.
	   * @return {function} Function that invokes the two argument functions.
	   * @private
	   */
	  function createMergedResultFunction(one, two) {
	    return function mergedResult() {
	      var a = one.apply(this, arguments);
	      var b = two.apply(this, arguments);
	      if (a == null) {
	        return b;
	      } else if (b == null) {
	        return a;
	      }
	      var c = {};
	      mergeIntoWithNoDuplicateKeys(c, a);
	      mergeIntoWithNoDuplicateKeys(c, b);
	      return c;
	    };
	  }

	  /**
	   * Creates a function that invokes two functions and ignores their return vales.
	   *
	   * @param {function} one Function to invoke first.
	   * @param {function} two Function to invoke second.
	   * @return {function} Function that invokes the two argument functions.
	   * @private
	   */
	  function createChainedFunction(one, two) {
	    return function chainedFunction() {
	      one.apply(this, arguments);
	      two.apply(this, arguments);
	    };
	  }

	  /**
	   * Binds a method to the component.
	   *
	   * @param {object} component Component whose method is going to be bound.
	   * @param {function} method Method to be bound.
	   * @return {function} The bound method.
	   */
	  function bindAutoBindMethod(component, method) {
	    var boundMethod = method.bind(component);
	    if (process.env.NODE_ENV !== 'production') {
	      boundMethod.__reactBoundContext = component;
	      boundMethod.__reactBoundMethod = method;
	      boundMethod.__reactBoundArguments = null;
	      var componentName = component.constructor.displayName;
	      var _bind = boundMethod.bind;
	      boundMethod.bind = function(newThis) {
	        for (
	          var _len = arguments.length,
	            args = Array(_len > 1 ? _len - 1 : 0),
	            _key = 1;
	          _key < _len;
	          _key++
	        ) {
	          args[_key - 1] = arguments[_key];
	        }

	        // User is trying to bind() an autobound method; we effectively will
	        // ignore the value of "this" that the user is trying to use, so
	        // let's warn.
	        if (newThis !== component && newThis !== null) {
	          if (process.env.NODE_ENV !== 'production') {
	            warning(
	              false,
	              'bind(): React component methods may only be bound to the ' +
	                'component instance. See %s',
	              componentName
	            );
	          }
	        } else if (!args.length) {
	          if (process.env.NODE_ENV !== 'production') {
	            warning(
	              false,
	              'bind(): You are binding a component method to the component. ' +
	                'React does this for you automatically in a high-performance ' +
	                'way, so you can safely remove this call. See %s',
	              componentName
	            );
	          }
	          return boundMethod;
	        }
	        var reboundMethod = _bind.apply(boundMethod, arguments);
	        reboundMethod.__reactBoundContext = component;
	        reboundMethod.__reactBoundMethod = method;
	        reboundMethod.__reactBoundArguments = args;
	        return reboundMethod;
	      };
	    }
	    return boundMethod;
	  }

	  /**
	   * Binds all auto-bound methods in a component.
	   *
	   * @param {object} component Component whose method is going to be bound.
	   */
	  function bindAutoBindMethods(component) {
	    var pairs = component.__reactAutoBindPairs;
	    for (var i = 0; i < pairs.length; i += 2) {
	      var autoBindKey = pairs[i];
	      var method = pairs[i + 1];
	      component[autoBindKey] = bindAutoBindMethod(component, method);
	    }
	  }

	  var IsMountedPreMixin = {
	    componentDidMount: function() {
	      this.__isMounted = true;
	    }
	  };

	  var IsMountedPostMixin = {
	    componentWillUnmount: function() {
	      this.__isMounted = false;
	    }
	  };

	  /**
	   * Add more to the ReactClass base class. These are all legacy features and
	   * therefore not already part of the modern ReactComponent.
	   */
	  var ReactClassMixin = {
	    /**
	     * TODO: This will be deprecated because state should always keep a consistent
	     * type signature and the only use case for this, is to avoid that.
	     */
	    replaceState: function(newState, callback) {
	      this.updater.enqueueReplaceState(this, newState, callback);
	    },

	    /**
	     * Checks whether or not this composite component is mounted.
	     * @return {boolean} True if mounted, false otherwise.
	     * @protected
	     * @final
	     */
	    isMounted: function() {
	      if (process.env.NODE_ENV !== 'production') {
	        warning(
	          this.__didWarnIsMounted,
	          '%s: isMounted is deprecated. Instead, make sure to clean up ' +
	            'subscriptions and pending requests in componentWillUnmount to ' +
	            'prevent memory leaks.',
	          (this.constructor && this.constructor.displayName) ||
	            this.name ||
	            'Component'
	        );
	        this.__didWarnIsMounted = true;
	      }
	      return !!this.__isMounted;
	    }
	  };

	  var ReactClassComponent = function() {};
	  _assign(
	    ReactClassComponent.prototype,
	    ReactComponent.prototype,
	    ReactClassMixin
	  );

	  /**
	   * Creates a composite component class given a class specification.
	   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
	   *
	   * @param {object} spec Class specification (which must define `render`).
	   * @return {function} Component constructor function.
	   * @public
	   */
	  function createClass(spec) {
	    // To keep our warnings more understandable, we'll use a little hack here to
	    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
	    // unnecessarily identify a class without displayName as 'Constructor'.
	    var Constructor = identity(function(props, context, updater) {
	      // This constructor gets overridden by mocks. The argument is used
	      // by mocks to assert on what gets mounted.

	      if (process.env.NODE_ENV !== 'production') {
	        warning(
	          this instanceof Constructor,
	          'Something is calling a React component directly. Use a factory or ' +
	            'JSX instead. See: https://fb.me/react-legacyfactory'
	        );
	      }

	      // Wire up auto-binding
	      if (this.__reactAutoBindPairs.length) {
	        bindAutoBindMethods(this);
	      }

	      this.props = props;
	      this.context = context;
	      this.refs = emptyObject;
	      this.updater = updater || ReactNoopUpdateQueue;

	      this.state = null;

	      // ReactClasses doesn't have constructors. Instead, they use the
	      // getInitialState and componentWillMount methods for initialization.

	      var initialState = this.getInitialState ? this.getInitialState() : null;
	      if (process.env.NODE_ENV !== 'production') {
	        // We allow auto-mocks to proceed as if they're returning null.
	        if (
	          initialState === undefined &&
	          this.getInitialState._isMockFunction
	        ) {
	          // This is probably bad practice. Consider warning here and
	          // deprecating this convenience.
	          initialState = null;
	        }
	      }
	      _invariant(
	        typeof initialState === 'object' && !Array.isArray(initialState),
	        '%s.getInitialState(): must return an object or null',
	        Constructor.displayName || 'ReactCompositeComponent'
	      );

	      this.state = initialState;
	    });
	    Constructor.prototype = new ReactClassComponent();
	    Constructor.prototype.constructor = Constructor;
	    Constructor.prototype.__reactAutoBindPairs = [];

	    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

	    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
	    mixSpecIntoComponent(Constructor, spec);
	    mixSpecIntoComponent(Constructor, IsMountedPostMixin);

	    // Initialize the defaultProps property after all mixins have been merged.
	    if (Constructor.getDefaultProps) {
	      Constructor.defaultProps = Constructor.getDefaultProps();
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      // This is a tag to indicate that the use of these method names is ok,
	      // since it's used with createClass. If it's not, then it's likely a
	      // mistake so we'll warn you to use the static property, property
	      // initializer or constructor respectively.
	      if (Constructor.getDefaultProps) {
	        Constructor.getDefaultProps.isReactClassApproved = {};
	      }
	      if (Constructor.prototype.getInitialState) {
	        Constructor.prototype.getInitialState.isReactClassApproved = {};
	      }
	    }

	    _invariant(
	      Constructor.prototype.render,
	      'createClass(...): Class specification must implement a `render` method.'
	    );

	    if (process.env.NODE_ENV !== 'production') {
	      warning(
	        !Constructor.prototype.componentShouldUpdate,
	        '%s has a method called ' +
	          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
	          'The name is phrased as a question because the function is ' +
	          'expected to return a value.',
	        spec.displayName || 'A component'
	      );
	      warning(
	        !Constructor.prototype.componentWillRecieveProps,
	        '%s has a method called ' +
	          'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
	        spec.displayName || 'A component'
	      );
	      warning(
	        !Constructor.prototype.UNSAFE_componentWillRecieveProps,
	        '%s has a method called UNSAFE_componentWillRecieveProps(). ' +
	          'Did you mean UNSAFE_componentWillReceiveProps()?',
	        spec.displayName || 'A component'
	      );
	    }

	    // Reduce time spent doing lookups by setting these on the prototype.
	    for (var methodName in ReactClassInterface) {
	      if (!Constructor.prototype[methodName]) {
	        Constructor.prototype[methodName] = null;
	      }
	    }

	    return Constructor;
	  }

	  return createClass;
	}

	module.exports = factory;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	var emptyObject = {};

	if (process.env.NODE_ENV !== 'production') {
	  Object.freeze(emptyObject);
	}

	module.exports = emptyObject;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	'use strict';

	var SetupMixin = {
	  componentWillMount: function componentWillMount() {
	    this.setupSeries(this.props, this.state);
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (this.props === nextProps) {
	      return;
	    }

	    this.setupSeries(nextProps, this.state);
	  },

	  setupSeries: function setupSeries(props, state) {
	    if (props.data == null) {
	      return;
	    }

	    this.setValueRange(props, state);
	    this.setGroupedSeries(props);
	    this.setYearValues(props);
	  },

	  setGroupedSeries: function setGroupedSeries(props) {
	    var data = props.data;
	    if (data.length === 0) {
	      return;
	    }

	    this.dataMapping = [];
	    this.dataGrouping = [];

	    data = data.slice(); //copies array

	    var dataLabels = props.rowLabelProperties;
	    var valueLabel = props.valueProperty;

	    if (typeof dataLabels === 'string') {
	      dataLabels = [dataLabels];
	    }

	    var sortFields = dataLabels.slice();
	    sortFields.push(valueLabel);

	    data.sort(this.getSortFunction(sortFields));

	    var dataMapping = this.mapSeries(props, data);
	    this.dataMapping = dataMapping;

	    var dataGrouping = [];

	    if (dataLabels.length === 1) {
	      return;
	    }

	    var categoryStartIndex = 0;
	    var dataNames = dataMapping[0].dataNames;
	    var currentCategory = dataNames[dataNames.length - 2];

	    for (var i = 1; i < dataMapping.length; i++) {
	      dataNames = dataMapping[i].dataNames;
	      var newCategory = dataNames[dataNames.length - 2];

	      if (newCategory !== currentCategory) {
	        dataGrouping.push({
	          categoryName: currentCategory,
	          startIndex: categoryStartIndex,
	          count: i - categoryStartIndex
	        });

	        currentCategory = newCategory;
	        categoryStartIndex = i;
	      }
	    }

	    dataGrouping.push({
	      categoryName: currentCategory,
	      startIndex: categoryStartIndex,
	      count: dataMapping.length - categoryStartIndex
	    });

	    this.dataGrouping = dataGrouping;
	  },

	  mapSeries: function mapSeries(props, sortedSeries) {
	    var dataLabels = props.rowLabelProperties;
	    var valueLabel = props.valueProperty;
	    var metadataLabel = props.metadataProperty;

	    if (typeof dataLabels === 'string') {
	      dataLabels = [dataLabels];
	    }

	    var dataMapping = [];

	    var coverage = [];
	    var currentSeries = null;
	    var start = null;
	    var end = null;

	    var colorIndeces = [];
	    dataLabels.forEach(function () {
	      colorIndeces.push(0);
	    });

	    sortedSeries.forEach(function (item) {
	      var value = item[valueLabel];

	      if (currentSeries === null) {
	        currentSeries = item;
	        start = value;
	        end = value;

	        return;
	      }

	      var mismatchedIndex = this.getMismatchedIndex(props, item, currentSeries);

	      if (mismatchedIndex !== -1) {
	        if (start !== null && end !== null) {
	          coverage.push({ start: start, end: end });
	        }

	        var mismatchedDataNames = [];
	        dataLabels.forEach(function (label) {
	          mismatchedDataNames.push(currentSeries[label]);
	        });

	        var dataMap = {
	          dataNames: mismatchedDataNames,
	          coverage: coverage,
	          colorIndeces: colorIndeces
	        };

	        if (metadataLabel) {
	          dataMap.metadata = currentSeries[metadataLabel];
	        }

	        dataMapping.push(dataMap);

	        colorIndeces = colorIndeces.slice(); //Copy array by value
	        colorIndeces[mismatchedIndex] += 1;

	        for (var i = mismatchedIndex + 1; i < colorIndeces.length; i++) {
	          colorIndeces[i] = 0;
	        }

	        coverage = [];
	        currentSeries = item;
	        start = value;
	      } else if (value > end + props.stepSize) {
	        coverage.push({ start: start, end: end });
	        start = value;
	      }

	      end = value;
	    }, this);

	    //cleanup the last one
	    if (start !== null && end !== null) {
	      coverage.push({ start: start, end: end });
	    }

	    var dataNames = [];
	    dataLabels.forEach(function (label) {
	      dataNames.push(currentSeries[label]);
	    });

	    dataMapping.push({ dataNames: dataNames, coverage: coverage, colorIndeces: colorIndeces });

	    return dataMapping;
	  },

	  getMismatchedIndex: function getMismatchedIndex(props, data1, data2) {
	    var dataLabels = props.rowLabelProperties;

	    if (typeof dataLabels === 'string') {
	      dataLabels = [dataLabels];
	    }

	    for (var i = 0; i < dataLabels.length; i++) {
	      var label = dataLabels[i];

	      if (data1[label] !== data2[label]) {
	        return i;
	      }
	    }

	    return -1;
	  },

	  //Get sort function that sorts in order of array given.
	  getSortFunction: function getSortFunction(fieldList) {
	    return function (a, b) {
	      for (var key in fieldList) {
	        var sortField = fieldList[key];

	        if (a[sortField] > b[sortField]) {
	          return 1;
	        }

	        if (a[sortField] < b[sortField]) {
	          return -1;
	        }
	      }

	      return 0;
	    };
	  },

	  setYearValues: function setYearValues(props) {
	    var data = props.data;
	    var totalSeries = this.dataMapping.length;
	    var valueKey = props.valueProperty;

	    var dataDensity = []; //slicing becomes way easier with arrays.

	    data.forEach(function (item) {
	      var value = item[valueKey];

	      if (value === null) {
	        return;
	      }

	      if (!dataDensity[value]) {
	        dataDensity[value] = 0;
	      }

	      dataDensity[value] += 1;
	    }, this);

	    dataDensity.forEach(function (count, id, list) {
	      list[id] = count / totalSeries;
	    });

	    this.dataDensity = dataDensity;
	  },

	  getValueRange: function getValueRange(props) {
	    var data = props.data;
	    if (data.length === 0) {
	      return { min: props.min, max: props.max };
	    }

	    var start = props.min || null;
	    var end = props.max || null;

	    var value = props.valueProperty;

	    data.forEach(function (item) {
	      if (item[value] === null) {
	        return;
	      }

	      if (start === null || item[value] < start) {
	        start = item[value];
	      }

	      if (end === null || item[value] > end) {
	        end = item[value];
	      }
	    });

	    return { min: start, max: end };
	  },

	  isEqualData: function isEqualData(newData, oldData) {
	    if (newData === oldData) {
	      return true;
	    }

	    if (newData.length !== oldData.length) {
	      return false;
	    }

	    oldData.forEach(function (data, index) {
	      for (var key in data) {
	        if (newData[index][key] !== data[key]) {
	          return false;
	        }
	      }
	    });

	    return true;
	  },

	  boundValue: function boundValue(value, min, max) {
	    return Math.max(Math.min(value, max), min);
	  },

	  setValueRange: function setValueRange(props, state) {
	    var data = props.data;
	    var oldData = this.props.data;
	    if (this.isEqualData(data, oldData)) {
	      return;
	    }

	    var newState = this.getValueRange(props);
	    newState.start = this.boundValue(state.start, newState.min, newState.max);
	    newState.end = this.boundValue(state.end, newState.min, newState.max);
	    this.setState(newState);
	  }
	};

	module.exports = SetupMixin;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(11);
	var Slider = __webpack_require__(17);
	var CoverageBar = __webpack_require__(20);

	var tinyColor = __webpack_require__(26);

	var ComponentMakerMixin = {
	  makeTicks: function makeTicks(snapGrid) {
	    var y1 = this.barY + this.props.headerBarHeight;
	    var y2 = y1 - this.consts.tickSize;

	    var ticks = [];

	    for (var key in snapGrid) {
	      var x = snapGrid[key].x;

	      ticks.push(React.createElement('line', {
	        key: 'tick' + key,
	        x1: x, y1: y1,
	        x2: x, y2: y2,
	        strokeWidth: '1',
	        stroke: '#A8A8A8' }));
	    }

	    return ticks;
	  },

	  calculateDensityColor: function calculateDensityColor(factor) {
	    var scale = 100 * factor;

	    var fromColor = tinyColor(this.props.densityLowColor);
	    var toColor = tinyColor(this.props.densityHighColor);

	    if (this.props.densityMidColor === null) {
	      return tinyColor.mix(fromColor, toColor, scale).toRgbString();
	    }

	    scale *= 2;

	    switch (scale) {
	      case 0:
	        return tinyColor(this.props.densityLowColor).toRgbString();
	      case 100:
	        return tinyColor(this.props.densityMidColor).toRgbString();
	      case 200:
	        return tinyColor(this.props.densityHighColor).toRgbString();
	    }

	    if (scale > 100) {
	      scale -= 100;
	      fromColor = tinyColor(this.props.densityMidColor);
	      toColor = tinyColor(this.props.densityHighColor);
	    } else {
	      fromColor = tinyColor(this.props.densityLowColor);
	      toColor = tinyColor(this.props.densityMidColor);
	    }

	    return tinyColor.mix(fromColor, toColor, scale).toRgbString();
	  },

	  makeGradient: function makeGradient() {
	    var length = this.state.max - this.state.min;
	    var count = 0;

	    if (length === 0) {
	      return null;
	    }

	    var factor = 1 / length;

	    var gradientInfo = [];

	    this.dataDensity.forEach(function (density, id) {
	      var color = this.calculateDensityColor(density);
	      var midOffset = count / length;
	      var prevOffset = midOffset - factor;
	      var nextOffset = midOffset + factor;

	      var lowerOffset = 100 * Math.max((midOffset + prevOffset) / 2, 0) + '%';
	      var higherOffset = 100 * Math.min((nextOffset + midOffset) / 2, 1) + '%';

	      gradientInfo.push(React.createElement('stop', { key: id + 'l', offset: lowerOffset, stopColor: color }));
	      gradientInfo.push(React.createElement('stop', { key: id + 'h', offset: higherOffset, stopColor: color }));

	      count++;
	    }, this);

	    return React.createElement(
	      'defs',
	      null,
	      React.createElement(
	        'linearGradient',
	        { id: this.consts.gradientId },
	        gradientInfo
	      )
	    );
	  },

	  scrollUpdaterFunc: function scrollUpdaterFunc() {},

	  handleSliderScroll: function handleSliderScroll(deltaY) {
	    this.scrollUpdaterFunc(deltaY);
	  },

	  makeSliders: function makeSliders(snapGrid) {
	    var valueLookup = this.valueLookup;

	    var leftX = valueLookup.byValue[this.state.start];
	    var rightX = valueLookup.byValue[this.state.end + this.props.stepSize];

	    var startSnapGrid = [];
	    var endSnapGrid = [];

	    for (var key in snapGrid) {
	      var snapObject = snapGrid[key];
	      var x = snapObject.x;

	      if (x < rightX) {
	        startSnapGrid.push(snapObject);
	      }
	      if (x > leftX) {
	        endSnapGrid.push(snapObject);
	      }
	    }

	    var stepWidth = this.coverageWidth / this.stepCount;
	    var ghostSize = this.consts.ghostSize;

	    //move the left side over more bcause that's where the content is
	    var startX = snapGrid[0].x - ghostSize;
	    var endX = snapGrid[snapGrid.length - 1].x + stepWidth;

	    var sliders = [];

	    sliders.push(React.createElement(Slider, {
	      key: 'leftSlider',
	      x: leftX,
	      y: this.sliderY,
	      height: this.sliderHeight,
	      handleSize: this.consts.sliderRadius,
	      fontSize: this.consts.textSize,
	      snapGrid: startSnapGrid,
	      valueLookup: valueLookup,
	      startX: startX,
	      endX: rightX,
	      onScroll: this.handleSliderScroll,
	      ghostSize: ghostSize,
	      valueOffset: 0,
	      onDrag: this.onDragRangeStart,
	      onRelease: this.onReleaseRangeStart }));
	    sliders.push(React.createElement(Slider, {
	      key: 'rightSlider',
	      x: rightX,
	      y: this.sliderY,
	      height: this.sliderHeight,
	      handleSize: this.consts.sliderRadius,
	      fontSize: this.consts.textSize,
	      snapGrid: endSnapGrid,
	      valueLookup: valueLookup,
	      startX: leftX,
	      endX: endX,
	      onScroll: this.handleSliderScroll,
	      ghostSize: ghostSize,
	      valueOffset: -this.props.stepSize,
	      onDrag: this.onDragRangeEnd,
	      onRelease: this.onReleaseRangeEnd }));

	    return sliders;
	  },

	  onDragRangeStart: function onDragRangeStart(start) {
	    this.setState({ start: start });
	    this.props.onDragRangeStart(start);
	    this.props.onDrag(start, this.state.end);
	  },

	  onDragRangeEnd: function onDragRangeEnd(end) {
	    this.setState({ end: end });

	    this.props.onDragRangeEnd(end);
	    this.props.onDrag(this.state.start, end);
	  },

	  onReleaseRangeStart: function onReleaseRangeStart(start) {
	    this.setState({ start: start });

	    this.props.onReleaseRangeStart(start);
	    this.props.onRelease(start, this.state.end);
	  },

	  onReleaseRangeEnd: function onReleaseRangeEnd(end) {
	    this.setState({ end: end });

	    this.props.onReleaseRangeEnd(end);
	    this.props.onRelease(this.state.start, end);
	  },

	  makeCoverage: function makeCoverage() {
	    if (!this.needsCoverage) {
	      return [];
	    }

	    var x = this.barX;
	    var startY = 0;

	    var colors = this.makeColors();

	    var previousCategory = null;
	    var yOffset = 0;

	    var coverageBars = [];

	    this.dataMapping.forEach(function (data, id) {
	      var label = data.dataNames[data.dataNames.length - 1] + ''; //enforce string

	      if (data.dataNames.length > 1) {
	        var category = data.dataNames[data.dataNames.length - 2];

	        if (previousCategory !== category) {
	          previousCategory = category;
	          yOffset += this.coverageBarSpacing;
	        }
	      }

	      var y = startY + id * this.coverageBarSpacing + yOffset;

	      var dataPropIndex = this.props.rowLabelProperties.length - 1;
	      var dataProperty = this.props.rowLabelProperties[dataPropIndex];

	      coverageBars.push(React.createElement(CoverageBar, {
	        key: 'coverage' + id,
	        x: x,
	        y: y,
	        width: this.coverageWidth,
	        height: this.coverageBarSpacing,
	        barHeight: this.props.coverageBarHeight,
	        color: colors[id],
	        min: this.state.min,
	        max: this.state.max,
	        coverage: data.coverage,
	        stepSize: this.props.stepSize,
	        textMargin: this.consts.textMargin,
	        coverageLabel: this.props.coverageLabel,
	        coverageLabelProps: this.props.coverageLabelProps,
	        label: label,
	        labelWidth: this.props.labelColumnWidth,
	        dataProperty: dataProperty,
	        charLimit: this.consts.labelCharacterLimit }));

	      var lineY = y; // + this.coverageHeight + this.consts.coverageBarMargin;

	      coverageBars.push(React.createElement('line', {
	        key: 'line' + id,
	        x1: 0, y1: lineY,
	        x2: x, y2: lineY,
	        stroke: '#D7D7D7' }));
	    }, this);

	    return coverageBars;
	  },

	  makeColors: function makeColors() {
	    var colors = ['black', 'gray'];

	    if (!this.needsCoverage) {
	      return colors;
	    }

	    if (this.props.schema && this.props.colors) {
	      colors = this.props.colors;
	    }

	    var dataMapping = this.dataMapping;

	    if (typeof colors === 'string') {
	      return dataMapping.map(function () {
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
	  findColor: function findColor(data) {
	    var colorIndeces = data.colorIndeces;

	    var selectedColor = this.props.colors || ['black', 'gray'];

	    var end = colorIndeces.length - 1;

	    //loop through color indeces, finding the correct color to apply
	    for (var i = 0; i < colorIndeces.length; i++) {
	      var colorIndex = colorIndeces[i];

	      //get the next color according to the color index
	      var newColor = selectedColor[colorIndex % selectedColor.length];

	      //CASE: color list is less deep than data/category list
	      //
	      //(except on the last loop, when we expect a string)
	      //if the new color is a string, instead of sending the new color,
	      //find the selected color from the last index in the indeces.
	      //This will solve the issue of exitting too early
	      if (i < end && typeof newColor === 'string') {
	        return selectedColor[colorIndeces[end] % selectedColor.length];
	      }

	      //assing the selected color  and re-iterate
	      selectedColor = newColor;
	    }

	    //CASE: The color list is deeper than the data/category list
	    //
	    //Get the first color we can find down in the heirarchy
	    while (typeof selectedColor !== 'string') {
	      selectedColor = selectedColor[0];
	    }

	    return selectedColor;
	  },

	  truncateText: function truncateText(text, charLimit) {
	    if (!text || text.length <= charLimit + 3) {
	      // +3 for the dots.
	      return text;
	    }
	    return text.substring(0, charLimit) + '...';
	  },

	  makeCoverageGrouping: function makeCoverageGrouping() {
	    if (!this.needsGrouping) {
	      return [];
	    }

	    var categoryIndex = Math.max(this.props.rowLabelProperties.length - 2, 0);
	    var categoryProperty = this.props.rowLabelProperties[categoryIndex];

	    return this.dataGrouping.map(function (grouping, id) {
	      var startY = (grouping.startIndex + id) * this.coverageBarSpacing;
	      var textY = startY + this.consts.coverageBarMargin / 2 + this.props.coverageBarHeight / 2; // - Math.floor(this.consts.textSize / 2);
	      var textX = this.consts.textMargin;

	      var yAdjust = 5;

	      var separator = id === 0 ? null : React.createElement('line', {
	        x1: 0, y1: startY,
	        x2: this.props.width, y2: startY,
	        strokeWidth: '2',
	        className: 'rf-category-divider',
	        stroke: '#B0B0B0' });

	      var CoverageLabel = this.props.coverageLabel;

	      return React.createElement(
	        'g',
	        { key: 'separator' + id },
	        React.createElement('rect', {
	          x: this.consts.marginLeft, y: startY,
	          width: this.props.width, height: this.coverageBarSpacing,
	          className: 'rf-category-background',
	          fill: '#E2E2E2' }),
	        separator,
	        React.createElement(CoverageLabel, _extends({
	          x: this.consts.marginLeft, y: startY,
	          width: this.props.width, height: this.coverageBarSpacing,
	          labelText: grouping.categoryName,
	          dataProperty: categoryProperty,
	          labelX: textX,
	          labelY: textY + yAdjust,
	          charLimit: this.consts.labelCharacterLimit,
	          className: 'rf-label rf-label-bold rf-category-label'
	        }, this.props.coverageLabelProps))
	      );
	    }, this);
	  },

	  makeGapFillers: function makeGapFillers() {
	    var startX = 0;
	    var startWidth = this.valueLookup.byValue[this.state.start];

	    var endX = this.valueLookup.byValue[this.state.end + this.props.stepSize];
	    var endWidth = this.barX + this.coverageWidth - endX;

	    if (this.needsScrollBar) {
	      endWidth += this.consts.scrollWidth;
	    }

	    var y = this.barBottom;
	    var height = this.consts.coverageGap;

	    var gapFillers = [];

	    gapFillers.push(React.createElement('rect', {
	      key: 'unselectedStart',
	      x: startX, y: y,
	      width: startWidth, height: height,
	      fill: '#B0B0B0',
	      className: 'rf-gap-filler' }));

	    gapFillers.push(React.createElement('rect', {
	      key: 'unselectedEnd',
	      x: endX, y: y,
	      width: endWidth, height: height,
	      fill: '#B0B0B0',
	      className: 'rf-gap-filler' }));

	    return gapFillers;
	  },

	  makeUnselectedOverlay: function makeUnselectedOverlay() {
	    var startX = this.barX;
	    var endX = this.valueLookup.byValue[this.state.end + this.props.stepSize];
	    var y = this.barBottom;

	    var startWidth = this.valueLookup.byValue[this.state.start] - this.barX;
	    var endWidth = this.barX + this.coverageWidth - endX;

	    var height = Math.floor(this.consts.coverageBarMargin / 2) + this.coverageHeight;

	    var unselectedRanges = [];

	    unselectedRanges.push(React.createElement('rect', {
	      key: 'unselectedStart',
	      x: startX, y: y,
	      width: startWidth, height: height,
	      fill: 'black', opacity: '0.5',
	      stroke: 'black', strokeWidth: '1',
	      className: 'rf-unselected' }));

	    unselectedRanges.push(React.createElement('rect', {
	      key: 'unselectedEnd',
	      x: endX, y: y,
	      width: endWidth, height: height,
	      fill: 'black', opacity: '0.5',
	      stroke: 'black', strokeWidth: '1',
	      className: 'rf-unselected' }));

	    return unselectedRanges;
	  }
	};

	module.exports = ComponentMakerMixin;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var PropTypes = __webpack_require__(1);
	var React = __webpack_require__(11);
	var createReactClass = __webpack_require__(12);
	var ReactDOM = __webpack_require__(18);
	var interact = __webpack_require__(19);

	var Slider = createReactClass({
	  displayName: 'Slider',

	  getInitialState: function getInitialState() {
	    var x = this.props.x;

	    return { x: x };
	  },

	  consts: {
	    borderRadius: 4
	  },

	  propTypes: {
	    handleSize: PropTypes.number,
	    height: PropTypes.number,
	    onDrag: PropTypes.func,
	    onRelease: PropTypes.func,
	    onScroll: PropTypes.func,
	    valueOffset: PropTypes.number
	  },

	  componentDidMount: function componentDidMount() {
	    var self = this;

	    interact(ReactDOM.findDOMNode(self)).draggable({
	      snap: {
	        targets: this.props.snapGrid,
	        range: Infinity
	      }
	    }).origin('parent').on('dragmove', function (event) {
	      var x = Math.floor(event.pageX);
	      var value = self.props.valueLookup.byLocation[x] + self.props.valueOffset;

	      self.setState({ x: x });
	      self.props.onDrag(value);
	    }).on('dragend', function (event) {
	      var x = Math.floor(event.pageX);
	      var value = self.props.valueLookup.byLocation[x] + self.props.valueOffset;

	      self.props.onRelease(value);
	    });
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(newProps) {
	    if (this.props.x !== newProps.x) {
	      this.setState({ x: newProps.x });
	    }
	  },

	  componentDidUpdate: function componentDidUpdate() {
	    var self = this;

	    interact(ReactDOM.findDOMNode(self)).draggable({
	      snap: {
	        targets: self.props.snapGrid,
	        range: Infinity
	      }
	    });
	  },

	  restrictToGrid: function restrictToGrid(midX, width) {
	    var thisLeft = midX - width / 2;
	    var thisRight = thisLeft + width;

	    var startX = this.props.startX;
	    var endX = this.props.endX;

	    var startRight = startX + width / 2;
	    var endLeft = endX - width / 2;

	    var startOverlapAdjust = Math.max(startRight - thisLeft, 0) / 2;
	    var endOverlapAdjust = Math.max(thisRight - endLeft, 0) / 2;

	    return thisLeft + startOverlapAdjust - endOverlapAdjust;
	  },

	  makeLabel: function makeLabel(x, y) {
	    if (this.props.valueLookup.isEndPoint[x]) {
	      return null;
	    }

	    var tailOffsetY = -12;

	    var pointWidth = 16;
	    var pointHeight = 10;

	    var bgWidth = 48;
	    var bgHeight = 25;
	    var bgX = this.restrictToGrid(x, bgWidth);
	    var bgY = y - bgHeight - pointHeight + tailOffsetY;

	    var textX = bgX + bgWidth / 2;
	    var textY = bgY + bgHeight * 0.65;

	    var midX = x;
	    var leftX = Math.max(x - pointWidth / 2, bgX);
	    var rightX = Math.min(x + pointWidth / 2, bgX + bgWidth);

	    var baseY = bgY + bgHeight;
	    var bottomY = baseY + pointHeight;
	    var topY = baseY - this.consts.borderRadius;

	    var points = rightX + ',' + topY + ' ' + rightX + ',' + baseY + ' ' + midX + ',' + bottomY + ' ' + leftX + ',' + baseY + ' ' + leftX + ',' + topY;

	    var value = this.props.valueLookup.byLocation[x] + this.props.valueOffset;

	    return React.createElement(
	      'g',
	      { className: 'rf-value-indicator' },
	      React.createElement('polyline', {
	        fill: 'white',
	        points: points,
	        className: 'rf-value-indicator-balloon' }),
	      React.createElement('rect', {
	        x: bgX, y: bgY,
	        rx: this.consts.borderRadius, ry: this.consts.borderRadius,
	        width: bgWidth, height: bgHeight,
	        fill: 'white',
	        className: 'rf-value-indicator-balloon' }),
	      React.createElement(
	        'text',
	        {
	          x: textX, y: textY,
	          textAnchor: 'middle',
	          fontSize: this.props.fontSize,
	          fill: 'red',
	          className: 'rf-label rf-value-indicator-label' },
	        value
	      )
	    );
	  },

	  onTouchStart: function onTouchStart(event) {
	    var initialTouch = event.targetTouches[0];

	    this.touchY = initialTouch.pageY;
	  },

	  onTouchMove: function onTouchMove(event) {
	    var newTouch = event.targetTouches[0];

	    this.props.onScroll(this.touchY - newTouch.pageY);

	    this.touchY = newTouch.pageY;

	    event.preventDefault();
	    event.returnValue = false;
	  },

	  onWheel: function onWheel(event) {
	    this.props.onScroll(event.deltaY);
	    event.preventDefault();
	    event.returnValue = false;
	  },

	  render: function render() {
	    var x = this.state.x;
	    var y = this.props.y;
	    var height = this.props.height;
	    var handleSize = this.props.handleSize;

	    var handleY = y;

	    var ghostSize = this.props.ghostSize;

	    var ghostX = this.restrictToGrid(x, ghostSize * 2) + ghostSize;
	    var ghostOpacity = 0;

	    var label = this.makeLabel(x, handleY);

	    return React.createElement(
	      'g',
	      { className: 'rf-slider\' draggable=\'true',
	        onWheel: this.onWheel,
	        onTouchStart: this.onTouchStart,
	        onTouchMove: this.onTouchMove },
	      React.createElement('line', {
	        x1: x, y1: y,
	        x2: x, y2: y + height,
	        strokeWidth: '2',
	        stroke: 'black',
	        className: 'rf-slider-bar' }),
	      React.createElement('circle', {
	        cx: x, cy: handleY,
	        r: handleSize,
	        strokeWidth: '2',
	        stroke: '#376893',
	        fill: 'white',
	        ref: 'topSlider',
	        className: 'rf-slider-handle' }),
	      React.createElement('circle', {
	        cx: x, cy: handleY + height,
	        r: handleSize,
	        strokeWidth: '2',
	        stroke: '#376893',
	        fill: 'white',
	        className: 'rf-slider-handle' }),
	      label,
	      React.createElement('circle', {
	        cx: ghostX, cy: handleY,
	        r: ghostSize,
	        opacity: ghostOpacity }),
	      React.createElement('circle', {
	        cx: ghostX, cy: handleY + height,
	        r: ghostSize,
	        opacity: ghostOpacity }),
	      React.createElement('rect', {
	        x: ghostX - ghostSize, y: handleY,
	        width: ghostSize * 2, height: height,
	        opacity: ghostOpacity })
	    );
	  }
	});

	module.exports = Slider;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_18__;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_19__;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var PropTypes = __webpack_require__(1);
	var createReactClass = __webpack_require__(12);
	var React = __webpack_require__(11);
	var Opentip = __webpack_require__(21);

	__webpack_require__(22);

	Opentip.styles.close = {
	  extends: 'standard',
	  offset: [-3, -3],
	  borderRadius: 2,
	  borderColor: '#333333',
	  background: '#333333',
	  className: 'rf-tooltip'
	};

	Opentip.defaultStyle = 'close';

	var CoverageBar = createReactClass({
	  displayName: 'CoverageBar',

	  getInitialState: function getInitialState() {
	    return {};
	  },

	  propTypes: {
	    charLimit: PropTypes.number,
	    color: PropTypes.string,
	    coverage: PropTypes.arrayOf(PropTypes.shape({
	      start: PropTypes.number,
	      end: PropTypes.number
	    })).isRequired,
	    coverageLabelProps: PropTypes.object,
	    dataProperty: PropTypes.string,
	    height: PropTypes.number,
	    label: PropTypes.string,
	    labelWidth: PropTypes.number,
	    max: PropTypes.number.isRequired,
	    min: PropTypes.number.isRequired,
	    openTipOptions: PropTypes.object,
	    textMargin: PropTypes.number,
	    tooltip: PropTypes.string,
	    width: PropTypes.number.isRequired,
	    x: PropTypes.number.isRequired,
	    y: PropTypes.number.isRequired
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      height: 5,
	      textMargin: 20,
	      color: 'black',
	      openTipOptions: { delay: 0, hideDelay: 0, showEffectDuration: 0, hideEffectDuration: 0, tipJoint: 'top left', stem: false, offset: [3, 10] }
	    };
	  },

	  makeCoverageBar: function makeCoverageBar(barStart, barEnd, id) {
	    var tooltip = barStart + ' to ' + barEnd;

	    var start = this.props.min;
	    var end = this.props.max + this.props.stepSize;
	    var width = this.props.width;

	    barEnd += this.props.stepSize;

	    var range = end - start;
	    var barRange = barEnd - barStart;
	    var barOffset = barStart - start;

	    var barWidth = width * barRange / range;
	    var barX = this.props.x + width * barOffset / range;

	    barWidth = Math.max(barWidth, 1);

	    var y = this.props.y + (this.props.height - this.props.barHeight) / 2;

	    return React.createElement('rect', {
	      key: 'coverageBar' + id,
	      x: barX,
	      y: y,
	      width: barWidth,
	      height: this.props.barHeight,
	      fill: this.props.color,
	      ref: this.createTooltip.bind(this, tooltip),
	      className: 'rf-coverage-bar' });
	  },

	  createTooltip: function createTooltip(tooltip, component) {
	    if (component === null) {
	      return;
	    }

	    if (component.tooltip) {
	      return;
	    }

	    component.tooltip = new Opentip(component, tooltip, this.props.openTipOptions);
	  },

	  render: function render() {
	    var dataDensity = 0;

	    var bars = this.props.coverage.map(function (item, id) {
	      dataDensity += item.end - item.start + 1;
	      return this.makeCoverageBar(item.start, item.end, id);
	    }, this);

	    dataDensity /= this.props.max - this.props.min + 1;

	    var x1 = this.props.x;
	    var x2 = this.props.x + this.props.width;

	    var y = this.props.y + this.props.height / 2;
	    var textYAdjust = 5;

	    var CoverageLabel = this.props.coverageLabel;

	    return React.createElement(
	      'g',
	      { className: 'rf-coverage' },
	      React.createElement('line', {
	        x1: x1, y1: y,
	        x2: x2, y2: y,
	        strokeWidth: '1',
	        stroke: this.props.color,
	        strokeDasharray: '5, 5',
	        className: 'rf-coverage-line' }),
	      bars,
	      React.createElement(CoverageLabel, _extends({
	        coveragePercentage: Math.floor(dataDensity * 100),
	        x: this.props.x, y: this.props.y,
	        width: this.props.labelWidth, height: this.props.height,
	        labelText: this.props.label,
	        dataProperty: this.props.dataProperty,
	        labelX: this.props.textMargin,
	        labelY: y + textYAdjust,
	        charLimit: this.props.charLimit,
	        className: 'rf-label rf-coverage-label'
	      }, this.props.coverageLabelProps))
	    );
	  }
	});

	module.exports = CoverageBar;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_21__;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(23);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(25)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../css-loader/index.js!../../sass-loader/index.js?outputStyle=expanded&includePaths[]=/Users/andrewblowe/Projects/usaid/react-range-finder/node_modules!./opentip.css", function() {
				var newContent = require("!!../../css-loader/index.js!../../sass-loader/index.js?outputStyle=expanded&includePaths[]=/Users/andrewblowe/Projects/usaid/react-range-finder/node_modules!./opentip.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(24)();
	// imports


	// module
	exports.push([module.id, ".opentip-container,\n.opentip-container * {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n.opentip-container {\n  position: absolute;\n  max-width: 300px;\n  z-index: 100;\n  -webkit-transition: -webkit-transform 1s ease-in-out;\n  -moz-transition: -moz-transform 1s ease-in-out;\n  -o-transition: -o-transform 1s ease-in-out;\n  -ms-transition: -ms-transform 1s ease-in-out;\n  transition: transform 1s ease-in-out;\n  pointer-events: none;\n  -webkit-transform: translateX(0) translateY(0);\n  -moz-transform: translateX(0) translateY(0);\n  -o-transform: translateX(0) translateY(0);\n  -ms-transform: translateX(0) translateY(0);\n  transform: translateX(0) translateY(0);\n}\n\n.opentip-container.ot-fixed.ot-hidden.stem-top.stem-center,\n.opentip-container.ot-fixed.ot-going-to-show.stem-top.stem-center,\n.opentip-container.ot-fixed.ot-hiding.stem-top.stem-center {\n  -webkit-transform: translateY(-5px);\n  -moz-transform: translateY(-5px);\n  -o-transform: translateY(-5px);\n  -ms-transform: translateY(-5px);\n  transform: translateY(-5px);\n}\n\n.opentip-container.ot-fixed.ot-hidden.stem-top.stem-right,\n.opentip-container.ot-fixed.ot-going-to-show.stem-top.stem-right,\n.opentip-container.ot-fixed.ot-hiding.stem-top.stem-right {\n  -webkit-transform: translateY(-5px) translateX(5px);\n  -moz-transform: translateY(-5px) translateX(5px);\n  -o-transform: translateY(-5px) translateX(5px);\n  -ms-transform: translateY(-5px) translateX(5px);\n  transform: translateY(-5px) translateX(5px);\n}\n\n.opentip-container.ot-fixed.ot-hidden.stem-middle.stem-right,\n.opentip-container.ot-fixed.ot-going-to-show.stem-middle.stem-right,\n.opentip-container.ot-fixed.ot-hiding.stem-middle.stem-right {\n  -webkit-transform: translateX(5px);\n  -moz-transform: translateX(5px);\n  -o-transform: translateX(5px);\n  -ms-transform: translateX(5px);\n  transform: translateX(5px);\n}\n\n.opentip-container.ot-fixed.ot-hidden.stem-bottom.stem-right,\n.opentip-container.ot-fixed.ot-going-to-show.stem-bottom.stem-right,\n.opentip-container.ot-fixed.ot-hiding.stem-bottom.stem-right {\n  -webkit-transform: translateY(5px) translateX(5px);\n  -moz-transform: translateY(5px) translateX(5px);\n  -o-transform: translateY(5px) translateX(5px);\n  -ms-transform: translateY(5px) translateX(5px);\n  transform: translateY(5px) translateX(5px);\n}\n\n.opentip-container.ot-fixed.ot-hidden.stem-bottom.stem-center,\n.opentip-container.ot-fixed.ot-going-to-show.stem-bottom.stem-center,\n.opentip-container.ot-fixed.ot-hiding.stem-bottom.stem-center {\n  -webkit-transform: translateY(5px);\n  -moz-transform: translateY(5px);\n  -o-transform: translateY(5px);\n  -ms-transform: translateY(5px);\n  transform: translateY(5px);\n}\n\n.opentip-container.ot-fixed.ot-hidden.stem-bottom.stem-left,\n.opentip-container.ot-fixed.ot-going-to-show.stem-bottom.stem-left,\n.opentip-container.ot-fixed.ot-hiding.stem-bottom.stem-left {\n  -webkit-transform: translateY(5px) translateX(-5px);\n  -moz-transform: translateY(5px) translateX(-5px);\n  -o-transform: translateY(5px) translateX(-5px);\n  -ms-transform: translateY(5px) translateX(-5px);\n  transform: translateY(5px) translateX(-5px);\n}\n\n.opentip-container.ot-fixed.ot-hidden.stem-middle.stem-left,\n.opentip-container.ot-fixed.ot-going-to-show.stem-middle.stem-left,\n.opentip-container.ot-fixed.ot-hiding.stem-middle.stem-left {\n  -webkit-transform: translateX(-5px);\n  -moz-transform: translateX(-5px);\n  -o-transform: translateX(-5px);\n  -ms-transform: translateX(-5px);\n  transform: translateX(-5px);\n}\n\n.opentip-container.ot-fixed.ot-hidden.stem-top.stem-left,\n.opentip-container.ot-fixed.ot-going-to-show.stem-top.stem-left,\n.opentip-container.ot-fixed.ot-hiding.stem-top.stem-left {\n  -webkit-transform: translateY(-5px) translateX(-5px);\n  -moz-transform: translateY(-5px) translateX(-5px);\n  -o-transform: translateY(-5px) translateX(-5px);\n  -ms-transform: translateY(-5px) translateX(-5px);\n  transform: translateY(-5px) translateX(-5px);\n}\n\n.opentip-container.ot-fixed .opentip {\n  pointer-events: auto;\n}\n\n.opentip-container.ot-hidden {\n  display: none;\n}\n\n.opentip-container .opentip {\n  position: relative;\n  font-size: 13px;\n  line-height: 120%;\n  padding: 9px 14px;\n  color: #4f4b47;\n  text-shadow: -1px -1px 0px rgba(255, 255, 255, 0.2);\n}\n\n.opentip-container .opentip .header {\n  margin: 0;\n  padding: 0;\n}\n\n.opentip-container .opentip .ot-close {\n  pointer-events: auto;\n  display: block;\n  position: absolute;\n  top: -12px;\n  left: 60px;\n  color: rgba(0, 0, 0, 0.5);\n  background: transparent;\n  text-decoration: none;\n}\n\n.opentip-container .opentip .ot-close span {\n  display: none;\n}\n\n.opentip-container .opentip .ot-loading-indicator {\n  display: none;\n}\n\n.opentip-container.ot-loading .ot-loading-indicator {\n  width: 30px;\n  height: 30px;\n  font-size: 30px;\n  line-height: 30px;\n  font-weight: bold;\n  display: block;\n}\n\n.opentip-container.ot-loading .ot-loading-indicator span {\n  display: block;\n  -webkit-animation: otloading 2s linear infinite;\n  -moz-animation: otloading 2s linear infinite;\n  -o-animation: otloading 2s linear infinite;\n  -ms-animation: otloading 2s linear infinite;\n  animation: otloading 2s linear infinite;\n  text-align: center;\n}\n\n.opentip-container.style-dark .opentip,\n.opentip-container.style-alert .opentip {\n  color: #f8f8f8;\n  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.2);\n}\n\n.opentip-container.style-glass .opentip {\n  padding: 15px 25px;\n  color: #317cc5;\n  text-shadow: 1px 1px 8px rgba(0, 94, 153, 0.3);\n}\n\n.opentip-container.ot-hide-effect-fade {\n  -webkit-transition: -webkit-transform 0.5s ease-in-out, opacity 1s ease-in-out;\n  -moz-transition: -moz-transform 0.5s ease-in-out, opacity 1s ease-in-out;\n  -o-transition: -o-transform 0.5s ease-in-out, opacity 1s ease-in-out;\n  -ms-transition: -ms-transform 0.5s ease-in-out, opacity 1s ease-in-out;\n  transition: transform 0.5s ease-in-out, opacity 1s ease-in-out;\n  opacity: 1;\n  -ms-filter: none;\n  filter: none;\n}\n\n.opentip-container.ot-hide-effect-fade.ot-hiding {\n  opacity: 0;\n  filter: alpha(opacity=0);\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";\n}\n\n.opentip-container.ot-show-effect-appear.ot-going-to-show,\n.opentip-container.ot-show-effect-appear.ot-showing {\n  -webkit-transition: -webkit-transform 0.5s ease-in-out, opacity 1s ease-in-out;\n  -moz-transition: -moz-transform 0.5s ease-in-out, opacity 1s ease-in-out;\n  -o-transition: -o-transform 0.5s ease-in-out, opacity 1s ease-in-out;\n  -ms-transition: -ms-transform 0.5s ease-in-out, opacity 1s ease-in-out;\n  transition: transform 0.5s ease-in-out, opacity 1s ease-in-out;\n}\n\n.opentip-container.ot-show-effect-appear.ot-going-to-show {\n  opacity: 0;\n  filter: alpha(opacity=0);\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";\n}\n\n.opentip-container.ot-show-effect-appear.ot-showing {\n  opacity: 1;\n  -ms-filter: none;\n  filter: none;\n}\n\n.opentip-container.ot-show-effect-appear.ot-visible {\n  opacity: 1;\n  -ms-filter: none;\n  filter: none;\n}\n\n@-moz-keyframes otloading {\n  0% {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@-webkit-keyframes otloading {\n  0% {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@-o-keyframes otloading {\n  0% {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@-ms-keyframes otloading {\n  0% {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes otloading {\n  0% {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n", ""]);

	// exports


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 26 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_26__;

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	"use strict";

	var PropertyCalculatorMixin = {
	  //The full height of the entire component
	  calcFullComponentHeight: function calcFullComponentHeight(props) {
	    return props.height;
	  },

	  //the full width of the entire component
	  calcFullComponentWidth: function calcFullComponentWidth(props) {
	    return props.width;
	  },

	  //The height of the visible parts of the component
	  calcComponentHeight: function calcComponentHeight(props) {
	    return this.calcFullComponentHeight(props) - this.consts.marginTop - this.consts.marginBottom;
	  },

	  //the width of the visible parts of the component
	  calcComponentWidth: function calcComponentWidth(props) {
	    var width = this.calcFullComponentWidth(props) - this.consts.marginLeft - this.consts.marginRight;

	    return Math.max(width, 0);
	  },

	  calcCoverageWidth: function calcCoverageWidth(props, state) {
	    var width = this.calcComponentWidth(props, state) - this.calcScrollBarWidth(props, state) - this.props.labelColumnWidth;

	    return Math.max(width, 0);
	  },

	  calcCoverageHeight: function calcCoverageHeight(props, state) {
	    return Math.min(this.calcAllocatedHeight(props, state), this.calcFullCoverageHeight(props, state));
	  },

	  //The full height of the coverage bars
	  calcFullCoverageHeight: function calcFullCoverageHeight(props, state) {
	    return (this.calcCoverageBarCount(props, state) + this.calcCoverageGroupingCount()) * (props.coverageBarHeight + this.consts.coverageBarMargin);
	  },

	  //the starting Y position of the sliders
	  calcSliderY: function calcSliderY(props, state) {
	    return this.calcBarBottom(props, state) + this.consts.coverageGap / 2;
	  },

	  //the height of each slider
	  calcSliderHeight: function calcSliderHeight(props, state) {
	    var coverageHeight = this.calcCoverageHeight(props, state);

	    if (coverageHeight === 0) {
	      return 0;
	    }

	    return coverageHeight + this.consts.coverageGap / 2;
	  },

	  //The total space a coverage bar represents (bar and margin)
	  calcCoverageBarSpacing: function calcCoverageBarSpacing(props) {
	    return props.coverageBarHeight + this.consts.coverageBarMargin;
	  },

	  calcStepCount: function calcStepCount(props, state) {
	    //+1 due to start/end not being able to overlap
	    return (state.max - state.min) / props.stepSize + 1;
	  },

	  calcBarBottom: function calcBarBottom(props) {
	    return this.consts.marginTop + props.headerBarHeight;
	  },

	  calcAllocatedHeight: function calcAllocatedHeight(props) {
	    var height = props.height - this.consts.marginTop - props.headerBarHeight - this.consts.coverageBarMargin / 2 - this.consts.marginBottom;

	    return Math.max(height, 0);
	  },

	  calcNeedsScrollBar: function calcNeedsScrollBar(props, state) {
	    return this.calcFullCoverageHeight(props, state) > this.calcAllocatedHeight(props, state);
	  },

	  calcScrollBarWidth: function calcScrollBarWidth(props, state) {
	    return this.calcNeedsScrollBar(props, state) ? this.consts.scrollWidth : 0;
	  },

	  calcNeedsCoverage: function calcNeedsCoverage() {
	    return this.dataMapping && this.dataMapping.length > 0;
	  },

	  calcNeedsGrouping: function calcNeedsGrouping() {
	    return this.dataGrouping && this.dataGrouping.length > 0;
	  },

	  calcCoverageBarCount: function calcCoverageBarCount() {
	    if (!this.dataMapping) {
	      return 0;
	    }

	    return this.dataMapping.length;
	  },

	  calcCoverageGroupingCount: function calcCoverageGroupingCount() {
	    if (!this.dataGrouping) {
	      return 0;
	    }

	    return this.dataGrouping.length;
	  },

	  makeSnapGrid: function makeSnapGrid(props, state) {
	    var start = state.min;

	    var stepCount = this.calcStepCount(props, state);
	    var coverageWidth = this.calcCoverageWidth(props, state);

	    var stepWidth = coverageWidth / stepCount;

	    var snapTargets = [];

	    for (var i = 0; i <= stepCount; i++) {
	      var x = Math.floor(props.labelColumnWidth + i * stepWidth);
	      var value = start + i * props.stepSize;

	      snapTargets.push({ x: x, value: value, isEndPoint: i === 0 || i === stepCount });
	    }

	    return snapTargets;
	  },

	  makeValueLookup: function makeValueLookup(props, state) {
	    var snapGrid = this.makeSnapGrid(props, state);

	    var valueLookup = {};
	    valueLookup.byValue = {};
	    valueLookup.byLocation = {};
	    valueLookup.isEndPoint = {};

	    for (var key in snapGrid) {
	      var xLocation = snapGrid[key].x;
	      var value = snapGrid[key].value;

	      valueLookup.byValue[value] = xLocation;
	      valueLookup.byLocation[xLocation] = value;
	      valueLookup.isEndPoint[xLocation] = snapGrid[key].isEndPoint;
	    }

	    return valueLookup;
	  },

	  updateCalculations: function updateCalculations(props, state) {
	    this.fullComponentHeight = this.calcFullComponentHeight(props, state);
	    this.fullComponentWidth = this.calcFullComponentWidth(props, state);
	    this.componentHeight = this.calcComponentHeight(props, state);
	    this.componentWidth = this.calcComponentWidth(props, state);
	    this.coverageWidth = this.calcCoverageWidth(props, state);
	    this.coverageHeight = this.calcCoverageHeight(props, state);
	    this.fullCoverageHeight = this.calcFullCoverageHeight(props, state);
	    this.sliderY = this.calcSliderY(props, state);
	    this.sliderHeight = this.calcSliderHeight(props, state);
	    this.coverageBarSpacing = this.calcCoverageBarSpacing(props, state);
	    this.stepCount = this.calcStepCount(props, state);
	    this.barBottom = this.calcBarBottom(props, state);
	    this.needsScrollBar = this.calcNeedsScrollBar(props, state);
	    this.needsCoverage = this.calcNeedsCoverage(props, state);
	    this.needsGrouping = this.calcNeedsGrouping(props, state);

	    this.snapGrid = this.makeSnapGrid(props, state);
	    this.valueLookup = this.makeValueLookup(props, state);
	  },

	  componentWillUpdate: function componentWillUpdate(props, state) {
	    this.updateCalculations(props, state);
	  },

	  componentWillMount: function componentWillMount() {
	    this.updateCalculations(this.props, this.state);
	  }
	};

	module.exports = PropertyCalculatorMixin;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var PropTypes = __webpack_require__(1);
	var React = __webpack_require__(11);
	var createReactClass = __webpack_require__(12);
	var interact = __webpack_require__(19);

	var ScrollableSVG = createReactClass({
	  displayName: 'ScrollableSVG',

	  getInitialState: function getInitialState() {
	    return { offsetY: 0 };
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      setScrollUpdater: function setScrollUpdater() {},
	      x: 0,
	      y: 0
	    };
	  },

	  consts: {
	    scrollBarPadding: 2,
	    gradientId: 'scrollBarGradient'
	  },

	  propTypes: {
	    height: PropTypes.number.isRequired,
	    maxDisplayedHeight: PropTypes.number.isRequired,
	    scrollWidth: PropTypes.number.isRequired,
	    setScrollUpdater: PropTypes.func,
	    width: PropTypes.number.isRequired,
	    x: PropTypes.number,
	    y: PropTypes.number
	  },

	  componentWillMount: function componentWillMount() {
	    this.props.setScrollUpdater(this.scrollElement);
	  },

	  componentDidMount: function componentDidMount() {
	    this.setInteraction();
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(newProps) {
	    var curChildren = this.props.children;
	    var newChildren = newProps.children;

	    if (React.Children.count(curChildren) !== React.Children.count(newChildren)) {
	      this.setState({ offsetY: 0 });
	    }
	  },

	  setInteraction: function setInteraction() {
	    if (this.props.height <= this.props.maxDisplayedHeight) {
	      return;
	    }

	    var self = this;

	    interact(this.refs.scrollBar).draggable({
	      restrict: {
	        restriction: self.refs.scrollArea
	      }
	    }).on('dragmove', function (event) {
	      var scrollAreaHeight = self.props.maxDisplayedHeight - 2 * self.consts.scrollBarPadding;

	      var scrollFactor = self.props.height / scrollAreaHeight;

	      self.scrollElement(scrollFactor * event.dy);
	    });
	  },

	  makeViewBox: function makeViewBox() {
	    var height = this.props.maxDisplayedHeight < this.props.height ? this.props.maxDisplayedHeight : this.props.height;

	    return '0 ' + this.state.offsetY + ' ' + this.props.width + ' ' + height;
	  },

	  makeTriangle: function makeTriangle(x, y, width, height, direction) {
	    var pointY = y + height * (direction === 'up' ? 0.25 : 0.75);
	    var baseY = y + height * (direction === 'up' ? 0.75 : 0.25);

	    var leftBaseX = x + width * 0.25;
	    var pointX = x + width * 0.5;
	    var rightBaseX = x + width * 0.75;

	    var points = leftBaseX + ',' + baseY + ' ' + pointX + ',' + pointY + ' ' + rightBaseX + ',' + baseY + ' ';

	    return React.createElement('polyline', {
	      fill: 'black',
	      stroke: 'black',
	      strokeWidth: '1',
	      opacity: '0.8',
	      points: points,
	      className: 'rf-scroll-arrow' });
	  },

	  onTouchStart: function onTouchStart(event) {
	    var initialTouch = event.targetTouches[0];

	    this.touchY = initialTouch.pageY;
	  },

	  onTouchMove: function onTouchMove(event) {
	    var newTouch = event.targetTouches[0];

	    this.scrollElement(this.touchY - newTouch.pageY);

	    this.touchY = newTouch.pageY;

	    event.preventDefault();
	  },

	  onWheel: function onWheel(event) {
	    this.scrollElement(event.deltaY);
	    event.preventDefault();
	  },

	  scrollElement: function scrollElement(deltaY) {
	    var newOffset = this.state.offsetY + deltaY;

	    newOffset = Math.min(newOffset, this.props.height - this.props.maxDisplayedHeight);
	    newOffset = Math.max(newOffset, 0);

	    this.setState({ offsetY: newOffset });
	  },

	  render: function render() {
	    if (this.props.maxDisplayedHeight >= this.props.height) {
	      return React.createElement(
	        'svg',
	        {
	          x: this.props.x, y: this.props.y,
	          width: this.props.width, height: this.props.height,
	          className: this.props.className },
	        this.props.children
	      );
	    }

	    var actualWidth = this.props.width;
	    var actualHeight = this.props.maxDisplayedHeight;

	    var scrollAreaX = this.props.width - this.props.scrollWidth;
	    var scrollAreaWidth = this.props.scrollWidth;

	    var scrollBarX = scrollAreaX + this.consts.scrollBarPadding;
	    var scrollBarWidth = scrollAreaWidth - 2 * this.consts.scrollBarPadding;

	    var scrollAreaY = this.props.y;
	    var scrollAreaHeight = this.props.maxDisplayedHeight;

	    var scrollBarHeight = (scrollAreaHeight - 2 * this.consts.scrollBarPadding) * this.props.maxDisplayedHeight / this.props.height;

	    var effectiveBarArea = scrollAreaHeight - scrollBarHeight - 2 * this.consts.scrollBarPadding;
	    var effectiveOffsetMax = this.props.height - this.props.maxDisplayedHeight;

	    var scrollBarY = scrollAreaY + this.consts.scrollBarPadding + this.state.offsetY / effectiveOffsetMax * effectiveBarArea;

	    return React.createElement(
	      'g',
	      { className: this.props.className },
	      React.createElement(
	        'svg',
	        {
	          x: this.props.x, y: this.props.y,
	          width: actualWidth, height: actualHeight,
	          viewBox: this.makeViewBox(),
	          onWheel: this.onWheel,
	          onTouchStart: this.onTouchStart,
	          onTouchMove: this.onTouchMove },
	        React.createElement('rect', { //Fixes mouse wheel scrolling on blank parts
	          x: 0, y: 0,
	          width: actualWidth, height: this.props.height,
	          opacity: '0' }),
	        this.props.children
	      ),
	      React.createElement(
	        'defs',
	        null,
	        React.createElement(
	          'linearGradient',
	          { id: this.consts.gradientId },
	          React.createElement('stop', { offset: '0%', stopColor: '#CFCFCF' }),
	          React.createElement('stop', { offset: '10%', stopColor: 'white' }),
	          React.createElement('stop', { offset: '90%', stopColor: 'white' }),
	          React.createElement('stop', { offset: '100%', stopColor: '#CFCFCF' })
	        )
	      ),
	      React.createElement('rect', { ref: 'scrollArea',
	        x: scrollAreaX, y: scrollAreaY,
	        width: scrollAreaWidth, height: scrollAreaHeight,
	        fill: 'url(#' + this.consts.gradientId + ')',
	        className: 'rf-scroll-area' }),
	      React.createElement('rect', { ref: 'scrollBar',
	        x: scrollBarX, y: scrollBarY,
	        width: scrollBarWidth, height: scrollBarHeight,
	        rx: scrollBarWidth / 2, ry: scrollBarWidth / 2,
	        fill: '#989898',
	        className: 'rf-scroll-bar' })
	    );
	  }
	});

	module.exports = ScrollableSVG;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var PropTypes = __webpack_require__(1);
	var createReactClass = __webpack_require__(12);
	var React = __webpack_require__(11);

	var DefaultCoverageLabel = createReactClass({
	  displayName: 'DefaultCoverageLabel',

	  propTypes: {
	    x: PropTypes.number.isRequired,
	    y: PropTypes.number.isRequired,
	    width: PropTypes.number.isRequired,
	    height: PropTypes.number.isRequired,
	    labelText: PropTypes.string.isRequired,
	    dataProperty: PropTypes.string.isRequired,
	    tooltip: PropTypes.string,

	    //These props are suggested, mostly
	    labelX: PropTypes.number.isRequired,
	    labelY: PropTypes.number.isRequired,
	    charLimit: PropTypes.number.isRequired
	  },

	  truncateText: function truncateText(text, charLimit) {
	    if (!text || text.length <= charLimit + 3) {
	      // +3 for the dots.
	      return text;
	    }
	    return text.substring(0, charLimit) + '...';
	  },

	  render: function render() {
	    var label = this.truncateText(this.props.labelText, this.props.charLimit);

	    return React.createElement(
	      'text',
	      {
	        className: this.props.className,
	        x: this.props.labelX,
	        y: this.props.labelY,
	        'data-tip': this.props.tooltip },
	      label
	    );
	  }
	});

	module.exports = DefaultCoverageLabel;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(31);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(25)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js?outputStyle=expanded&includePaths[]=/Users/andrewblowe/Projects/usaid/react-range-finder/node_modules!./react-range-finder.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js?outputStyle=expanded&includePaths[]=/Users/andrewblowe/Projects/usaid/react-range-finder/node_modules!./react-range-finder.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(24)();
	// imports


	// module
	exports.push([module.id, ".rf-unselected {\n  pointer-events: none;\n}\n\n.rf-label {\n  font-family: Helvetica;\n}\n\n.rf-label-bold {\n  font-family: Helvetica-bold;\n}\n\n.rf-title-label {\n  fill: #273441;\n  font-size: 18px;\n}\n\n.rf-density-label {\n  fill: #366894;\n  font-size: 15px;\n}\n\n.rf-value-label {\n  fill: #8c8d8c;\n  font-size: 13px;\n}\n\n.rf-category-label {\n  fill: #366894;\n  font-size: 14px;\n}\n\n.rf-coverage-label {\n  fill: #273441;\n  font-size: 13px;\n}\n\n.rf-footnotes {\n  fill: #273441;\n  font-size: 12px;\n}\n\n.rf-value-indicator-label {\n  fill: red;\n  font-size: 13px;\n}\n\n.opentip-container.style-rf-tooltip .opentip {\n  font-size: 13px;\n  color: white;\n}\n", ""]);

	// exports


/***/ })
/******/ ])
});
;