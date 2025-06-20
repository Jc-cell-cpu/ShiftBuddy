import HomePageSkeleton from "@/components/HomePageSkeleton";
import { isTokenExpired } from "@/utils/token";
import { Slot, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export default function AuthLayout() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token && !isTokenExpired(token)) {
        router.push("/home/homePage");
      }
      setCheckingAuth(false);
    };

    checkToken();
  }, [router]);

  if (checkingAuth) {
    // return (
    //   <View
    //     style={{
    //       flex: 1,
    //       justifyContent: "center",
    //       alignItems: "center",
    //     }}
    //   >
    //     <LoadingScreen size="lg" />
    //   </View>
    // );
    return <HomePageSkeleton />;
  }
  return <Slot />;
}
