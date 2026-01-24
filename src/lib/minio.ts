import * as Minio from 'minio';

if (!process.env.MINIO_ENDPOINT) {
  throw new Error('MINIO_ENDPOINT is not set');
}

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const BUCKETS = {
  PROFILE_IMAGES: 'kallcast-profile-images',
  SESSION_RECORDINGS: 'kallcast-session-recordings',
  DOCUMENTS: 'kallcast-documents',
  THUMBNAILS: 'kallcast-thumbnails',
  REVIEWS: 'kallcast-reviews',
};

// Initialize buckets
export async function initializeBuckets() {
  for (const bucketName of Object.values(BUCKETS)) {
    try {
      const exists = await minioClient.bucketExists(bucketName);
      if (!exists) {
        await minioClient.makeBucket(bucketName, 'us-east-1');
        console.log(`✓ Created bucket: ${bucketName}`);
        
        // Set public policy for profile images and thumbnails
        if (bucketName === BUCKETS.PROFILE_IMAGES || bucketName === BUCKETS.THUMBNAILS) {
          const policy = {
            Version: '2012-10-17',
            Statement: [{
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucketName}/*`]
            }]
          };
          await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
          console.log(`✓ Set public policy for: ${bucketName}`);
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(`Error with bucket ${bucketName}:`, error.message);
    }
  }
}
