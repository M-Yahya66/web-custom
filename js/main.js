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
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('filter-active');
        $(this).addClass('filter-active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
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
    const scroller = document.querySelector("#scroller");
    const cards = [...scroller.querySelectorAll(".card")];

    function moveByCard(direction) {
        const card = cards[0];
        const gap = parseFloat(getComputedStyle(scroller).gap) || 0;
        scroller.scrollBy({
            left: direction * (card.getBoundingClientRect().width + gap),
            behavior: "smooth"
        });
    }

    document.querySelector("#prev").addEventListener("click", () => moveByCard(-1));
    document.querySelector("#next").addEventListener("click", () => moveByCard(1));

    // Turn vertical mouse-wheel movement into horizontal scrolling over the cards.
    scroller.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            scroller.scrollBy({ left: event.deltaY, behavior: "auto" });
        }
    }, { passive: false });

    // Mouse drag-to-scroll. Touch swiping works natively.
    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    scroller.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch") return;
        dragging = true;
        startX = event.clientX;
        startScroll = scroller.scrollLeft;
        scroller.setPointerCapture(event.pointerId);
    });

    scroller.addEventListener("pointermove", (event) => {
        if (dragging) scroller.scrollLeft = startScroll - (event.clientX - startX);
    });

    function stopDrag() { dragging = false; }
    scroller.addEventListener("pointerup", stopDrag);
    scroller.addEventListener("pointercancel", stopDrag);
})(jQuery);
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


