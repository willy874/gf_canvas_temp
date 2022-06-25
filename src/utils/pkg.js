function asyncAction(funcs, initData) {
  return new Promise((resolve, reject) => {
    (async function () {
      let data = initData;
      for (let index = 0; index < funcs.length; index++) {
        const func = funcs[index];
        if (typeof func === "function") {
          try {
            data = await func(data);
          } catch (error) {
            reject(error);
          }
        }
      }
      resolve(data);
    })();
  });
}

function formDataFormat(data) {
  const format = (obj, keys = []) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const formName = [...keys, key]
        .map((k, i) => (i ? `[${k}]` : k))
        .join("");
      if (value instanceof Blob) {
        if (value instanceof File) {
          formData.append(formName, value, value.name);
        } else {
          formData.append(formName, value);
        }
      } else if (typeof value === "object" && value !== null) {
        const obj = value[key];
        format(obj, [...keys, key]);
      } else if (value !== undefined) {
        formData.append(formName, JSON.stringify(value));
      }
    });
  };
  const formData = new FormData();
  format(data);
  return formData;
}

function formUrlEncodedFormat(data) {
  const queryParams = new URLSearchParams();
  for (const key in data) {
    const value = data[key];
    if (Array.isArray(value)) {
      value.forEach((v) => queryParams.append(key, v));
    } else if (typeof value === "object" && value !== null) {
      queryParams.append(key, JSON.stringify(value));
    } else {
      queryParams.append(key, String(value));
    }
  }
  return queryParams;
}

function cloneJson(obj) {
  try {
    return JSON.parse(JSON.stringify(obj === undefined ? null : obj));
  } catch (error) {
    return null;
  }
}

