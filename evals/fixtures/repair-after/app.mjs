const form = document.querySelector('#controls');
const scenario = document.querySelector('#scenario');
const status = document.querySelector('#status');
const list = document.querySelector('#projects');
const retry = document.querySelector('#retry');
const loadButton = document.querySelector('#load-button');

let activeRequest;
let requestVersion = 0;
let retryScenario = scenario.value;

async function loadProjects(selectedScenario = scenario.value) {
  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;
  const version = ++requestVersion;
  retryScenario = selectedScenario;

  status.textContent = 'Loading projects...';
  status.dataset.state = 'loading';
  list.replaceChildren();
  list.setAttribute('aria-busy', 'true');
  retry.hidden = true;

  let errorMessage = 'Could not connect to the project service. Retry the request.';
  try {
    const response = await fetch(`/api/projects?scenario=${encodeURIComponent(selectedScenario)}`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      errorMessage = 'The project service could not load projects. Retry the request.';
      throw new Error();
    }

    errorMessage = 'The project service returned an invalid project list. Retry the request.';
    const names = await response.json();
    if (!Array.isArray(names) || !names.every(name => typeof name === 'string')) {
      throw new Error();
    }

    // A superseded request may still settle after cancellation.
    if (version !== requestVersion) return;
    for (const name of names) {
      const item = document.createElement('li');
      item.textContent = name;
      list.append(item);
    }
    status.dataset.state = names.length ? 'success' : 'empty';
    status.textContent = names.length
      ? `${names.length} project${names.length === 1 ? '' : 's'} loaded.`
      : 'No projects were returned. Choose another test response or load again.';
  } catch {
    if (version !== requestVersion) return;
    status.dataset.state = 'error';
    status.textContent = errorMessage;
    retry.hidden = false;
  } finally {
    if (version === requestVersion) {
      list.setAttribute('aria-busy', 'false');
      activeRequest = null;
    }
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  loadProjects();
});
retry.addEventListener('click', () => {
  loadButton.focus();
  loadProjects(retryScenario);
});
loadProjects();
