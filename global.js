console.log('IT’S ALIVE!');
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects'},
    { url: 'resume/', title: 'Resume'},
    { url: 'contact/', title: 'Contact'},
    { url: 'https://github.com/RyanCao2005/', title: 'GitHub' }
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    const IS_HOME = document.documentElement.classList.contains('home');
    let url = p.url;
    if (!url.startsWith('http')) {
      if(!IS_HOME){
        url = "../" + url;
      }
    }
    let a = document.createElement("a");
    let title = p.title;
    a.href = url;
    a.textContent = title
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    if (a.host !== location.host) {
        a.target = '_blank';
    }
    nav.append(a);
}  
document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );
  const select = document.querySelector('.color-scheme select');
  function setColorScheme(value) {
    document.documentElement.style.setProperty('color-scheme', value);
    localStorage.colorScheme = value;
    select.value = value;
  }
  if ('colorScheme' in localStorage) {
    setColorScheme(localStorage.colorScheme);
  }
  select.addEventListener('input', function (event) {
    setColorScheme(event.target.value);
  });