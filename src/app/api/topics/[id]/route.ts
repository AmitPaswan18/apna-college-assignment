import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userPayload = await getUser();
  if (!userPayload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        subtopics: {
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!topic) {
      return NextResponse.json({ message: 'Topic not found' }, { status: 404 });
    }

    const userProgress = await prisma.progress.findMany({
      where: {
        userId: userPayload.id,
        subtopicId: { in: topic.subtopics.map(st => st.id) }
      }
    });

    const subtopicsWithStatus = topic.subtopics.map(st => ({
      ...st,
      completed: userProgress.find(p => p.subtopicId === st.id)?.status || false
    }));

    return NextResponse.json({
      ...topic,
      subtopics: subtopicsWithStatus
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
