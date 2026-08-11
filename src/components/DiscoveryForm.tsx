import { Globe } from 'lucide-react';

interface DiscoveryFormProps {
  keyword: string;
  setKeyword: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const DiscoveryForm = ({
  keyword,
  setKeyword,
  location,
  setLocation,
  onSubmit,
  isLoading,
}: DiscoveryFormProps) => {
  return (
    <div className="v3-card" style={{ marginBottom: '20px' }}>
      <div className="v3-card-title">
        <Globe size={16} color="#6366f1" />
        <span>Launch Lead Discovery Run</span>
      </div>
      <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Business Sector / Keyword</label>
          <input 
            type="text" 
            className="v3-input" 
            placeholder="e.g. Courier Service, Plumbing, Waste Collection" 
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Target Location</label>
          <input 
            type="text" 
            className="v3-input" 
            placeholder="e.g. Manchester, London, Leeds" 
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button 
            type="button" 
            className="v3-btn" 
            onClick={onSubmit}
            disabled={isLoading}
            style={{ height: '40px', padding: '0 25px' }}
          >
            {isLoading ? 'Searching & Scrutinizing...' : 'Discover & Qualify'}
          </button>
        </div>
      </div>
    </div>
  );
};
