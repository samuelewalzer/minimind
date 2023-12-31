import { useState, createContext, useContext, useMemo } from "react";
import { FCC } from "./components/@def";
import { Task } from "./appStore";
import { useGlobalRerender } from "./globalRendererContext";

const ViewMode = {
  DEFAULT: "default",
  DETAILS: "details",
  EDIT: "edit",
  ADD: "add",
};

interface ViewService {
  currentTask: Task;
  viewMode: string;
  setAddView(): void;
  setEditView(): void;
  setDetailsView(task: Task): void;
  setDefaultView(): void;
}

// create a container to share the ViewService through the useContext hook
export const ViewServiceContext = createContext<ViewService>(null);

export const useViewService = (): ViewService => {
  const context = useContext(ViewServiceContext);
  if (!context) {
    throw new Error("useViewService must be used within a ViewServiceProvider");
  }
  return context;
};

export const ViewServiceProvider: FCC<ViewService> = ({ children }) => {
  const { triggerRerender } = useGlobalRerender();
  const [viewMode, setViewMode] = useState(ViewMode.DEFAULT);
  const [currentTask, setCurrentTask] = useState<Task>({
    id: "",
    createdDate: "",
    name: "",
    completed: false,
    completedDate: "",
    deadline: "",
    priority: "",
    subtasks: [],
    notes: "",
    checkCount: 0,
  });

  const setEditView = (): void => {
    setViewMode(ViewMode.EDIT);
    console.log("EditView set");
    triggerRerender();
  };

  const setDetailsView = (task: Task): void => {
    setCurrentTask(task);
    setViewMode(ViewMode.DETAILS);
    console.log("DetailsView set");
    triggerRerender();
  };

  const setDefaultView = (): void => {
    setViewMode(ViewMode.DEFAULT);
    console.log("DefaultView set");
  };

  const setAddView = (): void => {
    setViewMode(ViewMode.ADD);
    console.log("AddView set");
  };

  const content: ViewService = useMemo(
    () => ({
      currentTask,
      viewMode,
      setAddView,
      setEditView,
      setDetailsView,
      setDefaultView,
    }),
    [currentTask, viewMode]
  );

  return (
    <ViewServiceContext.Provider value={content}>
      {children}
    </ViewServiceContext.Provider>
  );
};
