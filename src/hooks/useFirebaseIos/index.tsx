import { FirebaseX } from "@ionic-native/firebase-x";
import { useCallback } from "react";
import { CallbackUser } from "../../types";

FirebaseX.setLanguageCode("fr");
let credential: any = null;

const useFirebaseIos = () => {
  const verifyPhoneNumber = useCallback(
    (phoneNumber: string): Promise<void> =>
      new Promise((resolve, reject) => {
        FirebaseX.verifyPhoneNumber(phoneNumber, 5000)
          .then((value) => {
            credential = value;
            resolve();
          })
          .catch(reject);
      }),
    []
  );

  const signInWithCredential = useCallback(
    (code: string): Promise<void> =>
      new Promise((resolve, reject) => {
        if (!credential) {
          reject();
        } else {
          FirebaseX.signInWithCredential({ ...credential, code })
            .then(resolve)
            .catch(reject);
        }
      }),
    []
  );

  const getUser = useCallback((callback: CallbackUser, pseudo: string) => {
    FirebaseX.getCurrentUser().then((user) => {
      if (typeof user === "string" || !user.phoneNumber || !user.uid) {
        callback(null);
      } else {
        callback({
          phoneNumber: user.phoneNumber,
          pseudo,
          uid: user.uid,
        });
      }
    });
  }, []);

  const signOut = useCallback(() => FirebaseX.signOutUser(), []);
  const deleteUser = useCallback(() => FirebaseX.deleteUser(), []);

  return {
    verifyPhoneNumber,
    signInWithCredential,
    signOut,
    deleteUser,
    getUser,
  };
};

export default useFirebaseIos;
