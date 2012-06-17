(function() {
  // a require implementation doesn't already exist
  if (!this.require) {
    var root = this;
    var modules = {};
    this.require = function(module_name) {
      if (!modules.hasOwnProperty(module_name)) throw "required module missing: " + module_name;
      if (!modules[module_name].exports) {
        modules[module_name].exports = {};
        modules[module_name].loader.call(root, modules[module_name].exports, this.require, modules[module_name]);
      }
      return modules[module_name].exports;
    };
    this.require.define = function(obj) {
      for (var module_name in obj) {
        modules[module_name] = {loader: obj[module_name]};
      };
    };
  }
this.require.define({
  'underscore': function(exports, require, module) {
//     Underscore.js 1.3.3
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.3.3';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    if (obj.length === +obj.length) results.length = obj.length;
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      rand = Math.floor(Math.random() * (index + 1));
      shuffled[index] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, val, context) {
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      if (a === void 0) return 1;
      if (b === void 0) return -1;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    var result = {};
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj)                                     return [];
    if (_.isArray(obj))                           return slice.call(obj);
    if (_.isArguments(obj))                       return slice.call(obj);
    if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.isArray(obj) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var results = [];
    // The `isSorted` flag is irrelevant if the array only contains two elements.
    if (array.length < 3) isSorted = true;
    _.reduce(initial, function (memo, value, index) {
      if (isSorted ? _.last(memo) !== value || !memo.length : !_.include(memo, value)) {
        memo.push(value);
        results.push(array[index]);
      }
      return memo;
    }, []);
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = _.flatten(slice.call(arguments, 1), true);
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        result = func.apply(context, args);
      }
      whenDone();
      throttling = true;
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      if (immediate && !timeout) func.apply(context, args);
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var result = {};
    each(_.flatten(slice.call(arguments, 1)), function(key) {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return toString.call(obj) == '[object Arguments]';
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Is a given value a function?
  _.isFunction = function(obj) {
    return toString.call(obj) == '[object Function]';
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return toString.call(obj) == '[object String]';
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return _.isNumber(obj) && isFinite(obj);
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Has own property?
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    '\\': '\\',
    "'": "'",
    'r': '\r',
    'n': '\n',
    't': '\t',
    'u2028': '\u2028',
    'u2029': '\u2029'
  };

  for (var p in escapes) escapes[escapes[p]] = p;
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(unescaper, function(match, escape) {
      return escapes[escape];
    });
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    settings = _.defaults(settings || {}, _.templateSettings);

    // Compile the template source, taking care to escape characters that
    // cannot be included in a string literal and then unescape them in code
    // blocks.
    var source = "__p+='" + text
      .replace(escaper, function(match) {
        return '\\' + escapes[match];
      })
      .replace(settings.escape || noMatch, function(match, code) {
        return "'+\n_.escape(" + unescape(code) + ")+\n'";
      })
      .replace(settings.interpolate || noMatch, function(match, code) {
        return "'+\n(" + unescape(code) + ")+\n'";
      })
      .replace(settings.evaluate || noMatch, function(match, code) {
        return "';\n" + unescape(code) + "\n;__p+='";
      }) + "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __p='';" +
      "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" +
      source + "return __p;\n";

    var render = new Function(settings.variable || 'obj', '_', source);
    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for build time
    // precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' +
      source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var wrapped = this._wrapped;
      method.apply(wrapped, arguments);
      var length = wrapped.length;
      if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
      return result(wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);

}
});
this.require.define({
  'backbone': function(exports, require, module) {
//     Backbone.js 0.9.2

//     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `global`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to slice/splice.
  var slice = Array.prototype.slice;
  var splice = Array.prototype.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.9.2';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
  var $ = root.jQuery || root.Zepto || root.ender;

  // Set the JavaScript library that will be used for DOM manipulation and
  // Ajax calls (a.k.a. the `$` variable). By default Backbone will use: jQuery,
  // Zepto, or Ender; but the `setDomLibrary()` method lets you inject an
  // alternate JavaScript library (or a mock library for testing your views
  // outside of a browser).
  Backbone.setDomLibrary = function(lib) {
    $ = lib;
  };

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // Regular expression used to split event strings
  var eventSplitter = /\s+/;

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback functions
  // to an event; trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    on: function(events, callback, context) {

      var calls, event, node, tail, list;
      if (!callback) return this;
      events = events.split(eventSplitter);
      calls = this._callbacks || (this._callbacks = {});

      // Create an immutable callback list, allowing traversal during
      // modification.  The tail is an empty object that will always be used
      // as the next node.
      while (event = events.shift()) {
        list = calls[event];
        node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = {tail: tail, next: list ? list.next : node};
      }

      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    off: function(events, callback, context) {
      var event, calls, node, tail, cb, ctx;

      // No events, or removing *all* events.
      if (!(calls = this._callbacks)) return;
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }

      // Loop through the listed events and contexts, splicing them out of the
      // linked list of callbacks if appropriate.
      events = events ? events.split(eventSplitter) : _.keys(calls);
      while (event = events.shift()) {
        node = calls[event];
        delete calls[event];
        if (!node || !(callback || context)) continue;
        // Create a new list, omitting the indicated callbacks.
        tail = node.tail;
        while ((node = node.next) !== tail) {
          cb = node.callback;
          ctx = node.context;
          if ((callback && cb !== callback) || (context && ctx !== context)) {
            this.on(event, cb, ctx);
          }
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) return this;
      all = calls.all;
      events = events.split(eventSplitter);
      rest = slice.call(arguments, 1);

      // For each event, walk through the linked list of callbacks twice,
      // first to trigger the event, then to trigger any `"all"` callbacks.
      while (event = events.shift()) {
        if (node = calls[event]) {
          tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, rest);
          }
        }
        if (node = all) {
          tail = node.tail;
          args = [event].concat(rest);
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
      }

      return this;
    }

  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if (options && options.parse) attributes = this.parse(attributes);
    if (defaults = getValue(this, 'defaults')) {
      attributes = _.extend({}, defaults, attributes);
    }
    if (options && options.collection) this.collection = options.collection;
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this.set(attributes, {silent: true});
    // Reset change tracking.
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // A hash of attributes that have silently changed since the last time
    // `change` was called.  Will become pending attributes on the next call.
    _silent: null,

    // A hash of attributes that have changed since the last `'change'` event
    // began.
    _pending: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.get(attr);
      return this._escapedAttributes[attr] = _.escape(val == null ? '' : '' + val);
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    set: function(key, value, options) {
      var attrs, attr, val;

      // Handle both
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs instanceof Model) attrs = attrs.attributes;
      if (options.unset) for (attr in attrs) attrs[attr] = void 0;

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      var changes = options.changes = {};
      var now = this.attributes;
      var escaped = this._escapedAttributes;
      var prev = this._previousAttributes || {};

      // For each `set` attribute...
      for (attr in attrs) {
        val = attrs[attr];

        // If the new and current value differ, record the change.
        if (!_.isEqual(now[attr], val) || (options.unset && _.has(now, attr))) {
          delete escaped[attr];
          (options.silent ? this._silent : changes)[attr] = true;
        }

        // Update or delete the current value.
        options.unset ? delete now[attr] : now[attr] = val;

        // If the new and previous value differ, record the change.  If not,
        // then remove changes for this attribute.
        if (!_.isEqual(prev[attr], val) || (_.has(now, attr) != _.has(prev, attr))) {
          this.changed[attr] = val;
          if (!options.silent) this._pending[attr] = true;
        } else {
          delete this.changed[attr];
          delete this._pending[attr];
        }
      }

      // Fire the `"change"` events.
      if (!options.silent) this.change(options);
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset: function(attr, options) {
      (options || (options = {})).unset = true;
      return this.set(attr, null, options);
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear: function(options) {
      (options || (options = {})).unset = true;
      return this.set(_.clone(this.attributes), options);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = Backbone.wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, value, options) {
      var attrs, current;

      // Handle both `("key", value)` and `({key: value})` -style calls.
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }
      options = options ? _.clone(options) : {};

      // If we're "wait"-ing to set changed attributes, validate early.
      if (options.wait) {
        if (!this._validate(attrs, options)) return false;
        current = _.clone(this.attributes);
      }

      // Regular saves `set` attributes before persisting to the server.
      var silentOptions = _.extend({}, options, {silent: true});
      if (attrs && !this.set(attrs, options.wait ? silentOptions : options)) {
        return false;
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        var serverAttrs = model.parse(resp, xhr);
        if (options.wait) {
          delete options.wait;
          serverAttrs = _.extend(attrs || {}, serverAttrs);
        }
        if (!model.set(serverAttrs, options)) return false;
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };

      // Finish configuring and sending the Ajax request.
      options.error = Backbone.wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
      if (options.wait) this.set(current, silentOptions);
      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var triggerDestroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      if (this.isNew()) {
        triggerDestroy();
        return false;
      }

      options.success = function(resp) {
        if (options.wait) triggerDestroy();
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };

      options.error = Backbone.wrapError(options.error, model, options);
      var xhr = (this.sync || Backbone.sync).call(this, 'delete', this, options);
      if (!options.wait) triggerDestroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = getValue(this, 'urlRoot') || getValue(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, xhr) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Call this method to manually fire a `"change"` event for this model and
    // a `"change:attribute"` event for each changed attribute.
    // Calling this will cause all objects observing the model to update.
    change: function(options) {
      options || (options = {});
      var changing = this._changing;
      this._changing = true;

      // Silent changes become pending changes.
      for (var attr in this._silent) this._pending[attr] = true;

      // Silent changes are triggered.
      var changes = _.extend({}, options.changes, this._silent);
      this._silent = {};
      for (var attr in changes) {
        this.trigger('change:' + attr, this, this.get(attr), options);
      }
      if (changing) return this;

      // Continue firing `"change"` events while there are pending changes.
      while (!_.isEmpty(this._pending)) {
        this._pending = {};
        this.trigger('change', this, options);
        // Pending and silent changes still remain.
        for (var attr in this.changed) {
          if (this._pending[attr] || this._silent[attr]) continue;
          delete this.changed[attr];
        }
        this._previousAttributes = _.clone(this.attributes);
      }

      this._changing = false;
      return this;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (!arguments.length) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false, old = this._previousAttributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (!arguments.length || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Check if the model is currently in a valid state. It's only possible to
    // get into an *invalid* state if you're using silent changes.
    isValid: function() {
      return !this.validate(this.attributes);
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. If a specific `error` callback has
    // been passed, call that instead of firing the general `"error"` event.
    _validate: function(attrs, options) {
      if (options.silent || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validate(attrs, options);
      if (!error) return true;
      if (options && options.error) {
        options.error(this, error, options);
      } else {
        this.trigger('error', this, error, options);
      }
      return false;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, {silent: true, parse: options.parse});
  };

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `add` event for every new model.
    add: function(models, options) {
      var i, index, length, model, cid, id, cids = {}, ids = {}, dups = [];
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];

      // Begin by turning bare objects into model references, and preventing
      // invalid models or duplicate models from being added.
      for (i = 0, length = models.length; i < length; i++) {
        if (!(model = models[i] = this._prepareModel(models[i], options))) {
          throw new Error("Can't add an invalid model to a collection");
        }
        cid = model.cid;
        id = model.id;
        if (cids[cid] || this._byCid[cid] || ((id != null) && (ids[id] || this._byId[id]))) {
          dups.push(i);
          continue;
        }
        cids[cid] = ids[id] = model;
      }

      // Remove duplicates.
      i = dups.length;
      while (i--) {
        models.splice(dups[i], 1);
      }

      // Listen to added models' events, and index models for lookup by
      // `id` and by `cid`.
      for (i = 0, length = models.length; i < length; i++) {
        (model = models[i]).on('all', this._onModelEvent, this);
        this._byCid[model.cid] = model;
        if (model.id != null) this._byId[model.id] = model;
      }

      // Insert models into the collection, re-sorting if needed, and triggering
      // `add` events unless silenced.
      this.length += length;
      index = options.at != null ? options.at : this.models.length;
      splice.apply(this.models, [index, 0].concat(models));
      if (this.comparator) this.sort({silent: true});
      if (options.silent) return this;
      for (i = 0, length = this.models.length; i < length; i++) {
        if (!cids[(model = this.models[i]).cid]) continue;
        options.index = i;
        model.trigger('add', model, this, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `remove` event for every model removed.
    remove: function(models, options) {
      var i, l, index, model;
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];
      for (i = 0, l = models.length; i < l; i++) {
        model = this.getByCid(models[i]) || this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byCid[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, options);
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: 0}, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Get a model from the set by id.
    get: function(id) {
      if (id == null) return void 0;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid: function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of `filter`.
    where: function(attrs) {
      if (_.isEmpty(attrs)) return [];
      return this.filter(function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      var boundComparator = _.bind(this.comparator, this);
      if (this.comparator.length == 1) {
        this.models = this.sortBy(boundComparator);
      } else {
        this.models.sort(boundComparator);
      }
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `add` or `remove` events. Fires `reset` when finished.
    reset: function(models, options) {
      models  || (models = []);
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      this._reset();
      this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === undefined) options.parse = true;
      var collection = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = Backbone.wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      var coll = this;
      options = options ? _.clone(options) : {};
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!options.wait) coll.add(model, options);
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        if (options.wait) coll.add(nextModel, options);
        if (success) {
          success(nextModel, resp);
        } else {
          nextModel.trigger('sync', model, resp, options);
        }
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, xhr) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is reset.
    _reset: function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Prepare a model or hash of attributes to be added to this collection.
    _prepareModel: function(model, options) {
      options || (options = {});
      if (!(model instanceof Model)) {
        var attrs = model;
        options.collection = this;
        model = new this.model(attrs, options);
        if (!model._validate(model.attributes, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference: function(model) {
      if (this == model.collection) {
        delete model.collection;
      }
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event == 'add' || event == 'remove') && collection != this) return;
      if (event == 'destroy') {
        this.remove(model, options);
      }
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
    'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
    'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
    'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
    'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Router
  // -------------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      Backbone.history || (Backbone.history = new History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (!callback) callback = this[name];
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback && callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
        Backbone.history.trigger('route', this, name, args);
      }, this));
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      var routes = [];
      for (var route in this.routes) {
        routes.unshift([route, this.routes[route]]);
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(namedParam, '([^\/]+)')
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters: function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning leading hashes and slashes .
  var routeStripper = /^[#\/]/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(windowOverride) {
      var loc = windowOverride ? windowOverride.location : window.location;
      var match = loc.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) fragment += search;
        } else {
          fragment = this.getHash();
        }
      }
      if (!fragment.indexOf(this.options.root)) fragment = fragment.substr(this.options.root.length);
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).bind('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = window.location;
      var atRoot  = loc.pathname == this.options.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      $(window).unbind('popstate', this.checkUrl).unbind('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) current = this.getFragment(this.getHash(this.iframe));
      if (current == this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: options};
      var frag = (fragment || '').replace(routeStripper, '');
      if (this.fragment == frag) return;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
        this.fragment = frag;
        window.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, frag);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this.fragment = frag;
        this._updateHash(window.location, frag, options.replace);
        if (this.iframe && (frag != this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a history entry on hash-tag change.
          // When replace is true, we don't want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, frag, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        window.location.assign(this.options.root + fragment);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        location.replace(location.toString().replace(/(javascript:|#).*$/, '') + '#' + fragment);
      } else {
        location.hash = fragment;
      }
    }
  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove: function() {
      this.$el.remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make: function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = (element instanceof $) ? element : $(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = getValue(this, 'events')))) return;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) throw new Error('Method "' + events[key] + '" does not exist');
        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.bind(eventName, method);
        } else {
          this.$el.delegate(selector, eventName, method);
        }
      }
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.unbind('.delegateEvents' + this.cid);
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure: function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = viewOptions.length; i < l; i++) {
        var attr = viewOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = getValue(this, 'attributes') || {};
        if (this.id) attrs.id = this.id;
        if (this.className) attrs['class'] = this.className;
        this.setElement(this.make(this.tagName, attrs), false);
      } else {
        this.setElement(this.el, false);
      }
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Model.extend = Collection.extend = Router.extend = View.extend = extend;

  // Backbone.sync
  // -------------

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    options || (options = {});

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = getValue(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(_.extend(params, options));
  };

  // Wrap an optional error callback with a fallback error event.
  Backbone.wrapError = function(onError, originalModel, options) {
    return function(model, resp) {
      resp = model === originalModel ? resp : model;
      if (onError) {
        onError(originalModel, resp, options);
      } else {
        originalModel.trigger('error', originalModel, resp, options);
      }
    };
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

}).call(this);

}
});
this.require.define({
  'knockout': function(exports, require, module) {
// Knockout JavaScript library v2.1.0
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function(window,document,navigator,undefined){
var DEBUG=true;
!function(factory) {
    // Support three module loading scenarios
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target);
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        define(['exports'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['ko'] = {});
    }
}(function(koExports){
// Internally, all KO objects are attached to koExports (even the non-exported ones whose names will be minified by the closure compiler).
// In the future, the following "ko" variable may be made distinct from "koExports" so that private objects are not externally reachable.
var ko = typeof koExports !== 'undefined' ? koExports : {};
// Google Closure Compiler helpers (used only to make the minified file smaller)
ko.exportSymbol = function(koPath, object) {
	var tokens = koPath.split(".");

	// In the future, "ko" may become distinct from "koExports" (so that non-exported objects are not reachable)
	// At that point, "target" would be set to: (typeof koExports !== "undefined" ? koExports : ko)
	var target = ko;

	for (var i = 0; i < tokens.length - 1; i++)
		target = target[tokens[i]];
	target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
  owner[publicName] = object;
};
ko.version = "2.1.0";

ko.exportSymbol('version', ko.version);
ko.utils = new (function () {
    var stringTrimRegex = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;

    // Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
    var knownEvents = {}, knownEventTypesByEventName = {};
    var keyEventTypeName = /Firefox\/2/i.test(navigator.userAgent) ? 'KeyboardEvent' : 'UIEvents';
    knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
    knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
    for (var eventType in knownEvents) {
        var knownEventsForType = knownEvents[eventType];
        if (knownEventsForType.length) {
            for (var i = 0, j = knownEventsForType.length; i < j; i++)
                knownEventTypesByEventName[knownEventsForType[i]] = eventType;
        }
    }
    var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true }; // Workaround for an IE9 issue - https://github.com/SteveSanderson/knockout/issues/406

    // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
    var ieVersion = (function() {
        var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (
            div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]
        );
        return version > 4 ? version : undefined;
    }());
    var isIe6 = ieVersion === 6,
        isIe7 = ieVersion === 7;

    function isClickOnCheckableElement(element, eventType) {
        if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
        if (eventType.toLowerCase() != "click") return false;
        var inputType = element.type;
        return (inputType == "checkbox") || (inputType == "radio");
    }

    return {
        fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

        arrayForEach: function (array, action) {
            for (var i = 0, j = array.length; i < j; i++)
                action(array[i]);
        },

        arrayIndexOf: function (array, item) {
            if (typeof Array.prototype.indexOf == "function")
                return Array.prototype.indexOf.call(array, item);
            for (var i = 0, j = array.length; i < j; i++)
                if (array[i] === item)
                    return i;
            return -1;
        },

        arrayFirst: function (array, predicate, predicateOwner) {
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate.call(predicateOwner, array[i]))
                    return array[i];
            return null;
        },

        arrayRemoveItem: function (array, itemToRemove) {
            var index = ko.utils.arrayIndexOf(array, itemToRemove);
            if (index >= 0)
                array.splice(index, 1);
        },

        arrayGetDistinctValues: function (array) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++) {
                if (ko.utils.arrayIndexOf(result, array[i]) < 0)
                    result.push(array[i]);
            }
            return result;
        },

        arrayMap: function (array, mapping) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                result.push(mapping(array[i]));
            return result;
        },

        arrayFilter: function (array, predicate) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate(array[i]))
                    result.push(array[i]);
            return result;
        },

        arrayPushAll: function (array, valuesToPush) {
            if (valuesToPush instanceof Array)
                array.push.apply(array, valuesToPush);
            else
                for (var i = 0, j = valuesToPush.length; i < j; i++)
                    array.push(valuesToPush[i]);
            return array;
        },

        extend: function (target, source) {
            if (source) {
                for(var prop in source) {
                    if(source.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    }
                }
            }
            return target;
        },

        emptyDomNode: function (domNode) {
            while (domNode.firstChild) {
                ko.removeNode(domNode.firstChild);
            }
        },

        moveCleanedNodesToContainerElement: function(nodes) {
            // Ensure it's a real array, as we're about to reparent the nodes and
            // we don't want the underlying collection to change while we're doing that.
            var nodesArray = ko.utils.makeArray(nodes);

            var container = document.createElement('div');
            for (var i = 0, j = nodesArray.length; i < j; i++) {
                ko.cleanNode(nodesArray[i]);
                container.appendChild(nodesArray[i]);
            }
            return container;
        },

        setDomNodeChildren: function (domNode, childNodes) {
            ko.utils.emptyDomNode(domNode);
            if (childNodes) {
                for (var i = 0, j = childNodes.length; i < j; i++)
                    domNode.appendChild(childNodes[i]);
            }
        },

        replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
            var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
            if (nodesToReplaceArray.length > 0) {
                var insertionPoint = nodesToReplaceArray[0];
                var parent = insertionPoint.parentNode;
                for (var i = 0, j = newNodesArray.length; i < j; i++)
                    parent.insertBefore(newNodesArray[i], insertionPoint);
                for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                    ko.removeNode(nodesToReplaceArray[i]);
                }
            }
        },

        setOptionNodeSelectionState: function (optionNode, isSelected) {
            // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
            if (navigator.userAgent.indexOf("MSIE 6") >= 0)
                optionNode.setAttribute("selected", isSelected);
            else
                optionNode.selected = isSelected;
        },

        stringTrim: function (string) {
            return (string || "").replace(stringTrimRegex, "");
        },

        stringTokenize: function (string, delimiter) {
            var result = [];
            var tokens = (string || "").split(delimiter);
            for (var i = 0, j = tokens.length; i < j; i++) {
                var trimmed = ko.utils.stringTrim(tokens[i]);
                if (trimmed !== "")
                    result.push(trimmed);
            }
            return result;
        },

        stringStartsWith: function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        },

        buildEvalWithinScopeFunction: function (expression, scopeLevels) {
            // Build the source for a function that evaluates "expression"
            // For each scope variable, add an extra level of "with" nesting
            // Example result: with(sc[1]) { with(sc[0]) { return (expression) } }
            var functionBody = "return (" + expression + ")";
            for (var i = 0; i < scopeLevels; i++) {
                functionBody = "with(sc[" + i + "]) { " + functionBody + " } ";
            }
            return new Function("sc", functionBody);
        },

        domNodeIsContainedBy: function (node, containedByNode) {
            if (containedByNode.compareDocumentPosition)
                return (containedByNode.compareDocumentPosition(node) & 16) == 16;
            while (node != null) {
                if (node == containedByNode)
                    return true;
                node = node.parentNode;
            }
            return false;
        },

        domNodeIsAttachedToDocument: function (node) {
            return ko.utils.domNodeIsContainedBy(node, node.ownerDocument);
        },

        tagNameLower: function(element) {
            // For HTML elements, tagName will always be upper case; for XHTML elements, it'll be lower case.
            // Possible future optimization: If we know it's an element from an XHTML document (not HTML),
            // we don't need to do the .toLowerCase() as it will always be lower case anyway.
            return element && element.tagName && element.tagName.toLowerCase();
        },

        registerEventHandler: function (element, eventType, handler) {
            var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
            if (!mustUseAttachEvent && typeof jQuery != "undefined") {
                if (isClickOnCheckableElement(element, eventType)) {
                    // For click events on checkboxes, jQuery interferes with the event handling in an awkward way:
                    // it toggles the element checked state *after* the click event handlers run, whereas native
                    // click events toggle the checked state *before* the event handler.
                    // Fix this by intecepting the handler and applying the correct checkedness before it runs.
                    var originalHandler = handler;
                    handler = function(event, eventData) {
                        var jQuerySuppliedCheckedState = this.checked;
                        if (eventData)
                            this.checked = eventData.checkedStateBeforeEvent !== true;
                        originalHandler.call(this, event);
                        this.checked = jQuerySuppliedCheckedState; // Restore the state jQuery applied
                    };
                }
                jQuery(element)['bind'](eventType, handler);
            } else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
                element.addEventListener(eventType, handler, false);
            else if (typeof element.attachEvent != "undefined")
                element.attachEvent("on" + eventType, function (event) {
                    handler.call(element, event);
                });
            else
                throw new Error("Browser doesn't support addEventListener or attachEvent");
        },

        triggerEvent: function (element, eventType) {
            if (!(element && element.nodeType))
                throw new Error("element must be a DOM node when calling triggerEvent");

            if (typeof jQuery != "undefined") {
                var eventData = [];
                if (isClickOnCheckableElement(element, eventType)) {
                    // Work around the jQuery "click events on checkboxes" issue described above by storing the original checked state before triggering the handler
                    eventData.push({ checkedStateBeforeEvent: element.checked });
                }
                jQuery(element)['trigger'](eventType, eventData);
            } else if (typeof document.createEvent == "function") {
                if (typeof element.dispatchEvent == "function") {
                    var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                    var event = document.createEvent(eventCategory);
                    event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                    element.dispatchEvent(event);
                }
                else
                    throw new Error("The supplied element doesn't support dispatchEvent");
            } else if (typeof element.fireEvent != "undefined") {
                // Unlike other browsers, IE doesn't change the checked state of checkboxes/radiobuttons when you trigger their "click" event
                // so to make it consistent, we'll do it manually here
                if (isClickOnCheckableElement(element, eventType))
                    element.checked = element.checked !== true;
                element.fireEvent("on" + eventType);
            }
            else
                throw new Error("Browser doesn't support triggering events");
        },

        unwrapObservable: function (value) {
            return ko.isObservable(value) ? value() : value;
        },

        toggleDomNodeCssClass: function (node, className, shouldHaveClass) {
            var currentClassNames = (node.className || "").split(/\s+/);
            var hasClass = ko.utils.arrayIndexOf(currentClassNames, className) >= 0;

            if (shouldHaveClass && !hasClass) {
                node.className += (currentClassNames[0] ? " " : "") + className;
            } else if (hasClass && !shouldHaveClass) {
                var newClassName = "";
                for (var i = 0; i < currentClassNames.length; i++)
                    if (currentClassNames[i] != className)
                        newClassName += currentClassNames[i] + " ";
                node.className = ko.utils.stringTrim(newClassName);
            }
        },

        setTextContent: function(element, textContent) {
            var value = ko.utils.unwrapObservable(textContent);
            if ((value === null) || (value === undefined))
                value = "";

            'innerText' in element ? element.innerText = value
                                   : element.textContent = value;

            if (ieVersion >= 9) {
                // Believe it or not, this actually fixes an IE9 rendering bug
                // (See https://github.com/SteveSanderson/knockout/issues/209)
                element.style.display = element.style.display;
            }
        },

        ensureSelectElementIsRenderedCorrectly: function(selectElement) {
            // Workaround for IE9 rendering bug - it doesn't reliably display all the text in dynamically-added select boxes unless you force it to re-render by updating the width.
            // (See https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option)
            if (ieVersion >= 9) {
                var originalWidth = selectElement.style.width;
                selectElement.style.width = 0;
                selectElement.style.width = originalWidth;
            }
        },

        range: function (min, max) {
            min = ko.utils.unwrapObservable(min);
            max = ko.utils.unwrapObservable(max);
            var result = [];
            for (var i = min; i <= max; i++)
                result.push(i);
            return result;
        },

        makeArray: function(arrayLikeObject) {
            var result = [];
            for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                result.push(arrayLikeObject[i]);
            };
            return result;
        },

        isIe6 : isIe6,
        isIe7 : isIe7,
        ieVersion : ieVersion,

        getFormFields: function(form, fieldName) {
            var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
            var isMatchingField = (typeof fieldName == 'string')
                ? function(field) { return field.name === fieldName }
                : function(field) { return fieldName.test(field.name) }; // Treat fieldName as regex or object containing predicate
            var matches = [];
            for (var i = fields.length - 1; i >= 0; i--) {
                if (isMatchingField(fields[i]))
                    matches.push(fields[i]);
            };
            return matches;
        },

        parseJson: function (jsonString) {
            if (typeof jsonString == "string") {
                jsonString = ko.utils.stringTrim(jsonString);
                if (jsonString) {
                    if (window.JSON && window.JSON.parse) // Use native parsing where available
                        return window.JSON.parse(jsonString);
                    return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
                }
            }
            return null;
        },

        stringifyJson: function (data, replacer, space) {   // replacer and space are optional
            if ((typeof JSON == "undefined") || (typeof JSON.stringify == "undefined"))
                throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
            return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
        },

        postJson: function (urlOrForm, data, options) {
            options = options || {};
            var params = options['params'] || {};
            var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
            var url = urlOrForm;

            // If we were given a form, use its 'action' URL and pick out any requested field values
            if((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
                var originalForm = urlOrForm;
                url = originalForm.action;
                for (var i = includeFields.length - 1; i >= 0; i--) {
                    var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                    for (var j = fields.length - 1; j >= 0; j--)
                        params[fields[j].name] = fields[j].value;
                }
            }

            data = ko.utils.unwrapObservable(data);
            var form = document.createElement("form");
            form.style.display = "none";
            form.action = url;
            form.method = "post";
            for (var key in data) {
                var input = document.createElement("input");
                input.name = key;
                input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                form.appendChild(input);
            }
            for (var key in params) {
                var input = document.createElement("input");
                input.name = key;
                input.value = params[key];
                form.appendChild(input);
            }
            document.body.appendChild(form);
            options['submitter'] ? options['submitter'](form) : form.submit();
            setTimeout(function () { form.parentNode.removeChild(form); }, 0);
        }
    }
})();

ko.exportSymbol('utils', ko.utils);
ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
ko.exportSymbol('utils.extend', ko.utils.extend);
ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
ko.exportSymbol('utils.postJson', ko.utils.postJson);
ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
ko.exportSymbol('utils.range', ko.utils.range);
ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);

if (!Function.prototype['bind']) {
    // Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
    // In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
    Function.prototype['bind'] = function (object) {
        var originalFunction = this, args = Array.prototype.slice.call(arguments), object = args.shift();
        return function () {
            return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        };
    };
}

ko.utils.domData = new (function () {
    var uniqueId = 0;
    var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
    var dataStore = {};
    return {
        get: function (node, key) {
            var allDataForNode = ko.utils.domData.getAll(node, false);
            return allDataForNode === undefined ? undefined : allDataForNode[key];
        },
        set: function (node, key, value) {
            if (value === undefined) {
                // Make sure we don't actually create a new domData key if we are actually deleting a value
                if (ko.utils.domData.getAll(node, false) === undefined)
                    return;
            }
            var allDataForNode = ko.utils.domData.getAll(node, true);
            allDataForNode[key] = value;
        },
        getAll: function (node, createIfNotFound) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null");
            if (!hasExistingDataStore) {
                if (!createIfNotFound)
                    return undefined;
                dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
                dataStore[dataStoreKey] = {};
            }
            return dataStore[dataStoreKey];
        },
        clear: function (node) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            if (dataStoreKey) {
                delete dataStore[dataStoreKey];
                node[dataStoreKeyExpandoPropertyName] = null;
            }
        }
    }
})();

ko.exportSymbol('utils.domData', ko.utils.domData);
ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully

ko.utils.domNodeDisposal = new (function () {
    var domDataKey = "__ko_domNodeDisposal__" + (new Date).getTime();
    var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
    var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document

    function getDisposeCallbacksCollection(node, createIfNotFound) {
        var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
        if ((allDisposeCallbacks === undefined) && createIfNotFound) {
            allDisposeCallbacks = [];
            ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
        }
        return allDisposeCallbacks;
    }
    function destroyCallbacksCollection(node) {
        ko.utils.domData.set(node, domDataKey, undefined);
    }

    function cleanSingleNode(node) {
        // Run all the dispose callbacks
        var callbacks = getDisposeCallbacksCollection(node, false);
        if (callbacks) {
            callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
            for (var i = 0; i < callbacks.length; i++)
                callbacks[i](node);
        }

        // Also erase the DOM data
        ko.utils.domData.clear(node);

        // Special support for jQuery here because it's so commonly used.
        // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
        // so notify it to tear down any resources associated with the node & descendants here.
        if ((typeof jQuery == "function") && (typeof jQuery['cleanData'] == "function"))
            jQuery['cleanData']([node]);

        // Also clear any immediate-child comment nodes, as these wouldn't have been found by
        // node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
        if (cleanableNodeTypesWithDescendants[node.nodeType])
            cleanImmediateCommentTypeChildren(node);
    }

    function cleanImmediateCommentTypeChildren(nodeWithChildren) {
        var child, nextChild = nodeWithChildren.firstChild;
        while (child = nextChild) {
            nextChild = child.nextSibling;
            if (child.nodeType === 8)
                cleanSingleNode(child);
        }
    }

    return {
        addDisposeCallback : function(node, callback) {
            if (typeof callback != "function")
                throw new Error("Callback must be a function");
            getDisposeCallbacksCollection(node, true).push(callback);
        },

        removeDisposeCallback : function(node, callback) {
            var callbacksCollection = getDisposeCallbacksCollection(node, false);
            if (callbacksCollection) {
                ko.utils.arrayRemoveItem(callbacksCollection, callback);
                if (callbacksCollection.length == 0)
                    destroyCallbacksCollection(node);
            }
        },

        cleanNode : function(node) {
            // First clean this node, where applicable
            if (cleanableNodeTypes[node.nodeType]) {
                cleanSingleNode(node);

                // ... then its descendants, where applicable
                if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                    // Clone the descendants list in case it changes during iteration
                    var descendants = [];
                    ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
                    for (var i = 0, j = descendants.length; i < j; i++)
                        cleanSingleNode(descendants[i]);
                }
            }
        },

        removeNode : function(node) {
            ko.cleanNode(node);
            if (node.parentNode)
                node.parentNode.removeChild(node);
        }
    }
})();
ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
ko.exportSymbol('cleanNode', ko.cleanNode);
ko.exportSymbol('removeNode', ko.removeNode);
ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
(function () {
    var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;

    function simpleHtmlParse(html) {
        // Based on jQuery's "clean" function, but only accounting for table-related elements.
        // If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly

        // Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
        // a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
        // This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
        // (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.

        // Trim whitespace, otherwise indexOf won't work as expected
        var tags = ko.utils.stringTrim(html).toLowerCase(), div = document.createElement("div");

        // Finds the first match from the left column, and returns the corresponding "wrap" data from the right column
        var wrap = tags.match(/^<(thead|tbody|tfoot)/)              && [1, "<table>", "</table>"] ||
                   !tags.indexOf("<tr")                             && [2, "<table><tbody>", "</tbody></table>"] ||
                   (!tags.indexOf("<td") || !tags.indexOf("<th"))   && [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
                   /* anything else */                                 [0, "", ""];

        // Go to html and back, then peel off extra wrappers
        // Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
        var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
        if (typeof window['innerShiv'] == "function") {
            div.appendChild(window['innerShiv'](markup));
        } else {
            div.innerHTML = markup;
        }

        // Move to the right depth
        while (wrap[0]--)
            div = div.lastChild;

        return ko.utils.makeArray(div.lastChild.childNodes);
    }

    function jQueryHtmlParse(html) {
        var elems = jQuery['clean']([html]);

        // As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
        // Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
        // Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
        if (elems && elems[0]) {
            // Find the top-most parent element that's a direct child of a document fragment
            var elem = elems[0];
            while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */)
                elem = elem.parentNode;
            // ... then detach it
            if (elem.parentNode)
                elem.parentNode.removeChild(elem);
        }

        return elems;
    }

    ko.utils.parseHtmlFragment = function(html) {
        return typeof jQuery != 'undefined' ? jQueryHtmlParse(html)   // As below, benefit from jQuery's optimisations where possible
                                            : simpleHtmlParse(html);  // ... otherwise, this simple logic will do in most common cases.
    };

    ko.utils.setHtml = function(node, html) {
        ko.utils.emptyDomNode(node);

        if ((html !== null) && (html !== undefined)) {
            if (typeof html != 'string')
                html = html.toString();

            // jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
            // for example <tr> elements which are not normally allowed to exist on their own.
            // If you've referenced jQuery we'll use that rather than duplicating its code.
            if (typeof jQuery != 'undefined') {
                jQuery(node)['html'](html);
            } else {
                // ... otherwise, use KO's own parsing logic.
                var parsedNodes = ko.utils.parseHtmlFragment(html);
                for (var i = 0; i < parsedNodes.length; i++)
                    node.appendChild(parsedNodes[i]);
            }
        }
    };
})();

ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

ko.memoization = (function () {
    var memos = {};

    function randomMax8HexChars() {
        return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    }
    function generateRandomId() {
        return randomMax8HexChars() + randomMax8HexChars();
    }
    function findMemoNodes(rootNode, appendToArray) {
        if (!rootNode)
            return;
        if (rootNode.nodeType == 8) {
            var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
            if (memoId != null)
                appendToArray.push({ domNode: rootNode, memoId: memoId });
        } else if (rootNode.nodeType == 1) {
            for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                findMemoNodes(childNodes[i], appendToArray);
        }
    }

    return {
        memoize: function (callback) {
            if (typeof callback != "function")
                throw new Error("You can only pass a function to ko.memoization.memoize()");
            var memoId = generateRandomId();
            memos[memoId] = callback;
            return "<!--[ko_memo:" + memoId + "]-->";
        },

        unmemoize: function (memoId, callbackParams) {
            var callback = memos[memoId];
            if (callback === undefined)
                throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
            try {
                callback.apply(null, callbackParams || []);
                return true;
            }
            finally { delete memos[memoId]; }
        },

        unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
            var memos = [];
            findMemoNodes(domNode, memos);
            for (var i = 0, j = memos.length; i < j; i++) {
                var node = memos[i].domNode;
                var combinedParams = [node];
                if (extraCallbackParamsArray)
                    ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
                if (node.parentNode)
                    node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
            }
        },

        parseMemoText: function (memoText) {
            var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
            return match ? match[1] : null;
        }
    };
})();

ko.exportSymbol('memoization', ko.memoization);
ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
ko.extenders = {
    'throttle': function(target, timeout) {
        // Throttling means two things:

        // (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
        //     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
        target['throttleEvaluation'] = timeout;

        // (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
        //     so the target cannot change value synchronously or faster than a certain rate
        var writeTimeoutInstance = null;
        return ko.dependentObservable({
            'read': target,
            'write': function(value) {
                clearTimeout(writeTimeoutInstance);
                writeTimeoutInstance = setTimeout(function() {
                    target(value);
                }, timeout);
            }
        });
    },

    'notify': function(target, notifyWhen) {
        target["equalityComparer"] = notifyWhen == "always"
            ? function() { return false } // Treat all values as not equal
            : ko.observable["fn"]["equalityComparer"];
        return target;
    }
};

function applyExtenders(requestedExtenders) {
    var target = this;
    if (requestedExtenders) {
        for (var key in requestedExtenders) {
            var extenderHandler = ko.extenders[key];
            if (typeof extenderHandler == 'function') {
                target = extenderHandler(target, requestedExtenders[key]);
            }
        }
    }
    return target;
}

