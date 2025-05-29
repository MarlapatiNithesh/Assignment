import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobContext } from '../context/JobContext';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { setJobs } = useJobContext();

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setSuccessMessage('');
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setSuccessMessage('');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const res = await fetch('https://assignment-backend-he4q.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('✅ Resume uploaded successfully!');
        console.log('✅ Resume uploaded successfully!',data);
        setJobs(data.matchedJobs || []);
        navigate('/results');
      } else {
        alert(data.message || 'Failed to process resume');
      }
    } catch (err) {
      alert('Error uploading resume');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h1 className="text-center text-4xl font-extrabold text-gray-900 mb-8">
          Welcome to Hirebuddy
        </h1>

        {/* Search Bar */}
        <SearchBar />

        {/* OR divider */}
        <div className="flex items-center my-8" aria-hidden="true">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 font-semibold">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div
            role="alert"
            className="mb-6 px-4 py-3 rounded-md bg-green-100 text-green-800 text-center font-semibold"
          >
            {successMessage}
          </div>
        )}

        {/* Upload Section */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
          }}
          tabIndex={0}
          role="button"
          aria-label="Upload your resume by clicking or dragging file here"
          className="relative cursor-pointer border-2 border-dashed border-gray-400 rounded-lg py-12 flex flex-col items-center justify-center hover:bg-gray-100 transition focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-hidden="true"
          />

          {!selectedFile ? (
            <>
              <svg
                className="w-12 h-12 mb-3 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
              <p className="text-gray-600 text-center max-w-xs">
                Drag and drop your resume here or click to browse supported formats (.pdf, .doc, .docx,
                .txt)
              </p>
            </>
          ) : (
            <div className="flex items-center justify-between w-full max-w-md px-4">
              <span className="text-gray-800 truncate">{selectedFile.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                aria-label="Remove selected file"
                className="text-red-600 font-extrabold text-2xl leading-none hover:text-red-700 transition"
                type="button"
              >
                &times;
              </button>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          disabled={!selectedFile || uploading}
          onClick={handleUpload}
          type="button"
          aria-busy={uploading}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          {uploading ? 'Uploading...' : 'Submit Resume'}
        </button>
      </div>
    </main>
  );
}
