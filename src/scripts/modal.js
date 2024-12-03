// Функция открытия модального окна
export function openModal(modal) {
  modal.style.visibility = "visible";

  modal.classList.add("popup_is-animated");

  setTimeout(() => {
    modal.classList.add("popup_is-opened");
  }, 10);

  document.addEventListener("keydown", handleEscapeKey);

  modal.addEventListener("click", handleOverlayClick);
}

// Функция закрытия модального окна
export function closeModal(modal) {
  modal.classList.remove("popup_is-opened");

  setTimeout(() => {
    modal.style.visibility = "hidden";
  }, 600);
  document.removeEventListener("keydown", handleEscapeKey);
  modal.removeEventListener("click", handleOverlayClick);
}

// Функция для закрытия попапа при нажатии на оверлей
function handleOverlayClick(evt) {
  if (evt.target.classList.contains("popup_is-opened")) {
    closeModal(evt.target);
  }
}

// Функция для закрытия попапа при нажатии на клавишу Esc
function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}
