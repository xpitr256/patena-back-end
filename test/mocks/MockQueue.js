class MockQueue {
  constructor(name, url) {
    this.name = name;
    this.url = url;
    this.jobs = [];
  }

  add(jobId) {
    this.jobs.push(jobId);
    return { id: jobId };
  }

  getJob(jobId) {
    return this.jobs.find((id) => id === jobId);
  }

  removeJobs(jobId) {
    return (this.jobs = this.jobs.filter((id) => id !== jobId));
  }

  count() {
    return this.jobs.length;
  }
  getJobCounts() {
    return this.count();
  }

  async process(name, concurrency, handler) {
    if (this.count() > 0) {
      const taskId = this.jobs[0];
      const job = {
        name: taskId,
      };
      await handler(job);
      this.removeJobs(taskId);
    }
  }
}

module.exports = MockQueue;
