import React from 'react';

export const Context = React.createContext({
  fetcher: undefined,
  i18n: undefined
});

export const { Provider, Consumer } = Context;
