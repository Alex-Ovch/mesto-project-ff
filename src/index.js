import "./pages/index.css";
import { initialCards } from "./scripts/cards.js";
import { createCard, deleteCard, likeCard } from "./scripts/card.js";
import { openModal, closeModal } from "./scripts/modal.js";
import { enableValidation, clearValidation } from "./scripts/validation.js"; // Импорт валидации
import { getUserInfo, getCards } from "./scripts/api.js";

// @todo: DOM узлы
const cardsContainer = document.querySelector(".places__list");
const popupEdit = document.querySelector(".popup_type_edit");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");

const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const inputName = popupEdit.querySelector(".popup__input_type_name");
const inputDescription = popupEdit.querySelector(
  ".popup__input_type_description"
);

const formEditProfile = document.forms["edit-profile"];
const formNewCard = document.forms["new-place"];
const placeNameInput = formNewCard.elements["place-name"];
const placeLinkInput = formNewCard.elements["link"];

// @todo: Конфигурация валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// @todo: Инициализация карточек на странице
function initializeApp() {
  initialCards.forEach((cardData) => {
    const cardElement = createCard(
      cardData,
      deleteCard,
      likeCard,
      handleViewImage
    );
    cardsContainer.appendChild(cardElement);
  });
}

// @todo: Обработчики попапов
function addOpenModalListeners() {
  const editButton = document.querySelector(".profile__edit-button");
  const addButton = document.querySelector(".profile__add-button");

  editButton.addEventListener("click", () => {
    // Перед открытием попапа заполняем поля формы значениями профиля
    inputName.value = profileName.textContent;
    inputDescription.value = profileDescription.textContent;

    // Очищаем ошибки валидации формы профиля
    clearValidation(formEditProfile, validationConfig);

    openModal(popupEdit);
  });

  addButton.addEventListener("click", () => {
    // Очищаем ошибки валидации и сбрасываем форму добавления карточки
    formNewCard.reset();
    clearValidation(formNewCard, validationConfig);

    openModal(popupNewCard);
  });
}

function addCloseModalListeners() {
  const closeButtons = document.querySelectorAll(".popup__close");
  closeButtons.forEach((button) => {
    const popup = button.closest(".popup");
    button.addEventListener("click", () => closeModal(popup));
  });
}

// @todo: Сохранение данных профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  closeModal(popupEdit);
}

// @todo: Добавление новой карточки
function handleNewCardFormSubmit(evt) {
  evt.preventDefault();

  const newCardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value,
  };

  const newCardElement = createCard(
    newCardData,
    deleteCard,
    likeCard,
    handleViewImage
  );
  cardsContainer.prepend(newCardElement);

  closeModal(popupNewCard);
  formNewCard.reset();
}

// @todo: Подключение обработчиков
function attachEventListeners() {
  formEditProfile.addEventListener("submit", handleProfileFormSubmit);
  formNewCard.addEventListener("submit", handleNewCardFormSubmit);
  addOpenModalListeners();
  addCloseModalListeners();
}

function handleViewImage(cardData) {
  const popupImage = document.querySelector(".popup_type_image");
  const popupImageElement = popupImage.querySelector(".popup__image");
  const popupCaption = popupImage.querySelector(".popup__caption");

  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaption.textContent = cardData.name;

  openModal(popupImage);
}

// @todo: Запуск приложения
initializeApp();
attachEventListeners();
enableValidation(validationConfig); // Включаем валидацию форм

// DOM-элементы, в которых нужно отобразить данные
const profileNameElement = document.querySelector(".profile__title");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const profileAvatarElement = document.querySelector(".profile__image");

// Получаем данные о пользователе с сервера
getUserInfo()
  .then((data) => {
    // Обновляем элементы на странице данными пользователя
    profileNameElement.textContent = data.name;
    profileDescriptionElement.textContent = data.about;
    profileAvatarElement.style.backgroundImage = `url(${data.avatar})`;

    console.log("Информация о пользователе:", data); // Для отладки, выводим данные в консоль
  })
  .catch((error) => {
    console.error("Произошла ошибка при получении данных:", error);
  });
