// src/img/views/shared.ts
const GAME_THEME = {
	gs: {
		name: "原神",
		gradient: "linear-gradient(135deg, #e8d5b0, #d3bc8e)",
		accent: "#8b6d3f",
		headerText: "#4a3c2a",
		headerSub: "#7a6b57",
		progressColor: "#8b6d3f"
	},
	sr: {
		name: "星穹铁道",
		gradient: "linear-gradient(135deg, #c5b4e3, #a894d4)",
		accent: "#5c6bc0",
		headerText: "#3a2a5c",
		headerSub: "#6b57a0",
		progressColor: "#7c6bc0"
	},
	zzz: {
		name: "绝区零",
		gradient: "linear-gradient(135deg, #b4e3c5, #8dd4a8)",
		accent: "#2e7d46",
		headerText: "#2a4a35",
		headerSub: "#4a7a5b",
		progressColor: "#2e7d46"
	}
};
const RARITY_COLORS = {
	5: "#c6923a",
	4: "#a256e1",
	3: "#5180cb",
	2: "#4a8f6d",
	1: "#808080"
};
const RARITY_COLORS_STR = {
	S: "#c6923a",
	A: "#a256e1",
	B: "#5180cb"
};
function formatDate() {
	const now = /* @__PURE__ */ new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}
function getTheme(game) {
	return GAME_THEME[game] ?? GAME_THEME.gs;
}

export { GAME_THEME, RARITY_COLORS, RARITY_COLORS_STR, formatDate, getTheme };