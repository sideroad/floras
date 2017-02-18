
// eslint-disable-next-line
export function get(url, cookie) {
  return fetch(`${url}`, {
    credentials: 'include',
    headers: {
      cookie: `connect.sid=${cookie.get('connect.sid')}`
    }
  })
    .then(
      (res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise((resolve, reject) =>
          reject('User does not logged in yet')
        );
      }
    );
}
