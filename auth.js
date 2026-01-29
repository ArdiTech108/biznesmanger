// Authentication System for all pages
(function() {
  'use strict';

  // Check if user is logged in (secondary check after immediate check)
  function checkAuth() {
    try {
      const currentUser = localStorage.getItem('biznesManagerCurrentUser');
      const rememberUser = localStorage.getItem('rememberUser') === 'true';
      const currentPath = window.location.pathname.toLowerCase();
      const currentHref = window.location.href.toLowerCase();
      
      // Check if we're on login or register page
      const isLoginPage = currentPath.includes('login.html') || 
                          currentPath.endsWith('login.html') ||
                          currentHref.includes('login.html');
      const isRegisterPage = currentPath.includes('regjister.html') || 
                             currentPath.endsWith('regjister.html') ||
                             currentHref.includes('regjister.html');
      
      // Check if we're on index.html or root
      const isIndexPage = currentPath.endsWith('index.html') || 
                          currentPath.endsWith('/') ||
                          currentPath === '' ||
                          currentPath === '/' ||
                          (!currentPath.includes('.html') && !isLoginPage && !isRegisterPage);
      
      // If on root/index page
      if (isIndexPage) {
        // If user is logged in AND has "remember me", allow access
        if (currentUser && rememberUser) {
          return true; // Allow access to dashboard
        } else {
          // Not logged in or not remembered, redirect to login
          // Clear session if exists but not remembered (only on page load, not during session)
          if (currentUser && !rememberUser) {
            // Only clear if this is a fresh page load (not a redirect from login)
            // Check if we just came from login by checking sessionStorage
            const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
            if (!justLoggedIn) {
              localStorage.removeItem('biznesManagerCurrentUser');
              localStorage.removeItem('rememberUser');
            } else {
              // Clear the flag after using it
              sessionStorage.removeItem('justLoggedIn');
              // Allow access for this session
              return true;
            }
          }
          window.location.replace('login.html');
          return false;
        }
      }
      
      // If on login/register page and logged in, redirect to dashboard
      if ((isLoginPage || isRegisterPage) && currentUser) {
        window.location.replace('index.html');
        return false;
      }
      
      // For other pages (dashboard, klientet, etc.), check if logged in
      if (!isLoginPage && !isRegisterPage) {
        // If not logged in, redirect to login
        if (!currentUser) {
          window.location.replace('login.html');
          return false;
        }
        // If logged in (with or without remember me), allow access during session
        // Only check remember me on fresh page loads
        const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
        if (currentUser && !rememberUser && !justLoggedIn) {
          // Not remembered and not just logged in, clear session
          localStorage.removeItem('biznesManagerCurrentUser');
          localStorage.removeItem('rememberUser');
          window.location.replace('login.html');
          return false;
        }
        // Clear the flag if it exists
        if (justLoggedIn) {
          sessionStorage.removeItem('justLoggedIn');
        }
      }
      
      return true; // Allow access if logged in
    } catch (e) {
      console.error('Auth check error:', e);
      return true; // Allow access on error to prevent redirect loop
    }
  }

  // Get current user
  function getCurrentUser() {
    const userStr = localStorage.getItem('biznesManagerCurrentUser');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  // Logout function
  function logout() {
    localStorage.removeItem('biznesManagerCurrentUser');
    localStorage.removeItem('rememberUser');
    window.location.href = 'login.html';
  }

  // Initialize auth check immediately - before page loads
  // This ensures faster redirect
  (function immediateAuthCheck() {
    try {
      const currentUser = localStorage.getItem('biznesManagerCurrentUser');
      const rememberUser = localStorage.getItem('rememberUser') === 'true';
      const currentPath = window.location.pathname.toLowerCase();
      const currentHref = window.location.href.toLowerCase();
      
      // Check if we're on login or register page
      const isLoginPage = currentPath.includes('login.html') || 
                          currentPath.endsWith('login.html') ||
                          currentHref.includes('login.html');
      const isRegisterPage = currentPath.includes('regjister.html') || 
                             currentPath.endsWith('regjister.html') ||
                             currentHref.includes('regjister.html');
      
      // Check if we're on index.html or root (homepage)
      const isIndexPage = currentPath.endsWith('index.html') || 
                          currentPath.endsWith('/') ||
                          currentPath === '' ||
                          currentPath === '/' ||
                          (!currentPath.includes('.html') && !isLoginPage && !isRegisterPage);
      
      // ALWAYS redirect root/index to login.html first
      // Then check if user has "remember me" to allow direct access
      if (isIndexPage) {
        // If user is logged in AND has "remember me", allow access to dashboard
        if (currentUser && rememberUser) {
          // User is remembered, allow access to dashboard
          return;
        } else {
          // Not logged in or not remembered, go to login
          // Clear session if exists but not remembered
          if (currentUser && !rememberUser) {
            localStorage.removeItem('biznesManagerCurrentUser');
          }
          window.location.replace('login.html');
          return;
        }
      }
      
      // If on login/register page and logged in, redirect to dashboard
      // (Allow access even without remember me for current session)
      if ((isLoginPage || isRegisterPage) && currentUser) {
        window.location.replace('index.html');
        return;
      }
    } catch (e) {
      console.error('Auth check error:', e);
    }
  })();
  
  // Also check on DOMContentLoaded for additional safety
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuth);
  } else {
    // Small delay to ensure immediate check runs first
    setTimeout(checkAuth, 50);
  }

  // Add logout functionality to user menu if it exists
  document.addEventListener('DOMContentLoaded', function() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
      // Create dropdown menu
      const dropdown = document.createElement('div');
      dropdown.className = 'user-dropdown';
      dropdown.style.cssText = 'display: none; position: absolute; top: 100%; right: 0; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-top: 8px; min-width: 200px; z-index: 1000;';
      
      dropdown.innerHTML = `
        <div style="padding: 0.5rem 0;">
          <a href="index.html" style="display: block; padding: 0.75rem 1rem; color: var(--gray-700); text-decoration: none; transition: background 0.2s;">
            <i class="fas fa-home" style="margin-right: 0.5rem;"></i> Dashboard
          </a>
          <a href="#" id="logoutBtn" style="display: block; padding: 0.75rem 1rem; color: var(--danger-color); text-decoration: none; transition: background 0.2s; border-top: 1px solid var(--gray-200);">
            <i class="fas fa-sign-out-alt" style="margin-right: 0.5rem;"></i> Dil
          </a>
        </div>
      `;
      
      userMenu.style.position = 'relative';
      userMenu.appendChild(dropdown);
      
      // Toggle dropdown
      userMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        const isHidden = dropdown.style.display === 'none';
        dropdown.style.display = isHidden ? 'block' : 'none';
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!userMenu.contains(e.target)) {
          dropdown.style.display = 'none';
        }
      });
      
      // Logout button
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          if (confirm('Jeni të sigurt që dëshironi të dilni?')) {
            logout();
          }
        });
      }
    }
  });

  // Export functions for use in other scripts
  window.Auth = {
    checkAuth: checkAuth,
    getCurrentUser: getCurrentUser,
    logout: logout
  };
})();
