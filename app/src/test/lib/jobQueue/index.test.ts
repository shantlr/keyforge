import { createJobQueue } from '@/lib/jobQueue';

describe('jobQueue', () => {
  const handler = jest.fn();
  beforeEach(() => {
    handler.mockReset();
    jest.useRealTimers();
    jest.useFakeTimers().setSystemTime(0);
  });

  it('should create job', () => {
    const queue = createJobQueue({
      handler,
    });

    const data = {};
    const job = queue.createJob(data);
    expect(job.state).toBe('pending');
    expect(job).not.toBeNull();
    expect(job.id).not.toBeNull();
    expect(job.data).toBe(data);
    expect(handler).not.toHaveBeenCalled();
  });

  it('should job ready', () => {
    const queue = createJobQueue({
      handler,
    });

    const data = {};
    const job = queue.createJob(data);
    expect(job.state).toBe('pending');
    jest.advanceTimersByTime(1);
    expect(job.state).toBe('ready');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should run job', async () => {
    const queue = createJobQueue({
      handler,
    });

    const data = {};
    const job = queue.createJob(data);
    expect(job.state).toBe('pending');
    jest.advanceTimersByTime(1);
    expect(job.state).toBe('ready');

    await queue.runJob(job.id);
    expect(handler).toHaveBeenCalledWith(data);
    expect(job.state).toBe('done');
  });

  it('should cancel job still in pending', async () => {
    const queue = createJobQueue({
      handler,
    });

    const data = {};
    const job = queue.createJob(data);
    expect(job.state).toBe('pending');
    queue.canceJob(job.id);
    expect(job.state).toBe('cancelled');
    jest.advanceTimersByTime(1);
    expect(job.state).toBe('cancelled');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should cancel job that is ready', async () => {
    const queue = createJobQueue({
      handler,
    });

    const data = {};
    const job = queue.createJob(data);
    expect(job.state).toBe('pending');
    jest.advanceTimersByTime(1);
    expect(job.state).toBe('ready');
    queue.canceJob(job.id);
    expect(job.state).toBe('cancelled');
    jest.advanceTimersByTime(1);
    expect(job.state).toBe('cancelled');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should run job one after another', async () => {
    const queue = createJobQueue({
      handler,
      maxParallel: 1,
    });

    const data = {};
    const job = queue.createJob(data);
    const job2 = queue.createJob(data);
    expect(job.state).toBe('pending');
    expect(job2.state).toBe('pending');
    jest.advanceTimersByTime(1);
    expect(job.state).toBe('ready');
    expect(job2.state).toBe('pending');
    await queue.runJob(job.id);
    expect(handler).toHaveBeenCalledWith(data);
    expect(job.state).toBe('done');
    jest.advanceTimersByTime(1);
    expect(job2.state).toBe('ready');
  });

  it('should start several job in parallel', () => {
    const MAX_JOB = 3;
    const queue = createJobQueue({
      handler,
      maxParallel: MAX_JOB,
    });

    const data = {};
    const jobs = [];
    for (let i = 0; i < MAX_JOB + 1; i += 1) {
      jobs.push(queue.createJob(data));
    }
    jobs.forEach((job) => {
      expect(job.state).toBe('pending');
    });
    jest.advanceTimersByTime(1);
    jobs.forEach((job, idx) => {
      if (idx >= MAX_JOB) {
        expect(job.state).toBe('pending');
      } else {
        expect(job.state).toBe('ready');
      }
    });
  });

  it('should update job last pinged', () => {
    const queue = createJobQueue({
      handler,
    });

    const data = {};
    const job = queue.createJob(data);
    expect(job.lastPinged).toEqual(new Date(0));
    jest.advanceTimersByTime(500);

    expect(job.lastPinged).toEqual(new Date(0));
    queue.jobAlive(job.id);
    expect(job.lastPinged).toEqual(new Date(500));
  });

  it('should time out job', () => {
    const queue = createJobQueue({
      handler,
      jobTimeoutMs: 1000,
    });

    const data = {};
    const job = queue.createJob(data);
    expect(job.state).toBe('pending');
    jest.advanceTimersByTime(500);
    queue.check();
    expect(job.state).toBe('ready');
    jest.advanceTimersByTime(600);
    queue.check();
    expect(job.state).toBe('timedout');
  });
});
