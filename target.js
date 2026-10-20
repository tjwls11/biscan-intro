// Highlight the table-of-contents entry for the section in view.
const links = [...document.querySelectorAll('.toc a')];
const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
function setActive(id) {
  links.forEach(link => {
    const on = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', on);
    if (on) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
}
if (sections.length) {
  const visible = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => visible.set(entry.target.id, entry.isIntersecting));
    const current = sections.find(section => visible.get(section.id));
    if (current) setActive(current.id);
  }, {rootMargin: '-90px 0px -55% 0px'});
  sections.forEach(section => observer.observe(section));
  setActive(sections[0].id);
}
