import { ms, s, vs } from "@/utils/scale";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>("front");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();

  if (!permission?.granted) {
    requestPermission();
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.permissionText}>
          Requesting camera permission...
        </Text>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
      } catch (error) {
        console.error("Capture error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const confirmPicture = () => {
    if (photoUri) {
      router.replace({
        pathname: "/home/homePage",
        params: { capturedImage: photoUri },
      });
    }
  };

  const retakePicture = () => {
    setPhotoUri(null);
  };

  const flipCamera = () => {
    setType((prev) => (prev === "back" ? "front" : "back"));
  };

  if (photoUri) {
    // Preview screen
    return (
      <SafeAreaView style={styles.previewContainer}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Image source={{ uri: photoUri }} style={styles.previewImage} />
        <View style={styles.previewControls}>
          <TouchableOpacity onPress={retakePicture} style={styles.retakeBtn}>
            <MaterialCommunityIcons
              name="camera-retake-outline"
              size={32}
              color="#fff"
            />
            {/* <Text style={styles.previewBtnText}>Retake</Text> */}
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmPicture} style={styles.confirmBtn}>
            <Ionicons name="checkmark-circle-outline" size={32} color="#fff" />
            {/* <Text style={styles.previewBtnText}>Use Photo</Text> */}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={type} />
      <View style={styles.overlay}>
        <Text style={styles.instructionText}>
          Align your face within the frame
        </Text>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={flipCamera}
            style={styles.controlBtn}
            disabled={true}
          >
            <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.captureBtn}>
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Ionicons name="radio-button-on" size={42} color="#000" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.controlBtn}
          >
            <Ionicons name="close-outline" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingBottom: vs(40),
    paddingTop: vs(60),
    paddingHorizontal: s(20),
    backgroundColor: "transparent",
  },
  instructionText: {
    textAlign: "center",
    color: "#fff",
    fontSize: ms(16),
    fontWeight: "600",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: vs(6),
    borderRadius: ms(8),
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: ms(10),
    borderRadius: ms(40),
    borderColor: "rgba(255,255,255,0.4)",
    borderWidth: 1,
  },
  captureBtn: {
    backgroundColor: "#F5D2BD",
    width: ms(70),
    height: ms(70),
    borderRadius: ms(35),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewImage: {
    flex: 1,
    resizeMode: "cover",
    borderRadius: ms(12),
  },
  previewControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: vs(20),
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  retakeBtn: {
    alignItems: "center",
    padding: ms(12),
    borderRadius: ms(40),
  },
  confirmBtn: {
    alignItems: "center",
    padding: ms(12),
    borderRadius: ms(40),
  },
  previewBtnText: {
    color: "#fff",
    marginTop: vs(4),
    fontSize: ms(13),
  },
  permissionText: {
    fontSize: ms(16),
    textAlign: "center",
    marginTop: vs(30),
    color: "#aaa",
  },
});
