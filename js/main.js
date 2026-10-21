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

  
})(jQuery);


