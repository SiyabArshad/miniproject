class ResponseManager {
  static successResponse(data, message = 'Request successful') {
    return {
      success: true,
      message,
      data,
    };
  }

  static errorResponse(message = 'Internal server error', errorCode = 500, errorData = {}) {
    return {
      success: false,
      message,
      errorCode,
      errorData,
    };
  }
}

module.exports=ResponseManager