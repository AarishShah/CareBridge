import React, { useEffect, useState, useCallback } from 'react';
import backgroundImage from '../../assets/8.png';

const BASE_URL = 'http://localhost:5000/'; 

const Enable2FA = () => {
    const [qrCode, setQrCode] = useState('');
    const [code, setCode] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const pathname = window.location.pathname;
    const urlPrefix = pathname.includes('doctor') ? 'doctor' : 'patient';


    const getQrCode = async () => {
        console.log("usertype is", urlPrefix);
        try {
            setIsLoading(true);
            const response = await fetch(`${BASE_URL}${urlPrefix}/qrCode`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            console.log("response is", response);

            if (!response.ok) {
                throw new Error('Failed to fetch QR code');
            }
            const data = await response.json();
            setQrCode(data.qrCode);
        } catch (error) {
            console.error("Failed to fetch QR code:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getQrCode();
    }, []);

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const handleVerifyCode = async (code) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${BASE_URL}${urlPrefix}/verifyqrCode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                },
                body: JSON.stringify({ code })
            });
            if (!response.ok) {
                throw new Error('Failed to verify code');
            }
            const result = await response.json();
            setVerificationResult(result.verify ? 'Verification Successful!' : 'Verification Failed.');
        } catch (error) {
            console.error("Failed to verify code:", error);
            setVerificationResult('Error verifying code.');
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedVerification = useCallback(debounce(handleVerifyCode, 800), []);

    const handleInputChange = (e) => {
        setCode(e.target.value);
        debouncedVerification(e.target.value);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
             <div className="p-8 bg-white shadow-md rounded-md text-center">
             <h1 className="text-2xl font-bold mb-6">Enable 2-Factor Authentication</h1>
            {isLoading && <p>Loading...</p>}
            <img src={qrCode} alt="QR Code" className="w-64 h-64 mx-auto" />
            <br />
            <input
                type="text"
                value={code}
                onChange={handleInputChange}
                placeholder="Enter code here"
                 className="mt-4 p-2 border border-gray-300 rounded-md w-full"
            />
            {verificationResult && <p className="mt-4"> {verificationResult === 'Verification Successful!'
                            ? 'Enabled 2-Factor Authentication'
                            : 'Error enabling 2-Factor Authentication'}</p>}
            <div className="mt-4 text-gray-600 font-bold text-left">
    <ol className="list-decimal list-inside mt-6">
        <li>Use your Google Authenticator app  or any other<br />compatible app to scan the QR code above.</li>
        <li>Once scanned, the app will generate a unique code.</li>
        <li>Enter this code in the input field provided above.</li>
        <li>Remember, you will need to provide a code <br /> from your authenticator app each time you log in <br />to verify your identity.</li>
    </ol>
</div>
               </div>
         </div>
    );
};

export default Enable2FA;