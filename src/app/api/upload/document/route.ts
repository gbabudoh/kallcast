import { NextRequest, NextResponse } from 'next/server';
import storageService from '@/lib/services/storage.service';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('document') as File;
    const docType = (formData.get('docType') as string) || 'general';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await storageService.uploadDocument(
      session.user.id,
      buffer,
      file.type,
      file.name,
      docType
    );

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
