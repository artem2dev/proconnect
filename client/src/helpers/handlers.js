export const handleSuccess = (response, callback) => {
  if (callback) callback(response.data);
};

export const handleError = (error, callback) => {
  if (callback) {
    callback(error?.response?.data);
  } else {
    console.error(error);
  }
};
