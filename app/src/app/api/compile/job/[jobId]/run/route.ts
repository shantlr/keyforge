import { COMPILE } from '@/server/compile';

export const POST = async (
  req: Request,
  { params: { jobId } }: { params: { jobId: string } }
) => {
  try {
    const buffer = await COMPILE.runJob(jobId);
    return new Response(buffer);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'UNKNOWN_JOB') {
        return new Response('Unknown job', {
          status: 400,
        });
      }
    }

    throw err;
  }
};
