const grid = document.querySelector('#recipe-grid');
const dialog = document.querySelector('#recipe-dialog');
const form = document.querySelector('#recipe-form');
const ingredientList = document.querySelector('#ingredient-list');
const toast = document.querySelector('#toast');
let recipes = [];
let toastTimer;
let recipeRequest = 0;
const knownRecipeCategories = new Set();
const popularCategories = ['Pizza', 'Testenine', 'Juha', 'Solate', 'Sladice', 'Zajtrk', 'Mesne jedi', 'Vegetarijanske jedi'];

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

async function api(url, options = {}) {
  const response = await fetch(`/api${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Napaka strežnika (${response.status}).`);
  }
  return response.status === 204 ? null : response.json().catch(() => null);
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function render() {
  const query = document.querySelector('#search').value.trim().toLocaleLowerCase('sl');
  const category = document.querySelector('#category-filter').value;
  const filtered = recipes.filter(recipe => {
    const ingredientNames = (recipe.sestavine || []).map(item => item.naziv).join(' ');
    const text = `${recipe.naziv} ${recipe.opis || ''} ${ingredientNames}`.toLocaleLowerCase('sl');
    return (!query || text.includes(query)) && (!category || (recipe.kategorija || '').toLocaleLowerCase('sl') === category.toLocaleLowerCase('sl'));
  });
  document.querySelector('#recipe-count').textContent = `${String(filtered.length).padStart(2, '0')} RECEPT${filtered.length === 1 ? '' : 'OV'}`;
  const select = document.querySelector('#category-filter');
  const selected = select.value;
  select.innerHTML = '<option value="">Popularne kategorije</option>' + popularCategories.map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join('');
  select.value = popularCategories.includes(selected) ? selected : '';
  grid.innerHTML = filtered.map((recipe, index) => `
    <article class="recipe-card">
      <div class="card-art"><span class="card-number">${String(index + 1).padStart(2, '0')}</span><span class="card-symbol">${['✿', '❋', '✳', '❀'][index % 4]}</span></div>
      <div class="card-body">
        <p class="category">${escapeHtml(recipe.kategorija || 'Domače')}</p>
        <h2>${escapeHtml(recipe.naziv || 'Brez naslova')}</h2>
        <p class="card-description">${escapeHtml(recipe.opis || (recipe.sestavine || []).map(item => item.naziv).join(', '))}</p>
        <div class="card-meta"><span class="card-time">◷ &nbsp;${Number(recipe.casPriprave) || 0} min</span><div class="card-actions"><button data-action="view" data-id="${recipe.id}">Odpri</button><button data-action="edit" data-id="${recipe.id}">Uredi</button><button data-action="delete" data-id="${recipe.id}">Izbriši</button></div></div>
      </div>
    </article>`).join('');
  document.querySelector('#empty-state').hidden = recipes.length > 0;
  if (recipes.length && filtered.length === 0) grid.innerHTML = '<p class="no-results">Ni zadetkov za izbrane filtre.</p>';
}

//VAJA3
// Sestavi zahtevo za zaledje iz naprednih kriterijev, ki se lahko uporabijo skupaj.
function advancedFilterQuery() {
  const params = new URLSearchParams();
  const category = document.querySelector('#advanced-category').value;
  const maxTime = document.querySelector('#max-prep-time').value;
  const ingredient = document.querySelector('#ingredient-filter').value.trim();
  const sort = document.querySelector('#recipe-sort').value;
  if (category) params.set('kategorija', category);
  if (maxTime !== '') params.set('najvecjiCas', maxTime);
  if (ingredient) params.set('sestavina', ingredient);
  if (sort) params.set('razvrsti', sort);
  return params.toString();
}

//NALAGANJE RECEPTOV

//VAJA3: zahteva z parametri
async function loadRecipes() {
  // Zaporedna številka prepreči, da bi počasnejši starejši odgovor prepisal nove filtre.
  const requestNumber = ++recipeRequest;
  try {
    const query = advancedFilterQuery();
    recipes = await api(`/recepti${query ? `?${query}` : ''}`) || [];
    if (requestNumber !== recipeRequest) return;
    updateAdvancedCategories();
    render();
  } catch (error) {
    if (requestNumber !== recipeRequest) return;
    grid.innerHTML = `<div class="connection-error"><strong>Povezava z zaledjem ni uspela.</strong><p>${escapeHtml(error.message)} Preveri, ali Spring Boot teče na vratih 8080.</p><button class="button button-dark" id="retry">Poskusi znova</button></div>`;
    document.querySelector('#retry').addEventListener('click', loadRecipes);
  }
}

//VAJA3
// Napolni napredni seznam kategorij iz receptov, ne da bi posegel v seznam popularnih kategorij.
function updateAdvancedCategories() {
  const select = document.querySelector('#advanced-category');
  const selected = select.value;
  // Kategorije se zbirajo tudi iz nefiltriranega seznama, da izbor ostane stabilen ob filtriranju.
  recipes.map(recipe => recipe.kategorija?.trim()).filter(Boolean).forEach(value => knownRecipeCategories.add(value));
  const categories = [...knownRecipeCategories].sort((a, b) => a.localeCompare(b, 'sl'));
  select.innerHTML = '<option value="">Vse kategorije</option>'
    + categories.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
  select.value = categories.includes(selected) ? selected : '';
}

