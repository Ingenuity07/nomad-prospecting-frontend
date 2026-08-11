import type { LeadCompany } from '../types';

interface LeadInspectorProps {
  lead: LeadCompany;
  onClose: () => void;
}

export const LeadInspector = ({ lead, onClose }: LeadInspectorProps) => {
  const score = lead.analysis?.lead_score || 0;
  const isGoodScore = score >= 8;

  return (
    <div style={{ position: 'sticky', top: '10px' }}>
      <div className="v3-card animate-fade-in" style={{ height: 'fit-content', maxHeight: '72vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Lead Suitability Profile</h3>
          <button type="button" className="v3-btn-subtle" style={{ minWidth: 'auto', padding: '4px 8px' }} onClick={onClose}>X</button>
        </div>
        
        <h2 style={{ fontSize: '20px', margin: '0 0 5px 0' }}>{lead.name}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 15px 0' }}>{lead.address}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px' }}>
            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Lead Score</span>
            <span style={{ fontSize: '24px', fontWeight: 700, color: isGoodScore ? '#10b981' : '#f59e0b' }}>
              {lead.analysis?.lead_score?.toFixed(1) || 'N/A'}/10
            </span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px' }}>
            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Fleet Size Estimate</span>
            <span style={{ fontSize: '18px', fontWeight: 600 }}>{lead.analysis?.fleet_size_estimate || 'Unknown'}</span>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600 }}>Operational Suitability Checks</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span>Has Deliveries:</span>
              <span style={{ fontWeight: 600, color: lead.analysis?.has_delivery ? '#10b981' : '#ef4444' }}>
                {lead.analysis?.has_delivery ? 'YES' : 'NO'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span>Has Appointment Scheduling:</span>
              <span style={{ fontWeight: 600, color: lead.analysis?.has_scheduling ? '#10b981' : '#ef4444' }}>
                {lead.analysis?.has_scheduling ? 'YES' : 'NO'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span>Needs Daily Route Planning:</span>
              <span style={{ fontWeight: 600, color: lead.analysis?.needs_routing ? '#10b981' : '#ef4444' }}>
                {lead.analysis?.needs_routing ? 'YES' : 'NO'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600 }}>Qualitative Summary</h4>
          <p style={{ fontSize: '13px', lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #6366f1' }}>
            {lead.analysis?.description || 'No summary extracted.'}
          </p>
          <p style={{ fontSize: '12px', fontStyle: 'italic', marginTop: '10px', color: 'var(--text-muted)' }}>
            Reasoning: {lead.analysis?.lead_score_reason || 'N/A'}
          </p>
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600 }}>Contact Information ({lead.contacts?.length || 0})</h4>
          {lead.contacts?.map((con, i) => (
            <div key={i} style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', marginBottom: '8px', fontSize: '13px' }}>
              {con.email !== 'linkedin@placeholder.com' ? (
                <div>
                  <strong>Email:</strong> {con.email}
                </div>
              ) : (
                <div>
                  <strong>LinkedIn URL:</strong> <a href={con.linkedin} target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}>View Company Profile</a>
                </div>
              )}
            </div>
          ))}
          {lead.contacts?.length === 0 && (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No direct contact emails or social links extracted from homepage footer.
              </p>
          )}
        </div>
      </div>
    </div>
  );
};
