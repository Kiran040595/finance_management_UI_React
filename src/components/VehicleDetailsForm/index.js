const VehicleDetailsForm = ({ loanDetails, handleInputChange }) => (
    <div className="p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">Vehicle Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Vehicle Number */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Vehicle Number</label>
                <input
                    type="text"
                    name="vehicleNumber"
                    value={loanDetails.vehicleNumber || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Vehicle Number"
                />
            </div>

            {/* Model Year */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Model Year</label>
                <input
                    type="text"
                    name="modelYear"
                    value={loanDetails.modelYear || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Model Year"
                />
            </div>

            {/* Insurance Expiry Date */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Insurance Expiry Date</label>
                <input
                    type="date"
                    name="insuranceExpiryDate"
                    value={loanDetails.insuranceExpiryDate || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                />
            </div>
        </div>
    </div>
);

export default VehicleDetailsForm;
