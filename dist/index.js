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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types/PluginActions */ "./src/types/PluginActions.ts");

const currentPage = figma.currentPage;
const selectedItems = currentPage.selection;
const root = figma.root;
main();
function main() {
    switch (figma.command) {
        case 'copyPrototypeLink': {
            return openWindow(_types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].copy);
        }
        case 'settings': {
            return openWindow(_types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].setup);
        }
        case 'about': {
            return openWindow(_types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].about);
        }
    }
    figma.closePlugin('ERROR: Unknown command');
}
function openWindow(action) {
    // INFO: Private plugin method
    // Only if you are making a private plugin (publishing it internally to your
    // company that is on an Organization plan) you can get the file key
    const fileId = figma.fileKey || root.getPluginData('shareFileId');
    const scaling = root.getPluginData('urlQueryParamScaling');
    const nodes = convertNodesToJSON(findItemsForLink());
    if (!nodes || !nodes.length) {
        return figma.closePlugin('ERROR: Could not get the link item');
    }
    if (!fileId && action === _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].copy)
        action = _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].setup;
    switch (action) {
        case _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].setup: {
            figma.showUI(__html__, {
                width: 295,
                height: 285,
            });
            figma.ui.postMessage({ act: _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].setup, nodes, fileId, scaling, fileName: root.name }, { origin: '*' });
            break;
        }
        case _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].about: {
            figma.showUI(__html__, {
                width: 282,
                height: 380,
            });
            figma.ui.postMessage({ act: _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].about, nodes, fileId, scaling, fileName: root.name }, { origin: '*' });
            break;
        }
        case _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].copy: {
            figma.showUI(__html__, {
                width: 0,
                height: 0,
            });
            figma.ui.postMessage({ act: _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].copy, nodes, fileId, scaling, fileName: root.name }, { origin: '*' });
            break;
        }
    }
    figma.ui.onmessage = (msg) => {
        var _a;
        if (msg.type === 'message' && msg.message) {
            figma.notify(msg.message || '');
            return;
        }
        else if (msg.type === 'cancel') {
            figma.closePlugin();
            return;
        }
        else if (msg.type === 'save-config') {
            root.setPluginData('shareFileId', msg.payload.fileId);
            root.setPluginData('urlQueryParamScaling', msg.payload.scaling || '');
            return;
        }
        else if (msg.type === 'links-copied') {
            let msg;
            if (!nodes.length) {
                msg = 'There are no nodes selected to generate the link';
            }
            else if (nodes.length === 1) {
                const nodeName = (((_a = nodes[0]) === null || _a === void 0 ? void 0 : _a.name) || '').trim();
                if (nodeName) {
                    msg = `Prototype link of '${nodeName}' copied to clipboard`;
                }
                else {
                    msg = 'Prototype link copied to clipboard';
                }
            }
            else {
                msg = `Prototype links copied to clipboard (${nodes.length})`;
            }
            figma.closePlugin(msg);
            return;
        }
        figma.closePlugin();
    };
}
function findItemsForLink() {
    let linkItems = [];
    if (!selectedItems.length) {
        linkItems.push(figma.currentPage);
    }
    else {
        for (const selectedItem of selectedItems) {
            const parents = getParentsList(selectedItem);
            const keys = Array.from(parents.keys());
            for (let i = keys.length - 1; i >= 0; i--) {
                const id = keys[i];
                const item = parents.get(id);
                const prev_id = keys[i - 1];
                const prev_item = parents.get(prev_id);
                if (item.type !== 'PAGE')
                    continue;
                if (prev_item && prev_item.type === 'FRAME')
                    linkItems.push(prev_item);
                else
                    linkItems.push(item);
                break;
            }
        }
    }
    return uniqueBy(linkItems.filter((n) => n), 'id');
}
function getParentsList(node) {
    const map = new Map();
    if (!node)
        return map;
    let _parent = node;
    while (_parent) {
        map.set(_parent.id, _parent);
        _parent = _parent.id === root.id ? undefined : _parent.parent;
    }
    return map;
}
function convertNodesToJSON(nodes) {
    return nodes.map((node) => ({
        id: node.id,
        name: node.name,
    }));
}
function uniqueBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
}


