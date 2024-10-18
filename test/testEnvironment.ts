import NodeEnvironment from 'jest-environment-node';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { MinIOContainer, StartedMinIOContainer } from './minioContainer';

class CustomEnvironment extends NodeEnvironment {
  protected postgresContainer: StartedPostgreSqlContainer;
  protected minioContainer: StartedMinIOContainer;

  async setup(): Promise<void> {
    await super.setup();

    this.postgresContainer = await new PostgreSqlContainer().start();
    this.global.postgresContainer = this.postgresContainer;
    this.minioContainer = await new MinIOContainer().start();
    this.global.minioContainer = this.minioContainer;
  }

  async teardown(): Promise<void> {
    await this.minioContainer.stop();
    await this.postgresContainer.stop();
    await super.teardown();
  }
}

export type TestEnvironmentGlobals = {
  postgresContainer: StartedPostgreSqlContainer;
  minioContainer: StartedMinIOContainer;
};

export default CustomEnvironment;
