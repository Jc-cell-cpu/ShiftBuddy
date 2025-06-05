// app/camera.tsx
import { ms, s, vs } from "@/utils/scale";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [type, setType] = useState<CameraType>("front");
  const router = useRouter();

  if (!permission?.granted) {
    requestPermission();
    return (
      <Text style={styles.permissionText}>Requesting camera permission...</Text>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        router.replace({
          pathname: "/home/homePage",
          params: { capturedImage: photo.uri },
        });
      } catch (error) {
        console.error("Capture error:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={type} />
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.cancelBtn}
        >
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePicture} style={styles.captureBtn}>
          <Text style={styles.btnText}>Capture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: vs(20),
    paddingHorizontal: s(16),
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  captureBtn: {
    backgroundColor: "#F5D2BD",
    paddingVertical: vs(10),
    paddingHorizontal: s(20),
    borderRadius: ms(8),
  },
  cancelBtn: {
    backgroundColor: "#FFF",
    paddingVertical: vs(10),
    paddingHorizontal: s(20),
    borderRadius: ms(8),
  },
  btnText: {
    fontWeight: "bold",
    fontSize: ms(14),
    color: "#000",
  },
  permissionText: {
    fontSize: ms(16),
    textAlign: "center",
    marginTop: vs(30),
    color: "#555",
  },
});
