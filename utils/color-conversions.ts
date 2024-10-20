// src/utils/color-conversions.ts

// Interface for RGB color
interface RGB {
  r: number;
  g: number;
  b: number;
}

// Interface for HSL parameters
interface HSL {
  h: number;
  s: number;
  l: number;
}

const hslToRgb = ({ h, s, l }: HSL): RGB => {
  s /= 100; // Normalize saturation
  l /= 100; // Normalize lightness

  if (s === 0) {
      const grayValue = Math.round(l * 255);
      return { r: grayValue, g: grayValue, b: grayValue }; // Achromatic (gray)
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const hueToRgb = (t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      return t < 1 / 6
          ? p + (q - p) * 6 * t
          : t < 1 / 2
          ? q
          : t < 2 / 3
          ? p + (q - p) * (2 / 3 - t) * 6
          : p;
  };

  return {
      r: Math.round(hueToRgb(h / 360 + 1 / 3) * 255),
      g: Math.round(hueToRgb(h / 360) * 255),
      b: Math.round(hueToRgb(h / 360 - 1 / 3) * 255),
  };
};

export const getRgbFromCssVar = (variableName: string): string => {
  const hslString = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();

  const [h, s, l] = hslString.split(" ").map((value) => {
      const parsedValue = Number(value.replace("%", "").trim());
      if (isNaN(parsedValue)) throw new Error("Invalid HSL value");
      return parsedValue;
  });

  const { r, g, b } = hslToRgb({ h, s, l });
  return `rgb(${r}, ${g}, ${b})`;
};
