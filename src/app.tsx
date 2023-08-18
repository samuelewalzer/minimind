import TaskContainer from "./components/TaskContainer";
import { useViewService } from "./viewService";
import AddForm from "./components/AddForm";
import TaskForm from "./components/TaskForm";
import FlowerCounter from "./components/flowerCounter"

export default function App() {
  const { viewMode } = useViewService();

  return (
    <div className="appContainer">
      <header className="titleHeader">minimind</header>
      <div className="taskSection">
        <div>
          <TaskContainer />
        </div>
        <div className="formContainer">
          <h2>details</h2>
          {viewMode === "details" ? (
            <TaskForm disabled={true} />
          ) : viewMode === "add" ? (
            <AddForm />
          ) : viewMode === "edit" ? (
            <TaskForm disabled={false} />
          ) : viewMode === "default" ? (
            <h3>no task selected</h3>
          ) : null}
        </div>
      </div>
      <FlowerCounter />
    </div>
  );
}
