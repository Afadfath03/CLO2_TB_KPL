// public/i18n.js
async function applyLanguage() {
    const lang = localStorage.getItem('lang') || 'id';
    const response = await fetch(`i18n/lang_${lang}.json`);
    const translations = await response.json();

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[key]) {
            element.placeholder = translations[key];
        }
    });

    // Untuk tombol label dropdown
    if (langBtnLabel) {
        langBtnLabel.textContent = translations[`language_${lang}`] || (lang === 'id' ? 'Indonesia' : 'English');
    }

}

function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    location.reload();
}

applyLanguage();
