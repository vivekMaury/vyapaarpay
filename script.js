// script.js for VyapaarPay Finance

// Mobile menu toggle functionality with smooth animation and scroll lock
let isMenuOpen = false; // Boolean state to track menu visibility

document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('mobile-menu-button');
    const hamburgerIcon = button.querySelector('.hamburger-icon');
    const closeIcon = button.querySelector('.close-icon');

    // Toggle the boolean state
    isMenuOpen = !isMenuOpen;

    // Toggle CSS classes for smooth animation
    if (isMenuOpen) {
        menu.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        // Switch to close icon
        hamburgerIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        // Lock body scroll to prevent background movement
        document.body.style.overflow = 'hidden';
    } else {
        menu.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
        // Switch back to hamburger icon
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        // Unlock body scroll
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when a nav link is clicked
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = mobileMenu.querySelectorAll('a');

    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Close the menu by removing the open class and updating state
            mobileMenu.classList.remove('open');
            isMenuOpen = false;
            const button = document.getElementById('mobile-menu-button');
            button.setAttribute('aria-expanded', 'false');
            // Reset icons to hamburger
            const hamburgerIcon = button.querySelector('.hamburger-icon');
            const closeIcon = button.querySelector('.close-icon');
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            // Unlock body scroll
            document.body.style.overflow = 'auto';
        });
    });
});

// WhatsApp Configuration
// Using WhatsApp Click-to-Chat URLs for instant contact without API
// Pre-filled messages provide context and improve lead quality
const whatsappConfig = {
    number: '+91XXXXXXXXXX', // Placeholder - replace with actual number
    messages: {
        general: 'Hello VyapaarPay Finance, I am looking for guidance on loan options. Please assist.',
        personal: 'Hello VyapaarPay Finance, I am looking for guidance on a Personal Loan. Please assist.',
        business: 'Hello VyapaarPay Finance, I am looking for guidance on a Business/MSME Loan. Please assist.',
        home: 'Hello VyapaarPay Finance, I am looking for guidance on a Home/Vehicle Loan. Please assist.',
        thankYou: 'Hi VyapaarPay Finance, I just submitted a loan inquiry and would like to speak with an advisor.'
    }
};

// Generate WhatsApp Click-to-Chat URL with pre-filled message
function generateWhatsAppURL(messageType = 'general') {
    const message = encodeURIComponent(whatsappConfig.messages[messageType]);
    return `https://wa.me/${whatsappConfig.number.replace('+', '')}?text=${message}`;
}

// Primary CTA Handler: Redirects to thank-you page with tracking
// This creates a clear conversion path and enables accurate measurement
document.addEventListener('DOMContentLoaded', function() {
    // Handle primary CTA clicks (Check Loan Options)
    const primaryCTAs = document.querySelectorAll('.primary-cta');
    primaryCTAs.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // GA4 conversion event for primary CTA
            if (typeof gtag !== 'undefined') {
                gtag('event', 'primary_cta_click', {
                    'event_category': 'conversion',
                    'event_label': 'check_loan_options'
                });
            }

            // Meta Pixel Lead event for primary CTA
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead');
            }

            // Redirect to thank you page
            window.location.href = 'thank-you.html';
        });
    });

    // Handle WhatsApp CTA clicks with pre-filled messages
    // Opens WhatsApp in new tab for better user experience
    const whatsappCTAs = document.querySelectorAll('.whatsapp-cta');
    whatsappCTAs.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Determine message type based on data attribute or default to general
            const messageType = button.getAttribute('data-loan-type') || 'general';
            const whatsappURL = generateWhatsAppURL(messageType);

            // GA4 event for WhatsApp CTA with loan type context
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_cta_click', {
                    'event_category': 'engagement',
                    'event_label': 'whatsapp_consultation',
                    'loan_type': messageType
                });
            }

            // Meta Pixel Lead event for WhatsApp CTA
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead');
            }

            // Open WhatsApp in new tab
            window.open(whatsappURL, '_blank');
        });
    });

    // Handle loan-specific WhatsApp CTAs (for segmented lead generation)
    const loanTypeCTAs = document.querySelectorAll('.loan-whatsapp-cta');
    loanTypeCTAs.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const loanType = button.getAttribute('data-loan-type');
            const whatsappURL = generateWhatsAppURL(loanType);

            // Track loan-specific WhatsApp engagement
            if (typeof gtag !== 'undefined') {
                gtag('event', 'loan_specific_whatsapp_click', {
                    'event_category': 'engagement',
                    'event_label': `whatsapp_${loanType}_loan`,
                    'loan_type': loanType
                });
            }

            // Open WhatsApp in new tab
            window.open(whatsappURL, '_blank');
        });
    });
});

