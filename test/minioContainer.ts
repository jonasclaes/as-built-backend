import * as Minio from 'minio';
import {
  GenericContainer,
  Wait,
  StartedTestContainer,
  AbstractStartedContainer,
} from 'testcontainers';
const MINIO_PORT = 9000;
export class MinIOContainer extends GenericContainer {
  username = 'minioadmin';
  password = 'minioadmin';
  bucketName = 'miniobucket';
  constructor(image: string = 'minio/minio') {
    super(image);
    this.withExposedPorts(MINIO_PORT)
      .withHealthCheck({
        test: ['CMD', 'curl', '-f', 'http://127.0.0.1:9000/minio/health/live'],
        interval: 10_000,
        timeout: 30_000,
        retries: 5,
      })
      .withWaitStrategy(Wait.forHealthCheck())
      .withStartupTimeout(120_000)
      .withCommand(['minio', 'server', '/data']);
  }
  withUsername(username: string): this {
    this.username = username;
    return this;
  }
  withPassword(password: string): this {
    this.password = password;
    return this;
  }
  withBucketName(bucketName: string): this {
    this.bucketName = bucketName;
    return this;
  }
  protected async containerStarted(
    container: StartedTestContainer,
  ): Promise<void> {
    const minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: container.getMappedPort(MINIO_PORT),
      useSSL: false,
      accessKey: this.username,
      secretKey: this.password,
    });
    await minioClient.makeBucket(this.bucketName);
  }
  async start(): Promise<StartedMinIOContainer> {
    this.withEnvironment({
      MINIO_ROOT_USER: this.username,
      MINIO_ROOT_PASSWORD: this.password,
    });
    return new StartedMinIOContainer(
      await super.start(),
      this.username,
      this.password,
      this.bucketName,
    );
  }
}
export class StartedMinIOContainer extends AbstractStartedContainer {
  username: string;
  password: string;
  bucketName: string;
  port: number;
  constructor(
    startedTestContainer: StartedTestContainer,
    username: string,
    password: string,
    bucketName: string,
  ) {
    super(startedTestContainer);
    this.username = username;
    this.password = password;
    this.bucketName = bucketName;
    this.port = startedTestContainer.getMappedPort(MINIO_PORT);
  }
  getPort(): number {
    return this.port;
  }
  getRootUser(): string {
    return this.username;
  }
  getRootPassword(): string {
    return this.password;
  }
  getConnectionUri(): string {
    return `minio://${this.username}:${this.password}@localhost:${this.getPort()}/${this.bucketName}?region=eu-west-1`;
  }
}
