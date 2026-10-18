export function notFound(request, response) {
  response.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${request.method} ${request.originalUrl}`
    }
  });
}

export function errorHandler(error, _request, response, _next) {
  console.error(error);

  response.status(error.statusCode ?? 500).json({
    success: false,
    error: {
      code: error.code ?? 'INTERNAL_SERVER_ERROR',
      message: error.statusCode ? error.message : 'An unexpected server error occurred.'
    }
  });
}
