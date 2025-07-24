function setupStarRating(starContainerId, hiddenInputId) {
  const container = document.getElementById(starContainerId);
  const stars = container.querySelectorAll('.star');
  const hiddenInput = document.getElementById(hiddenInputId);
  let selectedValue = 0;
  let touched = false;

  function setStars(rating) {
    stars.forEach(star => {
      const starVal = parseInt(star.dataset.value, 10);
      star.classList.toggle('selected', starVal <= rating);
      star.setAttribute('aria-checked', starVal === rating ? 'true' : 'false');
    });
    hiddenInput.value = rating;
  }

  function clearHover() {
    stars.forEach(s => s.classList.remove('hovered'));
  }

  stars.forEach(star => {
    const starValue = parseInt(star.dataset.value, 10);

    // Hover for desktop
    star.addEventListener('mouseover', () => {
      if (touched) return;
      stars.forEach(s => {
        const val = parseInt(s.dataset.value, 10);
        s.classList.toggle('hovered', val <= starValue);
      });
    });

    star.addEventListener('mouseout', () => {
      if (!touched) clearHover();
    });

    // Select star
    const handleSelect = () => {
      selectedValue = starValue;
      setStars(selectedValue);
      clearHover();
    };

    star.addEventListener('click', () => {
      if (!touched) handleSelect();
    });

    star.addEventListener('touchstart', e => {
      touched = true;
      e.preventDefault();
      handleSelect();
    }, { passive: false });

    star.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectedValue = starValue;
        setStars(selectedValue);
      }
    });
  });

  setStars(0);
}

document.addEventListener('DOMContentLoaded', () => {
  setupStarRating('dessert-stars', 'dessertRating');
  setupStarRating('service-stars', 'serviceRating');

  const modal = document.getElementById('thankYouModal');
  const closeModalBtn = document.getElementById('closeModal');
  const feedbackForm = document.querySelector('form');

  function showModal() {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    closeModalBtn.focus();
  }

  function hideModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    feedbackForm.querySelector('button[type="submit"]').focus();
  }

  closeModalBtn.addEventListener('click', hideModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) hideModal();
  });

  feedbackForm.addEventListener('submit', e => {
    e.preventDefault();

    if (!document.getElementById('dessertRating').value) {
      alert('Please rate the dessert.');
      return;
    }
    if (!document.getElementById('serviceRating').value) {
      alert('Please rate the service.');
      return;
    }

    feedbackForm.querySelector('button[type="submit"]').disabled = true;

    const formData = new FormData(feedbackForm);

    fetch(feedbackForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(response => {
        if (response.ok) {
          feedbackForm.reset();
          showModal();
        } else {
          alert('Oops! There was a problem submitting your feedback. Please try again.');
        }
      })
      .catch(() => {
        alert('Oops! There was a problem submitting your feedback. Please try again.');
      })
      .finally(() => {
        feedbackForm.querySelector('button[type="submit"]').disabled = false;
      });
  });
});
