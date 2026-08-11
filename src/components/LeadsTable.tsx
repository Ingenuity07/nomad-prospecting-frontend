import { Database } from 'lucide-react';
import type { LeadCompany } from '../types';

interface LeadsTableProps {
  leads: LeadCompany[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  selectedLeadId?: string;
  onSelectLead: (lead: LeadCompany) => void;
  onChangePage: (page: number) => void;
}

export const LeadsTable = ({
  leads,
  totalCount,
  currentPage,
  totalPages,
  selectedLeadId,
  onSelectLead,
  onChangePage,
}: LeadsTableProps) => {
  return (
    <div className="v3-card">
      <div className="v3-card-title">
        <Database size={16} color="#6366f1" />
        <span>CRM Qualified Leads Directory ({totalCount} total leads)</span>
      </div>
      
      <div style={{ maxHeight: '55vh', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
        <table className="v3-table">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Lead Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const score = lead.analysis?.lead_score || 0;
              const scoreColor = score >= 8 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444';
              return (
                <tr 
                  key={lead.id} 
                  className={selectedLeadId === lead.id ? 'active-row' : ''} 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => onSelectLead(lead)}
                >
                  <td className="font-weight-600">
                    {lead.name}
                    {lead.website && (
                      <a href={lead.website} target="_blank" rel="noreferrer" style={{ marginLeft: '8px', color: '#6366f1', fontSize: '11px' }}>
                        Visit Website
                      </a>
                    )}
                  </td>
                  <td>{lead.category || 'N/A'}</td>
                  <td>{lead.address || 'N/A'}</td>
                  <td>
                    <span className="v3-ats-pill" style={{ backgroundColor: `${scoreColor}15`, color: scoreColor, borderColor: `${scoreColor}40` }}>
                      {score.toFixed(1)}/10
                    </span>
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="v3-btn-subtle" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLead(lead);
                      }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
                  No matching leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Page {currentPage} of {totalPages} ({totalCount} total leads)
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            className="v3-btn-subtle" 
            disabled={currentPage <= 1} 
            onClick={() => onChangePage(currentPage - 1)}
            style={{ padding: '5px 12px', minWidth: 'auto' }}
          >
            Previous
          </button>
          <button 
            type="button" 
            className="v3-btn-subtle" 
            disabled={currentPage >= totalPages} 
            onClick={() => onChangePage(currentPage + 1)}
            style={{ padding: '5px 12px', minWidth: 'auto' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
