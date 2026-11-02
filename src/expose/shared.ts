import { Expose, ExposeError, getConfigValue, getCurrentEvent, type ExposeCallContext, type ExposeValueSchema } from 'alemonjs';
export function currentUser(context: ExposeCallContext): string {
  const root = getConfigValue<Record<string, { expose?: { enabled?: boolean; allowed_callers?: string[] } }>>();
  const config = root['alemonjs-mhy']?.expose;
  const allowed = config?.allowed_callers;
  const event = getCurrentEvent();

  if (
    (config !== undefined && (!config || typeof config !== 'object' || Array.isArray(config))) ||
    (config?.enabled !== undefined && config.enabled !== true) ||
    (allowed !== undefined && (!Array.isArray(allowed) || !allowed.every(item => typeof item === 'string' && item.length > 0 && item.trim() === item))) ||
    !context.callerApp ||
    (allowed !== undefined && !allowed.includes(context.callerApp)) ||
    !event ||
    !['message.create', 'private.message.create'].includes(event.name) ||
    ![event.Platform, event.BotId, event.UserId].every(value => typeof value === 'string' && value.trim().length > 0)
  ) {
    throw new ExposeError('FORBIDDEN', '当前调用方或消息身份未获米游社操作授权');
  }
  context.signal.throwIfAborted();

  return event.UserId;
}

export function object(properties: Record<string, ExposeValueSchema>, required: string[] = []): ExposeValueSchema {
  return { type: 'object', properties, required, additionalProperties: false };
}

export function action<Input, Output>(
  description: string,
  inputSchema: ExposeValueSchema,
  outputSchema: ExposeValueSchema,
  handler: (input: Input, userId: string) => Promise<Output> | Output,
  effect: 'read' | 'write' = 'read',
  privateOnly = false
) {
  return Expose.action<Input, Output>({
    description,
    effect,
    inputSchema,
    outputSchema,
    authorize: (_input, context) => {
      currentUser(context);
      if (privateOnly && getCurrentEvent()?.name !== 'private.message.create') {
        throw new ExposeError('FORBIDDEN', '凭据绑定仅允许私聊调用');
      }

      return true;
    },
    handler: (input, context) => handler(input, currentUser(context))
  });
}
