import React, { useState, useEffect } from 'react';
import { ProgramType, ProgramEntry } from '../types';
import { PROGRAM_OPTIONS } from '../constants';
import { addEntry, getEntries } from '../services/storageService';

interface ProgramFormProps {
  onSubmission: () => void;
}

const ProgramForm: React.FC<ProgramFormProps> = ({ onSubmission }) => {
  const [step, setStep] = useState<'menu' | 'details'>('menu');
  const [name, setName] = useState('');
  const [type, setType] = useState<ProgramType>(ProgramType.SONG);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [takenTypes, setTakenTypes] = useState<Set<ProgramType>>(new Set());

  // Load existing entries to determine what is available
  const refreshAvailability = () => {
    const entries = getEntries();
    const types = new Set(entries.map(e => e.type));
    setTakenTypes(types);
  };

  useEffect(() => {
    refreshAvailability();
    const interval = setInterval(refreshAvailability, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSelection = (selectedType: ProgramType) => {
    setType(selectedType);
    setDetails(''); // Clear details on new selection
    setStep('details'); // "Redirect" to form details
  };

  const handleBack = () => {
    setStep('menu');
    setError(null);
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Double check availability before submit
    refreshAvailability();
    const optionConfig = PROGRAM_OPTIONS.find(opt => opt.value === type);
    if (optionConfig && !optionConfig.allowMultiple && takenTypes.has(type)) {
      setError("This slot was just taken by someone else. Please select another.");
      return;
    }

    setIsSubmitting(true);

    const newEntry: ProgramEntry = {
      id: crypto.randomUUID(),
      type,
      personName: name,
      details,
      timestamp: Date.now(),
      completed: false
    };

    // Simulate network delay for UX
    setTimeout(() => {
      addEntry(newEntry);
      refreshAvailability();
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form after short delay
      setTimeout(() => {
        setName('');
        setDetails('');
        setShowSuccess(false);
        setStep('menu'); // Reset to menu
        onSubmission(); // Notify parent to potentially switch views
      }, 1500);
    }, 600);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in bg-white rounded-xl shadow-lg border border-green-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif font-bold text-church-900">Submitted Successfully!</h3>
        <p className="text-church-600 mt-2">Your item has been added to the prayer list.</p>
      </div>
    );
  }

  // STEP 1: SELECTION MENU
  if (step === 'menu') {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-church-100">
            <h2 className="text-2xl font-serif font-bold text-church-900 mb-2 text-center">Join the Prayer</h2>
            <p className="text-center text-church-500 mb-8 text-sm">Select what you would like to share today:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROGRAM_OPTIONS.map((option) => {
                    const isTaken = takenTypes.has(option.value) && !option.allowMultiple;
                    
                    return (
                        <button
                            key={option.value}
                            onClick={() => !isTaken && handleSelection(option.value)}
                            disabled={isTaken}
                            className={`group relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 text-left
                                ${isTaken 
                                    ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed' 
                                    : 'border-church-100 bg-white hover:border-church-500 hover:shadow-md active:scale-[0.98]'
                                }
                            `}
                        >
                            <span className={`text-3xl mr-4 ${isTaken ? 'grayscale' : 'group-hover:scale-110 transition-transform'}`}>
                                {option.icon}
                            </span>
                            <div className="flex-1">
                                <span className={`block font-bold ${isTaken ? 'text-gray-400' : 'text-church-900'}`}>
                                    {option.label}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {isTaken ? 'Already selected' : 'Tap to select'}
                                </span>
                            </div>
                            {isTaken && (
                                <div className="absolute top-2 right-2">
                                    <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full">
                                        TAKEN
                                    </span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
  }

  // STEP 2: DETAILS FORM
  const selectedOption = PROGRAM_OPTIONS.find(o => o.value === type);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-church-100 animate-fade-in">
      <button 
        onClick={handleBack}
        className="flex items-center text-church-500 hover:text-church-800 text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to options
      </button>

      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-church-100">
         <div className="w-12 h-12 bg-church-50 rounded-full flex items-center justify-center text-2xl">
            {selectedOption?.icon}
         </div>
         <div>
             <h2 className="text-xl font-serif font-bold text-church-900">{selectedOption?.label}</h2>
             <p className="text-xs text-church-500">Please fill in the details below</p>
         </div>
      </div>

      {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
          </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-church-700 mb-1">Your Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-church-200 rounded-lg focus:ring-2 focus:ring-church-500 focus:border-transparent outline-none transition-all bg-church-50/30"
            placeholder="e.g., John Doe"
            autoFocus
          />
        </div>

        {/* Details Input */}
        <div>
          <label className="block text-sm font-medium text-church-700 mb-1">
            Details <span className="text-church-400 font-normal">(Song Name, Verse, Topic)</span>
          </label>
          <textarea
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-church-200 rounded-lg focus:ring-2 focus:ring-church-500 focus:border-transparent outline-none transition-all bg-church-50/30"
            placeholder={type === ProgramType.SONG ? "e.g., Amazing Grace" : "Enter details here..."}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-church-700 hover:bg-church-800 text-white font-semibold py-3.5 rounded-lg shadow-md transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-4"
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Selection'}
        </button>
      </form>
    </div>
  );
};

export default ProgramForm;