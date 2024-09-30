import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DownloadQRCode = () => {
    const { id } = useParams(); // Get the menu ID from the URL
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
      fetch(`http://localhost:8000/menu/menus/${id}/download-qr-code/`) // Update this line
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.blob(); // Assuming your backend returns the QR code as a blob
          })
          .then(blob => {
              const url = URL.createObjectURL(blob);
              setQrCodeUrl(url); // Create a local URL for the blob
          })
          .catch(error => console.error('Error fetching QR code:', error));
    }, [id]);
    

    return (
        <div>
            {qrCodeUrl ? (
                <a href={qrCodeUrl} download={`qr_code_${id}.png`}>
                    Download QR Code
                </a>
            ) : (
                <p>Loading QR Code...</p>
            )}
        </div>
    );
};

export default DownloadQRCode;
