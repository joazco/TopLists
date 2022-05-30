type State = {
  isSignIn: boolean;
  showPseudo: boolean;
  showBtnValidate: boolean;
  showCode: boolean;
  errorPhoneNumber: boolean;
  errorPseudo: boolean;
  warnPseudo: boolean;
};

type Action =
  | "toggleSignIn"
  | "showPseudo"
  | "showBtnValidate"
  | "showCode"
  | "hideCode"
  | "errorPhoneNumber"
  | "errorPseudo"
  | "warnPseudo";

export const defaultState: State = {
  isSignIn: false,
  showPseudo: false,
  showBtnValidate: false,
  showCode: false,
  errorPhoneNumber: false,
  errorPseudo: false,
  warnPseudo: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action) {
    case "toggleSignIn":
      return { ...state, isSignIn: !state.isSignIn };
    case "showPseudo":
      return { ...state, showPseudo: true, errorPhoneNumber: false };
    case "errorPhoneNumber":
      return {
        ...state,
        showPseudo: false,
        errorPhoneNumber: true,
        showBtnValidate: false,
      };
    case "showBtnValidate":
      return {
        ...state,
        showBtnValidate: true,
        errorPhoneNumber: false,
        errorPseudo: false,
        warnPseudo: false,
      };
    case "errorPseudo":
      return { ...state, showBtnValidate: false, errorPseudo: true };
    case "warnPseudo":
      return { ...state, showBtnValidate: false, warnPseudo: true };
    case "showCode":
      return { ...state, showCode: true };
    case "hideCode":
      return { ...state, showCode: false };
    default:
      return state;
  }
};

export default reducer;
