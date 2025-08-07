
// my part *nav tabs*
const tabs = document.querySelectorAll(".setting-menu ul li");
const panels = document.querySelectorAll(".setting-content");
tabs.forEach(tab => {
  tab.addEventListener('click', function (e) {
    tabs.forEach(tab => tab.classList.remove('active'));
    tab.classList.add('active');
    panels.forEach(panel => panel.classList.add('none'));
    const targetId = tab.getAttribute('data-target');
    const targetEl = document.getElementById(targetId);
    if (targetEl) targetEl.classList.remove('none')
  });
});