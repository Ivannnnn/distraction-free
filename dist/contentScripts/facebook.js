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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/contentScripts/facebook.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/contentScripts/facebook.js":
/*!****************************************!*\
  !*** ./src/contentScripts/facebook.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {
  renderStyles,
  headReady,
  currentPathname,
  onUrlChange,
  arrGetRandom,
  appendHTML,
  $,
  observe
} = __webpack_require__(/*! ./utils */ "./src/contentScripts/utils.js")

const onPageUpdated = cb =>
  observe(document.getElementById('content'), mutations => {
    if (mutations[0].addedNodes.length === 2) {
      cb()
      return false
    }
  })

const onContentReady = cb =>
  observe(document.documentElement, mutations => {
    if (mutations.length === 4) {
      cb()
      return false
    }
  })

//
// What about ads
const rules = {
  newsfeed: bool => {
    if (bool) {
      console.log('run')
      const run = () => {
        const lis = `<ul><li>${arrGetRandom(socialMediaFacts, 4).join(
          '</li><li>'
        )}</li></ul>`

        setTimeout(() => appendHTML($('#contentArea > div')[0], lis), 100)
      }
      $('#contentArea')[0] ? run() : onContentReady(run)
    }

    return (
      bool &&
      `
      #contentArea
        > div
        > div:not(#pagelet_composer) {
          display:none;
        }
      #contentArea li {
        background-color: #fff;
        border: 1px solid #dddfe2;
        border-radius: 3px;
        margin-bottom: 10px;
        padding: 12px;
      }
    `
    )
  },
  group_recommendations: `
    #pagelet_ego_pane { display:none; }
    #pagelet_rhc_footer > div { margin-top:0; }
  `,
  ads: ''
}

//
// What about group recommendations
let options = {
  newsfeed: false,
  group_recommendations: false,
  ads: false
}

const socialMediaFacts = [
  'The average daily time spent on social media is 142 minutes a day.',
  '74% of Facebook users check it every day.',
  'The average user spends 35 minutes on Facebook a day.',
  'There are an estimated 270 million fake Facebook profiles.',
  'Facebook adds 500,000 new users every day; 6 new profiles every second.',
  '79% of all online US adults use Facebook.',
  '30% of Americans get all of their news exclusively from Facebook.',
  'Almost one-quarter – 23% – of Facebook users check the site FIVE TIMES or more per day.',
  'Only 25% of Facebook users bother to check or adjust their privacy settings.'
]

const hideAll = () => {
  return Object.keys(options)
    .map(key => rules[key])
    .join('\n')
}

const showAll = () => ''

const activeOptionsToCSS = () => {
  return Object.keys(options).map(key =>
    typeof rules[key] === 'function'
      ? rules[key](options[key])
      : rules[key] || ''
  )
}

//
// options updated
chrome.storage.onChanged.addListener(changes => {
  changes.options.newValue.facebook &&
    Object.assign(options, changes.options.newValue.facebook)
  renderStyles(currentPathname() !== '/' ? showAll() : activeOptionsToCSS())
})

//
// url change
onUrlChange(() => {
  onPageUpdated(() => {
    renderStyles(currentPathname() === '/' ? activeOptionsToCSS() : showAll())
  })
})

//
// head is inserted & ready to get styles
headReady(() => {
  currentPathname() === '/' && renderStyles(hideAll())
  chrome.storage.sync.get('options', data => {
    data.options.facebook && Object.assign(options, data.options.facebook)
    renderStyles(currentPathname() === '/' ? activeOptionsToCSS() : showAll())
  })
})


/***/ }),

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


/***/ })

/******/ });
//# sourceMappingURL=facebook.js.map