/*Experience*/
(function ($) {
    "use strict";

    const cards = [...document.querySelectorAll(".plan-card")];
const count = document.querySelector("#count");
const progressButtons = [...document.querySelectorAll(".progress-segment")];
let active = 2; // Premium is front-most initially, like the reference video.

function paintCarousel() {
  // Arrange the selected card at the front, followed by the other two behind it.
  cards.forEach((card, index) => {
    const relative = (index - active + cards.length) % cards.length;
    card.dataset.position = ["active", "behind1", "behind2"][relative];
  });
  count.textContent = `${active + 1} of ${cards.length}`;
  progressButtons.forEach((button, index) => {
    button.classList.toggle("selected", index === active);
    button.setAttribute("aria-current", index === active ? "true" : "false");
  });
}

function go(direction) {
  active = (active + direction + cards.length) % cards.length;
  paintCarousel();
}

document.querySelector("#prev").addEventListener("click", () => go(-1));
document.querySelector("#next").addEventListener("click", () => go(1));
progressButtons.forEach(button => {
  button.addEventListener("click", () => {
    active = Number(button.dataset.slide);
    paintCarousel();
  });
});
paintCarousel();
  
})(jQuery);

