export const baseUrl = (): string =>
  (process.env.CERCAR_BASE_URL ?? 'https://cercar.odev.es').replace(/\/$/, '');

export const guestSharePath = (): string | undefined => {
  const raw = process.env.CERCAR_GUEST_SHARE_PATH?.trim();
  if (!raw) return undefined;
  return raw.startsWith('/') ? raw : `/${raw}`;
};

export const hasGuestShare = (): boolean => !!guestSharePath();

export const qaCredentials = (): { email: string; password: string } | undefined => {
  const email = process.env.CERCAR_QA_EMAIL?.trim();
  const password = process.env.CERCAR_QA_PASSWORD ?? '';
  if (!email || !password) return undefined;
  return { email, password };
};

export const hasQaCredentials = (): boolean => !!qaCredentials();
