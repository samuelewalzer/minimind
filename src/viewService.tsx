import React, { createContext, useContext } from "react";
import { FCC } from "./components/@def";

export interface ViewState {
  edit: boolean;
  details: boolean;
}

interface ViewService {
  view: ViewState;
  setEditView(): void;
  setDetailsView(): void;
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

export interface ViewStateProps {}

export const ViewServiceProvider: FCC<ViewService> = ({ children }) => {
  const [view, setView] = React.useState<ViewState>({
    edit: false,
    details: false,
  });

  const setEditView = (): void => {
    setView({ ...view, details: true, edit: true });
    console.log("EditView set");
  };

  const setDetailsView = (): void => {
    setView({ ...view, details: true, edit: false });
    console.log("DetailsView set");
  };

  const setDefaultView = (): void => {
    setView({ ...view, details: false, edit: false });
    console.log("DefaultView set");
  };

  const content: ViewService = {
    view,
    setEditView,
    setDetailsView,
    setDefaultView,
  };

  return (
    <ViewServiceContext.Provider value={content}>
        {children}
    </ViewServiceContext.Provider>
  );
};