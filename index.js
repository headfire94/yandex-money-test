class MyError extends Error {
}

// ENUMS
const NOT_TEXT_ERROR = 'text is not string';

// Simple email regexp
const EMAIL_REGEX = /^[a-zA-Z0-9_\.\+-]+@(ya\.ru|(yandex\.(ru|ua|by|kz|com)))/;
const TEL_REGEX = /^\+7\([0-9]{3}\)[0-9]{3}-([0-9]{2})-([0-9]{2})$/;
/**
 * count words in text
 * exclude first and last white-space and multiply white-space between words
 * @param text
 * @returns {Number}
 */
const countWords = text => {
    if (typeof text !== 'string') throw new MyError(NOT_TEXT_ERROR);
    return text.trim().split(/\s+/).length;
}

const counteSumOfStringNumbers = str => {
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
            return counteSumOfStringNumbers(value) < 30 && TEL_REGEX.test(value)
        }
    }
};

class Form {
    constructor({containerId, formId, validationRules}) {
        this.validationRules = validationRules;
        this.form = document.getElementById(formId);
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new MyError('there is no container in DOM')
        }
        if (!this.form) {
            throw new MyError('there is no form in DOM')
        }
        this.fields = this.form.elements;
        if (!this.fields) {
            throw new MyError('there are no filds in DOM')
        }

        this.form.addEventListener("submit", this.submit.bind(this));
    }

    validate() {
        let isValid = true;
        const errorFields = [];
        if (!this.validationRules) return {isValid, errorFields};

        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            const fieldName = field.name;
            const value = field.value;
            const rule = this.validationRules[fieldName];
            if (rule && ((rule.required && !value) || !rule.test(value))) {
                errorFields.push(fieldName);
                isValid = false;
            }
        }
        return {
            isValid,
            errorFields
        }
    }

    submit(e) {
        e.preventDefault();
        const valid = this.validate();
        console.log(valid);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.MyForm = new Form({
        containerId: 'resultContainer',
        formId: 'myForm',
        validationRules
    });
});


