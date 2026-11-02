import { Expose, ExposeError, getConfigValue, getCurrentEvent } from "alemonjs";

// src/expose/shared.ts
function currentUser(context) {
	const config = getConfigValue()["alemonjs-mhy"]?.expose;
	const allowed = config?.allowed_callers;
	const event = getCurrentEvent();
	if (config !== void 0 && (!config || typeof config !== "object" || Array.isArray(config)) || config?.enabled !== void 0 && config.enabled !== true || allowed !== void 0 && (!Array.isArray(allowed) || !allowed.every((item) => typeof item === "string" && item.length > 0 && item.trim() === item)) || !context.callerApp || allowed !== void 0 && !allowed.includes(context.callerApp) || !event || !["message.create", "private.message.create"].includes(event.name) || ![
		event.Platform,
		event.BotId,
		event.UserId
	].every((value) => typeof value === "string" && value.trim().length > 0)) throw new ExposeError("FORBIDDEN", "当前调用方或消息身份未获米游社操作授权");
	context.signal.throwIfAborted();
	return event.UserId;
}
function object(properties, required = []) {
	return {
		type: "object",
		properties,
		required,
		additionalProperties: false
	};
}
function action(description, inputSchema, outputSchema, handler, effect = "read", privateOnly = false) {
	return Expose.action({
		description,
		effect,
		inputSchema,
		outputSchema,
		authorize: (_input, context) => {
			currentUser(context);
			if (privateOnly && getCurrentEvent()?.name !== "private.message.create") throw new ExposeError("FORBIDDEN", "凭据绑定仅允许私聊调用");
			return true;
		},
		handler: (input, context) => handler(input, currentUser(context))
	});
}

export { action, currentUser, object };