
const wrapper = document.getElementById('main-wrapper');
const btnGoSignup = document.getElementById('go-to-signup');
const btnGoLogin = document.getElementById('go-to-login');

// Switch to the signup form
btnGoSignup.addEventListener('click', () => {
    wrapper.classList.add('right-active');
});

// Switch back to the login form
btnGoLogin.addEventListener('click', () => {
    wrapper.classList.remove('right-active');
});

const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const loginPanel = document.querySelector('.login-panel');
const signupPanel = document.querySelector('.signup-panel');

// Show the form selected in the mobile tabs
function updateMobileView(isLogin) {
    if (isLogin) {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');

        loginPanel.classList.add('active-mobile');
        signupPanel.classList.remove('active-mobile');
    } else {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');

        signupPanel.classList.add('active-mobile');
        loginPanel.classList.remove('active-mobile');
    }
}

// Show login first when the page opens on mobile
if (window.innerWidth <= 768) {
    updateMobileView(true);
}

tabLogin.addEventListener('click', () => updateMobileView(true));
tabSignup.addEventListener('click', () => updateMobileView(false));


// Show or hide the password when the eye icon is clicked
const toggleIcons = document.querySelectorAll('.toggle-pw');

toggleIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const input = icon.previousElementSibling.previousElementSibling;

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('ri-eye-off-line');
            icon.classList.add('ri-eye-line');
        } else {
            input.type = 'password';
            icon.classList.remove('ri-eye-line');
            icon.classList.add('ri-eye-off-line');
        }
    });
});


const signupPw = document.getElementById('s-password');
const checkLen = document.getElementById('check-len');
const checkUp = document.getElementById('check-up');
const checkNum = document.getElementById('check-num');
const checkSpec = document.getElementById('check-spec');

let isValidPassword = false;

// Check the password rules as the user types
signupPw.addEventListener('input', () => {
    const val = signupPw.value;
    isValidPassword = true;

    // Password should have at least 8 characters
    if (val.length >= 8) {
        checkLen.classList.add('valid');
        checkLen.innerHTML = '<i class="ri-check-line"></i> 8+ characters';
    } else {
        checkLen.classList.remove('valid');
        checkLen.innerHTML = '<i class="ri-close-line"></i> 8+ characters';
        isValidPassword = false;
    }

    // Check for an uppercase letter
    if (/[A-Z]/.test(val)) {
        checkUp.classList.add('valid');
        checkUp.innerHTML = '<i class="ri-check-line"></i> One uppercase';
    } else {
        checkUp.classList.remove('valid');
        checkUp.innerHTML = '<i class="ri-close-line"></i> One uppercase';
        isValidPassword = false;
    }

    // Check for at least one number
    if (/[0-9]/.test(val)) {
        checkNum.classList.add('valid');
        checkNum.innerHTML = '<i class="ri-check-line"></i> One number';
    } else {
        checkNum.classList.remove('valid');
        checkNum.innerHTML = '<i class="ri-close-line"></i> One number';
        isValidPassword = false;
    }

    // Check for a special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(val)) {
        checkSpec.classList.add('valid');
        checkSpec.innerHTML = '<i class="ri-check-line"></i> One special character';
    } else {
        checkSpec.classList.remove('valid');
        checkSpec.innerHTML = '<i class="ri-close-line"></i> One special character';
        isValidPassword = false;
    }
});


const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');


// Handle account creation
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const errorMsg = document.getElementById('signup-error');
    const btn = document.getElementById('signup-btn');
    const confirmPw = document.getElementById('s-confirm');

    const email = document.getElementById('s-email').value;
    const password = signupPw.value;

    errorMsg.textContent = '';

    // Don't continue if the password rules aren't met
    if (!isValidPassword) {
        errorMsg.textContent = 'Please meet all password requirements.';
        return;
    }

    // Make sure both password fields match
    if (password !== confirmPw.value) {
        errorMsg.textContent = 'Passwords do not match.';
        return;
    }

    // Show a loading message while processing
    btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Processing...';
    btn.disabled = true;

    setTimeout(() => {
        let users = JSON.parse(localStorage.getItem('metaskill_users')) || [];

        // Check if this email is already registered
        const userExists = users.find(u => u.email === email);

        if (userExists) {
            errorMsg.textContent = 'An account with this email already exists.';
            btn.innerHTML = 'Create Account';
            btn.disabled = false;
            return;
        }

        // Save the new account in local storage
        users.push({ email: email, password: password });
        localStorage.setItem('metaskill_users', JSON.stringify(users));

        btn.innerHTML = 'Account created!';
        btn.style.background = '#22c55e';

        // Reset the form after showing the success message
        setTimeout(() => {
            signupForm.reset();
            btn.innerHTML = 'Create Account';
            btn.style.background = '';
            btn.disabled = false;

            wrapper.classList.remove('right-active');

            if (window.innerWidth <= 768) {
                updateMobileView(true);
            }
        }, 2000);
    }, 1500);
});


// Handle login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = document.getElementById('login-btn');
    const errorMsg = document.getElementById('login-error');

    const email = document.getElementById('l-email').value;
    const password = document.getElementById('l-password').value;

    errorMsg.textContent = '';

    btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Checking...';
    btn.disabled = true;

    // Give the login check a short delay
    setTimeout(() => {
        let users = JSON.parse(localStorage.getItem('metaskill_users')) || [];

        // Look for a matching email and password
        const validUser = users.find(
            u => u.email === email && u.password === password
        );

        // Allow the demo account to log in too
        const isDemo = (
            email === 'demo@metaskill.com' &&
            password === 'Password123!'
        );

        if (validUser || isDemo) {
            btn.innerHTML = 'Welcome back!';
            btn.style.background = '#22c55e';

            setTimeout(() => {
                loginForm.reset();
                btn.innerHTML = 'Login';
                btn.style.background = '';
                btn.disabled = false;
            }, 2000);
        } else {
            // Show an error if the details don't match
            btn.innerHTML = 'Login';
            btn.disabled = false;
            errorMsg.textContent = 'Incorrect email or password. Please try again.';
        }
    }, 1500);
});
