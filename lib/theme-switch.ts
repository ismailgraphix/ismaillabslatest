// lib/theme-switch.ts
// Switch theme with a 240 ms colour cross-fade. Where the browser supports
// view transitions, the old and new pages are snapshotted and cross-faded
// (the root timing is in app/globals.css). The class is applied to <html>
// directly inside the transition so the "after" snapshot already has the new
// colours; next-themes then records the choice as usual. Browsers without the
// API switch at once. The fade is opacity only, so it stays under reduced motion.
export function switchTheme(setTheme: (theme: string) => void, next: "light" | "dark") {
    const apply = () => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(next);
        root.style.colorScheme = next;
        setTheme(next);
    };
    if (typeof document.startViewTransition !== "function") {
        apply();
        return;
    }
    document.startViewTransition(apply);
}
