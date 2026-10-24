# Runnable repair fixture

Synthetic evaluation input, not a real company or customer website. This native-web project-list screen has deliberately incomplete request states and layout. Do not treat these defects as production code to copy.

Repair the existing frontend within `index.html`, `app.mjs` and `styles.css`. Preserve the project-list purpose, page title, approved violet brand `#7c3aed`, native labeled response selector, and API contract. The response choices are test controls, not customer-facing features. Do not change the server or invent success.

The read-only contract is `GET /api/projects?scenario=<selection>` and a successful body is an array of project-name strings. The existing seven choices exercise success, delayed success, empty, HTTP failure, malformed data, literal markup text and connection failure. Preserve returned names as data.

Keep the selected screen usable during requests, make states understandable, support safe recovery, and fix narrow-screen layout without replacing the product. Do not add packages, external assets, telemetry or backend work. The evaluation runner supplies the loopback response service separately.
