'use strict';

const COLUMNS = [
  'Backlog',
  'Ready',
  'In Progress',
  'Verification',
  'Changes Requested',
  'Done',
];

const boardElement = document.querySelector('#board');
const detailTitle = document.querySelector('#detail-title');
const detailStatus = document.querySelector('#detail-status');
const detailContent = document.querySelector('#ticket-detail');
const auditList = document.querySelector('#audit-list');
const errorMessage = document.querySelector('#error-message');
const updatedLabel = document.querySelector('#last-updated');
const auditCount = document.querySelector('#audit-count');
let ticketsById = new Map();

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? 'Unknown time'
    : date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function ticketCard(ticket) {
  const button = element('button', 'ticket-card');
  button.type = 'button';
  button.setAttribute('aria-label', `${ticket.id}: ${ticket.title}, ${ticket.status}`);
  button.addEventListener('click', () => showTicket(ticket.id));

  const top = element('span', 'ticket-topline');
  top.append(element('span', 'ticket-id', ticket.id));
  top.append(element('span', 'revision', `R${ticket.revision}`));
  button.append(top);

  button.append(element('span', 'ticket-title', ticket.title));
  const metadata = element('span', 'ticket-meta');
  metadata.append(element('span', 'assignee-dot', ticket.assignee ? '' : '—'));
  metadata.append(element('span', '', ticket.assignee || 'Unassigned'));
  button.append(metadata);

  if (ticket.sourceFinding) {
    button.append(element('span', 'finding-tag', `${ticket.sourceFinding.type.toUpperCase()} FINDING`));
  } else if (ticket.links?.length) {
    button.append(element('span', 'link-tag', `${ticket.links.length} LINKED`));
  }
  return button;
}

function renderBoard(tickets) {
  ticketsById = new Map(tickets.map((ticket) => [ticket.id, ticket]));
  boardElement.replaceChildren();
  for (const status of COLUMNS) {
    const columnTickets = tickets.filter((ticket) => ticket.status === status);
    const column = element('section', `board-column column-${status.toLowerCase().replaceAll(' ', '-')}`);
    column.setAttribute('aria-label', `${status}, ${columnTickets.length} tickets`);
    const heading = element('div', 'column-heading');
    heading.append(element('h2', '', status));
    heading.append(element('span', 'column-count', String(columnTickets.length)));
    column.append(heading);

    const stack = element('div', 'ticket-stack');
    if (columnTickets.length === 0) {
      stack.append(element('p', 'column-empty', 'Nothing here yet'));
    } else {
      for (const ticket of columnTickets) stack.append(ticketCard(ticket));
    }
    column.append(stack);
    boardElement.append(column);
  }
}

function detailRow(label, value) {
  const row = element('div', 'detail-row');
  row.append(element('dt', '', label));
  row.append(element('dd', '', value || '—'));
  return row;
}

function showTicket(ticketId) {
  const ticket = ticketsById.get(ticketId);
  if (!ticket) return;
  detailTitle.textContent = `${ticket.id} · ${ticket.title}`;
  detailStatus.textContent = ticket.status;
  detailStatus.className = `status-pill status-${ticket.status.toLowerCase().replaceAll(' ', '-')}`;
  detailContent.replaceChildren();

  const metadata = element('dl', 'detail-grid');
  metadata.append(detailRow('Assigned to', ticket.assignee || 'Unassigned'));
  metadata.append(detailRow('Revision', ticket.revision));
  metadata.append(detailRow('Created', formatDate(ticket.createdAt)));
  metadata.append(detailRow('Linked tickets', ticket.links?.join(', ')));
  detailContent.append(metadata);

  if (ticket.staticPass) {
    const section = element('section', 'finding-detail');
    section.append(element('h3', '', `Static checks · revision ${ticket.staticPass.revision}`));
    section.append(element('p', '', ticket.staticPass.evidence));
    detailContent.append(section);
  }
  for (const [kind, approval] of Object.entries(ticket.approvals || {})) {
    const section = element('section', 'finding-detail');
    section.append(element('h3', '', `${kind} approval · revision ${approval.revision}`));
    section.append(element('p', '', `${approval.actor}: ${approval.evidence}`));
    detailContent.append(section);
  }
  if (ticket.sourceFinding) {
    const finding = ticket.sourceFinding;
    const section = element('section', 'finding-detail');
    section.append(element('h3', '', `${finding.type} finding · ${finding.sourceFile}:${finding.sourceLine}`));
    for (const [label, value] of [
      ['Reproduction', finding.reproduction],
      ['Actual', finding.actual],
      ['Expected', finding.expected],
      ['Root cause', finding.why],
      ['Proposed fix', finding.proposedFix],
      ['Rationale', finding.rationale],
    ]) {
      section.append(detailRow(label, value));
    }
    detailContent.append(section);
  }
}

function renderAudit(events) {
  auditList.replaceChildren();
  auditCount.textContent = `${events.length} event${events.length === 1 ? '' : 's'}`;
  for (const event of events) {
    const item = element('li', 'audit-item');
    const marker = element('span', 'audit-marker');
    marker.setAttribute('aria-hidden', 'true');
    item.append(marker);
    const body = element('div', 'audit-body');
    body.append(element('p', 'audit-action', (event.action || event.event || 'activity').replaceAll('_', ' ')));
    const subject = event.ticketId ? `${event.ticketId} · ` : '';
    const detail = event.reason || event.outcome || event.resolution || event.evidence || '';
    body.append(element('p', 'audit-summary', `${subject}${detail}`));
    body.append(element('p', 'audit-meta', `${event.actor || event.reportedBy || 'Unknown actor'} · ${formatDate(event.timestamp)}`));
    item.append(body);
    auditList.append(item);
  }
  if (!events.length) auditList.append(element('li', 'empty-copy', 'No activity recorded yet.'));
}

async function loadBoard() {
  errorMessage.hidden = true;
  try {
    const [boardResponse, auditResponse] = await Promise.all([
      fetch('/api/board', { cache: 'no-store' }),
      fetch('/api/audit', { cache: 'no-store' }),
    ]);
    if (!boardResponse.ok || !auditResponse.ok) {
      throw new Error('The local board server returned an error. Check its terminal output.');
    }
    const board = await boardResponse.json();
    const audit = await auditResponse.json();
    renderBoard(board.tickets);
    renderAudit(audit.events);
    updatedLabel.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch (error) {
    errorMessage.textContent = `Could not load Kanban data: ${error.message}`;
    errorMessage.hidden = false;
    updatedLabel.textContent = 'Board unavailable';
  }
}

document.querySelector('#refresh-button').addEventListener('click', loadBoard);
loadBoard();
