const fs = require('fs');
const path = require('path');

// 12个需要更新的文章文件及其新的meta descriptions
const updates = [
  {
    file: '5-minute-period-pain-relief.md',
    newDescription: '5分钟痛经缓解法 - 4种科学验证的经期不适缓解技巧：呼吸练习、穴位按摩、热敷和放松方法。简单易学的应急缓解方案，有助于减轻痛经症状，改善日常活动质量。专业指导，安全实用的经期健康管理方法。'
  },
  {
    file: 'comprehensive-iud-guide.md',
    newDescription: '权威IUD指南：详解含铜vs含激素IUD区别，适用禁忌人群，放置取出流程，副作用管理。基于WHO/ACOG/NHS最新指南，帮助您选择合适的长效避孕方法。专业咨询，科学可靠的避孕健康指导。'
  },
  {
    file: 'comprehensive-medical-guide-to-dysmenorrhea.md',
    newDescription: '权威痛经医学指南：详细解释痛经病理生理学、诊断标准和治疗方案。包括原发性和继发性痛经的鉴别、药物选择和综合管理策略。基于最新医学研究，提供专业诊断流程、个性化治疗建议和长期健康管理方案。'
  },
  {
    file: 'comprehensive-report-non-medical-factors-menstrual-pain.md',
    newDescription: '专业分析职业压力、睡眠质量、饮食习惯、运动状况等非医疗因素对痛经的影响机制。基于最新科学研究，提供系统性的痛经管理策略，帮助女性从生活方式改善经期健康。科学实用的生活方式健康管理指导。'
  },
  {
    file: 'effective-herbal-tea-menstrual-pain.md',
    newDescription: '详细介绍7种科学验证的痛经草药茶配方，包括姜茶、肉桂茶、茴香茶等。提供制作方法、作用机制、临床数据和安全使用指南，帮助女性选择合适的自然痛经缓解方案。天然安全的自然疗法健康选择。'
  },
  {
    file: 'long-term-healthy-lifestyle-guide.md',
    newDescription: '专业长期健康生活方式指南：通过科学的饮食、运动、睡眠和压力管理策略，建立可持续的经期健康管理方案。提供21天习惯养成计划、个性化健康档案建立方法和长期健康维护策略。科学实用的健康生活方式指导。'
  },
  {
    file: 'menstrual-pain-complications-management.md',
    newDescription: '专业痛经伴随症状管理指南：深度解析腹胀、恶心呕吐、腰痛的成因机制，提供科学缓解策略。包含症状关联分析、经期不适缓解指南、腰痛管理、穴位按压技巧、抗炎饮食建议。基于前列腺素理论和临床实践的综合症状管理。'
  },
  {
    file: 'menstrual-pain-medical-guide.md',
    newDescription: '权威医学指南深度解析痛经10大病因，从前列腺素机制到子宫内膜异位症，详细阐述原发性与继发性痛经的鉴别诊断。提供专业疼痛评估方法、标准化治疗流程和就医指征，帮助女性科学认知痛经，实现精准健康管理。'
  },
  {
    file: 'natural-physical-therapy-comprehensive-guide.md',
    newDescription: '专业痛经自然疗法指南：详解15种科学验证的缓解方法，包括热疗冷疗、按摩瑜伽、针灸艾灸、草药营养、阿育吠陀疗法。融合传统中医理论与现代研究，提供个性化自然疗法选择。安全温和的长期自然健康管理方法。'
  },
  {
    file: 'nsaid-menstrual-pain-professional-guide.md',
    newDescription: 'NSAIDs痛经治疗专业指南 - 详解布洛芬、萘普生等非甾体抗炎药的药理机制、安全用药、剂量计算和效果优化。包含互动式用药计算器和副作用管理，帮助您科学安全地缓解痛经。专业安全的科学用药指导。'
  },
  {
    file: 'personal-menstrual-health-profile.md',
    newDescription: '详细指导如何建立完整的个人经期健康档案，包括周期追踪、症状记录、影响因素分析。提供实用工具和方法，帮助女性实现个性化的经期健康管理。科学系统的个性化健康追踪与管理方案。'
  },
  {
    file: 'specific-menstrual-pain-management-guide.md',
    newDescription: '专业痛经管理指南：深度解析激素原理，识别7个妇科疾病危险信号，掌握IUD、孕期、更年期痛经管理。包含5分钟自检指南、症状对照表、长期治疗方案。基于权威医学研究，帮助您科学应对各种痛经情况的全面健康管理。'
  }
];

// 更新单个文件
function updateFile(fileName, newDescription) {
  const filePath = path.join('content/articles/en', fileName);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ 文件不存在: ${fileName}`);
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // 查找并更新 seo_description_zh 字段
    let updated = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('seo_description_zh:')) {
        const oldLine = lines[i];
        lines[i] = `seo_description_zh: "${newDescription}"`;
        console.log(`✅ 更新 ${fileName}:`);
        console.log(`   旧: ${oldLine}`);
        console.log(`   新: ${lines[i]}`);
        console.log(`   长度: ${newDescription.length} 字符`);
        updated = true;
        break;
      }
    }

    if (!updated) {
      console.log(`⚠️  未找到 seo_description_zh 字段: ${fileName}`);
      return false;
    }

    // 写回文件
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    return true;

  } catch (error) {
    console.log(`❌ 更新文件失败 ${fileName}:`, error.message);
    return false;
  }
}

// 主函数
function updateAllMetaDescriptions() {
  console.log('🚀 开始批量更新 Meta Descriptions...\n');

  let successCount = 0;
  let failCount = 0;

  updates.forEach((update, index) => {
    console.log(`\n--- 更新 ${index + 1}/${updates.length}: ${update.file} ---`);

    if (updateFile(update.file, update.newDescription)) {
      successCount++;
    } else {
      failCount++;
    }
  });

  console.log('\n📊 更新结果统计:');
  console.log(`✅ 成功: ${successCount} 个文件`);
  console.log(`❌ 失败: ${failCount} 个文件`);
  console.log(`📝 总计: ${updates.length} 个文件`);

  if (successCount === updates.length) {
    console.log('\n🎉 所有文件更新成功！');
  } else {
    console.log('\n⚠️  部分文件更新失败，请检查错误信息。');
  }
}

// 执行更新
updateAllMetaDescriptions();
