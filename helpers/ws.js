export default function wsFn({ url, onmessage = () => {}, onconnect = () => {} }) {
  const WebSocket = window.WebSocket || window.MozWebsocket;
  if (!WebSocket) {
    console.log('WebSocket is not defined');
    return null;
  }
  const ws = new WebSocket(url);
  const listener = {
    onmessage,
    close: () => ws.close(),
  };

  let interval;

  ws.onopen = () => {
    console.log('connected!');
    onconnect();
    ws.onmessage = (msg) => {
      const json = JSON.parse(msg.data);
      listener.onmessage(json);
    };
    interval = setInterval(() => {
      ws.send('KEEPALIVE');
    }, 5000);
  };

  ws.onclose = (...args) => {
    console.log(args);
    clearInterval(interval);
  };
  return listener;
}
