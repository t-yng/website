import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  theme: {
    extend: {
      tokens: {
        fonts: {
          heading: { value: "var(--font-archivo), 'Archivo', sans-serif" },
          body: {
            value:
              "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
          },
        },
        sizes: {
          container: { value: "800px" },
          containerWide: { value: "1200px" },
        },
      },
      semanticTokens: {
        colors: {
          background: { value: { base: "#FAFAFA", _dark: "#1F2027" } },
          surface: { value: { base: "#FFFFFF", _dark: "#2A2B33" } },
          text: { value: { base: "#09090B", _dark: "#FFFFFF" } },
          secondary: { value: { base: "#3F3F46", _dark: "#A9ADC1" } },
          muted: { value: { base: "#52525B", _dark: "#6B6C80" } },
          border: { value: { base: "#E4E4E7", _dark: "#3A3B45" } },
          accent: { value: { base: "#2563EB", _dark: "#60A5FA" } },
          accentHover: { value: { base: "#1D4ED8", _dark: "#93C5FD" } },
          buttonBg: { value: { base: "#09090B", _dark: "#E8E9F0" } },
          buttonText: { value: { base: "#FAFAFA", _dark: "FFFFFF" } },
        },
      },
    },
  },
  outdir: "src/styled-system",
});