ko.exportSymbol('extenders', ko.extenders);

ko.subscription = function (target, callback, disposeCallback) {
    this.target = target;
    this.callback = callback;
    this.disposeCallback = disposeCallback;
    ko.exportProperty(this, 'dispose', this.dispose);
};
ko.subscription.prototype.dispose = function () {
    this.isDisposed = true;
    this.disposeCallback();
};

ko.subscribable = function () {
    this._subscriptions = {};

    ko.utils.extend(this, ko.subscribable['fn']);
    ko.exportProperty(this, 'subscribe', this.subscribe);
    ko.exportProperty(this, 'extend', this.extend);
    ko.exportProperty(this, 'getSubscriptionsCount', this.getSubscriptionsCount);
}

var defaultEvent = "change";

ko.subscribable['fn'] = {
    subscribe: function (callback, callbackTarget, event) {
        event = event || defaultEvent;
        var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

        var subscription = new ko.subscription(this, boundCallback, function () {
            ko.utils.arrayRemoveItem(this._subscriptions[event], subscription);
        }.bind(this));

        if (!this._subscriptions[event])
            this._subscriptions[event] = [];
        this._subscriptions[event].push(subscription);
        return subscription;
    },

    "notifySubscribers": function (valueToNotify, event) {
        event = event || defaultEvent;
        if (this._subscriptions[event]) {
            ko.utils.arrayForEach(this._subscriptions[event].slice(0), function (subscription) {
                // In case a subscription was disposed during the arrayForEach cycle, check
                // for isDisposed on each subscription before invoking its callback
                if (subscription && (subscription.isDisposed !== true))
                    subscription.callback(valueToNotify);
            });
        }
    },

    getSubscriptionsCount: function () {
        var total = 0;
        for (var eventName in this._subscriptions) {
            if (this._subscriptions.hasOwnProperty(eventName))
                total += this._subscriptions[eventName].length;
        }
        return total;
    },

    extend: applyExtenders
};


ko.isSubscribable = function (instance) {
    return typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
};

ko.exportSymbol('subscribable', ko.subscribable);
ko.exportSymbol('isSubscribable', ko.isSubscribable);

ko.dependencyDetection = (function () {
    var _frames = [];

    return {
        begin: function (callback) {
            _frames.push({ callback: callback, distinctDependencies:[] });
        },

        end: function () {
            _frames.pop();
        },

        registerDependency: function (subscribable) {
            if (!ko.isSubscribable(subscribable))
                throw new Error("Only subscribable things can act as dependencies");
            if (_frames.length > 0) {
                var topFrame = _frames[_frames.length - 1];
                if (ko.utils.arrayIndexOf(topFrame.distinctDependencies, subscribable) >= 0)
                    return;
                topFrame.distinctDependencies.push(subscribable);
                topFrame.callback(subscribable);
            }
        }
    };
})();
var primitiveTypes = { 'undefined':true, 'boolean':true, 'number':true, 'string':true };

ko.observable = function (initialValue) {
    var _latestValue = initialValue;

    function observable() {
        if (arguments.length > 0) {
            // Write

            // Ignore writes if the value hasn't changed
            if ((!observable['equalityComparer']) || !observable['equalityComparer'](_latestValue, arguments[0])) {
                observable.valueWillMutate();
                _latestValue = arguments[0];
                if (DEBUG) observable._latestValue = _latestValue;
                observable.valueHasMutated();
            }
            return this; // Permits chained assignments
        }
        else {
            // Read
            ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
            return _latestValue;
        }
    }
    if (DEBUG) observable._latestValue = _latestValue;
    ko.subscribable.call(observable);
    observable.valueHasMutated = function () { observable["notifySubscribers"](_latestValue); }
    observable.valueWillMutate = function () { observable["notifySubscribers"](_latestValue, "beforeChange"); }
    ko.utils.extend(observable, ko.observable['fn']);

    ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
    ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);

    return observable;
}

ko.observable['fn'] = {
    "equalityComparer": function valuesArePrimitiveAndEqual(a, b) {
        var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
        return oldValueIsPrimitive ? (a === b) : false;
    }
};

var protoProperty = ko.observable.protoProperty = "__ko_proto__";
ko.observable['fn'][protoProperty] = ko.observable;

ko.hasPrototype = function(instance, prototype) {
    if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) return false;
    if (instance[protoProperty] === prototype) return true;
    return ko.hasPrototype(instance[protoProperty], prototype); // Walk the prototype chain
};

ko.isObservable = function (instance) {
    return ko.hasPrototype(instance, ko.observable);
}
ko.isWriteableObservable = function (instance) {
    // Observable
    if ((typeof instance == "function") && instance[protoProperty] === ko.observable)
        return true;
    // Writeable dependent observable
    if ((typeof instance == "function") && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction))
        return true;
    // Anything else
    return false;
}


ko.exportSymbol('observable', ko.observable);
ko.exportSymbol('isObservable', ko.isObservable);
ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
ko.observableArray = function (initialValues) {
    if (arguments.length == 0) {
        // Zero-parameter constructor initializes to empty array
        initialValues = [];
    }
    if ((initialValues !== null) && (initialValues !== undefined) && !('length' in initialValues))
        throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

    var result = ko.observable(initialValues);
    ko.utils.extend(result, ko.observableArray['fn']);
    return result;
}

ko.observableArray['fn'] = {
    'remove': function (valueOrPredicate) {
        var underlyingArray = this();
        var removedValues = [];
        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        for (var i = 0; i < underlyingArray.length; i++) {
            var value = underlyingArray[i];
            if (predicate(value)) {
                if (removedValues.length === 0) {
                    this.valueWillMutate();
                }
                removedValues.push(value);
                underlyingArray.splice(i, 1);
                i--;
            }
        }
        if (removedValues.length) {
            this.valueHasMutated();
        }
        return removedValues;
    },

    'removeAll': function (arrayOfValues) {
        // If you passed zero args, we remove everything
        if (arrayOfValues === undefined) {
            var underlyingArray = this();
            var allValues = underlyingArray.slice(0);
            this.valueWillMutate();
            underlyingArray.splice(0, underlyingArray.length);
            this.valueHasMutated();
            return allValues;
        }
        // If you passed an arg, we interpret it as an array of entries to remove
        if (!arrayOfValues)
            return [];
        return this['remove'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'destroy': function (valueOrPredicate) {
        var underlyingArray = this();
        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        this.valueWillMutate();
        for (var i = underlyingArray.length - 1; i >= 0; i--) {
            var value = underlyingArray[i];
            if (predicate(value))
                underlyingArray[i]["_destroy"] = true;
        }
        this.valueHasMutated();
    },

    'destroyAll': function (arrayOfValues) {
        // If you passed zero args, we destroy everything
        if (arrayOfValues === undefined)
            return this['destroy'](function() { return true });

        // If you passed an arg, we interpret it as an array of entries to destroy
        if (!arrayOfValues)
            return [];
        return this['destroy'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'indexOf': function (item) {
        var underlyingArray = this();
        return ko.utils.arrayIndexOf(underlyingArray, item);
    },

    'replace': function(oldItem, newItem) {
        var index = this['indexOf'](oldItem);
        if (index >= 0) {
            this.valueWillMutate();
            this()[index] = newItem;
            this.valueHasMutated();
        }
    }
}

// Populate ko.observableArray.fn with read/write functions from native arrays
ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        var underlyingArray = this();
        this.valueWillMutate();
        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
        this.valueHasMutated();
        return methodCallResult;
    };
});

// Populate ko.observableArray.fn with read-only functions from native arrays
ko.utils.arrayForEach(["slice"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        var underlyingArray = this();
        return underlyingArray[methodName].apply(underlyingArray, arguments);
    };
});

ko.exportSymbol('observableArray', ko.observableArray);
ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
    var _latestValue,
        _hasBeenEvaluated = false,
        _isBeingEvaluated = false,
        readFunction = evaluatorFunctionOrOptions;

    if (readFunction && typeof readFunction == "object") {
        // Single-parameter syntax - everything is on this "options" param
        options = readFunction;
        readFunction = options["read"];
    } else {
        // Multi-parameter syntax - construct the options according to the params passed
        options = options || {};
        if (!readFunction)
            readFunction = options["read"];
    }
    // By here, "options" is always non-null
    if (typeof readFunction != "function")
        throw new Error("Pass a function that returns the value of the ko.computed");

    var writeFunction = options["write"];
    if (!evaluatorFunctionTarget)
        evaluatorFunctionTarget = options["owner"];

    var _subscriptionsToDependencies = [];
    function disposeAllSubscriptionsToDependencies() {
        ko.utils.arrayForEach(_subscriptionsToDependencies, function (subscription) {
            subscription.dispose();
        });
        _subscriptionsToDependencies = [];
    }
    var dispose = disposeAllSubscriptionsToDependencies;

    // Build "disposeWhenNodeIsRemoved" and "disposeWhenNodeIsRemovedCallback" option values
    // (Note: "disposeWhenNodeIsRemoved" option both proactively disposes as soon as the node is removed using ko.removeNode(),
    // plus adds a "disposeWhen" callback that, on each evaluation, disposes if the node was removed by some other means.)
    var disposeWhenNodeIsRemoved = (typeof options["disposeWhenNodeIsRemoved"] == "object") ? options["disposeWhenNodeIsRemoved"] : null;
    var disposeWhen = options["disposeWhen"] || function() { return false; };
    if (disposeWhenNodeIsRemoved) {
        dispose = function() {
            ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, arguments.callee);
            disposeAllSubscriptionsToDependencies();
        };
        ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, dispose);
        var existingDisposeWhenFunction = disposeWhen;
        disposeWhen = function () {
            return !ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved) || existingDisposeWhenFunction();
        }
    }

    var evaluationTimeoutInstance = null;
    function evaluatePossiblyAsync() {
        var throttleEvaluationTimeout = dependentObservable['throttleEvaluation'];
        if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
            clearTimeout(evaluationTimeoutInstance);
            evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
        } else
            evaluateImmediate();
    }

    function evaluateImmediate() {
        if (_isBeingEvaluated) {
            // If the evaluation of a ko.computed causes side effects, it's possible that it will trigger its own re-evaluation.
            // This is not desirable (it's hard for a developer to realise a chain of dependencies might cause this, and they almost
            // certainly didn't intend infinite re-evaluations). So, for predictability, we simply prevent ko.computeds from causing
            // their own re-evaluation. Further discussion at https://github.com/SteveSanderson/knockout/pull/387
            return;
        }

        // Don't dispose on first evaluation, because the "disposeWhen" callback might
        // e.g., dispose when the associated DOM element isn't in the doc, and it's not
        // going to be in the doc until *after* the first evaluation
        if (_hasBeenEvaluated && disposeWhen()) {
            dispose();
            return;
        }

        _isBeingEvaluated = true;
        try {
            // Initially, we assume that none of the subscriptions are still being used (i.e., all are candidates for disposal).
            // Then, during evaluation, we cross off any that are in fact still being used.
            var disposalCandidates = ko.utils.arrayMap(_subscriptionsToDependencies, function(item) {return item.target;});

            ko.dependencyDetection.begin(function(subscribable) {
                var inOld;
                if ((inOld = ko.utils.arrayIndexOf(disposalCandidates, subscribable)) >= 0)
                    disposalCandidates[inOld] = undefined; // Don't want to dispose this subscription, as it's still being used
                else
                    _subscriptionsToDependencies.push(subscribable.subscribe(evaluatePossiblyAsync)); // Brand new subscription - add it
            });

            var newValue = readFunction.call(evaluatorFunctionTarget);

            // For each subscription no longer being used, remove it from the active subscriptions list and dispose it
            for (var i = disposalCandidates.length - 1; i >= 0; i--) {
                if (disposalCandidates[i])
                    _subscriptionsToDependencies.splice(i, 1)[0].dispose();
            }
            _hasBeenEvaluated = true;

            dependentObservable["notifySubscribers"](_latestValue, "beforeChange");
            _latestValue = newValue;
            if (DEBUG) dependentObservable._latestValue = _latestValue;
        } finally {
            ko.dependencyDetection.end();
        }

        dependentObservable["notifySubscribers"](_latestValue);
        _isBeingEvaluated = false;

    }

    function dependentObservable() {
        if (arguments.length > 0) {
            set.apply(dependentObservable, arguments);
        } else {
            return get();
        }
    }

    function set() {
        if (typeof writeFunction === "function") {
            // Writing a value
            writeFunction.apply(evaluatorFunctionTarget, arguments);
        } else {
            throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
        }
    }

    function get() {
        // Reading the value
        if (!_hasBeenEvaluated)
            evaluateImmediate();
        ko.dependencyDetection.registerDependency(dependentObservable);
        return _latestValue;
    }

    dependentObservable.getDependenciesCount = function () { return _subscriptionsToDependencies.length; };
    dependentObservable.hasWriteFunction = typeof options["write"] === "function";
    dependentObservable.dispose = function () { dispose(); };

    ko.subscribable.call(dependentObservable);
    ko.utils.extend(dependentObservable, ko.dependentObservable['fn']);

    if (options['deferEvaluation'] !== true)
        evaluateImmediate();

    ko.exportProperty(dependentObservable, 'dispose', dependentObservable.dispose);
    ko.exportProperty(dependentObservable, 'getDependenciesCount', dependentObservable.getDependenciesCount);

    return dependentObservable;
};

ko.isComputed = function(instance) {
    return ko.hasPrototype(instance, ko.dependentObservable);
};

var protoProp = ko.observable.protoProperty; // == "__ko_proto__"
ko.dependentObservable[protoProp] = ko.observable;

ko.dependentObservable['fn'] = {};
ko.dependentObservable['fn'][protoProp] = ko.dependentObservable;

ko.exportSymbol('dependentObservable', ko.dependentObservable);
ko.exportSymbol('computed', ko.dependentObservable); // Make "ko.computed" an alias for "ko.dependentObservable"
ko.exportSymbol('isComputed', ko.isComputed);

(function() {
    var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)

    ko.toJS = function(rootObject) {
        if (arguments.length == 0)
            throw new Error("When calling ko.toJS, pass the object you want to convert.");

        // We just unwrap everything at every level in the object graph
        return mapJsObjectGraph(rootObject, function(valueToMap) {
            // Loop because an observable's value might in turn be another observable wrapper
            for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
                valueToMap = valueToMap();
            return valueToMap;
        });
    };

    ko.toJSON = function(rootObject, replacer, space) {     // replacer and space are optional
        var plainJavaScriptObject = ko.toJS(rootObject);
        return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
    };

    function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
        visitedObjects = visitedObjects || new objectLookup();

        rootObject = mapInputCallback(rootObject);
        var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof Date));
        if (!canHaveProperties)
            return rootObject;

        var outputProperties = rootObject instanceof Array ? [] : {};
        visitedObjects.save(rootObject, outputProperties);

        visitPropertiesOrArrayEntries(rootObject, function(indexer) {
            var propertyValue = mapInputCallback(rootObject[indexer]);

            switch (typeof propertyValue) {
                case "boolean":
                case "number":
                case "string":
                case "function":
                    outputProperties[indexer] = propertyValue;
                    break;
                case "object":
                case "undefined":
                    var previouslyMappedValue = visitedObjects.get(propertyValue);
                    outputProperties[indexer] = (previouslyMappedValue !== undefined)
                        ? previouslyMappedValue
                        : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                    break;
            }
        });

        return outputProperties;
    }

    function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
        if (rootObject instanceof Array) {
            for (var i = 0; i < rootObject.length; i++)
                visitorCallback(i);

            // For arrays, also respect toJSON property for custom mappings (fixes #278)
            if (typeof rootObject['toJSON'] == 'function')
                visitorCallback('toJSON');
        } else {
            for (var propertyName in rootObject)
                visitorCallback(propertyName);
        }
    };

    function objectLookup() {
        var keys = [];
        var values = [];
        this.save = function(key, value) {
            var existingIndex = ko.utils.arrayIndexOf(keys, key);
            if (existingIndex >= 0)
                values[existingIndex] = value;
            else {
                keys.push(key);
                values.push(value);
            }
        };
        this.get = function(key) {
            var existingIndex = ko.utils.arrayIndexOf(keys, key);
            return (existingIndex >= 0) ? values[existingIndex] : undefined;
        };
    };
})();

ko.exportSymbol('toJS', ko.toJS);
ko.exportSymbol('toJSON', ko.toJSON);
(function () {
    var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';

    // Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
    // are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
    // that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
    ko.selectExtensions = {
        readValue : function(element) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    if (element[hasDomDataExpandoProperty] === true)
                        return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                    return element.getAttribute("value");
                case 'select':
                    return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
                default:
                    return element.value;
            }
        },

        writeValue: function(element, value) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    switch(typeof value) {
                        case "string":
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                            if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
                                delete element[hasDomDataExpandoProperty];
                            }
                            element.value = value;
                            break;
                        default:
                            // Store arbitrary object using DomData
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                            element[hasDomDataExpandoProperty] = true;

                            // Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
                            element.value = typeof value === "number" ? value : "";
                            break;
                    }
                    break;
                case 'select':
                    for (var i = element.options.length - 1; i >= 0; i--) {
                        if (ko.selectExtensions.readValue(element.options[i]) == value) {
                            element.selectedIndex = i;
                            break;
                        }
                    }
                    break;
                default:
                    if ((value === null) || (value === undefined))
                        value = "";
                    element.value = value;
                    break;
            }
        }
    };
})();

ko.exportSymbol('selectExtensions', ko.selectExtensions);
ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);

ko.jsonExpressionRewriting = (function () {
    var restoreCapturedTokensRegex = /\@ko_token_(\d+)\@/g;
    var javaScriptAssignmentTarget = /^[\_$a-z][\_$a-z0-9]*(\[.*?\])*(\.[\_$a-z][\_$a-z0-9]*(\[.*?\])*)*$/i;
    var javaScriptReservedWords = ["true", "false"];

    function restoreTokens(string, tokens) {
        var prevValue = null;
        while (string != prevValue) { // Keep restoring tokens until it no longer makes a difference (they may be nested)
            prevValue = string;
            string = string.replace(restoreCapturedTokensRegex, function (match, tokenIndex) {
                return tokens[tokenIndex];
            });
        }
        return string;
    }

    function isWriteableValue(expression) {
        if (ko.utils.arrayIndexOf(javaScriptReservedWords, ko.utils.stringTrim(expression).toLowerCase()) >= 0)
            return false;
        return expression.match(javaScriptAssignmentTarget) !== null;
    }

    function ensureQuoted(key) {
        var trimmedKey = ko.utils.stringTrim(key);
        switch (trimmedKey.length && trimmedKey.charAt(0)) {
            case "'":
            case '"':
                return key;
            default:
                return "'" + trimmedKey + "'";
        }
    }

    return {
        bindingRewriteValidators: [],

        parseObjectLiteral: function(objectLiteralString) {
            // A full tokeniser+lexer would add too much weight to this library, so here's a simple parser
            // that is sufficient just to split an object literal string into a set of top-level key-value pairs

            var str = ko.utils.stringTrim(objectLiteralString);
            if (str.length < 3)
                return [];
            if (str.charAt(0) === "{")// Ignore any braces surrounding the whole object literal
                str = str.substring(1, str.length - 1);

            // Pull out any string literals and regex literals
            var tokens = [];
            var tokenStart = null, tokenEndChar;
            for (var position = 0; position < str.length; position++) {
                var c = str.charAt(position);
                if (tokenStart === null) {
                    switch (c) {
                        case '"':
                        case "'":
                        case "/":
                            tokenStart = position;
                            tokenEndChar = c;
                            break;
                    }
                } else if ((c == tokenEndChar) && (str.charAt(position - 1) !== "\\")) {
                    var token = str.substring(tokenStart, position + 1);
                    tokens.push(token);
                    var replacement = "@ko_token_" + (tokens.length - 1) + "@";
                    str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
                    position -= (token.length - replacement.length);
                    tokenStart = null;
                }
            }

            // Next pull out balanced paren, brace, and bracket blocks
            tokenStart = null;
            tokenEndChar = null;
            var tokenDepth = 0, tokenStartChar = null;
            for (var position = 0; position < str.length; position++) {
                var c = str.charAt(position);
                if (tokenStart === null) {
                    switch (c) {
                        case "{": tokenStart = position; tokenStartChar = c;
                                  tokenEndChar = "}";
                                  break;
                        case "(": tokenStart = position; tokenStartChar = c;
                                  tokenEndChar = ")";
                                  break;
                        case "[": tokenStart = position; tokenStartChar = c;
                                  tokenEndChar = "]";
                                  break;
                    }
                }

                if (c === tokenStartChar)
                    tokenDepth++;
                else if (c === tokenEndChar) {
                    tokenDepth--;
                    if (tokenDepth === 0) {
                        var token = str.substring(tokenStart, position + 1);
                        tokens.push(token);
                        var replacement = "@ko_token_" + (tokens.length - 1) + "@";
                        str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
                        position -= (token.length - replacement.length);
                        tokenStart = null;
                    }
                }
            }

            // Now we can safely split on commas to get the key/value pairs
            var result = [];
            var keyValuePairs = str.split(",");
            for (var i = 0, j = keyValuePairs.length; i < j; i++) {
                var pair = keyValuePairs[i];
                var colonPos = pair.indexOf(":");
                if ((colonPos > 0) && (colonPos < pair.length - 1)) {
                    var key = pair.substring(0, colonPos);
                    var value = pair.substring(colonPos + 1);
                    result.push({ 'key': restoreTokens(key, tokens), 'value': restoreTokens(value, tokens) });
                } else {
                    result.push({ 'unknown': restoreTokens(pair, tokens) });
                }
            }
            return result;
        },

        insertPropertyAccessorsIntoJson: function (objectLiteralStringOrKeyValueArray) {
            var keyValueArray = typeof objectLiteralStringOrKeyValueArray === "string"
                ? ko.jsonExpressionRewriting.parseObjectLiteral(objectLiteralStringOrKeyValueArray)
                : objectLiteralStringOrKeyValueArray;
            var resultStrings = [], propertyAccessorResultStrings = [];

            var keyValueEntry;
            for (var i = 0; keyValueEntry = keyValueArray[i]; i++) {
                if (resultStrings.length > 0)
                    resultStrings.push(",");

                if (keyValueEntry['key']) {
                    var quotedKey = ensureQuoted(keyValueEntry['key']), val = keyValueEntry['value'];
                    resultStrings.push(quotedKey);
                    resultStrings.push(":");
                    resultStrings.push(val);

                    if (isWriteableValue(ko.utils.stringTrim(val))) {
                        if (propertyAccessorResultStrings.length > 0)
                            propertyAccessorResultStrings.push(", ");
                        propertyAccessorResultStrings.push(quotedKey + " : function(__ko_value) { " + val + " = __ko_value; }");
                    }
                } else if (keyValueEntry['unknown']) {
                    resultStrings.push(keyValueEntry['unknown']);
                }
            }

            var combinedResult = resultStrings.join("");
            if (propertyAccessorResultStrings.length > 0) {
                var allPropertyAccessors = propertyAccessorResultStrings.join("");
                combinedResult = combinedResult + ", '_ko_property_writers' : { " + allPropertyAccessors + " } ";
            }

            return combinedResult;
        },

        keyValueArrayContainsKey: function(keyValueArray, key) {
            for (var i = 0; i < keyValueArray.length; i++)
                if (ko.utils.stringTrim(keyValueArray[i]['key']) == key)
                    return true;
            return false;
        },

        // Internal, private KO utility for updating model properties from within bindings
        // property:            If the property being updated is (or might be) an observable, pass it here
        //                      If it turns out to be a writable observable, it will be written to directly
        // allBindingsAccessor: All bindings in the current execution context.
        //                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
        // key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
        // value:               The value to be written
        // checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
        //                      it is !== existing value on that writable observable
        writeValueToProperty: function(property, allBindingsAccessor, key, value, checkIfDifferent) {
            if (!property || !ko.isWriteableObservable(property)) {
                var propWriters = allBindingsAccessor()['_ko_property_writers'];
                if (propWriters && propWriters[key])
                    propWriters[key](value);
            } else if (!checkIfDifferent || property() !== value) {
                property(value);
            }
        }
    };
})();

ko.exportSymbol('jsonExpressionRewriting', ko.jsonExpressionRewriting);
ko.exportSymbol('jsonExpressionRewriting.bindingRewriteValidators', ko.jsonExpressionRewriting.bindingRewriteValidators);
ko.exportSymbol('jsonExpressionRewriting.parseObjectLiteral', ko.jsonExpressionRewriting.parseObjectLiteral);
ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson);
(function() {
    // "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
    // may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
    // If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
    // of that virtual hierarchy
    //
    // The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
    // without having to scatter special cases all over the binding and templating code.

    // IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
    // but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
    // So, use node.text where available, and node.nodeValue elsewhere
    var commentNodesHaveTextProperty = document.createComment("test").text === "<!--test-->";

    var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko\s+(.*\:.*)\s*-->$/ : /^\s*ko\s+(.*\:.*)\s*$/;
    var endCommentRegex =   commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
    var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };

    function isStartComment(node) {
        return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
    }

    function isEndComment(node) {
        return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(endCommentRegex);
    }

    function getVirtualChildren(startComment, allowUnbalanced) {
        var currentNode = startComment;
        var depth = 1;
        var children = [];
        while (currentNode = currentNode.nextSibling) {
            if (isEndComment(currentNode)) {
                depth--;
                if (depth === 0)
                    return children;
            }

            children.push(currentNode);

            if (isStartComment(currentNode))
                depth++;
        }
        if (!allowUnbalanced)
            throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
        return null;
    }

    function getMatchingEndComment(startComment, allowUnbalanced) {
        var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
        if (allVirtualChildren) {
            if (allVirtualChildren.length > 0)
                return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
            return startComment.nextSibling;
        } else
            return null; // Must have no matching end comment, and allowUnbalanced is true
    }

    function getUnbalancedChildTags(node) {
        // e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
        //       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
        var childNode = node.firstChild, captureRemaining = null;
        if (childNode) {
            do {
                if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
                    captureRemaining.push(childNode);
                else if (isStartComment(childNode)) {
                    var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
                    if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
                        childNode = matchingEndComment;
                    else
                        captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
                } else if (isEndComment(childNode)) {
                    captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
                }
            } while (childNode = childNode.nextSibling);
        }
        return captureRemaining;
    }

    ko.virtualElements = {
        allowedBindings: {},

        childNodes: function(node) {
            return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
        },

        emptyNode: function(node) {
            if (!isStartComment(node))
                ko.utils.emptyDomNode(node);
            else {
                var virtualChildren = ko.virtualElements.childNodes(node);
                for (var i = 0, j = virtualChildren.length; i < j; i++)
                    ko.removeNode(virtualChildren[i]);
            }
        },

        setDomNodeChildren: function(node, childNodes) {
            if (!isStartComment(node))
                ko.utils.setDomNodeChildren(node, childNodes);
            else {
                ko.virtualElements.emptyNode(node);
                var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
                for (var i = 0, j = childNodes.length; i < j; i++)
                    endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
            }
        },

        prepend: function(containerNode, nodeToPrepend) {
            if (!isStartComment(containerNode)) {
                if (containerNode.firstChild)
                    containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
                else
                    containerNode.appendChild(nodeToPrepend);
            } else {
                // Start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
            }
        },

        insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
            if (!isStartComment(containerNode)) {
                // Insert after insertion point
                if (insertAfterNode.nextSibling)
                    containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                else
                    containerNode.appendChild(nodeToInsert);
            } else {
                // Children of start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
            }
        },

        firstChild: function(node) {
            if (!isStartComment(node))
                return node.firstChild;
            if (!node.nextSibling || isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        nextSibling: function(node) {
            if (isStartComment(node))
                node = getMatchingEndComment(node);
            if (node.nextSibling && isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        virtualNodeBindingValue: function(node) {
            var regexMatch = isStartComment(node);
            return regexMatch ? regexMatch[1] : null;
        },

        normaliseVirtualElementDomStructure: function(elementVerified) {
            // Workaround for https://github.com/SteveSanderson/knockout/issues/155
            // (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
            // that are direct descendants of <ul> into the preceding <li>)
            if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)])
                return;

            // Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
            // must be intended to appear *after* that child, so move them there.
            var childNode = elementVerified.firstChild;
            if (childNode) {
                do {
                    if (childNode.nodeType === 1) {
                        var unbalancedTags = getUnbalancedChildTags(childNode);
                        if (unbalancedTags) {
                            // Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
                            var nodeToInsertBefore = childNode.nextSibling;
                            for (var i = 0; i < unbalancedTags.length; i++) {
                                if (nodeToInsertBefore)
                                    elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
                                else
                                    elementVerified.appendChild(unbalancedTags[i]);
                            }
                        }
                    }
                } while (childNode = childNode.nextSibling);
            }
        }
    };
})();
ko.exportSymbol('virtualElements', ko.virtualElements);
ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
//ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
//ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
(function() {
    var defaultBindingAttributeName = "data-bind";

    ko.bindingProvider = function() {
        this.bindingCache = {};
    };

    ko.utils.extend(ko.bindingProvider.prototype, {
        'nodeHasBindings': function(node) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName) != null;   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node) != null; // Comment node
                default: return false;
            }
        },

        'getBindings': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext);
            return bindingsString ? this['parseBindingsString'](bindingsString, bindingContext) : null;
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'getBindingsString': function(node, bindingContext) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
                default: return null;
            }
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'parseBindingsString': function(bindingsString, bindingContext) {
            try {
                var viewModel = bindingContext['$data'],
                    scopes = (typeof viewModel == 'object' && viewModel != null) ? [viewModel, bindingContext] : [bindingContext],
                    bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, scopes.length, this.bindingCache);
                return bindingFunction(scopes);
            } catch (ex) {
                throw new Error("Unable to parse bindings.\nMessage: " + ex + ";\nBindings value: " + bindingsString);
            }
        }
    });

    ko.bindingProvider['instance'] = new ko.bindingProvider();

    function createBindingsStringEvaluatorViaCache(bindingsString, scopesCount, cache) {
        var cacheKey = scopesCount + '_' + bindingsString;
        return cache[cacheKey]
            || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, scopesCount));
    }

    function createBindingsStringEvaluator(bindingsString, scopesCount) {
        var rewrittenBindings = " { " + ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson(bindingsString) + " } ";
        return ko.utils.buildEvalWithinScopeFunction(rewrittenBindings, scopesCount);
    }
})();

ko.exportSymbol('bindingProvider', ko.bindingProvider);
(function () {
    ko.bindingHandlers = {};

    ko.bindingContext = function(dataItem, parentBindingContext) {
        if (parentBindingContext) {
            ko.utils.extend(this, parentBindingContext); // Inherit $root and any custom properties
            this['$parentContext'] = parentBindingContext;
            this['$parent'] = parentBindingContext['$data'];
            this['$parents'] = (parentBindingContext['$parents'] || []).slice(0);
            this['$parents'].unshift(this['$parent']);
        } else {
            this['$parents'] = [];
            this['$root'] = dataItem;
        }
        this['$data'] = dataItem;
    }
    ko.bindingContext.prototype['createChildContext'] = function (dataItem) {
        return new ko.bindingContext(dataItem, this);
    };
    ko.bindingContext.prototype['extend'] = function(properties) {
        var clone = ko.utils.extend(new ko.bindingContext(), this);
        return ko.utils.extend(clone, properties);
    };

    function validateThatBindingIsAllowedForVirtualElements(bindingName) {
        var validator = ko.virtualElements.allowedBindings[bindingName];
        if (!validator)
            throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
    }

    function applyBindingsToDescendantsInternal (viewModel, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
        var currentChild, nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
        while (currentChild = nextInQueue) {
            // Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
            nextInQueue = ko.virtualElements.nextSibling(currentChild);
            applyBindingsToNodeAndDescendantsInternal(viewModel, currentChild, bindingContextsMayDifferFromDomParentElement);
        }
    }

    function applyBindingsToNodeAndDescendantsInternal (viewModel, nodeVerified, bindingContextMayDifferFromDomParentElement) {
        var shouldBindDescendants = true;

        // Perf optimisation: Apply bindings only if...
        // (1) We need to store the binding context on this node (because it may differ from the DOM parent node's binding context)
        //     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
        // (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
        var isElement = (nodeVerified.nodeType === 1);
        if (isElement) // Workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

        var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement)             // Case (1)
                               || ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);       // Case (2)
        if (shouldApplyBindings)
            shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, viewModel, bindingContextMayDifferFromDomParentElement).shouldBindDescendants;

        if (shouldBindDescendants) {
            // We're recursing automatically into (real or virtual) child nodes without changing binding contexts. So,
            //  * For children of a *real* element, the binding context is certainly the same as on their DOM .parentNode,
            //    hence bindingContextsMayDifferFromDomParentElement is false
            //  * For children of a *virtual* element, we can't be sure. Evaluating .parentNode on those children may
            //    skip over any number of intermediate virtual elements, any of which might define a custom binding context,
            //    hence bindingContextsMayDifferFromDomParentElement is true
            applyBindingsToDescendantsInternal(viewModel, nodeVerified, /* bindingContextsMayDifferFromDomParentElement: */ !isElement);
        }
    }

    function applyBindingsToNodeInternal (node, bindings, viewModelOrBindingContext, bindingContextMayDifferFromDomParentElement) {
        // Need to be sure that inits are only run once, and updates never run until all the inits have been run
        var initPhase = 0; // 0 = before all inits, 1 = during inits, 2 = after all inits

        // Each time the dependentObservable is evaluated (after data changes),
        // the binding attribute is reparsed so that it can pick out the correct
        // model properties in the context of the changed data.
        // DOM event callbacks need to be able to access this changed data,
        // so we need a single parsedBindings variable (shared by all callbacks
        // associated with this node's bindings) that all the closures can access.
        var parsedBindings;
        function makeValueAccessor(bindingKey) {
            return function () { return parsedBindings[bindingKey] }
        }
        function parsedBindingsAccessor() {
            return parsedBindings;
        }

        var bindingHandlerThatControlsDescendantBindings;
        ko.dependentObservable(
            function () {
                // Ensure we have a nonnull binding context to work with
                var bindingContextInstance = viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
                    ? viewModelOrBindingContext
                    : new ko.bindingContext(ko.utils.unwrapObservable(viewModelOrBindingContext));
                var viewModel = bindingContextInstance['$data'];

                // Optimization: Don't store the binding context on this node if it's definitely the same as on node.parentNode, because
                // we can easily recover it just by scanning up the node's ancestors in the DOM
                // (note: here, parent node means "real DOM parent" not "virtual parent", as there's no O(1) way to find the virtual parent)
                if (bindingContextMayDifferFromDomParentElement)
                    ko.storedBindingContextForNode(node, bindingContextInstance);

                // Use evaluatedBindings if given, otherwise fall back on asking the bindings provider to give us some bindings
                var evaluatedBindings = (typeof bindings == "function") ? bindings() : bindings;
                parsedBindings = evaluatedBindings || ko.bindingProvider['instance']['getBindings'](node, bindingContextInstance);

                if (parsedBindings) {
                    // First run all the inits, so bindings can register for notification on changes
                    if (initPhase === 0) {
                        initPhase = 1;
                        for (var bindingKey in parsedBindings) {
                            var binding = ko.bindingHandlers[bindingKey];
                            if (binding && node.nodeType === 8)
                                validateThatBindingIsAllowedForVirtualElements(bindingKey);

                            if (binding && typeof binding["init"] == "function") {
                                var handlerInitFn = binding["init"];
                                var initResult = handlerInitFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance);

                                // If this binding handler claims to control descendant bindings, make a note of this
                                if (initResult && initResult['controlsDescendantBindings']) {
                                    if (bindingHandlerThatControlsDescendantBindings !== undefined)
                                        throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                    bindingHandlerThatControlsDescendantBindings = bindingKey;
                                }
                            }
                        }
                        initPhase = 2;
                    }

                    // ... then run all the updates, which might trigger changes even on the first evaluation
                    if (initPhase === 2) {
                        for (var bindingKey in parsedBindings) {
                            var binding = ko.bindingHandlers[bindingKey];
                            if (binding && typeof binding["update"] == "function") {
                                var handlerUpdateFn = binding["update"];
                                handlerUpdateFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance);
                            }
                        }
                    }
                }
            },
            null,
            { 'disposeWhenNodeIsRemoved' : node }
        );

        return {
            shouldBindDescendants: bindingHandlerThatControlsDescendantBindings === undefined
        };
    };

    var storedBindingContextDomDataKey = "__ko_bindingContext__";
    ko.storedBindingContextForNode = function (node, bindingContext) {
        if (arguments.length == 2)
            ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
        else
            return ko.utils.domData.get(node, storedBindingContextDomDataKey);
    }

    ko.applyBindingsToNode = function (node, bindings, viewModel) {
        if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(node);
        return applyBindingsToNodeInternal(node, bindings, viewModel, true);
    };

    ko.applyBindingsToDescendants = function(viewModel, rootNode) {
        if (rootNode.nodeType === 1 || rootNode.nodeType === 8)
            applyBindingsToDescendantsInternal(viewModel, rootNode, true);
    };

    ko.applyBindings = function (viewModel, rootNode) {
        if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
            throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
        rootNode = rootNode || window.document.body; // Make "rootNode" parameter optional

        applyBindingsToNodeAndDescendantsInternal(viewModel, rootNode, true);
    };

    // Retrieving binding context from arbitrary nodes
    ko.contextFor = function(node) {
        // We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
        switch (node.nodeType) {
            case 1:
            case 8:
                var context = ko.storedBindingContextForNode(node);
                if (context) return context;
                if (node.parentNode) return ko.contextFor(node.parentNode);
                break;
        }
        return undefined;
    };
    ko.dataFor = function(node) {
        var context = ko.contextFor(node);
        return context ? context['$data'] : undefined;
    };

    ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
    ko.exportSymbol('applyBindings', ko.applyBindings);
    ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
    ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
    ko.exportSymbol('contextFor', ko.contextFor);
    ko.exportSymbol('dataFor', ko.dataFor);
})();
// For certain common events (currently just 'click'), allow a simplified data-binding syntax
// e.g. click:handler instead of the usual full-length event:{click:handler}
var eventHandlersWithShortcuts = ['click'];
ko.utils.arrayForEach(eventHandlersWithShortcuts, function(eventName) {
    ko.bindingHandlers[eventName] = {
        'init': function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var newValueAccessor = function () {
                var result = {};
                result[eventName] = valueAccessor();
                return result;
            };
            return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindingsAccessor, viewModel);
        }
    }
});


ko.bindingHandlers['event'] = {
    'init' : function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var eventsToHandle = valueAccessor() || {};
        for(var eventNameOutsideClosure in eventsToHandle) {
            (function() {
                var eventName = eventNameOutsideClosure; // Separate variable to be captured by event handler closure
                if (typeof eventName == "string") {
                    ko.utils.registerEventHandler(element, eventName, function (event) {
                        var handlerReturnValue;
                        var handlerFunction = valueAccessor()[eventName];
                        if (!handlerFunction)
                            return;
                        var allBindings = allBindingsAccessor();

                        try {
                            // Take all the event args, and prefix with the viewmodel
                            var argsForHandler = ko.utils.makeArray(arguments);
                            argsForHandler.unshift(viewModel);
                            handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                        } finally {
                            if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                                if (event.preventDefault)
                                    event.preventDefault();
                                else
                                    event.returnValue = false;
                            }
                        }

                        var bubble = allBindings[eventName + 'Bubble'] !== false;
                        if (!bubble) {
                            event.cancelBubble = true;
                            if (event.stopPropagation)
                                event.stopPropagation();
                        }
                    });
                }
            })();
        }
    }
};

