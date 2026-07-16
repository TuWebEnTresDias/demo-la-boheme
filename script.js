/* ============================================
   LA BOHÈME — Landing Page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // --- Header Scroll Effect ---
  const header = document.getElementById('header');
  let lastScroll = 0;
  
  function handleHeaderScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }
  
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  
  // --- Mobile Menu Toggle ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.header__mobile-nav-link');
  
  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    
    mobileNavLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        hamburgerBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
  
  // --- Scroll Animations (Intersection Observer) ---
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };
  
  const scrollObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animateElements.forEach(function(el) {
    scrollObserver.observe(el);
  });
  
  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // --- Reservation Form to WhatsApp ---
  const reservationForm = document.getElementById('reservationForm');
  
  if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const name = formData.get('name');
      const phone = formData.get('phone');
      const date = formData.get('date');
      const time = formData.get('time');
      const guests = formData.get('guests');
      const location = formData.get('location');
      const notes = formData.get('notes');
      
      // Format date nicely
      let formattedDate = date;
      if (date) {
        const dateObj = new Date(date + 'T12:00:00');
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        formattedDate = dateObj.toLocaleDateString('es-AR', options);
      }
      
      // Build WhatsApp message
      let message = 'Hola! Quiero hacer una reserva en La Bohème\n\n';
      message += '*Datos de la reserva:*\n';
      message += '• Nombre: ' + name + '\n';
      message += '• Teléfono: ' + phone + '\n';
      message += '• Fecha: ' + formattedDate + '\n';
      message += '• Horario: ' + time + '\n';
      message += '• Personas: ' + guests + '\n';
      message += '• Preferencia: ' + location + '\n';
      
      if (notes) {
        message += '\n*Nota:* ' + notes + '\n';
      }
      
      message += '\n¡Gracias!';
      
      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);
      
      // Open WhatsApp
      window.open('https://wa.me/5491137666645?text=' + encodedMessage, '_blank');
    });
  }
  
  // --- Gallery Lightbox Effect (simple) ---
  const galleryItems = document.querySelectorAll('.gallery__item');
  
  galleryItems.forEach(function(item) {
    item.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (!img) return;
      
      // Create lightbox
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      
      const lightboxImg = document.createElement('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 4px;
        transform: scale(0.9);
        transition: transform 0.3s ease;
      `;
      
      lightbox.appendChild(lightboxImg);
      document.body.appendChild(lightbox);
      
      // Trigger animation
      requestAnimationFrame(function() {
        lightbox.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      });
      
      // Close on click
      lightbox.addEventListener('click', function() {
        lightbox.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.9)';
        setTimeout(function() {
          lightbox.remove();
        }, 300);
      });
      
      // Close on Escape
      function handleEscape(e) {
        if (e.key === 'Escape') {
          lightbox.click();
          document.removeEventListener('keydown', handleEscape);
        }
      }
      document.addEventListener('keydown', handleEscape);
    });
  });
  
  // --- Set minimum date for reservation ---
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', year + '-' + month + '-' + day);
  }
  
  // --- Parallax effect on hero (subtle) ---
  const heroBg = document.querySelector('.hero__bg-img');
  
  if (heroBg) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const heroHeight = document.querySelector('.hero').offsetHeight;
      
      if (scrolled < heroHeight) {
        heroBg.style.transform = 'scale(1.05) translateY(' + (scrolled * 0.15) + 'px)';
      }
    }, { passive: true });
  }
  
});