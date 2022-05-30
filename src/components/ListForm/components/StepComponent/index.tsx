import { StepComponentProps } from "../../../../types";
import "../../index.scss";

const StepComponent = (props: StepComponentProps) => {
  const { step, onChangeStep } = props;
  return (
    <section className="form-step">
      <div className="form-progress">
        <progress
          className="form-progress-bar"
          max="100"
          value={step * 50}
          aria-labelledby="form-progress-completion"
        ></progress>

        <div
          className={`form-progress-indicator one ${
            step === 0 ? "active" : ""
          } ${step <= 2 ? "focus" : ""}`}
          onClick={() => onChangeStep(0)}
        ></div>
        <div
          className={`form-progress-indicator two ${
            step === 1 ? "active" : ""
          } ${step >= 1 ? "focus" : ""}`}
          onClick={() => onChangeStep(1)}
        ></div>
        <div
          className={`form-progress-indicator three ${
            step === 2 ? "active" : ""
          } ${step === 2 ? "focus" : ""}`}
          onClick={() => onChangeStep(2)}
        ></div>
      </div>
    </section>
  );
};

export default StepComponent;