ko.bindingHandlers['submit'] = {
    'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
        if (typeof valueAccessor() != "function")
            throw new Error("The value for a submit binding must be a function");
        ko.utils.registerEventHandler(element, "submit", function (event) {
            var handlerReturnValue;
            var value = valueAccessor();
            try { handlerReturnValue = value.call(viewModel, element); }
            finally {
                if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                }
            }
        });
    }
};

ko.bindingHandlers['visible'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var isCurrentlyVisible = !(element.style.display == "none");
        if (value && !isCurrentlyVisible)
            element.style.display = "";
        else if ((!value) && isCurrentlyVisible)
            element.style.display = "none";
    }
}

ko.bindingHandlers['enable'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value && element.disabled)
            element.removeAttribute("disabled");
        else if ((!value) && (!element.disabled))
            element.disabled = true;
    }
};

ko.bindingHandlers['disable'] = {
    'update': function (element, valueAccessor) {
        ko.bindingHandlers['enable']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) });
    }
};

function ensureDropdownSelectionIsConsistentWithModelValue(element, modelValue, preferModelValue) {
    if (preferModelValue) {
        if (modelValue !== ko.selectExtensions.readValue(element))
            ko.selectExtensions.writeValue(element, modelValue);
    }

    // No matter which direction we're syncing in, we want the end result to be equality between dropdown value and model value.
    // If they aren't equal, either we prefer the dropdown value, or the model value couldn't be represented, so either way,
    // change the model value to match the dropdown.
    if (modelValue !== ko.selectExtensions.readValue(element))
        ko.utils.triggerEvent(element, "change");
};

ko.bindingHandlers['value'] = {
    'init': function (element, valueAccessor, allBindingsAccessor) {
        // Always catch "change" event; possibly other events too if asked
        var eventsToCatch = ["change"];
        var requestedEventsToCatch = allBindingsAccessor()["valueUpdate"];
        if (requestedEventsToCatch) {
            if (typeof requestedEventsToCatch == "string") // Allow both individual event names, and arrays of event names
                requestedEventsToCatch = [requestedEventsToCatch];
            ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
            eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
        }

        var valueUpdateHandler = function() {
            var modelValue = valueAccessor();
            var elementValue = ko.selectExtensions.readValue(element);
            ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'value', elementValue, /* checkIfDifferent: */ true);
        }

        // Workaround for https://github.com/SteveSanderson/knockout/issues/122
        // IE doesn't fire "change" events on textboxes if the user selects a value from its autocomplete list
        var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text"
                                       && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
        if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
            var propertyChangedFired = false;
            ko.utils.registerEventHandler(element, "propertychange", function () { propertyChangedFired = true });
            ko.utils.registerEventHandler(element, "blur", function() {
                if (propertyChangedFired) {
                    propertyChangedFired = false;
                    valueUpdateHandler();
                }
            });
        }

        ko.utils.arrayForEach(eventsToCatch, function(eventName) {
            // The syntax "after<eventname>" means "run the handler asynchronously after the event"
            // This is useful, for example, to catch "keydown" events after the browser has updated the control
            // (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
            var handler = valueUpdateHandler;
            if (ko.utils.stringStartsWith(eventName, "after")) {
                handler = function() { setTimeout(valueUpdateHandler, 0) };
                eventName = eventName.substring("after".length);
            }
            ko.utils.registerEventHandler(element, eventName, handler);
        });
    },
    'update': function (element, valueAccessor) {
        var valueIsSelectOption = ko.utils.tagNameLower(element) === "select";
        var newValue = ko.utils.unwrapObservable(valueAccessor());
        var elementValue = ko.selectExtensions.readValue(element);
        var valueHasChanged = (newValue != elementValue);

        // JavaScript's 0 == "" behavious is unfortunate here as it prevents writing 0 to an empty text box (loose equality suggests the values are the same).
        // We don't want to do a strict equality comparison as that is more confusing for developers in certain cases, so we specifically special case 0 != "" here.
        if ((newValue === 0) && (elementValue !== 0) && (elementValue !== "0"))
            valueHasChanged = true;

        if (valueHasChanged) {
            var applyValueAction = function () { ko.selectExtensions.writeValue(element, newValue); };
            applyValueAction();

            // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
            // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
            // to apply the value as well.
            var alsoApplyAsynchronously = valueIsSelectOption;
            if (alsoApplyAsynchronously)
                setTimeout(applyValueAction, 0);
        }

        // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
        // because you're not allowed to have a model value that disagrees with a visible UI selection.
        if (valueIsSelectOption && (element.length > 0))
            ensureDropdownSelectionIsConsistentWithModelValue(element, newValue, /* preferModelValue */ false);
    }
};

ko.bindingHandlers['options'] = {
    'update': function (element, valueAccessor, allBindingsAccessor) {
        if (ko.utils.tagNameLower(element) !== "select")
            throw new Error("options binding applies only to SELECT elements");

        var selectWasPreviouslyEmpty = element.length == 0;
        var previousSelectedValues = ko.utils.arrayMap(ko.utils.arrayFilter(element.childNodes, function (node) {
            return node.tagName && (ko.utils.tagNameLower(node) === "option") && node.selected;
        }), function (node) {
            return ko.selectExtensions.readValue(node) || node.innerText || node.textContent;
        });
        var previousScrollTop = element.scrollTop;

        var value = ko.utils.unwrapObservable(valueAccessor());
        var selectedValue = element.value;

        // Remove all existing <option>s.
        // Need to use .remove() rather than .removeChild() for <option>s otherwise IE behaves oddly (https://github.com/SteveSanderson/knockout/issues/134)
        while (element.length > 0) {
            ko.cleanNode(element.options[0]);
            element.remove(0);
        }

        if (value) {
            var allBindings = allBindingsAccessor();
            if (typeof value.length != "number")
                value = [value];
            if (allBindings['optionsCaption']) {
                var option = document.createElement("option");
                ko.utils.setHtml(option, allBindings['optionsCaption']);
                ko.selectExtensions.writeValue(option, undefined);
                element.appendChild(option);
            }
            for (var i = 0, j = value.length; i < j; i++) {
                var option = document.createElement("option");

                // Apply a value to the option element
                var optionValue = typeof allBindings['optionsValue'] == "string" ? value[i][allBindings['optionsValue']] : value[i];
                optionValue = ko.utils.unwrapObservable(optionValue);
                ko.selectExtensions.writeValue(option, optionValue);

                // Apply some text to the option element
                var optionsTextValue = allBindings['optionsText'];
                var optionText;
                if (typeof optionsTextValue == "function")
                    optionText = optionsTextValue(value[i]); // Given a function; run it against the data value
                else if (typeof optionsTextValue == "string")
                    optionText = value[i][optionsTextValue]; // Given a string; treat it as a property name on the data value
                else
                    optionText = optionValue;				 // Given no optionsText arg; use the data value itself
                if ((optionText === null) || (optionText === undefined))
                    optionText = "";

                ko.utils.setTextContent(option, optionText);

                element.appendChild(option);
            }

            // IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
            // That's why we first added them without selection. Now it's time to set the selection.
            var newOptions = element.getElementsByTagName("option");
            var countSelectionsRetained = 0;
            for (var i = 0, j = newOptions.length; i < j; i++) {
                if (ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[i])) >= 0) {
                    ko.utils.setOptionNodeSelectionState(newOptions[i], true);
                    countSelectionsRetained++;
                }
            }

            element.scrollTop = previousScrollTop;

            if (selectWasPreviouslyEmpty && ('value' in allBindings)) {
                // Ensure consistency between model value and selected option.
                // If the dropdown is being populated for the first time here (or was otherwise previously empty),
                // the dropdown selection state is meaningless, so we preserve the model value.
                ensureDropdownSelectionIsConsistentWithModelValue(element, ko.utils.unwrapObservable(allBindings['value']), /* preferModelValue */ true);
            }

            // Workaround for IE9 bug
            ko.utils.ensureSelectElementIsRenderedCorrectly(element);
        }
    }
};
ko.bindingHandlers['options'].optionValueDomDataKey = '__ko.optionValueDomData__';

ko.bindingHandlers['selectedOptions'] = {
    getSelectedValuesFromSelectNode: function (selectNode) {
        var result = [];
        var nodes = selectNode.childNodes;
        for (var i = 0, j = nodes.length; i < j; i++) {
            var node = nodes[i], tagName = ko.utils.tagNameLower(node);
            if (tagName == "option" && node.selected)
                result.push(ko.selectExtensions.readValue(node));
            else if (tagName == "optgroup") {
                var selectedValuesFromOptGroup = ko.bindingHandlers['selectedOptions'].getSelectedValuesFromSelectNode(node);
                Array.prototype.splice.apply(result, [result.length, 0].concat(selectedValuesFromOptGroup)); // Add new entries to existing 'result' instance
            }
        }
        return result;
    },
    'init': function (element, valueAccessor, allBindingsAccessor) {
        ko.utils.registerEventHandler(element, "change", function () {
            var value = valueAccessor();
            var valueToWrite = ko.bindingHandlers['selectedOptions'].getSelectedValuesFromSelectNode(this);
            ko.jsonExpressionRewriting.writeValueToProperty(value, allBindingsAccessor, 'value', valueToWrite);
        });
    },
    'update': function (element, valueAccessor) {
        if (ko.utils.tagNameLower(element) != "select")
            throw new Error("values binding applies only to SELECT elements");

        var newValue = ko.utils.unwrapObservable(valueAccessor());
        if (newValue && typeof newValue.length == "number") {
            var nodes = element.childNodes;
            for (var i = 0, j = nodes.length; i < j; i++) {
                var node = nodes[i];
                if (ko.utils.tagNameLower(node) === "option")
                    ko.utils.setOptionNodeSelectionState(node, ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0);
            }
        }
    }
};

ko.bindingHandlers['text'] = {
    'update': function (element, valueAccessor) {
        ko.utils.setTextContent(element, valueAccessor());
    }
};

ko.bindingHandlers['html'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        ko.utils.setHtml(element, value);
    }
};

ko.bindingHandlers['css'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        for (var className in value) {
            if (typeof className == "string") {
                var shouldHaveClass = ko.utils.unwrapObservable(value[className]);
                ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
            }
        }
    }
};

ko.bindingHandlers['style'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        for (var styleName in value) {
            if (typeof styleName == "string") {
                var styleValue = ko.utils.unwrapObservable(value[styleName]);
                element.style[styleName] = styleValue || ""; // Empty string removes the value, whereas null/undefined have no effect
            }
        }
    }
};

ko.bindingHandlers['uniqueName'] = {
    'init': function (element, valueAccessor) {
        if (valueAccessor()) {
            element.name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);

            // Workaround IE 6/7 issue
            // - https://github.com/SteveSanderson/knockout/issues/197
            // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
            if (ko.utils.isIe6 || ko.utils.isIe7)
                element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
        }
    }
};
ko.bindingHandlers['uniqueName'].currentIndex = 0;

ko.bindingHandlers['checked'] = {
    'init': function (element, valueAccessor, allBindingsAccessor) {
        var updateHandler = function() {
            var valueToWrite;
            if (element.type == "checkbox") {
                valueToWrite = element.checked;
            } else if ((element.type == "radio") && (element.checked)) {
                valueToWrite = element.value;
            } else {
                return; // "checked" binding only responds to checkboxes and selected radio buttons
            }

            var modelValue = valueAccessor();
            if ((element.type == "checkbox") && (ko.utils.unwrapObservable(modelValue) instanceof Array)) {
                // For checkboxes bound to an array, we add/remove the checkbox value to that array
                // This works for both observable and non-observable arrays
                var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.unwrapObservable(modelValue), element.value);
                if (element.checked && (existingEntryIndex < 0))
                    modelValue.push(element.value);
                else if ((!element.checked) && (existingEntryIndex >= 0))
                    modelValue.splice(existingEntryIndex, 1);
            } else {
                ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'checked', valueToWrite, true);
            }
        };
        ko.utils.registerEventHandler(element, "click", updateHandler);

        // IE 6 won't allow radio buttons to be selected unless they have a name
        if ((element.type == "radio") && !element.name)
            ko.bindingHandlers['uniqueName']['init'](element, function() { return true });
    },
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());

        if (element.type == "checkbox") {
            if (value instanceof Array) {
                // When bound to an array, the checkbox being checked represents its value being present in that array
                element.checked = ko.utils.arrayIndexOf(value, element.value) >= 0;
            } else {
                // When bound to anything other value (not an array), the checkbox being checked represents the value being trueish
                element.checked = value;
            }
        } else if (element.type == "radio") {
            element.checked = (element.value == value);
        }
    }
};

var attrHtmlToJavascriptMap = { 'class': 'className', 'for': 'htmlFor' };
ko.bindingHandlers['attr'] = {
    'update': function(element, valueAccessor, allBindingsAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()) || {};
        for (var attrName in value) {
            if (typeof attrName == "string") {
                var attrValue = ko.utils.unwrapObservable(value[attrName]);

                // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
                // when someProp is a "no value"-like value (strictly null, false, or undefined)
                // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
                var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
                if (toRemove)
                    element.removeAttribute(attrName);

                // In IE <= 7 and IE8 Quirks Mode, you have to use the Javascript property name instead of the
                // HTML attribute name for certain attributes. IE8 Standards Mode supports the correct behavior,
                // but instead of figuring out the mode, we'll just set the attribute through the Javascript
                // property for IE <= 8.
                if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
                    attrName = attrHtmlToJavascriptMap[attrName];
                    if (toRemove)
                        element.removeAttribute(attrName);
                    else
                        element[attrName] = attrValue;
                } else if (!toRemove) {
                    element.setAttribute(attrName, attrValue.toString());
                }
            }
        }
    }
};

ko.bindingHandlers['hasfocus'] = {
    'init': function(element, valueAccessor, allBindingsAccessor) {
        var writeValue = function(valueToWrite) {
            var modelValue = valueAccessor();
            ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'hasfocus', valueToWrite, true);
        };
        ko.utils.registerEventHandler(element, "focus", function() { writeValue(true) });
        ko.utils.registerEventHandler(element, "focusin", function() { writeValue(true) }); // For IE
        ko.utils.registerEventHandler(element, "blur",  function() { writeValue(false) });
        ko.utils.registerEventHandler(element, "focusout",  function() { writeValue(false) }); // For IE
    },
    'update': function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        value ? element.focus() : element.blur();
        ko.utils.triggerEvent(element, value ? "focusin" : "focusout"); // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
    }
};

// "with: someExpression" is equivalent to "template: { if: someExpression, data: someExpression }"
ko.bindingHandlers['with'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() { var value = valueAccessor(); return { 'if': value, 'data': value, 'templateEngine': ko.nativeTemplateEngine.instance } };
    },
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['with'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['with'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.jsonExpressionRewriting.bindingRewriteValidators['with'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['with'] = true;

// "if: someExpression" is equivalent to "template: { if: someExpression }"
ko.bindingHandlers['if'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() { return { 'if': valueAccessor(), 'templateEngine': ko.nativeTemplateEngine.instance } };
    },
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['if'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['if'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.jsonExpressionRewriting.bindingRewriteValidators['if'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['if'] = true;

// "ifnot: someExpression" is equivalent to "template: { ifnot: someExpression }"
ko.bindingHandlers['ifnot'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() { return { 'ifnot': valueAccessor(), 'templateEngine': ko.nativeTemplateEngine.instance } };
    },
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['ifnot'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['ifnot'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.jsonExpressionRewriting.bindingRewriteValidators['ifnot'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['ifnot'] = true;

// "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
// "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
ko.bindingHandlers['foreach'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() {
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());

            // If bindingValue is the array, just pass it on its own
            if ((!bindingValue) || typeof bindingValue.length == "number")
                return { 'foreach': bindingValue, 'templateEngine': ko.nativeTemplateEngine.instance };

            // If bindingValue.data is the array, preserve all relevant options
            return {
                'foreach': bindingValue['data'],
                'includeDestroyed': bindingValue['includeDestroyed'],
                'afterAdd': bindingValue['afterAdd'],
                'beforeRemove': bindingValue['beforeRemove'],
                'afterRender': bindingValue['afterRender'],
                'templateEngine': ko.nativeTemplateEngine.instance
            };
        };
    },
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.jsonExpressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['foreach'] = true;
// If you want to make a custom template engine,
//
// [1] Inherit from this class (like ko.nativeTemplateEngine does)
// [2] Override 'renderTemplateSource', supplying a function with this signature:
//
//        function (templateSource, bindingContext, options) {
//            // - templateSource.text() is the text of the template you should render
//            // - bindingContext.$data is the data you should pass into the template
//            //   - you might also want to make bindingContext.$parent, bindingContext.$parents,
//            //     and bindingContext.$root available in the template too
//            // - options gives you access to any other properties set on "data-bind: { template: options }"
//            //
//            // Return value: an array of DOM nodes
//        }
//
// [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
//
//        function (script) {
//            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
//            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }'
//        }
//
//     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
//     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
//     and then you don't need to override 'createJavaScriptEvaluatorBlock'.

ko.templateEngine = function () { };

ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    throw new Error("Override renderTemplateSource");
};

ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
    throw new Error("Override createJavaScriptEvaluatorBlock");
};

ko.templateEngine.prototype['makeTemplateSource'] = function(template, templateDocument) {
    // Named template
    if (typeof template == "string") {
        templateDocument = templateDocument || document;
        var elem = templateDocument.getElementById(template);
        if (!elem)
            throw new Error("Cannot find template with ID " + template);
        return new ko.templateSources.domElement(elem);
    } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
        // Anonymous template
        return new ko.templateSources.anonymousTemplate(template);
    } else
        throw new Error("Unknown template type: " + template);
};

ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    return this['renderTemplateSource'](templateSource, bindingContext, options);
};

ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {
    // Skip rewriting if requested
    if (this['allowTemplateRewriting'] === false)
        return true;

    // Perf optimisation - see below
    var templateIsInExternalDocument = templateDocument && templateDocument != document;
    if (!templateIsInExternalDocument && this.knownRewrittenTemplates && this.knownRewrittenTemplates[template])
        return true;

    return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
};

ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    var rewritten = rewriterCallback(templateSource['text']());
    templateSource['text'](rewritten);
    templateSource['data']("isRewritten", true);

    // Perf optimisation - for named templates, track which ones have been rewritten so we can
    // answer 'isTemplateRewritten' *without* having to use getElementById (which is slow on IE < 8)
    //
    // Note that we only cache the status for templates in the main document, because caching on a per-doc
    // basis complicates the implementation excessively. In a future version of KO, we will likely remove
    // this 'isRewritten' cache entirely anyway, because the benefit is extremely minor and only applies
    // to rewritable templates, which are pretty much deprecated since KO 2.0.
    var templateIsInExternalDocument = templateDocument && templateDocument != document;
    if (!templateIsInExternalDocument && typeof template == "string") {
        this.knownRewrittenTemplates = this.knownRewrittenTemplates || {};
        this.knownRewrittenTemplates[template] = true;
    }
};

ko.exportSymbol('templateEngine', ko.templateEngine);

ko.templateRewriting = (function () {
    var memoizeDataBindingAttributeSyntaxRegex = /(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9\-]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi;
    var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

    function validateDataBindValuesForRewriting(keyValueArray) {
        var allValidators = ko.jsonExpressionRewriting.bindingRewriteValidators;
        for (var i = 0; i < keyValueArray.length; i++) {
            var key = keyValueArray[i]['key'];
            if (allValidators.hasOwnProperty(key)) {
                var validator = allValidators[key];

                if (typeof validator === "function") {
                    var possibleErrorMessage = validator(keyValueArray[i]['value']);
                    if (possibleErrorMessage)
                        throw new Error(possibleErrorMessage);
                } else if (!validator) {
                    throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                }
            }
        }
    }

    function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, templateEngine) {
        var dataBindKeyValueArray = ko.jsonExpressionRewriting.parseObjectLiteral(dataBindAttributeValue);
        validateDataBindValuesForRewriting(dataBindKeyValueArray);
        var rewrittenDataBindAttributeValue = ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson(dataBindKeyValueArray);

        // For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional
        // anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this
        // extra indirection.
        var applyBindingsToNextSiblingScript = "ko.templateRewriting.applyMemoizedBindingsToNextSibling(function() { \
            return (function() { return { " + rewrittenDataBindAttributeValue + " } })() \
        })";
        return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
    }

    return {
        ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
            if (!templateEngine['isTemplateRewritten'](template, templateDocument))
                templateEngine['rewriteTemplate'](template, function (htmlString) {
                    return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                }, templateDocument);
        },

        memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
            return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[6], /* tagToRetain: */ arguments[1], templateEngine);
            }).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", templateEngine);
            });
        },

        applyMemoizedBindingsToNextSibling: function (bindings) {
            return ko.memoization.memoize(function (domNode, bindingContext) {
                if (domNode.nextSibling)
                    ko.applyBindingsToNode(domNode.nextSibling, bindings, bindingContext);
            });
        }
    }
})();

ko.exportSymbol('templateRewriting', ko.templateRewriting);
ko.exportSymbol('templateRewriting.applyMemoizedBindingsToNextSibling', ko.templateRewriting.applyMemoizedBindingsToNextSibling); // Exported only because it has to be referenced by string lookup from within rewritten template
(function() {
    // A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
    // logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
    //
    // Two are provided by default:
    //  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
    //  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but
    //                                           without reading/writing the actual element text content, since it will be overwritten
    //                                           with the rendered template output.
    // You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
    // Template sources need to have the following functions:
    //   text() 			- returns the template text from your storage location
    //   text(value)		- writes the supplied template text to your storage location
    //   data(key)			- reads values stored using data(key, value) - see below
    //   data(key, value)	- associates "value" with this template and the key "key". Is used to store information like "isRewritten".
    //
    // Optionally, template sources can also have the following functions:
    //   nodes()            - returns a DOM element containing the nodes of this template, where available
    //   nodes(value)       - writes the given DOM element to your storage location
    // If a DOM element is available for a given template source, template engines are encouraged to use it in preference over text()
    // for improved speed. However, all templateSources must supply text() even if they don't supply nodes().
    //
    // Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
    // using and overriding "makeTemplateSource" to return an instance of your custom template source.

    ko.templateSources = {};

    // ---- ko.templateSources.domElement -----

    ko.templateSources.domElement = function(element) {
        this.domElement = element;
    }

    ko.templateSources.domElement.prototype['text'] = function(/* valueToWrite */) {
        var tagNameLower = ko.utils.tagNameLower(this.domElement),
            elemContentsProperty = tagNameLower === "script" ? "text"
                                 : tagNameLower === "textarea" ? "value"
                                 : "innerHTML";

        if (arguments.length == 0) {
            return this.domElement[elemContentsProperty];
        } else {
            var valueToWrite = arguments[0];
            if (elemContentsProperty === "innerHTML")
                ko.utils.setHtml(this.domElement, valueToWrite);
            else
                this.domElement[elemContentsProperty] = valueToWrite;
        }
    };

    ko.templateSources.domElement.prototype['data'] = function(key /*, valueToWrite */) {
        if (arguments.length === 1) {
            return ko.utils.domData.get(this.domElement, "templateSourceData_" + key);
        } else {
            ko.utils.domData.set(this.domElement, "templateSourceData_" + key, arguments[1]);
        }
    };

    // ---- ko.templateSources.anonymousTemplate -----
    // Anonymous templates are normally saved/retrieved as DOM nodes through "nodes".
    // For compatibility, you can also read "text"; it will be serialized from the nodes on demand.
    // Writing to "text" is still supported, but then the template data will not be available as DOM nodes.

    var anonymousTemplatesDomDataKey = "__ko_anon_template__";
    ko.templateSources.anonymousTemplate = function(element) {
        this.domElement = element;
    }
    ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
    ko.templateSources.anonymousTemplate.prototype['text'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            if (templateData.textData === undefined && templateData.containerData)
                templateData.textData = templateData.containerData.innerHTML;
            return templateData.textData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {textData: valueToWrite});
        }
    };
    ko.templateSources.domElement.prototype['nodes'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            return templateData.containerData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {containerData: valueToWrite});
        }
    };

    ko.exportSymbol('templateSources', ko.templateSources);
    ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
    ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
})();
(function () {
    var _templateEngine;
    ko.setTemplateEngine = function (templateEngine) {
        if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
            throw new Error("templateEngine must inherit from ko.templateEngine");
        _templateEngine = templateEngine;
    }

    function invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, action) {
        var node, nextInQueue = firstNode, firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
        while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
            nextInQueue = ko.virtualElements.nextSibling(node);
            if (node.nodeType === 1 || node.nodeType === 8)
                action(node);
        }
    }

    function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
        // To be used on any nodes that have been rendered by a template and have been inserted into some parent element
        // Walks through continuousNodeArray (which *must* be continuous, i.e., an uninterrupted sequence of sibling nodes, because
        // the algorithm for walking them relies on this), and for each top-level item in the virtual-element sense,
        // (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
        // (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)

        if (continuousNodeArray.length) {
            var firstNode = continuousNodeArray[0], lastNode = continuousNodeArray[continuousNodeArray.length - 1];

            // Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
            // whereas a regular applyBindings won't introduce new memoized nodes
            invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, function(node) {
                ko.applyBindings(bindingContext, node);
            });
            invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, function(node) {
                ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
            });
        }
    }

    function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
        return nodeOrNodeArray.nodeType ? nodeOrNodeArray
                                        : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
                                        : null;
    }

    function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
        options = options || {};
        var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
        var templateDocument = firstTargetNode && firstTargetNode.ownerDocument;
        var templateEngineToUse = (options['templateEngine'] || _templateEngine);
        ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
        var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);

        // Loosely check result is an array of DOM nodes
        if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
            throw new Error("Template engine must return an array of DOM nodes");

        var haveAddedNodesToParent = false;
        switch (renderMode) {
            case "replaceChildren":
                ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "replaceNode":
                ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "ignoreTargetNode": break;
            default:
                throw new Error("Unknown renderMode: " + renderMode);
        }

        if (haveAddedNodesToParent) {
            activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
            if (options['afterRender'])
                options['afterRender'](renderedNodesArray, bindingContext['$data']);
        }

        return renderedNodesArray;
    }

    ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
        options = options || {};
        if ((options['templateEngine'] || _templateEngine) == undefined)
            throw new Error("Set a template engine before calling renderTemplate");
        renderMode = renderMode || "replaceChildren";

        if (targetNodeOrNodeArray) {
            var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

            var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); }; // Passive disposal (on next evaluation)
            var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

            return ko.dependentObservable( // So the DOM is automatically updated when any dependency changes
                function () {
                    // Ensure we've got a proper binding context to work with
                    var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
                        ? dataOrBindingContext
                        : new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));

                    // Support selecting template as a function of the data being rendered
                    var templateName = typeof(template) == 'function' ? template(bindingContext['$data']) : template;

                    var renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);
                    if (renderMode == "replaceNode") {
                        targetNodeOrNodeArray = renderedNodesArray;
                        firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                    }
                },
                null,
                { 'disposeWhen': whenToDispose, 'disposeWhenNodeIsRemoved': activelyDisposeWhenNodeIsRemoved }
            );
        } else {
            // We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
            return ko.memoization.memoize(function (domNode) {
                ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
            });
        }
    };

    ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
        // Since setDomNodeChildrenFromArrayMapping always calls executeTemplateForArrayItem and then
        // activateBindingsCallback for added items, we can store the binding context in the former to use in the latter.
        var arrayItemContext;

        // This will be called by setDomNodeChildrenFromArrayMapping to get the nodes to add to targetNode
        var executeTemplateForArrayItem = function (arrayValue, index) {
            // Support selecting template as a function of the data being rendered
            var templateName = typeof(template) == 'function' ? template(arrayValue) : template;
            arrayItemContext = parentBindingContext['createChildContext'](ko.utils.unwrapObservable(arrayValue));
            arrayItemContext['$index'] = index;
            return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
        }

        // This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
        var activateBindingsCallback = function(arrayValue, addedNodesArray, index) {
            activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
            if (options['afterRender'])
                options['afterRender'](addedNodesArray, arrayValue);
        };

        return ko.dependentObservable(function () {
            var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            ko.utils.setDomNodeChildrenFromArrayMapping(targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback);

        }, null, { 'disposeWhenNodeIsRemoved': targetNode });
    };

    var templateSubscriptionDomDataKey = '__ko__templateSubscriptionDomDataKey__';
    function disposeOldSubscriptionAndStoreNewOne(element, newSubscription) {
        var oldSubscription = ko.utils.domData.get(element, templateSubscriptionDomDataKey);
        if (oldSubscription && (typeof(oldSubscription.dispose) == 'function'))
            oldSubscription.dispose();
        ko.utils.domData.set(element, templateSubscriptionDomDataKey, newSubscription);
    }

    ko.bindingHandlers['template'] = {
        'init': function(element, valueAccessor) {
            // Support anonymous templates
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
            if ((typeof bindingValue != "string") && (!bindingValue['name']) && (element.nodeType == 1 || element.nodeType == 8)) {
                // It's an anonymous template - store the element contents, then clear the element
                var templateNodes = element.nodeType == 1 ? element.childNodes : ko.virtualElements.childNodes(element),
                    container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
                new ko.templateSources.anonymousTemplate(element)['nodes'](container);
            }
            return { 'controlsDescendantBindings': true };
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
            var templateName;
            var shouldDisplay = true;

            if (typeof bindingValue == "string") {
                templateName = bindingValue;
            } else {
                templateName = bindingValue['name'];

                // Support "if"/"ifnot" conditions
                if ('if' in bindingValue)
                    shouldDisplay = shouldDisplay && ko.utils.unwrapObservable(bindingValue['if']);
                if ('ifnot' in bindingValue)
                    shouldDisplay = shouldDisplay && !ko.utils.unwrapObservable(bindingValue['ifnot']);
            }

            var templateSubscription = null;

            if ((typeof bindingValue === 'object') && ('foreach' in bindingValue)) { // Note: can't use 'in' operator on strings
                // Render once for each data point (treating data set as empty if shouldDisplay==false)
                var dataArray = (shouldDisplay && bindingValue['foreach']) || [];
                templateSubscription = ko.renderTemplateForEach(templateName || element, dataArray, /* options: */ bindingValue, element, bindingContext);
            } else {
                if (shouldDisplay) {
                    // Render once for this single data point (or use the viewModel if no data was provided)
                    var innerBindingContext = (typeof bindingValue == 'object') && ('data' in bindingValue)
                        ? bindingContext['createChildContext'](ko.utils.unwrapObservable(bindingValue['data'])) // Given an explitit 'data' value, we create a child binding context for it
                        : bindingContext;                                                                       // Given no explicit 'data' value, we retain the same binding context
                    templateSubscription = ko.renderTemplate(templateName || element, innerBindingContext, /* options: */ bindingValue, element);
                } else
                    ko.virtualElements.emptyNode(element);
            }

            // It only makes sense to have a single template subscription per element (otherwise which one should have its output displayed?)
            disposeOldSubscriptionAndStoreNewOne(element, templateSubscription);
        }
    };

    // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
    ko.jsonExpressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
        var parsedBindingValue = ko.jsonExpressionRewriting.parseObjectLiteral(bindingValue);

        if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
            return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)

        if (ko.jsonExpressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
            return null; // Named templates can be rewritten, so return "no error"
        return "This template engine does not support anonymous templates nested within its templates";
    };

    ko.virtualElements.allowedBindings['template'] = true;
})();

ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
ko.exportSymbol('renderTemplate', ko.renderTemplate);

(function () {
    // Simple calculation based on Levenshtein distance.
    function calculateEditDistanceMatrix(oldArray, newArray, maxAllowedDistance) {
        var distances = [];
        for (var i = 0; i <= newArray.length; i++)
            distances[i] = [];

        // Top row - transform old array into empty array via deletions
        for (var i = 0, j = Math.min(oldArray.length, maxAllowedDistance); i <= j; i++)
            distances[0][i] = i;

        // Left row - transform empty array into new array via additions
        for (var i = 1, j = Math.min(newArray.length, maxAllowedDistance); i <= j; i++) {
            distances[i][0] = i;
        }

        // Fill out the body of the array
        var oldIndex, oldIndexMax = oldArray.length, newIndex, newIndexMax = newArray.length;
        var distanceViaAddition, distanceViaDeletion;
        for (oldIndex = 1; oldIndex <= oldIndexMax; oldIndex++) {
            var newIndexMinForRow = Math.max(1, oldIndex - maxAllowedDistance);
            var newIndexMaxForRow = Math.min(newIndexMax, oldIndex + maxAllowedDistance);
            for (newIndex = newIndexMinForRow; newIndex <= newIndexMaxForRow; newIndex++) {
                if (oldArray[oldIndex - 1] === newArray[newIndex - 1])
                    distances[newIndex][oldIndex] = distances[newIndex - 1][oldIndex - 1];
                else {
                    var northDistance = distances[newIndex - 1][oldIndex] === undefined ? Number.MAX_VALUE : distances[newIndex - 1][oldIndex] + 1;
                    var westDistance = distances[newIndex][oldIndex - 1] === undefined ? Number.MAX_VALUE : distances[newIndex][oldIndex - 1] + 1;
                    distances[newIndex][oldIndex] = Math.min(northDistance, westDistance);
                }
            }
        }

        return distances;
    }

    function findEditScriptFromEditDistanceMatrix(editDistanceMatrix, oldArray, newArray) {
        var oldIndex = oldArray.length;
        var newIndex = newArray.length;
        var editScript = [];
        var maxDistance = editDistanceMatrix[newIndex][oldIndex];
        if (maxDistance === undefined)
            return null; // maxAllowedDistance must be too small
        while ((oldIndex > 0) || (newIndex > 0)) {
            var me = editDistanceMatrix[newIndex][oldIndex];
            var distanceViaAdd = (newIndex > 0) ? editDistanceMatrix[newIndex - 1][oldIndex] : maxDistance + 1;
            var distanceViaDelete = (oldIndex > 0) ? editDistanceMatrix[newIndex][oldIndex - 1] : maxDistance + 1;
            var distanceViaRetain = (newIndex > 0) && (oldIndex > 0) ? editDistanceMatrix[newIndex - 1][oldIndex - 1] : maxDistance + 1;
            if ((distanceViaAdd === undefined) || (distanceViaAdd < me - 1)) distanceViaAdd = maxDistance + 1;
            if ((distanceViaDelete === undefined) || (distanceViaDelete < me - 1)) distanceViaDelete = maxDistance + 1;
            if (distanceViaRetain < me - 1) distanceViaRetain = maxDistance + 1;

            if ((distanceViaAdd <= distanceViaDelete) && (distanceViaAdd < distanceViaRetain)) {
                editScript.push({ status: "added", value: newArray[newIndex - 1] });
                newIndex--;
            } else if ((distanceViaDelete < distanceViaAdd) && (distanceViaDelete < distanceViaRetain)) {
                editScript.push({ status: "deleted", value: oldArray[oldIndex - 1] });
                oldIndex--;
            } else {
                editScript.push({ status: "retained", value: oldArray[oldIndex - 1] });
                newIndex--;
                oldIndex--;
            }
        }
        return editScript.reverse();
    }

    ko.utils.compareArrays = function (oldArray, newArray, maxEditsToConsider) {
        if (maxEditsToConsider === undefined) {
            return ko.utils.compareArrays(oldArray, newArray, 1)                 // First consider likely case where there is at most one edit (very fast)
                || ko.utils.compareArrays(oldArray, newArray, 10)                // If that fails, account for a fair number of changes while still being fast
                || ko.utils.compareArrays(oldArray, newArray, Number.MAX_VALUE); // Ultimately give the right answer, even though it may take a long time
        } else {
            oldArray = oldArray || [];
            newArray = newArray || [];
            var editDistanceMatrix = calculateEditDistanceMatrix(oldArray, newArray, maxEditsToConsider);
            return findEditScriptFromEditDistanceMatrix(editDistanceMatrix, oldArray, newArray);
        }
    };
})();

ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);

