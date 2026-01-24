import { minioClient, BUCKETS } from '../minio';
import * as Minio from 'minio';
import path from 'path';

class StorageService {
  
  /**
   * Upload profile image
   */
  async uploadProfileImage(userId: string, fileBuffer: Buffer, mimetype: string, originalName: string) {
    const fileExt = path.extname(originalName);
    const fileName = `user_${userId}_${Date.now()}${fileExt}`;
    
    await minioClient.putObject(
      BUCKETS.PROFILE_IMAGES,
      fileName,
      fileBuffer,
      fileBuffer.length,
      { 'Content-Type': mimetype }
    );

    return {
      bucket: BUCKETS.PROFILE_IMAGES,
      fileName: fileName,
      url: `${process.env.MINIO_PUBLIC_URL}/${BUCKETS.PROFILE_IMAGES}/${fileName}`,
    };
  }

  /**
   * Upload session recording
   */
  async uploadSessionRecording(sessionId: string, fileBuffer: Buffer, mimetype: string, originalName: string) {
    const fileExt = path.extname(originalName);
    const fileName = `session_${sessionId}_${Date.now()}${fileExt}`;
    
    await minioClient.putObject(
      BUCKETS.SESSION_RECORDINGS,
      fileName,
      fileBuffer,
      fileBuffer.length,
      { 
        'Content-Type': mimetype,
        'session-id': sessionId.toString()
      }
    );

    // Generate presigned URL (expires in 7 days)
    const url = await this.getPresignedUrl(BUCKETS.SESSION_RECORDINGS, fileName, 7 * 24 * 3600);

    return {
      bucket: BUCKETS.SESSION_RECORDINGS,
      fileName: fileName,
      url: url,
    };
  }

  /**
   * Upload document
   */
  async uploadDocument(userId: string, fileBuffer: Buffer, mimetype: string, originalName: string, docType = 'general') {
    const fileExt = path.extname(originalName);
    const fileName = `${docType}_${userId}_${Date.now()}${fileExt}`;
    
    await minioClient.putObject(
      BUCKETS.DOCUMENTS,
      fileName,
      fileBuffer,
      fileBuffer.length,
      { 
        'Content-Type': mimetype,
        'user-id': userId.toString(),
        'doc-type': docType
      }
    );

    const url = await this.getPresignedUrl(BUCKETS.DOCUMENTS, fileName);

    return {
      bucket: BUCKETS.DOCUMENTS,
      fileName: fileName,
      url: url,
    };
  }

  /**
   * Upload review attachment
   */
  async uploadReviewAttachment(reviewId: string, userId: string, fileBuffer: Buffer, mimetype: string, originalName: string) {
    const fileExt = path.extname(originalName);
    const fileName = `review_${reviewId}_${Date.now()}${fileExt}`;
    
    await minioClient.putObject(
      BUCKETS.REVIEWS,
      fileName,
      fileBuffer,
      fileBuffer.length,
      { 
        'Content-Type': mimetype,
        'review-id': reviewId.toString(),
        'user-id': userId.toString()
      }
    );

    const url = await this.getPresignedUrl(BUCKETS.REVIEWS, fileName);

    return {
      bucket: BUCKETS.REVIEWS,
      fileName: fileName,
      url: url,
    };
  }

  /**
   * Upload thumbnail
   */
  async uploadThumbnail(originalFileName: string, thumbnailBuffer: Buffer, mimetype: string) {
    const fileName = `thumb_${Date.now()}_${originalFileName}`;
    
    await minioClient.putObject(
      BUCKETS.THUMBNAILS,
      fileName,
      thumbnailBuffer,
      thumbnailBuffer.length,
      { 'Content-Type': mimetype }
    );

    return {
      bucket: BUCKETS.THUMBNAILS,
      fileName: fileName,
      url: `${process.env.MINIO_PUBLIC_URL}/${BUCKETS.THUMBNAILS}/${fileName}`,
    };
  }

  /**
   * Get presigned URL for private files
   */
  async getPresignedUrl(bucket: string, fileName: string, expirySeconds = 3600) {
    return await minioClient.presignedGetObject(bucket, fileName, expirySeconds);
  }

  /**
   * Get presigned PUT URL for direct upload from client
   */
  async getPresignedPutUrl(bucket: string, fileName: string, expirySeconds = 3600) {
    return await minioClient.presignedPutObject(bucket, fileName, expirySeconds);
  }

  /**
   * Delete file
   */
  async deleteFile(bucket: string, fileName: string) {
    try {
      await minioClient.removeObject(bucket, fileName);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * List files in bucket
   */
  async listFiles(bucket: string, prefix = '') {
    const files: Minio.BucketItem[] = [];
    const stream = minioClient.listObjects(bucket, prefix, true);
    
    return new Promise<Minio.BucketItem[]>((resolve, reject) => {
      stream.on('data', (obj: Minio.BucketItem) => files.push(obj));
      stream.on('error', reject);
      stream.on('end', () => resolve(files));
    });
  }
}

const storageService = new StorageService();
export default storageService;
