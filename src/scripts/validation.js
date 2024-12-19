// Функция включения валидации
const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => evt.preventDefault());
    setEventListeners(formElement, config);
  });
};

// Функция показа ошибки
const showInputError = (formElement, inputElement, config, errorMessage) => {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`); // Используем name, а не id
  if (errorElement) {
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.style.visibility = "visible"; // Показываем ошибку
    errorElement.classList.add(config.errorClass);
  }
};

// Функция скрытия ошибки
const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`); // Используем name, а не id
  if (errorElement) {
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.textContent = "";
    errorElement.style.visibility = "hidden"; // Скрываем ошибку
    errorElement.classList.remove(config.errorClass);
  }
};

// Проверка поля на валидность
const checkInputValidity = (formElement, inputElement, config) => {
  const pattern = inputElement.pattern
    ? new RegExp(inputElement.pattern)
    : null;

  // Проверка для поля "Ссылка на картинку" на валидность URL
  if (inputElement.type === "url" && inputElement.validity.typeMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  }
  // Проверка для поля "Название" с регулярным выражением
  else if (pattern && !pattern.test(inputElement.value)) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity(""); // Сброс ошибки, если поле валидно
  }

  // Стандартные ошибки браузера для пустого поля
  if (inputElement.validity.valueMissing) {
    inputElement.setCustomValidity("Заполните это поле");
  }

  // Если поле не валидно, показываем ошибку
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      config,
      inputElement.validationMessage
    );
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

// Установка слушателей для полей формы
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

// Проверка наличия недействительных полей
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

// Переключение состояния кнопки отправки
const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
};

// Очистка ошибок валидации (значения полей не сбрасываются)
const clearValidation = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
    inputElement.setCustomValidity("");
  });

  buttonElement.classList.add(config.inactiveButtonClass);
  buttonElement.disabled = true;
};

// Экспорт функций
export { enableValidation, clearValidation };
