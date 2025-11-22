import React, { useState, useEffect } from 'react';
import { ProgramEntry } from '../types';
import { getEntries } from '../services/storageService';
import { PROGRAM_OPTIONS } from '../constants';

interface PublicScheduleProps {
  onBack: () => void;
}

const PublicSchedule: React.FC<PublicScheduleProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<ProgramEntry[]>([]);

  useEffect(() => {
    const load = () => setEntries(getEntries());
    load();
    const interval = setInterval(load, 3000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  const getOption = (type: string) => PROGRAM_OPTIONS.find(p => p.value === type);

  const handleShare = () => {
    if (entries.length === 0) return;

    const scheduleText = entries.map((e, i) => 
      `${i + 1}. *${e.type}* - ${e.personName} ${e.details ? `(${e.details})` : ''}`
    ).join('\n');

    const fullText = `*✝️ Sunday Service Schedule ✝️*\n\n${scheduleText}\n\n_Follow live on PrayerFlow_`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl border border-church-100 overflow-hidden">
        <div className="bg-church-800 px-6 py-8 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
           <h2 className="text-3xl font-serif font-bold text-white mb-2 relative z-10">Order of Service</h2>
           <p className="text-church-200 relative z-10">Today's Prayer Schedule</p>
        </div>
        
        <div className="p-6 sm:p-8 bg-church-50/50">
           {entries.length === 0 ? (
               <div className="text-center py-12">
                   <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-church-100 text-church-400 mb-4">
                       <span className="text-2xl">⛪</span>
                   </div>
                   <p className="text-church-500 font-medium">The schedule is currently empty.</p>
                   <p className="text-sm text-church-400 mt-1">Be the first to join the prayer!</p>
               </div>
           ) : (
               <div className="space-y-6">
                   {entries.map((entry, index) => {
                       const option = getOption(entry.type);
                       return (
                           <div key={entry.id} className="relative pl-8 sm:pl-0 group">
                               {/* Timeline Line for Desktop */}
                               <div className="hidden sm:block absolute left-[27px] top-10 bottom-0 w-0.5 bg-church-200 group-last:hidden"></div>
                               
                               <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                   {/* Icon/Time Column */}
                                   <div className="hidden sm:flex flex-col items-center min-w-[56px]">
                                       <div className={`w-14 h-14 rounded-full border-4 border-white shadow-md flex items-center justify-center text-2xl z-10 ${entry.completed ? 'bg-gray-100 grayscale opacity-70' : 'bg-white'}`}>
                                           {option?.icon}
                                       </div>
                                   </div>

                                   {/* Content Card */}
                                   <div className={`flex-1 bg-white rounded-lg p-5 border shadow-sm transition-shadow hover:shadow-md ${entry.completed ? 'border-gray-100 bg-gray-50' : 'border-church-100'}`}>
                                       <div className="flex justify-between items-start">
                                           <div className="flex items-center gap-2 mb-2">
                                                <span className="sm:hidden text-lg mr-1">{option?.icon}</span>
                                                <span className="text-xs font-bold uppercase tracking-wider text-church-500 bg-church-50 px-2 py-0.5 rounded border border-church-100">
                                                    {entry.type}
                                                </span>
                                                {entry.completed && (
                                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                        DONE
                                                    </span>
                                                )}
                                           </div>
                                       </div>
                                       
                                       <h3 className={`text-xl font-serif font-bold mb-1 ${entry.completed ? 'text-gray-500 line-through decoration-gray-300' : 'text-church-900'}`}>
                                           {entry.personName}
                                       </h3>
                                       
                                       <div className={`text-sm leading-relaxed ${entry.completed ? 'text-gray-400' : 'text-church-700'}`}>
                                           {entry.details}
                                       </div>
                                   </div>
                               </div>
                           </div>
                       );
                   })}
               </div>
           )}
        </div>

        <div className="bg-white p-4 border-t border-church-100 flex flex-col sm:flex-row justify-center gap-3">
            <button 
                onClick={onBack}
                className="flex items-center justify-center gap-2 text-church-600 hover:text-church-800 font-medium px-4 py-2 rounded-lg hover:bg-church-50 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Add Another Item
            </button>

            <button
                onClick={handleShare}
                disabled={entries.length === 0}
                className="flex items-center justify-center gap-2 text-green-600 hover:text-green-800 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                Share Schedule
            </button>
        </div>
      </div>
      
      <p className="text-center text-church-400 text-xs mt-6">
          This schedule updates automatically.
      </p>
    </div>
  );
};

export default PublicSchedule;