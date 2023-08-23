import TaskContainer from "./components/TaskContainer";
import { useViewService } from "./viewService";
import AddForm from "./components/AddForm";
import TaskForm from "./components/TaskForm";
import FlowerCounter from "./components/FlowerCounter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { useGlobalRerender } from "./globalRendererContext";

export default function App() {
  const { viewMode } = useViewService();
  const { triggerRerender, toggleRerender } = useGlobalRerender();

  function showDatabase() {
    window.api.showDatabase();
  }

  const appContent = () => {
    if (viewMode === "details") {
      return <TaskForm disabled={true} />;
    } else if (viewMode === "add") {
      return <AddForm />;
    } else if (viewMode === "edit") {
      return <TaskForm disabled={false} />;
    } else {
      return (
        <div className="no-task-select">
          <h3>no task selected</h3>
        </div>
      );
    }
  };

  function handleRerender() {
    triggerRerender();
    toggleRerender();
  }

  return (
    <>
    <FontAwesomeIcon icon={faDatabase} className="faDatabase" onClick={showDatabase}/>
    <FontAwesomeIcon icon={faRotateRight} className="faReload" onClick={handleRerender}/>
    <div className="appContainer">
      <header className="titleHeader">minimind</header>
      <div className="taskSection">
        <div>
          <TaskContainer />
        </div>
        <div className="formContainer">
          {appContent()}
        </div>
      </div>
      <FlowerCounter />
    </div></>
  );
}
