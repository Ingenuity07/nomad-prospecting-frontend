import { useProspecting } from '../hooks/useProspecting';
import { DiscoveryForm } from './DiscoveryForm';
import { LeadsFilter } from './LeadsFilter';
import { LeadsTable } from './LeadsTable';
import { LeadInspector } from './LeadInspector';

export const DashboardShell = () => {
  const {
    prospectKeyword,
    setProspectKeyword,
    prospectLocation,
    setProspectLocation,
    prospectLeads,
    isProspecting,
    selectedLead,
    setSelectedLead,
    prospectFilterScore,
    setProspectFilterScore,
    prospectFilterLocation,
    setProspectFilterLocation,
    prospectFilterCategory,
    setProspectFilterCategory,
    prospectPage,
    prospectTotalPages,
    prospectTotalCount,
    prospectCategoriesList,
    triggerDiscovery,
    clearLeads,
    changePage,
  } = useProspecting();

  return (
    <div className="workspace-container" style={{ width: '95vw', maxWidth: '1400px', height: '90vh', gridTemplateColumns: '1fr' }}>
      <div className="v3-tab-container animate-fade-in" style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
        <div className="v3-panel-header" style={{ marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, background: 'linear-gradient(to right, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              Operational Lead Prospecting & Suitability Engine
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '5px' }}>
              Discover businesses in targeted areas and qualify them automatically for Route Optimization suitability.
            </p>
          </div>
          <button 
            type="button" 
            className="v3-btn-danger" 
            onClick={clearLeads}
          >
            Clear CRM Leads
          </button>
        </div>

        {/* Lead Discovery Form component */}
        <DiscoveryForm
          keyword={prospectKeyword}
          setKeyword={setProspectKeyword}
          location={prospectLocation}
          setLocation={setProspectLocation}
          onSubmit={triggerDiscovery}
          isLoading={isProspecting}
        />

        {/* Directory Filters component */}
        <LeadsFilter
          category={prospectFilterCategory}
          setCategory={setProspectFilterCategory}
          categoriesList={prospectCategoriesList}
          location={prospectFilterLocation}
          setLocation={setProspectFilterLocation}
          score={prospectFilterScore}
          setScore={setProspectFilterScore}
        />

        {/* Main Grid View */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '1.4fr 1.6fr' : '1fr', gap: '20px', alignItems: 'start' }}>
          <LeadsTable
            leads={prospectLeads}
            totalCount={prospectTotalCount}
            currentPage={prospectPage}
            totalPages={prospectTotalPages}
            selectedLeadId={selectedLead?.id}
            onSelectLead={setSelectedLead}
            onChangePage={changePage}
          />

          {selectedLead && (
            <LeadInspector
              lead={selectedLead}
              onClose={() => setSelectedLead(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
