/**
 * Dynamically loads a Webpack Module Federation remote at runtime.
 *
 * HOW IT WORKS — step by step:
 *
 * 1. STATIC vs DYNAMIC remotes
 *    With static remotes (the old approach), the Webpack Module Federation
 *    plugin adds every remote URL to the HTML at build time. The browser fetches
 *    ALL remoteEntry.js files before any JavaScript runs — even for pages the
 *    user may never visit.
 *
 *    With dynamic remotes we remove the `remotes` block from webpack.config.js
 *    entirely and instead call this function only when a component is actually
 *    about to be rendered (via React.lazy).
 *
 * 2. SCRIPT INJECTION  (step inside this function)
 *    If the remote's global scope (e.g. window["map"]) is not yet present, we
 *    create a <script> tag pointing to its remoteEntry.js and append it to
 *    <head>. The browser downloads only that one file on demand.
 *
 * 3. SHARED-SCOPE INITIALISATION
 *    __webpack_init_sharing__("default") tells the local Webpack runtime to
 *    set up its shared-module registry (things like React, MUI that are
 *    declared `shared` in webpack.config.js). This must run before we hand
 *    control to the remote, so both host and remote negotiate versions only
 *    once.
 *
 * 4. CONTAINER INIT
 *    container.init(__webpack_share_scopes__.default) passes our shared scope
 *    INTO the remote container. The remote can now reuse React / MUI from the
 *    host instead of downloading its own copy.
 *
 * 5. MODULE FACTORY
 *    container.get("./Map") (for example) returns a factory function. Calling
 *    it gives us the actual ES module — exactly what a normal `import()` would
 *    return. React.lazy expects a Promise that resolves to { default: Component }
 *    which is what the callers construct from the result of this function.
 *
 * @param {string} scope   - The remote's global variable name, matching the
 *                           `name` field in that remote's webpack.config.js
 *                           (e.g. "map", "analytics", "calendar_heatmap").
 * @param {string} url     - Full URL to that remote's remoteEntry.js file.
 * @param {string} module  - The exposed path declared in the remote's `exposes`
 *                           config, prefixed with "./" (e.g. "./Map").
 * @returns {Promise<any>} - Resolves to the module's exports (the component).
 */
export async function loadRemote(scope, url, module) {
  // ── Step 1: inject the <script> tag only once ──────────────────────────────
  // We gate on window[scope] because the remoteEntry.js registers itself as a
  // global (e.g. window.map = { get, init }) when it finishes loading.
  if (!window[scope]) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.type = "text/javascript";
      script.async = true;
      script.onload = resolve;
      script.onerror = () =>
        reject(new Error(`Failed to load remote script: ${url}`));
      document.head.appendChild(script);
    });
  }

  // ── Step 2: initialise the host's shared scope ─────────────────────────────
  // This is a Webpack-injected global. It tells the local runtime to populate
  // __webpack_share_scopes__.default with all packages marked `shared` in
  // webpack.config.js (React, react-dom, MUI, etc.).
  await __webpack_init_sharing__("default");

  // ── Step 3: hand the shared scope to the remote container ─────────────────
  const container = window[scope]; // e.g. window["map"]
  await container.init(__webpack_share_scopes__.default);

  // ── Step 4: get the specific exposed module from the remote ────────────────
  // container.get("./Map") returns a factory. Calling that factory gives us
  // the actual module object (like { default: MapComponent }).
  const factory = await container.get(module);
  return factory();
}
