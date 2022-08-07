import pino from 'pino';
import config from 'config';

export default pino({
  enabled: config.get('logger.enabled'),
  level: config.get('logger.level'),
  timestamp: () => {
    return `,"time":"${new Date(Date.now()).toLocaleTimeString([], {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}"`;
  },
});
