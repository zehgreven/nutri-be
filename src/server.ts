import { Server } from '@overnightjs/core';
import * as database from '@src/database';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Application } from 'express';
import expressPino from 'express-pino-logger';
import { ClientControllerV1 } from './controllers/client.v1';
import { FunctionalityTypeControllerV1 } from './controllers/functionality-type.v1';
import { FunctionalityControllerV1 } from './controllers/functionality.v1';
import { ProfileControllerV1 } from './controllers/profile.v1';
import { UserControllerV1 } from './controllers/user.v1';
import logger from './logger';
import { apiERrorValidator } from './middlewares/api-error-validator';
import { UserRepository } from './repositories/user.repository';
import { FunctionalityTypeRepository } from './repositories/functionality-type.repository';
import { FunctionalityRepository } from './repositories/functionality.repository';
import { UserPermissionRepository } from './repositories/user-permission.repository';
import { ProfileRepository } from './repositories/profile.repository';
import { ProfilePermissionRepository } from './repositories/profile-permission.repository';
import { ProfilePermissionControllerV1 } from './controllers/profile-permission.v1';
import { UserPermissionControllerV1 } from './controllers/user-permission.v1';

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
    const userControllerV1 = new UserControllerV1(new UserRepository());
    const functionalityTypeControllerV1 = new FunctionalityTypeControllerV1(
      new FunctionalityTypeRepository(),
    );
    const functionalityControllerV1 = new FunctionalityControllerV1(
      new FunctionalityRepository(),
    );
    const profilePermissionControllerV1 = new ProfilePermissionControllerV1(
      new ProfilePermissionRepository(),
    );
    const userPermissionControllerV1 = new UserPermissionControllerV1(
      new UserPermissionRepository(),
    );
    const profileControllerV1 = new ProfileControllerV1(
      new ProfileRepository(),
    );
    const clientControllerV1 = new ClientControllerV1(
      new UserRepository(),
      new ProfileRepository(),
    );

    this.addControllers([
      userControllerV1,
      functionalityTypeControllerV1,
      functionalityControllerV1,
      profilePermissionControllerV1,
      userPermissionControllerV1,
      profileControllerV1,
      clientControllerV1,
    ]);
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
