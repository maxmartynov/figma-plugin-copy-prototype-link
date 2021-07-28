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
            return openWindow(_types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["default"].copy);
        }
        case 'settings': {
            return openWindow(_types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["default"].setup);
        }
        case 'about': {
            return openWindow(_types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["default"].about);
        }
    }
    figma.closePlugin('ERROR: Unknown command');
}
function openWindow(action) {
    // INFO: Private plugin method
    // Only if you are making a private plugin (publishing it internally to your
    // company that is on an Organization plan) you can get the file key
    const fileId = figma.fileKey ||
        root.getPluginData('shareFileId');
    const nodes = convertNodesToJSON(findItemsForLink());
    if (!nodes || !nodes.length) {
        return figma.closePlugin('ERROR: Could not get the link item');
    }
    if (!fileId && action === _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["default"].copy)
        action = _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["default"].setup;
    switch (action) {
        case _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["default"].setup: {
            figma.showUI(__html__, {
                width: 295,
                height: 255
            });
            figma.ui.postMessage({ act: _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["default"].setup, nodes, fileId, fileName: root.name }, { origin: '*' });
            break;
        }
        case _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["default"].about: {
            figma.showUI(__html__, {
                width: 282,
                height: 360
            });
            figma.ui.postMessage({ act: _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["default"].about, nodes, fileId, fileName: root.name }, { origin: '*' });
            break;
        }
        case _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["default"].copy: {
            figma.showUI(__html__, {
                width: 0,
                height: 0
            });
            figma.ui.postMessage({ act: _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["default"].copy, nodes, fileId, fileName: root.name }, { origin: '*' });
            break;
        }
    }
    figma.ui.onmessage = (msg) => {
        var _a;
        if (msg.type === 'message' && msg.message) {
            figma.notify(msg.message || '');
            return;
        }
        if (msg.type === 'cancel') {
            figma.closePlugin();
            return;
        }
        if (msg.type === 'save-file-id') {
            root.setPluginData('shareFileId', msg.fileId);
            return;
        }
        if (msg.type === 'links-copied') {
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
    return uniqueBy(linkItems.filter(n => n), 'id');
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
    return nodes.map(node => ({
        id: node.id,
        name: node.name
    }));
}
function uniqueBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()];
}


/***/ }),

