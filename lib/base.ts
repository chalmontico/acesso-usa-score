// The app is served under acessousa.com/score (see next.config.js basePath).
// <img src>, fetch() and metadata URLs are NOT prefixed automatically by Next,
// so every absolute path used there goes through asset().
export const BASE = '/score'
export const asset = (path: string) => `${BASE}${path}`
