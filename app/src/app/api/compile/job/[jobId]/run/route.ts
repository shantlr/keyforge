import { COMPILE } from '@/server/compile';

export const POST = async (
  req: Request,
  { params: { jobId } }: { params: { jobId: string } }
) => {
  const buffer = await COMPILE.runJob(jobId);
  return new Response(buffer);
};
