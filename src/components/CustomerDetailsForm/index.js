import React, { useState, useEffect, useCallback } from "react";

const CustomerDetailsForm = ({ loanDetails, handleInputChange }) => {
    // Initialize address from loanDetails if available
    const [fullAddress, setFullAddress] = useState(() => ({
        houseNo: loanDetails.houseNo || "",
        landmark: loanDetails.landmark || "",
        street: loanDetails.street || "",
        addressLine1: loanDetails.addressLine1 || "",
        addressLine2: loanDetails.addressLine2 || "",
        city: loanDetails.city || "",
        state: loanDetails.state || "",
        pinCode: loanDetails.pinCode || "",
    }));

    // Function to combine all address fields into a single string
    const combineAddress = (address) => Object.values(address).filter(Boolean).join(", ");

    // Handle address change and update loanDetails
    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setFullAddress((prev) => {
            const updatedAddress = { ...prev, [name]: value };

            // Update the parent state (loanDetails) with combined address
            handleInputChange({
                target: { name, value }, // Store individual fields
            });
            handleInputChange({
                target: { name: "customerFullAddress", value: combineAddress(updatedAddress) },
            });

            return updatedAddress;
        });
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-6 text-center">Customer Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { label: "Customer Name", name: "customerName", placeholder: "Enter Customer Name" },
                    { label: "Phone Number Primary", name: "customerPhonePrimary", placeholder: "Enter Primary Phone Number" },
                    { label: "Phone Number 2 (Optional)", name: "customerPhoneSecondary", placeholder: "Enter Secondary Phone Number" },
                    { label: "Aadhaar Number", name: "customerAadhaarNumber", placeholder: "Enter Aadhaar Number" },
                    { label: "Father's Name", name: "customerFatherName", placeholder: "Enter Father's Name" }
                ].map(({ label, name, placeholder }) => (
                    <div key={name} className="mb-4">
                        <label className="block text-sm font-medium">{label}</label>
                        <input
                            type="text"
                            name={name}
                            value={loanDetails[name] || ""}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                            placeholder={placeholder}
                        />
                    </div>
                ))}

                {/* Address Section */}
                <div className="mb-4 col-span-3">
                    <label className="block text-sm font-medium">Address</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { label: "House No.", name: "houseNo", placeholder: "House Number" },
                            { label: "Landmark", name: "landmark", placeholder: "Enter Landmark" },
                            { label: "Street", name: "street", placeholder: "Enter Street" },
                            { label: "Address Line 1", name: "addressLine1", placeholder: "Address Line 1" },
                            { label: "Address Line 2", name: "addressLine2", placeholder: "Address Line 2" },
                            { label: "City", name: "city", placeholder: "Enter City" },
                            { label: "State", name: "state", placeholder: "Enter State" },
                            { label: "Pin Code", name: "pinCode", placeholder: "Enter Pin Code" }
                        ].map(({ label, name, placeholder }) => (
                            <div key={name} className="mb-4">
                                <label className="block text-xs font-medium">{label}</label>
                                <input
                                    type="text"
                                    name={name}
                                    value={loanDetails[name] || ""}
                                    onChange={handleAddressChange}
                                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                                    placeholder={placeholder}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsForm;
