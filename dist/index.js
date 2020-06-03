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
/*! no static exports found */
/***/ (function(module, exports) {

const currentPage = figma.currentPage;
const selectedItems = currentPage.selection;
const root = figma.root;
main();
function main() {
    switch (figma.command) {
        case 'copyPrototypeLink': {
            return openWindow('copy');
        }
        case 'settings': {
            return openWindow('setup');
        }
    }
    figma.closePlugin('ERROR: Unknown command');
}
function openWindow(action) {
    const nodes = convertNodesToJSON(findItemsForLink());
    if (!nodes || !nodes.length) {
        return figma.closePlugin('ERROR: Could not get the link item');
    }
    const fileId = root.getPluginData('shareFileId');
    if (!fileId && action === 'copy')
        action = 'setup';
    switch (action) {
        case 'setup': {
            figma.showUI(__html__, {
                width: 350,
                height: 310
            });
            figma.ui.postMessage({ act: 'setup', nodes, fileId, fileName: root.name }, { origin: '*' });
            break;
        }
        case 'copy': {
            figma.showUI(__html__, {
                width: 0,
                height: 0
            });
            figma.ui.postMessage({ act: 'copy', nodes, fileId, fileName: root.name }, { origin: '*' });
            break;
        }
    }
    figma.ui.onmessage = (msg) => {
        if (msg.type === 'cancel') {
            figma.closePlugin();
            return;
        }
        if (msg.type === 'save-file-id') {
            root.setPluginData('shareFileId', msg.fileId);
            return;
        }
        if (msg.type === 'link-copied') {
            figma.closePlugin(nodes.length > 1
                ? `Prototype links (${nodes.length}) copied to clipboard`
                : 'Prototype link copied to clipboard');
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixrQ0FBa0MsbURBQW1ELEdBQUcsY0FBYztBQUN0RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2Isa0NBQWtDLGtEQUFrRCxHQUFHLGNBQWM7QUFDckc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxhQUFhO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxRQUFRO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJjb25zdCBjdXJyZW50UGFnZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IGN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbmNvbnN0IHJvb3QgPSBmaWdtYS5yb290O1xubWFpbigpO1xuZnVuY3Rpb24gbWFpbigpIHtcbiAgICBzd2l0Y2ggKGZpZ21hLmNvbW1hbmQpIHtcbiAgICAgICAgY2FzZSAnY29weVByb3RvdHlwZUxpbmsnOiB7XG4gICAgICAgICAgICByZXR1cm4gb3BlbldpbmRvdygnY29weScpO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ3NldHRpbmdzJzoge1xuICAgICAgICAgICAgcmV0dXJuIG9wZW5XaW5kb3coJ3NldHVwJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oJ0VSUk9SOiBVbmtub3duIGNvbW1hbmQnKTtcbn1cbmZ1bmN0aW9uIG9wZW5XaW5kb3coYWN0aW9uKSB7XG4gICAgY29uc3Qgbm9kZXMgPSBjb252ZXJ0Tm9kZXNUb0pTT04oZmluZEl0ZW1zRm9yTGluaygpKTtcbiAgICBpZiAoIW5vZGVzIHx8ICFub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZpZ21hLmNsb3NlUGx1Z2luKCdFUlJPUjogQ291bGQgbm90IGdldCB0aGUgbGluayBpdGVtJyk7XG4gICAgfVxuICAgIGNvbnN0IGZpbGVJZCA9IHJvb3QuZ2V0UGx1Z2luRGF0YSgnc2hhcmVGaWxlSWQnKTtcbiAgICBpZiAoIWZpbGVJZCAmJiBhY3Rpb24gPT09ICdjb3B5JylcbiAgICAgICAgYWN0aW9uID0gJ3NldHVwJztcbiAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICBjYXNlICdzZXR1cCc6IHtcbiAgICAgICAgICAgIGZpZ21hLnNob3dVSShfX2h0bWxfXywge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAzNTAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMTBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBhY3Q6ICdzZXR1cCcsIG5vZGVzLCBmaWxlSWQsIGZpbGVOYW1lOiByb290Lm5hbWUgfSwgeyBvcmlnaW46ICcqJyB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2NvcHknOiB7XG4gICAgICAgICAgICBmaWdtYS5zaG93VUkoX19odG1sX18sIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBhY3Q6ICdjb3B5Jywgbm9kZXMsIGZpbGVJZCwgZmlsZU5hbWU6IHJvb3QubmFtZSB9LCB7IG9yaWdpbjogJyonIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4ge1xuICAgICAgICBpZiAobXNnLnR5cGUgPT09ICdjYW5jZWwnKSB7XG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtc2cudHlwZSA9PT0gJ3NhdmUtZmlsZS1pZCcpIHtcbiAgICAgICAgICAgIHJvb3Quc2V0UGx1Z2luRGF0YSgnc2hhcmVGaWxlSWQnLCBtc2cuZmlsZUlkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobXNnLnR5cGUgPT09ICdsaW5rLWNvcGllZCcpIHtcbiAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKG5vZGVzLmxlbmd0aCA+IDFcbiAgICAgICAgICAgICAgICA/IGBQcm90b3R5cGUgbGlua3MgKCR7bm9kZXMubGVuZ3RofSkgY29waWVkIHRvIGNsaXBib2FyZGBcbiAgICAgICAgICAgICAgICA6ICdQcm90b3R5cGUgbGluayBjb3BpZWQgdG8gY2xpcGJvYXJkJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gZmluZEl0ZW1zRm9yTGluaygpIHtcbiAgICBsZXQgbGlua0l0ZW1zID0gW107XG4gICAgaWYgKCFzZWxlY3RlZEl0ZW1zLmxlbmd0aCkge1xuICAgICAgICBsaW5rSXRlbXMucHVzaChmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdGVkSXRlbSBvZiBzZWxlY3RlZEl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRzID0gZ2V0UGFyZW50c0xpc3Qoc2VsZWN0ZWRJdGVtKTtcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBBcnJheS5mcm9tKHBhcmVudHMua2V5cygpKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBrZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwYXJlbnRzLmdldChpZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldl9pZCA9IGtleXNbaSAtIDFdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZfaXRlbSA9IHBhcmVudHMuZ2V0KHByZXZfaWQpO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnR5cGUgIT09ICdQQUdFJylcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZfaXRlbSAmJiBwcmV2X2l0ZW0udHlwZSA9PT0gJ0ZSQU1FJylcbiAgICAgICAgICAgICAgICAgICAgbGlua0l0ZW1zLnB1c2gocHJldl9pdGVtKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGxpbmtJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmlxdWVCeShsaW5rSXRlbXMuZmlsdGVyKG4gPT4gbiksICdpZCcpO1xufVxuZnVuY3Rpb24gZ2V0UGFyZW50c0xpc3Qobm9kZSkge1xuICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcbiAgICBpZiAoIW5vZGUpXG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgbGV0IF9wYXJlbnQgPSBub2RlO1xuICAgIHdoaWxlIChfcGFyZW50KSB7XG4gICAgICAgIG1hcC5zZXQoX3BhcmVudC5pZCwgX3BhcmVudCk7XG4gICAgICAgIF9wYXJlbnQgPSBfcGFyZW50LmlkID09PSByb290LmlkID8gdW5kZWZpbmVkIDogX3BhcmVudC5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBtYXA7XG59XG5mdW5jdGlvbiBjb252ZXJ0Tm9kZXNUb0pTT04obm9kZXMpIHtcbiAgICByZXR1cm4gbm9kZXMubWFwKG5vZGUgPT4gKHtcbiAgICAgICAgaWQ6IG5vZGUuaWQsXG4gICAgICAgIG5hbWU6IG5vZGUubmFtZVxuICAgIH0pKTtcbn1cbmZ1bmN0aW9uIHVuaXF1ZUJ5KGFyciwga2V5KSB7XG4gICAgcmV0dXJuIFsuLi5uZXcgTWFwKGFyci5tYXAoaXRlbSA9PiBbaXRlbVtrZXldLCBpdGVtXSkpLnZhbHVlcygpXTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=