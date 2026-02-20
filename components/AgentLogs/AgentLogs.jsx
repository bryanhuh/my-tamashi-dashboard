'use client';

import { useState } from 'react';
import { Terminal, ChevronDown, ChevronRight } from 'lucide-react';
import styles from './AgentLogs.module.css';
import logsData from '@/data/agent-logs.json';

const statusColors = {
  success: '#00d4aa',
  'in-progress': '#ffdd00',
  failed: '#ff4757',
};

const statusIcons = {
  success: '🟢',
  'in-progress': '🟡',
  failed: '🔴',
};

export default function AgentLogs() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.container}>
      <div className="sectionIndex">09 — Agent Logs</div>

      <div className={styles.terminal}>
        <div className={styles.terminalHeader}>
          <div className={styles.dots}>
            <span className={styles.dot} style={{ background: '#ff5f56' }} />
            <span className={styles.dot} style={{ background: '#ffbd2e' }} />
            <span className={styles.dot} style={{ background: '#27c93f' }} />
          </div>
          <span className={styles.terminalTitle}>~/agent-experiments</span>
        </div>

        <div className={styles.terminalBody}>
          {logsData.map((log) => (
            <div key={log.id} className={styles.logEntry}>
              <button
                className={styles.logHeader}
                onClick={() => setExpanded(expanded === log.id ? null : log.id)}
              >
                <span className={styles.logStatus}>
                  {statusIcons[log.status]}
                </span>
                <span className={styles.logDate}>[{log.date}]</span>
                <span className={styles.logTitle}>{log.title}</span>
                {expanded === log.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {expanded === log.id && (
                <div className={styles.logDetails}>
                  <div className={styles.logMeta}>
                    <span>Model: <strong>{log.model}</strong></span>
                    <span>Agent: <strong>{log.agent}</strong></span>
                  </div>
                  <p className={styles.logSummary}>{log.summary}</p>
                  <div className={styles.logTags}>
                    {log.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
