import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const userPayload = await getUser();
  if (!userPayload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = userPayload.id;

  try {
    // Seed topics if none exist
    const topicCount = await prisma.topic.count();
    if (topicCount === 0) {
      const data = [
        {
          name: 'Algorithms',
          subtopics: [
            { name: 'Sorting Algorithms', level: 'EASY', leetcodeLink: 'https://leetcode.com/tag/sorting/' },
            { name: 'Searching Algorithms', level: 'EASY', leetcodeLink: 'https://leetcode.com/tag/binary-search/' },
            { name: 'Dynamic Programming', level: 'MEDIUM', leetcodeLink: 'https://leetcode.com/tag/dynamic-programming/' },
            { name: 'Greedy Algorithms', level: 'MEDIUM', leetcodeLink: 'https://leetcode.com/tag/greedy/' },
            { name: 'Divide and Conquer', level: 'MEDIUM', leetcodeLink: 'https://leetcode.com/tag/divide-and-conquer/' },
            { name: 'Backtracking', level: 'HARD', leetcodeLink: 'https://leetcode.com/tag/backtracking/' },
          ]
        },
        { name: 'Data Structures', subtopics: [{ name: 'Linked List', level: 'EASY' }, { name: 'Trees', level: 'MEDIUM' }] },
        { name: 'Databases', subtopics: [{ name: 'SQL Basics', level: 'EASY' }, { name: 'Indexing', level: 'MEDIUM' }] },
        { name: 'Machine Learning', subtopics: [{ name: 'Linear Regression', level: 'EASY' }, { name: 'Neural Networks', level: 'HARD' }] },
        { name: 'Operating Systems', subtopics: [{ name: 'Process Scheduling', level: 'MEDIUM' }, { name: 'Memory Management', level: 'MEDIUM' }] },
        { name: 'Networks', subtopics: [{ name: 'OSI Model', level: 'EASY' }, { name: 'TCP/UDP', level: 'MEDIUM' }] },
        { name: 'Mathematics', subtopics: [{ name: 'Probability', level: 'MEDIUM' }, { name: 'Linear Algebra', level: 'MEDIUM' }] },
        { name: 'Software Engineering', subtopics: [{ name: 'Agile', level: 'EASY' }, { name: 'Design Patterns', level: 'MEDIUM' }] },
        { name: 'Web Development', subtopics: [{ name: 'HTML/CSS', level: 'EASY' }, { name: 'React', level: 'MEDIUM' }] },
        { name: 'Cloud Computing', subtopics: [{ name: 'AWS S3', level: 'EASY' }, { name: 'EC2', level: 'MEDIUM' }] }
      ];

      for (const t of data) {
        await prisma.topic.create({
          data: {
            name: t.name,
            subtopics: {
              create: t.subtopics.map(st => ({
                ...st,
                level: st.level as any,
                youtubeLink: 'https://youtube.com',
                articleLink: 'https://geeksforgeeks.org'
              }))
            }
          }
        });
      }
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        progress: {
          include: {
            subtopic: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const topics = await prisma.topic.findMany({
      include: {
        subtopics: true,
      }
    });

    // Calculate stats
    const stats = {
      easy: user.progress.filter(p => p.status && p.subtopic.level === 'EASY').length,
      medium: user.progress.filter(p => p.status && p.subtopic.level === 'MEDIUM').length,
      hard: user.progress.filter(p => p.status && p.subtopic.level === 'HARD').length,
    };

    const allSubtopics = await prisma.subtopic.findMany();
    const totalStats = {
      easy: allSubtopics.filter(s => s.level === 'EASY').length,
      medium: allSubtopics.filter(s => s.level === 'MEDIUM').length,
      hard: allSubtopics.filter(s => s.level === 'HARD').length,
    };

    const topicsWithProgress = topics.map(topic => {
      const subtopicsCount = topic.subtopics.length;
      const completedCount = topic.subtopics.filter(st =>
        user.progress.find(p => p.subtopicId === st.id && p.status)
      ).length;

      return {
        ...topic,
        subtopicsCount,
        completedCount
      };
    });

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const periodicStats = {
      today: user.progress.filter(p => p.status && p.updatedAt >= oneDayAgo).length,
      thisWeek: user.progress.filter(p => p.status && p.updatedAt >= sevenDaysAgo).length,
      thisMonth: user.progress.filter(p => p.status && p.updatedAt >= thirtyDaysAgo).length,
    };

    return NextResponse.json({
      user: { email: user.email, name: user.name, stats, totalStats, periodicStats },
      topics: topicsWithProgress
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
export async function PATCH(request: Request) {
  const userPayload = await getUser();
  if (!userPayload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userPayload.id },
      data: { name }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
