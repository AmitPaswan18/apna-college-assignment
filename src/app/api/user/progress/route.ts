import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const userPayload = await getUser();
  if (!userPayload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { subtopicId, status } = await req.json();

    const progress = await prisma.progress.upsert({
      where: {
        userId_subtopicId: {
          userId: userPayload.id,
          subtopicId
        }
      },
      update: {
        status
      },
      create: {
        userId: userPayload.id,
        subtopicId,
        status
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
