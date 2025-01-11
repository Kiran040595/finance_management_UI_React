import React, { useState } from "react";
import axios from "axios"; 
import LoanDetailsForm from "../LoanDetailsForm";
import CustomerDetailsForm from "../CustomerDetailsForm";
import VehicleDetailsForm from "../VehicleDetailsForm";
import GuarantorDetailsForm from "../GuarantorDetailsForm";

const AddLoan = ({ loanDetails, handleInputChange, onSave, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1); // Tracks the current step
    const [isLoading, setIsLoading] = useState(false);  // State to handle loading during API call


    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    // Function to handle the final submission (onSave)
    const handleSaveLoan = async () => {
        try {
            setIsLoading(true);  // Start loading state
            const response = await axios.post("http://localhost:8081/api/loan", loanDetails);
            if (response.status === 200) {
                alert("Loan saved successfully!");
                onClose();  // Close the form after successful save
            }
        } catch (error) {
            console.error("Error saving loan:", error);
            alert("Failed to save the loan. Please try again.");
        } finally {
            setIsLoading(false);  // Stop loading state
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md w-full w-[80%] h-[90vh] overflow-y-auto pt-12">
                <h2 className="text-xl font-bold mb-4">Add New Loan</h2>

                {/* Conditional Rendering of Forms Based on Current Step */}
                {currentStep === 1 && (
                    <LoanDetailsForm
                        loanDetails={loanDetails}
                        handleInputChange={handleInputChange}
                    />
                )}
                {currentStep === 2 && (
                    <CustomerDetailsForm
                        loanDetails={loanDetails}
                        handleInputChange={handleInputChange}
                    />
                )}
                {currentStep === 3 && (
                    <VehicleDetailsForm
                        loanDetails={loanDetails}
                        handleInputChange={handleInputChange}
                    />
                )}
                {currentStep === 4 && (
                    <GuarantorDetailsForm
                        loanDetails={loanDetails}
                        handleInputChange={handleInputChange}
                    />
                )}

                <div className="flex justify-between mt-4">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded"
                        onClick={onClose} // Close the modal
                    >
                        Close
                    </button>

                    {/* Navigation Buttons */}
                    <div>
                        {currentStep > 1 && (
                            <button
                                className="px-4 py-2 bg-gray-300 rounded mr-2"
                                onClick={prevStep} // Go back to previous step
                            >
                                Back
                            </button>
                        )}
                        {currentStep < 4 ? (
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={nextStep} // Go to next step
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded"
                                onClick={handleSaveLoan}  // Trigger handleSaveLoan on Save
                                disabled={isLoading}  // Disable button if loading
                            >
                                {isLoading ? "Saving..." : "Save"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLoan;



