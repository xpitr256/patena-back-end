class MockQueue {
  constructor(name, url) {
    this.name = name;
    this.url = url;
    this.jobs = new Map();
  }

  add(jobId, data) {
    this.jobs.set(jobId, data);
  }

  getJob(jobId) {
    return this.jobs.get(jobId);
  }

  removeJobs(jobId) {
    return this.jobs.delete(jobId);
  }

  count() {
    return this.jobs.size;
  }

  async process(concurrency, handler) {
    if (this.count() > 0) {
      const iterator = this.jobs.values();
      const task = iterator.next().value;
      const taskId = task.id;
      const job = {
        data: task,
      };
      await handler(job);
      this.removeJobs(taskId);
    }
  }
}

module.exports = MockQueue;
