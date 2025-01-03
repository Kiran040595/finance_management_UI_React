import React, { useState, useEffect } from "react";



const CustomerDetailsForm = ({ loanDetails, handleInputChange }) => {

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
    
    useEffect(() => {
        const combinedAddress = combineAddress();
        handleInputChange({
            target: { name: "customerFullAddress", value: combinedAddress },
        });
    }, [fullAddress, handleInputChange]);
    
    
    
     // Handle changes to individual fields in fullAddress
     const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setFullAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    
    
    
    return(
    <div className="p-6 bg-white shadow-md rounded-lg">
        <h3 className="text-xl font-semibold mb-6 text-center">Customer Details</h3>
        
        {/* Full Form in 3 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Customer Name Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Customer Name</label>
                <input
                    type="text"
                    name="customerName"
                    value={loanDetails.customerName || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Customer Name"
                />
            </div>
            
            {/* Phone Number Primary */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Phone Number Primary</label>
                <input
                    type="text"
                    name="customerPhonePrimary"
                    value={loanDetails.customerPhonePrimary || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Primary Phone Number"
                />
            </div>
            
            {/* Phone Number 2 (Optional) */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Phone Number 2 (Optional)</label>
                <input
                    type="text"
                    name="customerPhoneSecondary"
                    value={loanDetails.customerPhoneSecondary || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Secondary Phone Number"
                />
            </div>

            {/* Aadhaar Number */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Aadhaar Number</label>
                <input
                    type="text"
                    name="customerAadhaarNumber"
                    value={loanDetails.customerAadhaarNumber || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Aadhaar Number"
                />
            </div>

            {/* Father's Name */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Father's Name</label>
                <input
                    type="text"
                    name="customerFatherName"
                    value={loanDetails.customerFatherName || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Father's Name"
                />
            </div>

           
               
           

            {/* Full Address */}
            <div className="mb-4 col-span-3">
                <label className="block text-sm font-medium">Address</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* House No. */}
                    <div className="mb-4">
                        <label className="block text-xs font-medium">House No.</label>
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
                        <label className="block text-xs font-medium">Landmark</label>
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
                        <label className="block text-xs font-medium">Street</label>
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
                        <label className="block text-xs font-medium">Address Line 1</label>
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
                        <label className="block text-xs font-medium">Address Line 2</label>
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
                        <label className="block text-xs font-medium">City</label>
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
                        <label className="block text-xs font-medium">State</label>
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
                        <label className="block text-xs font-medium">Pin Code</label>
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
    </div>
);
}
export default CustomerDetailsForm;
