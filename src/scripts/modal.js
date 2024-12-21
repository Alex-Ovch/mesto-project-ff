// Открытие попапа
export function openModal(modal) {
  modal.style.visibility = "visible"; // Сделать попап видимым

  modal.classList.add("popup_is-animated"); // Добавить анимацию

  setTimeout(() => {
    modal.classList.add("popup_is-opened"); // Открыть попап с анимацией
  }, 10);

  document.addEventListener("keydown", handleEscapeKey); // Слушатель для клавиши Esc
  modal.addEventListener("click", handleOverlayClick); // Слушатель для клика по оверлею
}

// Закрытие попапа
export function closeModal(modal) {
  modal.classList.remove("popup_is-opened"); // Удалить открытый попап

  setTimeout(() => {
    modal.style.visibility = "hidden"; // Сделать попап невидимым
    modal.classList.remove("popup_is-animated"); // Удалить анимацию
  }, 600); // Время задержки перед скрытием

  document.removeEventListener("keydown", handleEscapeKey); // Удалить обработчик клавиши Esc
  modal.removeEventListener("click", handleOverlayClick); // Удалить обработчик клика
}

// Закрытие попапа при нажатии на оверлей
function handleOverlayClick(evt) {
  if (evt.target.classList.contains("popup")) {
    // Проверка на клик по попапу
    closeModal(evt.target);
  }
}

// Закрытие попапа при нажатии на клавишу Esc
function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Открытие попапа аватара
export function openAvatarPopup() {
  const avatarPopup = document.querySelector(".popup_type_avatar");
  openModal(avatarPopup);
}

// Закрытие попапа аватара
export function closeAvatarPopup() {
  const avatarPopup = document.querySelector(".popup_type_avatar");
  closeModal(avatarPopup);
}
