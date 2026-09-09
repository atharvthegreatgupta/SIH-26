import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorldMap from '../components/map/WorldMap';
import { ChevronDown, ArrowLeft, MapPin, Ship, FileText, Package, Activity, Zap } from 'lucide-react';

// import ReactMarkdown from 'react-markdown';

const OPTIONS = {
  loadingPort: ['Hay Point (AUS)', 'Port Hedland (AUS)', 'Newcastle (AUS)', 'Gladstone (AUS)', 'Abbot Point (AUS)', 'Balikpapan (IDN)', 'Norfolk (USA)', 'Maputo (MOZ)', 'Vostochny (RUS)'],
  dischargePort: ['Paradip Port', 'Visakhapatnam', 'Dhamra', 'Haldia', 'Chennai Port', 'Mundra Port', 'JNPT', 'Kandla Port'],
  vesselClass: ['Capesize (150k DWT)', 'Post-Panamax (90k DWT)', 'Panamax (75k DWT)', 'Supramax (50k DWT)'],
  charterStructure: ['90-Day COA (3 Voyages)', 'Annual COA (12 Voyages)', 'Single Voyage (Spot)', '1-Year Time Charter'],
  commodity: ['Coking Coal', 'Thermal Coal', 'Iron Ore Fines', 'Bauxite'],
  portClearance: ['Draft Clearance: 18.0m OK', 'Draft Clearance: 15.8m OK', 'Draft Restricted (Wait for Tide)', 'Weather Delay (Monsoon)']
};

export default function Demo() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // New state to hold the backend response
  const [forecastReport, setForecastReport] = useState<string | null>(null);
  
  const [forecastParams, setForecastParams] = useState({
    loadingPort: 'Hay Point (AUS)',
    dischargePort: 'Paradip Port',
    vesselClass: 'Panamax (75k DWT)',
    charterStructure: '90-Day COA (3 Voyages)',
    commodity: 'Coking Coal',
    portClearance: 'Draft Clearance: 15.8m OK'
  });

  // Upgraded function to hit your Node.js backend
  const handleGenerate = async () => {
    setIsGenerating(true);
    setForecastReport(null); // Clear previous report

    try {
      // Assuming your server.js runs on port 5000
      const response = await fetch('https://sih-26-backend.onrender.com/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forecastParams)
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setForecastReport(data.report); // Expecting backend to send { report: "..." }
    } catch (error) {
      console.error("Error generating report:", error);
      setForecastReport("Error connecting to the backend. Ensure server.js is running on port 5000.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelect = (key: string, value: string) => {
    setForecastParams(prev => ({ ...prev, [key]: value }));
    setActiveDropdown(null);
  };

  const DropdownInput = ({ id, label, icon: Icon, value, options, statusColor = 'text-cyan-400' }: any) => {
    const isOpen = activeDropdown === id;
    return (
      <div className="relative w-full">
        <div 
          onClick={() => setActiveDropdown(isOpen ? null : id)}
          className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-md hover:border-slate-500/80 transition-colors cursor-pointer group"
        >
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-1">{label}</span>
          <div className="flex items-center justify-between pl-1">
            <div className="flex items-center gap-2.5">
              <Icon size={15} className={statusColor} />
              <span className="text-sm font-medium text-white truncate max-w-[200px]">{value}</span>
            </div>
            <ChevronDown size={14} className={`text-slate-500 group-hover:text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-[105%] left-0 w-full z-50 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
            {options.map((option: string) => (
              <div 
                key={option}
                onClick={() => handleSelect(id, option)}
                className="px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors border-b border-slate-800/50 last:border-0"
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#e6e9ee] text-slate-800 font-sans select-none">
      
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.8); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 1); }
        `}
      </style>

      <div className="absolute inset-0 z-0">
        <WorldMap />
      </div>

      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between pointer-events-none">
        <button 
          onClick={() => navigate('/')}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md border border-slate-700/50 rounded-full shadow-lg transition-transform active:scale-95 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* LEFT PANEL */}
      <div className="absolute top-24 left-6 z-20 w-[340px] flex flex-col gap-5 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white tracking-tight">Forecast Parameters</h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Live</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 relative">
            <DropdownInput id="loadingPort" label="Loading Port (Origin)" value={forecastParams.loadingPort} options={OPTIONS.loadingPort} icon={MapPin} />
            <DropdownInput id="dischargePort" label="Discharge Port (India)" value={forecastParams.dischargePort} options={OPTIONS.dischargePort} icon={MapPin} />
            <DropdownInput id="vesselClass" label="Vessel Class" value={forecastParams.vesselClass} options={OPTIONS.vesselClass} icon={Ship} statusColor="text-blue-400" />
            <DropdownInput id="charterStructure" label="Charter Structure" value={forecastParams.charterStructure} options={OPTIONS.charterStructure} icon={FileText} statusColor="text-blue-400" />
            <DropdownInput id="commodity" label="Commodity" value={forecastParams.commodity} options={OPTIONS.commodity} icon={Package} statusColor="text-blue-400" />
            <DropdownInput id="portClearance" label="Port Clearance State" value={forecastParams.portClearance} options={OPTIONS.portClearance} icon={Activity} statusColor="text-emerald-400" />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-2 group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-cyan-400 hover:bg-cyan-300 transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(34,211,238,0.25)] disabled:opacity-70 disabled:cursor-not-allowed z-0"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting to LLM...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap size={16} className="fill-current" />
                Generate Voyage Forecast
              </span>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL - AI REPORT OUTPUT */}
      {forecastReport && (
        <div className="absolute top-24 right-6 z-20 w-[420px] pointer-events-auto transition-all animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">AI Voyage Analysis</h2>
            </div>
            
            {/* Reverted to a safe, scrollable pre-formatted text block */}
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto custom-scrollbar pr-3">
              {forecastReport}
            </div>
            
            <button 
              onClick={() => setForecastReport(null)}
              className="mt-4 py-2 w-full text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
            >
              Dismiss Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
}