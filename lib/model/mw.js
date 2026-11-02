// src/model/mw.ts
const SR_REG = /星铁|星穹铁道|崩铁|崩坏星穹铁道/;
const ZZZ_REG = /绝区零|zzz/i;
const resolveGame = (text) => {
	if (SR_REG.test(text)) return "sr";
	if (ZZZ_REG.test(text)) return "zzz";
	return "gs";
};

export { resolveGame };