import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import { AppContext } from "../../contexts";
import { AppendViewProps, List, Step, TopItem } from "../../types";
import {
  useFirebaseList,
  useGoogleAppleTester,
  useLocalDatabase,
  useShareTop,
} from "../../hooks";
import { useIonAlert, useIonToast } from "@ionic/react";

const keyDatabase = "curernt_list";
const defaultList: List = {
  title: "",
  openPublic: true,
  description: "",
  items: [
    {
      order: 1,
      title: "",
    },
  ],
  tags: [],
  topNumber: 5,
  author: "",
  id: "",
  createDate: new Date().toString(),
};

const useAppendView = (props: AppendViewProps) => {
  const {
    history,
    defaultStep = 0,
    defaultListProps = defaultList,
    isEdit = true,
    onCloseModal,
  } = props;
  const appContext = useContext(AppContext);
  const { saveList, editList, removeList, getListFromUser } = useFirebaseList();
  const [presentConfirm] = useIonAlert();
  const [presentToastConfirm, dismiss] = useIonToast();
  const { setItem, getItem } = useLocalDatabase();
  const { isTester } = useGoogleAppleTester();
  const share = useShareTop();
  const { user, setUser } = appContext;
  const [loadList, setLoadList] = useState<boolean>(true);
  const [step, setStepState] = useState<Step>(defaultStep);
  const [list, setList] = useState<List>(defaultListProps);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [maxListsDone, setMaxListDone] = useState<boolean>(false);

  /** */
  const title = useMemo(
    () => (isEdit ? "Édition de votre top" : "Création de votre prochain top"),
    [isEdit]
  );

  const handleChangeTitle = (title: string) => setList({ ...list, title });
  const handleChangeDescription = (description: string) =>
    setList({ ...list, description });
  const handleChangeOpenPublic = (openPublic: boolean) =>
    setList({ ...list, openPublic });
  const handleChangeTopNumber = (topNumberBoolean: boolean) =>
    setList({
      ...list,
      topNumber: topNumberBoolean ? 5 : 10,
    });
  const handleAddTag = (tag: string) =>
    setList((l) => {
      const findTag = l.tags.find((t) => t === tag);
      if (findTag) return l;
      l.tags = l.tags.concat(tag);
      return JSON.parse(JSON.stringify(l));
    });
  const handleRemoveTag = (tag: string) =>
    setList((l) => {
      l.tags = l.tags.filter((t) => t !== tag);
      return JSON.parse(JSON.stringify(l));
    });
  const handleChangeTitleItem = (topItem: TopItem, title: string) =>
    setList((l) => {
      const itemFind = l.items.find((item) => topItem.order === item.order);
      if (!itemFind) return l;
      itemFind.title = title;
      return JSON.parse(JSON.stringify(l));
    });
  const handleChangeImgItem = (topItem: TopItem, img: string) =>
    setList((l) => {
      const itemFind = l.items.find((item) => topItem.order === item.order);
      if (!itemFind) return l;
      itemFind.img = img;
      return JSON.parse(JSON.stringify(l));
    });
  const handleChangeDescriptionItem = (topItem: TopItem, description: string) =>
    setList((l) => {
      const itemFind = l.items.find((item) => topItem.order === item.order);
      if (!itemFind) return l;
      itemFind.description = description;
      return JSON.parse(JSON.stringify(l));
    });

  const canUpStep = useCallback(
    (s: Step) => {
      const { title, items, topNumber } = list;
      const itemFilters = items.filter((_item, i) => i < topNumber);
      let can: boolean = false;
      if (s >= 0 && title !== "") {
        can = true;
      }
      if (
        can &&
        s === 2 &&
        itemFilters.length === topNumber &&
        !itemFilters.find((item) => item.title === "")
      ) {
        can = true;
      } else if (s === 2) {
        can = false;
      }
      if (can && s === 2) can = true;
      return can;
    },
    [list]
  );

  const showToastConfirm = () => {
    presentToastConfirm({
      buttons: [{ text: "OK", handler: () => dismiss() }],
      message: "Votre top a été enregistré",
      position: "top",
      duration: 1500,
    });
  };

  const setStep = (s: Step) => {
    if (s === 3 && user) {
      setLoadingSave(true);
      if (isEdit) {
        editList({
          ...list,
          userId: user.uid,
          openPublic: isTester ? false : list.openPublic,
        })
          .then(onCloseModal)
          .finally(() => showToastConfirm());
      } else {
        saveList({
          ...list,
          userId: user.uid,
          openPublic: isTester ? false : list.openPublic,
        })
          .then(() => {
            setStep(0);
            setList(defaultListProps);
          })
          .finally(() => {
            setLoadingSave(false);
            showToastConfirm();
          });
      }
    } else if (canUpStep(s)) {
      setStepState(s);
    }
  };

  const clearForm = () => {
    if (isEdit) {
      presentConfirm({
        header: "Supprimer la liste",
        message: "Êtes-vous sûr de vouloir supprimer la liste?",
        buttons: [
          "Annuler",
          {
            text: "Confirmer",
            handler: () => {
              removeList(list.id).then(onCloseModal);
            },
          },
        ],
      });
    } else {
      presentConfirm({
        header: "Vider le formulaire",
        message: "Êtes-vous sûr de vouloir vider le formulaire?",
        buttons: [
          "Annuler",
          {
            text: "Valider",
            handler: () => {
              setStep(0);
              setList(defaultListProps);
            },
          },
        ],
      });
    }
  };

  // listen on back button pressed
  useEffect(() => {
    document.addEventListener("ionBackButton", (ev: any) => {
      ev.detail.register(10, () => {
        const {
          location: { pathname },
        } = history;
        if (pathname === "/create" && step > 0) {
          const futurStep = step - 1;
          if (futurStep === 0) {
            document.removeEventListener("ionBackButton", () => {});
          }
          setStepState(futurStep as Step);
        } else {
          history.goBack();
        }
      });
    });
    return () => {
      document.removeEventListener("ionBackButton", () => {});
    };
  }, [history, step]);

  // save list into database on all changes
  useEffect(() => {
    if (!loadList && !isEdit) {
      setItem<List>(keyDatabase, list);
    }
  }, [isEdit, list, loadList, setItem]);

  // get items from database in start of app
  useEffect(() => {
    if (!isEdit) {
      getItem<List>(keyDatabase)
        .then((l) => {
          if (l) {
            setList({ ...l, author: user?.pseudo || "" });
          }
        })
        .finally(() => setLoadList(false));
    } else {
      setLoadList(false);
    }
  }, [isEdit, getItem]);

  // Append new item if last item title is not empty
  useEffect(() => {
    const items = list.items;
    const lastItem = items[items.length - 1];
    if (lastItem === undefined) {
      return;
    } else if (lastItem.title !== "" && list.topNumber !== items.length) {
      items.push({
        order: lastItem.order + 1,
        title: "",
      });
      setList(JSON.parse(JSON.stringify(list)));
    }
  }, [list]);

  useEffect(() => {
    if (user) {
      setList((l) => ({ ...l, author: user.pseudo }));
    }
  }, [user]);

  useEffect(() => {
    if (user && !isEdit) {
      getListFromUser(user.uid, (lists) => {
        if (lists.length >= 10) {
          setMaxListDone(true);
        }
      });
    }
  }, [user, isEdit, getListFromUser]);

  return {
    user,
    list,
    step,
    loadingSave,
    title,
    isEdit,
    maxListsDone,
    setUser,
    setStep,
    handleChangeTitle,
    handleChangeDescription,
    handleChangeOpenPublic,
    handleChangeTopNumber,
    handleAddTag,
    handleRemoveTag,
    handleChangeTitleItem,
    handleChangeImgItem,
    handleChangeDescriptionItem,
    canUpStep,
    clearForm,
    onCloseModal,
    share,
  };
};

export default useAppendView;
