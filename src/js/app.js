import Alpine from 'alpinejs'
import data from './data.js';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import 'animate.css';

const isLangEnglish = () => localStorage.getItem("language") == "english"
const sectionsIndex = {
    "welcome": 0,
    "skills": 1,
    "experience": 2,
    "projects": 3,
    "education": 4,
    "aboutme": 5,
    "contact": 6,
}

gsap.registerPlugin(ScrollTrigger);


window.visitProject = (url) => {
    window.open(url, "_blank")
}

window.language = { english: isLangEnglish(), spanish: !isLangEnglish() }
window.portfolioData = isLangEnglish() ? data.eng : data.esp;

window.Alpine = Alpine
Alpine.start()

ScrollTrigger.create({
    trigger: ".intro-wrapper",
    start: "top top",
    end: "bottom top",
    pin: ".text-align-center",
    pinSpacing: false
});

function isMobile() {
    return window.innerWidth <= 768;
}

document.addEventListener("scroll", () => {
    let sections = isMobile() ? document.querySelectorAll('.tab-content') : document.querySelectorAll('.tab-content:not(.show-mobile)');

    let sectionSelectors = document.querySelectorAll('li.section-selector');
    sectionSelectors.forEach((section) => {
        section.classList.remove('active');
    });

    sections.forEach((section, index) => {
        section.classList.remove('tab-active');
        sectionSelectors[index].classList.remove('active');

        let calcScroll = calculateScroll(index)

        if (calcScroll < (index + 1) && calcScroll >= index) {
            section.classList.add('tab-active');
            sectionSelectors[index].classList.add('active');
        }
    });
});

const calculateScroll = () => {
    let scrollPosition = window.scrollY;
    return scrollPosition / 120;
}

window.goToSection = (section) => {
    setTimeout(() => {
        window.scrollTo(0, sectionsIndex[section] * 120 + (isMobile() ? 120 : 0));
    }, 10)
}

var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function () {
        that.tick();
    }, delta);
};

window.onload = function () {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);


    document.querySelector('.tabs_height').style.height = window.innerHeight + (120 * (isMobile() ? 7 : 6)) + 'px';

    if (isMobile()) {
        document.querySelector('div[data-section="welcome"]').classList.remove('tab-active');
        document.querySelector('div[data-section="navmobile"]').classList.add('tab-active');
    } else {
        document.querySelector('div[data-section="welcome"]').classList.add('tab-active');
    }


    document.getElementById("glass-esp").addEventListener("click", () => {
        localStorage.setItem("language", "spanish")
        window.location.reload()
    })
    document.getElementById("glass-eng").addEventListener("click", () => {
        localStorage.setItem("language", "english");
        window.location.reload()
    })
};


window.openProject = (item) => {
    const projectModal = document.getElementById('projectModal');

    let tags = item.tags.map(tag => {
        return `<div class="tag tag-${tag.code}">${tag.name}</div>`;
    }).join('');

    let buttonVisit = item.url ? `<button class="visit" onclick="visitProject('${item.url}')">Visit</button>` : '';

    projectModal.querySelector('.project-wrapper').innerHTML = `
        <div class="project-details">
            <h1>${item.title}</h1>
            <h4>${item.subtitle}</h4>
            <div class="tags">${tags}</div>
            <p class="desc">${item.description}</p>
            ${buttonVisit}
        </div>
        <div class="project-image">
            <img src="${item.image}" alt="" />
        </div>`;

    projectModal.classList.add('open');
    document.body.classList.add('jw-modal-open');
}

window.closeModal = () => {
    document.querySelector('.project-modal.open').classList.remove('open');
    document.body.classList.remove('project-modal-open');
}

window.addEventListener('load', function () {
    document.addEventListener('click', event => {
        if (event.target.classList.contains('project-modal')) {
            closeModal();
        }
    });
});