/* DOGE REBORN — Theme (dark only) */
(function () {
  /* The light/dark toggle was removed; lock the site to dark mode immediately
     (before paint) so there is never a flash or a stuck light theme. */
  document.documentElement.setAttribute('data-theme', 'dark');
})();
