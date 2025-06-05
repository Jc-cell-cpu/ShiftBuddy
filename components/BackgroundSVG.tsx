import { s, vs } from "@/utils/scale"; // Adjust import path to your setup
import { Dimensions } from "react-native";
import {
  Defs,
  Rect,
  Stop,
  Svg,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";

// Default dimensions (design reference: 375x812)
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;
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
      viewBox={`0 0 ${s(DESIGN_WIDTH)} ${vs(DESIGN_HEIGHT)}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <Rect
        width={s(DESIGN_WIDTH)}
        height={vs(DESIGN_HEIGHT)}
        fill="url(#paint0_linear_95_3555)"
      />
      <Defs>
        <SvgLinearGradient
          id="paint0_linear_95_3555"
          x1={s(0)}
          y1={vs(115.5)}
          x2={s(344.5)}
          y2={vs(251.5)}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#620787" />
          <Stop offset="1" stopColor="#060F1E" />
        </SvgLinearGradient>
      </Defs>
    </Svg>
  );
}
