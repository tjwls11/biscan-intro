// Scroll-linked crossfade for the three workflow screens.
const journey = document.querySelector('.journey')
const stage = document.querySelector('.sticky-stage')
const slides = [...document.querySelectorAll('.slide')]
const stepButtons = [...document.querySelectorAll('.step-nav button')]
const reduced = matchMedia('(prefers-reduced-motion: reduce)')
const stacked = matchMedia('(max-width: 900px), (max-height: 620px)')
let scheduled = false
function render() {
  scheduled = false
  if (reduced.matches || stacked.matches) {
    slides.forEach(slide => {
      slide.removeAttribute('style')
      slide.hidden = false
      slide.inert = false
    })
    return
  }
  const top = parseFloat(getComputedStyle(stage).top)
  const distance = Math.max(1, journey.offsetHeight - stage.offsetHeight)
  const progress = Math.max(0, Math.min(1, (top - journey.getBoundingClientRect().top) / distance))
  const timeline = progress * 3
  const phase = Math.min(2, Math.floor(timeline))
  const mix = phase < 2 ? Math.max(0, Math.min(1, (timeline - phase - .5) / .5)) : 0
  const eased = mix * mix * (3 - 2 * mix)
  const active = eased > .5 ? phase + 1 : phase
  slides.forEach((slide, i) => {
    const weight = i === phase ? 1 - eased : i === phase + 1 ? eased : 0
    slide.hidden = false
    slide.style.opacity = weight
    slide.style.visibility = weight > 0 ? 'visible' : 'hidden'
    slide.inert = i !== active
  })
  stepButtons.forEach((button, i) => {
    button.classList.toggle('is-active', i === active)
    if (i === active) button.setAttribute('aria-current', 'step')
    else button.removeAttribute('aria-current')
  })
}
stepButtons.forEach((button, i) => button.addEventListener('click', () => {
  const top = parseFloat(getComputedStyle(stage).top)
  const distance = Math.max(1, journey.offsetHeight - stage.offsetHeight)
  const start = journey.getBoundingClientRect().top + scrollY - top
  scrollTo({top: start + distance * (i + .2) / 3, behavior: reduced.matches ? 'auto' : 'smooth'})
}))
function schedule() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(render) }
}
addEventListener('scroll', schedule, {passive: true})
addEventListener('resize', schedule)
reduced.addEventListener('change', schedule)
stacked.addEventListener('change', schedule)
render()

const dialog = document.querySelector('#image-dialog')
const image = document.querySelector('#expanded-image')
const names = {
  settings: '스캔 설정',
  execution: '스캔 실행',
  report: '리포트',
}
document.querySelectorAll('[data-image]').forEach((button) =>
  button.addEventListener('click', () => {
    const key = button.dataset.image
    image.src = `./assets/${key}.png`
    image.alt = `BIScan ${names[key]} 전체 화면`
    document.querySelector('#image-title').textContent = names[key]
    dialog.showModal()
    document.body.classList.add('dialog-open')
  }),
)
document
  .querySelector('#close-dialog')
  .addEventListener('click', () => dialog.close())
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close()
})
dialog.addEventListener('close', () =>
  document.body.classList.remove('dialog-open'),
)

