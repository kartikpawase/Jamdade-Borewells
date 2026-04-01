/**
 * Jamdade Borewells - Main Application JS
 * Handles GSAP animations, theme switching, and global UI components.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initGSAPAnimations();
});

// --- Theme Toggling (Dark/Light Mode) ---
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  
  // Check for saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      htmlElement.classList.add('dark');
      updateThemeIcon(true);
  } else {
      updateThemeIcon(false);
  }

  if(themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
          htmlElement.classList.toggle('dark');
          const isDark = htmlElement.classList.contains('dark');
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
          updateThemeIcon(isDark);
      });
  }
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById('theme-icon');
  if(!icon) return;
  if(isDark) {
      // Show Sun icon (switch to light)
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />';
  } else {
      // Show Moon icon (switch to dark)
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />';
  }
}

// --- Mobile Menu Toggle ---
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  
  if(btn && menu) {
      btn.addEventListener('click', () => {
          const isHidden = menu.classList.contains('hidden');
          if(isHidden) {
              menu.classList.remove('hidden');
              // Animate in
              gsap.fromTo(menu, {opacity: 0, y: -20}, {opacity: 1, y: 0, duration: 0.3, ease: 'power2.out'});
          } else {
              // Animate out
              gsap.to(menu, {opacity: 0, y: -20, duration: 0.2, ease: 'power2.in', onComplete: () => menu.classList.add('hidden')});
          }
      });
  }
}

// --- GSAP Animations ---
function initGSAPAnimations() {
  // Register ScrollTrigger if available (depends on script inclusion in HTML)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Fade up animations for sections
      const fadeUpElements = document.querySelectorAll('.gsap-fade-up');
      
      fadeUpElements.forEach(el => {
          gsap.from(el, {
              y: 50,
              opacity: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                  trigger: el,
                  start: 'top 85%', // Trigger when top of element hits 85% of viewport
                  toggleActions: 'play none none reverse' // Play on enter, reverse on leave back
              }
          });
      });

      // Staggered lists/cards
      const staggerContainers = document.querySelectorAll('.gsap-stagger-container');
      staggerContainers.forEach(container => {
          const items = container.querySelectorAll('.gsap-stagger-item');
          if(items.length > 0) {
              gsap.from(items, {
                  y: 40,
                  opacity: 0,
                  duration: 0.6,
                  stagger: 0.15,
                  ease: 'back.out(1.7)',
                  scrollTrigger: {
                      trigger: container,
                      start: 'top 80%',
                      toggleActions: 'play none none reverse'
                  }
              });
          }
      });
  }
}

// --- Chatbot Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const chatBtn = document.getElementById('chatbot-btn');
    const chatWin = document.getElementById('chatbot-window');
    const chatClose = document.getElementById('close-chatbot');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');

    if (chatBtn && chatWin) {
        // Open chat
        chatBtn.addEventListener('click', () => {
            chatWin.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
            chatInput.focus();
            // Hide ping dot on first open
            const ping = chatBtn.querySelector('.absolute');
            if (ping) ping.remove();
        });

        // Close chat
        chatClose.addEventListener('click', () => {
            chatWin.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        });

        // Handle send message
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = chatInput.value.trim();
            if (!msg) return;

            // User message UI
            const userHtml = `
                <div class="flex gap-2 items-end w-[85%] self-end justify-end">
                    <div class="bg-blue-600 text-white text-sm px-4 py-2 rounded-2xl rounded-tr-sm shadow-sm">
                        ${msg}
                    </div>
                </div>
            `;
            chatBody.insertAdjacentHTML('beforeend', userHtml);
            chatInput.value = '';
            chatBody.scrollTop = chatBody.scrollHeight;

            // Fake bot typing indicator
            const typingHtml = `<div id="typing-indicator" class="flex gap-2 items-start w-[85%]">
                <div class="w-6 h-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 mt-1"><i class="ph-fill ph-robot text-[10px]"></i></div>
                <div class="bg-gray-200 dark:bg-slate-800 text-gray-400 text-xs px-4 py-2 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                    <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
                    <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                </div>
            </div>`;
            chatBody.insertAdjacentHTML('beforeend', typingHtml);
            chatBody.scrollTop = chatBody.scrollHeight;

            // Fake bot reply logic
            setTimeout(() => {
                const indicator = document.getElementById('typing-indicator');
                if (indicator) indicator.remove();

                let reply = "Thanks for asking! Please call Mohan at 7038900900 or visit our Booking page to schedule a service.";
                const lmsg = msg.toLowerCase();
                if (lmsg.includes('cost') || lmsg.includes('price') || lmsg.includes('rate')) {
                    reply = "Our standard drilling rate starts at ₹120/feet depending on the soil type. Would you like to book a site inspection?";
                } else if (lmsg.includes('book') || lmsg.includes('schedule')) {
                    reply = "You can easily schedule a booking by clicking 'Book Service' in the top menu, or by calling Abhijit at 7744900200.";
                }

                const botHtml = `
                <div class="flex gap-2 items-start w-[85%]">
                    <div class="w-6 h-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 mt-1"><i class="ph-fill ph-robot text-[10px]"></i></div>
                    <div class="bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-gray-200 text-sm px-4 py-2 rounded-2xl rounded-tl-sm shadow-sm">
                        ${reply}
                    </div>
                </div>`;
                
                chatBody.insertAdjacentHTML('beforeend', botHtml);
                chatBody.scrollTop = chatBody.scrollHeight;

            }, 1000); // 1s delay
        });
    }
});
