/** Payload ya desempaquetado del interceptor `{ data, meta }`. */
export type LoginBackendPayload = Record<string, unknown>;

export function unwrapBackendData(
  responseData: unknown,
): LoginBackendPayload | null {
  if (!responseData || typeof responseData !== "object") return null;
  const wrapped = responseData as { data?: unknown };
  if (wrapped.data && typeof wrapped.data === "object") {
    return wrapped.data as LoginBackendPayload;
  }
  return responseData as LoginBackendPayload;
}

export function getMfaLoginResponse(payload: LoginBackendPayload) {
  if (payload.mfaRequired) {
    return {
      success: true,
      mfaRequired: true,
      challengeToken: payload.challengeToken,
      expiresIn: payload.expiresIn,
    };
  }
  if (payload.mfaSetupRequired) {
    return {
      success: true,
      mfaSetupRequired: true,
      setupToken: payload.setupToken,
      expiresIn: payload.expiresIn,
    };
  }
  return null;
}
