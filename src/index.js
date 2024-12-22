import "./pages/index.css";
import { initialCards } from "./scripts/cards.js";
import { createCard, deleteCard } from "./scripts/card.js";
import {
  openModal,
  closeModal,
  openAvatarPopup,
  closeAvatarPopup,
} from "./scripts/modal.js";
import { enableValidation, clearValidation } from "./scripts/validation.js";
import {
  getUserInfo,
  getCards,
  updateUserInfo,
  addNewCard,
  updateAvatar,
  likeCard,
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
    inputName.value = profileName.textContent;
    inputDescription.value = profileDescription.textContent;
    clearValidation(formEditProfile, validationConfig);
    openModal(popupEdit);
  });

  addButton.addEventListener("click", () => {
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

// @todo: Обработка лайков
function handleLikeButtonClick(cardId, likeButton, likeCountElement) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  likeCard(cardId, isLiked)
    .then((data) => {
      likeButton.classList.toggle("card__like-button_is-active");
      likeCountElement.textContent = data.likes.length;
    })
    .catch((error) => {
      console.error("Ошибка при обновлении лайка:", error);
    });
}

/// @todo: Сохранение данных профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const name = inputName.value;
  const about = inputDescription.value;

  const saveButton = evt.submitter;
  saveButton.textContent = "Сохранение...";
  saveButton.disabled = true;

  updateUserInfo(name, about)
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(popupEdit);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении профиля:", error);
    })
    .finally(() => {
      saveButton.textContent = "Сохранить";
      saveButton.disabled = false;
    });
}

// @todo: Добавление новой карточки
function handleNewCardFormSubmit(evt) {
  evt.preventDefault();
  const name = placeNameInput.value;
  const link = placeLinkInput.value;

  const saveButton = evt.submitter;
  saveButton.textContent = "Сохранение...";
  saveButton.disabled = true;

  addNewCard(name, link)
    .then((data) => {
      const newCardElement = createCard(
        data,
        deleteCard,
        handleLikeButtonClick,
        handleViewImage,
        data.owner._id // Передаем owner._id как 5-й параметр
      );
      cardsContainer.prepend(newCardElement);
      closeModal(popupNewCard);
      formNewCard.reset();
    })
    .catch((error) => {
      console.error("Ошибка при добавлении новой карточки:", error);
    })
    .finally(() => {
      saveButton.textContent = "Сохранить";
      saveButton.disabled = false;
    });
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

Promise.all([getUserInfo(), getCards()])
  .then(([userData, cardsData]) => {
    const currentUserId = userData._id;

    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    document.querySelector(
      ".profile__image"
    ).style.backgroundImage = `url(${userData.avatar})`;

    cardsData.forEach((cardData) => {
      const cardElement = createCard(
        cardData,
        deleteCard,
        handleLikeButtonClick,
        handleViewImage,
        currentUserId // Передаем currentUserId как 5-й параметр
      );
      cardsContainer.appendChild(cardElement);
    });
  })
  .catch((error) => {
    console.error(
      "Ошибка при получении данных пользователя или карточек:",
      error
    );
  });

attachEventListeners();
enableValidation(validationConfig);

const avatarWrapper = document.querySelector(".profile__image-wrapper");
const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarForm = avatarPopup.querySelector(".popup__form_avatar");
const avatarInput = avatarForm.querySelector('input[name="avatar"]');
const profileImage = document.querySelector(".profile__image");

avatarWrapper.addEventListener("click", () => {
  openModal(avatarPopup);
});

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const avatarUrl = avatarInput.value;

  const saveButton = evt.submitter;
  saveButton.textContent = "Сохранение...";
  saveButton.disabled = true;

  updateAvatar(avatarUrl)
    .then((data) => {
      profileImage.style.backgroundImage = `url(${data.avatar})`;
      closeModal(avatarPopup);
      avatarForm.reset();
    })
    .catch((err) => {
      console.error("Ошибка при обновлении аватара:", err);
    })
    .finally(() => {
      saveButton.textContent = "Сохранить";
      saveButton.disabled = false;
    });
});
