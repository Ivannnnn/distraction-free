/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/contentScripts/youtube.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/contentScripts/utils.js":
/*!*************************************!*\
  !*** ./src/contentScripts/utils.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

const renderStyles = (() => {
  const style = document.createElement('style')
  return css => {
    style.innerHTML = css
    if (!style.parentElement) document.head.appendChild(style)
  }
})()

const headReady = readyCb => {
  const headCheck = mutations => {
    for (let i = 0; i < mutations.length; i++) {
      const $head = Array.from(mutations[i].addedNodes).find(
        el => el.tagName === 'HEAD'
      )

      if ($head) {
        mutationObserver.disconnect()
        return readyCb()
      }
    }
  }

  const mutationObserver = new MutationObserver(headCheck)
  mutationObserver.observe(document.documentElement, { childList: true })
}

const currentPathname = () => new URL(window.location.href).pathname

const onUrlChange = (() => {
  let pageLoaded = false
  const subscribers = []

  chrome.runtime.onMessage.addListener(() => {
    pageLoaded ? subscribers.forEach(fn => fn()) : (pageLoaded = true)
  })

  return cb => subscribers.push(cb)
})()

const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

const arrGetRandom = (arr, amount) => {
  const min = 0
  const max = arr.length - 1

  if (amount > arr.length) {
    throw new Error('Amount is bigger than array length.')
  }

  const result = {}

  while (Object.keys(result).length < amount) {
    const index = randomBetween(min, max)
    if (!result[index]) result[index] = arr[index]
  }
  return Object.values(result).sort(() => 0.5 - Math.random())
}

const appendHTML = (el, htmlStr) => {
  const container = document.createElement('div')
  container.innerHTML = htmlStr
  el.appendChild(container.firstElementChild)
}

const observe = (el, cb, options = { childList: true }) => {
  const func = mutations => cb(mutations) === false && mo.disconnect()
  const mo = new MutationObserver(func)
  mo.observe(el, options)
}

const $ = s => Array.from(document.querySelectorAll(s))

module.exports = {
  renderStyles,
  headReady,
  currentPathname,
  onUrlChange,
  arrGetRandom,
  appendHTML,
  $,
  observe
}


/***/ }),

/***/ "./src/contentScripts/youtube.js":
/*!***************************************!*\
  !*** ./src/contentScripts/youtube.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const { renderStyles, headReady } = __webpack_require__(/*! ./utils */ "./src/contentScripts/utils.js")

const rules = {
  recommended: `
  ytd-two-column-browse-results-renderer[page-subtype=home] { display:none !important; }
  `,
  up_next: `ytd-watch-next-secondary-results-renderer { display: none !important; }`,
  related: `.videowall-endscreen { display: none !important }`,
  comments: `#watch-discussion, #comments { display: none; }`,
  ads: `#player-ads { display:none !important; }`
}

//
// sidebar ads maybe
let options = {
  recommended: false,
  up_next: false,
  related: false,
  comments: false,
  ads: false
}

const hideAll = () => {
  return Object.keys(options)
    .map(key => rules[key])
    .join('\n')
}

const showAll = () => ''

const activeOptionsToCSS = () => {
  return Object.keys(options)
    .filter(key => options[key])
    .map(key => rules[key])
    .join('\n')
}

//
// options updated
chrome.storage.onChanged.addListener(changes => {
  changes.options.newValue.youtube &&
    Object.assign(options, changes.options.newValue.youtube)
  renderStyles(activeOptionsToCSS())
})

//
// url change
chrome.runtime.onMessage.addListener(() => {
  renderStyles(activeOptionsToCSS())
})

//
// head is inserted & ready to get styles
headReady(() => {
  renderStyles(hideAll())
  chrome.storage.sync.get('options', data => {
    data.options.youtube && Object.assign(options, data.options.youtube)
    renderStyles(activeOptionsToCSS())
  })
})


/***/ })

/******/ });
//# sourceMappingURL=youtube.js.map