function stringToJson(param) {
  const data = typeof param !== "undefined" ? param : this;
  try {
    return typeof data === "string" ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

function jsonToString(param) {
  const data = typeof param !== "undefined" ? param : this;
  return JSON.stringify(data);
}
const sleep = (t) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
};
const optionsOnlyOrList = function (param, callback) {
  if (Array.isArray(param)) {
    param.forEach((item, index) => callback(item, index));
  } else {
    callback(param);
  }
};
const optionsListOrCollection = function (param, callback) {
  if (Array.isArray(param)) {
    param.forEach((item, index) => callback(item, String(index)));
  } else {
    Object.keys(param).forEach((key) => callback(param[key], key));
  }
};

function checkStringIsEvery(value, condition) {
  const bools = [];
  optionsOnlyOrList(condition, (item) => {
    if (typeof item === "string") {
      bools.push(value.includes(item));
    } else if (item instanceof RegExp) {
      bools.push(item.test(value));
    } else {
      bools.push(false);
    }
  });
  return bools.every(Boolean);
}

function checkStringIsSome(value, condition) {
  const bools = [];
  optionsOnlyOrList(condition, (item) => {
    if (typeof item === "string") {
      bools.push(value.includes(item));
    } else if (item instanceof RegExp) {
      bools.push(item.test(value));
    } else {
      bools.push(false);
    }
  });
  return bools.some(Boolean);
}

function log(arg, ...args) {
  if (typeof arg === "object" && arg) {
    console.dir(arg);
    return arg;
  }
  console.log(arg, ...args);
  return arg;
}

function isDarkMode() {
  const mediaQuery = matchMedia("(prefers-color-scheme: dark)");
  return mediaQuery.matches;
}

function isClass(value) {
  return (Object.prototype.toString.call(value) === "[object Function]" &&
    typeof value === "function" &&
    "constructor" in value);
}

function isAsyncFunction(value) {
  return Object.prototype.toString.call(value) === "[object AsyncFunction]";
}

function isArrayEmpty(value) {
  return Array.isArray(value) && JSON.stringify(value.filter(Boolean)) === "[]";
}

function isObjectEmpty(value) {
  return (typeof value === "object" &&
    value !== null &&
    value.constructor === Object &&
    JSON.stringify(value) === "{}");
}

function isBlobEmpty(value) {
  return value instanceof Blob && (value.size === 0 || value.type === "");
}

function isStringEmpty(value) {
  return typeof value === "string" && /^\s*$/.test(value);
}

function isNumberEmpty(value) {
  return typeof value === "number" && isNaN(value);
}

function isEmpty(value) {
  if (value === undefined)
    return true;
  if (value === null)
    return true;
  if (isNumberEmpty(value))
    return true;
  if (isStringEmpty(value))
    return true;
  if (isArrayEmpty(value))
    return true;
  if (isObjectEmpty(value))
    return true;
  if (isBlobEmpty(value))
    return true;
  return false;
}

function isTextIncludes(data, text) {
  for (let index = 0; index < data.length; index++) {
    const value = data[index];
    if (value instanceof RegExp) {
      if (value.test(text))
        return true;
    } else {
      const reg = new RegExp(String(value));
      if (reg.test(text))
        return true;
    }
  }
  return false;
}

function isTextExcludes(data, text) {
  for (let index = 0; index < data.length; index++) {
    const value = data[index];
    if (value instanceof RegExp) {
      if (value.test(text))
        return false;
    } else {
      const reg = new RegExp(String(value));
      if (reg.test(text))
        return false;
    }
  }
  return true;
}

function is(val, type) {
  return Object.prototype.toString.call(val) === `[object ${type.name}]`;
}

function isArrayBufferView(data) {
  if ([
      Int8Array,
      Uint8Array,
      Uint8ClampedArray,
      Int16Array,
      Uint16Array,
      Int32Array,
      Uint32Array,
      Float64Array,
      BigInt64Array,
      BigUint64Array,
      DataView,
    ].some((type) => data instanceof type)) {
    return true;
  }
  return false;
}

class FileName {
  constructor(name) {
    this.data = [];
    const last = name.lastIndexOf(".");
    this.ext = last >= 0 ? name.substring(last) : "";
    this.name = name.replace(this.ext, "");
    let index = this.data.push(this.name[0]);
    for (let i = 1; i < this.name.length; i++) {
      const str = this.name[i];
      switch (true) {
        case /\.|-|_|\s/.test(str):
          i++;
          index = this.data.push(this.name[i]);
          break;
        case /[A-Z]/.test(str):
          index = this.data.push(str);
          break;
        default:
          this.data[index - 1] += str;
      }
    }
  }

  transformUpperHumpCase() {
    return this.data
      .filter((s) => s)
      .map((s) => s[0].toUpperCase() + s.substring(1))
      .join("");
  }

  transformLowerHumpCase() {
    return this.data
      .filter((s) => s)
      .map((s, i) => {
        if (i === 0) {
          return s[0].toLowerCase() + s.substring(1);
        }
        return s[0].toUpperCase() + s.substring(1);
      })
      .join("");
  }

  transformKebabCase() {
    return this.data.join("-");
  }

  transformSnakeCase() {
    return this.data.join("_");
  }
}

function nameToUpperHumpCase(name) {
  return new FileName(name).transformUpperHumpCase();
}

function nameToLowerHumpCase(name) {
  return new FileName(name).transformLowerHumpCase();
}

function nameToKebabCase(name) {
  return new FileName(name).transformKebabCase();
}

function nameToSnakeCase(name) {
  return new FileName(name).transformSnakeCase();
}

function createFileName(value) {
  return new FileName(value);
}

function bufferToString(param) {
  const data = typeof param !== "undefined" ? param : this;
  if (data instanceof Array) {
    return String.fromCharCode.apply(null, data);
  }
  if (data instanceof Int8Array ||
    data instanceof Uint8Array ||
    data instanceof Int16Array) {
    return String.fromCharCode.apply(null, Array.from(data));
  }
  if (data instanceof ArrayBuffer) {
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(data)));
  }
  return "";
}

const DEFAULT_CONFIG = {
  id: "id",
  children: "children",
  pid: "pid",
};
const getConfig = (config) => {
  return Object.assign({}, DEFAULT_CONFIG, config);
};

function listToTree(list, config = {}) {
  const conf = getConfig(config);
  const nodeMap = new Map();
  const result = [];
  const {
    id,
    children,
    pid
  } = conf;
  for (const node of list) {
    node[children] = node[children] || [];
    nodeMap.set(node[id], node);
  }
  for (const node of list) {
    const parent = nodeMap.get(node[pid]);
    (parent ? parent[children] : result).push(node);
  }
  return result;
}

function treeToList(tree, config = {}) {
  config = getConfig(config);
  const {
    children
  } = config;
  const result = [...tree];
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children])
      continue;
    result.splice(i + 1, 0, ...result[i][children]);
  }
  return result;
}

function findNode(tree, func, config = {}) {
  config = getConfig(config);
  const {
    children
  } = config;
  const list = [...tree];
  for (const node of list) {
    if (func(node))
      return node;
    node[children] && list.push(...node[children]);
  }
  return null;
}

