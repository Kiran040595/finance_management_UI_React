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



                <select
                    name="vehicleModelYear"
                    value={loanDetails.vehicleModelYear || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                >
                    <option value="" disabled>
                        Select Model Year
                    </option>
                    {Array.from({ length: 51 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
            </select>
            </div>

            {/* Insurance Expiry Date */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Insurance Expiry Date</label>
                <input
                    type="date"
                    name="vehicleInsuranceExpiryDate"
                    value={loanDetails.vehicleInsuranceExpiryDate || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                />
            </div>
        </div>
    </div>
);

export default VehicleDetailsForm;
