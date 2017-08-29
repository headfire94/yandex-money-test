class MyError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

// ENUMS
const NOT_TEXT_ERROR = 'text is not string';

// Simple email regexp
const EMAIL_REGEX = /^[a-zA-Z0-9_\.\+-]+@(ya\.ru|(yandex\.(ru|ua|by|kz|com)))/;
const TEL_REGEX = /^\+7\([0-9]{3}\)[0-9]{3}-([0-9]{2})-([0-9]{2})$/;
/**
 * count words in text
 * exclude first and last white-space and multiply white-space between words
 * @param {string} text
 * @returns {Number}
 */
const countWords = text => {
    if (typeof text !== 'string') throw new MyError(NOT_TEXT_ERROR);
    const trimmedText = text.trim();
    if (!trimmedText) return 0;
    return trimmedText.split(/\s+/).length;
};

/**
 * Count sum of numbers in text string
 * @param {string} str
 * @returns {number}
 */
const countSumOfStringNumbers = str => {
    if (typeof str !== 'string') throw new MyError(NOT_TEXT_ERROR);
    return str.split('').reduce((prev, next) => {
        const number = parseInt(next);
        if (Number.isInteger(number)) {
            return prev + number;
        }
        return prev;

    }, 0);
};

const validationRules = {
    fio: {
        required: true,
        test: (value) => {
            return countWords(value) === 3;
        }
    },
    email: {
        required: true,
        test: value => EMAIL_REGEX.test(value)
    },
    phone: {
        required: true,
        test: value => {
            return countSumOfStringNumbers(value) < 30 && TEL_REGEX.test(value)
        }
    }
};

class Form {
    constructor({containerId, formId, validationRules, fields}) {
        this.fields = fields;
        this.validationRules = validationRules;
        this.form = document.getElementById(formId);
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new MyError('there is no container in DOM')
        }
        if (!this.form) {
            throw new MyError('there is no form in DOM')
        }
        if (!this.fields) {
            throw new MyError('fields not presented')
        }

        this.form.addEventListener("submit", this.submit.bind(this));
    }

    validate(data) {
        let isValid = true;
        const errorFields = [];
        if (!this.validationRules) return {isValid, errorFields};

        for (let fieldName in this.validationRules) {
            const rule = this.validationRules[fieldName];
            if ((rule.required && !data[fieldName]) || !rule.test(data[fieldName])) {
                errorFields.push(fieldName);
                isValid = false;
            }
        }
        return {
            isValid,
            errorFields
        }
    }

    getData() {
        const data = {};
        this.fields.forEach(field => data[field] = this.form.elements[field].value);
        return data;
    }

    submit(e) {
        e.preventDefault();
        const data = this.getData();
        const valid = this.validate(data);
        console.log(valid);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.MyForm = new Form({
        containerId: 'resultContainer',
        formId: 'myForm',
        validationRules,
        fields: ["fio", "email", "phone"]
    });
});

if (typeof module !== 'undefined') {
    module.exports = {
        EMAIL_REGEX,
        TEL_REGEX,
        countSumOfStringNumbers,
        countWords
    };
}