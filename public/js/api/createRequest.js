/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest;
    const method = options.method || 'GET';
    let url = options.url || '';
    const callback = options.callback || function (err, response) {
      if (err) {
          console.log(err);
      } else {
          console.log(response);
      }
    }
  
    let data = null;
  
    if (options.data) {
      if (method === 'GET') {
        url += '?' + new URLSearchParams(options.data).toString();
      } else {
          data = new FormData();
          for (let key in options.data) {
              data.append(key, options.data[key]);
          }
      }
    }
  
    xhr.open(method, url, true);
    xhr.responseType = 'json';
  
    xhr.onload = function () {
          callback(null, xhr.response);
    };
  
    xhr.onerror = function () {
      callback(new Error('Network Error'), null);
    };
    
    xhr.send(data);
  };
  