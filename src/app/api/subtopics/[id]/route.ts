import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const userPayload = await getUser();
  if (!userPayload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await props.params;

  try {
    await prisma.progress.deleteMany({
      where: { subtopicId: id }
    });

    await prisma.subtopic.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Subtopic deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
