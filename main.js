// MatchIQ Pro: simple JavaScript for the endterm defense.
// All numbers are DEMO data, not real-time football statistics.

// 1. ARRAYS: data for matches, players and league tables.
const matches = [
  { id: 1, home: 'Арсенал', away: 'Челси', homeLogo: 'ars.svg', awayLogo: 'che.svg', league: 'Премьер-лига', status: 'live', score: '2 : 1', xg: '1.8 : 0.7' },
  { id: 2, home: 'Реал Мадрид', away: 'Севилья', homeLogo: 'rma.svg', awayLogo: 'sev.svg', league: 'Ла Лига', status: 'finished', score: '3 : 0', xg: '2.1 : 0.4' },
  { id: 3, home: 'Бавария', away: 'Ман. Сити', homeLogo: 'bay.svg', awayLogo: 'mci.svg', league: 'Лига чемпионов', status: 'upcoming', score: 'VS', xg: '—' },
  { id: 4, home: 'Ливерпуль', away: 'Астон Вилла', homeLogo: 'liv.svg', awayLogo: 'avl.svg', league: 'Премьер-лига', status: 'live', score: '1 : 1', xg: '1.2 : 1.0' },
  { id: 5, home: 'Челси', away: 'Ливерпуль', homeLogo: 'che.svg', awayLogo: 'liv.svg', league: 'Премьер-лига', status: 'finished', score: '0 : 2', xg: '0.6 : 1.9' },
  { id: 6, home: 'Арсенал', away: 'Бавария', homeLogo: 'ars.svg', awayLogo: 'bay.svg', league: 'Лига чемпионов', status: 'upcoming', score: 'VS', xg: '—' }
];

const players = [
  { name: 'Джуд Беллингем', team: 'Реал Мадрид', goals: 16, assists: 3, xg: 12.4 },
  { name: 'Килиан Мбаппе', team: 'ПСЖ (данные Midterm)', goals: 21, assists: 4, xg: 19.1 },
  { name: 'Эрлинг Холанд', team: 'Ман. Сити', goals: 19, assists: 6, xg: 18.6 },
  { name: 'Мохамед Салах', team: 'Ливерпуль', goals: 17, assists: 9, xg: 15.2 }
];

const standings = {
  epl: [
    { team: 'Ливерпуль', logo: 'liv.svg', played: 26, win: 18, draw: 6, loss: 2, xpts: 58.4, points: 60 },
    { team: 'Манчестер Сити', logo: 'mci.svg', played: 26, win: 18, draw: 5, loss: 3, xpts: 61.2, points: 59 },
    { team: 'Арсенал', logo: 'ars.svg', played: 26, win: 18, draw: 4, loss: 4, xpts: 55.8, points: 58 },
    { team: 'Астон Вилла', logo: 'avl.svg', played: 26, win: 16, draw: 4, loss: 6, xpts: 42.1, points: 52 }
  ],
  laliga: [
    { team: 'Реал Мадрид', logo: 'rma.svg', played: 26, win: 20, draw: 4, loss: 2, xpts: 62.2, points: 64 },
    { team: 'Севилья', logo: 'sev.svg', played: 26, win: 15, draw: 6, loss: 5, xpts: 46.3, points: 51 },
    { team: 'Реал Сосьедад', logo: '', played: 26, win: 13, draw: 7, loss: 6, xpts: 43.4, points: 46 }
  ]
};

let currentFilter = 'all';
let favorites = [];
try {
  favorites = JSON.parse(localStorage.getItem('matchiq_favorites') || '[]');
  if (!Array.isArray(favorites)) favorites = [];
} catch (error) {
  favorites = [];
}

// 2. FUNCTION WITH RETURN VALUE. Used for match status labels.
function statusName(status) {
  if (status === 'live') return 'LIVE (демо)';
  if (status === 'finished') return 'Завершён';
  return 'Предстоящий';
}

// 3. DYNAMIC DOM: creates cards from the matches array using forEach.
function renderMatches() {
  const list = document.getElementById('matchList');
  if (!list) return;
  list.innerHTML = '';

  matches.forEach(function (match) {
    const fits = currentFilter === 'all' ||
      (currentFilter === 'favorites' && favorites.includes(match.id)) ||
      match.status === currentFilter;
    if (!fits) return;

    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-search', '');
    const selected = favorites.includes(match.id);
    card.innerHTML = `
      <div class="meta"><span>${match.league}</span><span class="tag ${match.status}">${statusName(match.status)}</span></div>
      <div class="teams">
        <div class="team"><img src="img/${match.homeLogo}" alt="${match.home}"><strong>${match.home}</strong></div>
        <div class="score">${match.score}</div>
        <div class="team"><img src="img/${match.awayLogo}" alt="${match.away}"><strong>${match.away}</strong></div>
      </div>
      <div class="card-actions">
        <span class="hint">xG: ${match.xg}</span>
        <button class="btn favorite-btn ${selected ? 'selected' : ''}" type="button" data-id="${match.id}" aria-pressed="${selected}">${selected ? '★ В избранном' : '☆ В избранное'}</button>
      </div>`;
    list.appendChild(card);
  });
  applySearch();
}

// 4. FAVORITES: add/remove a number from an array, save it in localStorage.
function toggleFavorite(id) {
  const position = favorites.indexOf(id);
  if (position === -1) favorites.push(id);
  else favorites.splice(position, 1);
  localStorage.setItem('matchiq_favorites', JSON.stringify(favorites));
  renderMatches();
}

