import "./pages/index.css";
import { initialCards } from "./scripts/cards.js";
import {
  createCard,
  deleteCard,
  likeCard,
  handleViewImage,
} from "./scripts/card.js";
import { openModal, closeModal } from "./scripts/modal.js";

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
    openModal(popupEdit);
  });

  addButton.addEventListener("click", () => openModal(popupNewCard));
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

// @todo: Запуск приложения
initializeApp();
attachEventListeners();
