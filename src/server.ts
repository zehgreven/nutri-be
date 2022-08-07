import { Server } from '@overnightjs/core';
import * as database from '@src/database';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Application } from 'express';
import expressPino from 'express-pino-logger';
import { UserControllerV1 } from './controllers/user.v1';
import logger from './logger';
import { apiERrorValidator } from './middlewares/api-error-validator';
import { UserMongoDBRepository } from './repositories/userMongoDBRepository';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupDocumentation();
    this.setupControllers();
    await this.setupDatabase();
    this.setupErrorHandlers();
  }

  public getApp(): Application {
    return this.app;
  }

  private setupExpress(): void {
    this.getApp().use(bodyParser.json());
    this.getApp().use(
      expressPino({
        logger,
      }),
    );
    this.getApp().use(
      cors({
        origin: '*',
      }),
    );
  }

  private setupErrorHandlers(): void {
    this.getApp().use(apiERrorValidator);
  }

  private setupControllers(): void {
    const userControllerV1 = new UserControllerV1(new UserMongoDBRepository());

    this.addControllers([userControllerV1]);
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }

  public close(): Promise<void> {
    return database.close();
  }

  public start(): void {
    this.getApp().listen(this.port, () => {
      logger.info(`Server listening on port: ${this.port}`);
    });
  }

  private async setupDocumentation(): Promise<void> {
    // this.getApp().use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema));
    // this.getApp().use(
    //   OpenApiValidator.middleware({
    //     apiSpec: apiSchema as OpenAPIV3.Document,
    //     validateRequests: true,
    //     validateResponses: true,
    //   }),
    // );
  }
}
