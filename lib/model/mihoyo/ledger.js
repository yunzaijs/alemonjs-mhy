// src/model/mihoyo/ledger.ts
/** Resolve the recent three calendar months once for both commands and Expose. */
function resolveLedgerMonth(month = (/* @__PURE__ */ new Date()).getMonth() + 1, now = /* @__PURE__ */ new Date()) {
	for (let offset = 0; offset < 3; offset++) {
		const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
		if (date.getMonth() + 1 === month) return {
			month,
			year: date.getFullYear()
		};
	}
	return null;
}
function formatLedgerMonth(period, game) {
	return game === "sr" ? `${period.year}${String(period.month).padStart(2, "0")}` : String(period.month);
}

export { formatLedgerMonth, resolveLedgerMonth };