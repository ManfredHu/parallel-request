import ParallelTask from "./parallel";
import "./App.css";

const mockRequestWithRandom = () => {
  return new Promise((resolve) => {
    const randomTime = Math.floor(Math.random() * 10) * 1000;
    console.log("随机函数等待:", randomTime);
    setTimeout(() => {
      console.log("函数执行: ", randomTime);
      resolve(undefined);
    }, randomTime);
  });
};

function App() {
  const run = () => {
    const parallelInstance = new ParallelTask();
    for (let i = 0; i < 10; i++) {
      parallelInstance.add(() => mockRequestWithRandom());
    }
  };
  return (
    <div className="App">
      <button onClick={run}>点击运行</button>
    </div>
  );
}

export default App;
