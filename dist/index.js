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
    // const fileId: string = root.getPluginData('shareFileId')
    const fileId = figma.fileKey;
    if (!fileId && action === 'copy')
        action = 'setup';
    switch (action) {
        case 'setup': {
            figma.showUI(__html__, {
                width: 282,
                height: 255
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
        // if (msg.type === 'save-file-id') {
        //   root.setPluginData('shareFileId', msg.fileId)
        //   return
        // }
        if (msg.type === 'links-copied') {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLGtDQUFrQyxtREFBbUQsR0FBRyxjQUFjO0FBQ3RHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixrQ0FBa0Msa0RBQWtELEdBQUcsY0FBYztBQUNyRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLGFBQWE7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFFBQVE7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImNvbnN0IGN1cnJlbnRQYWdlID0gZmlnbWEuY3VycmVudFBhZ2U7XG5jb25zdCBzZWxlY3RlZEl0ZW1zID0gY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuY29uc3Qgcm9vdCA9IGZpZ21hLnJvb3Q7XG5tYWluKCk7XG5mdW5jdGlvbiBtYWluKCkge1xuICAgIHN3aXRjaCAoZmlnbWEuY29tbWFuZCkge1xuICAgICAgICBjYXNlICdjb3B5UHJvdG90eXBlTGluayc6IHtcbiAgICAgICAgICAgIHJldHVybiBvcGVuV2luZG93KCdjb3B5Jyk7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICByZXR1cm4gb3BlbldpbmRvdygnc2V0dXAnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmaWdtYS5jbG9zZVBsdWdpbignRVJST1I6IFVua25vd24gY29tbWFuZCcpO1xufVxuZnVuY3Rpb24gb3BlbldpbmRvdyhhY3Rpb24pIHtcbiAgICBjb25zdCBub2RlcyA9IGNvbnZlcnROb2Rlc1RvSlNPTihmaW5kSXRlbXNGb3JMaW5rKCkpO1xuICAgIGlmICghbm9kZXMgfHwgIW5vZGVzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmlnbWEuY2xvc2VQbHVnaW4oJ0VSUk9SOiBDb3VsZCBub3QgZ2V0IHRoZSBsaW5rIGl0ZW0nKTtcbiAgICB9XG4gICAgLy8gY29uc3QgZmlsZUlkOiBzdHJpbmcgPSByb290LmdldFBsdWdpbkRhdGEoJ3NoYXJlRmlsZUlkJylcbiAgICBjb25zdCBmaWxlSWQgPSBmaWdtYS5maWxlS2V5O1xuICAgIGlmICghZmlsZUlkICYmIGFjdGlvbiA9PT0gJ2NvcHknKVxuICAgICAgICBhY3Rpb24gPSAnc2V0dXAnO1xuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgIGNhc2UgJ3NldHVwJzoge1xuICAgICAgICAgICAgZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDI4MixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDI1NVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IGFjdDogJ3NldHVwJywgbm9kZXMsIGZpbGVJZCwgZmlsZU5hbWU6IHJvb3QubmFtZSB9LCB7IG9yaWdpbjogJyonIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnY29weSc6IHtcbiAgICAgICAgICAgIGZpZ21hLnNob3dVSShfX2h0bWxfXywge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IGFjdDogJ2NvcHknLCBub2RlcywgZmlsZUlkLCBmaWxlTmFtZTogcm9vdC5uYW1lIH0sIHsgb3JpZ2luOiAnKicgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBmaWdtYS51aS5vbm1lc3NhZ2UgPSAobXNnKSA9PiB7XG4gICAgICAgIGlmIChtc2cudHlwZSA9PT0gJ2NhbmNlbCcpIHtcbiAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgKG1zZy50eXBlID09PSAnc2F2ZS1maWxlLWlkJykge1xuICAgICAgICAvLyAgIHJvb3Quc2V0UGx1Z2luRGF0YSgnc2hhcmVGaWxlSWQnLCBtc2cuZmlsZUlkKVxuICAgICAgICAvLyAgIHJldHVyblxuICAgICAgICAvLyB9XG4gICAgICAgIGlmIChtc2cudHlwZSA9PT0gJ2xpbmtzLWNvcGllZCcpIHtcbiAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKG5vZGVzLmxlbmd0aCA+IDFcbiAgICAgICAgICAgICAgICA/IGBQcm90b3R5cGUgbGlua3MgKCR7bm9kZXMubGVuZ3RofSkgY29waWVkIHRvIGNsaXBib2FyZGBcbiAgICAgICAgICAgICAgICA6ICdQcm90b3R5cGUgbGluayBjb3BpZWQgdG8gY2xpcGJvYXJkJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gZmluZEl0ZW1zRm9yTGluaygpIHtcbiAgICBsZXQgbGlua0l0ZW1zID0gW107XG4gICAgaWYgKCFzZWxlY3RlZEl0ZW1zLmxlbmd0aCkge1xuICAgICAgICBsaW5rSXRlbXMucHVzaChmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdGVkSXRlbSBvZiBzZWxlY3RlZEl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRzID0gZ2V0UGFyZW50c0xpc3Qoc2VsZWN0ZWRJdGVtKTtcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBBcnJheS5mcm9tKHBhcmVudHMua2V5cygpKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBrZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwYXJlbnRzLmdldChpZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldl9pZCA9IGtleXNbaSAtIDFdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZfaXRlbSA9IHBhcmVudHMuZ2V0KHByZXZfaWQpO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnR5cGUgIT09ICdQQUdFJylcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZfaXRlbSAmJiBwcmV2X2l0ZW0udHlwZSA9PT0gJ0ZSQU1FJylcbiAgICAgICAgICAgICAgICAgICAgbGlua0l0ZW1zLnB1c2gocHJldl9pdGVtKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGxpbmtJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmlxdWVCeShsaW5rSXRlbXMuZmlsdGVyKG4gPT4gbiksICdpZCcpO1xufVxuZnVuY3Rpb24gZ2V0UGFyZW50c0xpc3Qobm9kZSkge1xuICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcbiAgICBpZiAoIW5vZGUpXG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgbGV0IF9wYXJlbnQgPSBub2RlO1xuICAgIHdoaWxlIChfcGFyZW50KSB7XG4gICAgICAgIG1hcC5zZXQoX3BhcmVudC5pZCwgX3BhcmVudCk7XG4gICAgICAgIF9wYXJlbnQgPSBfcGFyZW50LmlkID09PSByb290LmlkID8gdW5kZWZpbmVkIDogX3BhcmVudC5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBtYXA7XG59XG5mdW5jdGlvbiBjb252ZXJ0Tm9kZXNUb0pTT04obm9kZXMpIHtcbiAgICByZXR1cm4gbm9kZXMubWFwKG5vZGUgPT4gKHtcbiAgICAgICAgaWQ6IG5vZGUuaWQsXG4gICAgICAgIG5hbWU6IG5vZGUubmFtZVxuICAgIH0pKTtcbn1cbmZ1bmN0aW9uIHVuaXF1ZUJ5KGFyciwga2V5KSB7XG4gICAgcmV0dXJuIFsuLi5uZXcgTWFwKGFyci5tYXAoaXRlbSA9PiBbaXRlbVtrZXldLCBpdGVtXSkpLnZhbHVlcygpXTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=