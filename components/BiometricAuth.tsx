import React from "react";
import { Alert } from "react-native";
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";

interface BiometricAuthProps {
  onAuthComplete: (success: boolean) => void;
  promptMessage?: string;
  fallbackMessage?: string;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onAuthComplete,
  promptMessage = "Authenticate to view document",
  fallbackMessage = "Biometrics failed, please use your device PIN or password",
}) => {
  React.useEffect(() => {
    const authenticate = async () => {
      const rnBiometrics = new ReactNativeBiometrics();
      try {
        const { available, biometryType } =
          await rnBiometrics.isSensorAvailable();

        if (!available) {
          console.log("No authentication methods available on this device.");
          onAuthComplete(true); // Allow access if no auth methods
          return;
        }

        const authConfig = {
          promptMessage,
          fallbackPromptMessage: fallbackMessage,
        };

        if (
          biometryType === BiometryTypes.TouchID ||
          biometryType === BiometryTypes.FaceID ||
          biometryType === BiometryTypes.Biometrics
        ) {
          const { success } = await rnBiometrics.simplePrompt(authConfig);
          console.log(
            `Biometric authentication ${success ? "successful" : "failed"}`
          );
          onAuthComplete(success);
        } else {
          const { success } = await rnBiometrics.simplePrompt({
            ...authConfig,
            promptMessage: "Enter your device PIN or password to view document",
          });
          console.log(
            `Device lock authentication ${success ? "successful" : "failed"}`
          );
          onAuthComplete(success);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        Alert.alert("Error", "Failed to authenticate. Please try again.");
        onAuthComplete(false);
      }
    };

    authenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // This component doesn't render anything
};

export default BiometricAuth;