function findNodeAll(tree, func, config = {}) {
  config = getConfig(config);
  const {
    children
  } = config;
  const list = [...tree];
  const result = [];
  for (const node of list) {
    func(node) && result.push(node);
    node[children] && list.push(...node[children]);
  }
  return result;
}

function findPath(tree, func, config = {}) {
  config = getConfig(config);
  const path = [];
  const list = [...tree];
  const visitedSet = new Set();
  const {
    children
  } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children] && list.unshift(...node[children]);
      path.push(node);
      if (func(node)) {
        return path;
      }
    }
  }
  return null;
}

function findPathAll(tree, func, config = {}) {
  config = getConfig(config);
  const path = [];
  const list = [...tree];
  const result = [];
  const visitedSet = new Set();
  const {
    children
  } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children] && list.unshift(...node[children]);
      path.push(node);
      func(node) && result.push([...path]);
    }
  }
  return result;
}

function filter(tree, func, config = {}) {
  config = getConfig(config);
  const children = config.children;

  function listFilter(list) {
    return list
      .map((node) => ({
        ...node
      }))
      .filter((node) => {
        node[children] = node[children] && listFilter(node[children]);
        return func(node) || (node[children] && node[children].length);
      });
  }
  return listFilter(tree);
}
async function forEach(tree, func, config = {}) {
  config = getConfig(config);
  const list = [...tree];
  const {
    children
  } = config;
  for (let i = 0; i < list.length; i++) {
    if (isAsyncFunction(func)) {
      if (await func(list[i])) {
        return;
      }
    } else {
      const result = func(list[i]);
      if (result instanceof Promise && (await result)) {
        return;
      } else if (result) {
        return;
      }
    }
    children &&
      list[i][children] &&
      list.splice(i + 1, 0, ...list[i][children]);
  }
}
/**
 * @description: Extract tree specified structure
 */
function treeMap(treeData, opt) {
  return treeData.map((item) => treeMapEach(item, opt));
}
/**
 * @description: Extract tree specified structure
 */
function treeMapEach(data, {
  children = "children",
  conversion,
}) {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0;
  const conversionData = conversion(data) || {};
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i) => treeMapEach(i, {
        children,
        conversion,
      })),
    };
  } else {
    return {
      ...conversionData,
    };
  }
}

function eachElementTree(treeDatas, callBack, parentNode = {}) {
  treeDatas.forEach((element) => {
    const newNode = callBack(element, parentNode) || element;
    if (element.children) {
      eachElementTree(Array.from(element.children), callBack, newNode);
    }
  });
}

function transformFileSize(value) {
  if (typeof value === "string") {
    const size = value.replace(/\s+/g, "").toUpperCase();
    if (/KB$/.test(size)) {
      const num = Number(size.replace(/KB$/, ""));
      return num * 10 ** 3;
    }
    if (/MB$/.test(size)) {
      const num = Number(size.replace(/MB$/, ""));
      return num * 10 ** 6;
    }
    if (/GB$/.test(size)) {
      const num = Number(size.replace(/GB$/, ""));
      return num * 10 ** 9;
    }
    if (/TB$/.test(size)) {
      const num = Number(size.replace(/TB$/, ""));
      return num * 10 ** 12;
    }
    return Number(size);
  }
  if (typeof value === "number") {
    return value;
  }
  return NaN;
}

function getUrlObject(url) {
  const [u1, u2] = url.split(/:\/\//);
  const protocol = u2 ? u1 : "";
  const [u3, ...u4] = protocol ? u2.split("/") : u1.split("/");
  const host = protocol ? u3 : "";
  const u5 = protocol ? [...u4] : [u3, ...u4];
  const [hostname, port] = host ? host.split(":") : ["", ""];
  const [pathname, params] = u5.join("/").split("?");
  const [search, hash] = params ? params.split("#") : ["", ""];
  return {
    protocol: protocol || location.protocol.replace(/:$/, ""),
    hostname: hostname || location.hostname,
    port: port || location.port || "",
    pathname,
    query: new URLSearchParams(search || ""),
    hash: hash || "",
  };
}

const hexList = [];
for (let i = 0; i <= 15; i++) {
  hexList[i] = i.toString(16);
}

function uuid() {
  let uuid = "";
  for (let i = 1; i <= 36; i++) {
    if (i === 9 || i === 14 || i === 19 || i === 24) {
      uuid += "-";
    } else if (i === 15) {
      uuid += 4;
    } else if (i === 20) {
      uuid += hexList[(Math.random() * 4) | 8];
    } else {
      uuid += hexList[(Math.random() * 16) | 0];
    }
  }
  return uuid.replace(/-/g, "");
}
let unique = 0;

function uuidDate(prefix = "") {
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);
  unique++;
  return prefix + "_" + random + unique + String(time);
}

