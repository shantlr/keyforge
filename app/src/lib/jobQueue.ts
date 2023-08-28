import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

export type Job<Data, Result = void> = {
  id: string;
  lastPinged: Date;

  data: Data;
  logs: string[];

  result?: Result;

  state: 'pending' | 'ready' | 'ongoing' | 'done' | 'cancelled' | 'timedout';
};

export const createJobQueue = <Data = any, Result = void>({
  handler,
  maxParallel = 1,
  jobTimeoutMs = 30 * 1000,
}: {
  handler: (data: Data, job: Job<Data, Result>) => Promise<Result>;
  maxParallel?: number;

  jobTimeoutMs?: number;
}) => {
  const state = {
    ongoing: [] as string[],
    jobs: {} as Record<string, Job<Data, Result>>,
    queue: [] as string[],
  };
  const processJob = () => {
    try {
      if (state.ongoing.length >= maxParallel) {
        // check if any ongoing job is timedout

        let deleted = 0;
        state.ongoing.forEach((jobId) => {
          const job = state.jobs[jobId];
          if (
            job.state === 'ready' &&
            Date.now() - job.lastPinged.valueOf() >= jobTimeoutMs
          ) {
            job.state = 'timedout';
            const idx = state.ongoing.indexOf(jobId);
            if (idx !== -1) {
              state.ongoing.splice(idx, 1);
            }
            console.log(
              `[process-job] job '${jobId}' is timedout: job was ready but did not start before timeout`
            );
            deleted += 1;
          }
        });

        if (deleted > 0) {
          void processJob();
        }

        return;
      }

      const jobId = state.queue.shift();
      if (!jobId || !(jobId in state.jobs)) {
        return;
      }

      const job = state.jobs[jobId];
      if (Date.now() - job.lastPinged.valueOf() <= jobTimeoutMs) {
        job.state = 'ready';
        state.ongoing.push(jobId);
        console.log(`[process-job] job '${jobId}' ready`);
      } else {
        job.state = 'timedout';

        console.log(
          `[process-job] job '${jobId}' in queue timed out (last ping at ${dayjs(
            job.lastPinged
          ).format('DD/MM/YYYY HH:MM:ss')})`
        );
      }

      void processJob();
    } catch (err) {
      console.warn(`[process-job] error:`, err);
    }
  };

  const queue = {
    check: () => {
      processJob();
    },
    createJob: (data: Data) => {
      const jobId = nanoid();

      state.jobs[jobId] = {
        id: jobId,
        data,
        logs: [],
        state: 'pending',
        lastPinged: new Date(),
      };
      state.queue.push(jobId);
      setTimeout(() => {
        void processJob();
      });
      return state.jobs[jobId];
    },
    jobAlive: (jobId: string) => {
      const job = queue.getJob(jobId);
      if (job) {
        job.lastPinged = new Date();
      }
    },
    runJob: async (jobId: string) => {
      const job = queue.getJob(jobId);
      if (!job) {
        throw new Error('UNKNOWN_JOB');
      }

      if (job.state !== 'ready') {
        throw new Error('JOB_NOT_READY');
      }
      try {
        job.state = 'ongoing';
        const res = await handler(job.data, job);
        job.state = 'done';
        return res;
      } finally {
        // remove job from ongoing
        const idx = state.ongoing.indexOf(jobId);
        state.ongoing.splice(idx, 1);
        setTimeout(() => {
          void processJob();
        });
      }
    },
    getJob: (jobId: string) => {
      return state.jobs[jobId];
    },
    canceJob: (jobId: string) => {
      const job = queue.getJob(jobId);
      if (!job) {
        return;
      }

      if (job.state === 'pending') {
        const idx = state.queue.indexOf(jobId);
        if (idx !== -1) {
          state.queue.splice(idx, 1);
        }
      } else {
        const idx = state.ongoing.indexOf(jobId);
        if (idx !== -1) {
          state.ongoing.splice(idx, 1);
        }
      }

      delete state.jobs[jobId];
      job.state = 'cancelled';
    },
  };

  return queue;
};
