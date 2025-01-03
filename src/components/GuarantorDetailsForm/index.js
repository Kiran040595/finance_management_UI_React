
import React, { useState, useEffect } from "react";


const GuarantorDetailsForm = ({ loanDetails, handleInputChange }) =>{

    const [fullAddress, setFullAddress] = useState({
        houseNo: "",
        landmark: "",
        street: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pinCode: "",
    });



    // Function to combine all fields into a single address string
    const combineAddress = () => {
        return Object.values(fullAddress)
            .filter(Boolean) // Remove empty or undefined values
            .join(", "); // Join with commas
    };

    // Update loanDetails.fullAddress whenever fullAddress changes
    useEffect(() => {
        const combinedAddress = combineAddress();
        handleInputChange({
            target: { name: "guarantorFullAddress", value: combinedAddress },
        });
    }, [fullAddress]);


    // Handle changes to individual fields in fullAddress
    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setFullAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    
    
    
    
    
    return (
    <div className="p-4 mb-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Guarantor Details</h3>

        {/* Guarantor Basic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Guarantor Name */}
            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600">Guarantor Name</label>
                <input
                    type="text"
                    name="guarantorName"
                    value={loanDetails.guarantorName || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg shadow-sm text-sm text-gray-700"
                    placeholder="Enter Guarantor Name"
                />
            </div>

            {/* Guarantor Phone Number */}
            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                <input
                    type="text"
                    name="guarantorPhonePrimary"
                    value={loanDetails.guarantorPhonePrimary || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg shadow-sm text-sm text-gray-700"
                    placeholder="Enter Phone Number"
                />
            </div>

            {/* Guarantor Aadhaar Number */}
            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600">Aadhaar Number</label>
                <input
                    type="text"
                    name="guarantorAadhaarNumber"
                    value={loanDetails.guarantorAadhaarNumber || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg shadow-sm text-sm text-gray-700"
                    placeholder="Enter Aadhaar Number"
                />
            </div>
        </div>

        {/* Full Address Section */}
        <div className="mb-4 col-span-3">
            <label className="block text-sm font-medium text-gray-600">Full Address</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* House No. */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600">House No.</label>
                    <input
                        type="text"
                        name="houseNo"
                        value={fullAddress.houseNo || ""}
                        onChange={handleAddressChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                        placeholder="House Number"
                    />
                </div>

                {/* Landmark */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600">Landmark</label>
                    <input
                        type="text"
                        name="landmark"
                        value={fullAddress.landmark || ""}
                        onChange={handleAddressChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter Landmark"
                    />
                </div>

                {/* Street */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600">Street</label>
                    <input
                        type="text"
                        name="street"
                        value={fullAddress.street || ""}
                        onChange={handleAddressChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter Street"
                    />
                </div>

                {/* Address Line 1 */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600">Address Line 1</label>
                    <input
                        type="text"
                        name="addressLine1"
                        value={fullAddress.addressLine1 || ""}
                        onChange={handleAddressChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                        placeholder="Address Line 1"
                    />
                </div>

                {/* Address Line 2 */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600">Address Line 2</label>
                    <input
                        type="text"
                        name="addressLine2"
                        value={fullAddress.addressLine2 || ""}
                        onChange={handleAddressChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                        placeholder="Address Line 2"
                    />
                </div>

                {/* City */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600">City</label>
                    <input
                        type="text"
                        name="city"
                        value={fullAddress.city || ""}
                        onChange={handleAddressChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter City"
                    />
                </div>

                {/* State */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600">State</label>
                    <input
                        type="text"
                        name="state"
                        value={fullAddress.state || ""}
                        onChange={handleAddressChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter State"
                    />
                </div>

                {/* Pin Code */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600">Pin Code</label>
                    <input
                        type="text"
                        name="pinCode"
                        value={fullAddress.pinCode || ""}
                        onChange={handleAddressChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter Pin Code"
                    />
                </div>

            </div>
        </div>


    </div>
);
}
export default GuarantorDetailsForm;
