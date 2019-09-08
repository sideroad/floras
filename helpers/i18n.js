import acceptLanguage from 'accept-language';

const resources = {};

// TODO: Still exists locales on client bundle.
//       Need to find a way to omit to locales on client to reduce bundle size.
if (process.env.NODE_ENV) {
  const supportedLanguages = ['en', 'ja'];
  supportedLanguages.forEach((lang) => {
    resources[lang] = require(`../locales/${lang}`).default;
  });
  acceptLanguage.languages(supportedLanguages);
}
export function get({ headers }) {
  if (typeof window !== 'undefined') {
    const { resource, lang } = window.__i18n;
    return {
      t: key => resource[key],
      resource,
      lang,
    };
  }
  if (headers) {
    const lang = acceptLanguage.get(headers['accept-language']);
    const resource = resources[lang] || resources.en;
    return {
      t: key => resource[key],
      resource,
      lang,
    };
  }
  throw new Error(
    'Unexpected condition. req is needed for SSR, otherwise window object should be exists',
  );
}
