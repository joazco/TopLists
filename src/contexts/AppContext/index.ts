import { createContext } from "react";
import { UserFirebaseStorage } from "../../types";

type AppContextType = {
  user: UserFirebaseStorage | null;
  setUser: (user: UserFirebaseStorage | null) => void;
};

const defaultContext: AppContextType = {
  user: null,
  setUser: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export default AppContext;
