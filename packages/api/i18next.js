const i18next = require('i18next');
const i18backend = require('i18next-fs-backend');
const i18middleware = require('i18next-http-middleware');

i18next.use(i18backend).use(i18middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      // Load the language file that correspond to the request accept header.
      loadPath: './languages/{{lng}}.json'
    }
  });

module.exports = i18next;