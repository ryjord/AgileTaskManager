
// Import 
import Modal from "@/components/Modal";
import { useCreateProjectMutation } from "@/state/api";
import React, { useState } from "react";
import { formatISO } from "date-fns";

//Define the props type for the ModalNewProject component
type NewProjectProps = {
    isOpen: boolean;
    onClose: () => void;
};

/**
 * ModalNewProject component
 */
const ModalNewProject = ({ isOpen, onClose }: NewProjectProps) => {
    // Define state variables
    const [createProject, { isLoading }] = useCreateProjectMutation();

    // default values
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    
    // Handle form submission
    const handleSubmit = async () => {
        if (!projectName || !startDate || !endDate) return;

        const formattedStartDate = formatISO(new Date(startDate), {
            representation: "complete",
        });

        const formattedEndDate = formatISO(new Date(endDate), {
            representation: "complete",
        });

        await createProject({
            name: projectName,
            description,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        });
    };


   // Check if the form is valid
    const isFormValid = () => {
        return projectName && description && startDate && endDate;
    };

    // Define the styles for the form inputs
    const inputStyles =
        "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    // Render the ModalNewProject component
    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
        <form className="mt-4 space-y-6"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
            <input type="text" className={inputStyles} placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)}/>
            <textarea className={inputStyles} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                <input type="date" className={inputStyles} value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                <input type="date" className={inputStyles} value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
            </div>
            <button type="submit" className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-red-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 ${ !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""}`} disabled={!isFormValid() || isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
            </button>
        </form>
        </Modal>
    );
};

// Export the ModalNewProject component
export default ModalNewProject;