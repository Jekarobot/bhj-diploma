/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest;
    let { method, url, callback, data } = options;
    let formData;
    
    if (data) {
      if (method === 'GET') {
        url += '?' + new URLSearchParams(data).toString();
      } else {
          formData = new FormData();
          for (let key in data) {
              formData.append(key, data[key]);
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
    
    xhr.send(formData);
  };
  