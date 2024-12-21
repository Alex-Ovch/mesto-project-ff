const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/wff-cohort-28",
  headers: {
    authorization: "b4a9d6ad-e1ac-4ea2-9eca-c321fa660d63",
    "Content-Type": "application/json",
  },
};

// Универсальная функция для обработки ошибок
const handleResponseError = async (response) => {
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Ошибка: ${response.status}, сообщение: ${err.message}`);
  }
  return await response.json();
};

// Функция для получения информации о пользователе
export const getUserInfo = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/users/me`, {
      headers: config.headers,
    });
    return await handleResponseError(response);
  } catch (error) {
    console.error("Ошибка при получении информации о пользователе:", error);
  }
};

// Функция для получения карточек с сервера
export const getCards = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/cards`, {
      headers: config.headers,
    });
    return await handleResponseError(response);
  } catch (error) {
    console.error("Ошибка при получении карточек:", error);
  }
};

// Функция для редактирования профиля
export const updateUserInfo = async (name, about) => {
  try {
    const response = await fetch(`${config.baseUrl}/users/me`, {
      method: "PATCH",
      headers: config.headers,
      body: JSON.stringify({
        name,
        about,
      }),
    });
    return await handleResponseError(response);
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
  }
};

// Функция для добавления новой карточки
export const addNewCard = async (name, link) => {
  try {
    const response = await fetch(`${config.baseUrl}/cards`, {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify({
        name,
        link,
      }),
    });
    return await handleResponseError(response);
  } catch (error) {
    console.error("Ошибка при добавлении карточки:", error);
  }
};

// Функция для удаления карточки с сервера
export const deleteCard = async (cardId) => {
  try {
    const response = await fetch(`${config.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: config.headers,
    });
    return await handleResponseError(response);
  } catch (error) {
    console.error("Ошибка при удалении карточки:", error);
  }
};

// Функция для постановки лайка
export const likeCard = async (cardId, likeButton, likeCountElement) => {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  const method = isLiked ? "DELETE" : "PUT";

  try {
    const response = await fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method,
      headers: config.headers,
    });

    const data = await handleResponseError(response);

    likeButton.classList.toggle("card__like-button_is-active");
    likeCountElement.textContent = data.likes.length;
  } catch (error) {
    console.error("Ошибка при обработке лайка:", error);
  }
};

// Функция для обновления аватара
export const updateAvatar = async (avatarUrl) => {
  try {
    const response = await fetch(`${config.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: config.headers,
      body: JSON.stringify({ avatar: avatarUrl }),
    });

    return await handleResponseError(response);
  } catch (error) {
    console.error("Ошибка при обновлении аватара:", error);
  }
};