(function () {
    // Objective:
    // * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
    //   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
    // * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
    //   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
    //   previously mapped - retain those nodes, and just insert/delete other ones

    // "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
    // You can use this, for example, to activate bindings on those nodes.

    function fixUpVirtualElements(contiguousNodeArray) {
        // Ensures that contiguousNodeArray really *is* an array of contiguous siblings, even if some of the interior
        // ones have changed since your array was first built (e.g., because your array contains virtual elements, and
        // their virtual children changed when binding was applied to them).
        // This is needed so that we can reliably remove or update the nodes corresponding to a given array item

        if (contiguousNodeArray.length > 2) {
            // Build up the actual new contiguous node set
            var current = contiguousNodeArray[0], last = contiguousNodeArray[contiguousNodeArray.length - 1], newContiguousSet = [current];
            while (current !== last) {
                current = current.nextSibling;
                if (!current) // Won't happen, except if the developer has manually removed some DOM elements (then we're in an undefined scenario)
                    return;
                newContiguousSet.push(current);
            }

            // ... then mutate the input array to match this.
            // (The following line replaces the contents of contiguousNodeArray with newContiguousSet)
            Array.prototype.splice.apply(contiguousNodeArray, [0, contiguousNodeArray.length].concat(newContiguousSet));
        }
    }

    function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
        // Map this array value inside a dependentObservable so we re-map when any dependency changes
        var mappedNodes = [];
        var dependentObservable = ko.dependentObservable(function() {
            var newMappedNodes = mapping(valueToMap, index) || [];

            // On subsequent evaluations, just replace the previously-inserted DOM nodes
            if (mappedNodes.length > 0) {
                fixUpVirtualElements(mappedNodes);
                ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
                if (callbackAfterAddingNodes)
                    callbackAfterAddingNodes(valueToMap, newMappedNodes);
            }

            // Replace the contents of the mappedNodes array, thereby updating the record
            // of which nodes would be deleted if valueToMap was itself later removed
            mappedNodes.splice(0, mappedNodes.length);
            ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
        }, null, { 'disposeWhenNodeIsRemoved': containerNode, 'disposeWhen': function() { return (mappedNodes.length == 0) || !ko.utils.domNodeIsAttachedToDocument(mappedNodes[0]) } });
        return { mappedNodes : mappedNodes, dependentObservable : dependentObservable };
    }

    var lastMappingResultDomDataKey = "setDomNodeChildrenFromArrayMapping_lastMappingResult";

    ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
        // Compare the provided array against the previous one
        array = array || [];
        options = options || {};
        var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
        var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
        var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; });
        var editScript = ko.utils.compareArrays(lastArray, array);

        // Build the new mapping result
        var newMappingResult = [];
        var lastMappingResultIndex = 0;
        var nodesToDelete = [];
        var newMappingResultIndex = 0;
        var nodesAdded = [];
        var insertAfterNode = null;
        for (var i = 0, j = editScript.length; i < j; i++) {
            switch (editScript[i].status) {
                case "retained":
                    // Just keep the information - don't touch the nodes
                    var dataToRetain = lastMappingResult[lastMappingResultIndex];
                    dataToRetain.indexObservable(newMappingResultIndex);
                    newMappingResultIndex = newMappingResult.push(dataToRetain);
                    if (dataToRetain.domNodes.length > 0)
                        insertAfterNode = dataToRetain.domNodes[dataToRetain.domNodes.length - 1];
                    lastMappingResultIndex++;
                    break;

                case "deleted":
                    // Stop tracking changes to the mapping for these nodes
                    lastMappingResult[lastMappingResultIndex].dependentObservable.dispose();

                    // Queue these nodes for later removal
                    fixUpVirtualElements(lastMappingResult[lastMappingResultIndex].domNodes);
                    ko.utils.arrayForEach(lastMappingResult[lastMappingResultIndex].domNodes, function (node) {
                        nodesToDelete.push({
                          element: node,
                          index: i,
                          value: editScript[i].value
                        });
                        insertAfterNode = node;
                    });
                    lastMappingResultIndex++;
                    break;

                case "added":
                    var valueToMap = editScript[i].value;
                    var indexObservable = ko.observable(newMappingResultIndex);
                    var mapData = mapNodeAndRefreshWhenChanged(domNode, mapping, valueToMap, callbackAfterAddingNodes, indexObservable);
                    var mappedNodes = mapData.mappedNodes;

                    // On the first evaluation, insert the nodes at the current insertion point
                    newMappingResultIndex = newMappingResult.push({
                        arrayEntry: editScript[i].value,
                        domNodes: mappedNodes,
                        dependentObservable: mapData.dependentObservable,
                        indexObservable: indexObservable
                    });
                    for (var nodeIndex = 0, nodeIndexMax = mappedNodes.length; nodeIndex < nodeIndexMax; nodeIndex++) {
                        var node = mappedNodes[nodeIndex];
                        nodesAdded.push({
                          element: node,
                          index: i,
                          value: editScript[i].value
                        });
                        if (insertAfterNode == null) {
                            // Insert "node" (the newly-created node) as domNode's first child
                            ko.virtualElements.prepend(domNode, node);
                        } else {
                            // Insert "node" into "domNode" immediately after "insertAfterNode"
                            ko.virtualElements.insertAfter(domNode, node, insertAfterNode);
                        }
                        insertAfterNode = node;
                    }
                    if (callbackAfterAddingNodes)
                        callbackAfterAddingNodes(valueToMap, mappedNodes, indexObservable);
                    break;
            }
        }

        ko.utils.arrayForEach(nodesToDelete, function (node) { ko.cleanNode(node.element) });

        var invokedBeforeRemoveCallback = false;
        if (!isFirstExecution) {
            if (options['afterAdd']) {
                for (var i = 0; i < nodesAdded.length; i++)
                    options['afterAdd'](nodesAdded[i].element, nodesAdded[i].index, nodesAdded[i].value);
            }
            if (options['beforeRemove']) {
                for (var i = 0; i < nodesToDelete.length; i++)
                    options['beforeRemove'](nodesToDelete[i].element, nodesToDelete[i].index, nodesToDelete[i].value);
                invokedBeforeRemoveCallback = true;
            }
        }
        if (!invokedBeforeRemoveCallback && nodesToDelete.length) {
            for (var i = 0; i < nodesToDelete.length; i++) {
                var element = nodesToDelete[i].element;
                if (element.parentNode)
                    element.parentNode.removeChild(element);
            }
        }

        // Store a copy of the array items we just considered so we can difference it next time
        ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);
    }
})();

ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
ko.nativeTemplateEngine = function () {
    this['allowTemplateRewriting'] = false;
}

