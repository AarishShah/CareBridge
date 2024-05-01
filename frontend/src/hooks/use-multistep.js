import { useState } from "react";

export default function useMultistepForm(steps) {
  const [currentStep, setCurrentStep] = useState(0);

  function next() {
    setCurrentStep((prevIndex) => {
      if (prevIndex >= steps.length - 1) return prevIndex;
      return prevIndex + 1;
    });
  }

  function back() {
    setCurrentStep((prevIndex) => {
      if (prevIndex < 0) return prevIndex;
      return prevIndex - 1;
    });
  }

  function goto(index) {
    setCurrentStep(index);
  }

  return {
    currentStep,
    step: steps[currentStep],
    steps,
    next,
    back,
    goto,
  };
}
