import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  User,
  signOut,
  deleteUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Device } from "@capacitor/device";
import { useFirebaseIos, useFirebaseList } from "..";
import { CallbackUser, UserFirebaseStorage } from "../../types";

let confirmationResult: ConfirmationResult | null = null;
let callBackUser: CallbackUser | null = null;

const useConnection = () => {
  const [isIos, setIsIos] = useState<boolean | null>(null);
  const { onceGetListFromUser } = useFirebaseList();
  const {
    verifyPhoneNumber,
    signInWithCredential,
    getUser,
    signOut: signOutIos,
    deleteUser: deleteUserIos,
  } = useFirebaseIos();

  useEffect(() => {
    Device.getInfo().then(({ platform }) => {
      setIsIos(platform === "ios");
    });
  }, []);

  const formatPhoneNumberFirebase = useCallback((phN: string) => {
    return phN.replace("0", "+33");
  }, []);
  const findUserFirebase = useCallback(
    (phoneNumber: string): Promise<UserFirebaseStorage> =>
      new Promise((resolve, reject) => {
        const db = getFirestore();
        getDoc(doc(db, `users/${phoneNumber}`))
          .then((value) => resolve(value.data() as UserFirebaseStorage))
          .catch(reject);
      }),
    []
  );

  const findPseudoFirebase = useCallback(
    (pseudo: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const db = getFirestore();
        const q = query(
          collection(db, "users"),
          where("pseudo", "==", pseudo.toLowerCase())
        );
        getDocs(q).then((value) => {
          const { size } = value;
          if (size > 0) {
            reject();
          } else {
            resolve();
          }
        });
      }),
    []
  );

  const onCheckLogged = useCallback(
    (callback: CallbackUser) => {
      if (isIos === null) return;
      if (isIos) {
        if (callBackUser === null) {
          callBackUser = callback;
          getUser((user) => {
            if (!user) {
              callback(null);
            } else {
              findUserFirebase(user.phoneNumber).then((u) =>
                callback({
                  pseudo: u.pseudo,
                  phoneNumber: u.phoneNumber,
                  uid: user.uid,
                })
              );
            }
          }, "");
        }
      } else {
        const auth = getAuth();
        auth.languageCode = "fr";
        auth.onAuthStateChanged((user) => {
          if (user?.phoneNumber) {
            findUserFirebase(user.phoneNumber).then((u) =>
              callback({
                pseudo: u.pseudo,
                phoneNumber: u.phoneNumber,
                uid: user.uid,
              })
            );
          } else {
            callback(null);
          }
        });
      }
    },
    [isIos, getUser, findUserFirebase]
  );

  const saveUserIntoDatabase = (phoneNumber: string, pseudo: string) => {
    const db = getFirestore();
    setDoc(doc(db, "users", phoneNumber), {
      phoneNumber,
      pseudo: pseudo.toLowerCase(),
    });
  };

  const signInFirebase = useCallback(
    (phoneNumber: string, page: "1" | "2"): Promise<void> =>
      new Promise((resolve, reject) => {
        const phoneNumberFormatted = formatPhoneNumberFirebase(phoneNumber);
        if (isIos) {
          verifyPhoneNumber(phoneNumberFormatted).then(resolve).catch(reject);
        } else {
          const auth = getAuth();
          auth.languageCode = "fr";
          const recaptchaVerifier = new RecaptchaVerifier(
            `recaptcha-container-${page}`,
            {
              size: "normal",
            },
            auth
          );
          signInWithPhoneNumber(auth, phoneNumberFormatted, recaptchaVerifier)
            .then((confirm) => {
              confirmationResult = confirm;
              resolve();
            })
            .catch(reject);
        }
      }),
    [isIos, verifyPhoneNumber, formatPhoneNumberFirebase]
  );

  const confirmSignInFirebase = useCallback(
    (code: string, phoneNumber: string, pseudo: string): Promise<User> =>
      new Promise((resolve, reject) => {
        if (isIos) {
          signInWithCredential(code)
            .then(() => {
              if (callBackUser) {
                getUser((user: any) => {
                  if (callBackUser) {
                    callBackUser(user);
                  }
                  if (user) {
                    resolve(user);
                  }
                }, pseudo);
              }
              saveUserIntoDatabase(
                formatPhoneNumberFirebase(phoneNumber),
                pseudo
              );
            })
            .catch(() => {
              if (callBackUser) {
                callBackUser(null);
              }
            });
        } else if (confirmationResult) {
          confirmationResult
            .confirm(code)
            .then(({ user }) => {
              saveUserIntoDatabase(
                formatPhoneNumberFirebase(phoneNumber),
                pseudo
              );
              resolve(user);
            })
            .catch(reject);
        } else {
          reject("confirmationResult undefined");
        }
      }),
    [isIos, getUser, signInWithCredential, formatPhoneNumberFirebase]
  );

  const logOut = () => {
    if (isIos) {
      signOutIos().then(() => {
        if (callBackUser) {
          callBackUser(null);
        }
      });
    } else {
      const auth = getAuth();
      signOut(auth);
    }
  };

  const deleteUserDatabase = (user: User) => {
    if (!user || !user.phoneNumber) return;

    const db = getFirestore();

    const { phoneNumber, uid } = user;

    deleteDoc(doc(db, "users", phoneNumber)).then(() => {
      onceGetListFromUser(uid).then((values) => {
        Promise.all([
          values.map(
            (value) =>
              new Promise((resolve, reject) => {
                deleteDoc(doc(db, "lists", value.id))
                  .then(resolve)
                  .catch(reject);
              })
          ),
        ]).then(() => {
          if (isIos) {
            deleteUserIos().then(() => {
              if (callBackUser) {
                callBackUser(null);
              }
            });
          } else {
            deleteUser(user);
          }
        });
      });
    });
  };

  const deleteCurrentUser = () => {
    if (isIos) {
      getUser((user: any) => {
        if (user) {
          deleteUserDatabase(user);
        }
      }, "");
    } else {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      deleteUserDatabase(user);
    }
  };

  return {
    signInFirebase,
    confirmSignInFirebase,
    findUserFirebase,
    formatPhoneNumberFirebase,
    logOut,
    onCheckLogged,
    findPseudoFirebase,
    deleteCurrentUser,
  };
};

export default useConnection;
