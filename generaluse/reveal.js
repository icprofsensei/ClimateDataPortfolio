function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 50;
        if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
        } else {
        reveals[i].classList.remove("active");
        }
    }
    }
// Get references to the table bodies
// Reveal elements


window.addEventListener("scroll", reveal, {passive: true});

document.addEventListener("DOMContentLoaded", function () {
const slideElements = document.querySelectorAll(".slide-in");

const observer = new IntersectionObserver(
(entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("slide-in-visible");
            observer.unobserve(entry.target); // Stop observing once visible
        }
    });
},
{ threshold: 0.9 } // Trigger when 1% of element is visible
);

slideElements.forEach(el => observer.observe(el));
});
