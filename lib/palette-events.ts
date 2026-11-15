// lib/palette-events.ts
// Window events shared by the header and the command palette. They live here,
// not in components/CommandPalette.tsx, so the header can use them without
// pulling the palette into the first-load bundle (it is loaded after paint).

/** Other components open the palette by dispatching this event on window. */
export const OPEN_PALETTE_EVENT = "open-command-palette";
/** Dispatched on window by code that navigates without a link click, so the header can show its loader. */
export const NAVIGATION_START_EVENT = "navigation-start";
