import NodeEnvironment from 'jest-environment-node';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

class CustomEnvironment extends NodeEnvironment {
  protected postgresContainer: StartedPostgreSqlContainer;

  async setup(): Promise<void> {
    await super.setup();

    this.postgresContainer = await new PostgreSqlContainer().start();

    this.global.postgresContainer = this.postgresContainer;
  }

  async teardown(): Promise<void> {
    await this.postgresContainer.stop();
    await super.teardown();
  }
}

export type TestEnvironmentGlobals = {
  postgresContainer: StartedPostgreSqlContainer;
};

export default CustomEnvironment;
