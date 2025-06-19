import LoadingScreen from "@/components/LoadingScreen";
import { Slot, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function AuthLayout() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token) {
        router.replace("/home/homePage");
      }
      setCheckingAuth(false);
    };

    checkToken();
  }, [router]);

  if (checkingAuth) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingScreen size="lg" />
      </View>
    );
  }
  return <Slot />;
}
