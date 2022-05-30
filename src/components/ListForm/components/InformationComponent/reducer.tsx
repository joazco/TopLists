type State = {
  showDescription: boolean;
  showOpenPublic: boolean;
  showTopNumber: boolean;
  showTags: boolean;
};

type Action =
  | "showDescription"
  | "showOpenPublic"
  | "showTopNumber"
  | "showTags"
  | "hideOpenTop";

export const defaultState: State = {
  showDescription: false,
  showOpenPublic: false,
  showTopNumber: false,
  showTags: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action) {
    case "showDescription":
      return { ...state, showDescription: true };
    case "showOpenPublic":
      return { ...state, showOpenPublic: true };
    case "showTopNumber":
      return { ...state, showTopNumber: true };
    case "showTags":
      return { ...state, showTags: true };
    case "hideOpenTop":
      return {
        ...state,
        showDescription: false,
        showOpenPublic: false,
        showTopNumber: false,
        showTags: false,
      };
    default:
      return state;
  }
};

export default reducer;