// Handle form submission: Captures form data and opens WhatsApp
document.getElementById('loanForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const loanType = document.getElementById('loanType').value;
    const amount = document.getElementById('amount').value;

    // Get optional qualifier data
    const employmentType = sessionStorage.getItem('employmentType') || '';
    const userCity = sessionStorage.getItem('userCity') || '';

    // GA4 custom event for form submit
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'event_category': 'engagement',
            'event_label': 'loan_form_submit'
        });
    }

    // Track Lead event for Meta Pixel (Facebook Ads)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }

    // Create WhatsApp message with form details
    let message = `Hello VyapaarPay Finance,%0A%0AI'm interested in a loan. Here are my details:%0A%0AName: ${name}%0AMobile: ${mobile}%0ALoan Type: ${loanType}%0AApprox Amount: ₹${amount}`;

    // Add optional qualifier information if provided
    if (employmentType) {
        message += `%0AEmployment Type: ${employmentType}`;
    }
    if (userCity) {
        message += `%0ALocation: ${userCity}`;
    }

    message += `%0A%0APlease check my eligibility and guide me further.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');
});

// Handle WhatsApp CTA button: Opens WhatsApp with general inquiry
document.getElementById('whatsappBtn').addEventListener('click', function(e) {
    e.preventDefault();

    const message = `Hello VyapaarPay Finance,%0A%0AI would like to know more about your loan advisory services. Please connect me with an expert.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');
});

// Smooth scroll for anchor links: Provides smooth scrolling to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Track Apply Now button clicks: GA4 custom event and Meta Lead
document.querySelectorAll('.apply-btn').forEach(button => {
    button.addEventListener('click', function() {
        // GA4 custom event for apply button click
        if (typeof gtag !== 'undefined') {
            gtag('event', 'apply_for_loan', {
                'event_category': 'engagement',
                'event_label': 'apply_now_button'
            });
        }

        // Track Lead event for Meta Pixel (Facebook Ads)
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead');
        }
    });
});

// Track WhatsApp button clicks: GA4 custom event and Meta Lead
document.querySelectorAll('.whatsapp-btn').forEach(button => {
    button.addEventListener('click', function() {
        // GA4 custom event for WhatsApp button click
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'engagement',
                'event_label': 'whatsapp_button'
            });
        }

        // Track Lead event for Meta Pixel (Facebook Ads)
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead');
        }
    });
});

// Lead Qualifier: Enhances form data with optional user information
// This improves lead quality by providing more context to advisors
document.getElementById('qualifyBtn').addEventListener('click', function() {
    const employmentType = document.getElementById('employmentType').value;
    const userCity = document.getElementById('userCity').value;

    // Store qualifier data for use in form submission
    sessionStorage.setItem('employmentType', employmentType);
    sessionStorage.setItem('userCity', userCity);

    // Scroll to contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Visual feedback
    this.textContent = '✓ Information Saved';
    this.classList.remove('bg-green-600', 'hover:bg-green-700');
    this.classList.add('bg-green-700');

    setTimeout(() => {
        this.textContent = 'Get Personalized Guidance';
        this.classList.remove('bg-green-700');
        this.classList.add('bg-green-600', 'hover:bg-green-700');
    }, 2000);
});

// EMI Calculator Logic: Educational tool for indicative calculations only
// Why indicative: RBI compliance requires advisory-only positioning, no guaranteed rates
// Why ranges: Prevents implying exact lender terms, maintains educational focus
// Why disclaimers: Ensures users understand this is not approval or guarantee

document.addEventListener('DOMContentLoaded', function() {
    // Get calculator elements
    const loanAmountSlider = document.getElementById('loan-amount');
    const loanAmountValue = document.getElementById('loan-amount-value');
    const loanTenureSelect = document.getElementById('loan-tenure');
    const interestRateSlider = document.getElementById('interest-rate');
    const interestRateValue = document.getElementById('interest-rate-value');
    const emiAmount = document.getElementById('emi-amount');
    const totalAmount = document.getElementById('total-amount');
    const whatsappCTA = document.getElementById('whatsapp-cta');

    // Function to calculate EMI using standard formula
    // EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
    // P = Principal, R = Monthly interest rate, N = Number of months
    function calculateEMI(principal, annualRate, months) {
        const monthlyRate = annualRate / 12 / 100;
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                   (Math.pow(1 + monthlyRate, months) - 1);
        return Math.round(emi);
    }

    // Function to update all displays
    function updateCalculator() {
        const principal = parseInt(loanAmountSlider.value);
        const months = parseInt(loanTenureSelect.value);
        const rate = parseFloat(interestRateSlider.value);

        // Update display values
        loanAmountValue.textContent = '₹' + principal.toLocaleString('en-IN');
        interestRateValue.textContent = rate + '%';

        // Calculate EMI
        const emi = calculateEMI(principal, rate, months);
        const totalPayable = emi * months;

        // Update results
        emiAmount.textContent = emi.toLocaleString('en-IN');
        totalAmount.textContent = totalPayable.toLocaleString('en-IN');

        // Update WhatsApp CTA with prefilled message
        const message = encodeURIComponent(
            `Hello VyapaarPay Finance! I used your EMI calculator and got:\n\n` +
            `Loan Amount: ₹${principal.toLocaleString('en-IN')}\n` +
            `Tenure: ${months} months\n` +
            `Indicative Interest: ${rate}%\n` +
            `Estimated EMI: ₹${emi.toLocaleString('en-IN')}\n\n` +
            `Can you provide more guidance on loan options?`
        );
        const whatsappURL = `https://wa.me/91XXXXXXXXXX?text=${message}`;
        whatsappCTA.href = whatsappURL;
    }

    // Add event listeners for live updates
    loanAmountSlider.addEventListener('input', updateCalculator);
    loanTenureSelect.addEventListener('change', updateCalculator);
    interestRateSlider.addEventListener('input', updateCalculator);

    // Initialize calculator on page load
    updateCalculator();
});