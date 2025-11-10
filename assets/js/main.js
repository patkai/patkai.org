// ============================================
// Main JavaScript for patkai.org
// ============================================

(function() {
  'use strict';

  // ============================================
  // Dark Mode Toggle
  // ============================================

  function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
      });
    }
  }

  function updateThemeIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  // ============================================
  // Back to Top Button
  // ============================================

  function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          backToTopButton.classList.add('visible');
        } else {
          backToTopButton.classList.remove('visible');
        }
      });

      backToTopButton.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // ============================================
  // Quote Page Functionality
  // ============================================

  function initQuotes() {
    const quotesList = document.getElementById('quotes-list');
    if (!quotesList) return;

    const searchBox = document.getElementById('quote-search');
    const randomButton = document.getElementById('random-quote');
    const showAllButton = document.getElementById('show-all');

    let allQuotes = [];

    // Parse quotes from the list
    function parseQuotes() {
      const quoteItems = quotesList.querySelectorAll('.quote-item');
      allQuotes = Array.from(quoteItems).map(item => {
        return {
          element: item,
          text: item.querySelector('.quote-text').textContent.toLowerCase(),
          author: item.querySelector('.quote-author') ?
                  item.querySelector('.quote-author').textContent.toLowerCase() : '',
          number: item.querySelector('.quote-number') ?
                  item.querySelector('.quote-number').textContent : ''
        };
      });
    }

    // Filter quotes based on search
    function filterQuotes(searchTerm) {
      const term = searchTerm.toLowerCase().trim();

      allQuotes.forEach(quote => {
        if (term === '' ||
            quote.text.includes(term) ||
            quote.author.includes(term)) {
          quote.element.style.display = '';
          quote.element.classList.add('fade-in');
        } else {
          quote.element.style.display = 'none';
        }
      });

      updateQuoteCount();
    }

    // Show random quote
    function showRandomQuote() {
      if (allQuotes.length === 0) return;

      // Hide all quotes
      allQuotes.forEach(quote => {
        quote.element.style.display = 'none';
      });

      // Show random quote
      const randomIndex = Math.floor(Math.random() * allQuotes.length);
      allQuotes[randomIndex].element.style.display = '';
      allQuotes[randomIndex].element.classList.add('fade-in');

      // Scroll to the quote
      allQuotes[randomIndex].element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      updateQuoteCount();
    }

    // Show all quotes
    function showAllQuotes() {
      allQuotes.forEach(quote => {
        quote.element.style.display = '';
        quote.element.classList.add('fade-in');
      });

      if (searchBox) {
        searchBox.value = '';
      }

      updateQuoteCount();
    }

    // Update quote count display
    function updateQuoteCount() {
      const visibleQuotes = allQuotes.filter(q => q.element.style.display !== 'none').length;
      const countElement = document.getElementById('quote-count');
      if (countElement) {
        countElement.textContent = `Showing ${visibleQuotes} of ${allQuotes.length} quotes`;
      }
    }

    // Initialize
    parseQuotes();
    updateQuoteCount();

    // Event listeners
    if (searchBox) {
      searchBox.addEventListener('input', function(e) {
        filterQuotes(e.target.value);
      });

      // Add keyboard shortcut (Ctrl/Cmd + K to focus search)
      document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          searchBox.focus();
        }
      });
    }

    if (randomButton) {
      randomButton.addEventListener('click', showRandomQuote);
    }

    if (showAllButton) {
      showAllButton.addEventListener('click', showAllQuotes);
    }
  }

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ============================================
  // Fade In on Scroll
  // ============================================

  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe cards and other elements
    document.querySelectorAll('.card, .quote-item').forEach(el => {
      observer.observe(el);
    });
  }

  // ============================================
  // Copy to Clipboard for Quotes
  // ============================================

  function initCopyToClipboard() {
    const quoteItems = document.querySelectorAll('.quote-item');

    quoteItems.forEach(item => {
      // Add copy button on hover (optional enhancement)
      item.addEventListener('dblclick', function() {
        const quoteText = this.querySelector('.quote-text').textContent;
        const quoteAuthor = this.querySelector('.quote-author') ?
                            this.querySelector('.quote-author').textContent : '';

        const textToCopy = `"${quoteText}" - ${quoteAuthor}`;

        navigator.clipboard.writeText(textToCopy).then(function() {
          // Show feedback
          const feedback = document.createElement('div');
          feedback.textContent = 'Copied to clipboard!';
          feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
          `;
          document.body.appendChild(feedback);

          setTimeout(function() {
            feedback.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(function() {
              document.body.removeChild(feedback);
            }, 300);
          }, 2000);
        });
      });
    });
  }

  // ============================================
  // Initialize Everything
  // ============================================

  function init() {
    initTheme();
    initBackToTop();
    initQuotes();
    initSmoothScroll();
    initScrollAnimations();
    initCopyToClipboard();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