/***/ "./src/types/PluginActions.ts":
/*!************************************!*\
  !*** ./src/types/PluginActions.ts ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var PluginActions;
(function (PluginActions) {
    PluginActions["copy"] = "copy";
    PluginActions["setup"] = "setup";
    PluginActions["about"] = "about";
})(PluginActions || (PluginActions = {}));
/* harmony default export */ __webpack_exports__["default"] = (PluginActions);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy9QbHVnaW5BY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qiw0REFBYTtBQUMzQztBQUNBO0FBQ0EsOEJBQThCLDREQUFhO0FBQzNDO0FBQ0E7QUFDQSw4QkFBOEIsNERBQWE7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qiw0REFBYTtBQUMzQyxpQkFBaUIsNERBQWE7QUFDOUI7QUFDQSxhQUFhLDREQUFhO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixrQ0FBa0MsTUFBTSw0REFBYSw0Q0FBNEMsR0FBRyxjQUFjO0FBQ2xIO0FBQ0E7QUFDQSxhQUFhLDREQUFhO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixrQ0FBa0MsTUFBTSw0REFBYSw0Q0FBNEMsR0FBRyxjQUFjO0FBQ2xIO0FBQ0E7QUFDQSxhQUFhLDREQUFhO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixrQ0FBa0MsTUFBTSw0REFBYSwyQ0FBMkMsR0FBRyxjQUFjO0FBQ2pIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFNBQVM7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOERBQThELGFBQWE7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsUUFBUTtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzNJQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLHNDQUFzQztBQUN4Qiw0RUFBYSxFQUFDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgUGx1Z2luQWN0aW9ucyBmcm9tICcuL3R5cGVzL1BsdWdpbkFjdGlvbnMnO1xuY29uc3QgY3VycmVudFBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcbmNvbnN0IHNlbGVjdGVkSXRlbXMgPSBjdXJyZW50UGFnZS5zZWxlY3Rpb247XG5jb25zdCByb290ID0gZmlnbWEucm9vdDtcbm1haW4oKTtcbmZ1bmN0aW9uIG1haW4oKSB7XG4gICAgc3dpdGNoIChmaWdtYS5jb21tYW5kKSB7XG4gICAgICAgIGNhc2UgJ2NvcHlQcm90b3R5cGVMaW5rJzoge1xuICAgICAgICAgICAgcmV0dXJuIG9wZW5XaW5kb3coUGx1Z2luQWN0aW9ucy5jb3B5KTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdzZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIHJldHVybiBvcGVuV2luZG93KFBsdWdpbkFjdGlvbnMuc2V0dXApO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2Fib3V0Jzoge1xuICAgICAgICAgICAgcmV0dXJuIG9wZW5XaW5kb3coUGx1Z2luQWN0aW9ucy5hYm91dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oJ0VSUk9SOiBVbmtub3duIGNvbW1hbmQnKTtcbn1cbmZ1bmN0aW9uIG9wZW5XaW5kb3coYWN0aW9uKSB7XG4gICAgLy8gSU5GTzogUHJpdmF0ZSBwbHVnaW4gbWV0aG9kXG4gICAgLy8gT25seSBpZiB5b3UgYXJlIG1ha2luZyBhIHByaXZhdGUgcGx1Z2luIChwdWJsaXNoaW5nIGl0IGludGVybmFsbHkgdG8geW91clxuICAgIC8vIGNvbXBhbnkgdGhhdCBpcyBvbiBhbiBPcmdhbml6YXRpb24gcGxhbikgeW91IGNhbiBnZXQgdGhlIGZpbGUga2V5XG4gICAgY29uc3QgZmlsZUlkID0gZmlnbWEuZmlsZUtleSB8fFxuICAgICAgICByb290LmdldFBsdWdpbkRhdGEoJ3NoYXJlRmlsZUlkJyk7XG4gICAgY29uc3Qgbm9kZXMgPSBjb252ZXJ0Tm9kZXNUb0pTT04oZmluZEl0ZW1zRm9yTGluaygpKTtcbiAgICBpZiAoIW5vZGVzIHx8ICFub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZpZ21hLmNsb3NlUGx1Z2luKCdFUlJPUjogQ291bGQgbm90IGdldCB0aGUgbGluayBpdGVtJyk7XG4gICAgfVxuICAgIGlmICghZmlsZUlkICYmIGFjdGlvbiA9PT0gUGx1Z2luQWN0aW9ucy5jb3B5KVxuICAgICAgICBhY3Rpb24gPSBQbHVnaW5BY3Rpb25zLnNldHVwO1xuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgIGNhc2UgUGx1Z2luQWN0aW9ucy5zZXR1cDoge1xuICAgICAgICAgICAgZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDI5NSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDI1NVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IGFjdDogUGx1Z2luQWN0aW9ucy5zZXR1cCwgbm9kZXMsIGZpbGVJZCwgZmlsZU5hbWU6IHJvb3QubmFtZSB9LCB7IG9yaWdpbjogJyonIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBQbHVnaW5BY3Rpb25zLmFib3V0OiB7XG4gICAgICAgICAgICBmaWdtYS5zaG93VUkoX19odG1sX18sIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMjgyLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzYwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgYWN0OiBQbHVnaW5BY3Rpb25zLmFib3V0LCBub2RlcywgZmlsZUlkLCBmaWxlTmFtZTogcm9vdC5uYW1lIH0sIHsgb3JpZ2luOiAnKicgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFBsdWdpbkFjdGlvbnMuY29weToge1xuICAgICAgICAgICAgZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgYWN0OiBQbHVnaW5BY3Rpb25zLmNvcHksIG5vZGVzLCBmaWxlSWQsIGZpbGVOYW1lOiByb290Lm5hbWUgfSwgeyBvcmlnaW46ICcqJyB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZpZ21hLnVpLm9ubWVzc2FnZSA9IChtc2cpID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAobXNnLnR5cGUgPT09ICdtZXNzYWdlJyAmJiBtc2cubWVzc2FnZSkge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KG1zZy5tZXNzYWdlIHx8ICcnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobXNnLnR5cGUgPT09ICdjYW5jZWwnKSB7XG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtc2cudHlwZSA9PT0gJ3NhdmUtZmlsZS1pZCcpIHtcbiAgICAgICAgICAgIHJvb3Quc2V0UGx1Z2luRGF0YSgnc2hhcmVGaWxlSWQnLCBtc2cuZmlsZUlkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobXNnLnR5cGUgPT09ICdsaW5rcy1jb3BpZWQnKSB7XG4gICAgICAgICAgICBsZXQgbXNnO1xuICAgICAgICAgICAgaWYgKCFub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtc2cgPSAnVGhlcmUgYXJlIG5vIG5vZGVzIHNlbGVjdGVkIHRvIGdlbmVyYXRlIHRoZSBsaW5rJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVOYW1lID0gKCgoX2EgPSBub2Rlc1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5hbWUpIHx8ICcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IGBQcm90b3R5cGUgbGluayBvZiAnJHtub2RlTmFtZX0nIGNvcGllZCB0byBjbGlwYm9hcmRgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbXNnID0gJ1Byb3RvdHlwZSBsaW5rIGNvcGllZCB0byBjbGlwYm9hcmQnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1zZyA9IGBQcm90b3R5cGUgbGlua3MgY29waWVkIHRvIGNsaXBib2FyZCAoJHtub2Rlcy5sZW5ndGh9KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbihtc2cpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGZpbmRJdGVtc0ZvckxpbmsoKSB7XG4gICAgbGV0IGxpbmtJdGVtcyA9IFtdO1xuICAgIGlmICghc2VsZWN0ZWRJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgbGlua0l0ZW1zLnB1c2goZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RlZEl0ZW0gb2Ygc2VsZWN0ZWRJdGVtcykge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50cyA9IGdldFBhcmVudHNMaXN0KHNlbGVjdGVkSXRlbSk7XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gQXJyYXkuZnJvbShwYXJlbnRzLmtleXMoKSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0ga2V5cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcGFyZW50cy5nZXQoaWQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZfaWQgPSBrZXlzW2kgLSAxXTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2X2l0ZW0gPSBwYXJlbnRzLmdldChwcmV2X2lkKTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS50eXBlICE9PSAnUEFHRScpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmIChwcmV2X2l0ZW0gJiYgcHJldl9pdGVtLnR5cGUgPT09ICdGUkFNRScpXG4gICAgICAgICAgICAgICAgICAgIGxpbmtJdGVtcy5wdXNoKHByZXZfaXRlbSk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBsaW5rSXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5pcXVlQnkobGlua0l0ZW1zLmZpbHRlcihuID0+IG4pLCAnaWQnKTtcbn1cbmZ1bmN0aW9uIGdldFBhcmVudHNMaXN0KG5vZGUpIHtcbiAgICBjb25zdCBtYXAgPSBuZXcgTWFwKCk7XG4gICAgaWYgKCFub2RlKVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIGxldCBfcGFyZW50ID0gbm9kZTtcbiAgICB3aGlsZSAoX3BhcmVudCkge1xuICAgICAgICBtYXAuc2V0KF9wYXJlbnQuaWQsIF9wYXJlbnQpO1xuICAgICAgICBfcGFyZW50ID0gX3BhcmVudC5pZCA9PT0gcm9vdC5pZCA/IHVuZGVmaW5lZCA6IF9wYXJlbnQucGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gbWFwO1xufVxuZnVuY3Rpb24gY29udmVydE5vZGVzVG9KU09OKG5vZGVzKSB7XG4gICAgcmV0dXJuIG5vZGVzLm1hcChub2RlID0+ICh7XG4gICAgICAgIGlkOiBub2RlLmlkLFxuICAgICAgICBuYW1lOiBub2RlLm5hbWVcbiAgICB9KSk7XG59XG5mdW5jdGlvbiB1bmlxdWVCeShhcnIsIGtleSkge1xuICAgIHJldHVybiBbLi4ubmV3IE1hcChhcnIubWFwKGl0ZW0gPT4gW2l0ZW1ba2V5XSwgaXRlbV0pKS52YWx1ZXMoKV07XG59XG4iLCJ2YXIgUGx1Z2luQWN0aW9ucztcbihmdW5jdGlvbiAoUGx1Z2luQWN0aW9ucykge1xuICAgIFBsdWdpbkFjdGlvbnNbXCJjb3B5XCJdID0gXCJjb3B5XCI7XG4gICAgUGx1Z2luQWN0aW9uc1tcInNldHVwXCJdID0gXCJzZXR1cFwiO1xuICAgIFBsdWdpbkFjdGlvbnNbXCJhYm91dFwiXSA9IFwiYWJvdXRcIjtcbn0pKFBsdWdpbkFjdGlvbnMgfHwgKFBsdWdpbkFjdGlvbnMgPSB7fSkpO1xuZXhwb3J0IGRlZmF1bHQgUGx1Z2luQWN0aW9ucztcbiJdLCJzb3VyY2VSb290IjoiIn0=