// import Home from "@/app/home/homePage";
// import { ms, s, vs } from "@/utils/scale";
// import { Ionicons } from "@expo/vector-icons";
// import { BlurView } from "@react-native-community/blur";
// import {
//   BottomTabBarProps,
//   createBottomTabNavigator,
// } from "@react-navigation/bottom-tabs";
// import React from "react";
// import {
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const Tab = createBottomTabNavigator();

// const CalendarScreen = () => (
//   <View style={styles.screen}>
//     <Text>Calendar</Text>
//   </View>
// );

// const SearchScreen = () => (
//   <View style={styles.screen}>
//     <Text>Search</Text>
//   </View>
// );

// const GridScreen = () => (
//   <View style={styles.screen}>
//     <Text>Grid</Text>
//   </View>
// );

// const CustomTabBar: React.FC<BottomTabBarProps> = ({
//   state,
//   descriptors,
//   navigation,
// }) => {
//   return (
//     <View style={styles.tabBarContainer}>
//       <View style={styles.glassWrapper}>
//         <View style={{ borderRadius: s(30), overflow: "hidden" }}>
//           <BlurView
//             style={StyleSheet.absoluteFill}
//             blurType="light"
//             blurAmount={5}
//             // overlayColor={
//             //   Platform.OS === "android"
//             //     ? "rgba(255,255,255,0.2)"
//             //     : "transparent"
//             // }
//           />
//           <View style={styles.tabContent}>
//             {state.routes.map((route, index) => {
//               const { options } = descriptors[route.key];
//               const label = options.tabBarLabel ?? options.title ?? route.name;
//               const isFocused = state.index === index;

//               const onPress = () => {
//                 if (!isFocused) {
//                   navigation.navigate(route.name);
//                 }
//               };

//               const iconName =
//                 route.name === "Home"
//                   ? isFocused
//                     ? "home"
//                     : "home-outline"
//                   : route.name === "Calendar"
//                   ? isFocused
//                     ? "calendar"
//                     : "calendar-outline"
//                   : route.name === "Search"
//                   ? isFocused
//                     ? "search"
//                     : "search-outline"
//                   : isFocused
//                   ? "grid"
//                   : "grid-outline";

