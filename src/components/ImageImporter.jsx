import { useState } from 'react';

export default function ImageImporter() {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const importImages = async () => {
    setImporting(true);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/products/import-images', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Product Images</h3>
      <p className="text-sm text-gray-600 mb-4">
        Download product images from WooCommerce and save them locally for faster loading.
      </p>
      
      <button
        onClick={importImages}
        disabled={importing}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {importing ? 'Importing Images...' : 'Import Images from WooCommerce'}
      </button>
      
      {result && (
        <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {result.success ? (
            <div>
              <p className="font-medium">✓ Import Complete</p>
              <p className="text-sm mt-1">
                Imported {result.imported} of {result.total} product images
              </p>
              {result.errors && result.errors.length > 0 && (
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer">View errors ({result.errors.length})</summary>
                  <ul className="mt-2 space-y-1">
                    {result.errors.map((err, idx) => (
                      <li key={idx}>SKU {err.sku}: {err.error}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          ) : (
            <p>Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
