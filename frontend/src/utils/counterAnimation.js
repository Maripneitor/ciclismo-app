// frontend/src/utils/counterAnimation.js

export const initCounters = () => {
  if (typeof window === 'undefined') return;
  
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  let animationStarted = false;

  const startCounters = () => {
    if (animationStarted) return;
    animationStarted = true;

    counters.forEach(counter => {
      const target = counter.getAttribute('data-target');
      if (!target) return;

      let targetValue;
      let suffix = '';

      if (target === '1250') {
        targetValue = 1250;
        suffix = '+';
      } else if (target === '89') {
        targetValue = 89;
        suffix = '+';
      } else if (target === '45') {
        targetValue = 45;
        suffix = 'K';
      } else {
        targetValue = parseInt(target);
      }

      const duration = 2000; // 2 seconds
      const step = targetValue / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < targetValue) {
          counter.textContent = Math.floor(current) + suffix;
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = targetValue + suffix;
        }
      };

      // Reset counter to 0 first
      counter.textContent = '0' + suffix;
      
      // Small delay for visual effect
      setTimeout(updateCounter, 300);
    });
  };

  // Start animation when element is in viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    observer.observe(statsSection);
  } else {
    // Fallback: start after a short delay
    setTimeout(startCounters, 1000);
  }
};