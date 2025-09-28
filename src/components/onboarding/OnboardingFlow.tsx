import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WelcomeStep } from "./steps/WelcomeStep";
import { FeedStep } from "./steps/FeedStep";
import { TimelineStep } from "./steps/TimelineStep";
import { ProfileStep } from "./steps/ProfileStep";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const steps = [
  { id: 'welcome', component: WelcomeStep },
  { id: 'feed', component: FeedStep },
  { id: 'timeline', component: TimelineStep },
  { id: 'profile', component: ProfileStep },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Progress Bar */}
      <div className="safe-area-top px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-white w-8' 
                    : 'bg-white/30 w-2'
                }`}
              />
            ))}
          </div>
          <span className="text-white/80 text-sm font-medium">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md animate-fade-in">
            <CurrentStepComponent />
          </div>
        </div>

        {/* Navigation */}
        <div className="safe-area-bottom py-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <Button
              size="sm"
              onClick={handleNext}
              className="bg-white text-primary hover:bg-white/90 glow-primary"
            >
              {isLastStep ? 'Enter App' : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}