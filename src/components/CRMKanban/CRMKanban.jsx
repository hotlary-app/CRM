import React, { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import './CRMKanban.css';

// Lead Card Component
const LeadCard = React.forwardRef(({ lead, onInteract, isDragging }, ref) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleCardClick = (e) => {
    e.stopPropagation();
    onInteract({
      leadId: lead.id,
      type: 'view',
      timestamp: new Date().toISOString(),
    });
  };

  const handlePhoneClick = (e) => {
    e.stopPropagation();
    onInteract({
      leadId: lead.id,
      type: 'call',
      timestamp: new Date().toISOString(),
    });
  };

  const handleEmailClick = (e) => {
    e.stopPropagation();
    onInteract({
      leadId: lead.id,
      type: 'email',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`lead-card ${lead.priority || 'medium'}`}
      onClick={handleCardClick}
      {...attributes}
      {...listeners}
    >
      <div className="lead-card-header">
        <h4>{lead.name}</h4>
        <span className={`badge badge-${lead.priority || 'medium'}`}>
          {lead.priority || 'Medium'}
        </span>
      </div>

      <div className="lead-card-body">
        <p className="company">{lead.company}</p>
        <p className="email">{lead.email}</p>
        <p className="phone">{lead.phone}</p>

        <div className="lead-metrics">
          <span className="metric">
            <strong>Value:</strong> ${lead.value || 0}
          </span>
          <span className="metric">
            <strong>Score:</strong> {lead.score || 0}%
          </span>
        </div>

        {lead.tags && lead.tags.length > 0 && (
          <div className="tags">
            {lead.tags.map((tag, idx) => (
              <span key={idx} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="lead-card-footer">
        <button
          className="action-btn call-btn"
          title="Call lead"
          onClick={handlePhoneClick}
        >
          ☎️
        </button>
        <button
          className="action-btn email-btn"
          title="Send email"
          onClick={handleEmailClick}
        >
          ✉️
        </button>
        <span className="interaction-count">
          {lead.interactions || 0} interactions
        </span>
      </div>

      {lead.lastInteraction && (
        <div className="last-interaction">
          Last: {new Date(lead.lastInteraction).toLocaleDateString()}
        </div>
      )}
    </div>
  );
});

LeadCard.displayName = 'LeadCard';

// Column Component
const KanbanColumn = ({ stage, leads, onInteract, onDragOver }) => {
  const { setNodeRef } = useSortable({ id: stage.id });

  const stageLeads = leads.filter((lead) => lead.stage === stage.id);
  const totalValue = stageLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const avgScore = stageLeads.length > 0
    ? Math.round(stageLeads.reduce((sum, lead) => sum + (lead.score || 0), 0) / stageLeads.length)
    : 0;

  return (
    <div ref={setNodeRef} className="kanban-column">
      <div className="column-header">
        <h3>{stage.name}</h3>
        <div className="column-stats">
          <span className="stat-badge">{stageLeads.length} leads</span>
          <span className="stat-badge stat-value">${totalValue.toLocaleString()}</span>
        </div>
      </div>

      <div className="column-metrics">
        <div className="metric-item">
          <span className="label">Avg Score:</span>
          <span className="value">{avgScore}%</span>
        </div>
        <div className="metric-item">
          <span className="label">Total Value:</span>
          <span className="value">${totalValue.toLocaleString()}</span>
        </div>
        {stage.conversionRate && (
          <div className="metric-item">
            <span className="label">Conv. Rate:</span>
            <span className="value">{stage.conversionRate}%</span>
          </div>
        )}
      </div>

      <SortableContext
        items={stageLeads.map((lead) => lead.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="leads-container" onDragOver={onDragOver}>
          {stageLeads.length > 0 ? (
            stageLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onInteract={onInteract}
              />
            ))
          ) : (
            <div className="empty-state">No leads in this stage</div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

// Main CRMKanban Component
const CRMKanban = ({
  leads: initialLeads = [],
  stages: initialStages = [
    { id: 'new', name: 'New Leads', conversionRate: 0 },
    { id: 'contacted', name: 'Contacted', conversionRate: 25 },
    { id: 'qualified', name: 'Qualified', conversionRate: 50 },
    { id: 'proposal', name: 'Proposal', conversionRate: 75 },
    { id: 'won', name: 'Won', conversionRate: 100 },
  ],
  onLeadUpdate = () => {},
  onInteractionLog = () => {},
}) => {
  const [leads, setLeads] = useState(initialLeads);
  const [stages, setStages] = useState(initialStages);
  const [activeId, setActiveId] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    totalValue: 0,
    avgScore: 0,
    conversionRate: 0,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calculate metrics whenever leads or interactions change
  useEffect(() => {
    const totalLeads = leads.length;
    const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const avgScore = totalLeads > 0
      ? Math.round(leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / totalLeads)
      : 0;

    const wonLeads = leads.filter((lead) => lead.stage === 'won').length;
    const conversionRate = totalLeads > 0
      ? Math.round((wonLeads / totalLeads) * 100)
      : 0;

    setMetrics({
      totalLeads,
      totalValue,
      avgScore,
      conversionRate,
    });
  }, [leads]);

  // Handle interactions (calls, emails, views)
  const handleInteract = useCallback((interaction) => {
    const newInteractions = [...interactions, interaction];
    setInteractions(newInteractions);

    // Update lead with interaction info
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === interaction.leadId
          ? {
              ...lead,
              interactions: (lead.interactions || 0) + 1,
              lastInteraction: interaction.timestamp,
            }
          : lead
      )
    );

    onInteractionLog(interaction);
  }, [interactions, onInteractionLog]);

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Handle drag over
  const handleDragOver = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLeads((prevLeads) => {
        const activeLeadIndex = prevLeads.findIndex((lead) => lead.id === active.id);
        const overLeadIndex = prevLeads.findIndex((lead) => lead.id === over.id);

        if (activeLeadIndex !== -1 && overLeadIndex !== -1) {
          return arrayMove(prevLeads, activeLeadIndex, overLeadIndex);
        }

        // Check if dropping on a stage
        const overStage = stages.find((stage) => stage.id === over.id);
        if (overStage && activeLeadIndex !== -1) {
          const updatedLeads = [...prevLeads];
          updatedLeads[activeLeadIndex] = {
            ...updatedLeads[activeLeadIndex],
            stage: overStage.id,
          };
          return updatedLeads;
        }

        return prevLeads;
      });
    }
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      // Check if moved to different stage
      const activeLead = leads.find((lead) => lead.id === active.id);
      const overStage = stages.find((stage) => stage.id === over.id);

      if (activeLead && overStage && activeLead.stage !== overStage.id) {
        const updatedLeads = leads.map((lead) =>
          lead.id === active.id
            ? { ...lead, stage: overStage.id, lastUpdated: new Date().toISOString() }
            : lead
        );
        setLeads(updatedLeads);
        onLeadUpdate(updatedLeads.find((lead) => lead.id === active.id));
      }
    }
  };

  return (
    <div className="crm-kanban">
      <div className="kanban-header">
        <h1>CRM Pipeline</h1>
        <div className="dashboard-metrics">
          <div className="metric-card">
            <span className="metric-label">Total Leads</span>
            <span className="metric-value">{metrics.totalLeads}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Pipeline Value</span>
            <span className="metric-value">${metrics.totalValue.toLocaleString()}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Avg. Score</span>
            <span className="metric-value">{metrics.avgScore}%</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Conversion Rate</span>
            <span className="metric-value">{metrics.conversionRate}%</span>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              leads={leads}
              onInteract={handleInteract}
              onDragOver={handleDragOver}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <LeadCard
              lead={leads.find((lead) => lead.id === activeId)}
              onInteract={handleInteract}
              isDragging={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {interactions.length > 0 && (
        <div className="interaction-log">
          <h3>Recent Interactions ({interactions.length})</h3>
          <ul className="interaction-list">
            {interactions.slice(-5).reverse().map((interaction, idx) => (
              <li key={idx} className={`interaction-${interaction.type}`}>
                <span className="interaction-type">{interaction.type.toUpperCase()}</span>
                <span className="interaction-time">
                  {new Date(interaction.timestamp).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CRMKanban;
