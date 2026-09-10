import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorldMap from '../components/map/WorldMap';
import { ChevronDown, ArrowLeft, MapPin, Ship, FileText, Package, Activity, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
  const [forecastReport, setForecastReport] = useState<string | null>(null);
  
  // Cursor Ship State
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isShipVisible, setIsShipVisible] = useState(false);

  const [forecastParams, setForecastParams] = useState({
    loadingPort: 'Hay Point (AUS)',
    dischargePort: 'Paradip Port',
    vesselClass: 'Panamax (75k DWT)',
    charterStructure: '90-Day COA (3 Voyages)',
    commodity: 'Coking Coal',
    portClearance: 'Draft Clearance: 15.8m OK'
  });

  // Track cursor movement with strict boundary checks to keep ship out of the globe and panels
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const screenWidth = window.innerWidth;
      
      // Define UI and Globe exclusion zones
      const inLeftPanel = x < 370 && y < 650;
      const inRightPanel = x > screenWidth - 440 && forecastReport !== null;
      const inGlobeArea = x >= 350 && x <= screenWidth - 420; // Blocks it from entering the center globe

      if (inLeftPanel || inRightPanel || inGlobeArea) {
        setIsShipVisible(false);
      } else {
        setIsShipVisible(true);
        setMousePos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [forecastReport]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setForecastReport(null);

    try {
      const response = await fetch('https://sih-26-backend.onrender.com/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forecastParams)
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setForecastReport(data.report);
    } catch (error) {
      console.error("Error generating report:", error);
      setForecastReport("Error connecting to backend. Render instance may be waking up, please try again.");
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
          className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/80 border border-blue-950/60 backdrop-blur-md hover:border-blue-800/80 transition-colors cursor-pointer group shadow-inner"
        >
          <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider pl-1">{label}</span>
          <div className="flex items-center justify-between pl-1">
            <div className="flex items-center gap-2.5">
              <Icon size={15} className={statusColor} />
              <span className="text-sm font-medium text-white truncate max-w-[200px]">{value}</span>
            </div>
            <ChevronDown size={14} className={`text-slate-500 group-hover:text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-[105%] left-0 w-full z-50 bg-[#060913]/95 backdrop-blur-xl border border-blue-900/60 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
            {options.map((option: string) => (
              <div 
                key={option}
                onClick={() => handleSelect(id, option)}
                className="px-4 py-3 text-sm font-medium text-slate-300 hover:bg-blue-950/60 hover:text-white cursor-pointer transition-colors border-b border-blue-950/40 last:border-0"
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
    <div className="relative w-screen h-screen overflow-hidden bg-[#070b14] text-slate-100 font-sans select-none">
      
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(30, 58, 138, 0.4); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.8); }
        `}
      </style>

      {/* FLOATING CURSOR CARGO SHIP (HACKATHON EASTER EGG) */}
      {isShipVisible && (
        <div 
          className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out flex items-center gap-2"
          style={{ 
            transform: `translate(${mousePos.x + 15}px, ${mousePos.y + 15}px)` 
          }}
        >
          <div className="p-2 bg-blue-950/80 backdrop-blur-md border border-cyan-500/40 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)] text-cyan-400 animate-pulse">
            <Ship size={18} className="transform rotate-45" />
          </div>
          <span className="text-[10px] font-mono tracking-widest bg-slate-950/90 border border-blue-900/60 text-cyan-300 px-2 py-0.5 rounded shadow-lg">
            AIS: ACTIVE
          </span>
        </div>
      )}

      {/* 3D GLOBE CONTAINER */}
      <div className="absolute inset-0 z-0">
        <WorldMap />
      </div>

      {/* TOP BAR */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between pointer-events-none">
        <button 
          onClick={() => navigate('/')}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md border border-blue-950/60 rounded-full shadow-lg transition-transform active:scale-95 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>

      {/* LEFT FORECAST PARAMETERS PANEL */}
      <div className="absolute top-24 left-6 z-20 w-[340px] flex flex-col gap-5 pointer-events-auto">
        <div className="bg-[#0b1329]/90 backdrop-blur-xl p-5 rounded-2xl border border-blue-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col gap-4">
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
            className="mt-2 group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-70 disabled:cursor-not-allowed z-0"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Maritime Routes...
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

      {/* RIGHT PANEL - DEEP BLUE AI REPORT OUTPUT */}
      {forecastReport && (
        <div className="absolute top-24 right-6 z-20 w-[420px] pointer-events-auto transition-all animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="bg-[#0b1329]/95 backdrop-blur-2xl p-6 rounded-2xl border border-blue-900/50 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1 pb-3 border-b border-blue-950">
              <Zap size={18} className="text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">AI Voyage Analysis</h2>
            </div>
            
            <div className="text-sm text-slate-200 leading-relaxed max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              <ReactMarkdown 
                components={{
                  p: ({node, ...props}) => <p className="mb-3 text-slate-300" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-cyan-300" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-3 space-y-1.5" {...props} />,
                  li: ({node, ...props}) => <li className="text-slate-200" {...props} />,
                  h3: ({node, ...props}) => <h3 className="font-bold text-cyan-400 text-base mt-4 mb-1.5 border-b border-blue-950 pb-1" {...props} />
                }}
              >
                {forecastReport}
              </ReactMarkdown>
            </div>
            
            <button 
              onClick={() => setForecastReport(null)}
              className="mt-2 py-2.5 w-full text-xs font-semibold bg-blue-950/60 hover:bg-blue-900/80 text-blue-200 hover:text-white rounded-xl border border-blue-800/40 transition-colors shadow-lg"
            >
              Dismiss Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
}