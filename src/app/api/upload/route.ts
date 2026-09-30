import { NextRequest, NextResponse } from 'next/server';
import { CloudinaryService } from '@/services/cloudinary/upload.service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await CloudinaryService.uploadImage(buffer);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al subir la imagen';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
