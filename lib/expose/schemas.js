import { object } from "./shared.js";

// src/expose/schemas.ts
const text = { type: "string" };
const bool = { type: "boolean" };
const number = { type: "number" };
const array = (items) => ({
	type: "array",
	items
});
const strings = array(text);
const uids = object({
	gs: strings,
	sr: strings,
	zzz: strings
}, [
	"gs",
	"sr",
	"zzz"
]);
const pay = object({
	uid: text,
	crystal: number,
	totalRmb: number,
	records: number
}, [
	"uid",
	"crystal",
	"totalRmb",
	"records"
]);
const payResult = object({
	data: pay,
	errors: strings,
	message: text
});
const query = object({
	success: bool,
	message: text,
	uid: text,
	api: text,
	dataJson: text
}, ["success", "message"]);
const login = object({
	status: {
		type: "string",
		enum: [
			"waiting",
			"error",
			"cancelled",
			"expired",
			"Init",
			"Scanned",
			"Confirmed",
			"Expired"
		]
	},
	message: text,
	qrDataUrl: text
}, ["status"]);
const post = object({ post: object({
	post_id: text,
	subject: text,
	content: text,
	created_at: number
}, [
	"post_id",
	"subject",
	"content",
	"created_at"
]) }, ["post"]);
const card = object({
	name: text,
	num: number
});
const deck = object({
	id: number,
	name: text,
	avatar_cards: array(card),
	action_cards: array(card)
}, ["id"]);
const extraSchemas = {
	get_help: text,
	get_cookie_help: text,
	get_stoken_help: text,
	get_pay_help: text,
	get_all_uids: object({
		gs: strings,
		sr: strings,
		zzz: strings,
		cookieBound: bool
	}, [
		"gs",
		"sr",
		"zzz",
		"cookieBound"
	]),
	get_cookie_status: object({
		bound: bool,
		ltuid: text,
		isV2: bool,
		uids
	}, ["bound"]),
	get_stoken_status: object({
		bound: bool,
		stuid: text,
		uid: text
	}, ["bound"]),
	check_cookie: object({
		bound: bool,
		checks: array(object({
			game: text,
			bound: bool,
			uid: text,
			retcode: number,
			message: text
		}, ["game"]))
	}, ["bound"]),
	delete_uid_by_index: object({ success: bool }, ["success"]),
	get_exchange_codes: object({
		codes: strings,
		title: text,
		deadline: text,
		message: text
	}, ["codes"]),
	get_news: object({
		post,
		posts: array(post)
	}),
	use_exchange_code: text,
	get_gcg_cards: query,
	get_gcg_deck: object({
		success: bool,
		message: text,
		deck
	}, ["success"]),
	claim_birthday: object({
		success: bool,
		message: text,
		results: array(object({
			name: text,
			imageUrl: text,
			result: text
		}, [
			"name",
			"imageUrl",
			"result"
		]))
	}),
	start_login: login,
	poll_login: login,
	cancel_login: login,
	import_pay_log: payResult,
	refresh_pay_log: payResult,
	get_pay_log: object({
		uid: text,
		crystal: number,
		totalRmb: number,
		records: number,
		message: text
	})
};
/** Whitelist public fields; absent/nullable optional branches are omitted before schema validation. */
function projectOutput(value, schema) {
	if (schema.type === "object" && value && typeof value === "object" && !Array.isArray(value)) {
		const source = value;
		return Object.fromEntries(Object.entries(schema.properties).filter(([key]) => source[key] !== void 0 && source[key] !== null).map(([key, child]) => [key, projectOutput(source[key], child)]));
	}
	if (schema.type === "array" && Array.isArray(value)) return value.map((item) => projectOutput(item, schema.items));
	return value;
}

export { extraSchemas, projectOutput };