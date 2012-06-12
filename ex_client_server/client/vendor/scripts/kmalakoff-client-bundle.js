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
  'backbone-articulation': function(exports, require, module) {
// Generated by CoffeeScript 1.3.3

/*
  Backbone-Articulation.js 0.3.1
  (c) 2011, 2012 Kevin Malakoff.
  Backbone-Articulation may be freely distributed under the MIT license.
  https://github.com/kmalakoff/backbone-articulation
*/


(function() {
  var Backbone, JSONS, LC, _, _native_bbcol_reset, _native_bbmod_change, _native_bbmod_clear, _native_bbmod_initialize, _native_bbmod_model_event, _native_bbmod_set, _native_bbmod_unset;

  _ = !this._ && (typeof require !== 'undefined') ? require('underscore') : this._;

  if (_ && !_.VERSION) {
    _ = _._;
  }

  Backbone = !this.Backbone && (typeof require !== 'undefined') ? require('backbone') : this.Backbone;

  JSONS = !this.JSONS && (typeof require !== 'undefined') ? require('json-serialize') : this.JSONS;

  LC = !this.LC && (typeof require !== 'undefined') ? require('lifecycle') : this.LC;

  Backbone.Articulation = typeof exports !== 'undefined' ? exports : {};

  Backbone.Articulation.VERSION = '0.3.1';

  Backbone.Articulation.TYPE_UNDERSCORE_SINGULARIZE = false;

  Backbone.Collection.prototype.toJSON = function() {
    var model, models_as_JSON, _i, _len, _ref;
    models_as_JSON = [];
    _ref = this.models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      model = _ref[_i];
      models_as_JSON.push(model.toJSON());
    }
    return models_as_JSON;
  };

  Backbone.Collection.prototype.parse = function(resp, xhr) {
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

  Backbone.Model.prototype.toJSON = function() {
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
    if (Backbone.Articulation.TYPE_UNDERSCORE_SINGULARIZE) {
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

  Backbone.Model.prototype.parse = function(resp, xhr) {
    if (!resp) {
      return resp;
    }
    return JSONS.deserialize(resp, {
      properties: true,
      skip_type_field: true
    });
  };

  Backbone.Model.prototype._ownAttribute = function(key, value) {
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

  Backbone.Model.prototype._disownAttribute = function(key, value) {
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

  _native_bbmod_initialize = Backbone.Model.prototype.initialize;

  Backbone.Model.prototype.initialize = function() {
    var key, result;
    result = _native_bbmod_initialize.apply(this, arguments);
    for (key in this._previousAttributes) {
      this._previousAttributes[key] = this._ownAttribute(key, this._previousAttributes[key]);
    }
    return result;
  };

  _native_bbmod_set = Backbone.Model.prototype.set;

  Backbone.Model.prototype.set = function(attrs, options) {
    var key;
    if (!attrs) {
      return this;
    }
    if (attrs.attributes) {
      attrs = attrs.attributes;
    }
    for (key in attrs) {
      if (_.isEqual(this.attributes[key], attrs[key])) {
        continue;
      }
      if (this._previousAttributes && (this._previousAttributes.hasOwnProperty(key))) {
        this._disownAttribute(key, this._previousAttributes[key]);
      }
    }
    return _native_bbmod_set.apply(this, arguments);
  };

  _native_bbmod_unset = Backbone.Model.prototype.unset;

  Backbone.Model.prototype.unset = function(attr, options) {
    if (!(attr in this.attributes)) {
      return this;
    }
    this._disownAttribute(attr, this.attributes[attr]);
    return _native_bbmod_unset.apply(this, arguments);
  };

  _native_bbmod_clear = Backbone.Model.prototype.clear;

  Backbone.Model.prototype.clear = function(options) {
    var key;
    for (key in this.attributes) {
      this._disownAttribute(key, this.attributes[key]);
    }
    if (options && options.silent) {
      for (key in this._previousAttributes) {
        this._disownAttribute(key, this._previousAttributes[key]);
      }
    }
    return _native_bbmod_clear.apply(this, arguments);
  };

  _native_bbmod_change = Backbone.Model.prototype.change;

  Backbone.Model.prototype.change = function(options) {
    var key, result;
    for (key in this._previousAttributes) {
      this._disownAttribute(key, this._previousAttributes[key]);
    }
    result = _native_bbmod_change.apply(this, arguments);
    for (key in this._previousAttributes) {
      this._previousAttributes[key] = this._ownAttribute(key, this._previousAttributes[key]);
    }
    return result;
  };

  _native_bbcol_reset = Backbone.Collection.prototype._reset;

  Backbone.Collection.prototype._reset = function() {
    var model, _i, _j, _len, _len1, _ref, _ref1;
    if (this.models && this.models.length) {
      if (Backbone.Relational && (this.models[0] instanceof Backbone.RelationalModel)) {
        _ref = this.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          Backbone.Relational.store.unregister(model);
          model.clear({
            silent: true
          });
        }
      } else {
        _ref1 = this.models;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          model = _ref1[_j];
          model.clear({
            silent: true
          });
        }
      }
    }
    return _native_bbcol_reset.apply(this, arguments);
  };

  _native_bbmod_model_event = Backbone.Collection.prototype._onModelEvent;

  Backbone.Collection.prototype._onModelEvent = function(ev, model, collection, options) {
    var key;
    if (ev === "destroy") {
      for (key in this._previousAttributes) {
        this._disownAttribute(key, this._previousAttributes[key]);
      }
      for (key in this.attributes) {
        this._disownAttribute(key, this.attributes[key]);
      }
    }
    return _native_bbmod_model_event.apply(this, arguments);
  };

  if (!!Backbone.RelationalModel) {
    Backbone.RelationalModel.prototype.toJSON = function() {
      var index, json, model_json, rel, value, _i, _j, _len, _len1, _ref;
      if (this.isLocked()) {
        return this.id;
      }
      this.acquire();
      json = Backbone.Model.prototype.toJSON.call(this);
      _ref = this._relations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rel = _ref[_i];
        value = json[rel.key];
        if (rel.options.includeInJSON === true && value && (typeof value === "object")) {
          json[rel.key] = (_.isFunction(value.toJSON) ? value.toJSON() : value);
        } else if (_.isString(rel.options.includeInJSON)) {
          if (!value) {
            json[rel.key] = null;
          } else if (value instanceof Backbone.Collection) {
            json[rel.key] = value.pluck(rel.options.includeInJSON);
          } else if (value instanceof Backbone.Model) {
            json[rel.key] = value.get(rel.options.includeInJSON);
          } else if (_.isArray(value)) {
            json[rel.key] = [];
            for (index = _j = 0, _len1 = value.length; _j < _len1; index = ++_j) {
              model_json = value[index];
              if (!_.isUndefined(model_json)) {
                json[rel.key].push(model_json[rel.options.includeInJSON]);
              }
            }
          } else if (value instanceof Object) {
            json[rel.key] = value[rel.options.includeInJSON];
          }
        } else {
          delete json[rel.key];
        }
      }
      this.release();
      return json;
    };
  }

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
  var Backbone, root, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = this;

  _ = !this._ && (typeof require !== 'undefined') ? require('underscore')._ : this._;

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

  if (typeof root.exports !== 'undefined') {
    root.exports = Backbone.ModelRef;
  }

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

  root = typeof window === 'undefined' ? global : window;

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
    var constructor_or_root, date, instance, json_as_JSON, json_type, key, result, type, value, _i, _j, _len, _len1, _ref;
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
        root = _ref[_j];
        constructor_or_root = keyPath(root, type);
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
knockback-inspector.js 0.1.1
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

  this.kbi.VERSION = '0.1.1';

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

  kbi.CollectionNodeView = "<li class='kbi' data-bind=\"css: {opened: opened, closed: !opened()}\">\n  <div class='collection' data-bind=\"click: function(){ opened(!opened()) }\">\n    <span data-bind=\"text: (opened() ? '- ' : '+ ' )\"></span>\n    <span data-bind=\"text: name\"></span>\n  </div>\n\n  <!-- ko if: opened -->\n    <!-- ko foreach: node -->\n      <ul class='kbi' data-bind=\"template: {name: 'kbi_model_node', data: kbi.nvm('['+$index()+']', false, $data)}\"></ul>\n    <!-- /ko -->\n  <!-- /ko -->\n</li>";

  kbi.ModelNodeView = "<li class='kbi' data-bind=\"css: {opened: opened, closed: !opened()}\">\n  <div class='kbi model' data-bind=\"click: function(){ opened(!opened()); }\">\n    <span data-bind=\"text: (opened() ? '- ' : '+ ' )\"></span>\n    <span data-bind=\"text: name\"></span>\n  </div>\n\n  <!-- ko if: opened -->\n    <!-- ko foreach: attribute_names -->\n\n      <!-- ko if: ($parent.attributeType($data) == 'simple') -->\n        <fieldset class='kbi'>\n          <label data-bind=\"text: $data\"> </label>\n          <input type='text' data-bind=\"value: $parent.node[$data]\">\n        </fieldset>\n      <!-- /ko -->\n\n      <!-- ko if: ($parent.attributeType($data) == 'model') -->\n        <ul class='kbi' data-bind=\"template: {name: 'kbi_model_node', data: kbi.nvm($data, false, $parent.node[$data])}\"></ul>\n      <!-- /ko -->\n\n      <!-- ko if: ($parent.attributeType($data) == 'collection') -->\n        <ul class='kbi' data-bind=\"template: {name: 'kbi_collection_node', data: kbi.nvm($data+'[]', true, $parent.node[$data])}\"></ul>\n      <!-- /ko -->\n\n    <!-- /ko -->\n  <!-- /ko -->\n</li>";

  kbi.StringTemplateSource = (function() {

    function StringTemplateSource(template_string) {
      this.template_string = template_string;
    }

    StringTemplateSource.prototype.text = function(value) {
      return this.template_string;
    };

    return StringTemplateSource;

  })();

  kbi.StringTemplateEngine = (function(_super) {

    __extends(StringTemplateEngine, _super);

    function StringTemplateEngine() {
      this.allowTemplateRewriting = false;
    }

    StringTemplateEngine.prototype.makeTemplateSource = function(template) {
      switch (template) {
        case 'kbi_model_node':
          return new kbi.StringTemplateSource(kbi.ModelNodeView);
        case 'kbi_collection_node':
          return new kbi.StringTemplateSource(kbi.CollectionNodeView);
        default:
          return ko.nativeTemplateEngine.prototype.makeTemplateSource.apply(this, arguments);
      }
    };

    return StringTemplateEngine;

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
      return _.map(response.results, function(result) {
        var model;
        model = new kbi.FetchedModel();
        return model.set(model.parse(result));
      });
    };

    return FetchedCollection;

  })(Backbone.Collection);

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

  Mixin.AutoMemory.root = typeof window === 'undefined' ? global : window;

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

  root = typeof window === 'undefined' ? global : window;

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
})(this);