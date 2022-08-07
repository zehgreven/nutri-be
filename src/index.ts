import './util/module-alias';
import config from 'config';
import { SetupServer } from './server';
import logger from './logger';

enum ExitStatus {
  FAILURE = 1,
  SUCCESS = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`,
  );
  throw reason;
});

process.on('uncaughtException', (reason, promise) => {
  logger.error(
    `App exiting due to an uncaught exception: ${promise} and reason: ${reason}`,
  );
  process.exit(ExitStatus.FAILURE);
});

(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get('port'));
    await server.init();
    server.start();

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

    exitSignals.map(signal =>
      process.on(signal, async () => {
        try {
          await server.close();
          logger.info('App exited with success');
          process.exit(ExitStatus.SUCCESS);
        } catch (error) {
          logger.error(`App exited with error: ${error}`);
          process.exit(ExitStatus.FAILURE);
        }
      }),
    );
  } catch (error) {
    logger.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.FAILURE);
  }
})();
