import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  onSnapshot,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { List, ListFirebase } from "../../types";

let lastRequest: any = null;
const limitValue: number = 10;

const useFirebaseList = () => {
  const [allList, setAllList] = useState<List[]>([]);
  const saveList = (list: Omit<ListFirebase, "id">): Promise<ListFirebase> =>
    new Promise((resolve, reject) => {
      const db = getFirestore();
      addDoc(collection(db, "lists"), list).then((docRef) => {
        const { id } = docRef;
        setDoc(doc(db, "lists", `${id}`), {
          ...list,
          id,
          title: list.title.toLowerCase(),
        })
          .then(() => resolve({ ...list, id }))
          .catch(reject);
      });
    });

  const editList = (list: ListFirebase): Promise<void> => {
    const db = getFirestore();
    return setDoc(doc(db, "lists", list.id), {
      ...list,
      title: list.title.toLowerCase(),
    });
  };

  const getListFromUser = useCallback(
    (userId: string, callback: (lists: List[]) => void): void => {
      const db = getFirestore();
      const q = query(collection(db, "lists"), where("userId", "==", userId));

      onSnapshot(q, (querySnapshot) => {
        callback(
          querySnapshot.docs.map((snapShow) => snapShow.data()) as List[]
        );
      });
    },
    []
  );

  const onceGetListFromUser = useCallback(
    (userId: string): Promise<List[]> =>
      new Promise((resolve, reject) => {
        const db = getFirestore();
        const q = query(collection(db, "lists"), where("userId", "==", userId));
        getDocs(q)
          .then((values) => {
            resolve(values.docs.map((snapShow) => snapShow.data()) as List[]);
          })
          .catch(reject);
      }),
    []
  );

  const generateQuery = useCallback((startAfterValue: any = null) => {
    const db = getFirestore();
    const queryConstraints: QueryConstraint[] = [
      where("openPublic", "==", true),
      orderBy("createDate"),
      limit(limitValue),
    ];
    if (startAfterValue) {
      queryConstraints.push(startAfter(startAfterValue));
    }
    return query(collection(db, "lists"), ...queryConstraints);
  }, []);

  const getListPublic = useCallback(
    (titleFilter: string = ""): Promise<List[]> =>
      new Promise((resolve, reject) => {
        if (titleFilter) {
          resolve(
            allList.filter((l) =>
              l.title.toLowerCase().includes(titleFilter.toLowerCase())
            )
          );
        } else {
          const q = generateQuery();
          getDocs(q)
            .then((querySnapshot) => {
              lastRequest = querySnapshot.docs[querySnapshot.docs.length - 1];
              resolve(
                querySnapshot.docs.map((snapShow) => snapShow.data()) as List[]
              );
            })
            .catch(reject);
        }
      }),
    [allList, generateQuery]
  );

  const getListPublicNext = useCallback(
    (titleFilter: string = ""): Promise<List[]> =>
      new Promise((resolve, reject) => {
        const q = generateQuery(lastRequest);
        getDocs(q)
          .then((querySnapshot) => {
            lastRequest = querySnapshot.docs[querySnapshot.docs.length - 1];
            resolve(
              querySnapshot.docs.map((snapShow) => snapShow.data()) as List[]
            );
          })
          .catch(reject);
      }),
    [generateQuery]
  );

  const getListFromId = useCallback((id: string) => {
    const db = getFirestore();
    return getDoc(doc(db, "lists", id));
  }, []);

  const removeList = useCallback((listId: string) => {
    const db = getFirestore();
    return deleteDoc(doc(db, "lists", listId));
  }, []);

  useEffect(() => {
    const db = getFirestore();
    getDocs(collection(db, "lists")).then((querySnapshot) => {
      setAllList(
        querySnapshot.docs.map((snapShow) => snapShow.data()) as List[]
      );
    });
  }, []);

  return {
    saveList,
    editList,
    getListFromUser,
    onceGetListFromUser,
    getListPublic,
    getListPublicNext,
    removeList,
    getListFromId,
  };
};

export default useFirebaseList;
