#!/usr/bin/env node
// Materialize standalone picker entries from the maintained Hephaestus package.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const root = fileURLToPath(new URL('../skills/', import.meta.url));
const core = join(root, 'hephaestus');
const original = readFileSync(join(core, 'SKILL.md'), 'utf8');
const frontend = original.slice(original.indexOf('## Frontend Fixer'));
if (!frontend.startsWith('## Frontend Fixer')) throw new Error('Missing canonical frontend workflow.');

for (const target of ['frontend', 'backend']) {
  const name = `hephaestus-${target}`;
  const title = `Hephaestus: ${target === 'frontend' ? 'Frontend' : 'Backend'} Fixer`;
  const dest = join(root, name);
  mkdirSync(dest, { recursive: true });
  cpSync(core, dest, { recursive: true, filter: source => target !== 'backend' || relative(core, source).split('/')[0] !== 'vendor' });
  const description = target === 'frontend'
    ? 'Audit and repair existing frontends with the Hephaestus 30-rule policy, bundled Taste direction tools, source lint and browser inspection. Select this for UI, accessibility, responsive layout and frontend state defects.'
    : 'Audit and repair existing backend code with Hephaestus security guardrails for secrets, authentication, validation, data access, dependencies, rate limits and security analysis.';
  const workflow = target === 'frontend' ? frontend : 'Read [the backend workflow](references/backend.md), [backend policy](policy/backend-policy.json) and [report contract](references/report.md), then follow them. Set report `target` to `backend`.\n';
  writeFileSync(join(dest, 'SKILL.md'), `---\nname: ${name}\ndescription: ${description}\nlicense: MIT. See LICENSE and THIRD_PARTY_NOTICES.md.\n---\n\n# ${title}\n\nThis entry point selects **${target === 'frontend' ? 'Frontend' : 'Backend'} Fixer** directly. Show the [welcome README](README.md) and bundled logo on the first explicit invocation, resolving image paths against this installed folder. If inline images are unsupported, show text and an image link. Continue in the selected mode without asking the user to choose a mode again.\n\n${workflow}`);
  writeFileSync(join(dest, 'README.md'), `![Hephaestus logo](assets/hephaestus-logo.png)\n\n# ${title}\n\n**Stop AI slop before it ships.**\n\n${description}\n\nRun \`$${name}\` in Codex or \`/${name}\` in Claude Code. This entry selects the ${target} workflow directly. Audit-only work preserves source; repairs require actual verification. Keep secret keys out of chat.\n\n[Full project README](https://github.com/aaravkalia-88/Hephaestus#readme)\n`);
  writeFileSync(join(dest, 'agents/openai.yaml'), `interface:\n  display_name: "${title}"\n  short_description: "${target === 'frontend' ? 'Fix frontend UI with Taste and evidence' : 'Fix backend code with security guardrails'}"\n  icon_small: "./assets/hephaestus-logo.png"\n  icon_large: "./assets/hephaestus-logo.png"\n  default_prompt: "Use $${name} to show its introduction, then audit and repair this ${target} within the authorized scope with evidence."\n`);
}
