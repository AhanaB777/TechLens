import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Onboarding() {
  const [interest, setInterest] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!interest.trim()) return alert("Please enter your interest");
    
    // TODO: save interest to backend/localStorage
    localStorage.setItem('interest', interest);

    navigate('/resume-upload'); // goes to step 2
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/* Progress bar - Step 1 of 2 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step 1 of 2</span>
            <span>Skill Analysis</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-1/2"></div> {/* 50% filled */}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-blue-600 mb-2">Skill Analysis</h2>
        <p className="text-gray-600 mb-6">What tech field interests you?</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Interest</label>
            <input
              type="text"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="e.g. Web Dev, AI, Data Science"
              className="w-full border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            Continue to Resume
          </button>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;