import { t, getLang } from './i18n.js';

// 辅助函数：获取当前语言的翻译
function getCurrentTranslation(key) {
    const currentLang = getLang();
    const translations = {
        zh: {
            'common.buttons.back': '上一步',
            'common.buttons.next': '下一步'
        },
        en: {
            'common.buttons.back': 'Back',
            'common.buttons.next': 'Next'
        }
    };
    const langTranslations = translations[currentLang] || translations.zh;
    return langTranslations[key] || key;
}

function createAndAppend(parent, tag, options = {}) {
    const el = document.createElement(tag);
    Object.entries(options).forEach(([key, value]) => {
        if (key === 'class') {
            el.className = value;
        } else if (key === 'text') {
            el.textContent = value;
        } else if (key.startsWith('data-')) {
            el.setAttribute(key, value);
        } else {
            el[key] = value;
        }
    });
    parent.appendChild(el);
    return el;
}

export function renderWelcomeScreen(container, onStartSymptom, onStartWorkplace) {
    // 获取当前语言
    const currentLang = getLang();

    // 直接使用翻译对象，避免翻译函数调用问题
    const translations = {
        zh: {
            'symptomAssessor.title': '经期疼痛影响评估',
            'symptomAssessor.subtitle': '评估您的经期疼痛对日常生活的影响程度',
            'common.buttons.start': '开始症状评估',
            'workplaceAssessment.title': '工作场所影响评估'
        },
        en: {
            'symptomAssessor.title': 'Period Pain Symptom Assessor',
            'symptomAssessor.subtitle': 'Let\'s understand your unique pain profile. Your answers will help us create a personalized assessment.',
            'common.buttons.start': 'Start Symptom Assessment',
            'workplaceAssessment.title': 'Workplace Adaptability Assessment'
        }
    };

    const langTranslations = translations[currentLang] || translations.zh;

    container.innerHTML = `
        <div class="text-center max-w-2xl mx-auto question-card">
            <h1 class="text-3xl sm:text-4xl font-bold text-neutral-800">${langTranslations['symptomAssessor.title']}</h1>
            <p class="mt-4 text-lg text-neutral-600">${langTranslations['symptomAssessor.subtitle']}</p>
            <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <button id="start-symptom-btn" class="btn-primary">${langTranslations['common.buttons.start']}</button>
                <button id="start-workplace-btn" class="btn-secondary">${langTranslations['workplaceAssessment.title']}</button>
            </div>
        </div>
    `;
    document.getElementById('start-symptom-btn').addEventListener('click', onStartSymptom);
    document.getElementById('start-workplace-btn').addEventListener('click', onStartWorkplace);
}