class StorageManager {
  constructor(storage) {
    this.instance = {};
    this.lifecycle = {};
    this.storage = storage;
  }

  init(data) {
    if (Array.isArray(data)) {
      data.forEach((key) => {
        const value = this.getItem(key);
        if (value || value === '') {
          this.instance[key] = value;
        }
      });
    } else {
      for (const key in data) {
        const value = this.getItem(key);
        if (value || value === '') {
          this.instance[key] = value;
        } else {
          this.setItem(key, data[key]);
        }
      }
    }
    return this;
  }

  getInstance() {
    return Object.assign({}, this.instance);
  }

  forEach(callback) {
    Object.keys(this.instance).forEach((key) => {
      callback(this.instance[key], key);
    });
  }

  useProxy(getter, setter) {
    this.getter = getter;
    this.setter = setter;
    return this;
  }

  getTime(value) {
    if (value && /;\d+$/.test(value)) {
      const match = value.match(/;\d+$/);
      if (match && match[0]) {
        const time = Number(match[0].replace(/^;/, ''));
        return time;
      }
    }
    return 0;
  }

  getItem(key) {
    const v = this.storage.getItem(key);
    const time = this.getTime(v);
    if (time && Date.now() > time) {
      this.removeItem(key);
      return null;
    }
    const value = v ? v.replace(/;\d+$/, '') : '';
    return this.getter ? this.getter(value) : value;
  }

  setItem(key, value, life) {
    if (this.setter) {
      this.instance[key] = this.setter(value);
    } else {
      this.instance[key] = value;
    }
    if (life) {
      const time = Date.now() + life;
      this.storage.setItem(key, this.instance[key] + ';' + time);
    } else {
      this.storage.setItem(key, this.instance[key]);
    }
    return this;
  }

  clear() {
    this.instance = {};
    this.lifecycle = {};
    this.storage.clear();
    return this;
  }

  removeItem(key) {
    delete this.instance[key];
    delete this.lifecycle[key];
    this.storage.removeItem(key);
    return this;
  }
}

function isBrowserSupported(key) {
  return typeof Window !== "undefined" && key in window;
}

function urlToImageElement(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      requestAnimationFrame(() => {
        resolve(img);
      });
    };
    img.onerror = (e) => {
      reject(e);
    };
    img.src = url;
  });
}

function imageToBase64(img, type) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!canvas || !ctx) {
    throw new Error("Can‘t draw canvas");
  }
  canvas.height = img.height;
  canvas.width = img.width;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL(type || "image/png");
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      if (result instanceof ArrayBuffer) {
        resolve(JSON.stringify(result));
      } else {
        resolve(result || "");
      }
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsDataURL(blob);
  });
}

function base64toBlob(base64Buf, type) {
  const arr = base64Buf.split(",");
  const mime = (() => {
    if (/^data:(\w|\/)+;base64/.test(base64Buf) && arr[0]) {
      const mineRegexp = arr[0].match(/:(.*?);/);
      return mineRegexp ? mineRegexp[1] : "";
    } else {
      return type || "";
    }
  })();
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  if (!mime) {
    throw new Error("Mime is not type.");
  }
  return new Blob([u8arr], {
    type: mime
  });
}

function conditionData(value, defaultValue) {
  return value === defaultValue ? defaultValue : value || defaultValue;
}
const png1px = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAC4jAAAuIwF4pT92AAAE7mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuYTg3MzFiOSwgMjAyMS8wOS8wOS0wMDozNzozOCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0xMi0xM1QwNzoxNzoyOSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0xMi0xM1QwNzoxNzoyOSswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMTItMTNUMDc6MTc6MjkrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmNmN2U5MjFjLTZjZTEtMzk0Yy1hNmU4LWIzZjA0NmRmOWJkMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpjZjdlOTIxYy02Y2UxLTM5NGMtYTZlOC1iM2YwNDZkZjliZDAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZjdlOTIxYy02Y2UxLTM5NGMtYTZlOC1iM2YwNDZkZjliZDAiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmNmN2U5MjFjLTZjZTEtMzk0Yy1hNmU4LWIzZjA0NmRmOWJkMCIgc3RFdnQ6d2hlbj0iMjAyMS0xMi0xM1QwNzoxNzoyOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj3/j7AAAAAMSURBVAgdY/j//z8ABf4C/p/KLRMAAAAASUVORK5CYII=';
/**
 * 清除拖拉顯示元素
 * @param {DragEvent} event
 */
