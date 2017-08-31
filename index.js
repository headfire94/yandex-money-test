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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class MyError extends Error {
  constructor(m) {
    super(m);
    Object.setPrototypeOf(this, MyError.prototype);
  }
}

const NOT_TEXT_ERROR = 'text is not string';
/* harmony export (immutable) */ __webpack_exports__["a"] = NOT_TEXT_ERROR;


/* harmony default export */ __webpack_exports__["b"] = (MyError);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Form__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_index__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_regexp__ = __webpack_require__(5);




const validationRules = {
  fio: {
    required: true,
    test: value =>
      Object(__WEBPACK_IMPORTED_MODULE_1__utils_index__["b" /* countWords */])(value) === 3 && !/\d+/.test(value), //  имя из 3х слов и не содержат цифр

  },
  email: {
    required: true,
    test: value => __WEBPACK_IMPORTED_MODULE_2__utils_regexp__["a" /* EMAIL_REGEX */].test(value),
  },
  phone: {
    required: true,
    test: value => Object(__WEBPACK_IMPORTED_MODULE_1__utils_index__["a" /* countSumOfStringNumbers */])(value) < 30 && __WEBPACK_IMPORTED_MODULE_2__utils_regexp__["b" /* TEL_REGEX */].test(value),
  },
};


document.addEventListener('DOMContentLoaded', () => {
  window.MyForm = new __WEBPACK_IMPORTED_MODULE_0__Form__["a" /* default */]({
    containerId: 'resultContainer',
    formId: 'myForm',
    validationSettings: validationRules,
    fields: ['fio', 'email', 'phone'],
  });
});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_errors__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__enums__ = __webpack_require__(3);



const REPEAT_TIMER = 3000;
class Form {
  /**
   *
   * @param {string} containerId - id контейнера результатов
   * @param {string} formId - id формы
   * @param {object} validationSettings - правила валидации для полей формы
   * @param {string[]} fields - название полей
   */
  constructor({ containerId, formId, validationSettings, fields }) {
    this.fields = fields;
    this.validationRules = validationSettings;
    this.form = document.getElementById(formId);
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new __WEBPACK_IMPORTED_MODULE_0__utils_errors__["b" /* default */]('there is no container in DOM');
    }
    if (!this.form) {
      throw new __WEBPACK_IMPORTED_MODULE_0__utils_errors__["b" /* default */]('there is no form in DOM');
    }
    if (!this.fields) {
      throw new __WEBPACK_IMPORTED_MODULE_0__utils_errors__["b" /* default */]('fields not presented');
    }
    this.submitBtn = this.form.elements.submitButton;
    this.url = this.form.action;

