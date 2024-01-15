import { config } from './app.config';

const { MINIO_PORT, MINIO_HOST, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD } = config;

export const MinioConfig = {
  endPoint: MINIO_HOST,
  port: MINIO_PORT,
  accessKey: MINIO_ROOT_USER,
  secretKey: MINIO_ROOT_PASSWORD,
  isGlobal: true,
  useSSL: false,
};

export default MinioConfig;
