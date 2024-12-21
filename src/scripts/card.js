import { openModal, closeModal } from "./modal.js";
import { deleteCard as deleteCardFromServer } from "./api.js";
import { likeCard as likeCardFromAPI } from "./api.js";

// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// Функция создания карточки
// Функция создания карточки
export function createCard(
  cardData,
  deleteCallback,
  likeCallback,
  viewImageCallback,
  currentUserId
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountElement = cardElement.querySelector(".card__like-count");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCountElement.textContent = cardData.likes.length; // Устанавливаем количество лайков

  // Проверка, поставлен ли лайк текущим пользователем
  const isLiked = cardData.likes.some((user) => user._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Убираем кнопку удаления, если карточка не принадлежит текущему пользователю
  if (cardData.owner._id !== currentUserId) {
    deleteButton.style.display = "none"; // Скрываем кнопку удаления
  } else {
    deleteButton.addEventListener("click", () => {
      openDeletePopup(cardData._id, cardElement);
    });
  }

  // Обработчик клика по кнопке лайка
  likeButton.addEventListener("click", () => {
    // Вызов функции постановки или снятия лайка
    likeCallback(cardData._id, likeButton, likeCountElement);
  });

  // Обработчик клика по картинке для просмотра увеличенного изображения
  cardImage.addEventListener("click", () => {
    viewImageCallback(cardData);
  });

  return cardElement;
}

// Функция открытия попапа с подтверждением удаления
function openDeletePopup(cardId, cardElement) {
  const popupDelete = document.querySelector(".popup_type_delete");
  const buttonDelete = popupDelete.querySelector(".popup__button_type_delete");
  const closeButton = popupDelete.querySelector(".popup__close");

  openModal(popupDelete); // Открываем попап

  // Обработчик кнопки "Да"
  buttonDelete.addEventListener("click", () => {
    deleteCard(cardElement, cardId); // Удаляем карточку
    closeModal(popupDelete); // Закрываем попап
  });

  // Обработчик закрытия попапа (клик на крестик)
  closeButton.addEventListener("click", () => {
    closeModal(popupDelete); // Закрываем попап
  });

  // Обработчик закрытия попапа при нажатии на клавишу Escape
  document.addEventListener("keydown", function handleEscapeKey(evt) {
    if (evt.key === "Escape") {
      closeModal(popupDelete);
      document.removeEventListener("keydown", handleEscapeKey); // Убираем обработчик после закрытия
    }
  });

  // Обработчик закрытия попапа при клике вне попапа (overflow)
  popupDelete.addEventListener("click", (evt) => {
    if (evt.target === popupDelete) {
      closeModal(popupDelete);
    }
  });
}

// Функция удаления карточки
export function deleteCard(cardElement, cardId) {
  // Отправляем запрос на удаление карточки с сервера
  deleteCardFromServer(cardId)
    .then(() => {
      cardElement.remove(); // Удаляем карточку из DOM
    })
    .catch((err) => {
      console.error("Ошибка при удалении карточки:", err);
    });
}

// Функция постановки или снятия лайка
export function likeCard(cardId, likeButton, likeCountElement) {
  likeCardFromAPI(cardId, likeButton, likeCountElement);
}
