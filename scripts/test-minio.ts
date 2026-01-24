import * as Minio from 'minio';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local from the project root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// In Next.js, we use environment variables directly
const endpoint = process.env.MINIO_ENDPOINT;
const accessKey = process.env.MINIO_ACCESS_KEY;
const secretKey = process.env.MINIO_SECRET_KEY;

if (!endpoint || !accessKey || !secretKey) {
  console.error('✗ Error: MINIO_ENDPOINT, MINIO_ACCESS_KEY, and MINIO_SECRET_KEY must be set in .env.local');
  process.exit(1);
}

const minioClient = new Minio.Client({
  endPoint: endpoint,
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: accessKey,
  secretKey: secretKey,
});

async function test() {
  console.log('🔍 Testing MinIO connection to:', endpoint);
  try {
    const buckets = await minioClient.listBuckets();
    console.log('✓ Successfully connected to MinIO');
    console.log('📦 Existing Buckets:', buckets.map((b: Minio.BucketItemFromList) => b.name).join(', ') || 'None');
    
    // Check for our specific buckets
    const requiredBuckets = [
      'kallcast-profile-images',
      'kallcast-session-recordings',
      'kallcast-documents',
      'kallcast-thumbnails',
      'kallcast-reviews'
    ];
    
    console.log('\n📋 Required Buckets Check:');
    for (const bucket of requiredBuckets) {
      const exists = await minioClient.bucketExists(bucket);
      console.log(`${exists ? '✅' : '❌'} ${bucket}`);
    }

  } catch (err: unknown) {
    const error = err as Error;
    console.error('✗ Connection failed:', error.message);
    if ((error as { code?: string }).code === 'ECONNREFUSED') {
      console.log('💡 Tip: Ensure MinIO server is running at the specified endpoint and port.');
    }
  }
}

test();
