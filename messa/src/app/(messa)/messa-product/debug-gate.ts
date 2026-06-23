/* Single gate for every in-page debug/calibration tool — the
 * ?calibrate=… panels (clouds, landscape, paper, belts, masks, text,
 * coffee, lighthouse), the ?debug=media overlay, and the demo modal's
 * ?preview= step shortcut.
 *
 * LOCAL DEV ONLY (client call 2026-06-09: these tools are not for the
 * client). Every Vercel deploy — preview AND production — builds with
 * NODE_ENV=production, so the constant folds to `false` at build time,
 * dead branches drop out, and the dynamic calibrator chunks are never
 * fetched. To debug a remote device again, temporarily flip this on a
 * throwaway branch's preview deploy. */
export const DEBUG_UI_ALLOWED = process.env.NODE_ENV !== "production";
