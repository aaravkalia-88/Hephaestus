// Runs against the disposable fixture in a real browser; no external requests or source edits.
export async function runChecks() {
  const results = [];
  const form = document.querySelector('#controls');
  const select = document.querySelector('#scenario');
  const status = document.querySelector('#status');
  const list = document.querySelector('#projects');
  const retry = document.querySelector('#retry');
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const record = (id, pass, evidence) => results.push({ id, status: pass ? 'pass' : 'fail', evidence });
  const state = () => ({ message: status.textContent.trim(), names: [...list.children].map(item => item.textContent), retry: !retry.hidden });
  const choose = value => { select.value = value; form.requestSubmit(); };
  const errorVisible = () => /failed|could not|couldn't|unable|invalid|unexpected|error/i.test(status.textContent) && !retry.hidden && list.children.length === 0;

  choose('slow');
  await pause(80);
  record('pending', /loading|fetching|waiting/i.test(status.textContent), state());
  record('pending-controls', !select.disabled, 'Response selector must remain usable while a request is pending.');
  await pause(2700);
  record('success', JSON.stringify(state().names) === JSON.stringify(['Export report', 'Invite reviewer', 'Fix mobile menu']), state());
  record('live-feedback', status.matches('[role="status"], [aria-live="polite"]'), 'Request feedback has live-region semantics.');

  choose('empty'); await pause(350);
  record('empty', /no .*projects|no projects|empty|0 projects/i.test(status.textContent) && list.children.length === 0, state());
  for (const scenario of ['error', 'malformed', 'network']) {
    choose(scenario); await pause(350);
    record(scenario, errorVisible(), state());
  }
  retry.click(); await pause(80);
  record('retry-pending', /loading|fetching|waiting/i.test(status.textContent), state());
  await pause(350);
  record('retry-failure', errorVisible(), state());

  choose('success'); await pause(350);
  record('recovery', list.children.length === 3 && retry.hidden, state());
  choose('markup'); await pause(350);
  record('remote-text', list.textContent === '<b>Release review</b>' && !list.querySelector('b'), state());

  choose('slow'); await pause(80);
  choose('empty'); await pause(2800);
  record('latest-request', list.children.length === 0 && /no .*projects|no projects|empty|0 projects/i.test(status.textContent), state());
  record('no-overflow', document.documentElement.scrollWidth <= innerWidth + 1, { viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth });
  record('preserved-identity', document.title === 'Project desk | Hephaestus fixture' && document.querySelector('h1').textContent === 'Project desk' && getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() === '#7c3aed', 'Original title, heading and approved brand retained.');
  choose('success'); await pause(350);
  return { route: location.pathname, width: innerWidth, checks: results, passed: results.every(result => result.status === 'pass') };
}
