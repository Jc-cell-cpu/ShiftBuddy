import { Dimensions } from "react-native";
import {
  Defs,
  Rect,
  Stop,
  Svg,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";

// Default to screen dimensions if props are not provided
const { width: defaultWidth, height: defaultHeight } = Dimensions.get("window");

type BackgroundSVGProps = {
  width?: number;
  height?: number;
};

export default function BackgroundSVG({
  width = defaultWidth,
  height = defaultHeight,
}: BackgroundSVGProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 375 812"
      preserveAspectRatio="xMidYMid slice"
    >
      <Rect width="375" height="812" fill="url(#paint0_linear_95_3555)" />
      <Defs>
        <SvgLinearGradient
          id="paint0_linear_95_3555"
          x1="6.66509e-07"
          y1="115.5"
          x2="344.5"
          y2="251.5"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#620787" />
          <Stop offset="1" stopColor="#060F1E" />
        </SvgLinearGradient>
      </Defs>
    </Svg>
  );
}
