import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload your resume first");

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    // TODO: await fetch('/api/resumes/', {method: 'POST', body: formData})

    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/* Progress bar - Step 2 of 2 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step 2 of 2</span>
            <span>Resume</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-full"></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-blue-600 mb-2">Upload Your Resume</h2>
        <p className="text-gray-600 mb-6">We'll use this to suggest skills & projects for you</p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Drag Drop Box */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-600 bg-gray-50 transition"
            onClick={() => document.getElementById('resumeInput').click()}
          >
            <input
              id="resumeInput"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            {file? (
              <div>
                <p className="text-blue-600 font-semibold">📄 {file.name}</p>
                <p className="text-gray-500 text-sm">Click to change file</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-1">☐ Drag & Drop or Click to Upload</p>
                <p className="text-gray-500 text-sm">PDF, DOC, DOCX - Max 5MB</p>
              </div>
            )}
          </div>

          {/* Blue Button only */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading? 'Analyzing...' : 'Continue to Dashboard'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default ResumeUpload;