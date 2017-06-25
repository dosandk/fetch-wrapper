function send(url, options = {}, type = 'json') {
  const requestOptions = {
    headers: new Headers(Object.assign({}, options.headers)),
    body: options.body || null,
    method: options.method || 'GET'
  };
  const request = new Request(url, requestOptions);

  // TODO: add logger
  console.log('Fetching::', url, options);

  return fetch(request)
    .then(response => handleResponse(response, type));
}

/* Response handler */
function handleResponse(response, type) {
  if (response.ok) {
    return response[type]();
  }

  return handleError(response);
}

/* Status handler */
const statusHandler = {
  validate(response) {
    const {status} = response;

    if (this[status]) {
      return this[status](response);
    }

    return 'Server can\'t process your request';
  },
  /* Status handlers */
  '401': () => {
    return 'You are not authorized';
  },
  '404': () => {
    return 'Resource not found';
  }
};

/* Error handler */
function handleError(response) {
  const {status} = response;
  const message = statusHandler.validate(response);

  return Promise.reject({
    message,
    status
  });
}
