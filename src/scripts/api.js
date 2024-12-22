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
  const response = await fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  });
  return handleResponseError(response);
};

// Функция для получения карточек с сервера
export const getCards = async () => {
  const response = await fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  });
  return handleResponseError(response);
};

// Функция для редактирования профиля
export const updateUserInfo = async (name, about) => {
  const response = await fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ name, about }),
  });
  return handleResponseError(response);
};

// Функция для добавления новой карточки
export const addNewCard = async (name, link) => {
  const response = await fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({ name, link }),
  });
  return handleResponseError(response);
};

// Функция для удаления карточки с сервера
export const deleteCard = async (cardId) => {
  const response = await fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  });
  return handleResponseError(response);
};

// Функция для постановки лайка
export const likeCard = async (cardId, isLiked) => {
  const method = isLiked ? "DELETE" : "PUT";

  const response = await fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method,
    headers: config.headers,
  });

  return await handleResponseError(response);
};

// Функция для обновления аватара
export const updateAvatar = async (avatarUrl) => {
  const response = await fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarUrl }),
  });
  return handleResponseError(response);
};
