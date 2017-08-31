import Form from './Form';
import { countWords, countSumOfStringNumbers } from './utils/index';
import { EMAIL_REGEX, TEL_REGEX } from './utils/regexp';

const WORDS_COUNT = 3;

const validationRules = {
  fio: {
    required: true,
    test: value =>
      countWords(value) === WORDS_COUNT && !/\d+/.test(value), //  имя из 3х слов и не содержат цифр

  },
  email: {
    required: true,
    test: value => EMAIL_REGEX.test(value),
  },
  phone: {
    required: true,
    test: value => countSumOfStringNumbers(value) < 30 && TEL_REGEX.test(value),
  },
};


document.addEventListener('DOMContentLoaded', () => {
  window.MyForm = new Form({
    containerId: 'resultContainer',
    formId: 'myForm',
    validationSettings: validationRules,
    fields: ['fio', 'email', 'phone'],
  });
});
