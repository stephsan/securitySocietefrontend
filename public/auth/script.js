// Corporate Login Form - Production Safe Version
class CorporateLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');

        // 🔒 Sécurité : arrêter si le formulaire n'existe pas
        if (!this.form) {
            console.warn('[CorporateLoginForm] loginForm not found. Script stopped.');
            return;
        }

        // Récupération sécurisée des éléments
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.submitButton = this.form.querySelector('.login-btn');
        this.successMessage = document.getElementById('successMessage');
        this.ssoButtons = document.querySelectorAll('.sso-btn');

        console.log('[CorporateLoginForm] Initialized successfully');

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupSSOButtons();
    }

    bindEvents() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        this.emailInput?.addEventListener('blur', () => this.validateEmail());
        this.passwordInput?.addEventListener('blur', () => this.validatePassword());

        this.emailInput?.addEventListener('input', () => this.clearError('email'));
        this.passwordInput?.addEventListener('input', () => this.clearError('password'));
    }

    setupPasswordToggle() {
        if (!this.passwordToggle || !this.passwordInput) return;

        this.passwordToggle.addEventListener('click', () => {
            const type = this.passwordInput.type === 'password' ? 'text' : 'password';
            this.passwordInput.type = type;

            const icon = this.passwordToggle.querySelector('.toggle-icon');
            icon?.classList.toggle('show-password', type === 'text');
        });
    }

    setupSSOButtons() {
        this.ssoButtons?.forEach(button => {
            button.addEventListener('click', () => {
                const provider = button.classList.contains('azure-btn') ? 'Azure AD' : 'Okta';
                this.handleSSOLogin(provider);
            });
        });
    }

    validateEmail() {
        if (!this.emailInput) return false;

        const email = this.emailInput.value.trim();
        const businessEmailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil)$/i;

        if (!email) return this.showError('email', 'Business email is required');
        if (!businessEmailRegex.test(email)) return this.showError('email', 'Invalid business email');

        const personalDomains = ['gmail.com','yahoo.com','hotmail.com','outlook.com'];
        const domain = email.split('@')[1]?.toLowerCase();
        if (personalDomains.includes(domain))
            return this.showError('email', 'Use your business email');

        this.clearError('email');
        return true;
    }

    validatePassword() {
        if (!this.passwordInput) return false;

        const password = this.passwordInput.value;
        if (!password) return this.showError('password','Password required');
        if (password.length < 8) return this.showError('password','Min 8 characters');

        const strong = /[A-Z]/.test(password) && /[a-z]/.test(password) &&
                       /\d/.test(password) && /[!@#$%^&*]/.test(password);

        if (!strong)
            return this.showError('password','Weak corporate password');

        this.clearError('password');
        return true;
    }

    showError(field, message) {
        const input = document.getElementById(field);
        if (!input) return false;

        const formGroup = input.closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);

        formGroup?.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        return false;
    }

    clearError(field) {
        const input = document.getElementById(field);
        if (!input) return;

        const formGroup = input.closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);

        formGroup?.classList.remove('error');
        errorElement?.classList.remove('show');
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateEmail() || !this.validatePassword()) return;

        this.setLoading(true);

        await new Promise(r => setTimeout(r, 2000));
        this.showSuccess();
        this.setLoading(false);
    }

    async handleSSOLogin(provider) {
        console.log(`[SSO] Redirecting to ${provider}`);
        await new Promise(r => setTimeout(r, 1500));
    }

    setLoading(loading) {
        this.submitButton?.classList.toggle('loading', loading);
        if (this.submitButton) this.submitButton.disabled = loading;

        this.ssoButtons?.forEach(btn => {
            btn.style.pointerEvents = loading ? 'none' : 'auto';
            btn.style.opacity = loading ? '0.6' : '1';
        });
    }

    showSuccess() {
        this.form.style.display = 'none';
        document.querySelector('.sso-options')?.style.setProperty('display','none');
        document.querySelector('.footer-links')?.style.setProperty('display','none');
        this.successMessage?.classList.add('show');
    }
}

//
// 🔥 INITIALISATION ULTRA ROBUSTE POUR PROD
//

function initCorporateLoginWhenReady() {
    const formExists = document.getElementById('loginForm');

    if (formExists) {
        new CorporateLoginForm();
        return;
    }

    // Si HTML injecté dynamiquement (Laravel/Vite/Turbo/etc)
    const observer = new MutationObserver(() => {
        if (document.getElementById('loginForm')) {
            console.log('[CorporateLoginForm] Form detected dynamically');
            new CorporateLoginForm();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Attendre DOM prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCorporateLoginWhenReady);
} else {
    initCorporateLoginWhenReady();
}