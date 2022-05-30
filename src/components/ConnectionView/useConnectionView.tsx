import { useCallback, useEffect, useReducer, useState } from "react";

import reducer, { defaultState } from "./reducer";
import {
  useConnection,
  useGoogleAppleTester,
  useLocalDatabase,
} from "../../hooks";
import { ConnectionViewProps, UserLocalStorage } from "../../types";

const metropolitanFranceReg = new RegExp(/^(\+33|0033|0)(6|7)[0-9]{8}$/g);
const keyDatabase = "app";

const useConnectionView = ({ page, onConnected }: ConnectionViewProps) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [phoneNumber, setPhoneNumberState] = useState<string | undefined>();
  const [pseudo, setPseudo] = useState<string | undefined>();
  const [code, setCode] = useState<string>("");
  const { setItem, getItem } = useLocalDatabase();
  const {
    signInFirebase,
    confirmSignInFirebase,
    findUserFirebase,
    formatPhoneNumberFirebase,
    findPseudoFirebase,
  } = useConnection();
  const { connectTester } = useGoogleAppleTester();
  const {
    isSignIn,
    showPseudo,
    showBtnValidate,
    showCode,
    errorPhoneNumber,
    errorPseudo,
    warnPseudo,
  } = state;

  const setPhoneNumber = (value: string) => {
    if (value.length >= 11) return;
    setPhoneNumberState(value);
  };

  const validatePhoneNumber = useCallback(() => {
    if (typeof phoneNumber === "undefined") return;
    if (phoneNumber === "") setPseudo("");
    if (!(phoneNumber.match(metropolitanFranceReg) === null)) {
      findUserFirebase(formatPhoneNumberFirebase(phoneNumber)).then((user) => {
        if (user && isSignIn) {
          setPseudo(user.pseudo);
          dispatch("showBtnValidate");
        } else if (user && !isSignIn) {
          setPseudo(user.pseudo);
          dispatch("showBtnValidate");
          dispatch("toggleSignIn");
        } else if (isSignIn) {
          dispatch("toggleSignIn");
        } else {
          setPseudo(undefined);
          dispatch("showPseudo");
        }
      });
    } else {
      dispatch("errorPhoneNumber");
    }
  }, [phoneNumber, isSignIn, findUserFirebase, formatPhoneNumberFirebase]);

  const validatePseudo = useCallback(() => {
    if (!pseudo) return;
    if (pseudo.length >= 3 && !isSignIn) {
      findPseudoFirebase(pseudo.toLowerCase().trim())
        .then(() => dispatch("showBtnValidate"))
        .catch(() => dispatch("errorPseudo"));
    }
    if (isSignIn) {
      dispatch("showBtnValidate");
    } else {
      dispatch("warnPseudo");
    }
  }, [pseudo, isSignIn, findPseudoFirebase]);

  const signIn = () => {
    // it's for apple and google tester
    if (phoneNumber === "0612345123") {
      connectTester();
    } else {
      if (
        phoneNumber &&
        pseudo &&
        !(phoneNumber.match(metropolitanFranceReg) === null)
      ) {
        signInFirebase(phoneNumber, page).then(() => dispatch("showCode"));
      }
    }
  };
  const hideCode = () => dispatch("hideCode");
  const setUserToLocalStorage = useCallback(() => {
    if (phoneNumber && pseudo) {
      setItem<UserLocalStorage>(keyDatabase, { phoneNumber, pseudo });
    }
  }, [phoneNumber, pseudo, setItem]);
  const toggleSignIn = () => {
    dispatch("toggleSignIn");
  };

  useEffect(() => {
    getItem<UserLocalStorage>(keyDatabase).then((data) => {
      setPhoneNumberState(data?.phoneNumber);
      setPseudo(data?.pseudo);
    });
    return () => {
      setPhoneNumberState(""); // This worked for me
      setPseudo("");
    };
  }, [getItem]);
  useEffect(() => {
    validatePhoneNumber();
  }, [phoneNumber, validatePhoneNumber]);
  useEffect(() => {
    validatePseudo();
  }, [pseudo, validatePseudo]);
  useEffect(() => {
    if (code.length === 6 && phoneNumber && pseudo) {
      confirmSignInFirebase(code, phoneNumber, pseudo)
        .then(({ uid }) => {
          setUserToLocalStorage();
          onConnected({
            phoneNumber,
            pseudo,
            uid,
          });
        })
        .catch(() => {
          setCode("");
          dispatch("errorPhoneNumber");
        });
    }
  }, [
    code,
    pseudo,
    phoneNumber,
    confirmSignInFirebase,
    onConnected,
    setUserToLocalStorage,
  ]);

  return {
    errorPhoneNumber,
    errorPseudo,
    warnPseudo,
    phoneNumber,
    pseudo,
    isSignIn,
    showPseudo,
    showBtnValidate,
    showCode,
    code,
    page,
    setPhoneNumber,
    setPseudo,
    signIn,
    setCode,
    hideCode,
    toggleSignIn,
  };
};

export default useConnectionView;
