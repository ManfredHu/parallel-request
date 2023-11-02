/** 任意函数 */
export type AnyFunc = (...args: any[]) => any;
type TaskItem = {
  task: () => Promise<unknown>;
  resolve: AnyFunc;
  reject: AnyFunc;
};

/**
 * 并行请求
 * 通过构造函数parallelCount控制并行请求数量
 */
type FinishCallBackOptions = {
  allTaskNum: number;
  finishTaskNum: number;
}

type FinishCb = (options: FinishCallBackOptions) => void
type ParallelTaskOptions = {
  parallelCount?: number
  oneTaskFinish?: FinishCb
  allTaskFinish?: FinishCb
}
export class ParallelTask {
  parallelCount: number;
  taskQueue: Array<TaskItem>;
  runningTaskCount: number;
  allTaskNum: number;
  finishTaskNum: number;
  oneTaskFinish: FinishCb
  allTaskFinish: FinishCb

  constructor(options: ParallelTaskOptions) {
    this.taskQueue = [];
    this.runningTaskCount = 0;
    this.allTaskNum = 0;
    this.finishTaskNum = 0;
    this.parallelCount = options.parallelCount || 2;
    this.oneTaskFinish = options.oneTaskFinish as FinishCb;
    this.allTaskFinish = options.allTaskFinish as FinishCb;
  }

  add(task: TaskItem["task"]) {
    return new Promise((resolve, reject) => {
      this.allTaskNum++;
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
          const options: FinishCallBackOptions = {
            allTaskNum: this.allTaskNum,
            finishTaskNum: ++this.finishTaskNum,
          }
          this.oneTaskFinish?.(options);
          this.runningTaskCount--;
          this._run(); // 递归

          // 判断是否所有任务已完成
          if (this.runningTaskCount === 0 && this.taskQueue.length === 0) {
            this.allTaskFinish?.(options); // 所有任务完成的回调
          }
        });
    }
  }
}
