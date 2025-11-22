import React, { useState } from 'react';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0987') {
      onSuccess();
    } else {
      setError('Incorrect passcode');
      setPassword('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 animate-fade-in">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-church-100 text-center">
            <div className="w-16 h-16 bg-church-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-church-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h2 className="text-2xl font-serif font-bold text-church-900 mb-2">Admin Access</h2>
            <p className="text-church-500 mb-6 text-sm">Please enter the passcode to manage the service.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        placeholder="Enter passcode"
                        className="w-full px-4 py-3 border border-church-200 rounded-lg focus:ring-2 focus:ring-church-500 focus:border-transparent outline-none transition-all text-center tracking-widest text-lg"
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                </div>
                
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-church-700 text-white rounded-lg hover:bg-church-800 font-medium transition-colors shadow-md"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AdminLogin;