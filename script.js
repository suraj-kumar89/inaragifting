
(function(){
  var els = document.querySelectorAll('.reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    els.forEach(function(el){ el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(function(el){ io.observe(el); });
})();

document.querySelectorAll('.reel').forEach((reel) => {

  const video = reel.querySelector('.reel-video');
  const centerPlay = reel.querySelector('.video-play');
  const playPause = reel.querySelector('.play-pause');
  const stop = reel.querySelector('.stop');

  // Center Play button
  centerPlay.addEventListener('click', () => {
    video.play();
  });

  // Play / Pause
  playPause.addEventListener('click', () => {

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }

  });

  // Stop
  stop.addEventListener('click', () => {

    video.pause();
    video.currentTime = 0;

  });

  // Update play/pause icon
  video.addEventListener('play', () => {

    centerPlay.style.opacity = '0';
    centerPlay.style.pointerEvents = 'none';

    playPause.textContent = '❚❚';

  });

  video.addEventListener('pause', () => {

    centerPlay.style.opacity = '1';
    centerPlay.style.pointerEvents = 'auto';

    playPause.textContent = '▶';

  });

  // When video finishes
  video.addEventListener('ended', () => {

    centerPlay.style.opacity = '1';
    centerPlay.style.pointerEvents = 'auto';

    playPause.textContent = '▶';

  });

});


(function(){
  var els = document.querySelectorAll('.reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    els.forEach(function(el){ el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(function(el){ io.observe(el); });
})();


document.querySelectorAll('.testimonial-video-wrap').forEach((wrap) => {
  const video = wrap.querySelector('.testimonial-video');
  const playBtn = wrap.querySelector('.testimonial-play');
  const stopBtn = wrap.querySelector('.testimonial-stop');

  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playBtn.textContent = 'Pause';
    } else {
      video.pause();
      playBtn.textContent = 'Play';
    }
  });

  stopBtn.addEventListener('click', () => {
    video.pause();
    video.currentTime = 0;
    playBtn.textContent = 'Play';
  });

  video.addEventListener('ended', () => {
    playBtn.textContent = 'Play';
  });
});

/* =========================================
   GET A QUOTE MODAL
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  const modal = document.getElementById("quoteModal");
  const overlay = document.getElementById("quoteModalOverlay");
  const closeButton = document.getElementById("closeQuoteModal");

  const openButtons = [
    document.getElementById("openQuoteModal"),
    document.getElementById("openQuoteModalFromBrief"),
    document.getElementById("openQuoteModalBottom")
  ].filter(Boolean);


  // Stop if popup does not exist
  if (!modal) {
    return;
  }


  /* -----------------------------------------
     OPEN MODAL
  ----------------------------------------- */

  function openQuoteModal(event) {

    if (event) {
      event.preventDefault();
    }

    modal.classList.add("is-open");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "quote-modal-open"
    );


    // Focus first field
    setTimeout(function () {

      const firstInput =
        document.getElementById("quoteName");

      if (firstInput) {
        firstInput.focus();
      }

    }, 250);
  }


  /* -----------------------------------------
     CLOSE MODAL
  ----------------------------------------- */

  function closeQuoteModal() {

    modal.classList.remove("is-open");

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "quote-modal-open"
    );

  }


  /* -----------------------------------------
     OPEN BUTTONS
  ----------------------------------------- */

  openButtons.forEach(function (button) {

    button.addEventListener(
      "click",
      openQuoteModal
    );

  });


  /* -----------------------------------------
     CLOSE BUTTON
  ----------------------------------------- */

  if (closeButton) {

    closeButton.addEventListener(
      "click",
      closeQuoteModal
    );

  }


  /* -----------------------------------------
     CLICK OUTSIDE MODAL
  ----------------------------------------- */

  if (overlay) {

    overlay.addEventListener(
      "click",
      closeQuoteModal
    );

  }


  /* -----------------------------------------
     ESC KEY
  ----------------------------------------- */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" &&
        modal.classList.contains("is-open")
      ) {

        closeQuoteModal();

      }

    }
  );

});

/* =========================================
   HUBSPOT FORM SUBMISSION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("quoteBrief");

  if (!form) {
    return;
  }


  form.addEventListener("submit", async function (event) {

    event.preventDefault();


    // -----------------------------------------
    // CHECK FORM VALIDATION
    // -----------------------------------------

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }


    // -----------------------------------------
    // SUBMIT BUTTON
    // -----------------------------------------

    const submitButton =
      form.querySelector('input[type="submit"]');

    const originalText =
      submitButton.value;

    submitButton.disabled = true;
    submitButton.value = "Sending...";


    // -----------------------------------------
    // GET FORM VALUES
    // -----------------------------------------

    const formData = new FormData(form);


    const fields = [
      {
        name: "firstname",
        value: formData.get("firstname")
      },

      {
        name: "company",
        value: formData.get("company")
      },

      {
        name: "email",
        value: formData.get("email")
      },

      {
        name: "phone",
        value: formData.get("phone")
      },

      {
        name: "corporate_gift_quantity",
        value: formData.get("corporate_gift_quantity")
      },

      {
        name: "delivery_city",
        value: formData.get("delivery_city")
      },

      {
        name: "required_delivery_date",
        value: formData.get("required_delivery_date")
      },

      {
        name: "additional_requirements",
        value:
          formData.get("additional_requirements") || ""
      }
    ];


    // -----------------------------------------
    // HUBSPOT SUBMISSION
    // -----------------------------------------

    try {

      const response = await fetch(
        "https://api.hsforms.com/submissions/v3/integration/submit/247389613/73054849-9223-4171-bd91-dfa3fd69bafc",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            fields: fields,

            context: {
              pageUri: window.location.href,
              pageName:
                "Inara Rituals Corporate Gifting"
            }

          })
        }
      );


      const result = await response.text();


      // -----------------------------------------
      // HUBSPOT ERROR
      // -----------------------------------------

      if (!response.ok) {

        console.error(
          "HubSpot submission failed:",
          response.status,
          result
        );

        alert(
          "We couldn't submit your enquiry. Please try again."
        );

        submitButton.disabled = false;
        submitButton.value = originalText;

        return;
      }


      // -----------------------------------------
      // SUCCESS
      // -----------------------------------------

      console.log(
        "HubSpot submission successful:",
        result
      );


      // Redirect to booking page
      window.location.href = "/thank_you";

    }

    catch (error) {

      console.error(
        "HubSpot submission error:",
        error
      );

      alert(
        "Something went wrong. Please try again or contact us on WhatsApp."
      );

      submitButton.disabled = false;
      submitButton.value = originalText;

    }

  });

});