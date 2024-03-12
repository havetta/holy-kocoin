//TODO /////////////////////////////////////////////////////////
//TODO   Local Storage Mock  ///////////////////////////////////
//TODO /////////////////////////////////////////////////////////

export function localStorageMock() {
  let storage = {};

  return {
    setItem: function(key, value) {
      storage[key] = value || '';
    },
    getItem: function(key) {
      return key in storage ? storage[key] : null;
    },
    removeItem: function(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function(i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}

//TODO /////////////////////////////////////////////////////////
//TODO   GLOBAL WINDOW MOCK  ///////////////////////////////////
//TODO /////////////////////////////////////////////////////////

export function globalWindowMock() {
  // import domino from 'domino';
  // const winObj = domino.createWindow();
  // global['window'] = winObj;
  // global['document'] = winObj.document;
  // global['location'] = winObj.location;

  global['window'] = {};
  global['document'] = {};
  global['location'] = {};
  global['sessionStorage'] = {
    getItem: (item) => item,
    setItem: (item, value) => value,
  };

  window.history = { state: '' };
  window.addEventListener = (event, handler) => {};
  window.navigator = {};
  window.navigator.maxTouchPoints = 0;
  window.navigator.userAgent = 'ssr';
  window.location = {};
  window.location.search = '';
  window.location.hash = '';
  window.location.replace = (url) => url;
  location.host = '';

  // mock the sessionStorage and localStorage
  window.localStorage = {
    getItem: (item) => item,
    setItem: (item, value) => value,
  };
  window.sessionStorage = {
    getItem: (item) => item,
    setItem: (item, value) => value,
  };
}

//TODO /////////////////////////////////////////////////////////
//TODO   ...  //////////////////////////////////////////////////
//TODO /////////////////////////////////////////////////////////