// 5. DYNAMIC PLAYERS: for...of is our second loop example.
function renderPlayers() {
  const list = document.getElementById('playerList');
  if (!list) return;
  const sort = document.getElementById('playerSort').value;
  const sorted = [...players]; // Copy array so original is unchanged.
  if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  if (sort === 'goals') sorted.sort((a, b) => b.goals - a.goals);
  if (sort === 'assists') sorted.sort((a, b) => b.assists - a.assists);

  list.innerHTML = '';
  for (const player of sorted) {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-search', '');
    card.innerHTML = `
      <div class="player-head"><img src="img/player.svg" alt="Аватар игрока"><div><h2>${player.name}</h2><p class="hint">${player.team}</p></div></div>
      <div class="player-stat"><span>Голы</span><strong>${player.goals}</strong></div>
      <div class="player-stat"><span>Ассисты</span><strong>${player.assists}</strong></div>
      <div class="player-stat"><span>Expected Goals (xG)</span><strong>${player.xg}</strong></div>`;
    list.appendChild(card);
  }
  applySearch();
}

// 6. TABLE: changes the league without reloading the page.
function renderStandings() {
  const body = document.getElementById('standingsBody');
  if (!body) return;
  const league = document.getElementById('leagueSelect').value;
  const rows = standings[league];
  document.getElementById('leagueTitle').textContent = league === 'epl' ? 'Английская Премьер-лига' : 'Ла Лига';
  document.getElementById('leagueNote').textContent = 'Показано команд: ' + rows.length + ' (демонстрационные данные)';
  body.innerHTML = '';

  rows.forEach(function (team, index) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-search', '');
    const icon = team.logo ? `<img src="img/${team.logo}" alt="">` : '<i class="fa-solid fa-shield"></i>';
    tr.innerHTML = `<td>${index + 1}</td><td><span class="table-team">${icon}${team.team}</span></td>
      <td>${team.played}</td><td>${team.win}</td><td>${team.draw}</td><td>${team.loss}</td>
      <td>${team.xpts}</td><td class="highlight">${team.points}</td>`;
    body.appendChild(tr);
  });
  applySearch();
}

// 7. SEARCH: handles input event and hides non-matching items.
function applySearch() {
  const input = document.getElementById('siteSearch');
  const text = input ? input.value.trim().toLowerCase() : '';
  const items = document.querySelectorAll('[data-search]');
  let visible = 0;
  items.forEach(function (item) {
    const found = item.textContent.toLowerCase().includes(text);
    item.hidden = !found;
    if (found) visible++;
  });
  const empty = document.getElementById('emptyNote');
  if (empty) empty.hidden = visible > 0;
}

// 8. FORM VALIDATION: show a different error next to each field.
function showError(id, message) {
  const field = document.getElementById(id);
  document.getElementById(id + 'Error').textContent = message;
  field.classList.toggle('invalid', message !== '');
  field.setAttribute('aria-invalid', message !== '');
}

function validateForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const topic = document.getElementById('topic').value;
  const message = document.getElementById('message').value.trim();
  const agreement = document.getElementById('agreement').checked;

  showError('name', name.length < 2 ? 'Введите имя: минимум 2 символа.' : '');
  showError('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Введите корректный email.');
  showError('topic', topic ? '' : 'Выберите тему обращения.');
  showError('message', message.length < 15 ? 'Введите минимум 15 символов.' : '');
  showError('agreement', agreement ? '' : 'Подтвердите согласие.');

  return name.length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    topic !== '' && message.length >= 15 && agreement;
}

// 9. EVENTS: click, input, change and submit. Initialized after DOM loaded.
document.addEventListener('DOMContentLoaded', function () {
  // Restore chosen theme.
  if (localStorage.getItem('matchiq_theme') === 'light') document.body.classList.add('light');
  const themeButton = document.getElementById('themeButton');
  themeButton.addEventListener('click', function () {
    document.body.classList.toggle('light');
    localStorage.setItem('matchiq_theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });

  const matchList = document.getElementById('matchList');
  if (matchList) {
    renderMatches();
    document.querySelectorAll('.filter-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        renderMatches();
      });
    });
    matchList.addEventListener('click', function (event) {
      const button = event.target.closest('.favorite-btn');
      if (button) toggleFavorite(Number(button.dataset.id));
    });
  }

  if (document.getElementById('playerList')) {
    renderPlayers();
    document.getElementById('playerSort').addEventListener('change', renderPlayers);
  }
  if (document.getElementById('standingsBody')) {
    renderStandings();
    document.getElementById('leagueSelect').addEventListener('change', renderStandings);
  }

  const search = document.getElementById('siteSearch');
  if (search) search.addEventListener('input', applySearch);

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent real submission while testing a demo site.
      const success = document.getElementById('formSuccess');
      success.hidden = true;
      if (validateForm()) {
        success.textContent = 'Проверка пройдена! Это демо: сообщение не отправлено на сервер.';
        success.hidden = false;
        form.reset();
      }
    });
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        const error = document.getElementById(field.id + 'Error');
        if (error) { error.textContent = ''; field.classList.remove('invalid'); field.removeAttribute('aria-invalid'); }
        document.getElementById('formSuccess').hidden = true;
      });
    });
  }
});