import React, { useState, useEffect, useCallback } from "react";

const GuarantorDetailsForm = ({ loanDetails, handleInputChange }) => {
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

    // Populate fullAddress state when loanDetails are available
    useEffect(() => {
        if (loanDetails?.guarantorFullAddress) {
            const addressParts = loanDetails.guarantorFullAddress.split(", ");
            setFullAddress({
                houseNo: addressParts[0] || "",
                landmark: addressParts[1] || "",
                street: addressParts[2] || "",
                addressLine1: addressParts[3] || "",
                addressLine2: addressParts[4] || "",
                city: addressParts[5] || "",
                state: addressParts[6] || "",
                pinCode: addressParts[7] || "",
            });
        }
    }, [loanDetails?.guarantorFullAddress]);

    // Function to combine all fields into a single address string
    const combineAddress = () => {
        return Object.values(fullAddress).filter(Boolean).join(", ");
    };

    // Memoized function to prevent infinite re-renders
    const updateGuarantorAddress = useCallback(() => {
        const combinedAddress = combineAddress();
        if (loanDetails.guarantorFullAddress !== combinedAddress) {
            handleInputChange({
                target: { name: "guarantorFullAddress", value: combinedAddress },
            });
        }
    }, [fullAddress, loanDetails.guarantorFullAddress, handleInputChange]);

    useEffect(() => {
        updateGuarantorAddress();
    }, [fullAddress, updateGuarantorAddress]);

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
                    {[
                        { name: "houseNo", label: "House No." },
                        { name: "landmark", label: "Landmark" },
                        { name: "street", label: "Street" },
                        { name: "addressLine1", label: "Address Line 1" },
                        { name: "addressLine2", label: "Address Line 2" },
                        { name: "city", label: "City" },
                        { name: "state", label: "State" },
                        { name: "pinCode", label: "Pin Code" },
                    ].map((field) => (
                        <div key={field.name} className="mb-4">
                            <label className="block text-xs font-medium text-gray-600">
                                {field.label}
                            </label>
                            <input
                                type="text"
                                name={field.name}
                                value={fullAddress[field.name] || ""}
                                onChange={handleAddressChange}
                                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                                placeholder={`Enter ${field.label}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GuarantorDetailsForm;
