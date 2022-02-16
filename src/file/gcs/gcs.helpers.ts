import { Bucket, Storage, StorageOptions } from '@google-cloud/storage';

export const getStorageInstance = (config: StorageOptions): Storage =>
  new Storage(config);

export const getBucketFromStorage = (
  storageInstance: Storage,
  bucketName: string,
): Bucket => {
  return storageInstance.bucket(bucketName);
};