/***/ }),

/***/ "./src/types/PluginActions.ts":
/*!************************************!*\
  !*** ./src/types/PluginActions.ts ***!
  \************************************/
/*! exports provided: PluginActions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PluginActions", function() { return PluginActions; });
var PluginActions;
(function (PluginActions) {
    PluginActions["copy"] = "copy";
    PluginActions["setup"] = "setup";
    PluginActions["about"] = "about";
})(PluginActions || (PluginActions = {}));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy9QbHVnaW5BY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFzRDtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixrRUFBYTtBQUMzQztBQUNBO0FBQ0EsOEJBQThCLGtFQUFhO0FBQzNDO0FBQ0E7QUFDQSw4QkFBOEIsa0VBQWE7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixrRUFBYTtBQUMzQyxpQkFBaUIsa0VBQWE7QUFDOUI7QUFDQSxhQUFhLGtFQUFhO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixrQ0FBa0MsTUFBTSxrRUFBYSxxREFBcUQsR0FBRyxjQUFjO0FBQzNIO0FBQ0E7QUFDQSxhQUFhLGtFQUFhO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixrQ0FBa0MsTUFBTSxrRUFBYSxxREFBcUQsR0FBRyxjQUFjO0FBQzNIO0FBQ0E7QUFDQSxhQUFhLGtFQUFhO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixrQ0FBa0MsTUFBTSxrRUFBYSxvREFBb0QsR0FBRyxjQUFjO0FBQzFIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsU0FBUztBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQsYUFBYTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxRQUFRO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDNUlBO0FBQUE7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxzQ0FBc0MiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCB7IFBsdWdpbkFjdGlvbnMgfSBmcm9tICcuL3R5cGVzL1BsdWdpbkFjdGlvbnMnO1xuY29uc3QgY3VycmVudFBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcbmNvbnN0IHNlbGVjdGVkSXRlbXMgPSBjdXJyZW50UGFnZS5zZWxlY3Rpb247XG5jb25zdCByb290ID0gZmlnbWEucm9vdDtcbm1haW4oKTtcbmZ1bmN0aW9uIG1haW4oKSB7XG4gICAgc3dpdGNoIChmaWdtYS5jb21tYW5kKSB7XG4gICAgICAgIGNhc2UgJ2NvcHlQcm90b3R5cGVMaW5rJzoge1xuICAgICAgICAgICAgcmV0dXJuIG9wZW5XaW5kb3coUGx1Z2luQWN0aW9ucy5jb3B5KTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdzZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIHJldHVybiBvcGVuV2luZG93KFBsdWdpbkFjdGlvbnMuc2V0dXApO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2Fib3V0Jzoge1xuICAgICAgICAgICAgcmV0dXJuIG9wZW5XaW5kb3coUGx1Z2luQWN0aW9ucy5hYm91dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oJ0VSUk9SOiBVbmtub3duIGNvbW1hbmQnKTtcbn1cbmZ1bmN0aW9uIG9wZW5XaW5kb3coYWN0aW9uKSB7XG4gICAgLy8gSU5GTzogUHJpdmF0ZSBwbHVnaW4gbWV0aG9kXG4gICAgLy8gT25seSBpZiB5b3UgYXJlIG1ha2luZyBhIHByaXZhdGUgcGx1Z2luIChwdWJsaXNoaW5nIGl0IGludGVybmFsbHkgdG8geW91clxuICAgIC8vIGNvbXBhbnkgdGhhdCBpcyBvbiBhbiBPcmdhbml6YXRpb24gcGxhbikgeW91IGNhbiBnZXQgdGhlIGZpbGUga2V5XG4gICAgY29uc3QgZmlsZUlkID0gZmlnbWEuZmlsZUtleSB8fCByb290LmdldFBsdWdpbkRhdGEoJ3NoYXJlRmlsZUlkJyk7XG4gICAgY29uc3Qgc2NhbGluZyA9IHJvb3QuZ2V0UGx1Z2luRGF0YSgndXJsUXVlcnlQYXJhbVNjYWxpbmcnKTtcbiAgICBjb25zdCBub2RlcyA9IGNvbnZlcnROb2Rlc1RvSlNPTihmaW5kSXRlbXNGb3JMaW5rKCkpO1xuICAgIGlmICghbm9kZXMgfHwgIW5vZGVzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmlnbWEuY2xvc2VQbHVnaW4oJ0VSUk9SOiBDb3VsZCBub3QgZ2V0IHRoZSBsaW5rIGl0ZW0nKTtcbiAgICB9XG4gICAgaWYgKCFmaWxlSWQgJiYgYWN0aW9uID09PSBQbHVnaW5BY3Rpb25zLmNvcHkpXG4gICAgICAgIGFjdGlvbiA9IFBsdWdpbkFjdGlvbnMuc2V0dXA7XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgY2FzZSBQbHVnaW5BY3Rpb25zLnNldHVwOiB7XG4gICAgICAgICAgICBmaWdtYS5zaG93VUkoX19odG1sX18sIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMjk1LFxuICAgICAgICAgICAgICAgIGhlaWdodDogMjg1LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IGFjdDogUGx1Z2luQWN0aW9ucy5zZXR1cCwgbm9kZXMsIGZpbGVJZCwgc2NhbGluZywgZmlsZU5hbWU6IHJvb3QubmFtZSB9LCB7IG9yaWdpbjogJyonIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBQbHVnaW5BY3Rpb25zLmFib3V0OiB7XG4gICAgICAgICAgICBmaWdtYS5zaG93VUkoX19odG1sX18sIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMjgyLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzgwLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IGFjdDogUGx1Z2luQWN0aW9ucy5hYm91dCwgbm9kZXMsIGZpbGVJZCwgc2NhbGluZywgZmlsZU5hbWU6IHJvb3QubmFtZSB9LCB7IG9yaWdpbjogJyonIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBQbHVnaW5BY3Rpb25zLmNvcHk6IHtcbiAgICAgICAgICAgIGZpZ21hLnNob3dVSShfX2h0bWxfXywge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBhY3Q6IFBsdWdpbkFjdGlvbnMuY29weSwgbm9kZXMsIGZpbGVJZCwgc2NhbGluZywgZmlsZU5hbWU6IHJvb3QubmFtZSB9LCB7IG9yaWdpbjogJyonIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4ge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmIChtc2cudHlwZSA9PT0gJ21lc3NhZ2UnICYmIG1zZy5tZXNzYWdlKSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkobXNnLm1lc3NhZ2UgfHwgJycpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1zZy50eXBlID09PSAnY2FuY2VsJykge1xuICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ3NhdmUtY29uZmlnJykge1xuICAgICAgICAgICAgcm9vdC5zZXRQbHVnaW5EYXRhKCdzaGFyZUZpbGVJZCcsIG1zZy5wYXlsb2FkLmZpbGVJZCk7XG4gICAgICAgICAgICByb290LnNldFBsdWdpbkRhdGEoJ3VybFF1ZXJ5UGFyYW1TY2FsaW5nJywgbXNnLnBheWxvYWQuc2NhbGluZyB8fCAnJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobXNnLnR5cGUgPT09ICdsaW5rcy1jb3BpZWQnKSB7XG4gICAgICAgICAgICBsZXQgbXNnO1xuICAgICAgICAgICAgaWYgKCFub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtc2cgPSAnVGhlcmUgYXJlIG5vIG5vZGVzIHNlbGVjdGVkIHRvIGdlbmVyYXRlIHRoZSBsaW5rJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVOYW1lID0gKCgoX2EgPSBub2Rlc1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5hbWUpIHx8ICcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IGBQcm90b3R5cGUgbGluayBvZiAnJHtub2RlTmFtZX0nIGNvcGllZCB0byBjbGlwYm9hcmRgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbXNnID0gJ1Byb3RvdHlwZSBsaW5rIGNvcGllZCB0byBjbGlwYm9hcmQnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1zZyA9IGBQcm90b3R5cGUgbGlua3MgY29waWVkIHRvIGNsaXBib2FyZCAoJHtub2Rlcy5sZW5ndGh9KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbihtc2cpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGZpbmRJdGVtc0ZvckxpbmsoKSB7XG4gICAgbGV0IGxpbmtJdGVtcyA9IFtdO1xuICAgIGlmICghc2VsZWN0ZWRJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgbGlua0l0ZW1zLnB1c2goZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RlZEl0ZW0gb2Ygc2VsZWN0ZWRJdGVtcykge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50cyA9IGdldFBhcmVudHNMaXN0KHNlbGVjdGVkSXRlbSk7XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gQXJyYXkuZnJvbShwYXJlbnRzLmtleXMoKSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0ga2V5cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcGFyZW50cy5nZXQoaWQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZfaWQgPSBrZXlzW2kgLSAxXTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2X2l0ZW0gPSBwYXJlbnRzLmdldChwcmV2X2lkKTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS50eXBlICE9PSAnUEFHRScpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmIChwcmV2X2l0ZW0gJiYgcHJldl9pdGVtLnR5cGUgPT09ICdGUkFNRScpXG4gICAgICAgICAgICAgICAgICAgIGxpbmtJdGVtcy5wdXNoKHByZXZfaXRlbSk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBsaW5rSXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5pcXVlQnkobGlua0l0ZW1zLmZpbHRlcigobikgPT4gbiksICdpZCcpO1xufVxuZnVuY3Rpb24gZ2V0UGFyZW50c0xpc3Qobm9kZSkge1xuICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcbiAgICBpZiAoIW5vZGUpXG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgbGV0IF9wYXJlbnQgPSBub2RlO1xuICAgIHdoaWxlIChfcGFyZW50KSB7XG4gICAgICAgIG1hcC5zZXQoX3BhcmVudC5pZCwgX3BhcmVudCk7XG4gICAgICAgIF9wYXJlbnQgPSBfcGFyZW50LmlkID09PSByb290LmlkID8gdW5kZWZpbmVkIDogX3BhcmVudC5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBtYXA7XG59XG5mdW5jdGlvbiBjb252ZXJ0Tm9kZXNUb0pTT04obm9kZXMpIHtcbiAgICByZXR1cm4gbm9kZXMubWFwKChub2RlKSA9PiAoe1xuICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgbmFtZTogbm9kZS5uYW1lLFxuICAgIH0pKTtcbn1cbmZ1bmN0aW9uIHVuaXF1ZUJ5KGFyciwga2V5KSB7XG4gICAgcmV0dXJuIFsuLi5uZXcgTWFwKGFyci5tYXAoKGl0ZW0pID0+IFtpdGVtW2tleV0sIGl0ZW1dKSkudmFsdWVzKCldO1xufVxuIiwiZXhwb3J0IHZhciBQbHVnaW5BY3Rpb25zO1xuKGZ1bmN0aW9uIChQbHVnaW5BY3Rpb25zKSB7XG4gICAgUGx1Z2luQWN0aW9uc1tcImNvcHlcIl0gPSBcImNvcHlcIjtcbiAgICBQbHVnaW5BY3Rpb25zW1wic2V0dXBcIl0gPSBcInNldHVwXCI7XG4gICAgUGx1Z2luQWN0aW9uc1tcImFib3V0XCJdID0gXCJhYm91dFwiO1xufSkoUGx1Z2luQWN0aW9ucyB8fCAoUGx1Z2luQWN0aW9ucyA9IHt9KSk7XG4iXSwic291cmNlUm9vdCI6IiJ9