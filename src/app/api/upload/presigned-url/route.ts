import { NextRequest, NextResponse } from 'next/server';
import storageService from '@/lib/services/storage.service';
import { auth } from '@/lib/auth';
import { BUCKETS } from '@/lib/minio';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bucket, fileName } = await request.json();
    
    // Validate bucket
    if (!Object.values(BUCKETS).includes(bucket)) {
      return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 });
    }

    const url = await storageService.getPresignedPutUrl(bucket, fileName);

    return NextResponse.json({
      success: true,
      url: url
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Presigned URL error:', error);
    return NextResponse.json(
      { error: 'Failed to generate URL', message: error.message },
      { status: 500 }
    );
  }
}
