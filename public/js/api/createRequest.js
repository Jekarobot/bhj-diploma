/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest;
    const method = options.method || 'GET';
    const url = options.url || '';
    const callback = function (err, response) {
      if (err) {
          console.log(err);
      } else {
          console.log(response);
      }
    }
  
    let data = null;
  
    if (options.data) {
      if (method === 'GET') {
          data = JSON.stringify(options.data);
      } else {
          data = new FormData();
          for (let key in options.data) {
              data.append(key, options.data[key]);
          }
      }
    }
  
    xhr.open(method, url, true);
    xhr.responseType = 'json';
  
    if (method === 'GET') {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }  
  
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
          callback(null, xhr.response);
      } else {
          callback(new Error(xhr.statusText), null);
      }
    };
  
    xhr.onerror = function () {
      callback(new Error('Network Error'), null);
    };
  
  
  
    xhr.send(data);
  };
  