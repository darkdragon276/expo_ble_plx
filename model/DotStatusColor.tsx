type ColorVariant = "yellow" | "red" | "green" | "blue";

const colorMap: Record<ColorVariant, string> = {
	yellow: "text-yellow-600",
	red: "text-red-600",
	green: "text-green-600",
	blue: "text-blue-600",
};

const colorMapBg: Record<ColorVariant, string> = {
	yellow: "bg-yellow-500",
	red: "bg-red-500",
	green: "bg-green-500",
	blue: "bg-blue-500",
};

export { colorMap, colorMapBg, type ColorVariant }