ko.nativeTemplateEngine.prototype = new ko.templateEngine();
ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    var useNodesIfAvailable = !(ko.utils.ieVersion < 9), // IE<9 cloneNode doesn't work properly
        templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
        templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

    if (templateNodes) {
        return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
    } else {
        var templateText = templateSource['text']();
        return ko.utils.parseHtmlFragment(templateText);
    }
};

ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
(function() {
    ko.jqueryTmplTemplateEngine = function () {
        // Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
        // doesn't expose a version number, so we have to infer it.
        // Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
        // which KO internally refers to as version "2", so older versions are no longer detected.
        var jQueryTmplVersion = this.jQueryTmplVersion = (function() {
            if ((typeof(jQuery) == "undefined") || !(jQuery['tmpl']))
                return 0;
            // Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
            try {
                if (jQuery['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                    // Since 1.0.0pre, custom tags should append markup to an array called "__"
                    return 2; // Final version of jquery.tmpl
                }
            } catch(ex) { /* Apparently not the version we were looking for */ }

            return 1; // Any older version that we don't support
        })();

        function ensureHasReferencedJQueryTemplates() {
            if (jQueryTmplVersion < 2)
                throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
        }

        function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
            return jQuery['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
        }

        this['renderTemplateSource'] = function(templateSource, bindingContext, options) {
            options = options || {};
            ensureHasReferencedJQueryTemplates();

            // Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
            var precompiled = templateSource['data']('precompiled');
            if (!precompiled) {
                var templateText = templateSource['text']() || "";
                // Wrap in "with($whatever.koBindingContext) { ... }"
                templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

                precompiled = jQuery['template'](null, templateText);
                templateSource['data']('precompiled', precompiled);
            }

            var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
            var jQueryTemplateOptions = jQuery['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);

            var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
            resultNodes['appendTo'](document.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work

            jQuery['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
            return resultNodes;
        };

        this['createJavaScriptEvaluatorBlock'] = function(script) {
            return "{{ko_code ((function() { return " + script + " })()) }}";
        };

        this['addTemplate'] = function(templateName, templateMarkup) {
            document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "</script>");
        };

        if (jQueryTmplVersion > 0) {
            jQuery['tmpl']['tag']['ko_code'] = {
                open: "__.push($1 || '');"
            };
            jQuery['tmpl']['tag']['ko_with'] = {
                open: "with($1) {",
                close: "} "
            };
        }
    };

    ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();

    // Use this one by default *only if jquery.tmpl is referenced*
    var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
    if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
        ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

    ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
})();
});
})(window,document,navigator);

}
});
this.require.define({
  'backbone-articulation': function(exports, require, module) {
// Generated by CoffeeScript 1.3.3

/*
  backbone-articulation.js 0.3.2
  (c) 2011, 2012 Kevin Malakoff.
  Backbone-Articulation may be freely distributed under the MIT license.
  https://github.com/kmalakoff/backbone-articulation
*/


(function() {
  var Articulation, Backbone, JSONS, LC, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = typeof require !== 'undefined' ? require('underscore') : this._;

  if (_ && !_.VERSION) {
    _ = _._;
  }

  Backbone = typeof require !== 'undefined' ? require('backbone') : this.Backbone;

  JSONS = typeof require !== 'undefined' ? require('json-serialize') : this.JSONS;

  LC = typeof require !== 'undefined' ? require('lifecycle') : this.LC;

  Backbone.Articulation = Articulation = typeof exports !== 'undefined' ? exports : {};

  Articulation.VERSION = '0.3.2';

  Articulation.TYPE_UNDERSCORE_SINGULARIZE = false;

  Articulation._mixin = function(target_constructor, source_constructor, source_fns) {
    var Link, fn, fns, name;
    fns = _.pick(source_constructor.prototype, source_fns);
    Link = (function(_super) {

      __extends(Link, _super);

      function Link() {
        return Link.__super__.constructor.apply(this, arguments);
      }

      return Link;

    })(target_constructor.__super__.constructor);
    for (name in fns) {
      fn = fns[name];
      Link.prototype[name] = fn;
    }
    Link.prototype.__bba_super = target_constructor.__super__.constructor;
    Link.prototype.__bba_toJSON = Link.prototype['toJSON'];
    target_constructor.prototype.__proto__ = Link.prototype;
    return target_constructor.__super__ = Link.prototype;
  };

  Articulation.Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    Model.extend = Backbone.Model.extend;

    Model.prototype.__bba_super = Backbone.Model;

    Model.prototype.toJSON = function() {
      var class_name, json;
      json = JSONS.serialize(this.attributes, {
        properties: true
      });
      if (json.hasOwnProperty(JSONS.TYPE_FIELD)) {
        return json;
      }
      if (this.hasOwnProperty(JSONS.TYPE_FIELD)) {
        json[JSONS.TYPE_FIELD] = this[JSONS.TYPE_FIELD];
        return json;
      }
      class_name = Object.getPrototypeOf(Object(this)).constructor.name;
      if (!class_name) {
        return json;
      }
      if (Articulation.TYPE_UNDERSCORE_SINGULARIZE) {
        if (!String.prototype.underscore) {
          throw 'Missing String.prototype.underscore';
        }
        if (!String.prototype.singularize) {
          throw 'Missing String.prototype.singularize';
        }
        json[JSONS.TYPE_FIELD] = class_name.underscore().singularize();
      } else {
        json[JSONS.TYPE_FIELD] = class_name;
      }
      return json;
    };

    Model.prototype.parse = function(resp, xhr) {
      if (!resp) {
        return resp;
      }
      return JSONS.deserialize(resp, {
        properties: true,
        skip_type_field: true
      });
    };

    Model.prototype.set = function(attrs, options) {
      var key, value;
      if (!attrs) {
        return this;
      }
      if (attrs.attributes) {
        attrs = attrs.attributes;
      }
      for (key in attrs) {
        value = attrs[key];
        if (_.isEqual(this.attributes[key], value)) {
          continue;
        }
        if (this._previousAttributes && (this._previousAttributes.hasOwnProperty(key))) {
          this._disownAttribute(key, this._previousAttributes[key]);
        }
        this._ownAttribute(key, value);
      }
      return this.__bba_super.prototype.set.apply(this, arguments);
    };

    Model.prototype.unset = function(attr, options) {
      if (!(attr in this.attributes)) {
        return this;
      }
      this._disownAttribute(attr, this.attributes[attr]);
      return this.__bba_super.prototype.unset.apply(this, arguments);
    };

    Model.prototype.clear = function(options) {
      var key;
      for (key in this.attributes) {
        this._disownAttribute(key, this.attributes[key]);
      }
      if (options && options.silent) {
        for (key in this._previousAttributes) {
          this._disownAttribute(key, this._previousAttributes[key]);
        }
      }
      return this.__bba_super.prototype.clear.apply(this, arguments);
    };

    Model.prototype.change = function(options) {
      var key, result;
      for (key in this._previousAttributes) {
        this._disownAttribute(key, this._previousAttributes[key]);
      }
      result = this.__bba_super.prototype.change.apply(this, arguments);
      for (key in this._previousAttributes) {
        this._previousAttributes[key] = this._ownAttribute(key, this._previousAttributes[key]);
      }
      return result;
    };

    Model.prototype._ownAttribute = function(key, value) {
      if (!value) {
        return;
      }
      if ((value instanceof Backbone.Model) || (value instanceof Backbone.Collection)) {
        return value;
      }
      if (_.isArray(value) && value.length && (value[0] instanceof Backbone.Model) || (value[0] instanceof Backbone.Collection)) {
        return value;
      }
      return LC.own(value);
    };

    Model.prototype._disownAllAttributes = function() {};

    Model.prototype._disownAttribute = function(key, value) {
      if (!value) {
        return;
      }
      if ((value instanceof Backbone.Model) || (value instanceof Backbone.Collection)) {
        return value;
      }
      if (_.isArray(value) && value.length && (value[0] instanceof Backbone.Model) || (value[0] instanceof Backbone.Collection)) {
        return value;
      }
      return LC.disown(value);
    };

    Model.mixin = function(target_constructor) {
      return Articulation._mixin(target_constructor, Articulation.Model, ['toJSON', 'parse', 'set', 'unset', 'clear', 'change', '_ownAttribute', '_disownAttribute']);
    };

    return Model;

  })(Backbone.Model);

  Articulation.Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.extend = Backbone.Collection.extend;

    Collection.prototype.__bba_super = Backbone.Collection;

    Collection.prototype.model = Articulation.Model;

    Collection.prototype.toJSON = function() {
      var model, models_as_JSON, _i, _len, _ref;
      models_as_JSON = [];
      _ref = this.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        models_as_JSON.push(model.toJSON());
      }
      return models_as_JSON;
    };

    Collection.prototype.parse = function(resp, xhr) {
      var articulated_model_attributes, model_resp, _i, _len;
      if (!(resp && _.isArray(resp))) {
        return resp;
      }
      articulated_model_attributes = [];
      for (_i = 0, _len = resp.length; _i < _len; _i++) {
        model_resp = resp[_i];
        articulated_model_attributes.push(JSONS.deserialize(model_resp, {
          skip_type_field: true
        }));
      }
      return articulated_model_attributes;
    };

    Collection.prototype._onModelEvent = function(event, model, collection, options) {
      var key;
      if (event === "destroy") {
        for (key in model._previousAttributes) {
          model._disownAttribute(key, model._previousAttributes[key]);
        }
        for (key in model.attributes) {
          model._disownAttribute(key, model.attributes[key]);
        }
      }
      return this.__bba_super.prototype._onModelEvent.apply(this, arguments);
    };

    Collection.prototype._removeReference = function(model) {
      if (model) {
        model.clear({
          silent: true
        });
      }
      return this.__bba_super.prototype._removeReference.apply(this, arguments);
    };

    Collection.mixin = function(target_constructor) {
      return Articulation._mixin(target_constructor, Articulation.Collection, ['toJSON', 'parse', '_reset', '_onModelEvent']);
    };

    return Collection;

  })(Backbone.Collection);

}).call(this);

}
});
this.require.define({
  'backbone-modelref': function(exports, require, module) {
// Generated by CoffeeScript 1.3.3

/*
  backbone-modelref.js 0.1.2
  (c) 2011, 2012 Kevin Malakoff.
  Backbone-ModelRef.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/backbone-modelref/blob/master/LICENSE
  Dependencies: Backbone.js and Underscore.js.
*/


(function() {
  var Backbone, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = !this._ && (typeof require !== 'undefined') ? require('underscore') : this._;

  if (_ && !_.VERSION) {
    _ = _._;
  }

  Backbone = !this.Backbone && (typeof require !== 'undefined') ? require('backbone') : this.Backbone;

  Backbone.ModelRef = (function() {

    function ModelRef(collection, model_id, cached_model) {
      var event, _i, _j, _len, _len1, _ref, _ref1;
      this.collection = collection;
      this.model_id = model_id;
      this.cached_model = cached_model != null ? cached_model : null;
      _.bindAll(this, '_checkForLoad', '_checkForUnload');
      if (!this.collection) {
        throw new Error("Backbone.ModelRef: collection is missing");
      }
      this.ref_count = 1;
      if (this.collection.retain) {
        this.collection.retain();
      }
      if (this.cached_model) {
        this.model_id = this.cached_model.id;
      }
      if (!this.cached_model && this.model_id) {
        this.cached_model = this.collection.get(this.model_id);
      }
      if (this.cached_model) {
        _ref = Backbone.ModelRef.MODEL_EVENTS_WHEN_LOADED;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          event = _ref[_i];
          this.collection.bind(event, this._checkForUnload);
        }
      } else {
        _ref1 = Backbone.ModelRef.MODEL_EVENTS_WHEN_UNLOADED;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          event = _ref1[_j];
          this.collection.bind(event, this._checkForLoad);
        }
      }
    }

    ModelRef.prototype.retain = function() {
      this.ref_count++;
      return this;
    };

    ModelRef.prototype.release = function() {
      var event, _i, _j, _len, _len1, _ref, _ref1;
      if (this.ref_count <= 0) {
        throw new Error("Backbone.ModelRef.release(): ref count is corrupt");
      }
      this.ref_count--;
      if (this.ref_count > 0) {
        return;
      }
      if (this.cached_model) {
        _ref = Backbone.ModelRef.MODEL_EVENTS_WHEN_LOADED;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          event = _ref[_i];
          this.collection.unbind(event, this._checkForUnload);
        }
      } else {
        _ref1 = Backbone.ModelRef.MODEL_EVENTS_WHEN_UNLOADED;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          event = _ref1[_j];
          this.collection.unbind(event, this._checkForLoad);
        }
      }
      if (this.collection.release) {
        this.collection.release();
      }
      this.collection = null;
      return this;
    };

    ModelRef.prototype.getModel = function() {
      if (this.cached_model && !this.cached_model.isNew()) {
        this.model_id = this.cached_model.id;
      }
      if (this.cached_model) {
        return this.cached_model;
      }
      if (this.model_id) {
        this.cached_model = this.collection.get(this.model_id);
      }
      return this.cached_model;
    };

    ModelRef.prototype._checkForLoad = function() {
      var event, model, _i, _j, _len, _len1, _ref, _ref1;
      if (this.cached_model || !this.model_id) {
        return;
      }
      model = this.collection.get(this.model_id);
      if (!model) {
        return;
      }
      _ref = Backbone.ModelRef.MODEL_EVENTS_WHEN_UNLOADED;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.collection.unbind(event, this._checkForLoad);
      }
      _ref1 = Backbone.ModelRef.MODEL_EVENTS_WHEN_LOADED;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        event = _ref1[_j];
        this.collection.bind(event, this._checkForUnload);
      }
      this.cached_model = model;
      return this.trigger('loaded', this.cached_model);
    };

    ModelRef.prototype._checkForUnload = function() {
      var event, model, _i, _j, _len, _len1, _ref, _ref1;
      if (!this.cached_model || !this.model_id) {
        return;
      }
      model = this.collection.get(this.model_id);
      if (model) {
        return;
      }
      _ref = Backbone.ModelRef.MODEL_EVENTS_WHEN_LOADED;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.collection.unbind(event, this._checkForUnload);
      }
      _ref1 = Backbone.ModelRef.MODEL_EVENTS_WHEN_UNLOADED;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        event = _ref1[_j];
        this.collection.bind(event, this._checkForLoad);
      }
      model = this.cached_model;
      this.cached_model = null;
      return this.trigger('unloaded', model);
    };

    return ModelRef;

  })();

  __extends(Backbone.ModelRef.prototype, Backbone.Events);

  Backbone.ModelRef.VERSION = '0.1.2';

  Backbone.ModelRef.MODEL_EVENTS_WHEN_LOADED = ['reset', 'remove'];

  Backbone.ModelRef.MODEL_EVENTS_WHEN_UNLOADED = ['reset', 'add'];

  Backbone.Model.prototype.model = function() {
    if (arguments.length === 0) {
      return this;
    }
    throw new Error('cannot set a Backbone.Model');
  };

  Backbone.Model.prototype.isLoaded = function() {
    return true;
  };

  Backbone.Model.prototype.bindLoadingStates = function(params) {
    if (_.isFunction(params)) {
      params(this);
    } else if (params.loaded) {
      params.loaded(this);
    }
    return this;
  };

  Backbone.Model.prototype.unbindLoadingStates = function(params) {
    return this;
  };

  Backbone.ModelRef.prototype.get = function(attribute_name) {
    if (attribute_name !== 'id') {
      throw new Error("Backbone.ModelRef.get(): only id is permitted");
    }
    if (this.cached_model && !this.cached_model.isNew()) {
      this.model_id = this.cached_model.id;
    }
    return this.model_id;
  };

  Backbone.ModelRef.prototype.model = function(model) {
    var changed, event, previous_model, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
    if (arguments.length === 0) {
      return this.getModel();
    }
    if (model && (model.collection !== this.collection)) {
      throw new Error("Backbone.ModelRef.model(): collections don't match");
    }
    changed = this.model_id ? !model || (this.model_id !== model.get('id')) : !!model;
    if (!changed) {
      return;
    }
    if (this.cached_model) {
      previous_model = this.cached_model;
      this.model_id = null;
      this.cached_model = null;
      _ref = Backbone.ModelRef.MODEL_EVENTS_WHEN_LOADED;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.collection.unbind(event, this._checkForUnload);
      }
      _ref1 = Backbone.ModelRef.MODEL_EVENTS_WHEN_UNLOADED;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        event = _ref1[_j];
        this.collection.bind(event, this._checkForLoad);
      }
      this.trigger('unloaded', previous_model);
    }
    if (!model) {
      return;
    }
    this.model_id = model.get('id');
    this.cached_model = model.model();
    _ref2 = Backbone.ModelRef.MODEL_EVENTS_WHEN_UNLOADED;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      event = _ref2[_k];
      this.collection.unbind(event, this._checkForLoad);
    }
    _ref3 = Backbone.ModelRef.MODEL_EVENTS_WHEN_LOADED;
    for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
      event = _ref3[_l];
      this.collection.bind(event, this._checkForUnload);
    }
    return this.trigger('loaded', this.cached_model);
  };

  Backbone.ModelRef.prototype.isLoaded = function() {
    var model;
    model = this.getModel();
    if (!model) {
      return false;
    }
    if (model.isLoaded) {
      return model.isLoaded();
    } else {
      return true;
    }
  };

  Backbone.ModelRef.prototype.bindLoadingStates = function(params) {
    var model;
    if (_.isFunction(params)) {
      this.bind('loaded', params);
    } else {
      if (params.loaded) {
        this.bind('loaded', params.loaded);
      }
      if (params.unloaded) {
        this.bind('unloaded', params.unloaded);
      }
    }
    model = this.model();
    if (!model) {
      return null;
    }
    return model.bindLoadingStates(params);
  };

  Backbone.ModelRef.prototype.unbindLoadingStates = function(params) {
    if (_.isFunction(params)) {
      this.unbind('loaded', params);
    } else {
      if (params.loaded) {
        this.unbind('loaded', params.loaded);
      }
      if (params.unloaded) {
        this.unbind('unloaded', params.unloaded);
      }
    }
    return this.model();
  };

  if (typeof exports !== 'undefined') {
    module.exports = Backbone.ModelRef;
  }

  if (this.Backbone) {
    this.Backbone.ModelRef = Backbone.ModelRef;
  }

  Backbone.ModelRef.VERSION = '0.1.2';

}).call(this);

}
});
this.require.define({
  'background': function(exports, require, module) {
// Generated by CoffeeScript 1.3.3

/*
  background.js 0.2.2
  (c) 2011, 2012 Kevin Malakoff.
  Mixin is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/background/blob/master/LICENSE
  Dependencies: None.
*/


(function() {
  var Background, root,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = this;

  Background = this.Background = typeof exports !== 'undefined' ? exports : {};

  Background.VERSION = '0.2.2';

  Background._JobContainer = (function() {

    function _JobContainer(frequency) {
      this.frequency = frequency;
      this.jobs = [];
      this.timeout = 0;
      this.being_destroyed = false;
    }

    _JobContainer.prototype.destroy = function() {
      return this.being_destroyed = true;
    };

    _JobContainer.prototype.isDestroyed = function() {
      return this.being_destroyed || this.destroyed;
    };

    _JobContainer.prototype.isEmpty = function() {
      return this.jobs.length === 0;
    };

    _JobContainer.prototype.tick = function() {
      if (this.being_destroyed) {
        this._doDestroy();
        return;
      }
      this._doTick();
      if (this.being_destroyed) {
        this._doDestroy();
      }
    };

    _JobContainer.prototype.clear = function() {
      var job;
      while ((job = this.jobs.shift())) {
        job.destroy(true);
      }
      if (this.timeout) {
        root.clearInterval(this.timeout);
        return this.timeout = null;
      }
    };

    _JobContainer.prototype._appendJob = function(init_fn_or_job, run_fn, destroy_fn) {
      var job,
        _this = this;
      if (this.isDestroyed()) {
        throw new Error("Background._JobContainer._appendJob: trying to append a job to a destroyed container");
      }
      if (Background.Job.isAJob(init_fn_or_job)) {
        job = init_fn_or_job;
      } else {
        job = new Background.Job(init_fn_or_job, run_fn, destroy_fn);
      }
      this.jobs.push(job);
      if (!this.timeout) {
        return this.timeout = root.setInterval((function() {
          return _this.tick();
        }), this.frequency);
      }
    };

    _JobContainer.prototype._waitForJobs = function() {
      if (this.timeout) {
        root.clearInterval(this.timeout);
        return this.timeout = null;
      }
    };

    _JobContainer.prototype._doDestroy = function() {
      if (!this.being_destroyed || this.is_destroyed) {
        throw new Error("Background._JobContainer.destroy: destroy state is corrupted");
      }
      this.is_destroyed = true;
      return this.clear();
    };

    return _JobContainer;

  })();

  Background._ArrayIterator = (function() {

    function _ArrayIterator(batch_length, total_count, current_range) {
      this.batch_length = batch_length;
      this.total_count = total_count;
      this.current_range = current_range;
      if (!this.batch_length || (this.total_count === void 0) || !this.current_range) {
        throw new Error("Background._ArrayIterator: parameters invalid");
      }
      this.reset();
    }

    _ArrayIterator.prototype.reset = function() {
      this.batch_index = -1;
      return this.batch_count = Math.ceil(this.total_count / this.batch_length);
    };

    _ArrayIterator.prototype.isDone = function() {
      return this.batch_index >= this.batch_count - 1;
    };

    _ArrayIterator.prototype.updateCurrentRange = function() {
      var excluded_boundary, index;
      index = this.batch_index * this.batch_length;
      excluded_boundary = index + this.batch_length;
      if (excluded_boundary > this.total_count) {
        excluded_boundary = this.total_count;
      }
      if (index >= excluded_boundary) {
        return this.current_range._setIsDone();
      }
      this.current_range._addBatchLength(excluded_boundary - index);
      return this.current_range;
    };

    _ArrayIterator.prototype.step = function() {
      if (this.isDone()) {
        return this.current_range._setIsDone();
      }
      this.batch_index++;
      if (this.batch_index === 0) {
        return this.current_range;
      } else {
        return this.updateCurrentRange();
      }
    };

    return _ArrayIterator;

  })();

  Background.Job = (function() {

    function Job(init_fn, run_fn, destroy_fn) {
      this.init_fn = init_fn;
      this.run_fn = run_fn;
      this.destroy_fn = destroy_fn;
      if (!this.run_fn) {
        throw new Error('run_fn is mandatory');
      }
      this.was_completed = false;
    }

    Job.prototype.destroy = function() {
      this._cleanup();
      this.run_fn = null;
      this.init_fn = null;
      return this.destroy_fn = null;
    };

    Job.prototype.run = function() {
      if (this.init_fn) {
        this.init_fn();
        this.init_fn = null;
      }
      this.was_completed = this.run_fn();
      if (this.was_completed) {
        this._cleanup();
      }
      return this.was_completed;
    };

    Job.prototype._cleanup = function() {
      if (this.destroy_fn) {
        this.destroy_fn(this.was_completed);
        return this.destroy_fn = null;
      }
    };

    Job.isAJob = function(job) {
      return job && (typeof job === 'object') && ('constructor' in job) && ('name' in job.constructor) && (job.constructor.name === 'Job');
    };

    return Job;

  })();

  Background.JobQueue = (function(_super) {

    __extends(JobQueue, _super);

    function JobQueue(frequency) {
      JobQueue.__super__.constructor.call(this, frequency);
      this.current_job = null;
    }

    JobQueue.prototype._doTick = function() {
      if (!this.current_job) {
        if (!this.jobs.length) {
          this._waitForJobs();
          return;
        }
        this.current_job = this.jobs.shift();
      }
      if (this.current_job.run()) {
        this.current_job.destroy(false);
        return this.current_job = null;
      }
    };

    JobQueue.prototype.push = function(init_fn_or_job, run_fn, destroy_fn) {
      return this._appendJob(init_fn_or_job, run_fn, destroy_fn);
    };

    JobQueue.prototype._doDestroy = function() {
      if (this.current_job) {
        this.current_job.destroy(true);
        this.current_job = null;
      }
      return JobQueue.__super__._doDestroy.call(this);
    };

    return JobQueue;

  })(Background._JobContainer);

  Background.JobList = (function(_super) {

    __extends(JobList, _super);

    function JobList(frequency) {
      JobList.__super__.constructor.call(this, frequency);
    }

    JobList.prototype._doTick = function() {
      var job, jobs, _i, _len, _results;
      if (!this.jobs.length) {
        this._waitForJobs();
        return;
      }
      jobs = this.jobs.slice();
      _results = [];
      for (_i = 0, _len = jobs.length; _i < _len; _i++) {
        job = jobs[_i];
        if (!job.run()) {
          continue;
        }
        this.jobs.splice(this.jobs.indexOf(job), 1);
        _results.push(job.destroy(false));
      }
      return _results;
    };

    JobList.prototype.append = function(init_fn_or_job, run_fn, destroy_fn) {
      return this._appendJob(init_fn_or_job, run_fn, destroy_fn);
    };

    return JobList;

  })(Background._JobContainer);

  Background.Range = (function() {

    function Range(index, excluded_boundary) {
      this.index = index;
      this.excluded_boundary = excluded_boundary;
      if ((this.index === void 0) || !this.excluded_boundary) {
        throw new Error("Background.Range: parameters invalid");
      }
      return this;
    }

    Range.prototype.isDone = function() {
      return this.index >= this.excluded_boundary;
    };

    Range.prototype.step = function() {
      this.index++;
      if (this.index >= this.excluded_boundary) {
        return -1;
      } else {
        return this.index;
      }
    };

    Range.prototype.getItem = function(array) {
      return array[this.index];
    };

    Range.prototype.getSlice = function(array) {
      return array.slice(this.index, this.excluded_boundary);
    };

    Range.prototype._setIsDone = function() {
      this.index = -1;
      this.excluded_boundary = -1;
      return this;
    };

    Range.prototype._addBatchLength = function(batch_length) {
      if (!batch_length) {
        throw new Error("Background.Range._addBatchLength: batch_length invalid");
      }
      this.excluded_boundary += batch_length;
      return this;
    };

    Range.prototype.reset = function() {
      this.index = 0;
      return this;
    };

    Range.prototype._stepToEnd = function() {
      return this.index = this.excluded_boundary;
    };

    return Range;

  })();

  Background.Range_xN = (function() {

    function Range_xN(ranges, batch_length) {
      this.ranges = ranges;
      this.batch_length = batch_length;
      if (!this.ranges || !this.batch_length) {
        throw new Error("Background.Range_xN: parameters invalid");
      }
      this.batch_index = 0;
      return this;
    }

    Range_xN.prototype.isDone = function() {
      return this.batch_index >= this.batch_length;
    };

    Range_xN.prototype.step = function() {
      var current_range, index;
      this.batch_index++;
      index = this.ranges.length - 1;
      while (index >= 0) {
        current_range = this.ranges[index];
        current_range.step();
        if (!current_range.isDone()) {
          return this;
        }
        current_range.reset();
        index--;
      }
      this._setIsDone();
      return null;
    };

    Range_xN.prototype.getItems = function(arrays) {
      var array, index, items;
      items = [];
      for (index in arrays) {
        array = arrays[index];
        items.push(array[this.ranges[index].index]);
      }
      return items;
    };

    Range_xN.prototype.getCombinations = function(arrays) {
      var combination, combinations, index, range, _ref;
      combinations = [];
      while (!this.isDone()) {
        combination = [];
        _ref = this.ranges;
        for (index in _ref) {
          range = _ref[index];
          combination.push(range.getItem(arrays[index]));
        }
        combinations.push(combination);
        this.step();
      }
      return combinations;
    };

    Range_xN.prototype._setIsDone = function() {
      this.batch_index = -1;
      this.batch_length = -1;
      return this;
    };

    Range_xN.prototype._addBatchLength = function(batch_length) {
      if (!batch_length) {
        throw new Error("Background.Range_xN._addBatchLength: batch_length invalid");
      }
      this.batch_index = 0;
      this.batch_length = batch_length;
      return this;
    };

    return Range_xN;

  })();

  Background.ArrayIterator = (function(_super) {

    __extends(ArrayIterator, _super);

    function ArrayIterator(array, batch_length) {
      var excluded_boundary;
      this.array = array;
      if (!this.array) {
        throw new Error("Background.ArrayIterator: missing array");
      }
      this.reset();
      excluded_boundary = batch_length < this.array.length ? batch_length : (this.array.length ? this.array.length : 1);
      ArrayIterator.__super__.constructor.call(this, batch_length, this.array.length, new Background.Range(0, excluded_boundary));
    }

    ArrayIterator.prototype.nextByItem = function(fn) {
      this.step();
      while (!this.current_range.isDone()) {
        fn(this.current_range.getItem(this.array), this.current_range.index, this.array);
        this.current_range.step();
      }
      return this.isDone();
    };

    ArrayIterator.prototype.nextBySlice = function(fn) {
      this.step();
      if (!this.current_range.isDone()) {
        fn(this.current_range.getSlice(this.array), this.current_range, this.array);
      }
      this.current_range._stepToEnd();
      return this.isDone();
    };

    ArrayIterator.prototype.nextByRange = function(fn) {
      this.step();
      if (!this.current_range.isDone()) {
        fn(this.current_range, this.array);
      }
      return this.isDone();
    };

    return ArrayIterator;

  })(Background._ArrayIterator);

  Background.ArrayIterator_xN = (function(_super) {

    __extends(ArrayIterator_xN, _super);

    function ArrayIterator_xN(arrays, batch_length) {
      var array, array_combination_count, ranges, _i, _j, _len, _len1, _ref, _ref1;
      this.arrays = arrays;
      if (!this.arrays) {
        throw new Error("Background.ArrayIterator_xN: missing arrays");
      }
      array_combination_count = 1;
      _ref = this.arrays;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        array = _ref[_i];
        array_combination_count *= array.length;
      }
      this.reset();
      ranges = [];
      _ref1 = this.arrays;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        array = _ref1[_j];
        ranges.push(new Background.Range(0, array.length));
      }
      ArrayIterator_xN.__super__.constructor.call(this, batch_length, array_combination_count, new Background.Range_xN(ranges, batch_length));
    }

    ArrayIterator_xN.prototype.nextByItems = function(fn) {
      this.step();
      while (!this.current_range.isDone()) {
        fn(this.current_range.getItems(this.arrays), this.current_range, this.arrays);
        this.current_range.step();
      }
      return this.isDone();
    };

    ArrayIterator_xN.prototype.nextByCombinations = function(fn) {
      this.step();
      if (!this.current_range.isDone()) {
        fn(this.current_range.getCombinations(this.arrays), this.current_range, this.array);
      }
      return this.isDone();
    };

    ArrayIterator_xN.prototype.nextByRange = function(fn) {
      this.step();
      if (!this.current_range.isDone()) {
        fn(this.current_range, this.arrays);
      }
      return this.isDone();
    };

    return ArrayIterator_xN;

  })(Background._ArrayIterator);

}).call(this);

}
});
this.require.define({
  'json-serialize': function(exports, require, module) {
// Generated by CoffeeScript 1.3.3

/*
  JSON-Serialize.js 1.1.1
  (c) 2011, 2012 Kevin Malakoff.
  JSON-Serialize is freely distributable under the MIT license.
  https:#github.com/kmalakoff/json-serialize
*/


(function() {
  var JSONS, isArray, isEmpty, keyPath, root, stringHasISO8601DateSignature;

  root = this;

  JSONS = this.JSONS = typeof exports !== 'undefined' ? exports : {};

  JSONS.VERSION = "1.1.1";

  JSONS.TYPE_FIELD = "_type";

  JSONS.NAMESPACE_ROOTS = [root];

  isEmpty = function(obj) {
    var key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  isArray = function(obj) {
    return obj.constructor === Array;
  };

  stringHasISO8601DateSignature = function(string) {
    return (string.length >= 19) && (string[4] === "-") && (string[7] === "-") && (string[10] === "T") && (string[string.length - 1] === "Z");
  };

  keyPath = function(object, keypath) {
    var current_object, i, key, keypath_components, l;
    keypath_components = keypath.split(".");
    if (keypath_components.length === 1) {
      return ((object instanceof Object) && (object.hasOwnProperty(keypath)) ? object[keypath] : void 0);
    }
    current_object = object;
    l = keypath_components.length;
    for (i in keypath_components) {
      key = keypath_components[i];
      key = keypath_components[i];
      if (!(key in current_object)) {
        break;
      }
      if (++i === l) {
        return current_object[key];
      }
      current_object = current_object[key];
      if (!current_object || (!(current_object instanceof Object))) {
        break;
      }
    }
    return void 0;
  };

  JSONS.serialize = function(obj, options) {
    var key, result, value, _i, _len;
    if (!obj || (typeof obj !== "object")) {
      return obj;
    }
    if (obj.toJSON) {
      return obj.toJSON();
    }
    if (isEmpty(obj)) {
      return null;
    }
    if (isArray(obj)) {
      result = [];
      for (_i = 0, _len = obj.length; _i < _len; _i++) {
        value = obj[_i];
        result.push(JSONS.serialize(value));
      }
    } else {
      result = {};
      for (key in obj) {
        value = obj[key];
        result[key] = JSONS.serialize(value);
      }
    }
    return result;
  };

  JSONS.deserialize = function(json, options) {
    var constructor_or_root, date, instance, json_as_JSON, json_type, key, namespace_root, result, type, value, _i, _j, _len, _len1, _ref;
    json_type = typeof json;
    if (json_type === "string") {
      if (json.length && (json[0] === "{") || (json[0] === "[")) {
        try {
          json_as_JSON = JSON.parse(json);
          if (json_as_JSON) {
            json = json_as_JSON;
          }
        } catch (e) {
          throw new TypeError("Unable to parse JSON: " + json);
        }
      } else if (!(options && options.skip_dates) && stringHasISO8601DateSignature(json)) {
        try {
          date = new Date(json);
          if (date) {
            return date;
          }
        } catch (_error) {}
      }
    }
    if ((json_type !== "object") || isEmpty(json)) {
      return json;
    }
    if (isArray(json)) {
      result = [];
      for (_i = 0, _len = json.length; _i < _len; _i++) {
        value = json[_i];
        result.push(JSONS.deserialize(value));
      }
      return result;
    } else if ((options && options.skip_type_field) || !json.hasOwnProperty(JSONS.TYPE_FIELD)) {
      result = {};
      for (key in json) {
        value = json[key];
        result[key] = JSONS.deserialize(value);
      }
      return result;
    } else {
      type = json[JSONS.TYPE_FIELD];
      _ref = JSONS.NAMESPACE_ROOTS;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        namespace_root = _ref[_j];
        constructor_or_root = keyPath(namespace_root, type);
        if (!constructor_or_root) {
          continue;
        }
        if (constructor_or_root.fromJSON) {
          return constructor_or_root.fromJSON(json);
        } else if (constructor_or_root.prototype.and(constructor_or_root.prototype.parse)) {
          instance = new constructor_or_root();
          if (instance.set) {
            return instance.set(instance.parse(json));
          }
          return instance.parse(json);
        }
      }
      return null;
    }
  };

}).call(this);

}
});
this.require.define({
  'knockback': function(exports, require, module) {
// Generated by CoffeeScript 1.3.3

/*
  knockback.js 0.15.3
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
*/


(function() {
  var Backbone, Knockback, kb, ko, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = !this._ && (typeof require !== 'undefined') ? require('underscore')._ : this._;

  Backbone = !this.Backbone && (typeof require !== 'undefined') ? require('backbone') : this.Backbone;

  ko = !this.ko && (typeof require !== 'undefined') ? require('knockout') : this.ko;

  Knockback = kb = this.Knockback = this.kb = typeof exports !== 'undefined' ? exports : {};

  kb.VERSION = '0.15.3';

  kb.locale_manager = void 0;

  kb.stats = {
    collection_observables: 0,
    view_models: 0
  };

  kb.stats_on = false;

  /*
    knockback_utils.js 0.15.3
    (c) 2011, 2012 Kevin Malakoff.
    Knockback.js is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
    Dependencies: Knockout.js, Backbone.js, and Underscore.js.
      Optional dependency: Backbone.ModelRef.js.
  */


  kb.utils = {};

  kb.utils.legacyWarning = function(identifier, remove_version, message) {
    var _base;
    kb._legacy_warnings || (kb._legacy_warnings = {});
    (_base = kb._legacy_warnings)[identifier] || (_base[identifier] = 0);
    kb._legacy_warnings[identifier]++;
    return console.warn("warning: '" + identifier + "' has been deprecated (will be removed in Knockback " + remove_version + "). " + message + ".");
  };

  kb.utils.wrappedObservable = function(instance, observable) {
    if (arguments.length === 1) {
      if (!(instance && instance.__kb && instance.__kb.observable)) {
        throw 'Knockback: instance is not wrapping an observable';
      }
      return instance.__kb.observable;
    }
    if (!instance) {
      throw 'Knockback: no instance for wrapping a observable';
    }
    instance.__kb || (instance.__kb = {});
    if (instance.__kb.observable && instance.__kb.observable.__kb) {
      instance.__kb.observable.__kb.instance = null;
    }
    instance.__kb.observable = observable;
    if (observable) {
      observable.__kb || (observable.__kb = {});
      observable.__kb.instance = instance;
    }
    return observable;
  };

  kb.wrappedObservable = function(instance) {
    kb.utils.legacyWarning('kb.wrappedObservable', '0.16.0', 'Please use kb.utils.wrappedObservable instead');
    return kb.utils.wrappedObservable(instance);
  };

  kb.utils.observableInstanceOf = function(observable, type) {
    if (!observable) {
      return false;
    }
    if (!(observable.__kb && observable.__kb.instance)) {
      return false;
    }
    return observable.__kb.instance instanceof type;
  };

  kb.utils.wrappedModel = function(view_model, model) {
    if (arguments.length === 1) {
      if (view_model && view_model.__kb && view_model.__kb.hasOwnProperty('model')) {
        return view_model.__kb.model;
      } else {
        return view_model;
      }
    }
    if (!view_model) {
      throw 'Knockback: no view_model for wrapping a model';
    }
    view_model.__kb || (view_model.__kb = {});
    view_model.__kb.model = model;
    return model;
  };

  kb.viewModelGetModel = kb.vmModel = function(view_model) {
    kb.utils.legacyWarning('kb.vmModel', '0.16.0', 'Please use kb.utils.wrappedModel instead');
    return kb.utils.wrappedModel(view_model);
  };

  kb.utils.setToDefault = function(obj) {
    var key, observable, _results;
    if (!obj) {
      return;
    }
    if (ko.isObservable(obj)) {
      return typeof obj.setToDefault === "function" ? obj.setToDefault() : void 0;
    } else if (_.isObject(obj)) {
      _results = [];
      for (key in obj) {
        observable = obj[key];
        _results.push(observable && (key !== '__kb') ? kb.utils.setToDefault(observable) : void 0);
      }
      return _results;
    }
  };

  kb.vmSetToDefault = function(view_model) {
    kb.utils.legacyWarning('kb.vmSetToDefault', '0.16.0', 'Please use kb.utils.release instead');
    return kb.utils.setToDefault(view_model);
  };

  kb.utils.release = function(obj, keys_only) {
    var key, value;
    if (!obj) {
      return false;
    }
    if (!keys_only && (ko.isObservable(obj) || (obj instanceof kb.Observables) || (typeof obj.release === 'function') || (typeof obj.destroy === 'function'))) {
      if (obj.release) {
        obj.release();
      } else if (obj.destroy) {
        obj.destroy();
      } else if (obj.dispose) {
        obj.dispose();
      }
      return true;
    } else if (_.isObject(obj) && !(typeof obj === 'function')) {
      for (key in obj) {
        value = obj[key];
        if (!value || (key === '__kb')) {
          continue;
        }
        if (kb.utils.release(value)) {
          obj[key] = null;
        }
      }
      return true;
    }
    return false;
  };

  kb.vmRelease = function(view_model) {
    kb.utils.legacyWarning('kb.vmRelease', '0.16.0', 'Please use kb.utils.release instead');
    return kb.utils.release(view_model);
  };

  kb.vmReleaseObservable = function(observable) {
    kb.utils.legacyWarning('kb.vmReleaseObservable', '0.16.0', 'Please use kb.utils.release instead');
    return kb.utils.release(observable);
  };

  kb.utils.optionsCreateClear = function(options) {
    delete options['create'];
    delete options['children'];
    delete options['view_model'];
    return delete options['view_model_create'];
  };

  kb.utils.optionsCreateOverride = function(options, create_options) {
    kb.utils.optionsCreateClear(options);
    return _.extend(options, create_options);
  };

  /*
    knockback_ref_countable.js
    (c) 2012 Kevin Malakoff.
    Knockback.RefCountable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.RefCountable = (function() {

    RefCountable.extend = Backbone.Model.extend;

    function RefCountable() {
      this.__kb || (this.__kb = {});
      this.__kb.ref_count = 1;
    }

    RefCountable.prototype.__destroy = function() {};

    RefCountable.prototype.retain = function() {
      if (this.__kb.ref_count <= 0) {
        throw "RefCountable: ref_count is corrupt: " + this.__kb.ref_count;
      }
      this.__kb.ref_count++;
      return this;
    };

    RefCountable.prototype.release = function() {
      if (this.__kb.ref_count <= 0) {
        throw "RefCountable: ref_count is corrupt: " + this.__kb.ref_count;
      }
      this.__kb.ref_count--;
      if (!this.__kb.ref_count) {
        this.__destroy();
      }
      return this;
    };

    RefCountable.prototype.refCount = function() {
      return this.__kb.ref_count;
    };

    return RefCountable;

  })();

  /*
    knockback_store.js
    (c) 2012 Kevin Malakoff.
    Knockback.Store is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.Store = (function() {

    function Store() {
      this.keys = [];
      this.values = [];
    }

    Store.prototype.destroy = function() {
      var index, value, _ref, _ref1;
      this.keys = null;
      _ref = this.values;
      for (index in _ref) {
        value = _ref[index];
        if (!kb.utils.observableInstanceOf(value, kb.CollectionObservable)) {
          continue;
        }
        this.values[index] = null;
        while (value.refCount() > 0) {
          value.release();
        }
      }
      _ref1 = this.values;
      for (index in _ref1) {
        value = _ref1[index];
        if (!value) {
          continue;
        }
        this.values[index] = null;
        if (value instanceof kb.RefCountable) {
          while (value.refCount() > 0) {
            value.release();
          }
        } else {
          kb.utils.release(value);
        }
      }
      return this.values = null;
    };

    Store.prototype.registerValue = function(key, value) {
      var index;
      if (value instanceof kb.RefCountable) {
        value.retain();
      }
      index = _.indexOf(this.keys, key);
      if (index >= 0) {
        this.values[index] = value;
      } else {
        this.keys.push(key);
        this.values.push(value);
      }
      return value;
    };

    Store.prototype.resolveValue = function(key, create_fn, args) {
      var index, value;
      index = _.indexOf(this.keys, key);
      if (index >= 0) {
        if (this.values[index]) {
          if ((this.values[index] instanceof kb.RefCountable) && (this.values[index].refCount() <= 0)) {
            this.values[index] = null;
          } else {
            if (this.values[index] instanceof kb.RefCountable) {
              return this.values[index].retain();
            } else {
              return this.values[index];
            }
          }
        }
      } else {
        index = this.keys.length;
        this.keys.push(key);
        this.values.push(void 0);
      }
      value = create_fn.apply(null, Array.prototype.slice.call(arguments, 2));
      if (this.keys[index] !== key) {
        this.registerValue(key, value);
      } else if (!this.values[index]) {
        if (value instanceof kb.RefCountable) {
          value.retain();
        }
        this.values[index] = value;
      }
      return value;
    };

    Store.prototype.releaseValue = function(value) {
      var index;
      if (!(value instanceof kb.RefCountable)) {
        return;
      }
      value.release();
      if (value.refCount() > 0) {
        return;
      }
      index = _.indexOf(this.values, value);
      if (!(index >= 0)) {
        return;
      }
      return this.values[index] = 0;
    };

    Store.prototype.addResolverToOptions = function(options, key) {
      return _.extend(options, {
        store: this,
        store_key: key
      });
    };

    Store.resolveFromOptions = function(options, value) {
      if (!(options.store && options.store_key)) {
        return;
      }
      return options.store.registerValue(options.store_key, value);
    };

    return Store;

  })();

  /*
    knockback_collection_observable.js
    (c) 2011, 2012 Kevin Malakoff.
    Knockback.CollectionObservable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.CollectionObservable = (function(_super) {

    __extends(CollectionObservable, _super);

    function CollectionObservable(collection, options) {
      var bind_model_changes, observable,
        _this = this;
      if (options == null) {
        options = {};
      }
      if (!collection) {
        throw 'CollectionObservable: collection is missing';
      }
      CollectionObservable.__super__.constructor.apply(this, arguments);
      if (kb.stats_on) {
        kb.stats.collection_observables++;
      }
      if (ko.isObservable(options) && options.hasOwnProperty('indexOf')) {
        kb.utils.legacyWarning('kb.collectionObservable with an external ko.observableArray', '0.16.0', 'Please use the kb.collectionObservable directly instead of passing a ko.observableArray');
        observable = kb.utils.wrappedObservable(this, options);
        options = arguments[2] || {};
        bind_model_changes = true;
      } else {
        observable = kb.utils.wrappedObservable(this, ko.observableArray([]));
      }
      if (!options.store_skip_resolve) {
        kb.Store.resolveFromOptions(options, kb.utils.wrappedObservable(this));
      }
      if (options.store) {
        this.__kb.store = options.store;
      } else {
        this.__kb.store = new kb.Store();
        this.__kb.store_is_owned = true;
      }
      if (options.hasOwnProperty('view_model')) {
        if (!options.view_model) {
          throw 'kb.CollectionObservable: options.view_model is empty';
        }
        this.view_model_create_fn = options.view_model;
        this.view_model_create_with_new = true;
      } else if (options.hasOwnProperty('view_model_constructor')) {
        if (!options.view_model_constructor) {
          throw 'kb.CollectionObservable: options.view_model_constructor is empty';
        }
        kb.utils.legacyWarning('kb.collectionObservable option view_model_constructor', '0.16.0', 'Please use view_model option instead');
        this.view_model_create_fn = options.view_model_constructor;
        this.view_model_create_with_new = true;
      } else if (options.hasOwnProperty('view_model_create')) {
        if (!options.view_model_create) {
          throw 'kb.CollectionObservable: options.view_model_create is empty';
        }
        this.view_model_create_fn = options.view_model_create;
      } else if (options.hasOwnProperty('create')) {
        if (!options.create) {
          throw 'kb.CollectionObservable: options.create is empty';
        }
        this.view_model_create_fn = options.create;
      }
      this.sort_attribute = options.sort_attribute;
      this.sorted_index = options.sorted_index;
      this.__kb._onCollectionReset = _.bind(this._onCollectionReset, this);
      this.__kb._onCollectionResort = _.bind(this._onCollectionResort, this);
      this.__kb._onModelAdd = _.bind(this._onModelAdd, this);
      this.__kb._onModelRemove = _.bind(this._onModelRemove, this);
      this.__kb._onModelChange = _.bind(this._onModelChange, this);
      if (bind_model_changes && collection) {
        collection.bind('change', function() {
          return kb.utils.wrappedObservable(_this).valueHasMutated();
        });
      }
      observable.retain = _.bind(this.retain, this);
      observable.refCount = _.bind(this.refCount, this);
      observable.release = _.bind(this.release, this);
      observable.collection = _.bind(this.collection, this);
      observable.viewModelByModel = _.bind(this.viewModelByModel, this);
      observable.sortedIndex = _.bind(this.sortedIndex, this);
      observable.sortAttribute = _.bind(this.sortAttribute, this);
      observable.hasViewModels = _.bind(this.hasViewModels, this);
      observable.bind = _.bind(this.bind, this);
      observable.unbind = _.bind(this.unbind, this);
      observable.trigger = _.bind(this.trigger, this);
      this.collection(collection, {
        silent: true,
        defer: options.defer
      });
      return observable;
    }

    CollectionObservable.prototype.__destroy = function() {
      this.collection(null);
      if (this.hasViewModels() && this.__kb.store_is_owned) {
        this.__kb.store.destroy();
        this.__kb.store = null;
      }
      this.view_model_create_fn = null;
      this.__kb.collection = null;
      kb.utils.wrappedObservable(this, null);
      CollectionObservable.__super__.__destroy.apply(this, arguments);
      if (kb.stats_on) {
        return kb.stats.collection_observables--;
      }
    };

    CollectionObservable.prototype.retain = function() {
      CollectionObservable.__super__.retain.apply(this, arguments);
      return kb.utils.wrappedObservable(this);
    };

    CollectionObservable.prototype.release = function() {
      var observable;
      observable = kb.utils.wrappedObservable(this);
      CollectionObservable.__super__.release.apply(this, arguments);
      return observable;
    };

    CollectionObservable.prototype.collection = function(collection, options) {
      var observable, _base, _base1;
      observable = kb.utils.wrappedObservable(this);
      if (arguments.length === 0) {
        observable();
        return this.__kb.collection;
      }
      if (collection === this.__kb.collection) {
        return;
      }
      if (this.__kb.collection) {
        this._clear();
        this._collectionUnbind(this.__kb.collection);
        if (typeof (_base = this.__kb.collection).release === "function") {
          _base.release();
        }
        this.__kb.collection = null;
      }
      this.__kb.collection = collection;
      if (this.__kb.collection) {
        if (typeof (_base1 = this.__kb.collection).retain === "function") {
          _base1.retain();
        }
        this._collectionBind(this.__kb.collection);
        return this.sortedIndex(this.sorted_index, this.sort_attribute, options);
      }
    };

    CollectionObservable.prototype.sortedIndex = function(sorted_index, sort_attribute, options) {
      var _resync,
        _this = this;
      if (options == null) {
        options = {};
      }
      if (sorted_index) {
        this.sorted_index = sorted_index;
        this.sort_attribute = sort_attribute;
      } else if (sort_attribute) {
        this.sort_attribute = sort_attribute;
        this.sorted_index = this._sortAttributeFn(sort_attribute);
      } else {
        this.sort_attribute = null;
        this.sorted_index = null;
      }
      _resync = function() {
        var observable;
        observable = kb.utils.wrappedObservable(_this);
        if ((_this.__kb.collection.models.length === 0) && (observable().length === 0)) {
          return;
        }
        _this._collectionResync(true);
        if (!options.silent) {
          return _this.trigger('resort', observable());
        }
      };
      if (options.defer) {
        _.defer(_resync);
      } else {
        _resync();
      }
      return this;
    };

    CollectionObservable.prototype.sortAttribute = function(sort_attribute, sorted_index, silent) {
      return this.sortedIndex(sorted_index, sort_attribute, silent);
    };

    CollectionObservable.prototype.viewModelByModel = function(model) {
      var id_attribute, observable;
      if (!this.hasViewModels()) {
        return null;
      }
      observable = kb.utils.wrappedObservable(this);
      id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
      return _.find(observable(), function(test) {
        return test.__kb.model[id_attribute] === model[id_attribute];
      });
    };

    CollectionObservable.prototype.hasViewModels = function() {
      return !!this.view_model_create_fn;
    };

    CollectionObservable.prototype._collectionBind = function(collection) {
      var event, _i, _j, _len, _len1, _ref, _ref1;
      if (!collection) {
        return;
      }
      collection.bind('reset', this.__kb._onCollectionReset);
      if (!this.sorted_index) {
        collection.bind('resort', this.__kb._onCollectionResort);
      }
      _ref = ['new', 'add'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        collection.bind(event, this.__kb._onModelAdd);
      }
      _ref1 = ['remove', 'destroy'];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        event = _ref1[_j];
        collection.bind(event, this.__kb._onModelRemove);
      }
      return collection.bind('change', this.__kb._onModelChange);
    };

    CollectionObservable.prototype._collectionUnbind = function(collection) {
      var event, _i, _j, _len, _len1, _ref, _ref1;
      if (!collection) {
        return;
      }
      collection.unbind('reset', this.__kb._onCollectionReset);
      if (!this.sorted_index) {
        collection.unbind('resort', this.__kb._onCollectionResort);
      }
      _ref = ['new', 'add'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        collection.unbind(event, this.__kb._onModelAdd);
      }
      _ref1 = ['remove', 'destroy'];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        event = _ref1[_j];
        collection.unbind(event, this.__kb._onModelRemove);
      }
      return collection.unbind('change', this.__kb._onModelChange);
    };

    CollectionObservable.prototype._onCollectionReset = function() {
      return this._collectionResync();
    };

    CollectionObservable.prototype._onCollectionResort = function(model_or_models) {
      var observable;
      if (this.sorted_index) {
        throw 'CollectionObservable: collection sorted_index unexpected';
      }
      if (_.isArray(model_or_models)) {
        observable = kb.utils.wrappedObservable(this);
        return this.trigger('resort', observable());
      } else {
        return this._onModelResort(model_or_models);
      }
    };

    CollectionObservable.prototype._onModelAdd = function(model) {
      var add_index, observable, target;
      target = this.hasViewModels() ? this._createTarget(model) : model;
      observable = kb.utils.wrappedObservable(this);
      if (this.sorted_index) {
        add_index = this.sorted_index(observable(), target);
      } else {
        add_index = this.__kb.collection.indexOf(model);
      }
      observable.splice(add_index, 0, target);
      return this.trigger('add', target, observable());
    };

    CollectionObservable.prototype._onModelRemove = function(model) {
      var observable, target;
      target = this.hasViewModels() ? this.viewModelByModel(model) : model;
      if (!target) {
        return;
      }
      observable = kb.utils.wrappedObservable(this);
      observable.remove(target);
      this.trigger('remove', target, observable);
      if (this.hasViewModels()) {
        return this.__kb.store.releaseValue(target);
      }
    };

    CollectionObservable.prototype._onModelChange = function(model) {
      if (this.sorted_index && (!this.sort_attribute || model.hasChanged(this.sort_attribute))) {
        return this._onModelResort(model);
      }
    };

    CollectionObservable.prototype._onModelResort = function(model) {
      var new_index, observable, previous_index, sorted_targets, target;
      observable = kb.utils.wrappedObservable(this);
      target = this.hasViewModels() ? this.viewModelByModel(model) : model;
      previous_index = observable.indexOf(target);
      if (this.sorted_index) {
        sorted_targets = _.clone(observable());
        sorted_targets.splice(previous_index, 1);
        new_index = this.sorted_index(sorted_targets, target);
      } else {
        new_index = this.__kb.collection.indexOf(model);
      }
      if (previous_index === new_index) {
        return;
      }
      observable.splice(previous_index, 1);
      observable.splice(new_index, 0, target);
      return this.trigger('resort', target, observable(), new_index);
    };

    CollectionObservable.prototype._clear = function(silent) {
      var observable, target, targets, _i, _len, _results;
      observable = kb.utils.wrappedObservable(this);
      if (!silent) {
        this.trigger('remove', observable());
      }
      targets = observable.removeAll();
      if (this.hasViewModels()) {
        _results = [];
        for (_i = 0, _len = targets.length; _i < _len; _i++) {
          target = targets[_i];
          _results.push(this.__kb.store.releaseValue(target));
        }
        return _results;
      }
    };

    CollectionObservable.prototype._collectionResync = function(silent) {
      var add_index, model, observable, target, targets, _i, _len, _ref,
        _this = this;
      this._clear(silent);
      observable = kb.utils.wrappedObservable(this);
      if (this.sorted_index) {
        targets = [];
        _ref = this.__kb.collection.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          target = this._createTarget(model);
          add_index = this.sorted_index(targets, target);
          targets.splice(add_index, 0, target);
        }
      } else {
        targets = this.hasViewModels() ? _.map(this.__kb.collection.models, function(model) {
          return _this._createTarget(model);
        }) : _.clone(this.__kb.collection.models);
      }
      observable(targets);
      if (!silent) {
        return this.trigger('add', observable());
      }
    };

    CollectionObservable.prototype._sortAttributeFn = function(sort_attribute) {
      if (this.hasViewModels()) {
        return function(view_models, model) {
          return _.sortedIndex(view_models, model, function(test) {
            return kb.utils.wrappedModel(test).get(sort_attribute);
          });
        };
      } else {
        return function(models, model) {
          return _.sortedIndex(models, model, function(test) {
            return test.get(sort_attribute);
          });
        };
      }
    };

    CollectionObservable.prototype._createTarget = function(model) {
      var create_fn,
        _this = this;
      create_fn = function() {
        var observable, options, view_model;
        options = _this.__kb.store.addResolverToOptions({}, model);
        observable = kb.utils.wrappedObservable(_this);
        view_model = _this.view_model_create_with_new ? new _this.view_model_create_fn(model, options, observable) : _this.view_model_create_fn(model, options, observable);
        kb.utils.wrappedModel(view_model, model);
        return view_model;
      };
      if (this.hasViewModels()) {
        return this.__kb.store.resolveValue(model, create_fn);
      } else {
        return model;
      }
    };

    return CollectionObservable;

  })(kb.RefCountable);

  __extends(kb.CollectionObservable.prototype, Backbone.Events);

  kb.collectionObservable = function(collection, options, legacy) {
    return new kb.CollectionObservable(collection, options, legacy);
  };

  kb.sortedIndexWrapAttr = kb.siwa = function(attribute_name, wrapper_constructor) {
    return function(models, model) {
      return _.sortedIndex(models, model, function(test) {
        return new wrapper_constructor(kb.utils.wrappedModel(test).get(attribute_name));
      });
    };
  };

  /*
    knockback_default_wrapper.js
    (c) 2011, 2012 Kevin Malakoff.
    Knockback.DefaultWrapper is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.DefaultWrapper = (function() {

    function DefaultWrapper(target_observable, default_value_observable) {
      var observable,
        _this = this;
      this.default_value_observable = default_value_observable;
      this.__kb = {};
      observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
        read: function() {
          var current_default, current_target;
          current_target = ko.utils.unwrapObservable(target_observable());
          current_default = ko.utils.unwrapObservable(_this.default_value_observable);
          if (!current_target) {
            return current_default;
          } else {
            return current_target;
          }
        },
        write: function(value) {
          return target_observable(value);
        }
      }));
      observable.destroy = _.bind(this.destroy, this);
      observable.setToDefault = _.bind(this.setToDefault, this);
      return observable;
    }

    DefaultWrapper.prototype.destroy = function() {
      kb.utils.wrappedObservable(this, null);
      return this.default_value = null;
    };

    DefaultWrapper.prototype.setToDefault = function() {
      var observable;
      observable = kb.utils.wrappedObservable(this);
      return observable(this.default_value_observable);
    };

    return DefaultWrapper;

  })();

  kb.defaultWrapper = function(target, default_value) {
    return new kb.DefaultWrapper(target, default_value);
  };

  /*
    knockback_formatted_observable.js
    (c) 2011, 2012 Kevin Malakoff.
    Knockback.FormattedObservable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.toFormattedString = function(format) {
    var arg, args, index, parameter_index, result, value;
    result = format.slice();
    args = Array.prototype.slice.call(arguments, 1);
    for (index in args) {
      arg = args[index];
      value = ko.utils.unwrapObservable(arg);
      if (!value) {
        value = '';
      }
      parameter_index = format.indexOf("\{" + index + "\}");
      while (parameter_index >= 0) {
        result = result.replace("{" + index + "}", value);
        parameter_index = format.indexOf("\{" + index + "\}", parameter_index + 1);
      }
    }
    return result;
  };

  kb.parseFormattedString = function(string, format) {
    var count, format_indices_to_matched_indices, index, match_index, matches, parameter_count, parameter_index, positions, regex, regex_string, results, sorted_positions, _i, _results;
    regex_string = format.slice();
    index = 0;
    parameter_count = 0;
    positions = {};
    while (regex_string.search("\\{" + index + "\\}") >= 0) {
      parameter_index = format.indexOf("\{" + index + "\}");
      while (parameter_index >= 0) {
        regex_string = regex_string.replace("\{" + index + "\}", '(.*)');
        positions[parameter_index] = index;
        parameter_count++;
        parameter_index = format.indexOf("\{" + index + "\}", parameter_index + 1);
      }
      index++;
    }
    count = index;
    regex = new RegExp(regex_string);
    matches = regex.exec(string);
    if (matches) {
      matches.shift();
    }
    if (!matches || (matches.length !== parameter_count)) {
      return _.map((function() {
        _results = [];
        for (var _i = 1; 1 <= count ? _i <= count : _i >= count; 1 <= count ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this), function() {
        return '';
      });
    }
    sorted_positions = _.sortBy(_.keys(positions), function(parameter_index, format_index) {
      return parseInt(parameter_index, 10);
    });
    format_indices_to_matched_indices = {};
    for (match_index in sorted_positions) {
      parameter_index = sorted_positions[match_index];
      index = positions[parameter_index];
      if (format_indices_to_matched_indices.hasOwnProperty(index)) {
        continue;
      }
      format_indices_to_matched_indices[index] = match_index;
    }
    results = [];
    index = 0;
    while (index < count) {
      results.push(matches[format_indices_to_matched_indices[index]]);
      index++;
    }
    return results;
  };

  kb.FormattedObservable = (function() {

    function FormattedObservable(format, args) {
      var observable, observable_args;
      this.__kb = {};
      if (_.isArray(args)) {
        format = format;
        observable_args = args;
      } else {
        observable_args = Array.prototype.slice.call(arguments, 1);
      }
      observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
        read: function() {
          var arg, _i, _len;
          args = [ko.utils.unwrapObservable(format)];
          for (_i = 0, _len = observable_args.length; _i < _len; _i++) {
            arg = observable_args[_i];
            args.push(ko.utils.unwrapObservable(arg));
          }
          return kb.toFormattedString.apply(null, args);
        },
        write: function(value) {
          var index, matches, max_count, _results;
          matches = kb.parseFormattedString(value, ko.utils.unwrapObservable(format));
          max_count = Math.min(observable_args.length, matches.length);
          index = 0;
          _results = [];
          while (index < max_count) {
            observable_args[index](matches[index]);
            _results.push(index++);
          }
          return _results;
        }
      }));
      return observable;
    }

    FormattedObservable.prototype.destroy = function() {
      return kb.utils.wrappedObservable(this, null);
    };

    return FormattedObservable;

  })();

  kb.formattedObservable = function(format, args) {
    return new kb.FormattedObservable(format, Array.prototype.slice.call(arguments, 1));
  };

  /*
    knockback_localized_observable.js
    (c) 2011, 2012 Kevin Malakoff.
    Knockback.LocalizedObservable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.LocalizedObservable = (function() {

    LocalizedObservable.extend = Backbone.Model.extend;

    function LocalizedObservable(value, options, view_model) {
      var observable;
      this.value = value;
      this.options = options != null ? options : {};
      this.view_model = view_model != null ? view_model : {};
      if (!(this.options.read || this.read)) {
        throw 'LocalizedObservable: options.read is missing';
      }
      if (this.options.read && this.read) {
        throw 'LocalizedObservable: options.read and read class function exist. You need to choose one.';
      }
      if (this.options.write && this.write) {
        throw 'LocalizedObservable: options.write and write class function exist. You need to choose one.';
      }
      if (!kb.locale_manager) {
        throw 'LocalizedObservable: kb.locale_manager is not defined';
      }
      this.__kb = {};
      this.__kb._onLocaleChange = _.bind(this._onLocaleChange, this);
      if (this.value) {
        value = ko.utils.unwrapObservable(this.value);
      }
      this.__kb.value_observable = ko.observable(!value ? this._getDefaultValue() : this.read.call(this, value, null));
      if (this.write && !(typeof this.write === 'function')) {
        throw 'LocalizedObservable: options.write is not a function for read_write model attribute';
      }
      observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
        read: _.bind(this._onGetValue, this),
        write: this.write ? _.bind(this._onSetValue, this) : (function() {
          throw 'kb.LocalizedObservable: value is read only';
        }),
        owner: this.view_model
      }));
      observable.destroy = _.bind(this.destroy, this);
      observable.observedValue = _.bind(this.observedValue, this);
      observable.setToDefault = _.bind(this.setToDefault, this);
      observable.resetToCurrent = _.bind(this.resetToCurrent, this);
      kb.locale_manager.bind('change', this.__kb._onLocaleChange);
      return observable;
    }

    LocalizedObservable.prototype.destroy = function() {
      kb.locale_manager.unbind('change', this.__kb._onLocaleChange);
      this.__kb.value_observable = null;
      kb.utils.wrappedObservable(this).dispose();
      kb.utils.wrappedObservable(this, null);
      this.options = {};
      this.view_model = null;
      return this.__kb = null;
    };

    LocalizedObservable.prototype.setToDefault = function() {
      var current_value, default_value;
      if (!this["default"]) {
        return;
      }
      default_value = this._getDefaultValue();
      current_value = this.__kb.value_observable();
      if (current_value !== default_value) {
        return this._onSetValue(default_value);
      } else {
        return this.__kb.value_observable.valueHasMutated();
      }
    };

    LocalizedObservable.prototype.resetToCurrent = function() {
      this.__kb.value_observable(null);
      return this._onSetValue(this._getCurrentValue());
    };

    LocalizedObservable.prototype.observedValue = function(value) {
      if (arguments.length === 0) {
        return this.value;
      }
      this.value = value;
      this._onLocaleChange();
      return this;
    };

    LocalizedObservable.prototype._getDefaultValue = function() {
      if (!this["default"]) {
        return '';
      }
      if (typeof this["default"] === 'function') {
        return this["default"]();
      } else {
        return this["default"];
      }
    };

    LocalizedObservable.prototype._getCurrentValue = function() {
      var observable;
      observable = kb.utils.wrappedObservable(this);
      if (!(this.value && observable)) {
        return this._getDefaultValue();
      }
      return this.read.call(this, ko.utils.unwrapObservable(this.value));
    };

    LocalizedObservable.prototype._onGetValue = function() {
      if (this.value) {
        ko.utils.unwrapObservable(this.value);
      }
      return this.__kb.value_observable();
    };

    LocalizedObservable.prototype._onSetValue = function(value) {
      this.write.call(this, value, ko.utils.unwrapObservable(this.value));
      value = this.read.call(this, ko.utils.unwrapObservable(this.value));
      this.__kb.value_observable(value);
      if (this.options.onChange) {
        return this.options.onChange(value);
      }
    };

    LocalizedObservable.prototype._onLocaleChange = function() {
      var value;
      value = this.read.call(this, ko.utils.unwrapObservable(this.value));
      this.__kb.value_observable(value);
      if (this.options.onChange) {
        return this.options.onChange(value);
      }
    };

    return LocalizedObservable;

  })();

  kb.localizedObservable = function(value, options, view_model) {
    return new kb.LocalizedObservable(value, options, view_model);
  };

  /*
    knockback_observable.js
    (c) 2011, 2012 Kevin Malakoff.
    Knockback.Observable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.Observable = (function() {

    function Observable(model, mapping_info, view_model) {
      var observable,
        _this = this;
      this.model = model;
      this.mapping_info = mapping_info;
      this.view_model = view_model != null ? view_model : {};
      if (!this.model) {
        throw 'Observable: model is missing';
      }
      if (!this.mapping_info) {
        throw 'Observable: mapping_info is missing';
      }
      if (_.isString(this.mapping_info) || ko.isObservable(this.mapping_info)) {
        this.mapping_info = {
          key: this.mapping_info
        };
      }
      if (!this.mapping_info.key) {
        throw 'Observable: mapping_info.key is missing';
      }
      this.__kb = {};
      this.__kb._onModelChange = _.bind(this._onModelChange, this);
      this.__kb._onModelLoaded = _.bind(this._onModelLoaded, this);
      this.__kb._onModelUnloaded = _.bind(this._onModelUnloaded, this);
      if (this.mapping_info.hasOwnProperty('write') && _.isBoolean(this.mapping_info.write)) {
        this.mapping_info = _.clone(this.mapping_info);
        this.mapping_info.read_only = !this.mapping_info.write;
      }
      if (Backbone.ModelRef && (this.model instanceof Backbone.ModelRef)) {
        this.model_ref = this.model;
        this.model_ref.retain();
        this.model_ref.bind('loaded', this.__kb._onModelLoaded);
        this.model_ref.bind('unloaded', this.__kb._onModelUnloaded);
        this.model = this.model_ref.getModel();
      }
      this.__kb.value_observable = ko.observable();
      if (this.mapping_info.localizer) {
        this.__kb.localizer = new this.mapping_info.localizer(this._getCurrentValue());
      }
      observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
        read: _.bind(this._onGetValue, this),
        write: this.mapping_info.read_only ? (function() {
          throw "kb.Observable: " + _this.mapping_info.key + " is read only";
        }) : _.bind(this._onSetValue, this),
        owner: this.view_model
      }));
      observable.destroy = _.bind(this.destroy, this);
      observable.setToDefault = _.bind(this.setToDefault, this);
      if (!this.model_ref || this.model_ref.isLoaded()) {
        this.model.bind('change', this.__kb._onModelChange);
      }
      return observable;
    }

    Observable.prototype.destroy = function() {
      this.__kb.value_observable = null;
      kb.utils.wrappedObservable(this).dispose();
      kb.utils.wrappedObservable(this, null);
      if (this.model) {
        this.__kb._onModelUnloaded(this.model);
      }
      if (this.model_ref) {
        this.model_ref.unbind('loaded', this.__kb._onModelLoaded);
        this.model_ref.unbind('unloaded', this.__kb._onModelUnloaded);
        this.model_ref.release();
        this.model_ref = null;
      }
      this.mapping_info = null;
      this.view_model = null;
      return this.__kb = null;
    };

    Observable.prototype.setToDefault = function() {
      var value;
      value = this._getDefaultValue();
      if (this.__kb.localizer) {
        this.__kb.localizer.observedValue(value);
        value = this.__kb.localizer();
      }
      return this.__kb.value_observable(value);
    };

    Observable.prototype._getDefaultValue = function() {
      if (!this.mapping_info.hasOwnProperty('default')) {
        return '';
      }
      if (typeof this.mapping_info["default"] === 'function') {
        return this.mapping_info["default"]();
      } else {
        return this.mapping_info["default"];
      }
    };

    Observable.prototype._getCurrentValue = function() {
      var arg, args, key, _i, _len, _ref;
      if (!this.model) {
        return this._getDefaultValue();
      }
      key = ko.utils.unwrapObservable(this.mapping_info.key);
      args = [key];
      if (!_.isUndefined(this.mapping_info.args)) {
        if (_.isArray(this.mapping_info.args)) {
          _ref = this.mapping_info.args;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            arg = _ref[_i];
            args.push(ko.utils.unwrapObservable(arg));
          }
        } else {
          args.push(ko.utils.unwrapObservable(this.mapping_info.args));
        }
      }
      if (this.mapping_info.read) {
        return this.mapping_info.read.apply(this.view_model, args);
      } else {
        return this.model.get.apply(this.model, args);
      }
    };

    Observable.prototype._onGetValue = function() {
      var arg, value, _i, _len, _ref;
      this.__kb.value_observable();
      ko.utils.unwrapObservable(this.mapping_info.key);
      if (!_.isUndefined(this.mapping_info.args)) {
        if (_.isArray(this.mapping_info.args)) {
          _ref = this.mapping_info.args;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            arg = _ref[_i];
            ko.utils.unwrapObservable(arg);
          }
        } else {
          ko.utils.unwrapObservable(this.mapping_info.args);
        }
      }
      value = this._getCurrentValue();
      if (this.__kb.localizer) {
        this.__kb.localizer.observedValue(value);
        value = this.__kb.localizer();
      }
      return value;
    };

    Observable.prototype._onSetValue = function(value) {
      var arg, args, set_info, _i, _len, _ref;
      if (this.__kb.localizer) {
        this.__kb.localizer(value);
        value = this.__kb.localizer.observedValue();
      }
      if (this.model) {
        set_info = {};
        set_info[ko.utils.unwrapObservable(this.mapping_info.key)] = value;
        args = typeof this.mapping_info.write === 'function' ? [value] : [set_info];
        if (!_.isUndefined(this.mapping_info.args)) {
          if (_.isArray(this.mapping_info.args)) {
            _ref = this.mapping_info.args;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              arg = _ref[_i];
              args.push(ko.utils.unwrapObservable(arg));
            }
          } else {
            args.push(ko.utils.unwrapObservable(this.mapping_info.args));
          }
        }
        if (typeof this.mapping_info.write === 'function') {
          this.mapping_info.write.apply(this.view_model, args);
        } else {
          this.model.set.apply(this.model, args);
        }
      }
      if (this.__kb.localizer) {
        return this.__kb.value_observable(this.__kb.localizer());
      } else {
        return this.__kb.value_observable(value);
      }
    };

    Observable.prototype._modelBind = function(model) {
      if (!model) {
        return;
      }
      model.bind('change', this.__kb._onModelChange);
      if (Backbone.RelationalModel && (model instanceof Backbone.RelationalModel)) {
        model.bind('add', this.__kb._onModelChange);
        model.bind('remove', this.__kb._onModelChange);
        return model.bind('update', this.__kb._onModelChange);
      }
    };

    Observable.prototype._modelUnbind = function(model) {
      if (!model) {
        return;
      }
      model.unbind('change', this.__kb._onModelChange);
      if (Backbone.RelationalModel && (model instanceof Backbone.RelationalModel)) {
        model.unbind('add', this.__kb._onModelChange);
        model.unbind('remove', this.__kb._onModelChange);
        return model.unbind('update', this.__kb._onModelChange);
      }
    };

    Observable.prototype._onModelLoaded = function(model) {
      this.model = model;
      this._modelBind(model);
      return this._updateValue();
    };

    Observable.prototype._onModelUnloaded = function(model) {
      if (this.__kb.localizer && this.__kb.localizer.destroy) {
        this.__kb.localizer.destroy();
        this.__kb.localizer = null;
      }
      this._modelUnbind(model);
      return this.model = null;
    };

    Observable.prototype._onModelChange = function() {
      if ((this.model && this.model.hasChanged) && !this.model.hasChanged(ko.utils.unwrapObservable(this.mapping_info.key))) {
        return;
      }
      return this._updateValue();
    };

    Observable.prototype._updateValue = function() {
      var value;
      value = this._getCurrentValue();
      if (this.__kb.localizer) {
        this.__kb.localizer.observedValue(value);
        value = this.__kb.localizer();
      }
      return this.__kb.value_observable(value);
    };

    return Observable;

  })();

  kb.observable = function(model, mapping_info, view_model) {
    return new kb.Observable(model, mapping_info, view_model);
  };

  /*
    knockback_observables.js
    (c) 2011, 2012 Kevin Malakoff.
    Knockback.Observables is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.Observables = (function() {

    function Observables(model, mappings_info, view_model, options_or_read_only) {
      var is_string, key, mapping_info, property_name, read_only, _i, _len, _ref, _ref1;
      if (!model) {
        throw 'Observables: model is missing';
      }
      if (!(mappings_info && (_.isObject(mappings_info) || _.isArray(mappings_info)))) {
        throw 'Observables: mappings_info is missing';
      }
      this.__kb || (this.__kb = {});
      this.__kb.model = model;
      if (_.isArray(mappings_info)) {
        this.__kb.mappings_info = {};
        for (_i = 0, _len = mappings_info.length; _i < _len; _i++) {
          key = mappings_info[_i];
          this.__kb.mappings_info[key] = {};
        }
      } else {
        this.__kb.mappings_info = mappings_info;
      }
      this.__kb.view_model = _.isUndefined(view_model) ? this : view_model;
      if (!_.isUndefined(options_or_read_only) && options_or_read_only.hasOwnProperty('write')) {
        kb.utils.legacyWarning('kb.Observables option.write', '0.16.0', 'Now default is writable so only supply read_only as required');
        options_or_read_only.read_only = !options_or_read_only.write;
        delete options_or_read_only['write'];
      }
      if (!_.isUndefined(options_or_read_only)) {
        read_only = _.isBoolean(options_or_read_only) ? options_or_read_only : options_or_read_only.read_only;
        _ref = this.__kb.mappings_info;
        for (property_name in _ref) {
          mapping_info = _ref[property_name];
          is_string = _.isString(mapping_info);
          if (is_string) {
            mapping_info = !_.isUndefined(read_only) ? {
              key: mapping_info,
              read_only: read_only
            } : {
              key: mapping_info
            };
          } else if (!_.isUndefined(read_only) && !(mapping_info.hasOwnProperty('read_only') || mapping_info.hasOwnProperty('write'))) {
            mapping_info.read_only = read_only;
          }
          if (!mapping_info.hasOwnProperty('key')) {
            mapping_info.key = property_name;
          }
          this[property_name] = this.__kb.view_model[property_name] = kb.observable(this.__kb.model, mapping_info, this.__kb.view_model);
        }
      } else {
        _ref1 = this.__kb.mappings_info;
        for (property_name in _ref1) {
          mapping_info = _ref1[property_name];
          if (mapping_info.hasOwnProperty('write')) {
            kb.utils.legacyWarning('kb.Observables option.write', '0.16.0', 'Now default is writable so only supply read_only as required');
          }
          if (!mapping_info.hasOwnProperty('key')) {
            mapping_info.key = property_name;
          }
          this[property_name] = this.__kb.view_model[property_name] = kb.observable(this.__kb.model, mapping_info, this.__kb.view_model);
        }
      }
    }

    Observables.prototype.destroy = function() {
      var mapping_info, property_name, _ref;
      _ref = this.__kb.mappings_info;
      for (property_name in _ref) {
        mapping_info = _ref[property_name];
        if (this.__kb.view_model[property_name]) {
          this.__kb.view_model[property_name].destroy();
        }
        this.__kb.view_model[property_name] = null;
        this[property_name] = null;
      }
      this.__kb.view_model = null;
      this.__kb.mappings_info = null;
      return this.__kb.model = null;
    };

    Observables.prototype.setToDefault = function() {
      var mapping_info, property_name, _ref, _results;
      _ref = this.__kb.mappings_info;
      _results = [];
      for (property_name in _ref) {
        mapping_info = _ref[property_name];
        _results.push(this.__kb.view_model[property_name].setToDefault());
      }
      return _results;
    };

    return Observables;

  })();

  kb.observables = function(model, mappings_info, view_model, options) {
    return new kb.Observables(model, mappings_info, view_model, options);
  };

  /*
    knockback_triggered_observable.js
    (c) 2011, 2012 Kevin Malakoff.
    Knockback.Observable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.TriggeredObservable = (function() {

    function TriggeredObservable(model, event_name) {
      var observable;
      this.model = model;
      this.event_name = event_name;
      if (!this.model) {
        throw 'Observable: model is missing';
      }
      if (!this.event_name) {
        throw 'Observable: event_name is missing';
      }
      this.__kb = {};
      this.__kb._onValueChange = _.bind(this._onValueChange, this);
      this.__kb._onModelLoaded = _.bind(this._onModelLoaded, this);
      this.__kb._onModelUnloaded = _.bind(this._onModelUnloaded, this);
      if (Backbone.ModelRef && (this.model instanceof Backbone.ModelRef)) {
        this.model_ref = this.model;
        this.model_ref.retain();
        this.model_ref.bind('loaded', this.__kb._onModelLoaded);
        this.model_ref.bind('unloaded', this.__kb._onModelUnloaded);
        this.model = this.model_ref.getModel();
      }
      this.__kb.value_observable = ko.observable();
      observable = kb.utils.wrappedObservable(this, ko.dependentObservable(_.bind(this._onGetValue, this)));
      observable.destroy = _.bind(this.destroy, this);
      if (!this.model_ref || this.model_ref.isLoaded()) {
        this._onModelLoaded(this.model);
      }
      return observable;
    }

    TriggeredObservable.prototype.destroy = function() {
      kb.utils.wrappedObservable(this).dispose();
      kb.utils.wrappedObservable(this, null);
      this.__kb.value_observable = null;
      if (this.model) {
        this._onModelUnloaded(this.model);
      }
      if (this.model_ref) {
        this.model_ref.unbind('loaded', this.__kb._onModelLoaded);
        this.model_ref.unbind('unloaded', this.__kb._onModelUnloaded);
        this.model_ref.release();
        this.model_ref = null;
      }
      this.options = null;
      this.view_model = null;
      return this.__kb = null;
    };

    TriggeredObservable.prototype._onGetValue = function() {
      return this.__kb.value_observable();
    };

    TriggeredObservable.prototype._onModelLoaded = function(model) {
      this.model = model;
      this.model.bind(this.event_name, this.__kb._onValueChange);
      return this._onValueChange();
    };

    TriggeredObservable.prototype._onModelUnloaded = function() {
      if (this.__kb.localizer && this.__kb.localizer.destroy) {
        this.__kb.localizer.destroy();
        this.__kb.localizer = null;
      }
      this.model.unbind(this.event_name, this.__kb._onValueChange);
      return this.model = null;
    };

    TriggeredObservable.prototype._onValueChange = function() {
      var current_value;
      current_value = this.__kb.value_observable();
      if (current_value !== this.model) {
        return this.__kb.value_observable(this.model);
      } else {
        return this.__kb.value_observable.valueHasMutated();
      }
    };

    return TriggeredObservable;

  })();

  kb.triggeredObservable = function(model, event_name) {
    return new kb.TriggeredObservable(model, event_name);
  };

  /*
    knockback_attribute_connectors.js
    (c) 2012 Kevin Malakoff.
    Knockback.AttributeConnector is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.AttributeConnector = (function() {

    function AttributeConnector(model, key, options) {
      var observable;
      this.key = key;
      this.options = options != null ? options : {};
      kb.utils.wrappedModel(this, model);
      this.options = _.clone(this.options);
      this.__kb.value_observable = ko.observable();
      observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
        read: _.bind(this.read, this),
        write: _.bind(this.write, this)
      }));
      observable.destroy = _.bind(this.destroy, this);
      observable.model = _.bind(this.model, this);
      observable.update = _.bind(this.update, this);
      this.__kb.initializing = true;
      this.update();
      this.__kb.initializing = false;
      return observable;
    }

    AttributeConnector.prototype.destroy = function() {
      this.__kb.value_observable = null;
      kb.utils.wrappedObservable(this).dispose();
      return kb.utils.wrappedObservable(this, null);
    };

    AttributeConnector.prototype.read = function() {
      return this.__kb.value_observable();
    };

    AttributeConnector.prototype.write = function(value) {
      var model, set_info;
      model = kb.utils.wrappedModel(this);
      if (!model) {
        return;
      }
      if (this.options.read_only) {
        if (!this.__kb.initializing) {
          throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.";
        }
      } else {
        set_info = {};
        set_info[this.key] = value;
        return model.set(set_info);
      }
    };

    AttributeConnector.prototype.model = function(new_model) {
      var model;
      model = kb.utils.wrappedModel(this);
      if (arguments.length === 0) {
        return model;
      }
      if (model === new_model) {
        return;
      }
      kb.utils.wrappedModel(this, new_model);
      return this.update();
    };

    AttributeConnector.inferType = function(model, key) {
      var relation, value;
      value = model.get(key);
      if (!value) {
        if (!(Backbone.RelationalModel && (model instanceof Backbone.RelationalModel))) {
          return 'simple';
        }
        relation = _.find(model.getRelations(), function(test) {
          return test.key === key;
        });
        if (!relation) {
          return 'simple';
        }
        if (relation.collectionKey) {
          return 'collection';
        } else {
          return 'model';
        }
      }
      if (value instanceof Backbone.Collection) {
        return 'collection';
      }
      if ((value instanceof Backbone.Model) || (Backbone.ModelRef && (value instanceof Backbone.ModelRef))) {
        return 'model';
      }
      return 'simple';
    };

    AttributeConnector.createByType = function(type, model, key, options) {
      var attribute_options;
      switch (type) {
        case 'collection':
          attribute_options = options ? _.clone(options) : {};
          if (!(options.view_model || options.view_model_create || options.children || options.create)) {
            attribute_options.view_model = kb.ViewModel;
          }
          if (options.store) {
            options.store.addResolverToOptions(attribute_options, model.get(key));
          }
          return kb.collectionAttributeConnector(model, key, attribute_options);
        case 'model':
          attribute_options = options ? _.clone(options) : {};
          if (!attribute_options.options) {
            attribute_options.options = {};
          }
          if (!(options.view_model || options.view_model_create || options.children || options.create)) {
            attribute_options.view_model = kb.ViewModel;
          }
          if (options.store) {
            options.store.addResolverToOptions(attribute_options.options, model.get(key));
          }
          return kb.viewModelAttributeConnector(model, key, attribute_options);
        default:
          return kb.simpleAttributeConnector(model, key, options);
      }
    };

    AttributeConnector.createOrUpdate = function(attribute_connector, model, key, options) {
      var attribute_options, value;
      if (attribute_connector) {
        if (kb.utils.observableInstanceOf(attribute_connector, kb.AttributeConnector)) {
          if (attribute_connector.model() !== model) {
            attribute_connector.model(model);
          } else {
            attribute_connector.update();
          }
        }
        return attribute_connector;
      }
      if (!model) {
        return kb.simpleAttributeConnector(model, key, options);
      }
      if (options.hasOwnProperty('create')) {
        if (!options.create) {
          throw 'kb.AttributeConnector: options.create is empty';
        }
        return options.create(model, key, options.options || {});
      }
      value = model.get(key);
      if (options.hasOwnProperty('view_model')) {
        if (!options.view_model) {
          throw 'kb.AttributeConnector: options.view_model is empty';
        }
        return new options.view_model(value, options.options || {});
      } else if (options.hasOwnProperty('view_model_create')) {
        if (!options.view_model_create) {
          throw 'kb.AttributeConnector: options.view_model_create is empty';
        }
        return options.view_model_create(value, options.options || {});
      } else if (options.hasOwnProperty('children')) {
        if (!options.children) {
          throw 'kb.AttributeConnector: options.children is empty';
        }
        if (typeof options.children === 'function') {
          attribute_options = {
            view_model: options.children
          };
        } else {
          attribute_options = options.children || {};
        }
        return kb.collectionAttributeConnector(model, key, attribute_options);
      }
      return this.createByType(this.inferType(model, key), model, key, options);
    };

    return AttributeConnector;

  })();

  kb.SimpleAttributeConnector = (function(_super) {

    __extends(SimpleAttributeConnector, _super);

    function SimpleAttributeConnector() {
      SimpleAttributeConnector.__super__.constructor.apply(this, arguments);
      return kb.utils.wrappedObservable(this);
    }

    SimpleAttributeConnector.prototype.destroy = function() {
      this.current_value = null;
      return SimpleAttributeConnector.__super__.destroy.apply(this, arguments);
    };

    SimpleAttributeConnector.prototype.update = function() {
      var current_value, model, value;
      model = kb.utils.wrappedModel(this);
      if (!model) {
        return;
      }
      value = model.get(this.key);
      current_value = this.__kb.value_observable();
      if (!_.isEqual(current_value, value)) {
        return this.__kb.value_observable(value);
      }
    };

    SimpleAttributeConnector.prototype.write = function(value) {
      var model;
      model = kb.utils.wrappedModel(this);
      if (!model) {
        this.__kb.value_observable(value);
        return;
      }
      return SimpleAttributeConnector.__super__.write.apply(this, arguments);
    };

    return SimpleAttributeConnector;

  })(kb.AttributeConnector);

  kb.simpleAttributeConnector = function(model, key, options) {
    return new kb.SimpleAttributeConnector(model, key, options);
  };

  kb.CollectionAttributeConnector = (function(_super) {

    __extends(CollectionAttributeConnector, _super);

    function CollectionAttributeConnector() {
      CollectionAttributeConnector.__super__.constructor.apply(this, arguments);
      return kb.utils.wrappedObservable(this);
    }

    CollectionAttributeConnector.prototype.destroy = function() {
      var current_value;
      current_value = this.__kb.value_observable();
      if (current_value && (typeof current_value.refCount === 'function') && (current_value.refCount() > 0)) {
        current_value.release();
      }
      return CollectionAttributeConnector.__super__.destroy.apply(this, arguments);
    };

    CollectionAttributeConnector.prototype.update = function() {
      var current_value, model, value,
        _this = this;
      model = kb.utils.wrappedModel(this);
      if (!model) {
        return;
      }
      value = model.get(this.key);
      current_value = this.__kb.value_observable();
      if (!current_value) {
        if (this.options.store) {
          return this.__kb.value_observable(this.options.store.resolveValue(value, function() {
            return kb.collectionObservable(value, _this.options);
          }));
        } else {
          return this.__kb.value_observable(kb.collectionObservable(value, this.options));
        }
      } else {
        if (current_value.collection() !== value) {
          current_value.collection(value);
          return this.__kb.value_observable.valueHasMutated();
        }
      }
    };

    CollectionAttributeConnector.prototype.read = function() {
      var current_value;
      current_value = this.__kb.value_observable();
      if (current_value) {
        return current_value();
      } else {
        return void 0;
      }
    };

    return CollectionAttributeConnector;

  })(kb.AttributeConnector);

  kb.collectionAttributeConnector = function(model, key, options) {
    return new kb.CollectionAttributeConnector(model, key, options);
  };

  kb.ViewModelAttributeConnector = (function(_super) {

    __extends(ViewModelAttributeConnector, _super);

    function ViewModelAttributeConnector() {
      ViewModelAttributeConnector.__super__.constructor.apply(this, arguments);
      return kb.utils.wrappedObservable(this);
    }

    ViewModelAttributeConnector.prototype.destroy = function() {
      var current_value;
      current_value = this.__kb.value_observable();
      if (current_value && (typeof current_value.refCount === 'function') && (current_value.refCount() > 0)) {
        current_value.release();
      }
      return ViewModelAttributeConnector.__super__.destroy.apply(this, arguments);
    };

    ViewModelAttributeConnector.prototype.update = function() {
      var current_value, model, value, view_model_options,
        _this = this;
      model = kb.utils.wrappedModel(this);
      if (!model) {
        return;
      }
      value = model.get(this.key);
      current_value = this.__kb.value_observable();
      if (!current_value) {
        view_model_options = this.options.options ? _.clone(this.options.options) : {};
        if (view_model_options.store) {
          return this.__kb.value_observable(view_model_options.store.resolveValue(value, function() {
            if (_this.options.view_model) {
              return new _this.options.view_model(value, view_model_options);
            } else {
              return _this.options.view_model_create(value, view_model_options);
            }
          }));
        } else {
          return this.__kb.value_observable(this.options.view_model ? new this.options.view_model(value, view_model_options) : this.options.view_model_create(value, view_model_options));
        }
      } else {
        if (!(current_value.model && (typeof current_value.model === 'function'))) {
          throw "kb.viewModelAttributeConnector: unknown how to model a view model";
        }
        if (current_value.model() !== value) {
          current_value.model(value);
          return this.__kb.value_observable.valueHasMutated();
        }
      }
    };

    return ViewModelAttributeConnector;

  })(kb.AttributeConnector);

  kb.viewModelAttributeConnector = function(model, key, options) {
    return new kb.ViewModelAttributeConnector(model, key, options);
  };

  /*
    knockback_view_model.js
    (c) 2011, 2012 Kevin Malakoff.
    Knockback.Observable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.ViewModel = (function(_super) {

    __extends(ViewModel, _super);

    function ViewModel(model, options) {
      var key, missing, _i, _len;
      if (options == null) {
        options = {};
      }
      ViewModel.__super__.constructor.apply(this, arguments);
      if (kb.stats_on) {
        kb.stats.view_models++;
      }
      if (!options.store_skip_resolve) {
        kb.Store.resolveFromOptions(options, this);
      }
      if (options.store) {
        this.__kb.store = options.store;
      } else {
        this.__kb.store = new kb.Store();
        this.__kb.store_is_owned = true;
      }
      this.__kb._onModelChange = _.bind(this._onModelChange, this);
      this.__kb._onModelLoaded = _.bind(this._onModelLoaded, this);
      this.__kb._onModelUnloaded = _.bind(this._onModelUnloaded, this);
      this.__kb.internals = options.internals;
      this.__kb.requires = options.requires;
      this.__kb.children = options.children;
      this.__kb.create = options.create;
      this.__kb.read_only = options.read_only;
      kb.utils.wrappedModel(this, model);
      if (Backbone.ModelRef && (model instanceof Backbone.ModelRef)) {
        this.__kb.model_ref = model;
        this.__kb.model_ref.retain();
        kb.utils.wrappedModel(this, this.__kb.model_ref.getModel());
        this.__kb.model_ref.bind('loaded', this.__kb._onModelLoaded);
        this.__kb.model_ref.bind('unloaded', this.__kb._onModelUnloaded);
      }
      if (this.__kb.model) {
        this._onModelLoaded(this.__kb.model);
      }
      if (!this.__kb.internals && !this.__kb.requires) {
        return this;
      }
      missing = _.union((this.__kb.internals ? this.__kb.internals : []), (this.__kb.requires ? this.__kb.requires : []));
      if (!this.__kb.model_ref || this.__kb.model_ref.isLoaded()) {
        missing = _.difference(missing, _.keys(this.__kb.model.attributes));
      }
      for (_i = 0, _len = missing.length; _i < _len; _i++) {
        key = missing[_i];
        this._updateAttributeConnector(this.__kb.model, key);
      }
    }

    ViewModel.prototype.__destroy = function() {
      var model;
      model = this.__kb.model;
      kb.utils.wrappedModel(this, null);
      this._modelUnbind(model);
      if (this.__kb.store_is_owned) {
        this.__kb.store.destroy();
      }
      this.__kb.store = null;
      kb.utils.release(this, true);
      ViewModel.__super__.__destroy.apply(this, arguments);
      if (kb.stats_on) {
        return kb.stats.view_models--;
      }
    };

    ViewModel.prototype.model = function(new_model) {
      var model;
      model = kb.utils.wrappedModel(this);
      if (arguments.length === 0) {
        return model;
      }
      if (new_model === model) {
        return;
      }
      if (model) {
        this._onModelUnloaded(model);
      }
      if (new_model) {
        return this._onModelLoaded(new_model);
      }
    };

    ViewModel.prototype._modelBind = function(model) {
      if (!model) {
        return;
      }
      model.bind('change', this.__kb._onModelChange);
      if (Backbone.RelationalModel && (model instanceof Backbone.RelationalModel)) {
        model.bind('add', this.__kb._onModelChange);
        model.bind('remove', this.__kb._onModelChange);
        return model.bind('update', this.__kb._onModelChange);
      }
    };

    ViewModel.prototype._modelUnbind = function(model) {
      if (!model) {
        return;
      }
      model.unbind('change', this.__kb._onModelChange);
      if (Backbone.RelationalModel && (model instanceof Backbone.RelationalModel)) {
        model.unbind('add', this.__kb._onModelChange);
        model.unbind('remove', this.__kb._onModelChange);
        return model.unbind('update', this.__kb._onModelChange);
      }
    };

    ViewModel.prototype._onModelLoaded = function(model) {
      var key, _results;
      kb.utils.wrappedModel(this, model);
      this._modelBind(model);
      _results = [];
      for (key in this.__kb.model.attributes) {
        _results.push(this._updateAttributeConnector(this.__kb.model, key));
      }
      return _results;
    };

    ViewModel.prototype._onModelUnloaded = function(model) {
      var key, _results;
      this._modelUnbind(model);
      kb.utils.wrappedModel(this, null);
      _results = [];
      for (key in model.attributes) {
        _results.push(this._updateAttributeConnector(null, key));
      }
      return _results;
    };

    ViewModel.prototype._onModelChange = function() {
      var key, _results, _results1;
      if (this.__kb.model._changed) {
        _results = [];
        for (key in this.__kb.model.attributes) {
          _results.push(this.__kb.model.hasChanged(key) ? this._updateAttributeConnector(this.__kb.model, key) : void 0);
        }
        return _results;
      } else if (this.__kb.model.changed) {
        _results1 = [];
        for (key in this.__kb.model.changed) {
          _results1.push(this._updateAttributeConnector(this.__kb.model, key));
        }
        return _results1;
      }
    };

    ViewModel.prototype._updateAttributeConnector = function(model, key) {
      var vm_key;
      vm_key = this.__kb.internals && _.contains(this.__kb.internals, key) ? '_' + key : key;
      return this[vm_key] = kb.AttributeConnector.createOrUpdate(this[vm_key], model, key, this._createOptions(key));
    };

    ViewModel.prototype._createOptions = function(key) {
      var options;
      if (this.__kb.children) {
        if (this.__kb.children.hasOwnProperty(key)) {
          options = this.__kb.children[key];
          if (typeof options === 'function') {
            options = {
              view_model: options
            };
          }
          options.options = {
            read_only: this.__kb.read_only,
            store: this.__kb.store
          };
          return options;
        } else if (this.__kb.children.hasOwnProperty('create')) {
          return {
            create: this.__kb.children.create,
            options: {
              read_only: this.__kb.read_only,
              store: this.__kb.store
            }
          };
        }
      } else if (this.__kb.create) {
        return {
          create: this.__kb.create,
          options: {
            read_only: this.__kb.read_only,
            store: this.__kb.store
          }
        };
      }
      return {
        read_only: this.__kb.read_only,
        store: this.__kb.store
      };
    };

    return ViewModel;

  })(kb.RefCountable);

  kb.viewModel = function(model, options) {
    return new kb.ViewModel(model, options);
  };

}).call(this);

}
});
this.require.define({
  'knockback-inspector': function(exports, require, module) {
// Generated by CoffeeScript 1.3.3

/*
knockback-inspector.js 0.1.2
(c) 2012 Kevin Malakoff.
Knockback-Inspector.js is freely distributable under the MIT license.
See the following for full license details:
  https://github.com/kmalakoff/knockback-inspector/blob/master/LICENSE
Dependencies: Knockout.js, Underscore.js, Backbone.js, and Knockback.js.
*/


(function() {
  var Backbone, kb, kbi, ko, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = !window._ && (typeof require !== 'undefined') ? require('underscore') : window._;

  if (_ && !_.VERSION) {
    _ = _._;
  }

  Backbone = !window.Backbone && (typeof require !== 'undefined') ? require('backbone') : window.Backbone;

  ko = !window.ko && (typeof require !== 'undefined') ? require('knockout') : window.ko;

  kb = !window.kb && (typeof require !== 'undefined') ? require('knockback') : window.kb;

  kbi = this.kbi = typeof exports !== 'undefined' ? exports : {};

  this.kbi.VERSION = '0.1.2';

  kbi.TemplateSource = (function() {

    function TemplateSource(template_generator, template_data) {
      this.template_generator = template_generator;
      this.template_data = template_data != null ? template_data : {};
    }

    TemplateSource.prototype.data = function(key, value) {
      if (arguments.length === 1) {
        return this.template_data[key];
      }
      return this.template_data[key] = value;
    };

    TemplateSource.prototype.text = function() {
      if (arguments.length > 0) {
        throw 'kbi.TemplateSource: unexpected writing to template source';
      }
      return this.template_generator.viewText(this.template_data);
    };

    return TemplateSource;

  })();

  kbi.TemplateEngine = (function(_super) {

    __extends(TemplateEngine, _super);

    function TemplateEngine() {
      this.allowTemplateRewriting = false;
      this.generators = {
        kbi_model_node: kbi.ModelNodeViewGenerator,
        kbi_collection_node: kbi.CollectionNodeViewGenerator
      };
    }

    TemplateEngine.prototype.generator = function(template_name, generator_class) {
      if (arguments.length === 1) {
        return this.generators[template_name];
      }
      return this.generators[template_name] = generator_class;
    };

    TemplateEngine.prototype.makeTemplateSource = function(template_name) {
      if (this.generators.hasOwnProperty(template_name)) {
        return new kbi.TemplateSource(new this.generators[template_name](template_name));
      }
      return TemplateEngine.__super__.makeTemplateSource.apply(this, arguments);
    };

    TemplateEngine.prototype.renderTemplateSource = function(template_source, binding_context, options) {
      var key, value;
      for (key in binding_context) {
        value = binding_context[key];
        template_source.data(key, value);
      }
      return TemplateEngine.__super__.renderTemplateSource.apply(this, arguments);
    };

    return TemplateEngine;

  })(ko.nativeTemplateEngine);

  kbi.FetchedModel = (function(_super) {

    __extends(FetchedModel, _super);

    function FetchedModel() {
      return FetchedModel.__super__.constructor.apply(this, arguments);
    }

    FetchedModel.prototype.parse = function(response) {
      var attributes, collection, key, model, value;
      attributes = {};
      for (key in response) {
        value = response[key];
        if (_.isObject(value)) {
          model = new kbi.FetchedModel();
          attributes[key] = model.set(model.parse(value));
        } else if (_.isArray(value)) {
          collection = new kbi.FetchedCollection();
          attributes[key] = collection.reset(collection.parse(value));
        } else {
          attributes[key] = value;
        }
      }
      return attributes;
    };

    return FetchedModel;

  })(Backbone.Model);

  kbi.FetchedCollection = (function(_super) {

    __extends(FetchedCollection, _super);

    function FetchedCollection() {
      return FetchedCollection.__super__.constructor.apply(this, arguments);
    }

    FetchedCollection.prototype.model = kbi.FetchedModel;

    FetchedCollection.prototype.parse = function(response) {
      var models;
      models = response.results ? response.results : response;
      return _.map(response.results, function(result) {
        var model;
        model = new kbi.FetchedModel();
        return model.set(model.parse(result));
      });
    };

    return FetchedCollection;

  })(Backbone.Collection);

  kbi.NodeViewModel = (function() {

    function NodeViewModel(name, opened, node) {
      var model;
      this.name = name;
      this.opened = ko.observable(opened);
      this.node = ko.utils.unwrapObservable(node);
      if (this.node instanceof kb.ViewModel) {
        model = kb.utils.wrappedModel(this.node);
        this.attribute_names = ko.observableArray(model ? _.keys(model.attributes) : []);
      }
      this;

    }

    NodeViewModel.prototype.attributeType = function(key) {
      var attribute_connector;
      attribute_connector = this.node[key];
      if (ko.utils.unwrapObservable(attribute_connector) instanceof kb.ViewModel) {
        return 'model';
      }
      if (kb.utils.observableInstanceOf(attribute_connector, kb.CollectionAttributeConnector)) {
        return 'collection';
      }
      return 'simple';
    };

    return NodeViewModel;

  })();

  kbi.nodeViewModel = kbi.nvm = function(name, opened, node) {
    return new kbi.NodeViewModel(name, opened, node);
  };

  kbi.CollectionNodeViewGenerator = (function() {

    function CollectionNodeViewGenerator(template_name) {
      this.template_name = template_name;
    }

    CollectionNodeViewGenerator.prototype.viewText = function(data) {
      return "" + (this.nodeStart(data)) + "\n" + (this.nodeManipulator(data)) + "\n  <!-- ko if: opened -->\n    <!-- ko foreach: node -->\n      " + (this.modelNode(data)) + "\n    <!-- /ko -->\n  <!-- /ko -->\n" + (this.nodeEnd(data));
    };

    CollectionNodeViewGenerator.prototype.nodeStart = function(data) {
      return "<li class='kbi' data-bind=\"css: {opened: opened, closed: !opened()}\">";
    };

    CollectionNodeViewGenerator.prototype.nodeManipulator = function(data) {
      return "<div class='collection' data-bind=\"click: function(){ opened(!opened()) }\">\n  <span data-bind=\"text: (opened() ? '- ' : '+ ' )\"></span>\n  <span data-bind=\"text: name\"></span>\n</div>";
    };

    CollectionNodeViewGenerator.prototype.modelNode = function(data) {
      return "" + (kbi.ViewHTML.modelTree("'['+$index()+']'", false, "$data"));
    };

    CollectionNodeViewGenerator.prototype.nodeEnd = function(data) {
      return "</li>";
    };

    return CollectionNodeViewGenerator;

  })();

  kbi.ModelNodeViewGenerator = (function() {

    function ModelNodeViewGenerator(template_name) {
      this.template_name = template_name;
    }

    ModelNodeViewGenerator.prototype.viewText = function(data) {
      return "" + (this.nodeStart(data)) + "\n" + (this.nodeManipulator(data)) + "\n  <!-- ko if: opened -->\n    <!-- ko foreach: attribute_names -->\n      <!-- ko if: ($parent.attributeType($data) == 'simple') -->\n        " + (this.attributeEditor(data)) + "\n      <!-- /ko -->\n\n      <!-- ko if: ($parent.attributeType($data) == 'model') -->\n        " + (this.modelTree(data)) + "\n      <!-- /ko -->\n\n      <!-- ko if: ($parent.attributeType($data) == 'collection') -->\n        " + (this.modelTree(data)) + "\n      <!-- /ko -->\n\n    <!-- /ko -->\n  <!-- /ko -->\n" + (this.nodeEnd(data));
    };

    ModelNodeViewGenerator.prototype.nodeStart = function(data) {
      return "<li class='kbi' data-bind=\"css: {opened: opened, closed: !opened()}\">";
    };

    ModelNodeViewGenerator.prototype.nodeManipulator = function(data) {
      return "<div class='collection' data-bind=\"click: function(){ opened(!opened()) }\">\n  <span data-bind=\"text: (opened() ? '- ' : '+ ' )\"></span>\n  <span data-bind=\"text: name\"></span>\n</div>";
    };

    ModelNodeViewGenerator.prototype.attributeEditor = function(data) {
      return "<fieldset class='kbi'>\n  <label data-bind=\"text: $data\"> </label>\n  <input type='text' data-bind=\"value: $parent.node[$data]\">\n</fieldset>";
    };

    ModelNodeViewGenerator.prototype.modelTree = function(data) {
      return "" + (kbi.ViewHTML.modelTree('$data', false, "$parent.node[$data]"));
    };

    ModelNodeViewGenerator.prototype.collectionTree = function(data) {
      return "" + (kbi.ViewHTML.collectionTree("$data+'[]'", true, "$parent.node[$data]"));
    };

    ModelNodeViewGenerator.prototype.nodeEnd = function(data) {
      return "</li>";
    };

    return ModelNodeViewGenerator;

  })();

  kbi.ViewHTML = (function() {

    function ViewHTML() {}

    ViewHTML.modelTree = function(name, opened, node) {
      return "<ul class='kbi' data-bind=\"template: {name: 'kbi_model_node', data: kbi.nvm(" + name + ", " + opened + ", " + node + ")}\"></ul>";
    };

    ViewHTML.collectionTree = function(data) {
      return "<ul class='kbi' data-bind=\"template: {name: 'kbi_collection_node', data: kbi.nvm(" + name + ", " + opened + ", " + node + ")}\"></ul>";
    };

    return ViewHTML;

  })();

}).call(this);

}
});
this.require.define({
  'lifecycle': function(exports, require, module) {
// Generated by CoffeeScript 1.3.3

/*
  Lifecycle.js 1.0.1
  (c) 2011, 2012 Kevin Malakoff.
  Lifecycle is freely distributable under the MIT license.
  https:#github.com/kmalakoff/Lifecycle

 Note: some code from Backbone.js is repeated in this file.
 Please see the following for details on Backbone.js and its licensing:
   https:github.com/documentcloud/backbone
   https:github.com/documentcloud/backbone/blob/master/LICENSE
*/


(function() {
  var LC, copyProps, isArray;

  LC = this.LC = typeof exports !== 'undefined' ? exports : {};

  LC.VERSION = "1.0.1";

  isArray = function(obj) {
    return obj.constructor === Array;
  };

  copyProps = function(dest, source) {
    var key, value;
    for (key in source) {
      value = source[key];
      dest[key] = value;
    }
    return dest;
  };

  
// Shared empty constructor function to aid in prototype-chain creation.
var ctor = function(){};

// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to 'goog.inherits', but uses a hash of prototype properties and
// class properties to be extended.
var inherits = function(parent, protoProps, staticProps) {
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your extend definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && protoProps.hasOwnProperty('constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ parent.apply(this, arguments); };
  }

  // Inherit class (static) properties from parent.
  copyProps(child, parent);

  // Set the prototype chain to inherit from parent, without calling
  // parent's constructor function.
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) copyProps(child.prototype, protoProps);

  // Add static properties to the constructor function, if supplied.
  if (staticProps) copyProps(child, staticProps);

  // Correctly set child's 'prototype.constructor'.
  child.prototype.constructor = child;

  // Set a convenience property in case the parent's prototype is needed later.
  child.__super__ = parent.prototype;

  return child;
};

// The self-propagating extend function that BacLCone classes use.
var extend = function (protoProps, classProps) {
  var child = inherits(this, protoProps, classProps);
  child.extend = this.extend;
  return child;
};
;


  LC.own = function(obj, options) {
    var clone, key, value, _i, _j, _len, _len1;
    if (!obj || (typeof obj !== "object")) {
      return obj;
    }
    options || (options = {});
    if (isArray(obj)) {
      if (options.share_collection) {
        for (_i = 0, _len = obj.length; _i < _len; _i++) {
          value = obj[_i];
          LC.own(value, {
            prefer_clone: options.prefer_clone
          });
        }
        return obj;
      } else {
        clone = [];
        for (_j = 0, _len1 = obj.length; _j < _len1; _j++) {
          value = obj[_j];
          clone.push(LC.own(value, {
            prefer_clone: options.prefer_clone
          }));
        }
        return clone;
      }
    } else if (options.properties) {
      if (options.share_collection) {
        for (key in obj) {
          value = obj[key];
          LC.own(value, {
            prefer_clone: options.prefer_clone
          });
        }
        return obj;
      } else {
        clone = {};
        for (key in obj) {
          value = obj[key];
          clone[key] = LC.own(value, {
            prefer_clone: options.prefer_clone
          });
        }
        return clone;
      }
    } else if (obj.retain) {
      if (options.prefer_clone && obj.clone) {
        return obj.clone();
      } else {
        return obj.retain();
      }
    } else if (obj.clone) {
      return obj.clone();
    }
    return obj;
  };

  LC.disown = function(obj, options) {
    var index, key, value, _i, _len;
    if (options == null) {
      options = {};
    }
    if (!obj || (typeof obj !== "object")) {
      return obj;
    }
    if (isArray(obj)) {
      if (options.clear_values) {
        for (index in obj) {
          value = obj[index];
          LC.disown(value, {
            clear_values: options.clear_values
          });
          obj[index] = null;
        }
      } else {
        for (_i = 0, _len = obj.length; _i < _len; _i++) {
          value = obj[_i];
          LC.disown(value, {
            remove_values: options.remove_values
          });
        }
        if (options.remove_values) {
          obj.length = 0;
        }
      }
    } else if (options.properties) {
      if (options.clear_values) {
        for (key in obj) {
          value = obj[key];
          LC.disown(value, {
            clear_values: options.clear_values
          });
          obj[key] = null;
        }
      } else {
        for (key in obj) {
          value = obj[key];
          LC.disown(value, {
            remove_values: options.remove_values
          });
          delete obj[key];
        }
      }
    } else if (obj.release) {
      obj.release();
    } else if (obj.destroy) {
      obj.destroy();
    }
    return obj;
  };

  LC.RefCountable = (function() {

    RefCountable.extend = extend;

    function RefCountable() {
      this.__LC || (this.__LC = {});
      this.__LC.ref_count = 1;
    }

    RefCountable.prototype.__destroy = function() {};

    RefCountable.prototype.retain = function() {
      if (this.__LC.ref_count <= 0) {
        throw "RefCountable: ref_count is corrupt: " + this.__LC.ref_count;
      }
      this.__LC.ref_count++;
      return this;
    };

    RefCountable.prototype.release = function() {
      if (this.__LC.ref_count <= 0) {
        throw "RefCountable: ref_count is corrupt: " + this.__LC.ref_count;
      }
      this.__LC.ref_count--;
      if (!this.__LC.ref_count) {
        this.__destroy();
      }
      return this;
    };

    RefCountable.prototype.refCount = function() {
      return this.__LC.ref_count;
    };

    return RefCountable;

  })();

}).call(this);

}
});
this.require.define({
  'mixin-js': function(exports, require, module) {
// Generated by CoffeeScript 1.3.3

/*
  mixin-js.js 0.1.3
  (c) 2011, 2012 Kevin Malakoff.
  Mixin is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/mixin/blob/master/LICENSE
  Dependencies: None.

  Note: some code from Underscore.js is embedded in this file
  to remove dependencies on the full library. Please see the following for details
  on Underscore.js and its licensing:
    https://github.com/documentcloud/underscore
    https://github.com/documentcloud/underscore/blob/master/LICENSE
*/


(function() {
  var Mixin, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = this.Mixin = typeof exports !== 'undefined' ? exports : {};

  Mixin.Core || (Mixin.Core = {});

  Mixin.VERSION = '0.1.3';

  _ = !this._ && (typeof require !== 'undefined') ? (_ref = require('underscore')) != null ? _ref._ : void 0 : this._;

  if (!_) {
    _ = {};
  }

  Mixin._ = _;

  if (!_.isArray) {
    _.isArray = function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (!_.isString) {
    _.isString = function(obj) {
      return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
    };
  }

  if (!_.isFunction) {
    _.isFunction = function(obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    };
  }

  if (!_.isEmpty) {
    _.isEmpty = function(obj) {
      var key, value;
      if (_.isArray(obj) || _.isString(obj)) {
        return obj.length === 0;
      }
      for (key in obj) {
        value = obj[key];
        return false;
      }
      return true;
    };
  }

  if (!_.classOf) {
    _.classOf = function(obj) {
      if (!(obj instanceof Object)) {
        return void 0;
      }
      if (obj.prototype && obj.prototype.constructor && obj.prototype.constructor.name) {
        return obj.prototype.constructor.name;
      }
      if (obj.constructor && obj.constructor.name) {
        return obj.constructor.name;
      }
      return void 0;
    };
  }

  if (!_.size) {
    _.size = function(obj) {
      var i, key;
      i = 0;
      for (key in obj) {
        i++;
      }
      return i;
    };
  }

  if (!_.find) {
    _.find = function(obj, iter) {
      var item, _i, _len;
      for (_i = 0, _len = obj.length; _i < _len; _i++) {
        item = obj[_i];
        if (iter(item)) {
          return item;
        }
      }
      return null;
    };
  }

  if (!_.remove) {
    _.remove = function(array, item) {
      var index;
      index = array.indexOf(item);
      if (index < 0) {
        return;
      }
      array.splice(index, 1);
      return item;
    };
  }

  if (!_.keypathExists) {
    _.keypathExists = function(object, keypath) {
      return !!_.keypathValueOwner(object, keypath);
    };
  }

  if (!_.keypathValueOwner) {
    _.keypathValueOwner = function(object, keypath) {
      var components, i, key, _i, _len;
      components = _.isString(keypath) ? keypath.split('.') : keypath;
      for (i = _i = 0, _len = components.length; _i < _len; i = ++_i) {
        key = components[i];
        if (i === components.length - 1) {
          if (object.hasOwnProperty(key)) {
            return object;
          } else {
            return;
          }
        } else {
          if (!object.hasOwnProperty(key)) {
            return;
          }
          object = object[key];
        }
      }
    };
  }

  if (!_.keypath) {
    _.keypath = function(object, keypath, value) {
      var components;
      components = keypath.split('.');
      object = _.keypathValueOwner(object, components);
      if (!object) {
        return;
      }
      if (arguments.length === 3) {
        object[components[components.length - 1]] = value;
        return value;
      } else {
        return object[components[components.length - 1]];
      }
    };
  }

  Mixin.Core._Validate = (function() {

    function _Validate() {}

    _Validate.mixinInfo = function(mixin_info, overwrite, mixin_and_function) {
      if (!mixin_info) {
        throw new Error("" + mixin_and_function + ": mixin_info missing");
      }
      _Validate.string(mixin_info.mixin_name, mixin_and_function, 'mixin_name');
      if (!overwrite && Mixin.Core._Manager.available_mixins.hasOwnProperty(mixin_info.mixin_name)) {
        throw new Error("" + mixin_and_function + ": mixin_info '" + mixin_info.mixin_name + "' already registered");
      }
      if (!mixin_info.mixin_object) {
        throw new Error("" + mixin_and_function + ": mixin_info '" + mixin_info.mixin_name + "' missing mixin_object");
      }
      if (!(mixin_info.mixin_object instanceof Object)) {
        throw new Error("" + mixin_and_function + ": mixin_info '" + mixin_info.mixin_name + "' mixin_object is invalid");
      }
      if (mixin_info.initialize && !_.isFunction(mixin_info.initialize)) {
        throw new Error("" + mixin_and_function + ": mixin_info '" + mixin_info.mixin_name + "' initialize function is invalid");
      }
      if (mixin_info.destroy && !_.isFunction(mixin_info.destroy)) {
        throw new Error("" + mixin_and_function + ": mixin_info '" + mixin_info.mixin_name + "' destroy function is invalid");
      }
    };

    _Validate.instanceAndMixinName = function(mix_target, mixin_name, mixin_and_function) {
      if (!mix_target) {
        throw new Error("" + mixin_and_function + ": mix_target missing");
      }
      _Validate.string(mixin_name, mixin_and_function, 'mixin_name');
      return _Validate.instanceOrArray(mix_target, mixin_and_function, 'mix_target', mixin_name);
    };

    _Validate.classConstructorAndMixinName = function(constructor, mixin_name, mixin_and_function) {
      if (!constructor) {
        throw new Error("" + mixin_and_function + ": class constructor missing");
      }
      _Validate.string(mixin_name, mixin_and_function, 'mixin_name');
      if (!_.isFunction(constructor)) {
        throw new Error("" + mixin_and_function + ": class constructor invalid for '" + mixin_name + "'");
      }
    };

    _Validate.exists = function(parameter, mixin_and_function, parameter_name) {
      if (parameter === void 0) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " missing");
      }
    };

    _Validate.object = function(obj, mixin_and_function, parameter_name) {
      if (obj === void 0) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " missing");
      }
      if ((typeof obj !== 'object') || _.isArray(obj)) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " invalid");
      }
    };

    _Validate.uint = function(uint, mixin_and_function, parameter_name) {
      if (uint === void 0) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " missing");
      }
      if (!(typeof uint !== 'number') || (uint < 0) || (Math.floor(uint) !== uint)) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " invalid");
      }
    };

    _Validate.string = function(string, mixin_and_function, parameter_name) {
      if (string === void 0) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " missing");
      }
      if (!_.isString(string)) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " invalid");
      }
    };

    _Validate.stringArrayOrNestedStringArray = function(array, mixin_and_function, parameter_name) {
      var item, _i, _len, _results;
      if (array === void 0) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " missing");
      }
      if (!_.isArray(array)) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " invalid");
      }
      _results = [];
      for (_i = 0, _len = string_or_array.length; _i < _len; _i++) {
        item = string_or_array[_i];
        _results.push((function() {
          if (_.isArray(item) && (!item.length || !_.isString(item[0])) || !_.isString(item)) {
            throw new Error("" + mixin_and_function + ": " + parameter_name + " invalid");
          }
        })());
      }
      return _results;
    };

    _Validate.callback = function(callback, mixin_and_function, parameter_name) {
      if (callback === void 0) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " missing");
      }
      if (!_.isFunction(callback)) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " invalid");
      }
    };

    _Validate.instance = function(obj, mixin_and_function, parameter_name) {
      if (obj === void 0) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " missing");
      }
      if ((typeof obj !== 'object' || _.isArray(obj)) || !_.isFunction(obj.constructor) || (obj.constructor.name === 'Object')) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " invalid");
      }
    };

    _Validate.instanceOrArray = function(obj, mixin_and_function, parameter_name, mixin_name) {
      if (obj === void 0) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " missing");
      }
      if ((typeof obj !== 'object') || !_.isFunction(obj.constructor) || (obj.constructor.name === 'Object') || _.isArray(obj)) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " invalid");
      }
    };

    _Validate.instanceWithMixin = function(obj, mixin_name, mixin_and_function, parameter_name) {
      _Validate.instance(obj, mixin_and_function, parameter_name);
      if (!Mixin.hasMixin(obj, mixin_name)) {
        throw new Error("" + mixin_and_function + ": " + parameter_name + " missing mixin '" + mixin_name + "' on " + (_.classOf(obj)));
      }
    };

    _Validate.noKey = function(obj, key, mixin_and_function, parameter_name) {
      if (obj.hasOwnProperty(key)) {
        throw new Error("" + mixin_and_function + ": " + key + " already exists for " + parameter_name);
      }
    };

    _Validate.hasKey = function(obj, key, mixin_and_function, parameter_name) {
      if (!obj.hasOwnProperty(key)) {
        throw new Error("" + mixin_and_function + ": " + key + " does not exist for " + parameter_name);
      }
    };

    return _Validate;

  })();

  Mixin.Core._InstanceRecord = (function() {

    function _InstanceRecord(mix_target) {
      this.mix_target = mix_target;
      this.initialized_mixins = {};
    }

    _InstanceRecord.prototype.destroy = function() {
      if (!_.isEmpty(this.initialized_mixins)) {
        throw new Error('Mixin: non-empty instance record being destroyed');
      }
      return this.mix_target = null;
    };

    _InstanceRecord.prototype.hasMixin = function(mixin_name, mark_as_mixed) {
      var has_mixin;
      has_mixin = this.initialized_mixins.hasOwnProperty(mixin_name);
      if (has_mixin || !mark_as_mixed) {
        return has_mixin;
      }
      this.initialized_mixins[mixin_name] = {
        is_destroyed: false
      };
      return true;
    };

    _InstanceRecord.prototype.collectMixins = function(mixins) {
      var key, mixin_info, _ref1, _results;
      _ref1 = this.initialized_mixins;
      _results = [];
      for (key in _ref1) {
        mixin_info = _ref1[key];
        _results.push(mixins.push(key));
      }
      return _results;
    };

    _InstanceRecord.prototype.initializeMixin = function(mixin_info, args) {
      this.initialized_mixins[mixin_info.mixin_name] = {
        is_destroyed: false,
        destroy: mixin_info.destroy
      };
      if (mixin_info.initialize) {
        return mixin_info.initialize.apply(this.mix_target, args);
      }
    };

    _InstanceRecord.prototype.destroyMixin = function(mixin_name) {
      var key, mixin_existed, value, _ref1;
      if (mixin_name) {
        if (!this.initialized_mixins.hasOwnProperty(mixin_name)) {
          return false;
        }
        return this._destroyMixinInfo(mixin_name);
      } else {
        mixin_existed = false;
        _ref1 = this.initialized_mixins;
        for (key in _ref1) {
          value = _ref1[key];
          mixin_existed = true;
          this._destroyMixinInfo(key);
        }
        return mixin_existed;
      }
    };

    _InstanceRecord.prototype._destroyMixinInfo = function(mixin_name) {
      var mixin_info;
      mixin_info = this.initialized_mixins[mixin_name];
      if (mixin_info.is_destroyed) {
        return true;
      }
      mixin_info.is_destroyed = true;
      if (mixin_info.destroy) {
        mixin_info.destroy.apply(this.mix_target);
        mixin_info.destroy = null;
      }
      Mixin.Core._Manager._destroyInstanceData(this.mix_target, mixin_name);
      delete this.initialized_mixins[mixin_name];
      return true;
    };

    return _InstanceRecord;

  })();

  Mixin.Core._ClassRecord = (function() {

    function _ClassRecord(constructor) {
      this.constructor = constructor;
      this.mixins = {};
      this.instance_records = [];
    }

    _ClassRecord.prototype.mixIntoClass = function(mix_target, mixin_info) {
      var key, value, _ref1;
      if (this.mixins.hasOwnProperty(mixin_info.mixin_name)) {
        return;
      }
      this.mixins[mixin_info.mixin_name] = mixin_info;
      if (!mixin_info.force) {
        _ref1 = mixin_info.mixin_object;
        for (key in _ref1) {
          value = _ref1[key];
          if (key in mix_target) {
            throw new Error("Mixin: property '" + key + "' clashes with existing property on '" + (_.classOf(mix_target)));
          }
        }
      }
      return __extends(mix_target.constructor.prototype, mixin_info.mixin_object);
    };

    _ClassRecord.prototype.classHasMixin = function(mixin_name) {
      return this.mixins.hasOwnProperty(mixin_name);
    };

    _ClassRecord.prototype.instanceHasMixin = function(mix_target, mixin_name, mark_as_mixed) {
      var instance_record;
      instance_record = this._getInstanceRecord(mix_target);
      if (mark_as_mixed) {
        if (!this.mixins.hasOwnProperty(mixin_name)) {
          this.mixins[mixin_name] = Mixin.Core._Manager._getMixinInfo(mixin_name);
        }
        if (!instance_record) {
          instance_record = new Mixin.Core._InstanceRecord(mix_target);
          this.instance_records.push(instance_record);
        }
        return instance_record.hasMixin(mixin_name, mark_as_mixed);
      } else {
        if (instance_record) {
          return instance_record.hasMixin(mixin_name);
        } else {
          return false;
        }
      }
    };

    _ClassRecord.prototype.collectMixinsForInstance = function(mixins, mix_target) {
      var instance_record;
      instance_record = this._getInstanceRecord(mix_target);
      if (!instance_record) {
        return;
      }
      return instance_record.collectMixins(mixins);
    };

    _ClassRecord.prototype.initializeInstance = function(mix_target, mixin_info, args) {
      var instance_record;
      instance_record = this._getInstanceRecord(mix_target);
      if (instance_record) {
        instance_record.initializeMixin(mixin_info, args);
        return;
      }
      instance_record = new Mixin.Core._InstanceRecord(mix_target);
      this.instance_records.push(instance_record);
      return instance_record.initializeMixin(mixin_info, args);
    };

    _ClassRecord.prototype.destroyInstance = function(mix_target, mixin_name) {
      var i, instance_record, mixin_existed;
      if (mixin_name && !this.mixins.hasOwnProperty(mixin_name)) {
        return false;
      }
      mixin_existed = false;
      i = this.instance_records.length - 1;
      while (i >= 0) {
        instance_record = this.instance_records[i];
        if ((instance_record.mix_target === mix_target) && instance_record.destroyMixin(mixin_name)) {
          mixin_existed = true;
          if (_.isEmpty(instance_record.initialized_mixins)) {
            instance_record.destroy();
            this.instance_records.splice(i, 1);
          }
          if (mixin_name) {
            return true;
          }
        }
        i--;
      }
      return mixin_existed;
    };

    _ClassRecord.prototype._getInstanceRecord = function(mix_target) {
      var instance_record, _i, _len, _ref1;
      _ref1 = this.instance_records;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        instance_record = _ref1[_i];
        if (instance_record.mix_target === mix_target) {
          return instance_record;
        }
      }
      return void 0;
    };

    return _ClassRecord;

  })();

  Mixin.Core._Manager = (function() {

    function _Manager() {}

    _Manager.available_mixins = {};

    _Manager.registerMixin = function(mixin_info, overwrite) {
      if (Mixin.DEBUG) {
        Mixin.Core._Validate.mixinInfo(mixin_info, overwrite, 'Mixin.registerMixin');
      }
      _Manager.available_mixins[mixin_info.mixin_name] = mixin_info;
      return true;
    };

    _Manager.isAvailable = function(mixin_name) {
      return _Manager.available_mixins.hasOwnProperty(mixin_name);
    };

    _Manager._getMixinInfo = function(mixin_name) {
      return _Manager.available_mixins[mixin_name];
    };

    _Manager.mixin = function(mix_target) {
      var args, check_arg, parameter, _doMixin, _i, _len,
        _this = this;
      _doMixin = function(mix_target, mixin_name, params) {
        var class_record, mixin_info;
        if (Mixin.DEBUG) {
          Mixin.Core._Validate.instanceAndMixinName(mix_target, mixin_name, 'Mixin.mixin', 'mix_target');
          if (!_this.isAvailable(mixin_name)) {
            throw new Error("Mixin.mixin: '" + mixin_name + "' not found");
          }
        }
        mixin_info = _Manager.available_mixins[mixin_name];
        if (!mixin_info) {
          throw new Error("Mixin.mixin: '" + mixin_name + "' not found");
        }
        if (_this.hasMixin(mix_target, mixin_info.mixin_name)) {
          return;
        }
        class_record = _Manager._findOrCreateClassRecord(mix_target, mixin_info);
        class_record.mixIntoClass(mix_target, mixin_info);
        return class_record.initializeInstance(mix_target, mixin_info, Array.prototype.slice.call(arguments, 2));
      };
      args = Array.prototype.slice.call(arguments, 1);
      if (!args.length) {
        throw new Error("Mixin: mixin_name missing");
      }
      if (args.length > 1) {
        check_arg = args[1];
        if (!((_.isString(check_arg) && _Manager.isAvailable(check_arg)) || (_.isArray(check_arg) && (check_arg.length >= 1) && _.isString(check_arg[0]) && _Manager.isAvailable(check_arg[0])))) {
          _doMixin.apply(this, arguments);
          return mix_target;
        }
      }
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        parameter = args[_i];
        if (_.isArray(parameter)) {
          _doMixin.apply(this, [mix_target].concat(parameter));
        } else {
          _doMixin(mix_target, parameter);
        }
      }
      return mix_target;
    };

    _Manager.mixout = function(mix_target, mixin_name_or_names) {
      var class_record, parameter, _doMixout, _i, _j, _len, _len1, _ref1, _ref2,
        _this = this;
      if (Mixin.DEBUG) {
        Mixin.Core._Validate.instance(mix_target, 'Mixin.mixout', 'mix_target');
      }
      _doMixout = function(mix_target, mixin_name) {
        var class_record, _i, _len, _ref1;
        if (Mixin.DEBUG) {
          Mixin.Core._Validate.string(mixin_name, 'Mixin.mixout', 'mixin_name');
        }
        if (mix_target.constructor._mixin_class_records) {
          _ref1 = mix_target.constructor._mixin_class_records;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            class_record = _ref1[_i];
            if (class_record.destroyInstance(mix_target, mixin_name)) {
              return mix_target;
            }
          }
        }
        return mix_target;
      };
      if (arguments.length > 1) {
        _ref1 = Array.prototype.slice.call(arguments, 1);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          parameter = _ref1[_i];
          _doMixout(mix_target, parameter);
        }
      } else {
        if (mix_target.constructor._mixin_class_records) {
          _ref2 = mix_target.constructor._mixin_class_records;
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            class_record = _ref2[_j];
            if (class_record.destroyInstance(mix_target)) {
              return mix_target;
            }
          }
        }
      }
      return mix_target;
    };

    _Manager.hasMixin = function(mix_target, mixin_name, mark_as_mixed) {
      var class_record, mixin_info;
      if (mark_as_mixed) {
        if (_Manager.hasMixin(mix_target, mixin_name)) {
          return true;
        }
        mixin_info = _Manager.available_mixins[mixin_name];
        if (!mixin_info) {
          return false;
        }
        class_record = _Manager._findOrCreateClassRecord(mix_target, mixin_info);
        return class_record.instanceHasMixin(mix_target, mixin_name, mark_as_mixed);
      } else {
        if (Mixin.DEBUG) {
          Mixin.Core._Validate.instanceAndMixinName(mix_target, mixin_name, 'Mixin.hasMixin', 'mix_target');
        }
        if (_Manager.hasInstanceData(mix_target, mixin_name)) {
          return true;
        }
        class_record = _Manager._findClassRecord(mix_target, mixin_name);
        if (!class_record) {
          return false;
        }
        return class_record.instanceHasMixin(mix_target, mixin_name);
      }
    };

    _Manager.mixins = function(mix_target) {
      var class_record, mixins, _i, _len, _ref1;
      if (Mixin.DEBUG) {
        Mixin.Core._Validate.instance(mix_target, mixins, 'Mixin.mixins', 'mix_target');
      }
      mixins = [];
      if (mix_target.constructor._mixin_class_records) {
        _ref1 = mix_target.constructor._mixin_class_records;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          class_record = _ref1[_i];
          class_record.collectMixinsForInstance(mixins, mix_target);
        }
      }
      return mixins;
    };

    _Manager._getClassRecords = function(mix_target) {
      var class_record, class_records, constructor, _i, _len, _ref1;
      class_records = [];
      constructor = mix_target.constructor;
      while (constructor) {
        if (constructor._mixin_class_records) {
          _ref1 = constructor._mixin_class_records;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            class_record = _ref1[_i];
            if (mix_target instanceof class_record.constructor) {
              class_records.push(class_record);
            }
          }
        }
        constructor = constructor.__super__ && (constructor.__super__.constructor !== constructor) ? constructor.__super__.constructor : void 0;
      }
      return class_records;
    };

    _Manager._findClassRecord = function(mix_target, mixin_name) {
      var class_record, class_records, _i, _len;
      class_records = this._getClassRecords(mix_target);
      for (_i = 0, _len = class_records.length; _i < _len; _i++) {
        class_record = class_records[_i];
        if (class_record.classHasMixin(mixin_name)) {
          return class_record;
        }
      }
      return void 0;
    };

    _Manager._findOrCreateClassRecord = function(mix_target, mixin_info) {
      var class_record, i, l, other_class_record, was_added;
      class_record = _Manager._findClassRecord(mix_target, mixin_info.mixin_name);
      if (class_record) {
        return class_record;
      }
      if (mix_target.constructor._mixin_class_records) {
        class_record = _.find(mix_target.constructor._mixin_class_records, function(test) {
          return test.constructor === mix_target.constructor;
        });
      }
      if (!class_record) {
        class_record = new Mixin.Core._ClassRecord(mix_target.constructor);
        if (mix_target.constructor._mixin_class_records) {
          was_added = false;
          i = 0;
          l = mix_target.constructor._mixin_class_records.length;
          while (i < l) {
            other_class_record = mix_target.constructor._mixin_class_records[i];
            if (mix_target instanceof other_class_record.constructor) {
              mix_target.constructor._mixin_class_records.splice(i, 0, class_record);
              was_added = true;
              break;
            }
            i++;
          }
          if (!was_added) {
            mix_target.constructor._mixin_class_records.push(class_record);
          }
        } else {
          mix_target.constructor._mixin_class_records = [class_record];
        }
        if (Mixin._statistics) {
          Mixin._statistics.addClassRecord(class_record);
        }
      }
      return class_record;
    };

    _Manager.hasInstanceData = function(mix_target, mixin_name) {
      if (Mixin.DEBUG) {
        Mixin.Core._Validate.instanceAndMixinName(mix_target, mixin_name, 'Mixin.hasInstanceData', 'mix_target');
      }
      return !!(mix_target._mixin_data && mix_target._mixin_data.hasOwnProperty(mixin_name));
    };

    _Manager.instanceData = function(mix_target, mixin_name, data) {
      if (Mixin.DEBUG) {
        Mixin.Core._Validate.instanceAndMixinName(mix_target, mixin_name, 'Mixin.instanceData', 'mix_target');
        if (data === void 0) {
          if (!('_mixin_data' in mix_target)) {
            throw new Error("Mixin.instanceData: no instance data on '" + (_.classOf(mix_target)) + "'");
          }
          if (!mix_target._mixin_data.hasOwnProperty(mixin_name)) {
            throw new Error("Mixin.instanceData: mixin '" + mixin_name + "' instance data not found on '" + (_.classOf(mix_target)) + "'");
          }
        } else {
          if (!_Manager.hasMixin(mix_target, mixin_name)) {
            throw new Error("Mixin.instanceData: mixin '" + mixin_name + "' not mixed into '" + (_.classOf(mix_target)) + "'");
          }
        }
      }
      if (!(data === void 0)) {
        if (!mix_target._mixin_data) {
          mix_target._mixin_data = {};
        }
        mix_target._mixin_data[mixin_name] = data;
      }
      return mix_target._mixin_data[mixin_name];
    };

    _Manager._destroyInstanceData = function(mix_target, mixin_name) {
      var data;
      if (!mix_target._mixin_data) {
        return void 0;
      }
      data = mix_target._mixin_data[mixin_name];
      delete mix_target._mixin_data[mixin_name];
      if (_.isEmpty(mix_target._mixin_data)) {
        return delete mix_target['_mixin_data'];
      }
    };

    return _Manager;

  })();

  Mixin.registerMixin = Mixin.Core._Manager.registerMixin;

  Mixin.isAvailable = Mixin.Core._Manager.isAvailable;

  Mixin.mixin = Mixin["in"] = Mixin.Core._Manager.mixin;

  Mixin.mixout = Mixin.out = Mixin.Core._Manager.mixout;

  Mixin.hasMixin = Mixin.exists = Mixin.Core._Manager.hasMixin;

  Mixin.mixins = Mixin.Core._Manager.mixins;

  Mixin.hasInstanceData = Mixin.hasID = Mixin.Core._Manager.hasInstanceData;

  Mixin.instanceData = Mixin.iD = Mixin.Core._Manager.instanceData;

  if (typeof exports !== 'undefined') {
    exports.Mixin = Mixin;
  }

  /*
    mixin-js-core_statistics.js
    (c) 2011, 2012 Kevin Malakoff.
    Mixin.Core.Statistics is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/mixin/blob/master/LICENSE
    Dependencies: Mixin.Core
  */


  if (!Mixin && (typeof exports !== 'undefined')) {
    this.Mixin = require('mixin-js-core').Mixin;
  }

  if (this.Mixin.STATISTICS === void 0) {
    this.Mixin.STATISTICS = true;
  }

  Mixin.Core.Statistics = (function() {

    function Statistics() {
      this.class_records = [];
    }

    Statistics.prototype.addClassRecord = function(class_record) {
      return this.class_records.push(class_record);
    };

    Statistics.prototype.purge = function() {
      this.class_records = [];
      return this.clear();
    };

    Statistics.prototype.clear = function() {
      this.by_instance_with_data = null;
      this.by_instance_get_mixins = null;
      this.by_mixin_get_instances = null;
      this.by_mixin_get_constructors = null;
      return this.by_constructor_get_instances = null;
    };

    Statistics.prototype.update = function() {
      this.clear();
      this.byInstance_getMixins();
      this.byInstance_withData();
      this.byMixin_getInstances();
      this.byMixin_getConstructors();
      return this.byConstructor_getInstances();
    };

    Statistics.prototype.byInstance_getMixins = function() {
      var class_record, _i, _len, _ref1;
      if (!this.by_instance_get_mixins) {
        this.by_instance_get_mixins = [];
        _ref1 = this.class_records;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          class_record = _ref1[_i];
          this.classRecordGetMixinsByInstance(class_record, this.by_instance_get_mixins);
        }
      }
      return this.by_instance_get_mixins;
    };

    Statistics.prototype.byInstance_withData = function() {
      var class_record, _i, _len, _ref1;
      if (!this.by_instance_with_data) {
        this.by_instance_with_data = [];
        _ref1 = this.class_records;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          class_record = _ref1[_i];
          this.classRecordGetInstancesWithData(class_record, this.by_instance_with_data);
        }
      }
      return this.by_instance_with_data;
    };

    Statistics.prototype.byMixin_getInstances = function() {
      var class_record, _i, _len, _ref1;
      if (!this.by_mixin_get_instances) {
        this.by_mixin_get_instances = {};
        _ref1 = this.class_records;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          class_record = _ref1[_i];
          this.classRecordGetInstancesByMixin(class_record, this.by_mixin_get_instances);
        }
      }
      return this.by_mixin_get_instances;
    };

    Statistics.prototype.byMixin_getConstructors = function() {
      var class_record, _i, _len, _ref1;
      if (!this.by_mixin_get_constructors) {
        this.by_mixin_get_constructors = {};
        _ref1 = this.class_records;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          class_record = _ref1[_i];
          this.classRecordGetMixins(class_record, this.by_mixin_get_constructors);
        }
      }
      return this.by_mixin_get_constructors;
    };

    Statistics.prototype.byConstructor_getInstances = function() {
      var class_record, _i, _len, _ref1;
      if (!this.by_constructor_get_instances) {
        this.by_constructor_get_instances = {};
        _ref1 = this.class_records;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          class_record = _ref1[_i];
          this.classRecordGroupInstances(class_record, this.by_constructor_get_instances);
        }
      }
      return this.by_constructor_get_instances;
    };

    Statistics.prototype.classRecordGetInstancesWithData = function(class_record, instances) {
      var instance_record, _i, _len, _ref1, _results;
      _ref1 = class_record.instance_records;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        instance_record = _ref1[_i];
        _results.push(instance_record.mix_target && instance_record.mix_target._mixin_data ? instances.push(instance_record.mix_target) : void 0);
      }
      return _results;
    };

    Statistics.prototype.classRecordGetInstancesByMixin = function(class_record, mixins) {
      var instance_record, key, mixin_info, _i, _len, _ref1, _results;
      if (!class_record.instance_records.length) {
        return;
      }
      _ref1 = class_record.instance_records;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        instance_record = _ref1[_i];
        _results.push((function() {
          var _ref2, _results1;
          _ref2 = instance_record.initialized_mixins;
          _results1 = [];
          for (key in _ref2) {
            mixin_info = _ref2[key];
            _results1.push((!mixins.hasOwnProperty(key) ? mixins[key] = [] : void 0, mixins[key].push(instance_record.mix_target)));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Statistics.prototype.classRecordGetMixinsByInstance = function(class_record, instances) {
      var instance_record, key, mixin_info, mixins, _i, _len, _ref1, _ref2, _results;
      _ref1 = class_record.instance_records;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        instance_record = _ref1[_i];
        mixins = [];
        _ref2 = instance_record.initialized_mixins;
        for (key in _ref2) {
          mixin_info = _ref2[key];
          mixins.push(key);
        }
        _results.push(instances.push({
          instance: instance_record.mix_target,
          mixins: mixins
        }));
      }
      return _results;
    };

    Statistics.prototype.classRecordGroupInstances = function(class_record, constructors) {
      var instance_record, _i, _len, _ref1, _results;
      if (!class_record.instance_records.length) {
        return;
      }
      if (!constructors.hasOwnProperty(class_record.constructor.name)) {
        constructors[class_record.constructor] = [];
      }
      _ref1 = class_record.instance_records;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        instance_record = _ref1[_i];
        _results.push(constructors[class_record.constructor].push(instance_record.mix_target));
      }
      return _results;
    };

    Statistics.prototype.classRecordGetMixins = function(class_record, mixins, only_with_instances) {
      var key, mixin_info, _ref1, _results;
      _ref1 = class_record.mixins;
      _results = [];
      for (key in _ref1) {
        mixin_info = _ref1[key];
        _results.push((!mixins.hasOwnProperty(key) ? mixins[key] = [] : void 0, mixins[key].push(class_record.constructor)));
      }
      return _results;
    };

    return Statistics;

  })();

  if (this.Mixin.STATISTICS) {
    Mixin._statistics = new Mixin.Core.Statistics();
  }

  /*
    mixin_auto_memory.js
    (c) 2011, 2012 Kevin Malakoff.
    Mixin.AutoMemory is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/mixin/blob/master/LICENSE
    Dependencies: Mixin.Core, Underscore.js, Underscore-Awesomer.js
  */


  Mixin = !window.Mixin && (typeof require !== 'undefined') ? require('mixin-js-core') : window.Mixin;

  _ = !window._ && (typeof require !== 'undefined') ? require('underscore') : window._;

  if (_ && !_.VERSION) {
    _ = _._;
  }

  if (!_) {
    _ = Mixin._;
  }

  Mixin.AutoMemory || (Mixin.AutoMemory = {});

  Mixin.AutoMemory.root = this;

  Mixin.AutoMemory.WRAPPER = Mixin.AutoMemory.root['$'] ? $ : '$';

  Mixin.AutoMemory.Property = (function() {

    function Property(owner) {
      this.owner = owner;
    }

    Property.prototype.setArgs = function() {
      var key_or_array, _i, _len, _ref1, _results;
      if (!arguments.length) {
        throw new Error("Mixin.AutoMemory: missing key");
      }
      this.args = Array.prototype.slice.call(arguments);
      if (!Mixin.DEBUG) {
        return this;
      }
      if (_.isArray(this.args[0])) {
        _ref1 = this.args;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          key_or_array = _ref1[_i];
          _results.push(this._validateEntry(key_or_array));
        }
        return _results;
      } else {
        return this._validateEntry(this.args);
      }
    };

    Property.prototype.destroy = function() {
      var key_or_array, _i, _len, _ref1, _results;
      if (_.isArray(this.args[0])) {
        _ref1 = this.args;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          key_or_array = _ref1[_i];
          _results.push(this._destroyEntry(key_or_array));
        }
        return _results;
      } else {
        return this._destroyEntry(this.args);
      }
    };

    Property.prototype._validateEntry = function(entry) {
      var fn_ref, key;
      key = entry[0];
      fn_ref = entry.length > 1 ? entry[1] : void 0;
      if (!_.keypathExists(this.owner, key)) {
        throw new Error("Mixin.AutoMemory: property '" + key + "' doesn't exist on '" + (_.classOf(this.owner)) + "'");
      }
      if (fn_ref && !(_.isFunction(fn_ref) || _.isString(fn_ref))) {
        throw new Error("Mixin.AutoMemory: unexpected function reference for property '" + key + "' on '" + (_.classOf(this.owner)) + "'");
      }
    };

    Property.prototype._destroyEntry = function(entry) {
      var fn_ref, key, keypath_owner, property, value, _i, _len, _ref1;
      key = entry[0];
      fn_ref = entry.length > 1 ? entry[1] : void 0;
      if (!fn_ref) {
        keypath_owner = _.keypathValueOwner(this.owner, key);
        if (!keypath_owner) {
          throw new Error("Mixin.AutoMemory: property '" + key + "' doesn't exist on '" + (_.classOf(this.owner)) + "'");
        }
        keypath_owner[key] = null;
        return;
      }
      value = _.keypath(this.owner, key);
      if (!value) {
        return;
      }
      if (_.isFunction(fn_ref)) {
        fn_ref.apply(this.owner, [value].concat(entry.length > 2 ? entry.slice(2) : []));
      } else {
        if (_.isFunction(value[fn_ref])) {
          value[fn_ref].apply(value, entry.length > 2 ? entry.slice(2) : []);
        } else {
          _ref1 = entry.slice(1);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            property = _ref1[_i];
            this._destroyEntry([property]);
          }
        }
      }
      return _.keypath(this.owner, key, null);
    };

    return Property;

  })();

  Mixin.AutoMemory.WrappedProperty = (function() {

    function WrappedProperty(owner, key, fn_ref, wrapper) {
      var _i, _len, _ref1;
      this.owner = owner;
      this.key = key;
      this.fn_ref = fn_ref;
      this.wrapper = wrapper;
      if (this.fn_ref && _.isArray(this.fn_ref)) {
        if (Mixin.DEBUG && !this.fn_ref.length) {
          throw new Error("Mixin.AutoMemory: unexpected function reference");
        }
        this.args = this.fn_ref.splice(1);
        this.fn_ref = this.fn_ref[0];
      }
      if (!Mixin.DEBUG) {
        return this;
      }
      if (!this.key) {
        throw new Error("Mixin.AutoMemory: missing key");
      }
      if (_.isArray(this.key)) {
        _ref1 = this.key;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          key = _ref1[_i];
          if (!_.keypathExists(this.owner, key)) {
            throw new Error("Mixin.AutoMemory: property '" + key + "' doesn't exist on '" + (_.classOf(this.owner)) + "'");
          }
        }
      } else {
        if (!_.keypathExists(this.owner, this.key)) {
          throw new Error("Mixin.AutoMemory: property '" + this.key + "' doesn't exist on '" + (_.classOf(this.owner)) + "'");
        }
      }
      if (this.fn_ref && !(_.isFunction(this.fn_ref) || _.isString(this.fn_ref))) {
        throw new Error("Mixin.AutoMemory: unexpected function reference");
      }
      if (!this.wrapper) {
        throw new Error("Mixin.AutoMemory: missing wrapper");
      }
    }

    WrappedProperty.prototype.destroy = function() {
      var key, _i, _len, _ref1, _results;
      if (_.isArray(this.key)) {
        _ref1 = this.key;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          key = _ref1[_i];
          _results.push(this._destroyKey(key));
        }
        return _results;
      } else {
        return this._destroyKey(this.key);
      }
    };

    WrappedProperty.prototype._destroyKey = function(key) {
      var value, wrapped_value, wrapper;
      if (!this.fn_ref) {
        _.keypath(this.owner, key, null);
        return;
      }
      value = _.keypath(this.owner, key);
      if (!value) {
        return;
      }
      wrapper = _.isString(this.wrapper) ? Mixin.AutoMemory.root[this.wrapper] : this.wrapper;
      wrapped_value = wrapper(value);
      if (_.isFunction(this.fn_ref)) {
        this.fn_ref.apply(this.owner, [wrapped_value].concat(this.args ? this.args.slice() : []));
      } else {
        if (Mixin.DEBUG && !_.isFunction(wrapped_value[this.fn_ref])) {
          throw new Error("Mixin.AutoMemory: function '" + this.fn_ref + "' missing for wrapped property '" + key + "' on '" + (_.classOf(this.owner)) + "'");
        }
        wrapped_value[this.fn_ref].apply(wrapped_value, this.args);
      }
      return _.keypath(this.owner, key, null);
    };

    return WrappedProperty;

  })();

  Mixin.AutoMemory.Function = (function() {

    function Function(object, fn_ref, args) {
      this.object = object;
      this.fn_ref = fn_ref;
      this.args = args;
      if (!Mixin.DEBUG) {
        return this;
      }
      if (!this.fn_ref) {
        throw new Error("Mixin.AutoMemory: missing fn_ref");
      }
      if (!_.isFunction(this.fn_ref) && !(this.object && _.isString(this.fn_ref) && _.isFunction(this.object[this.fn_ref]))) {
        throw new Error("Mixin.AutoMemory: unexpected function reference");
      }
    }

    Function.prototype.destroy = function() {
      if (!this.object) {
        this.fn_ref.apply(null, this.args);
        return;
      }
      if (!_.isFunction(this.fn_ref)) {
        this.object[this.fn_ref].apply(this.object, this.args);
        return;
      }
      return this.fn_ref.apply(this.object, [this.object].concat(this.args ? this.args.slice() : []));
    };

    return Function;

  })();

  Mixin.AutoMemory._mixin_info = {
    mixin_name: 'AutoMemory',
    initialize: function() {
      return Mixin.instanceData(this, 'AutoMemory', []);
    },
    destroy: function() {
      var callback, callbacks, _i, _len, _results;
      callbacks = Mixin.instanceData(this, 'AutoMemory');
      Mixin.instanceData(this, 'AutoMemory', []);
      _results = [];
      for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
        callback = callbacks[_i];
        _results.push(callback.destroy());
      }
      return _results;
    },
    mixin_object: {
      autoProperty: function(key, fn_ref) {
        var auto_property;
        auto_property = new Mixin.AutoMemory.Property(this);
        auto_property.setArgs.apply(auto_property, arguments);
        Mixin.instanceData(this, 'AutoMemory').push(auto_property);
        return this;
      },
      autoWrappedProperty: function(key, fn_ref, wrapper) {
        if (wrapper === void 0) {
          wrapper = Mixin.AutoMemory.WRAPPER;
        }
        Mixin.instanceData(this, 'AutoMemory').push(new Mixin.AutoMemory.WrappedProperty(this, key, fn_ref, wrapper));
        return this;
      },
      autoFunction: function(object, fn_ref) {
        Mixin.instanceData(this, 'AutoMemory').push(new Mixin.AutoMemory.Function(object, fn_ref, Array.prototype.slice.call(arguments, 2)));
        return this;
      }
    }
  };

  Mixin.registerMixin(Mixin.AutoMemory._mixin_info);

  /*
    mixin_flags.js
    (c) 2011, 2012 Kevin Malakoff.
    Mixin.Flags is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/mixin/blob/master/LICENSE
    Dependencies: Mixin.Core
  */


  Mixin = !window.Mixin && (typeof require !== 'undefined') ? require('mixin-js-core') : window.Mixin;

  Mixin.Flags || (Mixin.Flags = {});

  Mixin.Flags._mixin_info = {
    mixin_name: 'Flags',
    initialize: function(flags, change_callback) {
      if (flags == null) {
        flags = 0;
      }
      return Mixin.instanceData(this, 'Flags', {
        flags: flags,
        change_callback: change_callback
      });
    },
    mixin_object: {
      flags: function(flags) {
        var instance_data, previous_flags;
        instance_data = Mixin.instanceData(this, 'Flags');
        if (flags !== void 0) {
          previous_flags = instance_data.flags;
          instance_data.flags = flags;
          if (instance_data.change_callback && (previous_flags !== instance_data.flags)) {
            instance_data.change_callback(instance_data.flags);
          }
        }
        return instance_data.flags;
      },
      hasFlags: function(flags) {
        var instance_data;
        instance_data = Mixin.instanceData(this, 'Flags');
        return !!(instance_data.flags & flags);
      },
      setFlags: function(flags) {
        var instance_data, previous_flags;
        instance_data = Mixin.instanceData(this, 'Flags');
        previous_flags = instance_data.flags;
        instance_data.flags |= flags;
        if (instance_data.change_callback && (previous_flags !== instance_data.flags)) {
          instance_data.change_callback(instance_data.flags);
        }
        return instance_data.flags;
      },
      resetFlags: function(flags) {
        var instance_data, previous_flags;
        instance_data = Mixin.instanceData(this, 'Flags');
        previous_flags = instance_data.flags;
        instance_data.flags &= ~flags;
        if (instance_data.change_callback && (previous_flags !== instance_data.flags)) {
          instance_data.change_callback(instance_data.flags);
        }
        return instance_data.flags;
      }
    }
  };

  Mixin.registerMixin(Mixin.Flags._mixin_info);

  /*
    mixin_ref_count.js
    (c) 2011, 2012 Kevin Malakoff.
    Mixin.RefCount is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/mixin/blob/master/LICENSE
    Dependencies: Mixin.Core
  */


  Mixin = !window.Mixin && (typeof require !== 'undefined') ? require('mixin-js-core') : window.Mixin;

  Mixin.RefCount || (Mixin.RefCount = {});

  Mixin.RefCount._mixin_info = {
    mixin_name: 'RefCount',
    initialize: function(release_callback) {
      return Mixin.instanceData(this, 'RefCount', {
        ref_count: 1,
        release_callback: release_callback
      });
    },
    mixin_object: {
      retain: function() {
        var instance_data;
        instance_data = Mixin.instanceData(this, 'RefCount');
        if (instance_data.ref_count <= 0) {
          throw new Error("Mixin.RefCount: ref_count is corrupt: " + instance_data.ref_count);
        }
        instance_data.ref_count++;
        return this;
      },
      release: function() {
        var instance_data;
        instance_data = Mixin.instanceData(this, 'RefCount');
        if (instance_data.ref_count <= 0) {
          throw new Error("Mixin.RefCount: ref_count is corrupt: " + instance_data.ref_count);
        }
        instance_data.ref_count--;
        if ((instance_data.ref_count === 0) && instance_data.release_callback) {
          instance_data.release_callback(this);
        }
        return this;
      },
      refCount: function() {
        return Mixin.instanceData(this, 'RefCount').ref_count;
      }
    }
  };

  Mixin.registerMixin(Mixin.RefCount._mixin_info);

  /*
    mixin_subscriptions.js
    (c) 2011, 2012 Kevin Malakoff.
    Mixin.Subscriptions is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/mixin/blob/master/LICENSE
    Dependencies: Mixin.Core, Underscore.js, Underscore-Awesomer.js
  */


  Mixin = !window.Mixin && (typeof require !== 'undefined') ? require('mixin-js-core') : window.Mixin;

  _ = !window._ && (typeof require !== 'undefined') ? require('underscore') : window._;

  if (_ && !_.VERSION) {
    _ = _._;
  }

  if (!_) {
    _ = Mixin._;
  }

  if (!_.keypathExists) {
    _.mixin(Mixin._);
  }

  Mixin.Subscriptions || (Mixin.Subscriptions = {});

  Mixin.Subscriptions._SubscriptionLink = (function() {

    function _SubscriptionLink(subscription, subscriber, notification_callback, options) {
      var subscriber_instance_data;
      this.subscription = subscription;
      this.subscriber = subscriber;
      this.notification_callback = notification_callback;
      this.options = _.clone(options || {});
      subscriber_instance_data = Mixin.instanceData(this.subscriber, 'Subscriber');
      subscriber_instance_data.subscription_backlinks.push(this);
    }

    _SubscriptionLink.prototype.mustKeepUntilDestroyed = function() {
      return (this.options.keep_until_destroyed === void 0) || !this.options.keep_until_destroyed;
    };

    _SubscriptionLink.prototype.destroy = function() {
      var subscriber_instance_data;
      if (!this.subscription) {
        throw new Error("Mixin.Subscriptions: _SubscriptionLink destroyed multiple times");
      }
      if (this.options.destroy) {
        this.options.destroy();
        this.options.destroy = null;
      }
      subscriber_instance_data = Mixin.instanceData(this.subscriber, 'Subscriber');
      _.remove(subscriber_instance_data.subscription_backlinks, this);
      _.remove(this.subscription.subscription_links, this);
      this.subscription = null;
      this.subscriber = null;
      this.notification_callback = null;
      return this.options = null;
    };

    return _SubscriptionLink;

  })();

  Mixin.Subscription || (Mixin.Subscription = {});

  Mixin.Subscription.TYPE = {};

  Mixin.Subscription.TYPE.MULTIPLE = 0;

  Mixin.Subscription.TYPE.EXCLUSIVE = 1;

  Mixin.Subscriptions._Subscription = (function() {

    function _Subscription(observable, subscription_type) {
      this.observable = observable;
      this.subscription_type = subscription_type;
      if (Mixin.DEBUG) {
        if ((typeof this.subscription_type !== 'number') || (this.subscription_type < Mixin.Subscription.TYPE.MULTIPLE) || (this.subscription_type > Mixin.Subscription.TYPE.EXCLUSIVE)) {
          throw new Error("Mixin.Subscriptions: Mixin.Subscription.TYPE is invalid");
        }
      }
      this.subscription_links = [];
    }

    _Subscription.prototype.addSubscriber = function(subscriber, notification_callback, options) {
      if (this.subscription_type === Mixin.Subscription.TYPE.EXCLUSIVE) {
        this.removeSubscribers(function(test_subscription) {
          return test_subscription.mustKeepUntilDestroyed();
        });
      }
      return this.subscription_links.push(new Mixin.Subscriptions._SubscriptionLink(this, subscriber, notification_callback, options));
    };

    _Subscription.prototype.removeSubscriber = function(subscriber, notification_callback, subscription_name) {
      var subscription_link;
      subscription_link = _.find(this.subscription_links, function(test) {
        return (subscriber === test.subscriber) && (notification_callback === test.notification_callback);
      });
      if (!subscription_link) {
        throw new Error("Mixin.Subscriptions.removeSubscriber: subscription '" + subscription_name + "' does not exist for '" + (_.classOf(subscriber)) + "'");
      }
      _.remove(this.subscription_links, subscription_link);
      return subscription_link.destroy();
    };

    _Subscription.prototype.subscribers = function(subscribers) {
      var subscription_link, _i, _len, _ref1, _results;
      _ref1 = this.subscription_links;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        subscription_link = _ref1[_i];
        _results.push(subscribers.push(subscription_link.subscriber));
      }
      return _results;
    };

    _Subscription.prototype.notifySubscribers = function() {
      var args, subscription_link, _i, _len, _ref1, _results;
      args = Array.prototype.slice.call(arguments);
      _ref1 = this.subscription_links;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        subscription_link = _ref1[_i];
        _results.push(subscription_link.notification_callback.apply(subscription_link.subscriber, args));
      }
      return _results;
    };

    _Subscription.prototype.removeSubscribers = function(test_fn) {
      var removed_subscription_links, subscription_link, _i, _j, _len, _len1, _results, _results1;
      if (test_fn) {
        removed_subscription_links = _.select(this.subscription_links, test_fn);
        if (removed_subscription_links.length === 0) {
          return;
        }
        this.subscription_links = _.difference(this.subscription_links, removed_subscription_links);
        _results = [];
        for (_i = 0, _len = removed_subscription_links.length; _i < _len; _i++) {
          subscription_link = removed_subscription_links[_i];
          _results.push(subscription_link.destroy());
        }
        return _results;
      } else {
        removed_subscription_links = this.subscription_links;
        this.subscription_links = [];
        _results1 = [];
        for (_j = 0, _len1 = removed_subscription_links.length; _j < _len1; _j++) {
          subscription_link = removed_subscription_links[_j];
          _results1.push(subscription_link.destroy());
        }
        return _results1;
      }
    };

    _Subscription.prototype.destroy = function() {
      var link, subscription_links, _i, _len, _results;
      subscription_links = this.subscription_links;
      this.subscription_links = [];
      _results = [];
      for (_i = 0, _len = subscription_links.length; _i < _len; _i++) {
        link = subscription_links[_i];
        _results.push(link.destroy());
      }
      return _results;
    };

    return _Subscription;

  })();

  Mixin.Subscriptions.Observable || (Mixin.Subscriptions.Observable = {});

  Mixin.Subscriptions.Observable._mixin_info = {
    mixin_name: 'Observable',
    initialize: function() {
      var arg, _i, _len, _results;
      Mixin.instanceData(this, 'Observable', {
        subscriptions: {},
        is_destroyed: false
      });
      _results = [];
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        _results.push(this.publishSubscription.apply(this, _.isArray(arg) ? arg : [arg]));
      }
      return _results;
    },
    destroy: function() {
      var instance_data, subscription, subscriptions, _i, _len, _results;
      instance_data = Mixin.instanceData(this, 'Observable');
      if (instance_data.is_destroyed) {
        throw new Error("Mixin.Observable.destroy: already destroyed");
      }
      instance_data.is_destroyed = true;
      subscriptions = instance_data.subscriptions;
      instance_data.subscriptions = [];
      _results = [];
      for (_i = 0, _len = subscriptions.length; _i < _len; _i++) {
        subscription = subscriptions[_i];
        _results.push(subscription.destroy());
      }
      return _results;
    },
    mixin_object: {
      hasSubscription: function(subscription_name) {
        var instance_data;
        if (Mixin.DEBUG) {
          Mixin.Core._Validate.string(subscription_name, 'Mixin.Observable.hasSubscription', 'subscription_name');
        }
        instance_data = Mixin.instanceData(this, 'Observable');
        return instance_data.subscriptions.hasOwnProperty(subscription_name);
      },
      publishSubscription: function(subscription_name, subscription_type) {
        var instance_data;
        instance_data = Mixin.instanceData(this, 'Observable');
        if (subscription_type === void 0) {
          subscription_type = Mixin.Subscription.TYPE.MULTIPLE;
        }
        if (Mixin.DEBUG) {
          Mixin.Core._Validate.string(subscription_name, 'Mixin.Observable.publishSubscription', 'subscription_name');
          Mixin.Core._Validate.noKey(instance_data.subscriptions, subscription_name, 'Mixin.Observable.publishSubscription', 'subscription_name');
        }
        instance_data.subscriptions[subscription_name] = new Mixin.Subscriptions._Subscription(this, subscription_type);
        return this;
      },
      subscriptions: function() {
        var instance_data, key, subscriptions, value, _ref1;
        instance_data = Mixin.instanceData(this, 'Observable');
        subscriptions = [];
        _ref1 = instance_data.subscriptions;
        for (key in _ref1) {
          value = _ref1[key];
          subscriptions.push(key);
        }
        return subscriptions;
      },
      subscribers: function(subscription_name) {
        var instance_data, key, subscribers, subscription, _ref1, _ref2;
        subscribers = [];
        instance_data = Mixin.instanceData(this, 'Observable');
        if (subscription_name === void 0) {
          _ref1 = instance_data.subscriptions;
          for (key in _ref1) {
            subscription = _ref1[key];
            subscription.subscribers(subscribers);
          }
        } else {
          if (!instance_data.subscriptions.hasOwnProperty(subscription_name)) {
            throw new Error("Mixin.Observable.subscribers: subscriber '" + (_classOf(this)) + "' does not recognize '" + subscription_name + "'");
          }
          _ref2 = instance_data.subscriptions;
          for (key in _ref2) {
            subscription = _ref2[key];
            if (subscription.subscription_name === subscription_name) {
              subscription.subscribers(subscribers);
            }
          }
        }
        return _.uniq(subscribers);
      },
      addSubscriber: function(subscriber, subscription_parameters) {
        var args, check_arg, instance_data, parameter, _doSubscribe, _i, _len;
        instance_data = Mixin.instanceData(this, 'Observable');
        _doSubscribe = function(subscription_name, notification_callback, options) {
          var subscription;
          options || (options = {});
          if (Mixin.DEBUG) {
            Mixin.Core._Validate.string(subscription_name, 'Mixin.Observable.addSubscriber', 'subscription_name');
            Mixin.Core._Validate.callback(notification_callback, 'Mixin.Observable.addSubscriber', 'notification_callback');
            Mixin.Core._Validate.object(options, 'Mixin.Observable.addSubscriber', 'options');
            if (options.destroy !== void 0) {
              Mixin.Core._Validate.callback(options.destroy, 'Mixin.Observable.addSubscriber', 'options.destroy');
            }
          }
          Mixin.Core._Validate.hasKey(instance_data.subscriptions, subscription_name, 'Mixin.Observable.addSubscriber', 'subscription_name');
          subscription = instance_data.subscriptions[subscription_name];
          return subscription.addSubscriber(subscriber, notification_callback, options);
        };
        args = Array.prototype.slice.call(arguments, 1);
        Mixin.Core._Validate.instanceWithMixin(subscriber, 'Subscriber', 'Mixin.Observable.addSubscriber', 'subscriber');
        if (args.length > 1) {
          check_arg = args[1];
          if (!((_.isString(check_arg) && this.hasSubscription(check_arg)) || (_.isArray(check_arg) && (check_arg.length >= 1) && _.isString(check_arg[0]) && this.hasSubscription(check_arg[0])))) {
            _doSubscribe.apply(this, Array.prototype.slice.call(arguments, 1));
            return this;
          }
        }
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          parameter = args[_i];
          if (_.isArray(parameter)) {
            _doSubscribe.apply(this, parameter);
          } else {
            _doSubscribe.apply(parameter);
          }
        }
        return this;
      },
      notifySubscribers: function(subscription_name) {
        var instance_data, subscription;
        instance_data = Mixin.instanceData(this, 'Observable');
        if (instance_data.is_destroyed) {
          return;
        }
        if (Mixin.DEBUG) {
          Mixin.Core._Validate.string(subscription_name, 'Mixin.Observable.notifySubscribers', 'subscription_name');
          Mixin.Core._Validate.hasKey(instance_data.subscriptions, subscription_name, 'Mixin.Observable.notifySubscribers');
        }
        subscription = instance_data.subscriptions[subscription_name];
        if (!subscription) {
          return;
        }
        subscription.notifySubscribers.apply(subscription, Array.prototype.slice.call(arguments, 1));
        return this;
      },
      removeSubscriber: function(subscriber, subscription_name, notification_callback) {
        var args, check_arg, instance_data, parameter, _doUnsubscribe, _i, _len;
        instance_data = Mixin.instanceData(this, 'Observable');
        _doUnsubscribe = function(subscription_name, notification_callback) {
          var subscription;
          if (Mixin.DEBUG) {
            Mixin.Core._Validate.string(subscription_name, 'Mixin.Observable.removeSubscriber', 'subscription_name');
            Mixin.Core._Validate.callback(notification_callback, 'Mixin.Observable.removeSubscriber', 'notification_callback');
          }
          Mixin.Core._Validate.hasKey(instance_data.subscriptions, subscription_name, 'Mixin.Observable.removeSubscriber', 'subscription_name');
          subscription = instance_data.subscriptions[subscription_name];
          return subscription.removeSubscriber(subscriber, notification_callback, subscription_name);
        };
        args = Array.prototype.slice.call(arguments, 1);
        if (Mixin.DEBUG) {
          Mixin.Core._Validate.instanceWithMixin(subscriber, 'Subscriber', 'Mixin.Observable.removeSubscriber', 'subscriber');
        }
        if (args.length > 1) {
          check_arg = args[1];
          if (!((_.isString(check_arg) && this.hasSubscription(check_arg)) || (_.isArray(check_arg) && (check_arg.length >= 1) && _.isString(check_arg[0]) && this.hasSubscription(check_arg[0])))) {
            _doUnsubscribe.apply(this, Array.prototype.slice.call(arguments, 1));
            return this;
          }
        }
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          parameter = args[_i];
          if (_.isArray(parameter)) {
            _doUnsubscribe.apply(this, parameter);
          } else {
            _doUnsubscribe.apply(parameter);
          }
        }
        return this;
      },
      removeSubscribers: function(subscription_name, test_fn) {
        var instance_data, key, subscription, _ref1;
        instance_data = Mixin.instanceData(this, 'Observable');
        if (Mixin.DEBUG) {
          if (subscription_name !== void 0) {
            Mixin.Core._Validate.string(subscription_name, 'Mixin.Observable.removeSubscribers', 'subscription_name');
            Mixin.Core._Validate.hasKey(instance_data.subscriptions, subscription_name, 'Mixin.Observable.removeSubscribers');
          }
          if (test_fn !== void 0) {
            Mixin.Core._Validate.callback(test_fn, 'Mixin.Observable.removeSubscribers', 'test_fn');
          }
        }
        if (subscription_name) {
          subscription = instance_data.subscriptions[subscription_name];
          if (!subscription) {
            return;
          }
          subscription.removeSubscribers(test_fn);
        } else {
          _ref1 = instance_data.subscriptions;
          for (key in _ref1) {
            subscription = _ref1[key];
            subscription.removeSubscribers(test_fn);
          }
        }
        return this;
      }
    }
  };

  Mixin.Subscriptions.Subscriber || (Mixin.Subscriptions.Subscriber = {});

  Mixin.Subscriptions.Subscriber._mixin_info = {
    mixin_name: 'Subscriber',
    initialize: function() {
      return Mixin.instanceData(this, 'Subscriber', {
        subscription_backlinks: [],
        is_destroyed: false
      });
    },
    destroy: function() {
      var backlink, backlinks, instance_data, _i, _len, _results;
      instance_data = Mixin.instanceData(this, 'Subscriber');
      if (instance_data.is_destroyed) {
        throw new Error("Mixin.Subscriber.destroy: already destroyed");
      }
      instance_data.is_destroyed = true;
      backlinks = instance_data.subscription_backlinks;
      instance_data.subscription_backlinks = [];
      _results = [];
      for (_i = 0, _len = backlinks.length; _i < _len; _i++) {
        backlink = backlinks[_i];
        _results.push(backlink.destroy());
      }
      return _results;
    },
    mixin_object: {
      observables: function(subscription_name) {
        var instance_data, obserables, subscription_link, _i, _j, _len, _len1, _ref1, _ref2;
        instance_data = Mixin.instanceData(this, 'Subscriber');
        obserables = [];
        if (subscription_name === void 0) {
          _ref1 = instance_data.subscription_backlinks;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            subscription_link = _ref1[_i];
            if (subscription_link.subscription && (subscription_link.subscription.subscription_name === subscription_name)) {
              obserables.push(subscription_link.subscription.observable);
            }
          }
        } else {
          if (Mixin.DEBUG) {
            Mixin.Core._Validate.string(subscription_name, 'Mixin.Subscriptions.observables', 'subscription_name');
          }
          _ref2 = instance_data.subscription_backlinks;
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            subscription_link = _ref2[_j];
            if (subscription_link.subscription) {
              obserables.push(subscription_link.subscription.observable);
            }
          }
        }
        return _.uniq(obserables);
      }
    }
  };

  Mixin.Subscriptions.ObservableSubscriber || (Mixin.Subscriptions.ObservableSubscriber = {});

  Mixin.Subscriptions.ObservableSubscriber._mixin_info = {
    mixin_name: 'ObservableSubscriber',
    mixin_object: {},
    initialize: function() {
      return Mixin["in"](this, 'Subscriber', ['Observable'].concat(Array.prototype.slice.call(arguments)));
    },
    destroy: function() {
      return Mixin.out(this, 'Subscriber', 'Observable');
    }
  };

  Mixin.registerMixin(Mixin.Subscriptions.Observable._mixin_info);

  Mixin.registerMixin(Mixin.Subscriptions.Subscriber._mixin_info);

  Mixin.registerMixin(Mixin.Subscriptions.ObservableSubscriber._mixin_info);

  /*
    mixin_timeouts.js
    (c) 2011, 2012 Kevin Malakoff.
    Mixin.Timeouts is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/mixin/blob/master/LICENSE
    Dependencies: Mixin.Core
  */


  Mixin = !window.Mixin && (typeof require !== 'undefined') ? require('mixin-js-core') : window.Mixin;

  _ = !window._ && (typeof require !== 'undefined') ? require('underscore') : window._;

  if (_ && !_.VERSION) {
    _ = _._;
  }

  if (!_) {
    _ = Mixin._;
  }

  Mixin.Timeouts || (Mixin.Timeouts = {});

  Mixin.Timeouts._mixin_info = {
    mixin_name: 'Timeouts',
    initialize: function() {
      return Mixin.instanceData(this, 'Timeouts', {
        timeouts: {}
      });
    },
    destroy: function() {
      return this.killAllTimeouts();
    },
    mixin_object: {
      addTimeout: function(timeout_name, callback, wait) {
        var callback_args, instance_data, timeout,
          _this = this;
        Mixin.Core._Validate.string(timeout_name, 'Mixin.Timeouts.addTimeout', 'timeout_name');
        Mixin.Core._Validate.callback(callback, 'Mixin.Timeouts.addTimeout', 'callback');
        if (wait === void 0) {
          throw new Error("Mixin.Timeouts: missing wait on '" + (_.classOf(this)) + "'");
        }
        if ((typeof wait !== 'number') || (wait < 0) || (Math.floor(wait) !== wait)) {
          throw new Error("Mixin.Timeouts: wait invalid on '" + (_.classOf(this)) + "'");
        }
        instance_data = Mixin.instanceData(this, 'Timeouts');
        if (this.hasTimeout(timeout_name)) {
          throw new Error("Mixin.Timeouts: timeout '" + timeout_name + "' already exists on '" + (_.classOf(this)) + "'");
        }
        callback_args = Array.prototype.slice.call(arguments, 3);
        timeout = setTimeout((function() {
          _this.killTimeout(timeout_name);
          return callback.apply(_this, callback_args);
        }), wait);
        instance_data.timeouts[timeout_name] = timeout;
        return this;
      },
      hasTimeout: function(timeout_name) {
        var instance_data;
        instance_data = Mixin.instanceData(this, 'Timeouts');
        return timeout_name in instance_data.timeouts;
      },
      timeoutCount: function() {
        var count, instance_data, key, timeout, _ref1;
        instance_data = Mixin.instanceData(this, 'Timeouts');
        count = 0;
        _ref1 = instance_data.timeouts;
        for (key in _ref1) {
          timeout = _ref1[key];
          count++;
        }
        return count;
      },
      timeouts: function() {
        var instance_data, key, result, timeout, _ref1;
        instance_data = Mixin.instanceData(this, 'Timeouts');
        result = [];
        _ref1 = instance_data.timeouts;
        for (key in _ref1) {
          timeout = _ref1[key];
          result.push(key);
        }
        return result;
      },
      killTimeout: function(timeout_name) {
        var instance_data;
        instance_data = Mixin.instanceData(this, 'Timeouts');
        if (!this.hasTimeout(timeout_name)) {
          throw new Error("Mixin.Timeouts: timeout '" + timeout_name + "' does not exist. For a less-strict check, use killTimeoutIfExists");
        }
        this.killTimeoutIfExists(timeout_name);
        return this;
      },
      killTimeoutIfExists: function(timeout_name) {
        var instance_data, timeout;
        instance_data = Mixin.instanceData(this, 'Timeouts');
        timeout = instance_data.timeouts[timeout_name];
        if (timeout) {
          clearTimeout(timeout);
        }
        delete instance_data.timeouts[timeout_name];
        return this;
      },
      killAllTimeouts: function() {
        var callback, instance_data, timeout_name, _ref1;
        instance_data = Mixin.instanceData(this, 'Timeouts');
        _ref1 = instance_data.timeouts;
        for (timeout_name in _ref1) {
          callback = _ref1[timeout_name];
          this.killTimeoutIfExists(timeout_name);
        }
        return this;
      }
    }
  };

  Mixin.registerMixin(Mixin.Timeouts._mixin_info);

}).call(this);

}
});
this.require.define({
  'underscore-awesomer': function(exports, require, module) {
// Generated by CoffeeScript 1.3.3

/*
  Underscore-Awesomer.js 1.2.1
  (c) 2011, 2012 Kevin Malakoff.
  Underscore-Awesomer is freely distributable under the MIT license.
  https:#github.com/kmalakoff/underscore-awesomer

  Underscore-Awesomer provides extensions to the Underscore library: http:#documentcloud.github.com/underscore

  Note: some code from Underscore.js is repeated in this file.
  Please see the following for details on Underscore.js and its licensing:
    https:#github.com/documentcloud/underscore
    https:#github.com/documentcloud/underscore/blob/master/LICENSE
*/


(function() {
  var root, _;

  root = this;

  _ = !this._ && (typeof require !== 'undefined') ? require('underscore')._ : this._;

  if (!_) {
    _ = {};
  }

  if (typeof root.exports !== 'undefined') {
    root.exports = _;
  }

  _.AWESOMENESS = "1.2.1";

  _.pluck = function(obj, key, remove) {
    if (remove) {
      return _.map(obj, function(value) {
        var val;
        val = value[key];
        delete value[key];
        return val;
      });
    } else {
      return _.map(obj, function(value) {
        return value[key];
      });
    }
  };

  _.remove = function(obj, matcher, options) {
    var index, key, matcher_key, matcher_value, ordered_keys, original_object, removed, single_value, value, values, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _len9, _m, _n, _o, _p, _q, _r;
    if (options == null) {
      options = {};
    }
    if (_.isEmpty(obj)) {
      return (!matcher || _.isFunction(matcher) ? [] : void 0);
    }
    if (_.isFunction(options)) {
      options = {
        callback: options
      };
    }
    if (options.preclear) {
      original_object = obj;
      obj = _.clone(obj);
      if (_.isArray(original_object)) {
        original_object.length = 0;
      } else {
        for (key in original_object) {
          delete original_object[key];
        }
      }
    }
    removed = [];
    single_value = false;
    if (_.isArray(obj)) {
      if (_.isUndefined(matcher)) {
        removed = _.keys(obj);
      } else if (_.isFunction(matcher)) {
        if (options.first_only) {
          single_value = true;
          _.find(obj, function(value, index) {
            if (matcher(value)) {
              removed.push(index);
              return true;
            }
            return false;
          });
        } else {
          _.each(obj, function(value, index) {
            if (matcher(value)) {
              return removed.push(index);
            }
          });
        }
      } else if (_.isArray(matcher)) {
        if (options.first_only) {
          single_value = true;
          for (_i = 0, _len = matcher.length; _i < _len; _i++) {
            matcher_value = matcher[_i];
            for (index in obj) {
              value = obj[index];
              if (matcher_value === value) {
                removed.push(index);
                break;
              }
            }
          }
        } else {
          for (_j = 0, _len1 = matcher.length; _j < _len1; _j++) {
            matcher_value = matcher[_j];
            for (index in obj) {
              value = obj[index];
              if (matcher_value === value) {
                removed.push(index);
              }
            }
          }
        }
      } else {
        if (options.first_only) {
          single_value = true;
          index = _.indexOf(obj, matcher);
          if (index >= 0) {
            removed.push(index);
          }
        } else {
          single_value = true;
          for (index in obj) {
            value = obj[index];
            if (matcher === value) {
              removed.push(index);
            }
          }
        }
      }
      if (single_value) {
        if (!removed.length) {
          return void 0;
        }
        value = obj[removed[0]];
        removed = removed.sort(function(left, right) {
          return _.compare(right, left);
        });
        for (_k = 0, _len2 = removed.length; _k < _len2; _k++) {
          index = removed[_k];
          obj.splice(index, 1);
        }
        if (options.callback) {
          for (_l = 0, _len3 = removed.length; _l < _len3; _l++) {
            index = removed[_l];
            options.callback(value);
          }
        }
        return value;
      } else {
        if (!removed.length) {
          return [];
        }
        values = [];
        removed = removed.sort(function(left, right) {
          return _.compare(right, left);
        });
        for (_m = 0, _len4 = removed.length; _m < _len4; _m++) {
          index = removed[_m];
          values.unshift(obj[index]);
          obj.splice(index, 1);
        }
        if (options.callback) {
          for (_n = 0, _len5 = values.length; _n < _len5; _n++) {
            value = values[_n];
            options.callback(value);
          }
        }
        return _.uniq(values);
      }
    } else {
      if (_.isUndefined(matcher)) {
        removed = _.keys(obj);
      } else if (_.isFunction(matcher)) {
        for (key in obj) {
          value = obj[key];
          if (matcher(value, key)) {
            removed.push(key);
          }
        }
      } else if (_.isArray(matcher)) {
        if (options.values) {
          for (_o = 0, _len6 = matcher.length; _o < _len6; _o++) {
            matcher_value = matcher[_o];
            if (options.first_only) {
              for (key in obj) {
                value = obj[key];
                if (matcher_value === value) {
                  removed.push(key);
                  break;
                }
              }
            } else {
              for (key in obj) {
                value = obj[key];
                if (matcher_value === value) {
                  removed.push(key);
                }
              }
            }
          }
        } else {
          ordered_keys = matcher;
          for (_p = 0, _len7 = matcher.length; _p < _len7; _p++) {
            matcher_key = matcher[_p];
            if (obj.hasOwnProperty(matcher_key)) {
              removed.push(matcher_key);
            }
          }
        }
      } else if (_.isString(matcher) && !options.values) {
        single_value = true;
        ordered_keys = [];
        if (obj.hasOwnProperty(matcher)) {
          ordered_keys.push(matcher);
          removed.push(matcher);
        }
      } else {
        for (key in obj) {
          value = obj[key];
          if (matcher === value) {
            removed.push(key);
          }
        }
      }
      if (ordered_keys) {
        if (!ordered_keys.length) {
          if (single_value) {
            return void 0;
          } else {
            return [];
          }
        }
        values = [];
        for (_q = 0, _len8 = removed.length; _q < _len8; _q++) {
          key = removed[_q];
          values.push(obj[key]);
          delete obj[key];
        }
        if (options.callback) {
          for (index in values) {
            value = values[index];
            options.callback(value, ordered_keys[index]);
          }
        }
        if (single_value) {
          return values[0];
        } else {
          return values;
        }
      } else {
        if (!removed.length) {
          return {};
        }
        values = {};
        for (_r = 0, _len9 = removed.length; _r < _len9; _r++) {
          key = removed[_r];
          values[key] = obj[key];
          delete obj[key];
        }
        if (options.callback) {
          for (key in values) {
            value = values[key];
            options.callback(value, key);
          }
        }
        return values;
      }
    }
  };

  _.findIndex = function(array, fn) {
    var index, value;
    for (index in array) {
      value = array[index];
      if (fn(array[index])) {
        return index;
      }
    }
    return -1;
  };

  _.hasKeypath = _.keypathExists = function(object, keypath) {
    return !!_.keypathValueOwner(object, keypath);
  };

  _.keypathValueOwner = function(object, keypath) {
    var components, current_object, index, key, length;
    components = _.isString(keypath) ? keypath.split('.') : keypath;
    current_object = object;
    length = components.length;
    for (index in components) {
      key = components[index];
      if (!(key in current_object)) {
        break;
      }
      if (++index === length) {
        return current_object;
      }
      current_object = current_object[key];
      if (!current_object || (!(current_object instanceof Object))) {
        break;
      }
    }
    return void 0;
  };

  _.keypath = function(object, keypath, value) {
    var components, value_owner;
    components = (_.isString(keypath) ? keypath.split(".") : keypath);
    value_owner = _.keypathValueOwner(object, components);
    if (arguments.length === 2) {
      if (!value_owner) {
        return void 0;
      }
      return value_owner[components[components.length - 1]];
    } else {
      if (!value_owner) {
        return;
      }
      value_owner[components[components.length - 1]] = value;
      return value;
    }
  };

  _.cloneToDepth = _.containerClone = _.clone = function(obj, depth) {
    var clone, key;
    if (!obj || (typeof obj !== "object")) {
      return obj;
    }
    if (_.isArray(obj)) {
      clone = Array.prototype.slice.call(obj);
    } else if (obj.constructor !== {}.constructor) {
      return obj;
    } else {
      clone = _.extend({}, obj);
    }
    if (!_.isUndefined(depth) && (depth > 0)) {
      for (key in clone) {
        clone[key] = _.clone(clone[key], depth - 1);
      }
    }
    return clone;
  };

  _.deepClone = function(obj, depth) {
    var clone, key;
    if (!obj || (typeof obj !== "object")) {
      return obj;
    }
    if (_.isString(obj)) {
      return String.prototype.slice.call(obj);
    }
    if (_.isDate(obj)) {
      return new Date(obj.valueOf());
    }
    if (_.isFunction(obj.clone)) {
      return obj.clone();
    }
    if (_.isArray(obj)) {
      clone = Array.prototype.slice.call(obj);
    } else if (obj.constructor !== {}.constructor) {
      return obj;
    } else {
      clone = _.extend({}, obj);
    }
    if (!_.isUndefined(depth) && (depth > 0)) {
      for (key in clone) {
        clone[key] = _.deepClone(clone[key], depth - 1);
      }
    }
    return clone;
  };

  _.isConstructor = function(obj) {
    return _.isFunction(obj) && obj.name;
  };

  _.resolveConstructor = function(key) {
    var components, constructor;
    components = (_.isArray(key) ? key : (_.isString(key) ? key.split(".") : void 0));
    if (components) {
      constructor = components.length === 1 ? root[components[0]] : _.keypath(root, components);
      if (constructor && _.isConstructor(constructor)) {
        return constructor;
      } else {
        return void 0;
      }
    } else if (_.isFunction(key) && _.isConstructor(key)) {
      return key;
    }
    return void 0;
  };

  _.CONVERT_NONE = 0;

  _.CONVERT_IS_TYPE = 1;

  _.CONVERT_TO_METHOD = 2;

  _.conversionPath = function(obj, key) {
    var check_name, components, construtor, obj_type;
    components = _.isArray(key) ? key : (_.isString(key) ? key.split(".") : void 0);
    obj_type = typeof obj;
    check_name = components ? components[components.length - 1] : void 0;
    obj_type = typeof obj;
    check_name = components ? components[components.length - 1] : void 0;
    if (components && (obj_type === check_name)) {
      return _.CONVERT_IS_TYPE;
    }
    construtor = _.resolveConstructor(components ? components : key);
    if (construtor && (obj_type === 'object')) {
      try {
        if (obj instanceof construtor) {
          return _.CONVERT_IS_TYPE;
        }
      } catch (_e) {
        ({});
      }
    }
    check_name = construtor && construtor.name ? construtor.name : check_name;
    if (!check_name) {
      return _.CONVERT_NONE;
    }
    if (_['is' + check_name] && _['is' + check_name](obj)) {
      return _.CONVERT_IS_TYPE;
    }
    if ((obj_type === 'object') && obj['to' + check_name]) {
      return _.CONVERT_TO_METHOD;
    }
    return _.CONVERT_NONE;
  };

  _.isConvertible = function(obj, key) {
    return _.conversionPath(obj, key) > 0;
  };

  _.toType = function(obj, key) {
    var components, constructor;
    components = _.isArray(key) ? key : (_.isString(key) ? key.split(".") : void 0);
    switch (_.conversionPath(obj, (components ? components : key))) {
      case 1:
        return obj;
      case 2:
        if (components) {
          return obj["to" + components[components.length - 1]]();
        } else {
          constructor = _.resolveConstructor(key);
          return (constructor && constructor.name ? obj["to" + constructor.name]() : void 0);
        }
    }
    return void 0;
  };

  _.functionExists = function(object, function_name) {
    return (object instanceof Object) && object[function_name] && _.isFunction(object[function_name]);
  };

  _.callIfExists = function(object, function_name) {
    if (_.functionExists(object, function_name)) {
      return object[function_name].apply(object, Array.prototype.slice.call(arguments, 2));
    } else {
      return void 0;
    }
  };

  _.getSuperFunction = function(object, function_name) {
    var value_owner;
    value_owner = _.keypathValueOwner(object, ["constructor", "__super__", function_name]);
    if (value_owner && _.isFunction(value_owner[function_name])) {
      return value_owner[function_name];
    } else {
      return void 0;
    }
  };

  _.superCall = function(object, function_name) {
    var super_function;
    super_function = _.getSuperFunction(object, function_name);
    if (super_function) {
      return super_function.apply(object, Array.prototype.slice.call(arguments, 2));
    } else {
      return void 0;
    }
  };

  _.superApply = function(object, function_name, args) {
    var super_function;
    super_function = _.getSuperFunction(object, function_name);
    if (super_function) {
      return super_function.apply(object, args);
    } else {
      return void 0;
    }
  };

  _.classOf = function(obj) {
    return ((obj != null) && Object.getPrototypeOf(Object(obj)).constructor.name) || void 0;
  };

  _.copyProperties = function(destination, source, keys, remove) {
    var copied_something, key, source_keys, _i, _len;
    source_keys = keys || _.keys(source);
    copied_something = false;
    for (_i = 0, _len = source_keys.length; _i < _len; _i++) {
      key = source_keys[_i];
      if (!hasOwnProperty.call(source, key)) {
        continue;
      }
      destination[key] = source[key];
      copied_something = true;
      if (remove) {
        delete source[key];
      }
    }
    return copied_something;
  };

  _.getValue = function(obj, key, missing_value, remove) {
    var value;
    if (hasOwnProperty.call(obj, key)) {
      if (!remove) {
        return obj[key];
      }
      value = obj[key];
      delete obj[key];
      return value;
    } else {
      return missing_value;
    }
  };

  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a, b;
      a = left.criteria;
      b = right.criteria;
      return _.compare(a, b);
    }), 'value');
  };

  _.sortedIndex = function(array, obj, iterator) {
    var high, low, mid;
    iterator || (iterator = _.identity);
    low = 0;
    high = array.length;
    while (low < high) {
      mid = (low + high) >> 1;
      if (_.compare(iterator(array[mid]), iterator(obj)) === _.COMPARE_ASCENDING) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  };

  _.COMPARE_EQUAL = 0;

  _.COMPARE_ASCENDING = -1;

  _.COMPARE_DESCENDING = 1;

  _.compare = function(value_a, value_b, function_name) {
    var result;
    if (typeof value_a !== "object") {
      return (value_a === value_b ? _.COMPARE_EQUAL : (value_a < value_b ? _.COMPARE_ASCENDING : _.COMPARE_DESCENDING));
    }
    if (!function_name) {
      function_name = "compare";
    }
    if (value_a[function_name] && _.isFunction(value_a[function_name])) {
      result = value_a[function_name](value_b);
      return (result === 0 ? _.COMPARE_EQUAL : (result < 0 ? _.COMPARE_ASCENDING : _.COMPARE_DESCENDING));
    } else if (value_b[function_name] && _.isFunction(value_b[function_name])) {
      result = value_b[function_name](value_a);
      return (result === 0 ? _.COMPARE_EQUAL : (result < 0 ? _.COMPARE_DESCENDING : _.COMPARE_ASCENDING));
    } else {
      if (value_a === value_b) {
        return _.COMPARE_EQUAL;
      } else {
        if (value_a < value_b) {
          return _.COMPARE_ASCENDING;
        } else {
          return _.COMPARE_DESCENDING;
        }
      }
    }
  };

}).call(this);

}
});
if (!this['_']) {this['_'] = this.require('underscore');}
if (!this['Backbone']) {this['Backbone'] = this.require('backbone');}
if (!this['ko']) {this['ko'] = this.require('knockout');}
if (!this['kbi']) {this['kbi'] = this.require('knockback-inspector');}
this.require('backbone-articulation');
})(this);