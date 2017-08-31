import MyError, { NO_CONTAINER, NO_FORM, NO_FIELDS, NO_URL, NO_SUBMIT_BTN } from './utils/errors';
import { resStatuses } from './enums';

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
    this.submitBtn = this.form.elements.submitButton;
    this.url = this.form.action;

    this.handleSetupErrors();
    this.submit = this.submit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit();
    this.handleFieldChange();
  }

  handleSetupErrors() {
    if (!this.container) {
      throw new MyError(NO_CONTAINER);
    }
    if (!this.form) {
      throw new MyError(NO_FORM);
    }
    if (!this.fields) {
      throw new MyError(NO_FIELDS);
    }
    if (!this.submitBtn) {
      throw new MyError(NO_SUBMIT_BTN);
    }
    if (!this.url) {
      throw new MyError(NO_URL);
    }
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
        setTimeout(this.submit, REPEAT_TIMER);
        break;
      default:
        break;
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

export default Form;
