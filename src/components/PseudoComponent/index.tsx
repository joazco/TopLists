import { PseudoComponentProps } from "../../types";

import "./index.scss";

const PseudoComponent = ({ pseudo }: PseudoComponentProps) => {
  return (
    <div className="pseudo-preview">
      {pseudo[0]}
      {pseudo[1]}
    </div>
  );
};

export default PseudoComponent;
