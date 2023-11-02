type TaskItem = {
  task: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
};
export default class ParallelTask {
  parallelCount: number;
  taskQueue: Array<TaskItem>;
  runningTaskCount: number;

  constructor(parallelCount = 2) {
    this.parallelCount = parallelCount;
    this.taskQueue = [];
    this.runningTaskCount = 0;
  }

  add(task: TaskItem["task"]) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({
        resolve,
        reject,
        task,
      });
      this._run();
    });
  }

  _run() {
    while (
      this.runningTaskCount < this.parallelCount &&
      this.taskQueue.length > 0
    ) {
      const { resolve, reject, task } = this.taskQueue.shift() as TaskItem;
      this.runningTaskCount++;
      task()
        .then(resolve, reject)
        .finally(() => {
          this.runningTaskCount--;
          this._run(); // 递归
        });
    }
  }
}
