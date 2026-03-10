import { NextRequest, NextResponse } from 'next/server';
import storageService from '@/lib/services/storage.service';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await params;
    const formData = await request.formData();
    const file = formData.get('video') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await storageService.uploadSessionRecording(
      sessionId,
      buffer,
      file.type,
      file.name
    );

    // Update booking in database using Prisma
    await prisma.booking.update({
      where: { id: sessionId },
      data: {
        videoRoomUrl: result.url // or a specialized field if added
      }
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', message: error.message },
      { status: 500 }
    );
  }
}
