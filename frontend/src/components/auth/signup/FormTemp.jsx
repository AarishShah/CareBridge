import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormTemp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    DOB: '',
    gender: '',
    maritalStatus: '',
    occupation: '',
    state: '',
    city: '',
    street: '',
    pinCode: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch session data and prepopulate the form
    const fetchSessionData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patient/session-data', { withCredentials: true });
        const { name, email } = response.data;
        setFormData((prevFormData) => ({
          ...prevFormData,
          name,
          email
        }));
      } catch (err) {
        console.error('Error fetching session data:', err);
      }
    };

    fetchSessionData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/patient/complete-profile', formData, { withCredentials: true });
      setSuccess('Profile completed successfully!');
      setError('');
      console.log(response.data);
    } catch (err) {
      setError(err.response.data.error);
      setSuccess('');
      console.error('Error:', err);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Complete Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            className="border rounded w-full py-2 px-3 text-gray-700"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="border rounded w-full py-2 px-3 text-gray-700"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth (DOB):</label>
          <input
            type="date"
            name="DOB"
            value={formData.DOB}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Marital Status:</label>
          <input
            type="text"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Occupation:</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">State:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Street:</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Pin Code:</label>
          <input
            type="text"
            name="pinCode"
            value={formData.pinCode}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {success && <div className="mt-4 text-green-500">{success}</div>}
    </div>
  );
};

export default FormTemp;
