(function ($) {
    "use strict";
    
    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 30
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });
    

    // Typed Initiate
    if ($('.header h2').length == 1) {
        var typed_strings = $('.header .typed-text').text();
        var typed = new Typed('.header h2', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }
    
    
    // Skills
    $('.skills').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});
    
    
    // Porfolio isotope and filter
    
    //bento//
    
document.addEventListener("DOMContentLoaded", function () {
    const portfolio = document.querySelector(".bento-portfolio");

    if (!portfolio) return;

    const filters = portfolio.querySelectorAll(
        "#portfolio-flters li"
    );

    const items = portfolio.querySelectorAll(
        ".portfolio-container .portfolio-item"
    );

    filters.forEach(function (filter) {
        filter.setAttribute("tabindex", "0");
        filter.setAttribute("role", "button");

        function applyFilter() {
            const selectedCategory = filter.dataset.filter;

            filters.forEach(function (item) {
                item.classList.remove("filter-active");
                item.setAttribute("aria-pressed", "false");
            });

            filter.classList.add("filter-active");
            filter.setAttribute("aria-pressed", "true");

            items.forEach(function (item) {
                const category = item.dataset.category;
                const shouldShow =
                    selectedCategory === "all" ||
                    category === selectedCategory;

                item.classList.toggle("is-hidden", !shouldShow);
                item.setAttribute(
                    "aria-hidden",
                    String(!shouldShow)
                );
            });
        }

        filter.addEventListener("click", applyFilter);

        filter.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                applyFilter();
            }
        });
    });

    // Set initial filter state
    filters.forEach(function (filter) {
        filter.setAttribute(
            "aria-pressed",
            String(filter.classList.contains("filter-active"))
        );
    });
});

    
    // Review slider
    $('.review-slider').slick({
        autoplay: true,
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    //contactform
    document.addEventListener("DOMContentLoaded", function () {
        const contactForm = document.getElementById("contact-form");
        const formStatus = document.getElementById("form-status");

        if (!contactForm || !formStatus) return;

        contactForm.addEventListener("submit", async function (event) {
            // Prevent the browser from opening Formspree's response page
            event.preventDefault();

            const submitButton = contactForm.querySelector(
               'button[type="submit"]'
            );

            submitButton.disabled = true;
            submitButton.textContent = "Sending...";

            formStatus.textContent = "";

            try {
                // Send the form to Formspree in the background
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: {
                        Accept: "application/json"
                    }
                });

                if (response.ok) {
                    formStatus.textContent = "Message sent successfully!";

                    contactForm.reset();
                } else {
                    const result = await response.json().catch(() => null);

                    formStatus.textContent =
                        result?.errors?.map(error => error.message).join(", ") ||
                        "Message could not be sent. Please try again.";
                }
            } catch (error) {
                console.error("Form submission error:", error);

                formStatus.textContent =
                    "Connection error. Please check your internet and try again.";
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = "Send Message";
            }
        });
    });
    
/* =========================================
   SERVICE CAROUSEL
========================================= */

