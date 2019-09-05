export function normalize(url) {
  let protocol = (url.match(/(http|https)\:\/\//) || [])[1];
  if (/\:443$/.test(url)) {
    protocol = protocol || 'https';
  } else {
    protocol = 'http';
  }
  return `${protocol}://${url.replace(/(\:80|\:443)$/, '')}`;
}
export function stringify(_uri, params) {
  let uri = _uri;
  Object.keys(params).forEach(
    key => (uri = uri.replace(`\[${key}\]`, encodeURIComponent(params[key])))
  );
  if (/\:/.test(uri)) {
    throw new Error(`Required params are still in remained [${uri}]`);
  }
  return uri;
}

export default {
  stringify,
  normalize,
};
