import { ms, s, vs } from "@/utils/scale";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, View } from "react-native";
import StepIndicator from "react-native-step-indicator";

const labels = ["Start Journey", "Reach", "Start Shift", "Process", "End"];

interface JourneyStepperProps {
  currentStep: number;
}

const JourneyStepper: React.FC<JourneyStepperProps> = ({ currentStep }) => {
  const customStyles = {
    stepIndicatorSize: s(34),
    currentStepIndicatorSize: s(34),
    separatorStrokeWidth: 6,
    currentStepStrokeWidth: 3,
    stepStrokeWidth: 2,
    stepStrokeCurrentColor: "#FFFFFF",
    stepStrokeFinishedColor: "#FFFFFF",
    stepStrokeUnFinishedColor: "#FFFFFF",
    separatorFinishedColor: "#69417E",
    separatorUnFinishedColor: "#FFFFFF",
    stepIndicatorFinishedColor: "#69417E",
    stepIndicatorUnFinishedColor: "#FFFFFF",
    stepIndicatorCurrentColor: "#FFFFFF",
    // Hide step numbers safely
    stepIndicatorLabelFontSize: 1,
    stepIndicatorLabelCurrentColor: "transparent",
    stepIndicatorLabelFinishedColor: "transparent",
    stepIndicatorLabelUnFinishedColor: "transparent",
    labelFontSize: ms(5),
    labelFontFamily: "InterMedium",
    labelColor: "#000",
    currentStepLabelColor: "#000",
  };

  const renderStepIndicator = ({ stepStatus }: any) => {
    const isCompleted = stepStatus === "finished";

    return (
      <View
        style={{
          width: s(28),
          height: s(28),
          //   borderRadius: isCompleted ? s(14) : s(14),
          //   borderWidth: isCompleted ? s(2) : 0,
          //   borderColor: isCompleted ? "#FFFFFF" : "#FFFFFF",
          backgroundColor: isCompleted ? "#69417E" : "#FFFFFF",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isCompleted && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StepIndicator
        stepCount={labels.length}
        currentPosition={currentStep}
        customStyles={customStyles}
        labels={labels}
        renderStepIndicator={renderStepIndicator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: vs(16),
    paddingHorizontal: s(1),
    backgroundColor: "transparent",
  },
});

export default JourneyStepper;
