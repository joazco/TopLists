import { SocialSharing } from "@ionic-native/social-sharing";

import { List } from "../../types";

const formatMessage = (list: List) => `${list.title}\n\n\t${
  list.description
}\nCréé par ${list.author}\n\n${list.items
  .map((item) => `\t#${item.order} ${item.title}\n`)
  .join("")}
  Liste créé grâce à l'application TopLists
`;

const useShareTop = () => {
  const shareList = (list: List) => {
    SocialSharing.share(
      formatMessage(list),
      list.title,
      [],
      `https://toplists-6e595.web.app/${list.id}`
    ).catch((err) => alert(JSON.stringify(err)));
  };

  return shareList;
};

export default useShareTop;
