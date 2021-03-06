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

  // colorize
  let t = prefix.lastIndexOf(".") + 1;
  result.forEach((res, i) => {
    let t2 = res.lastIndexOf(".") + 1;
    result[i] = ANSI.reset + (t ? res.substr(0, t) + ANSI.cyan + (t2 > t ? res.substring(t, t2) + ANSI.white + res.substr(t2) : res.substr(t)) : res);
  });

  return result
}

function listOnStatus(statTxt) {
  const
    result = [],
    keys = listTopLevels();

  if (statTxt === "standard") statTxt = "standard_track";

  keys.forEach(key1 => {
    let o = mdn[key1];
    if (o.__compat && _check(o)) result.push(key1);
    Object.keys(mdn[key1]).forEach(key2 => {
      let o = mdn[key1][key2];
      if (o.__compat && _check(o)) result.push(key1 + "." + key2);
      Object.keys(mdn[key1][key2]).forEach(key3 => {
        let o = mdn[key1][key2][key3];
        if (key3.__compat && _check(o)) result.push(key1 + "." + key2 + "." + key3);
//        Object.keys(mdn[key1][key2][key3]).forEach(key4 => {
//          let o = mdn[key1][key2][key3][key4];
//          if (key4.__compat && _check(o)) result.push(key1 + "." + key2 + "." + key3 + "." + key4);
//        });
      });
    });
  });

  function _check(compat) {
    let status = compat.__compat.status || {};
    return !!status[statTxt]
  }

  // colorize
  let
    color = statTxt === "deprecated" ? ANSI.red : (statTxt === "experimental" ? ANSI.yellow : ANSI.green);

  result.forEach((res, i) => {
    let t = res.lastIndexOf(".") + 1;
    result[i] = ANSI.reset + res.substr(0, t) + color + res.substr(t)
  });

  return result.sort();
}

function listOnProp(propTxt) {
  const
//    props = [
//        {key: "missinglink", value: "mdn_url", not: true},
//        {key: "partial", value: "partial_implementation", not: false}
//      ],
    result = [],
    keys = buildTable();

  // get technical name
//  let value, not;
//  for(let key of props) {
//    if (key.key === propTxt) {
//      value = key.value;
//      not = key.not;
//      break;
//    }
//  }

//  if (!value) return [];

  keys.forEach(path => {
    let compat = getPathAsObject(path);
    if (compat) {
      compat = compat.__compat;
      //if (compat && ((not && !compat[value]) || (!not && compat[value]))) result.push(path);
      if (compat && (!(compat["mdn_url"] && compat["mdn_url"].length))) {
        result.push(path);
      }
    }
  });

  // colorize
  result.forEach((res, i) => {
    let t = res.lastIndexOf(".") + 1;
    result[i] = (ANSI.reset + res.substr(0, t) + ANSI.white + res.substr(t)).replace(/\./g, ANSI.blue + "." + ANSI.reset)
  });

  return result.sort();
}
