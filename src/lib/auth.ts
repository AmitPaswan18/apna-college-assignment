import { createClient } from './supabase/server';
import { prisma } from './prisma';

export async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Ensure user exists in Prisma DB
  let dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: user.email!,
        password: '', // Password is managed by Supabase
        name: user.user_metadata?.full_name || '',
      },
    });
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    supabaseId: user.id
  };
}
