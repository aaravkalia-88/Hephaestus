const form = document.querySelector('#controls');
const scenario = document.querySelector('#scenario');
const status = document.querySelector('#status');
const list = document.querySelector('#projects');

// Intentionally flawed input retained for the repair evaluation.
async function loadProjects() {
  status.textContent = '';
  list.replaceChildren();
  const response = await fetch(`/api/projects?scenario=${encodeURIComponent(scenario.value)}`);
  const names = await response.json();
  for (const name of names) {
    const item = document.createElement('li');
    item.textContent = name;
    list.append(item);
  }
}

form.addEventListener('submit', event => { event.preventDefault(); loadProjects().catch(() => {}); });
loadProjects().catch(() => {});
