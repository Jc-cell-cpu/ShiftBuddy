import StartJourneyIcon from "@/assets/Truck.svg";
import StartShiftIcon from "@/assets/briefcase.svg";
import ReachIcon from "@/assets/security-user.svg";
import {
  default as EndIcon,
  default as ProcessIcon,
} from "@/assets/send-2.svg";
import { useJourneyStore } from "@/store/useJourneyStore";
import { ms, s, vs } from "@/utils/scale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import StepIndicator from "react-native-step-indicator";
import Svg, { Path } from "react-native-svg";

const labels = ["Start Journey", "Reach", "Start Shift", "Process", "End"];

// Map labels to SVG components
const labelIcons: {
  [key: string]: React.FC<React.ComponentProps<typeof Svg>>;
} = {
  "Start Journey": StartJourneyIcon,
  Reach: ReachIcon,
  "Start Shift": StartShiftIcon,
  Process: ProcessIcon,
  End: EndIcon,
};

const VerticalJourneyStepper: React.FC = () => {
  const { currentStep } = useJourneyStore();

  const customStyles = {
    stepIndicatorSize: s(34),
    currentStepIndicatorSize: s(34),
    separatorStrokeWidth: 6,
    currentStepStrokeWidth: 3,
    stepStrokeWidth: 2,
    stepStrokeCurrentColor: "#DDDDDD",
    stepStrokeFinishedColor: "#69417E",
    stepStrokeUnFinishedColor: "#DDDDDD",
    separatorFinishedColor: "#69417E",
    separatorUnFinishedColor: "#DDDDDD",
    stepIndicatorFinishedColor: "#69417E",
    stepIndicatorUnFinishedColor: "#DDDDDD",
    stepIndicatorCurrentColor: "#DDDDDD",
    // Hide step numbers safely
    stepIndicatorLabelFontSize: ms(2), // Safe value to avoid Hermes error
    stepIndicatorLabelCurrentColor: "transparent",
    stepIndicatorLabelFinishedColor: "transparent",
    stepIndicatorLabelUnFinishedColor: "transparent",
    labelFontSize: ms(14),
    labelFontFamily: "InterMedium",
    labelColor: "#000",
    currentStepLabelColor: "#69417E", // Highlight current step label
    // Vertical specific styles
    labelAlign: "flex-start" as const,
    stepIndicatorLabelAlign: "center" as const,
  };

  const renderStepIndicator = ({ stepStatus }: { stepStatus: string }) => {
    const isCompleted = stepStatus === "finished";

    return (
      <View
        style={{
          width: s(28),
          height: s(28),
          backgroundColor: isCompleted ? "#69417E" : "#DDDDDD",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: s(14),
          borderWidth: isCompleted ? s(2) : 0,
          borderColor: "#69417E",
        }}
      >
        {isCompleted && (
          <Svg width={s(16)} height={s(16)} viewBox="0 0 24 24" fill="none">
            <Path
              d="M5 13L9 17L19 7"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </View>
    );
  };

  const renderLabel = ({
    position,
    label,
    stepStatus,
  }: {
    position: number;
    label: string;
    stepStatus: string;
  }) => {
    const isCurrent = position === currentStep;
    const isCompleted = stepStatus === "finished";
    const IconComponent = labelIcons[label] || EndIcon; // Fallback to EndIcon

    return (
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.labelText,
            {
              color: isCurrent
                ? customStyles.currentStepLabelColor
                : customStyles.labelColor,
              fontFamily: customStyles.labelFontFamily,
              fontSize: customStyles.labelFontSize,
            },
          ]}
        >
          {label}
        </Text>
        {isCompleted && <IconComponent width={s(20)} height={s(20)} />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StepIndicator
        direction="vertical"
        stepCount={labels.length}
        currentPosition={currentStep}
        customStyles={customStyles}
        labels={labels}
        renderStepIndicator={renderStepIndicator}
        renderLabel={renderLabel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: vs(16),
    paddingHorizontal: s(16),
    backgroundColor: "transparent",
    minHeight: vs(250), // Ensure enough space for vertical layout
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Space between label and icon
    paddingLeft: s(10), // Space between step indicator and label
    width: s(250), // Fixed width to ensure consistent right alignment
  },
  labelText: {
    flexShrink: 1, // Allow text to shrink if needed
  },
  labelIcon: {
    marginLeft: s(8), // Space between text and icon
  },
});

export default VerticalJourneyStepper;