function clearDragImage(event) {
  if (event.dataTransfer) {
    const img = new Image();
    img.src = png1px;
    event.dataTransfer.setDragImage(img, 0, 0);
  }
}

function getBoundingClientRect(element) {
  if (!element || !element.getBoundingClientRect) {
    return 0;
  }
  return element.getBoundingClientRect();
}

function getViewportOffset(element) {
  const doc = document.documentElement;
  const docScrollLeft = doc.scrollLeft;
  const docScrollTop = doc.scrollTop;
  const docClientLeft = doc.clientLeft;
  const docClientTop = doc.clientTop;
  const pageXOffset = window.pageXOffset;
  const pageYOffset = window.pageYOffset;
  const box = getBoundingClientRect(element);
  const {
    left: retLeft,
    top: rectTop,
    width: rectWidth,
    height: rectHeight
  } = box;
  const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0);
  const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0);
  const offsetLeft = retLeft + pageXOffset;
  const offsetTop = rectTop + pageYOffset;
  const left = offsetLeft - scrollLeft;
  const top = offsetTop - scrollTop;
  const clientWidth = window.document.documentElement.clientWidth;
  const clientHeight = window.document.documentElement.clientHeight;
  return {
    left,
    top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left,
    bottomIncludeBody: clientHeight - top,
  };
}

function getTransformStyleString(transform) {
  return `
${transform.rotate === undefined ? '' : `rotate(${conditionData(transform.rotate, 0)})`}
${transform.rotateX === undefined ? '' : `rotateX(${conditionData(transform.rotateX, 0)})`}
${transform.rotateY === undefined ? '' : `rotateY(${conditionData(transform.rotateY, 0)})`}
${transform.rotateZ === undefined ? '' : `rotateZ(${conditionData(transform.rotateZ, 0)})`}
${transform.scaleX === undefined ? '' : `scaleX(${conditionData(transform.scaleX, 1)})`}
${transform.scaleY === undefined ? '' : `scaleY(${conditionData(transform.scaleY, 1)})`}
${transform.scaleZ === undefined ? '' : `scaleZ(${conditionData(transform.scaleZ, 1)})`}
${transform.skewX === undefined ? '' : `skewX(${conditionData(transform.skewX, 0)})`}
${transform.skewY === undefined ? '' : `skewY(${conditionData(transform.skewY, 0)})`}
${transform.translateX === undefined ? '' : `translateX(${conditionData(transform.translateX, 0)})`}
${transform.translateY === undefined ? '' : `translateY(${conditionData(transform.translateY, 0)})`}
${transform.translateZ === undefined ? '' : `translateZ(${conditionData(transform.translateZ, 0)})`}
`;
}

export {
  FileName,
  StorageManager,
  asyncAction,
  base64toBlob,
  blobToBase64,
  bufferToString,
  checkStringIsEvery,
  checkStringIsSome,
  clearDragImage,
  cloneJson,
  createFileName,
  eachElementTree,
  filter,
  findNode,
  findNodeAll,
  findPath,
  findPathAll,
  forEach,
  formDataFormat,
  formUrlEncodedFormat,
  getBoundingClientRect,
  getTransformStyleString,
  getUrlObject,
  getViewportOffset,
  imageToBase64,
  is,
  isArrayBufferView,
  isArrayEmpty,
  isAsyncFunction,
  isBlobEmpty,
  isBrowserSupported,
  isClass,
  isDarkMode,
  isEmpty,
  isNumberEmpty,
  isObjectEmpty,
  isStringEmpty,
  isTextExcludes,
  isTextIncludes,
  jsonToString,
  listToTree,
  log,
  nameToKebabCase,
  nameToLowerHumpCase,
  nameToSnakeCase,
  nameToUpperHumpCase,
  optionsListOrCollection,
  optionsOnlyOrList,
  sleep,
  stringToJson,
  transformFileSize,
  treeMap,
  treeMapEach,
  treeToList,
  urlToImageElement,
  uuid,
  uuidDate
};