//               return (
//                 <TouchableOpacity
//                   key={route.key}
//                   onPress={onPress}
//                   style={styles.tabButton}
//                 >
//                   {isFocused ? (
//                     <View style={styles.focusedTab}>
//                       <Ionicons
//                         name={iconName as any}
//                         size={20}
//                         color="#69417E"
//                       />
//                       <Text style={styles.focusedLabel}>
//                         {typeof label === "string" ? label : null}
//                       </Text>
//                     </View>
//                   ) : (
//                     <Ionicons
//                       name={iconName as any}
//                       size={20}
//                       color="#1C1C1C"
//                     />
//                   )}
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default function App() {
//   return (
//     // <NavigationIndependentTree>
//     //   <NavigationContainer>
//     <Tab.Navigator
//       screenOptions={{ headerShown: false }}
//       tabBar={(props) => <CustomTabBar {...props} />}
//     >
//       <Tab.Screen name="Home" component={Home} />
//       <Tab.Screen name="Calendar" component={CalendarScreen} />
//       <Tab.Screen name="Search" component={SearchScreen} />
//       <Tab.Screen name="Grid" component={GridScreen} />
//     </Tab.Navigator>
//     //   </NavigationContainer>
//     // </NavigationIndependentTree>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     // backgroundColor: "#F9F5FC",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   tabBarContainer: {
//     position: "absolute",
//     bottom: vs(50),
//     left: s(16),
//     right: s(16),
//     zIndex: 10,
//   },
//   glassWrapper: {
//     borderRadius: s(30),
//     overflow: "hidden",
//     // backgroundColor: "rgba(255, 255, 255, 0.1)",
//     ...Platform.select({
//       android: { elevation: 8 },
//       ios: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.15,
//         shadowRadius: 10,
//       },
//     }),
//   },

//   tabInnerContainer: {
//     borderRadius: s(30),
//     overflow: "hidden",
//   },

//   tabContent: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     paddingVertical: vs(10),
//     paddingHorizontal: s(10),
//   },
//   tabButton: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   tabItem: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   focusedTab: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F1CBB8",
//     borderRadius: 999,
//     paddingHorizontal: s(14),
//     paddingVertical: vs(5),
//     gap: s(5),
//   },

//   focusedLabel: {
//     fontSize: ms(10),
//     color: "#69417E",
//     fontWeight: "700",
//     fontFamily: "InterVariable",
//   },
//   blurWrapper: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: vs(10),
//     paddingHorizontal: s(12),
//     borderRadius: s(35),
//     backgroundColor: "rgba(255, 255, 255, 0.1)", // light overlay tint
//   },

//   // tabItem: {
//   //   flex: 1,
//   //   alignItems: "center",
//   //   paddingVertical: vs(10),
//   //   paddingHorizontal: s(10),
//   //   borderRadius: s(24),
//   //   flexDirection: "row",
//   //   justifyContent: "center",
//   // },
//   activeTab: {
//     backgroundColor: "#F1CBB8",
//     paddingHorizontal: s(15),
//   },
//   label: {
//     marginLeft: s(6),
//     fontFamily: "InterVariable",
//     fontSize: ms(9),
//     fontWeight: "700",
//   },
//   activeLabel: {
//     color: "#69417E",
//   },
// });

import { ms, s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { registerTabBarVisibility } from "@/utils/tabBarVisibility";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Home from "./home/homePage";
import CalendarScreen from "./rawPages/CalendarScreen";
import ProfileScreen from "./rawPages/Profile";
import SearchScreen from "./rawPages/search";

const Tab = createBottomTabNavigator();

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;
  const [tabBarHeight, setTabBarHeight] = useState(0);

  // Register global hide/show functions
  useEffect(() => {
    registerTabBarVisibility(
      () => setVisible(false),
      () => setVisible(true)
    );
  }, []);

  // Animate tab bar when visible state changes
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : (tabBarHeight || 100) + insets.bottom, // fallback 100 if not measured yet
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible, tabBarHeight, translateY]);

  // Hide tab bar completely on "Grid" screen
  if (state.routes[state.index].name === "Grid") return null;

  return (
    <Animated.View
      style={[
        styles.tabBarContainer,
        {
          transform: [{ translateY }],
          bottom: insets.bottom + 12, // 👈 respect safe area
        },
      ]}
      onLayout={(e) => {
        const { height } = e.nativeEvent.layout;
        setTabBarHeight(height + vs(10)); // small buffer for safety
      }}
    >
      <BlurView intensity={60} tint="light" style={styles.blurWrapper}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            if (!isFocused) navigation.navigate(route.name);
          };

          const iconName =
            route.name === "Home"
              ? isFocused
                ? "home"
                : "home-outline"
              : route.name === "Calendar"
              ? isFocused
                ? "calendar"
                : "calendar-outline"
              : route.name === "Search"
              ? isFocused
                ? "search"
                : "search-outline"
              : isFocused
              ? "grid"
              : "grid-outline";

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tabItem, isFocused && styles.activeTab]}
              activeOpacity={0.8}
            >
              <Ionicons
                name={iconName as any}
                size={20}
                color={isFocused ? "#69417E" : "#1C1C1C"}
              />
              {isFocused && typeof label === "string" && (
                <Text style={[styles.label, styles.activeLabel]}>{label}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </Animated.View>
  );
};
export default function AppNavigation() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <CustomTabBar {...props} />}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Grid" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: vs(39),
    left: s(16),
    right: s(16),
    borderRadius: s(30),
    overflow: "hidden",
    backgroundColor: "rgba(222, 235, 237, 0.68)",
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    }),
  },
  blurWrapper: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingVertical: vs(10),
    paddingHorizontal: s(10),
    justifyContent: "space-between",
    alignItems: "center",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: vs(10),
    paddingHorizontal: s(10),
    borderRadius: s(24),
    flexDirection: "row",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#F1CBB8",
    paddingHorizontal: s(15),
  },
  label: {
    marginLeft: s(6),
    fontFamily: "InterVariable",
    fontSize: ms(9),
    fontWeight: "700",
  },
  activeLabel: {
    color: "#69417E",
  },
});
