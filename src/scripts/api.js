const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/wff-cohort-28",
  headers: {
    authorization: "b4a9d6ad-e1ac-4ea2-9eca-c321fa660d63",
    "Content-Type": "application/json",
  },
};

// Функция для получения информации о пользователе
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return response.json().then((err) => {
      throw new Error(`Ошибка: ${response.status}, сообщение: ${err.message}`);
    });
  });
};
