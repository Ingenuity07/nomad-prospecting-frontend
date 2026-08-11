import { Sliders } from 'lucide-react';

interface LeadsFilterProps {
  category: string;
  setCategory: (val: string) => void;
  categoriesList: string[];
  location: string;
  setLocation: (val: string) => void;
  score: string;
  setScore: (val: string) => void;
}

export const LeadsFilter = ({
  category,
  setCategory,
  categoriesList,
  location,
  setLocation,
  score,
  setScore,
}: LeadsFilterProps) => {
  return (
    <div className="v3-card" style={{ marginBottom: '20px', padding: '15px' }}>
      <div className="v3-card-title" style={{ marginBottom: '10px' }}>
        <Sliders size={16} color="#6366f1" />
        <span>Filter Leads Directory</span>
      </div>
      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>Category</label>
          <select 
            className="v3-input" 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            style={{ height: '35px', padding: '0 10px' }}
          >
            <option value="">All Categories</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>Location</label>
          <input 
            type="text" 
            className="v3-input" 
            placeholder="Filter by city/address..."
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{ height: '35px', padding: '0 10px' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>Min Suitability Score</label>
          <select 
            className="v3-input" 
            value={score} 
            onChange={e => setScore(e.target.value)}
            style={{ height: '35px', padding: '0 10px' }}
          >
            <option value="">All Scores</option>
            <option value="8">8.0+ (Excellent)</option>
            <option value="5">5.0+ (Moderate)</option>
            <option value="3">3.0+ (Low)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
