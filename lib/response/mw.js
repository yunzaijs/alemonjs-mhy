// src/response/mw.ts
var mw_default = (e) => {
	console.log("mhy", e.name);
	return true;
};

export { mw_default as default };