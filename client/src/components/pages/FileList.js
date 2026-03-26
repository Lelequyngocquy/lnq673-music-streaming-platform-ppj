import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FileList = () => {
  const [files, setFiles] = useState([]);
  

  useEffect(() => {
    const fetchFiles = async () => {
      console.log('[DEBUG] Fetching files from backend...');
      try {
        const response = await axios.get('http://localhost:5000/api/get-all-files');
        console.log('[DEBUG] Response from backend:', response.data);
        setFiles(response.data.files);
      } catch (err) {
        console.error('[ERROR] Error fetching files:', err);
      }
    };

    fetchFiles();
  }, []);


  console.log('[DEBUG] Current files state:', files);

  return (
    <div>
      <h1>Files in S3 Bucket</h1>
      <h3>"Developing Site"</h3>
      {files.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <ul> 
          {files.map((file) => (   
            <li key={file.key}>
              <p><strong>File:</strong> {file.key}</p>
              <p><strong>Size:</strong> {file.size} bytes</p>
              <p><strong>Last Modified:</strong> {new Date(file.lastModified).toLocaleString()}</p>
              <p><strong>File URL:</strong> 
                <a href={`https://msw-ititiu21.s3.ap-southeast-2.amazonaws.com/${file.key}`} target="_blank" rel="noopener noreferrer">
                  {`https://msw-ititiu21.s3.ap-southeast-2.amazonaws.com/${file.key}`}
                </a>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
