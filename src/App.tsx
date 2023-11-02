import { ParallelTask } from "./parallel";
import "./App.css";

const mockRequestWithRandom = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, time);
  });
};

function App() {
  const run = () => {
    let i = 0
    const parallelInstance = new ParallelTask({
      oneTaskFinish: (options) => {
        console.log('oneTaskFinish options', options)
      },
      allTaskFinish: (options) => {
        console.log('allTaskFinish options', options)
      },
    });
    function addTask(time: number, name: number) {
      console.log(`添加任务${name}`, new Date().getTime())
      parallelInstance
        .add(() => mockRequestWithRandom(time))
        .then(() => {
          console.log(`任务${name}完成`, new Date().getTime());
        });
    }
    addTask(10000, 1); // 10s后输出任务1完成
    addTask(5000, 2); // 5s后输出任务2完成
    addTask(3000, 3); // 最多2个任务同时运行, 8s后输出任务3完成
    addTask(4000, 4); // 最多2个任务同时运行, 12s输出任务4完成
    addTask(5000, 5); // 最多2个任务同时运行, 15s输出任务5完成 
  };
  return (
    <div className="App">
      <button onClick={run}>点击运行</button>
    </div>
  );
}

export default App;
