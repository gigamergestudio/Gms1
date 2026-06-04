/* ============================================
   AUTHENTICATION SYSTEM
   ============================================ */

class AuthManager {
    constructor() {
        this.currentUser = db.getCurrentUser();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Auth Button
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            authBtn.addEventListener('click', () => this.openAuthModal());
        }

        // Auth Modal
        const authModal = document.getElementById('authModal');
        const authModalClose = document.getElementById('authModalClose');
        if (authModalClose) {
            authModalClose.addEventListener('click', () => this.closeAuthModal());
        }

        // Auth Tabs
        const authTabs = document.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchAuthTab(e.target.dataset.tab));
        });

        // Login Form
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handleLogin());
        }

        // Signup Form
        const signupBtn = document.getElementById('signupBtn');
        if (signupBtn) {
            signupBtn.addEventListener('click', () => this.handleSignup());
        }

        // Google Login (placeholder)
        const googleLoginBtn = document.getElementById('googleLoginBtn');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => this.handleGoogleLogin());
        }

        // Update button based on auth state
        this.updateAuthButton();

        // Enter key support
        document.getElementById('loginEmail')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        document.getElementById('loginPassword')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        document.getElementById('signupName')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSignup();
        });
        document.getElementById('signupEmail')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSignup();
        });
        document.getElementById('signupPassword')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSignup();
        });
    }

    openAuthModal() {
        const authModal = document.getElementById('authModal');
        if (this.currentUser) {
            // Show profile instead of auth
            this.openProfileModal();
            return;
        }
        authModal.classList.add('active');
        this.switchAuthTab('login');
    }

    closeAuthModal() {
        const authModal = document.getElementById('authModal');
        authModal.classList.remove('active');
    }

    switchAuthTab(tab) {
        // Update tabs
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update forms
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(f => f.classList.remove('active'));
        document.getElementById(tab + 'Form').classList.add('active');
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        try {
            const user = await db.logIn(email, password);
            this.currentUser = user;
            this.updateAuthButton();
            this.closeAuthModal();
            this.showNotification(`Welcome back, ${user.name}! 🎉`, 'success');
            this.loadDashboard();
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    async handleSignup() {
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const role = document.querySelector('input[name="role"]:checked')?.value;

        if (!name || !email || !password || !role) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            const user = await db.signUp(email, password, name, role);
            this.currentUser = user;
            this.updateAuthButton();
            this.closeAuthModal();
            this.showNotification(`Welcome to GigaMerge, ${name}! 🚀`, 'success');
            this.loadDashboard();
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    handleGoogleLogin() {
        // Placeholder for Google OAuth
        this.showNotification('Google login coming soon! 🔐', 'info');
    }

    updateAuthButton() {
        const authBtn = document.getElementById('authBtn');
        if (this.currentUser) {
            authBtn.textContent = `${this.currentUser.name} (${this.currentUser.role})`;
            authBtn.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
            authBtn.style.color = 'var(--bg-dark)';
        } else {
            authBtn.textContent = 'Login';
            authBtn.style.background = 'var(--bg-card)';
            authBtn.style.color = 'var(--primary)';
        }
    }

    openProfileModal() {
        const profileModal = document.getElementById('profileModal');
        const profileContent = document.getElementById('profileContent');

        if (!this.currentUser) return;

        profileContent.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">${this.currentUser.name.charAt(0).toUpperCase()}</div>
                <h3 class="profile-name">${this.currentUser.name}</h3>
                <p class="profile-role">${this.currentUser.role}</p>
            </div>

            <div class="profile-section">
                <h4>Account Info</h4>
                <p><strong>Email:</strong> ${this.currentUser.email}</p>
                <p><strong>Role:</strong> ${this.currentUser.role}</p>
                <p><strong>Member Since:</strong> ${new Date(this.currentUser.createdAt).toLocaleDateString()}</p>
            </div>

            ${this.currentUser.role === 'creator' ? `
                <div class="profile-section">
                    <h4>Creator Profile</h4>
                    <p><strong>Rating:</strong> ⭐ ${this.currentUser.profile.rating}/5</p>
                    <p><strong>Completed Projects:</strong> ${this.currentUser.profile.portfolio?.length || 0}</p>
                </div>
                
                <div class="profile-section">
                    <h4>Skills</h4>
                    <div class="profile-skills">
                        ${this.currentUser.profile.skills?.length > 0 
                            ? this.currentUser.profile.skills.map(skill => 
                                `<span class="profile-skill">${skill}</span>`
                              ).join('')
                            : '<span style="color: var(--text-secondary);">No skills added yet</span>'
                        }
                    </div>
                </div>
            ` : ''}

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                <button class="btn btn-secondary full-width" id="editProfileBtn">Edit Profile</button>
                <button class="btn btn-primary full-width" id="logoutBtn">Logout</button>
            </div>
        `;

        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        document.getElementById('editProfileBtn').addEventListener('click', () => this.showEditProfile());

        profileModal.classList.add('active');
    }

    showEditProfile() {
        // Placeholder for edit profile
        this.showNotification('Edit profile feature coming soon! 🔧', 'info');
    }

    async handleLogout() {
        await db.logOut();
        this.currentUser = null;
        this.updateAuthButton();
        document.getElementById('profileModal').classList.remove('active');
        this.showNotification('You have been logged out', 'info');
        this.resetDashboard();
    }

    loadDashboard() {
        // This would load creator dashboard or client dashboard
        // For now, show a message
        console.log('Loading dashboard for:', this.currentUser);
    }

    resetDashboard() {
        // Reset any dashboard-specific content
        console.log('Dashboard reset');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'error' ? '#ff6b6b' : type === 'success' ? '#51cf66' : '#4dabf7'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 3000;
            animation: slideInRight 0.4s ease;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOutScale 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }
}

// Initialize Auth Manager
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
