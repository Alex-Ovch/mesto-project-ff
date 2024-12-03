import { openModal } from "./modal.js";

// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: Функция создания карточки
export function createCard(
  cardData,
  deleteCallback,
  likeCallback,
  viewImageCallback
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => {
    deleteCallback(cardElement);
  });

  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.addEventListener("click", () => {
    likeCallback(cardElement);
  });

  cardImage.addEventListener("click", () => {
    viewImageCallback(cardData);
  });

  return cardElement;
}

// @todo: Функция удаления карточки
export function deleteCard(cardElement) {
  cardElement.remove();
}

// @todo: Функция лайка карточки
export function likeCard(cardElement) {
  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.classList.toggle("card__like-button_is-active");
}

export function handleViewImage(cardData) {
  const popupImage = document.querySelector(".popup_type_image");
  const popupImageElement = popupImage.querySelector(".popup__image");
  const popupCaption = popupImage.querySelector(".popup__caption");

  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaption.textContent = cardData.name;

  openModal(popupImage);
}
