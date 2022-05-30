import { RadioButtonComponentProps } from "../../types";
import "./index.scss";

const RadioButtonComponent = (props: RadioButtonComponentProps) => {
  const {
    choice1Label,
    choice2Label,
    value,
    preset = "boolean",
    onChange,
  } = props;
  return (
    <div className="form-field-radio">
      <input
        type="radio"
        name={`rdo-${choice1Label}-${choice2Label}`}
        id={`choice1-${choice1Label}`}
        checked={value}
        className="choice2"
        onChange={() => onChange(true)}
      />
      <input
        type="radio"
        name={`rdo-${choice1Label}-${choice2Label}`}
        className="choice1"
        id={`choice2-${choice2Label}`}
        checked={!value}
        onChange={() => onChange(false)}
      />
      <div className={`switch ${preset}`}>
        <label
          htmlFor={`choice1-${choice1Label}`}
          className={`choice1-label ${value ? "active" : ""}`}
        >
          {choice1Label}
        </label>
        <label
          htmlFor={`choice2-${choice2Label}`}
          className={`choice2-label ${value ? "" : "active"}`}
        >
          {choice2Label}
        </label>
        {preset === "boolean" && <span></span>}
      </div>
    </div>
  );
};

export default RadioButtonComponent;
