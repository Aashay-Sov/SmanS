const API_URL = 'http://127.0.0.1:5000/api/students';

// Function to fetch students from the API
async function fetchStudents() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Select the student-list-body (the table body)
        const tableBody = document.getElementById('student-list-body');
        
        // Clear any existing content from the table body
        tableBody.innerHTML = '';

        // Loop through the list of student objects
        data.students.forEach(student => {
            // Create a new table row (<tr>)
            const row = document.createElement('tr');
            
            // Populate it with <td> cells for student.id, student.name, and student.grade
            const idCell = document.createElement('td');
            idCell.textContent = student.id;
            row.appendChild(idCell);
            
            const nameCell = document.createElement('td');
            nameCell.textContent = student.name;
            row.appendChild(nameCell);
            
            const gradeCell = document.createElement('td');
            gradeCell.textContent = student.grade;
            row.appendChild(gradeCell);
            
            // Create a final <td> that contains a 'Delete' button
            const actionCell = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.dataset.id = student.id;
            actionCell.appendChild(deleteBtn);
            row.appendChild(actionCell);
            
            // Append the new row to the table body
            tableBody.appendChild(row);
        });

        return data;
    } catch (error) {
        console.error('Error fetching students:', error);
        return null;
    }
}

// Event listener to load students when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchStudents();

    // Event listener for delete button clicks
    const tableBody = document.getElementById('student-list-body');
    tableBody.addEventListener('click', async (event) => {
        // Check if the clicked element has the class delete-btn
        if (event.target.classList.contains('delete-btn')) {
            // Get the studentId from its data-id attribute
            const studentId = event.target.dataset.id;

            if (!studentId) {
                alert('Invalid student ID');
                return;
            }

            if (!confirm('Are you sure you want to delete this student?')) {
                return;
            }

            try {
                // Make a DELETE request to ${API_URL}/${studentId}
                const response = await fetch(`${API_URL}/${studentId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // After the request is successful, call fetchStudents() to refresh the list
                fetchStudents();
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Failed to delete student');
            }
        }
    });

    // Event listener to the add-student-form
    const form = document.getElementById('add-student-form');
    form.addEventListener('submit', async (event) => {
        // Prevent the form's default page reload
        event.preventDefault();

        // Get the values from the student-name-input and grade-input
        const nameInput = document.getElementById('student-name-input');
        const gradeInput = document.getElementById('grade-input');

        const name = nameInput.value.trim();
        const grade = gradeInput.value.trim();

        if (!name || !grade) {
            alert('Please fill in all fields');
            return;
        }

        // Create a studentData object with name and grade
        const studentData = {
            name: name,
            grade: grade
        };

        try {
            // Make a POST request to API_URL
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // After the request is successful, clear the input fields
            nameInput.value = '';
            gradeInput.value = '';

            // Call fetchStudents() again to refresh the list
            fetchStudents();
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Failed to add student');
        }
    });
});