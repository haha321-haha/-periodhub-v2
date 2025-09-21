'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Table, CheckCircle, AlertTriangle } from 'lucide-react';
import { COMPARISON_TABLE_DATA } from '../utils/medicalCareData';
import styles from '../styles/ComparisonTable.module.css';
import type { ComparisonTableProps, ComparisonTableData } from '../types/medical-care-guide';

export default function ComparisonTable({ 
  className = '',
  highlightRow 
}: ComparisonTableProps) {
  const t = useTranslations('medicalCareGuide');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // 切换行展开状态
  const toggleRowExpansion = (rowIndex: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowIndex)) {
      newExpandedRows.delete(rowIndex);
    } else {
      newExpandedRows.add(rowIndex);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Table className={styles.icon} size={24} />
          {t('comparisonTable.title')}
        </h3>
        <p className={styles.description}>
          {t('comparisonTable.description')}
        </p>
      </div>

      {/* 表格容器 */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                {COMPARISON_TABLE_DATA.headers.map((header, index) => (
                  <th key={index} className={styles.tableHeader}>
                    {t(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {COMPARISON_TABLE_DATA.rows.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={`${styles.tableRow} ${
                    highlightRow === rowIndex ? styles.highlighted : ''
                  } ${expandedRows.has(rowIndex) ? styles.expanded : ''}`}
                  onClick={() => toggleRowExpansion(rowIndex)}
                >
                  {/* 条件列 */}
                  <td className={`${styles.tableCell} ${styles.conditionCell}`}>
                    <div className={styles.conditionContent}>
                      <span className={styles.conditionText}>
                        {t(row.condition)}
                      </span>
                      <button 
                        className={styles.expandButton}
                        aria-label={expandedRows.has(rowIndex) ? t('comparisonTable.collapse') : t('comparisonTable.expand')}
                      >
                        <span className={`${styles.expandIcon} ${expandedRows.has(rowIndex) ? styles.rotated : ''}`}>
                          ▼
                        </span>
                      </button>
                    </div>
                  </td>

                  {/* 正常疼痛列 */}
                  <td className={`${styles.tableCell} ${styles.normalCell}`}>
                    <div className={styles.cellContent}>
                      <div className={styles.cellIcon}>
                        <CheckCircle size={16} className={styles.normalIcon} />
                      </div>
                      <div className={styles.cellText}>
                        <div className={styles.cellTitle}>
                          {t('comparisonTable.normalTitle')}
                        </div>
                        <div className={styles.cellDescription}>
                          {t(row.normalPain)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 令人担忧的疼痛列 */}
                  <td className={`${styles.tableCell} ${styles.concerningCell}`}>
                    <div className={styles.cellContent}>
                      <div className={styles.cellIcon}>
                        <AlertTriangle size={16} className={styles.concerningIcon} />
                      </div>
                      <div className={styles.cellText}>
                        <div className={styles.cellTitle}>
                          {t('comparisonTable.concerningTitle')}
                        </div>
                        <div className={styles.cellDescription}>
                          {t(row.concerningPain)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 建议行动列 */}
                  <td className={`${styles.tableCell} ${styles.actionCell}`}>
                    <div className={styles.actionContent}>
                      <div className={styles.actionText}>
                        {t(row.action)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 表格说明 */}
      <div className={styles.tableNotes}>
        <div className={styles.noteItem}>
          <CheckCircle size={16} className={styles.normalIcon} />
          <span>{t('comparisonTable.normalNote')}</span>
        </div>
        <div className={styles.noteItem}>
          <AlertTriangle size={16} className={styles.concerningIcon} />
          <span>{t('comparisonTable.concerningNote')}</span>
        </div>
      </div>

      {/* 移动端友好提示 */}
      <div className={styles.mobileHint}>
        <p>{t('comparisonTable.mobileHint')}</p>
      </div>

      {/* 重要提醒 */}
      <div className={styles.importantReminder}>
        <div className={styles.reminderIcon}>⚠️</div>
        <div className={styles.reminderContent}>
          <h4 className={styles.reminderTitle}>
            {t('comparisonTable.reminder.title')}
          </h4>
          <p className={styles.reminderText}>
            {t('comparisonTable.reminder.text')}
          </p>
        </div>
      </div>
    </div>
  );
}