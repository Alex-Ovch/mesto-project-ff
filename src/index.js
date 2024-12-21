import "./pages/index.css";
import { initialCards } from "./scripts/cards.js";
import { createCard, deleteCard, likeCard } from "./scripts/card.js";
import {
  openModal,
  closeModal,
  openAvatarPopup,
  closeAvatarPopup,
} from "./scripts/modal.js";
import { enableValidation, clearValidation } from "./scripts/validation.js"; // Импорт валидации
import {
  getUserInfo,
  getCards,
  updateUserInfo,
  addNewCard,
  updateAvatar,
} from "./scripts/api.js";

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

/// @todo: Сохранение данных профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  // Получаем элементы формы
  const name = inputName.value;
  const about = inputDescription.value;

  // Находим кнопку сохранения
  const saveButton = document.querySelector("#save-button");

  // Изменяем текст кнопки и блокируем её
  saveButton.textContent = "Сохранение...";
  saveButton.disabled = true;

  // Отправляем запрос на сервер для обновления данных
  updateUserInfo(name, about)
    .then((data) => {
      // Обновляем элементы на странице данными пользователя
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      document.querySelector(
        ".profile__image"
      ).style.backgroundImage = `url(${data.avatar})`;

      // Закрываем попап
      closeModal(popupEdit);

      // Восстанавливаем исходное состояние кнопки
      saveButton.textContent = "Сохранить";
      saveButton.disabled = false;
    })
    .catch((error) => {
      console.error("Ошибка при обновлении профиля:", error);

      // Восстанавливаем исходное состояние кнопки в случае ошибки
      saveButton.textContent = "Сохранить";
      saveButton.disabled = false;
    });
}

// @todo: Добавление новой карточки
function handleNewCardFormSubmit(evt) {
  evt.preventDefault();

  const name = placeNameInput.value;
  const link = placeLinkInput.value;

  // Найти кнопку "Сохранить" в текущей форме
  const saveButton = evt.submitter; // Получает кнопку, вызвавшую событие
  saveButton.textContent = "Сохранение...";
  saveButton.disabled = true;

  addNewCard(name, link) // Отправляем запрос на сервер
    .then((data) => {
      // Создаем элемент карточки на основе данных, полученных от сервера
      const newCardElement = createCard(
        data,
        deleteCard,
        likeCard,
        handleViewImage
      );
      // Добавляем карточку в начало списка
      cardsContainer.prepend(newCardElement);

      // Закрываем попап и очищаем форму
      closeModal(popupNewCard);
      formNewCard.reset();
    })
    .catch((error) => {
      console.error("Ошибка при добавлении новой карточки:", error);
    })
    .finally(() => {
      // Восстанавливаем состояние кнопки независимо от результата
      saveButton.textContent = "Сохранить";
      saveButton.disabled = false;
    });
}

// @todo: Подключение обработчиков
function attachEventListeners() {
  formEditProfile.addEventListener("submit", handleProfileFormSubmit);
  formNewCard.addEventListener("submit", handleNewCardFormSubmit); // Обработчик добавления новой карточки
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

Promise.all([getUserInfo(), getCards()])
  .then(([userData, cardsData]) => {
    const currentUserId = userData._id; // Получаем текущий пользовательский ID

    // Обновляем информацию о пользователе на странице
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    document.querySelector(
      ".profile__image"
    ).style.backgroundImage = `url(${userData.avatar})`;

    // Инициализация карточек с сервера
    cardsData.forEach((cardData) => {
      const cardElement = createCard(
        cardData,
        deleteCard,
        likeCard,
        handleViewImage,
        currentUserId // Передаем ID текущего пользователя
      );
      cardsContainer.appendChild(cardElement);
    });
  })
  .catch((error) => {
    console.error("Произошла ошибка при получении данных:", error);
  });

attachEventListeners();
enableValidation(validationConfig); // Включаем валидацию форм

const avatarWrapper = document.querySelector(".profile__image-wrapper");
const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarForm = avatarPopup.querySelector(".popup__form_avatar");
const avatarInput = avatarForm.querySelector('input[name="avatar"]');
const profileImage = document.querySelector(".profile__image");

// Открытие попапа при клике на иконку
avatarWrapper.addEventListener("click", () => {
  openModal(avatarPopup);
});

// Обработка отправки формы смены аватара
avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const avatarUrl = avatarInput.value;

  // Найти кнопку "Сохранить" в текущей форме
  const saveButton = evt.submitter; // Получает кнопку, вызвавшую событие
  saveButton.textContent = "Сохранение...";
  saveButton.disabled = true;

  updateAvatar(avatarUrl)
    .then((data) => {
      profileImage.style.backgroundImage = `url(${data.avatar})`; // Обновляем аватар на странице
      closeModal(avatarPopup); // Закрываем модалку
      avatarForm.reset(); // Очищаем форму
    })
    .catch((err) => {
      console.error("Ошибка при обновлении аватара:", err);
    })
    .finally(() => {
      // Восстанавливаем состояние кнопки независимо от результата
      saveButton.textContent = "Сохранить";
      saveButton.disabled = false;
    });
});
