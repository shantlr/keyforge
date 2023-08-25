import { COMPILE } from '@/server/compile';
import { NextResponse } from 'next/server';

export const GET = (
  req: Request,
  { params: { jobId } }: { params: { jobId: string } }
) => {
  COMPILE.jobAlive(jobId);
  const job = COMPILE.getJob(jobId);
  return NextResponse.json(job ?? null);
};