function addIngredient(name = '', amount = '') {
  const row = document.createElement('div');
  row.className = 'ingredient-row';
  row.innerHTML = `<input aria-label="Ime sestavine" placeholder="Sestavina" value="${escapeHtml(name)}"><input aria-label="Količina" placeholder="Količina, npr. 200 g" value="${escapeHtml(amount)}"><button type="button" class="remove-ingredient" aria-label="Odstrani sestavino">×</button>`;
  row.querySelector('button').addEventListener('click', () => row.remove());
  ingredientList.append(row);
}

function openForm(recipe = null) {
  form.reset();
  ingredientList.replaceChildren();
  document.querySelector('#form-error').textContent = '';
  document.querySelector('#recipe-id').value = recipe?.id || '';
  document.querySelector('#dialog-title').textContent = recipe ? 'Uredi recept' : 'Nov recept';
  if (recipe) {
    document.querySelector('#name').value = recipe.naziv || '';
    document.querySelector('#category').value = recipe.kategorija || '';
    document.querySelector('#time').value = recipe.casPriprave ?? '';
    document.querySelector('#description').value = recipe.opis || '';
    document.querySelector('#instructions').value = recipe.navodilaPriprave || '';
    (recipe.sestavine || []).forEach(item => addIngredient(item.naziv, item.kolicina));
  }
  if (!ingredientList.children.length) addIngredient();
  dialog.showModal();
}

function showDetails(recipe) {
  const items = (recipe.sestavine || []).map(item => `<li>${escapeHtml(item.naziv)}${item.kolicina ? ` <span>${escapeHtml(item.kolicina)}</span>` : ''}</li>`).join('');
  const instructions = escapeHtml(recipe.navodilaPriprave || 'Navodila še niso dodana.').replace(/\n/g, '<br>');
  const detailDialog = document.createElement('dialog');
  detailDialog.className = 'detail-dialog';
  detailDialog.innerHTML = `<div class="detail-content"><button class="icon-button detail-close" aria-label="Zapri">×</button><p class="eyebrow">${escapeHtml(recipe.kategorija || 'DOMAČE')} · ${Number(recipe.casPriprave) || 0} MIN</p><h2>${escapeHtml(recipe.naziv)}</h2><p class="detail-description">${escapeHtml(recipe.opis || '')}</p><h3>Sestavine</h3><ul>${items || '<li>Sestavine še niso dodane.</li>'}</ul><h3>Priprava</h3><p>${instructions}</p></div>`;
  document.body.append(detailDialog);
  detailDialog.showModal();
  detailDialog.querySelector('.detail-close').addEventListener('click', () => { detailDialog.close(); detailDialog.remove(); });
  detailDialog.addEventListener('click', event => { if (event.target === detailDialog) { detailDialog.close(); detailDialog.remove(); } });
}

document.querySelector('#new-recipe').addEventListener('click', () => openForm());
document.querySelector('#empty-add').addEventListener('click', () => openForm());
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#cancel-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#add-ingredient').addEventListener('click', () => addIngredient());
document.querySelector('#search').addEventListener('input', render);
document.querySelector('#category-filter').addEventListener('change', render);
//VAJA3 - Dodani so poslušalci sprememb filtrov, razvrscanja in gumba za ponastavitev:
// Ob spremembi naprednih kriterijev se recepti znova pridobijo že filtrirani iz zaledja.
document.querySelector('#advanced-category').addEventListener('change', loadRecipes);
document.querySelector('#max-prep-time').addEventListener('input', loadRecipes);
document.querySelector('#ingredient-filter').addEventListener('input', loadRecipes);
// Sprememba izbrane razvrstitve ponovno pridobi urejen seznam iz zaledja.
document.querySelector('#recipe-sort').addEventListener('change', loadRecipes);
document.querySelector('#clear-filters').addEventListener('click', () => {
  document.querySelector('#advanced-category').value = '';
  document.querySelector('#max-prep-time').value = '';
  document.querySelector('#ingredient-filter').value = '';
  loadRecipes();
});

//DELETE

grid.addEventListener('click', async event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const recipe = recipes.find(item => String(item.id) === button.dataset.id);
  if (!recipe) return;
  if (button.dataset.action === 'view') return showDetails(recipe);
  if (button.dataset.action === 'edit') return openForm(recipe);
  if (button.dataset.action === 'delete' && confirm(`Izbrišem recept »${recipe.naziv}«?`)) {
    try { await api(`/recepti/${recipe.id}`, { method: 'DELETE' }); notify('Recept je izbrisan.'); await loadRecipes(); }
    catch (error) { notify(error.message); }
  }
});

// POST/PUT

form.addEventListener('submit', async event => {
  event.preventDefault();
  const id = document.querySelector('#recipe-id').value;
  const sestavine = [...ingredientList.querySelectorAll('.ingredient-row')].map(row => {
    const [naziv, kolicina] = row.querySelectorAll('input');
    return { naziv: naziv.value.trim(), kolicina: kolicina.value.trim() };
  }).filter(item => item.naziv || item.kolicina);
  const payload = {
    naziv: document.querySelector('#name').value.trim(),
    kategorija: document.querySelector('#category').value.trim(),
    casPriprave: Number(document.querySelector('#time').value),
    opis: document.querySelector('#description').value.trim(),
    sestavine,
    navodilaPriprave: document.querySelector('#instructions').value.trim()
  };
  try {
    await api(id ? `/recepti/${id}` : '/recepti', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
    dialog.close();
    notify(id ? 'Recept je posodobljen.' : 'Recept je shranjen.');
    await loadRecipes();
  } catch (error) {
    document.querySelector('#form-error').textContent = `Shranjevanje ni uspelo: ${error.message}`;
  }
});

loadRecipes();
