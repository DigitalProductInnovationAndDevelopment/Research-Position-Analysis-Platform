import React from 'react';
import styles from './TicketsAndTasks.module.css';

/**
 * TicketsAndTasks Component
 * A component displaying tickets and tasks
 * @param {Object} props
 * @param {string} props.className - Additional CSS class name
 * @param {Array} props.tickets - Array of ticket data
 * @param {Array} props.tasks - Array of task data
 * @param {Function} props.onTicketClick - Ticket click handler
 * @param {Function} props.onTaskClick - Task click handler
 */
const TicketsAndTasks = ({
  className,
  tickets = [],
  tasks = [],
  onTicketClick,
  onTaskClick
}) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Tickets</h2>
        <div className={styles.list}>
          {tickets.map((ticket, index) => (
            <div 
              key={index}
              className={styles.item}
              onClick={() => onTicketClick?.(ticket)}
            >
              <div className={styles.itemHeader}>
                <span className={styles.itemTitle}>{ticket.title}</span>
                <span className={`${styles.status} ${styles[ticket.status]}`}>
                  {ticket.status}
                </span>
              </div>
              <p className={styles.itemDescription}>{ticket.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Tasks</h2>
        <div className={styles.list}>
          {tasks.map((task, index) => (
            <div 
              key={index}
              className={styles.item}
              onClick={() => onTaskClick?.(task)}
            >
              <div className={styles.itemHeader}>
                <span className={styles.itemTitle}>{task.title}</span>
                <span className={`${styles.status} ${styles[task.status]}`}>
                  {task.status}
                </span>
              </div>
              <p className={styles.itemDescription}>{task.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketsAndTasks; 