import { $$compileRunJob } from '@/actions/compile';

// NOTE: We use post instead of server action
// As server action does not handle buffer yet
export const POST = async (
  req: Request,
  { params: { jobId } }: { params: { jobId: string } }
) => {
  try {
    const buffer = await $$compileRunJob(jobId);
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
