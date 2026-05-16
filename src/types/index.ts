export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  subtopics?: Subtopic[];
  subtopicsCount?: number;
  completedCount?: number;
}

export interface Subtopic {
  id: string;
  topicId: string;
  name: string;
  leetcodeLink?: string;
  youtubeLink?: string;
  articleLink?: string;
  level: Difficulty;
  completed?: boolean;
}

export interface UserStats {
  easy: number;
  medium: number;
  hard: number;
}
