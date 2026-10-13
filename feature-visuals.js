const paths = {
  route: '<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M6 9v7a2 2 0 0 0 2 2h7M9 6h7a2 2 0 0 1 2 2v7"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  review: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="m8 12 3 3 5-6M9 3v3h6V3"/>',
  certificate: '<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M7 7h10M7 11h4"/><circle cx="16" cy="14" r="3"/><path d="m14 17-1 5 3-2 3 2-1-5"/>',
  link: '<path d="m10 13 4-4M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M16 8l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(2 0) scale(.85)"/>',
  history: '<path d="M3 10a9 9 0 1 1 0 5M3 4v6h6M12 7v5l3 2"/>',
  sliders: '<path d="M4 6h6m4 0h6M4 12h2m4 0h10M4 18h10m4 0h2"/><circle cx="12" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 11h18M8 15h3"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'
};
export const featureIcon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.file}</svg>`;

export const workflowEditor = () => `<div class="automation-window feature-window" role="img" aria-label="Illustrative configured workflow: an updated audit record routes a task to a reviewer, who performs the review.">
  <div class="feature-window-header"><span>${featureIcon('route')}<b>Workflow builder</b></span><small>Illustrative view</small></div>
  <div class="automation-template"><div><small>WORKFLOW TEMPLATE</small><strong>Audit → certification</strong></div><span>${featureIcon('sliders')}</span></div>
  <div class="automation-canvas">
    <div class="automation-node"><span class="node-icon">${featureIcon('file')}</span><div><small>TRIGGER</small><strong>Audit record updated</strong></div><span class="node-state">${featureIcon('check')}</span></div>
    <div class="automation-connector"><span class="route-pulse"></span></div>
    <div class="automation-node"><span class="node-icon">${featureIcon('bell')}</span><div><small>ACTION</small><strong>Notify the reviewer</strong></div><span class="node-state">${featureIcon('check')}</span></div>
    <div class="automation-connector"><span class="route-pulse"></span></div>
    <div class="automation-node next-task"><span class="node-icon">${featureIcon('review')}</span><div><small>NEXT TASK</small><strong>Ready for review</strong></div><span class="node-state">${featureIcon('arrow')}</span></div>
  </div>
  <div class="automation-footer"><span class="status-dot"></span>Configured without code<span class="flow-live">Connected workflow</span></div>
</div>`;

export const recordTrail = () => `<div class="record-stack" role="img" aria-label="Illustrative certificate record with a linked trail of audit evidence, review, certification decision and certificate history.">
  <div class="record-back-sheet" aria-hidden="true"><span>${featureIcon('file')}Audit evidence</span><i></i><i></i><i></i></div>
  <div class="trace-window feature-window">
    <div class="feature-window-header"><span>${featureIcon('certificate')}<b>Certificate record</b></span><small>Illustrative view</small></div>
    <div class="trace-title"><div><small>CONNECTED RECORDS</small><strong>Follow the complete trail.</strong></div><span class="trace-linked">${featureIcon('link')}Linked</span></div>
    <div class="trace-timeline">
      <div class="trail-node"><span class="trail-icon">${featureIcon('file')}</span><div><strong>Audit evidence</strong><small>Evidence & findings together</small></div><span class="trail-type">Record</span></div>
      <div class="trail-node"><span class="trail-icon">${featureIcon('review')}</span><div><strong>Recorded review</strong><small>Review linked to the evidence</small></div><span class="trail-type">Review</span></div>
      <div class="trail-node"><span class="trail-icon">${featureIcon('certificate')}</span><div><strong>Certification decision</strong><small>Documented in the record</small></div><span class="trail-type">Decision</span></div>
      <div class="trail-node final-record"><span class="trail-icon">${featureIcon('history')}</span><div><strong>Certificate history</strong><small>Retained for the next audit</small></div><span class="trail-type">History</span></div>
    </div>
  </div>
</div>`;

export const operationsOverview = () => `<div class="operations-window feature-window" role="img" aria-label="Illustrative operations overview with audit work in planning, evidence awaiting review and documented certification decisions.">
  <div class="feature-window-header"><span>${featureIcon('sliders')}<b>Operations overview</b></span><small>Illustrative view</small></div>
  <div class="operations-heading"><div><small>YOUR BUSINESS, AT A GLANCE</small><strong>See the work. Set the priorities.</strong></div><span class="overview-filter">All work <i>⌄</i></span></div>
  <div class="operations-tabs"><span class="selected">Work in progress</span><span>Certificate history</span></div>
  <div class="operations-board">
    <div class="operations-lane"><div class="lane-title"><i></i>Planning</div><div class="work-item"><span class="work-icon">${featureIcon('calendar')}</span><strong>Audit plan</strong><small>Scheduling & assignment</small><span class="work-status">Ready to schedule</span></div></div>
    <div class="operations-lane review-lane"><div class="lane-title"><i></i>Review</div><div class="work-item"><span class="work-icon">${featureIcon('review')}</span><strong>Evidence & findings</strong><small>Connected audit records</small><span class="work-status">Awaiting review</span></div></div>
    <div class="operations-lane"><div class="lane-title"><i></i>Certification</div><div class="work-item"><span class="work-icon">${featureIcon('certificate')}</span><strong>Decision record</strong><small>Review & decision</small><span class="work-status documented">Documented</span></div></div>
  </div>
  <div class="operations-history"><span>${featureIcon('history')}Certificate history</span><small>Connected to the audit record</small>${featureIcon('arrow')}</div>
</div>`;
