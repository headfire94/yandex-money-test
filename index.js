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

const REPEAT_TIMER = 3000;

// ENUMS
const NOT_TEXT_ERROR = 'text is not string';
const resStatuses = {
    SUCCESS: 'success',
    ERROR: 'error',
    PROGRESS: 'progress'
};
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
            return countWords(value) === 3 && !/\d+/.test(value); //  имя из 3х слов и не содержат цифр
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
    /**
     *
     * @param {string} containerId - id контейнера результатов
     * @param {string} formId - id формы
     * @param {object} validationRules - правила валидации для полей формы
     * @param {string[]} fields - название полей
     */
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
        this.submitBtn = this.form.elements.submitButton;
        this.url = this.form.action;

        this.handleSubmit();
        this.handleFieldChange();
        this.submit = this.submit.bind(this);
    }

    handleFieldChange() {
        this.fields.forEach(field => this.form.elements[field].addEventListener('input', e => {
            e.target.classList.remove('_error');
            this.cleanContainer();
        }))
    }

    handleSubmit() {
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

    /**
     * возвращает объект с данными формы, где имена свойств совпадают с именами инпутов.
     * @returns {{}}
     */
    getData() {
        const data = {};
        this.fields.forEach(field => data[field] = this.form.elements[field].value);
        return data;
    }

    submit(e) {
        e && e.preventDefault();
        const data = this.getData();
        const validationResult = this.validate(data);
        if (validationResult.isValid) {
            this.submitBtn.disabled = true;
            this.cleanContainer();
            let xhr = new XMLHttpRequest();
            xhr.open('GET', this.url, true);
            xhr.send();
            xhr.onreadystatechange = () => this.handleResponse(xhr)
        } else {
            validationResult.errorFields.forEach(key => this.form.elements[key].classList.add('_error'));
        }
    }

    cleanContainer() {
        Object.keys(resStatuses).forEach(status => this.container.classList.remove(status));
        this.container.childNodes.forEach(child => this.container.removeChild(child));
    }

    handleResponse(xhr) {
        if (xhr.readyState !== 4) return;
        if (xhr.status !== 200) throw new MyError('request fail');
        const response = JSON.parse(xhr.responseText);
        switch (response.status) {
            case resStatuses.SUCCESS:
                this.submitBtn.disabled = false;
                this.container.textContent = 'Success';
                this.container.classList.add(resStatuses.SUCCESS);
                break;
            case resStatuses.ERROR:
                this.submitBtn.disabled = false;
                this.container.textContent = response.reason;
                this.container.classList.add(resStatuses.ERROR);
                break;
            case resStatuses.PROGRESS:
                this.container.classList.add(resStatuses.PROGRESS);
                this.container.textContent = 'in progress';
                setTimeout(this.submit, REPEAT_TIMER)
        }
    }

    /**
     * Принимает объект с данными формы (ключ - имя инпута) и устанавливает их инпутам формы.
     * @param data
     */
    setData(data) {
        this.fields.forEach(field => this.form.elements[field].value = data[field] || null);
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