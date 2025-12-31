// script.js for VyapaarPay Finance

// Initialize AOS with improved settings
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// WhatsApp number (configurable)
const whatsappNumber = '916390666060'; // Replace with actual WhatsApp number

// Handle form submission
document.getElementById('loanForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const loanType = document.getElementById('loanType').value;
    const amount = document.getElementById('amount').value;

    const message = `Hello VyapaarPay Finance,%0A%0AI'm interested in a loan. Here are my details:%0A%0AName: ${name}%0AMobile: ${mobile}%0ALoan Type: ${loanType}%0AApprox Amount: ₹${amount}%0A%0APlease check my eligibility and guide me further.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');
});

// Handle WhatsApp CTA button
document.getElementById('whatsappBtn').addEventListener('click', function(e) {
    e.preventDefault();

    const message = `Hello VyapaarPay Finance,%0A%0AI would like to know more about your loan advisory services. Please connect me with an expert.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');
});

// Smooth scroll for anchor links
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