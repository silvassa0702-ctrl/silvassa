/** Resolves a path inside /public (e.g. "img/hero.png") against the Vite base URL. */
export const assetUrl = (path: string): string => `${import.meta.env.BASE_URL}${path}`;