(function () {
    "use strict";

    const scroller = document.querySelector("#service-scroller");

    // Exit safely if the Service section is not present.
    if (!scroller) return;

    const cards = [...scroller.querySelectorAll(".service-card")];
    const prevButton = document.querySelector("#service-prev");
    const nextButton = document.querySelector("#service-next");
    const count = document.querySelector("#service-count");
    const progressButtons = [
        ...document.querySelectorAll("#service-progress button")
    ];

    if (!cards.length || !prevButton || !nextButton) return;

    let activeIndex = 0;
    let scrollTimer;

    // Keep scroll destinations within the actual scrollable range.
    function clampScroll(position) {
        const maxScroll = scroller.scrollWidth - scroller.clientWidth;

        return Math.max(0, Math.min(position, maxScroll));
    }

    // Find which card is closest to the center of the visible track.
    function getClosestCardIndex() {
        const trackCenter =
            scroller.getBoundingClientRect().left +
            scroller.clientWidth / 2;

        let closestIndex = 0;
        let smallestDistance = Infinity;

        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const distance = Math.abs(trackCenter - cardCenter);

            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
    }

    // Center the chosen card, clamped at both ends.
    function scrollToCard(index, behavior = "smooth") {
        activeIndex = Math.max(0, Math.min(index, cards.length - 1));

        const card = cards[activeIndex];

        const cardRect = card.getBoundingClientRect();
        const trackRect = scroller.getBoundingClientRect();

        const cardCenter =
            scroller.scrollLeft +
            cardRect.left -
            trackRect.left +
            cardRect.width / 2;

        const target =
            cardCenter - scroller.clientWidth / 2;

        scroller.scrollTo({
            left: clampScroll(target),
            behavior
        });

        updateControls();
    }

    // Update arrows, count, and progress.
    function updateControls() {
        count.textContent = `${activeIndex + 1} of ${cards.length}`;

        prevButton.disabled = activeIndex === 0;
        nextButton.disabled = activeIndex === cards.length - 1;

        progressButtons.forEach((button, index) => {
            const selected = index === activeIndex;

            button.classList.toggle("selected", selected);

            button.setAttribute(
                "aria-current",
                selected ? "true" : "false"
            );
        });
    }

    // Button navigation.
    prevButton.addEventListener("click", () => {
        scrollToCard(activeIndex - 1);
    });

    nextButton.addEventListener("click", () => {
        scrollToCard(activeIndex + 1);
    });

    // Click a progress segment to select a card.
    progressButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            scrollToCard(index);
        });
    });

    // Update controls after manual scrolling or swiping.
    scroller.addEventListener("scroll", () => {
        clearTimeout(scrollTimer);

        scrollTimer = setTimeout(() => {
            activeIndex = getClosestCardIndex();
            updateControls();
        }, 100);
    }, { passive: true });

    // Mouse wheel: vertical wheel movement scrolls the cards sideways.
    scroller.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
            return;
        }

        const maxScroll = scroller.scrollWidth - scroller.clientWidth;

        const atStart = scroller.scrollLeft <= 0;
        const atEnd = scroller.scrollLeft >= maxScroll - 1;

        // At an edge, allow the page itself to scroll vertically.
        if (
            (event.deltaY < 0 && atStart) ||
            (event.deltaY > 0 && atEnd)
        ) {
            return;
        }

        event.preventDefault();

        scroller.scrollBy({
            left: event.deltaY,
            behavior: "auto"
        });
    }, { passive: false });

    // Mouse / pen drag-to-scroll.
    let dragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let dragPointerId = null;

    scroller.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch") return;
        if (event.button !== 0) return;

        dragging = true;
        dragPointerId = event.pointerId;
        dragStartX = event.clientX;
        dragStartScroll = scroller.scrollLeft;

        scroller.setPointerCapture(event.pointerId);
    });

    scroller.addEventListener("pointermove", (event) => {
        if (!dragging || event.pointerId !== dragPointerId) return;

        const distance = event.clientX - dragStartX;

        scroller.scrollLeft = clampScroll(
            dragStartScroll - distance
        );
    });

    function stopDrag(event) {
        if (
            dragPointerId !== null &&
            event.pointerId !== dragPointerId
        ) {
            return;
        }

        dragging = false;
        dragPointerId = null;

        // Snap to the nearest card after dragging.
        activeIndex = getClosestCardIndex();
        scrollToCard(activeIndex);
    }

    scroller.addEventListener("pointerup", stopDrag);
    scroller.addEventListener("pointercancel", stopDrag);

    scroller.addEventListener("lostpointercapture", () => {
        dragging = false;
        dragPointerId = null;
    });

    // Keyboard support while the carousel is focused.
    scroller.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollToCard(activeIndex + 1);
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollToCard(activeIndex - 1);
        }
    });

    // Initial state and resize correction.
    updateControls();

    window.addEventListener("resize", () => {
        scrollToCard(activeIndex, "auto");
    });

})();

})(jQuery);
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

