'use strict';
document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('primary-nav');
menuToggle.hidden = false;
function closeMenu(returnFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  nav.classList.remove('is-open');
  menuToggle.querySelector('use').setAttribute('href', '#i-menu');
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  nav.classList.toggle('is-open', open);
  menuToggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
window.matchMedia('(min-width: 981px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// Contact-click events are available for a future consent-aware GTM installation.
// Do not send names, city text, contact information or message contents to analytics.
function track(event, location, interest) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, contact_location: location, ...(interest ? { enquiry_interest: interest } : {}) });
}
document.querySelectorAll('[data-track]').forEach(link => {
  link.addEventListener('click', () => track(link.dataset.track, link.dataset.location));
});
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const input = Array.from(document.querySelectorAll('input[name="interest"]')).find(input => input.value === link.dataset.service);
    if (input) input.checked = true;
  });
});
document.getElementById('enquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(event.currentTarget);
  const name = String(fields.get('customer_name') || '').trim();
  const city = String(fields.get('city') || '').trim();
  const interest = String(fields.get('interest') || 'Sell old gold');
  const message = [
    'Hello Aishwaryam Gold,',
    ...(name ? [`My name is ${name}.`] : []),
    `I would like to enquire about: ${interest}.`,
    ...(city ? [`My city: ${city}.`] : []),
    'Please share the next steps and help me find the right branch.'
  ].join('\n');
  track('whatsapp_click', 'enquiry_form', interest);
  // This is a contact click, never a confirmed lead or a sent message.
  window.open('https://wa.me/919166969166?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
});
document.querySelector('a[href="#privacy"]').addEventListener('click', () => { document.getElementById('privacy').open = true; });
document.getElementById('year').textContent = new Date().getFullYear();
