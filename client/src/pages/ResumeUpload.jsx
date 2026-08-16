import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume } from '../services/resumeApi.js';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload your resume first");

    setLoading(true);
    setError('');
    try {
      const resume = await uploadResume(file);
      setResult(resume);
    } catch (err) {
      setError(err.message || "Upload failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const extractionFailed = result && result.extraction_status === 'failed';

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
        <p className="text-gray-600 mb-6">We'll analyze it and extract your skills for your TechLens profile</p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Drag Drop Box */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-600 bg-gray-50 transition"
            onClick={() => document.getElementById('resumeInput').click()}
          >
            <input
              id="resumeInput"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
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

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {!result && (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing your resume...' : 'Upload & Analyze'}
            </button>
          )}

          {result && !extractionFailed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <p className="text-green-700 font-semibold">
                ✅ Analysis complete — {result.extracted_skills?.length ?? 0} skills found
              </p>
              <p className="text-gray-600 text-sm">
                Your profile now includes your extracted skills and tech stack.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                  View My Extracted Profile
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition"
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          )}

          {extractionFailed && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
              <p className="text-yellow-700 font-semibold">⚠️ Analysis could not extract skills</p>
              <p className="text-gray-600 text-sm">
                {result.extraction_error || "We couldn't read your resume. Try a text-based PDF or DOCX."}
              </p>
              <button
                type="button"
                onClick={() => { setResult(null); setFile(null); }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                Try Another File
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}

export default ResumeUpload;