export function renderQuestionScreen(container, question, index, total, onNext, onBack) {
    const progress = ((index + 1) / total) * 100;
    const isMultiSelect = question.type === 'multi-select';

    let optionsHtml = '';
    if (Array.isArray(question.options)) {
        for (const option of question.options) {
            optionsHtml += `
                <div>
                    <input type="${isMultiSelect ? 'checkbox' : 'radio'}" name="option" value="${option.value}" id="option-${option.value}" class="option-input">
                    <label for="option-${option.value}" class="option-label">
                        <span class="font-medium text-neutral-800">${option.label}</span>
                    </label>
                </div>
            `;
        }
    } else {
        console.error("Question options are not an array:", question);
    }

    container.innerHTML = `
        <div class="w-full max-w-2xl mx-auto question-card">
            <div class="progress-bar-bg mb-8">
                <div class="progress-bar-fg" style="width: ${progress}%"></div>
            </div>
            <div class="text-center mb-8">
                <h2 class="text-2xl font-semibold text-neutral-800">${question.label}</h2>
            </div>
            <div id="options-container" class="space-y-3">${optionsHtml}</div>
            <div class="mt-10 flex justify-between items-center">
                <button id="back-btn" class="text-neutral-600 font-semibold py-2 px-4 rounded-md hover:bg-neutral-100 transition-colors">${getCurrentTranslation('common.buttons.back')}</button>
                <button id="next-btn" class="btn-primary">${isMultiSelect ? getCurrentTranslation('common.buttons.next') : ''}</button>
            </div>
        </div>
    `;

    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    if (!isMultiSelect) {
        nextBtn.style.display = 'none';
    }

    optionsContainer.addEventListener('change', (e) => {
        if (e.target.name === 'option' && !isMultiSelect) {
            onNext(e.target.value);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (isMultiSelect) {
            const selected = Array.from(optionsContainer.querySelectorAll('input:checked')).map(el => el.value);
            onNext(selected.length > 0 ? selected : []);
        }
    });

    document.getElementById('back-btn').addEventListener('click', onBack);
}

function renderSymptomResults(container, results, onRedo, onConsultHR) {
    let emergencyHtml = '';
    if (results.isSevere) {
        emergencyHtml = `
            <div class="p-4 rounded-lg bg-red-100 border border-red-200 flex items-start gap-3">
                <i class="text-red-600 mt-1 flex-shrink-0">⚠️</i>
                <div>
                    <h4 class="font-bold text-red-800">${t('results.emergencyAlertTitle')}</h4>
                    <p class="text-red-700">${t('results.emergencyAlertText')}</p>
                </div>
            </div>`;
    }

    let immediateRecsHtml = results.recommendations.immediate.map(rec => `<div class="bg-neutral-50 p-4 rounded-lg border border-neutral-200/80"><p class="font-medium text-neutral-800">${rec}</p></div>`).join('');
    let longTermRecsHtml = results.recommendations.longTerm.map(rec => `<div class="bg-neutral-50 p-4 rounded-lg border border-neutral-200/80"><p class="font-medium text-neutral-800">${rec}</p></div>`).join('');

    const resultsContainer = createAndAppend(container, 'div', { class: 'w-full max-w-3xl mx-auto space-y-8 question-card' });
    createAndAppend(resultsContainer, 'h2', { text: t('results.title'), class: 'text-3xl font-bold text-center text-neutral-800' });
    if (emergencyHtml) resultsContainer.insertAdjacentHTML('beforeend', emergencyHtml);

    const summaryCard = createAndAppend(resultsContainer, 'div', { class: 'p-6 bg-white rounded-xl shadow-sm border border-neutral-100' });
    createAndAppend(summaryCard, 'h3', { text: t('results.summaryTitle'), class: 'text-xl font-semibold mb-4 text-purple-700' });
    const summaryList = createAndAppend(summaryCard, 'ul', { class: 'space-y-2' });
    results.summary.forEach(item => {
        createAndAppend(summaryList, 'li', { text: `• ${item}`, class: 'text-neutral-700' });
    });

    const recsCard = createAndAppend(resultsContainer, 'div', { class: 'p-6 bg-white rounded-xl shadow-sm border border-neutral-100' });
    createAndAppend(recsCard, 'h3', { text: t('results.recommendationTitle'), class: 'text-xl font-semibold mb-4 text-purple-700' });
    createAndAppend(recsCard, 'h4', { text: t('results.recommendationGroups.immediate'), class: 'font-semibold text-neutral-700 mb-3' });
    const immediateGrid = createAndAppend(recsCard, 'div', { class: 'space-y-3 mb-6' });
    immediateGrid.innerHTML = immediateRecsHtml;
    createAndAppend(recsCard, 'h4', { text: t('results.recommendationGroups.longTerm'), class: 'font-semibold text-neutral-700 mb-3' });
    const longTermGrid = createAndAppend(recsCard, 'div', { class: 'space-y-3' });
    longTermGrid.innerHTML = longTermRecsHtml;

    renderConversionForms(resultsContainer, onConsultHR);

    const buttonContainer = createAndAppend(resultsContainer, 'div', { class: 'mt-8 text-center' });
    const redoButton = createAndAppend(buttonContainer, 'button', { text: t('common.buttons.redoAssessment'), class: 'btn-secondary' });
    redoButton.addEventListener('click', onRedo);
}

export function renderResultsScreen(container, results, onRedo, onConsultHR) {
    renderSymptomResults(container, results, onRedo, onConsultHR);
}

export function renderWorkplaceResultsScreen(container, results, onRedo, onConsultHR) {
    const resultsContainer = createAndAppend(container, 'div', { class: 'w-full max-w-3xl mx-auto space-y-8 question-card' });
    createAndAppend(resultsContainer, 'h2', { text: t('workplaceAssessment.title'), class: 'text-3xl font-bold text-center text-neutral-800' });

    const summaryCard = createAndAppend(resultsContainer, 'div', { class: 'p-6 bg-white rounded-xl shadow-sm border border-neutral-100 text-center' });
    createAndAppend(summaryCard, 'h3', { text: t('results.workplaceTitle'), class: 'text-xl font-semibold mb-2 text-purple-700' });
    createAndAppend(summaryCard, 'p', { text: results.score, class: 'text-5xl font-bold text-purple-500'});
    createAndAppend(summaryCard, 'p', { text: `/ 100`, class: 'text-neutral-500'});
    createAndAppend(summaryCard, 'p', { text: results.profile, class: 'mt-3 font-semibold text-neutral-700 text-lg' });

    const recsCard = createAndAppend(resultsContainer, 'div', { class: 'p-6 bg-white rounded-xl shadow-sm border border-neutral-100' });
    createAndAppend(recsCard, 'h3', { text: t('results.workplaceSuggestionsTitle'), class: 'text-xl font-semibold mb-4 text-purple-700' });
    const recsList = createAndAppend(recsCard, 'ul', { class: 'space-y-4' });
    results.suggestions.forEach(item => {
        const li = createAndAppend(recsList, 'li', { class: 'flex items-start gap-3' });
        const icon = createAndAppend(li, 'div', { class: 'flex-shrink-0'});
        icon.innerHTML = `<i class="text-purple-500 mt-1">✅</i>`;
        createAndAppend(li, 'p', { text: item, class: 'text-neutral-700' });
    });

    renderConversionForms(resultsContainer, onConsultHR);

    const buttonContainer = createAndAppend(resultsContainer, 'div', { class: 'mt-8 text-center' });
    const redoButton = createAndAppend(buttonContainer, 'button', { text: t('common.buttons.redoAssessment'), class: 'btn-secondary' });
    redoButton.addEventListener('click', onRedo);
}


function renderConversionForms(container, onConsultHR) {
    const conversionCard = createAndAppend(container, 'div', { class: 'p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-100 mt-4' });
    createAndAppend(conversionCard, 'h3', { text: t('conversion.title'), class: 'text-xl font-semibold mb-6 text-center text-purple-800' });

    const grid = createAndAppend(conversionCard, 'div', { class: 'grid md:grid-cols-2 gap-8 items-start' });

    const emailFormContainer = createAndAppend(grid, 'div', { class: 'space-y-3' });
    createAndAppend(emailFormContainer, 'p', { text: t('conversion.emailCapture.prompt'), class: 'text-neutral-700 font-medium' });
    const emailForm = createAndAppend(emailFormContainer, 'form', { class: 'flex flex-col sm:flex-row gap-2' });
    const emailInput = createAndAppend(emailForm, 'input', { type: 'email', placeholder: t('conversion.emailCapture.placeholder'), class: 'form-input flex-grow', required: true });
    const emailButton = createAndAppend(emailForm, 'button', { type: 'submit', text: t('conversion.emailCapture.button'), class: 'btn-primary whitespace-nowrap' });

    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        emailInput.disabled = true;
        emailButton.disabled = true;
        emailButton.textContent = t('conversion.emailCapture.success');
        showModal(t('conversion.emailCapture.success'), t('conversion.emailCapture.successMessage'));
    });

    const hrConsultContainer = createAndAppend(grid, 'div', { class: 'space-y-3' });
    createAndAppend(hrConsultContainer, 'p', { text: t('conversion.hrConsultation.prompt'), class: 'text-neutral-700 font-medium' });
    const hrButton = createAndAppend(hrConsultContainer, 'button', { text: t('conversion.hrConsultation.button'), class: 'btn-accent w-full' });
    hrButton.addEventListener('click', onConsultHR);
}

export function showModal(title, body) {
    const overlay = createAndAppend(document.body, 'div', { class: 'modal-overlay z-50' });
    const content = createAndAppend(overlay, 'div', { class: 'modal-content' });

    const header = createAndAppend(content, 'div', { class: 'flex justify-between items-center mb-4' });
    createAndAppend(header, 'h3', { text: title, class: 'text-xl font-semibold text-neutral-800' });
    const closeBtn = createAndAppend(header, 'button', { class: 'text-neutral-500 hover:text-neutral-800' });
    closeBtn.innerHTML = `<i>✕</i>`;

    createAndAppend(content, 'div', { innerHTML: body, class: 'text-neutral-600 prose prose-sm' });

    const closeModal = () => {
        overlay.classList.add('fade-out');
        overlay.addEventListener('animationend', () => overlay.remove());
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // lucide.createIcons(); // Not needed in Next.js
}
