export const handleSuccess = (response, callback) => {
  if (callback) callback(response.data.data);
};

export const handleError = (error, callback) => {
  if (callback) {
    callback(error);
  } else {
    console.error(error);
  }
};
