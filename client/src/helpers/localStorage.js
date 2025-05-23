export const setItem = (key, value) => {
  localStorage.setItem(key, value);
};

export const getItem = (key) => {
  return localStorage.getItem(key);
};

export const removeItem = (key) => {
  return localStorage.removeItem(key);
};
