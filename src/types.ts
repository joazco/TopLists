import { RouteComponentProps } from "react-router";

export type UserLocalStorage = {
  phoneNumber: string;
  pseudo: string;
};
export type UserFirebaseStorage = UserLocalStorage & {
  uid: string;
};
export type Step = 0 | 1 | 2 | 3;
export type TopItem = {
  title: string;
  order: number;
  description?: string;
  img?: string;
};
export type List = {
  title: string;
  description?: string;
  openPublic: boolean;
  items: TopItem[];
  tags: string[];
  topNumber: 5 | 10;
  author: string;
  id: string;
  createDate: string;
};
export type ListFirebase = List & {
  id: string;
  userId: string;
};
export type CallbackUser = (user: UserFirebaseStorage | null) => void;
export type SearchType = {
  item: TopItem;
  q: string;
} | null;
export type GoogleSearchResponse = {
  items: {
    link: string;
  }[];
};
/** Props */
export type ConnectionViewProps = {
  page: "1" | "2";
  onConnected: (user: UserFirebaseStorage) => void;
};
export type ListFormProps = {
  list: List;
  step: Step;
  setStep: (step: Step) => void;
  handleChangeTitle: (title: string) => void;
  handleChangeDescription: (description: string) => void;
  handleChangeOpenPublic: (openPublic: boolean) => void;
  handleChangeTopNumber: (topNumberBoolean: boolean) => void;
  handleAddTag: (tag: string) => void;
  handleRemoveTag: (tag: string) => void;
  handleChangeTitleItem: (topItem: TopItem, title: string) => void;
  handleChangeImgItem: (topItem: TopItem, img: string) => void;
  handleChangeDescriptionItem: (topItem: TopItem, description: string) => void;
};
export type StepComponentProps = Pick<ListFormProps, "step"> & {
  onChangeStep: ListFormProps["setStep"];
};
export type RadioButtonComponentProps = {
  choice1Label: string;
  choice2Label: string;
  value: boolean;
  preset?: "boolean" | "choice";
  onChange: (value: boolean) => void;
};
export type ListViewComponentProps = {
  list: List;
  preset?: "default" | "form";
  onCloseModal?: () => void;
};
export type ProfileViewProps = RouteComponentProps & {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};
export type ProfileInfoComponentProps = Pick<
  ProfileViewProps,
  "darkMode" | "setDarkMode"
> & {
  user: UserFirebaseStorage;
};
export type PseudoComponentProps = {
  pseudo: string;
};
export type ListComponentProps = {
  lists: List[];
  preset?: "default" | "allPublic";
  onClickList: (list: List) => void;
};
export type AppendViewProps = RouteComponentProps & {
  defaultStep?: Step;
  defaultListProps?: List;
  isEdit?: boolean;
  onCloseModal?: () => void;
};
export type ListViewProps = {
  darkMode: boolean;
};
