import { NextRequest, NextResponse } from 'next/server';
import storageService from '@/lib/services/storage.service';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await storageService.uploadProfileImage(
      session.user.id,
      buffer,
      file.type,
      file.name
    );

    // Update user profile in database
    await connectDB();
    await User.findByIdAndUpdate(session.user.id, {
      profileImage: result.url
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
