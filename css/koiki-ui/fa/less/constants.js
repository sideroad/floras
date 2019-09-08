export const PROPS = {
  ID: 'i',
  ACTION: 'a',
  DATA: 'd',
  POSTED: 'p',
  TIME: 't',
  MESSAGE: 'm',
  GROUP: 'g',
  SERVICE: 's',
  ONLINE_MEMBERS: 'on',
  OFFLINE_MEMBERS: 'off',
  HISTORY: 'h'
}

export const ACTION_ID = {
  ONLINE_MEMBER_UPDATES: 1, // Notify from host to user to update members join / left
  SEND: 2, // Notify from user to host and vice versa.
  FETCH_HISTORY: 3 // Notify from host to user to retrive past message
}

export const ID_ACTION = Object.keys(ACTION_ID).reduce(
  (acc, id) => ({ ...acc, [ACTION_ID[id]]: id }),
  {}
)
