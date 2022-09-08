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
    figma.ui.onmessage = onPluginMessage;
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
    const configParams = getPluginConfig();
    const nodes = convertNodesToJSON(findItemsForLink());
    if (!nodes || !nodes.length) {
        return figma.closePlugin('ERROR: Could not get the link item');
    }
    if (!configParams.fileId && action === _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].copy) {
        action = _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].setup;
    }
    const pluginAction = {
        action,
        nodes,
        configParams,
        fileName: root.name,
    };
    switch (action) {
        case _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].setup: {
            figma.showUI(__html__, {
                width: 295,
                height: 350,
            });
            callPluginAction(pluginAction);
            break;
        }
        case _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].about: {
            figma.showUI(__html__, {
                width: 282,
                height: 380,
            });
            callPluginAction(pluginAction);
            break;
        }
        case _types_PluginActions__WEBPACK_IMPORTED_MODULE_0__["PluginActions"].copy: {
            figma.showUI(__html__, {
                width: 0,
                height: 0,
            });
            callPluginAction(pluginAction);
            break;
        }
    }
}
function onPluginMessage(msg) {
    var _a;
    const nodes = convertNodesToJSON(findItemsForLink());
    if (msg.type === 'message' && msg.message) {
        figma.notify(msg.message || '');
        return;
    }
    else if (msg.type === 'cancel') {
        figma.closePlugin();
        return;
    }
    else if (msg.type === 'save-config') {
        savePluginConfig(msg.payload);
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
}
function callPluginAction(pluginEvent) {
    figma.ui.postMessage(pluginEvent, { origin: '*' });
}
function getPluginConfig() {
    // INFO: Private plugin method
    // Only if you are making a private plugin (publishing it internally to your
    // company that is on an Organization plan) you can get the file key
    // const fileId: string = figma.fileKey
    const configParams = {
        fileId: '',
        scaling: undefined,
        hideUI: undefined,
    };
    configParams.fileId = root.getPluginData('config.fileId');
    configParams.scaling = root.getPluginData('config.scaling');
    configParams.hideUI =
        Number(root.getPluginData('config.hideUI')) || 0;
    // backward compatibility
    if (!configParams.fileId) {
        const oldVal = root.getPluginData('shareFileId');
        if (oldVal) {
            configParams.fileId = oldVal;
            root.setPluginData('shareFileId', '');
        }
    }
    // backward compatibility
    if (!configParams.scaling) {
        const oldVal = root.getPluginData('urlQueryParamScaling');
        if (oldVal) {
            configParams.scaling = oldVal;
            root.setPluginData('urlQueryParamScaling', '');
        }
    }
    return configParams;
}
function savePluginConfig(config) {
    root.setPluginData('config.fileId', config.fileId);
    root.setPluginData('config.scaling', config.scaling || '');
    root.setPluginData('config.hideUI', String(config.hideUI || 0));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy9QbHVnaW5BY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFzRDtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGtFQUFhO0FBQzNDO0FBQ0E7QUFDQSw4QkFBOEIsa0VBQWE7QUFDM0M7QUFDQTtBQUNBLDhCQUE4QixrRUFBYTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLGtFQUFhO0FBQ3hELGlCQUFpQixrRUFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxrRUFBYTtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYSxrRUFBYTtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYSxrRUFBYTtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsU0FBUztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQsYUFBYTtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxjQUFjO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsUUFBUTtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3pMQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsc0NBQXNDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgeyBQbHVnaW5BY3Rpb25zIH0gZnJvbSAnLi90eXBlcy9QbHVnaW5BY3Rpb25zJztcbmNvbnN0IGN1cnJlbnRQYWdlID0gZmlnbWEuY3VycmVudFBhZ2U7XG5jb25zdCBzZWxlY3RlZEl0ZW1zID0gY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuY29uc3Qgcm9vdCA9IGZpZ21hLnJvb3Q7XG5tYWluKCk7XG5mdW5jdGlvbiBtYWluKCkge1xuICAgIGZpZ21hLnVpLm9ubWVzc2FnZSA9IG9uUGx1Z2luTWVzc2FnZTtcbiAgICBzd2l0Y2ggKGZpZ21hLmNvbW1hbmQpIHtcbiAgICAgICAgY2FzZSAnY29weVByb3RvdHlwZUxpbmsnOiB7XG4gICAgICAgICAgICByZXR1cm4gb3BlbldpbmRvdyhQbHVnaW5BY3Rpb25zLmNvcHkpO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ3NldHRpbmdzJzoge1xuICAgICAgICAgICAgcmV0dXJuIG9wZW5XaW5kb3coUGx1Z2luQWN0aW9ucy5zZXR1cCk7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnYWJvdXQnOiB7XG4gICAgICAgICAgICByZXR1cm4gb3BlbldpbmRvdyhQbHVnaW5BY3Rpb25zLmFib3V0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmaWdtYS5jbG9zZVBsdWdpbignRVJST1I6IFVua25vd24gY29tbWFuZCcpO1xufVxuZnVuY3Rpb24gb3BlbldpbmRvdyhhY3Rpb24pIHtcbiAgICBjb25zdCBjb25maWdQYXJhbXMgPSBnZXRQbHVnaW5Db25maWcoKTtcbiAgICBjb25zb2xlLmxvZygnY29uZmlnUGFyYW1zOiAnLCBjb25maWdQYXJhbXMpO1xuICAgIGNvbnN0IG5vZGVzID0gY29udmVydE5vZGVzVG9KU09OKGZpbmRJdGVtc0ZvckxpbmsoKSk7XG4gICAgaWYgKCFub2RlcyB8fCAhbm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmaWdtYS5jbG9zZVBsdWdpbignRVJST1I6IENvdWxkIG5vdCBnZXQgdGhlIGxpbmsgaXRlbScpO1xuICAgIH1cbiAgICBpZiAoIWNvbmZpZ1BhcmFtcy5maWxlSWQgJiYgYWN0aW9uID09PSBQbHVnaW5BY3Rpb25zLmNvcHkpIHtcbiAgICAgICAgYWN0aW9uID0gUGx1Z2luQWN0aW9ucy5zZXR1cDtcbiAgICB9XG4gICAgY29uc3QgcGx1Z2luQWN0aW9uID0ge1xuICAgICAgICBhY3Rpb24sXG4gICAgICAgIG5vZGVzLFxuICAgICAgICBjb25maWdQYXJhbXMsXG4gICAgICAgIGZpbGVOYW1lOiByb290Lm5hbWUsXG4gICAgfTtcbiAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICBjYXNlIFBsdWdpbkFjdGlvbnMuc2V0dXA6IHtcbiAgICAgICAgICAgIGZpZ21hLnNob3dVSShfX2h0bWxfXywge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAyOTUsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNTAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNhbGxQbHVnaW5BY3Rpb24ocGx1Z2luQWN0aW9uKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgUGx1Z2luQWN0aW9ucy5hYm91dDoge1xuICAgICAgICAgICAgZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDI4MixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM4MCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2FsbFBsdWdpbkFjdGlvbihwbHVnaW5BY3Rpb24pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBQbHVnaW5BY3Rpb25zLmNvcHk6IHtcbiAgICAgICAgICAgIGZpZ21hLnNob3dVSShfX2h0bWxfXywge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2FsbFBsdWdpbkFjdGlvbihwbHVnaW5BY3Rpb24pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBvblBsdWdpbk1lc3NhZ2UobXNnKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IG5vZGVzID0gY29udmVydE5vZGVzVG9KU09OKGZpbmRJdGVtc0ZvckxpbmsoKSk7XG4gICAgaWYgKG1zZy50eXBlID09PSAnbWVzc2FnZScgJiYgbXNnLm1lc3NhZ2UpIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KG1zZy5tZXNzYWdlIHx8ICcnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ2NhbmNlbCcpIHtcbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ3NhdmUtY29uZmlnJykge1xuICAgICAgICBzYXZlUGx1Z2luQ29uZmlnKG1zZy5wYXlsb2FkKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ2xpbmtzLWNvcGllZCcpIHtcbiAgICAgICAgbGV0IG1zZztcbiAgICAgICAgaWYgKCFub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIG1zZyA9ICdUaGVyZSBhcmUgbm8gbm9kZXMgc2VsZWN0ZWQgdG8gZ2VuZXJhdGUgdGhlIGxpbmsnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZU5hbWUgPSAoKChfYSA9IG5vZGVzWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmFtZSkgfHwgJycpLnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChub2RlTmFtZSkge1xuICAgICAgICAgICAgICAgIG1zZyA9IGBQcm90b3R5cGUgbGluayBvZiAnJHtub2RlTmFtZX0nIGNvcGllZCB0byBjbGlwYm9hcmRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbXNnID0gJ1Byb3RvdHlwZSBsaW5rIGNvcGllZCB0byBjbGlwYm9hcmQnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbXNnID0gYFByb3RvdHlwZSBsaW5rcyBjb3BpZWQgdG8gY2xpcGJvYXJkICgke25vZGVzLmxlbmd0aH0pYDtcbiAgICAgICAgfVxuICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbihtc2cpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG59XG5mdW5jdGlvbiBjYWxsUGx1Z2luQWN0aW9uKHBsdWdpbkV2ZW50KSB7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UocGx1Z2luRXZlbnQsIHsgb3JpZ2luOiAnKicgfSk7XG59XG5mdW5jdGlvbiBnZXRQbHVnaW5Db25maWcoKSB7XG4gICAgLy8gSU5GTzogUHJpdmF0ZSBwbHVnaW4gbWV0aG9kXG4gICAgLy8gT25seSBpZiB5b3UgYXJlIG1ha2luZyBhIHByaXZhdGUgcGx1Z2luIChwdWJsaXNoaW5nIGl0IGludGVybmFsbHkgdG8geW91clxuICAgIC8vIGNvbXBhbnkgdGhhdCBpcyBvbiBhbiBPcmdhbml6YXRpb24gcGxhbikgeW91IGNhbiBnZXQgdGhlIGZpbGUga2V5XG4gICAgLy8gY29uc3QgZmlsZUlkOiBzdHJpbmcgPSBmaWdtYS5maWxlS2V5XG4gICAgY29uc3QgY29uZmlnUGFyYW1zID0ge1xuICAgICAgICBmaWxlSWQ6ICcnLFxuICAgICAgICBzY2FsaW5nOiB1bmRlZmluZWQsXG4gICAgICAgIGhpZGVVSTogdW5kZWZpbmVkLFxuICAgIH07XG4gICAgY29uZmlnUGFyYW1zLmZpbGVJZCA9IHJvb3QuZ2V0UGx1Z2luRGF0YSgnY29uZmlnLmZpbGVJZCcpO1xuICAgIGNvbmZpZ1BhcmFtcy5zY2FsaW5nID0gcm9vdC5nZXRQbHVnaW5EYXRhKCdjb25maWcuc2NhbGluZycpO1xuICAgIGNvbmZpZ1BhcmFtcy5oaWRlVUkgPVxuICAgICAgICBOdW1iZXIocm9vdC5nZXRQbHVnaW5EYXRhKCdjb25maWcuaGlkZVVJJykpIHx8IDA7XG4gICAgLy8gYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgIGlmICghY29uZmlnUGFyYW1zLmZpbGVJZCkge1xuICAgICAgICBjb25zdCBvbGRWYWwgPSByb290LmdldFBsdWdpbkRhdGEoJ3NoYXJlRmlsZUlkJyk7XG4gICAgICAgIGlmIChvbGRWYWwpIHtcbiAgICAgICAgICAgIGNvbmZpZ1BhcmFtcy5maWxlSWQgPSBvbGRWYWw7XG4gICAgICAgICAgICByb290LnNldFBsdWdpbkRhdGEoJ3NoYXJlRmlsZUlkJywgJycpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICBpZiAoIWNvbmZpZ1BhcmFtcy5zY2FsaW5nKSB7XG4gICAgICAgIGNvbnN0IG9sZFZhbCA9IHJvb3QuZ2V0UGx1Z2luRGF0YSgndXJsUXVlcnlQYXJhbVNjYWxpbmcnKTtcbiAgICAgICAgaWYgKG9sZFZhbCkge1xuICAgICAgICAgICAgY29uZmlnUGFyYW1zLnNjYWxpbmcgPSBvbGRWYWw7XG4gICAgICAgICAgICByb290LnNldFBsdWdpbkRhdGEoJ3VybFF1ZXJ5UGFyYW1TY2FsaW5nJywgJycpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb25maWdQYXJhbXM7XG59XG5mdW5jdGlvbiBzYXZlUGx1Z2luQ29uZmlnKGNvbmZpZykge1xuICAgIHJvb3Quc2V0UGx1Z2luRGF0YSgnY29uZmlnLmZpbGVJZCcsIGNvbmZpZy5maWxlSWQpO1xuICAgIHJvb3Quc2V0UGx1Z2luRGF0YSgnY29uZmlnLnNjYWxpbmcnLCBjb25maWcuc2NhbGluZyB8fCAnJyk7XG4gICAgcm9vdC5zZXRQbHVnaW5EYXRhKCdjb25maWcuaGlkZVVJJywgU3RyaW5nKGNvbmZpZy5oaWRlVUkgfHwgMCkpO1xufVxuZnVuY3Rpb24gZmluZEl0ZW1zRm9yTGluaygpIHtcbiAgICBsZXQgbGlua0l0ZW1zID0gW107XG4gICAgaWYgKCFzZWxlY3RlZEl0ZW1zLmxlbmd0aCkge1xuICAgICAgICBsaW5rSXRlbXMucHVzaChmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdGVkSXRlbSBvZiBzZWxlY3RlZEl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRzID0gZ2V0UGFyZW50c0xpc3Qoc2VsZWN0ZWRJdGVtKTtcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBBcnJheS5mcm9tKHBhcmVudHMua2V5cygpKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBrZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwYXJlbnRzLmdldChpZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldl9pZCA9IGtleXNbaSAtIDFdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZfaXRlbSA9IHBhcmVudHMuZ2V0KHByZXZfaWQpO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnR5cGUgIT09ICdQQUdFJylcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZfaXRlbSAmJiBwcmV2X2l0ZW0udHlwZSA9PT0gJ0ZSQU1FJylcbiAgICAgICAgICAgICAgICAgICAgbGlua0l0ZW1zLnB1c2gocHJldl9pdGVtKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGxpbmtJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmlxdWVCeShsaW5rSXRlbXMuZmlsdGVyKChuKSA9PiBuKSwgJ2lkJyk7XG59XG5mdW5jdGlvbiBnZXRQYXJlbnRzTGlzdChub2RlKSB7XG4gICAgY29uc3QgbWFwID0gbmV3IE1hcCgpO1xuICAgIGlmICghbm9kZSlcbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICBsZXQgX3BhcmVudCA9IG5vZGU7XG4gICAgd2hpbGUgKF9wYXJlbnQpIHtcbiAgICAgICAgbWFwLnNldChfcGFyZW50LmlkLCBfcGFyZW50KTtcbiAgICAgICAgX3BhcmVudCA9IF9wYXJlbnQuaWQgPT09IHJvb3QuaWQgPyB1bmRlZmluZWQgOiBfcGFyZW50LnBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIG1hcDtcbn1cbmZ1bmN0aW9uIGNvbnZlcnROb2Rlc1RvSlNPTihub2Rlcykge1xuICAgIHJldHVybiBub2Rlcy5tYXAoKG5vZGUpID0+ICh7XG4gICAgICAgIGlkOiBub2RlLmlkLFxuICAgICAgICBuYW1lOiBub2RlLm5hbWUsXG4gICAgfSkpO1xufVxuZnVuY3Rpb24gdW5pcXVlQnkoYXJyLCBrZXkpIHtcbiAgICByZXR1cm4gWy4uLm5ldyBNYXAoYXJyLm1hcCgoaXRlbSkgPT4gW2l0ZW1ba2V5XSwgaXRlbV0pKS52YWx1ZXMoKV07XG59XG4iLCJleHBvcnQgdmFyIFBsdWdpbkFjdGlvbnM7XG4oZnVuY3Rpb24gKFBsdWdpbkFjdGlvbnMpIHtcbiAgICBQbHVnaW5BY3Rpb25zW1wiY29weVwiXSA9IFwiY29weVwiO1xuICAgIFBsdWdpbkFjdGlvbnNbXCJzZXR1cFwiXSA9IFwic2V0dXBcIjtcbiAgICBQbHVnaW5BY3Rpb25zW1wiYWJvdXRcIl0gPSBcImFib3V0XCI7XG59KShQbHVnaW5BY3Rpb25zIHx8IChQbHVnaW5BY3Rpb25zID0ge30pKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=