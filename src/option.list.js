/**
 * List either top-level paths or sub-paths based on the given prefix.
 * To list methods on an object specify the complete path.
 * @example
 * mdncomp -l .
 * mdncomp -l javascript.builtins
 * mdncomp -l javascript.builtins.Number
 * mdncomp -l experimental
 * mdncomp -l deprecated
 *
 * @param prefix
 * @param sensitive
 * @returns {Array}
 */
function list(prefix, sensitive) {
  const
    _prefix = sensitive ? prefix : prefix.toLowerCase(),
    tbl = buildTable(),
    result = [],
    maxSegments = _prefix.split(".").length + 1;

  let
    last = "", _path;

  tbl.forEach(path => {
    _path = sensitive ? path : path.toLowerCase();
    if (_path.startsWith(_prefix) && path.split(".").length <= maxSegments && path !== last) {
      result.push(last = path);
    }
  });

  return result
}

function listOnStatus(statTxt) {
  const
    result = [],
    keys = listTopLevels();

  keys.forEach(key1 => {
    let o = mdn[key1];
    if (o.__compat && _check(o)) result.push(key1);
    Object.keys(mdn[key1]).forEach(key2 => {
      let o = mdn[key1][key2];
      if (o.__compat && _check(o)) result.push(key1 + "." + key2);
      Object.keys(mdn[key1][key2]).forEach(key3 => {
        let o = mdn[key1][key2][key3];
        if (key3.__compat && _check(o)) result.push(key1 + "." + key2 + "." + key3);
      });
    });
  });

  function _check(compat) {
    let status = compat.__compat.status || {};
    return !!status[statTxt]
  }

  return result.sort();
}
