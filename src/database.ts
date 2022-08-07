import config, { IConfig } from 'config';
import { connect as mongooseConnect, connection } from 'mongoose';

const dbConfig: IConfig = config.get('database');

export const connect = async (): Promise<void> => {
  const url = dbConfig.get('url');
  const port = dbConfig.get('port');
  const database = dbConfig.get('database');

  await mongooseConnect(`mongodb://${url}:${port}/${database}`);
};

export const close = (): Promise<void> => connection.close();
