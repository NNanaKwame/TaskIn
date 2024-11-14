// api.js
const BASE_URL = 'http://localhost:5000'; // Replace with your backend URL

// Task APIs

// Get all tasks
export const getTasks = async () => {
    try {
        const response = await fetch(`${BASE_URL}/tasks`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
};

// Get a specific task by ID
export const getTask = async (taskId) => {
    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching task ${taskId}:`, error);
        throw error;
    }
};

// Create a new task
export const createTask = async (taskData) => {
    try {
        const response = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
};

// Update a task
export const updateTask = async (taskId, updatedData) => {
    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        return await response.json();
    } catch (error) {
        console.error(`Error updating task ${taskId}:`, error);
        throw error;
    }
};

// Delete a task
export const deleteTask = async (taskId) => {
    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
        });
        return await response.json();
    } catch (error) {
        console.error(`Error deleting task ${taskId}:`, error);
        throw error;
    }
};

// Highlight APIs

// Get all highlights
export const getHighlights = async () => {
    try {
        const response = await fetch(`${BASE_URL}/highlights`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching highlights:", error);
        throw error;
    }
};

// Add a new highlight
export const addHighlight = async (highlightData) => {
    try {
        const response = await fetch(`${BASE_URL}/highlights`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(highlightData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error adding highlight:", error);
        throw error;
    }
};

// Delete a specific highlight by ID
export const deleteHighlight = async (highlightId) => {
    try {
        const response = await fetch(`${BASE_URL}/highlights/${highlightId}`, {
            method: 'DELETE',
        });
        return await response.json();
    } catch (error) {
        console.error(`Error deleting highlight ${highlightId}:`, error);
        throw error;
    }
};
