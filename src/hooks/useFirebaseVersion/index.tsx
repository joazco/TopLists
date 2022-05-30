import { useCallback } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const useFirebaseVersion = () => {
  const checkVersion = useCallback(
    (version: string): Promise<string> =>
      new Promise((resolve) => {
        const db = getFirestore();
        getDoc(doc(db, "version", "current")).then((value) => {
          const data = value.data();
          if (data) {
            resolve(data.value);
          }
        });
      }),
    []
  );

  return checkVersion;
};

export default useFirebaseVersion;
