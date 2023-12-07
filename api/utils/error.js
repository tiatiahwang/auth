export const errorHandler = (name, statusCode, message) => {
  const error = new Error();
  error.name = name;
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
