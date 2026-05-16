import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userPayload = await getUser();
  if (!userPayload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id: topicId } = await params;
  const body = await req.json();
  const { name, leetcodeLink, youtubeLink, articleLink, level } = body;

  if (!name || !level) {
    return NextResponse.json({ message: 'Name and level are required' }, { status: 400 });
  }

  try {
    const subtopic = await prisma.subtopic.create({
      data: {
        name,
        leetcodeLink: leetcodeLink || null,
        youtubeLink: youtubeLink || null,
        articleLink: articleLink || null,
        level,
        topicId,
      },
    });

    return NextResponse.json(subtopic);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
