import React, { useEffect, useState, useCallback } from 'react';

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
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // assuming you store JWT in localStorage
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
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // assuming you store JWT in localStorage
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
        <div className="App">
            {isLoading && <p>Loading...</p>}
            <img src={qrCode} alt="QR Code" />
            <br />
            <input
                type="text"
                value={code}
                onChange={handleInputChange}
                placeholder="Enter code here"
            />
            {verificationResult && <p>{verificationResult}</p>}
        </div>
    );
};

export default Enable2FA;