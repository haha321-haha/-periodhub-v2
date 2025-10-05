import { t } from './i18n.js';

// 延迟翻译加载的函数
function getSymptomQuestionsData() {
    return [
        {
            id: 'painLevel',
            labelKey: 'symptomAssessor.questions.painLevel.title',
            options: [
                { value: 'mild', labelKey: 'symptomAssessor.questions.painLevel.options.mild' },
                { value: 'moderate', labelKey: 'symptomAssessor.questions.painLevel.options.moderate' },
                { value: 'severe', labelKey: 'symptomAssessor.questions.painLevel.options.severe' },
                { value: 'verySevere', labelKey: 'symptomAssessor.questions.painLevel.options.verySevere' }
            ]
        },
        {
            id: 'painDuration',
            labelKey: 'symptomAssessor.questions.painDuration.title',
            options: [
                { value: 'short', labelKey: 'symptomAssessor.questions.painDuration.options.short' },
                { value: 'medium', labelKey: 'symptomAssessor.questions.painDuration.options.medium' },
                { value: 'long', labelKey: 'symptomAssessor.questions.painDuration.options.long' },
                { value: 'variable', labelKey: 'symptomAssessor.questions.painDuration.options.variable' }
            ]
        },
        {
            id: 'painLocation',
            labelKey: 'symptomAssessor.questions.painLocation.title',
            options: [
                { value: 'lowerAbdomen', labelKey: 'symptomAssessor.questions.painLocation.options.lowerAbdomen' },
                { value: 'lowerBack', labelKey: 'symptomAssessor.questions.painLocation.options.lowerBack' },
                { value: 'upperThighs', labelKey: 'symptomAssessor.questions.painLocation.options.upperThighs' },
                { value: 'fullPelvis', labelKey: 'symptomAssessor.questions.painLocation.options.fullPelvis' },
                { value: 'sideFlank', labelKey: 'symptomAssessor.questions.painLocation.options.sideFlank' }
            ],
            type: 'multi-select'
        },
        {
            id: 'accompanyingSymptoms',
            labelKey: 'symptomAssessor.questions.accompanyingSymptoms.title',
            options: [
                 { value: 'fatigue', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.fatigue' },
                 { value: 'headache', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.headache' },
                 { value: 'nausea', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.nausea' },
                 { value: 'digestive', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.digestive' },
                 { value: 'mood', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.mood' },
                 { value: 'bloating', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.bloating' },
                 { value: 'breastTenderness', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.breastTenderness' },
                 { value: 'dizziness', labelKey: 'symptomAssessor.questions.accompanyingSymptoms.options.dizziness' }
            ],
            type: 'multi-select'
        },
        {
            id: 'reliefPreference',
            labelKey: 'impactAssessment.preference.title',
            options: [
                { value: 'instant', labelKey: 'impactAssessment.preference.options.instant' },
                { value: 'natural', labelKey: 'impactAssessment.preference.options.natural' },
                { value: 'longTerm', labelKey: 'impactAssessment.preference.options.longTerm' },
                { value: 'medical', labelKey: 'impactAssessment.preference.options.medical' }
            ]
        }
    ];
}

// 修改后的导出函数，实时翻译
export function getSymptomQuestions() {
    return getSymptomQuestionsData().map(question => ({
        ...question,
        label: t(question.labelKey),
        options: question.options.map(option => ({
            ...option,
            label: t(option.labelKey)
        }))
    }));
}

function getWorkplaceQuestionsData() {
    return [
        {
            id: 'concentration',
            labelKey: 'workplaceAssessment.questions.concentration.title',
            options: [
                { value: 'none', labelKey: 'workplaceAssessment.questions.concentration.options.none' },
                { value: 'slight', labelKey: 'workplaceAssessment.questions.concentration.options.slight' },
                { value: 'difficult', labelKey: 'workplaceAssessment.questions.concentration.options.difficult' },
                { value: 'impossible', labelKey: 'workplaceAssessment.questions.concentration.options.impossible' }
            ],
            type: 'single-select'
        },
        {
            id: 'absenteeism',
            labelKey: 'workplaceAssessment.questions.absenteeism.title',
            options: [
                { value: 'never', labelKey: 'workplaceAssessment.questions.absenteeism.options.never' },
                { value: 'rarely', labelKey: 'workplaceAssessment.questions.absenteeism.options.rarely' },
                { value: 'sometimes', labelKey: 'workplaceAssessment.questions.absenteeism.options.sometimes' },
                { value: 'frequently', labelKey: 'workplaceAssessment.questions.absenteeism.options.frequently' }
            ],
            type: 'single-select'
        },
        {
            id: 'communication',
            labelKey: 'workplaceAssessment.questions.communication.title',
            options: [
                { value: 'comfortable', labelKey: 'workplaceAssessment.questions.communication.options.comfortable' },
                { value: 'hesitant', labelKey: 'workplaceAssessment.questions.communication.options.hesitant' },
                { value: 'uncomfortable', labelKey: 'workplaceAssessment.questions.communication.options.uncomfortable' },
                { value: 'na', labelKey: 'workplaceAssessment.questions.communication.options.na' }
            ],
            type: 'single-select'
        },
        {
            id: 'support',
            labelKey: 'workplaceAssessment.questions.support.title',
            options: [
                { value: 'flexHours', labelKey: 'workplaceAssessment.questions.support.options.flexHours' },
                { value: 'remoteWork', labelKey: 'workplaceAssessment.questions.support.options.remoteWork' },
                { value: 'restArea', labelKey: 'workplaceAssessment.questions.support.options.restArea' },
                { value: 'understanding', labelKey: 'workplaceAssessment.questions.support.options.understanding' },
                { value: 'leave', labelKey: 'workplaceAssessment.questions.support.options.leave' },
                { value: 'none', labelKey: 'workplaceAssessment.questions.support.options.none' }
            ],
            type: 'multi-select'
        }
    ];
}

// 修改后的导出函数，实时翻译
export function getWorkplaceQuestions() {
    return getWorkplaceQuestionsData().map(question => ({
        ...question,
        label: t(question.labelKey),
        options: question.options.map(option => ({
            ...option,
            label: t(option.labelKey)
        }))
    }));
}

export function calculateSymptomImpact(answers) {
    const { painLevel, painDuration, reliefPreference } = answers;
    const isSevere = painLevel === 'severe' || painLevel === 'verySevere';
    let summary = [];
    const recommendations = { immediate: [], longTerm: [] };

    summary.push(`${t('calculation.symptom.painLevel')}: ${t('symptomAssessor.questions.painLevel.options.' + painLevel)}`);
    summary.push(`${t('calculation.symptom.duration')}: ${t('symptomAssessor.questions.painDuration.options.' + painDuration)}`);


    if (painLevel === 'mild') {
        recommendations.immediate.push(t('calculation.symptom.recs.mild.immediate1'));
        recommendations.longTerm.push(t('calculation.symptom.recs.mild.longTerm1'));
    } else if (painLevel === 'moderate') {
        recommendations.immediate.push(t('calculation.symptom.recs.moderate.immediate1'));
        recommendations.immediate.push(t('calculation.symptom.recs.moderate.immediate2'));
        recommendations.longTerm.push(t('calculation.symptom.recs.moderate.longTerm1'));
        recommendations.longTerm.push(t('calculation.symptom.recs.moderate.longTerm2'));
    } else { // severe or verySevere
        recommendations.immediate.push(t('calculation.symptom.recs.severe.immediate1'));
        recommendations.immediate.push(t('calculation.symptom.recs.severe.immediate2'));
        recommendations.longTerm.push(t('calculation.symptom.recs.severe.longTerm1'));
        recommendations.longTerm.push(t('calculation.symptom.recs.severe.longTerm2'));
    }


    if (reliefPreference === 'natural') {
        recommendations.immediate.unshift(t('calculation.symptom.recs.prefs.natural.immediate1'));
        recommendations.longTerm.push(t('calculation.symptom.recs.prefs.natural.longTerm1'));
    }
    if (reliefPreference === 'medical') {
        recommendations.longTerm.unshift(t('calculation.symptom.recs.prefs.medical.longTerm1'));
    }

    return {
        isSevere,
        summary,
        recommendations
    };
}

export function calculateWorkplaceImpact(answers) {
    let score = 0;
    const suggestions = [];
    let profile = '';

    if (answers.concentration) {
        switch (answers.concentration) {
            case 'none': score += 33; break;
            case 'slight': score += 20; break;
            case 'difficult': score += 10; break;
            case 'impossible': score += 0; break;
        }
    }

    if (answers.absenteeism) {
        switch (answers.absenteeism) {
            case 'never': score += 33; break;
            case 'rarely': score += 20; break;
            case 'sometimes': score += 10; break;
            case 'frequently': score += 0; break;
        }
    }

    if (answers.communication) {
        switch (answers.communication) {
            case 'comfortable': score += 34; break;
            case 'hesitant': score += 15; break;
            case 'uncomfortable': score += 5; break;
            case 'na': score += 15; break;
        }
    }

    score = Math.round(score);


    if (score > 75) {
        profile = t('calculation.workplace.profiles.supportive');
        suggestions.push(t('calculation.workplace.suggestions.supportive1'));
    } else if (score > 40) {
        profile = t('calculation.workplace.profiles.adaptive');
        suggestions.push(t('calculation.workplace.suggestions.adaptive1'));
        suggestions.push(t('calculation.workplace.suggestions.adaptive2'));
    } else {
        profile = t('calculation.workplace.profiles.challenging');
        suggestions.push(t('calculation.workplace.suggestions.challenging1'));
        suggestions.push(t('calculation.workplace.suggestions.challenging2'));
        suggestions.push(t('calculation.workplace.suggestions.challenging3'));
    }

    if (answers.communication === 'uncomfortable' || answers.communication === 'hesitant') {
        suggestions.push(t('calculation.workplace.suggestions.communicationHelp'));
    }

    if (answers.support && answers.support.length > 0 && !answers.support.includes('none')) {
        let supportText = t('calculation.workplace.suggestions.supportHeader');
        const supportItems = [];
        if (answers.support.includes('flexHours')) supportItems.push(t('workplaceAssessment.questions.support.options.flexHours'));
        if (answers.support.includes('remoteWork')) supportItems.push(t('workplaceAssessment.questions.support.options.remoteWork'));
        if (answers.support.includes('restArea')) supportItems.push(t('workplaceAssessment.questions.support.options.restArea'));
        if (answers.support.includes('understanding')) supportItems.push(t('workplaceAssessment.questions.support.options.understanding'));
        if (answers.support.includes('leave')) supportItems.push(t('workplaceAssessment.questions.support.options.leave'));

        if(supportItems.length > 0) {
            suggestions.push(supportText + supportItems.join(', ') + '.');
        }
    }

    return {
        score,
        profile,
        suggestions
    };
}