    this.handleSubmit();
    this.handleFieldChange();
    this.submit = this.submit.bind(this);
  }

  handleFieldChange() {
    this.fields.forEach(field => this.form.elements[field].addEventListener('input', (e) => {
      e.target.classList.remove('_error');
      this.cleanContainer();
    }));
  }

  handleSubmit() {
    this.form.addEventListener('submit', this.submit);
  }

  validate(data) {
    let isValid = true;
    const errorFields = [];
    if (!this.validationRules || !Object.keys(this.validationRules).length) {
      return { isValid, errorFields };
    }

    Object.keys(this.validationRules).forEach((fieldName) => {
      const rule = this.validationRules[fieldName];
      if ((rule.required && !data[fieldName]) || !rule.test(data[fieldName])) {
        errorFields.push(fieldName);
        isValid = false;
      }
    });

    return {
      isValid,
      errorFields,
    };
  }

  /**
   * возвращает объект с данными формы, где имена свойств совпадают с именами инпутов.
   * @returns {{}}
   */
  getData() {
    const data = {};
    this.fields.forEach((field) => {
      data[field] = this.form.elements[field].value;
    });
    return data;
  }

  submit(e) {
    if (e) e.preventDefault();
    const data = this.getData();
    const validationResult = this.validate(data);
    if (validationResult.isValid) {
      this.submitBtn.disabled = true;
      this.cleanContainer();
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.url, true);
      xhr.send();
      xhr.onreadystatechange = () => this.handleResponse(xhr);
    } else {
      validationResult.errorFields.forEach(key => this.form.elements[key].classList.add('_error'));
    }
  }

  cleanContainer() {
    Object.keys(__WEBPACK_IMPORTED_MODULE_1__enums__["a" /* resStatuses */]).forEach(status => this.container.classList.remove(status));
    this.container.childNodes.forEach(child => this.container.removeChild(child));
  }

  handleResponse(xhr) {
    if (xhr.readyState !== 4) return;
    if (xhr.status !== 200) throw new __WEBPACK_IMPORTED_MODULE_0__utils_errors__["b" /* default */]('request fail');
    const response = JSON.parse(xhr.responseText);
    switch (response.status) {
      case __WEBPACK_IMPORTED_MODULE_1__enums__["a" /* resStatuses */].SUCCESS:
        this.submitBtn.disabled = false;
        this.container.textContent = 'Success';
        this.container.classList.add(__WEBPACK_IMPORTED_MODULE_1__enums__["a" /* resStatuses */].SUCCESS);
        break;
      case __WEBPACK_IMPORTED_MODULE_1__enums__["a" /* resStatuses */].ERROR:
        this.submitBtn.disabled = false;
        this.container.textContent = response.reason;
        this.container.classList.add(__WEBPACK_IMPORTED_MODULE_1__enums__["a" /* resStatuses */].ERROR);
        break;
      case __WEBPACK_IMPORTED_MODULE_1__enums__["a" /* resStatuses */].PROGRESS:
        this.container.classList.add(__WEBPACK_IMPORTED_MODULE_1__enums__["a" /* resStatuses */].PROGRESS);
        this.container.textContent = 'in progress';
        setTimeout(this.submit, REPEAT_TIMER);
        break;
      default: break;
    }
  }

  /**
   * Принимает объект с данными формы (ключ - имя инпута) и устанавливает их инпутам формы.
   * @param data
   */
  setData(data) {
    this.fields.forEach((field) => {
      this.form.elements[field].value = data[field] || null;
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Form);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const resStatuses = {
  SUCCESS: 'success',
  ERROR: 'error',
  PROGRESS: 'progress',
};
/* harmony export (immutable) */ __webpack_exports__["a"] = resStatuses;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__errors__ = __webpack_require__(0);


/**
 * count words in text
 * exclude first and last white-space and multiply white-space between words
 * @param {string} text
 * @returns {Number}
 */
const countWords = (text) => {
  if (typeof text !== 'string') throw new __WEBPACK_IMPORTED_MODULE_0__errors__["b" /* default */](__WEBPACK_IMPORTED_MODULE_0__errors__["a" /* NOT_TEXT_ERROR */]);
  const trimmedText = text.trim();
  if (!trimmedText) return 0;
  return trimmedText.split(/\s+/).length;
};
/* harmony export (immutable) */ __webpack_exports__["b"] = countWords;


/**
 * Count sum of numbers in text string
 * @param {string} str
 * @returns {number}
 */
const countSumOfStringNumbers = (str) => {
  if (typeof str !== 'string') throw new __WEBPACK_IMPORTED_MODULE_0__errors__["b" /* default */](__WEBPACK_IMPORTED_MODULE_0__errors__["a" /* NOT_TEXT_ERROR */]);
  return str.split('').reduce((prev, next) => {
    const number = parseInt(next, 10);
    if (Number.isInteger(number)) {
      return prev + number;
    }
    return prev;
  }, 0);
};
/* harmony export (immutable) */ __webpack_exports__["a"] = countSumOfStringNumbers;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const EMAIL_REGEX = /^[a-zA-Z0-9_\.\+-]+@(ya\.ru|(yandex\.(ru|ua|by|kz|com)))/;
/* harmony export (immutable) */ __webpack_exports__["a"] = EMAIL_REGEX;

const TEL_REGEX = /^\+7\([0-9]{3}\)[0-9]{3}-([0-9]{2})-([0-9]{2})$/;
/* harmony export (immutable) */ __webpack_exports__["b"] = TEL_REGEX;


/***/ })
/******/ ]);