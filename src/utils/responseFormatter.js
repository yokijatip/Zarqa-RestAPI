export const formatResponse = (
  data = null,
  message = null,
  statusCode = 200
) => {
  const response = {
    statusCode,
    status: statusCode >= 200 && statusCode < 300 ? "success" : "error",
  };

  if (data) response.data = data;
  if (message) response.message = message;

  return response;
};

export const formatErrorResponse = (error, statusCode = 500) => {
  return {
    statusCode,
    status: "error",
    message: error.message || "Internal server error",
  };
};
