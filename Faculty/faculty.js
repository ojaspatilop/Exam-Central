// Add a module-level variable to store faculty information
let facultyData = {
    department: null,
    name: null,
    id: null
};

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');

    if (!token || userRole !== 'faculty') {
        window.location.href = '/Login/Login.html';
        return;
    }
    
    // Load faculty info immediately
    loadFacultyInfo().then(() => {
        console.log('Faculty Department (from module variable):', facultyData.department);
    });

    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show corresponding section
            const sectionId = item.dataset.section;
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                    document.getElementById('section-title').textContent = 
                        item.querySelector('span').textContent;
                }
            });

            // Load section-specific data if needed
            if (sectionId === 'students') {
                loadStudentData();
            } else if (sectionId === 'profile') {
                loadProfileData();
            } else if (sectionId === 'results') {
                // Reset filters when section is opened
                if (document.getElementById('resultsSemester')) {
                    document.getElementById('resultsSemester').value = '';
                }
                if (document.getElementById('resultsSubject')) {
                    document.getElementById('resultsSubject').innerHTML = '<option value="">All Subjects</option>';
                }
                loadResultsAnalysis();
            } else if (sectionId === 'attendance') {
                initializeAttendanceSection();
            } else if (sectionId === 'supervision') {
                loadSupervisionAllocations();
            }
        });
    });

    // Faculty dropdown
    const facultyAvatar = document.getElementById('facultyAvatar');
    const facultyDropdown = document.getElementById('facultyDropdown');

    facultyAvatar.addEventListener('click', (e) => {
        e.stopPropagation();
        facultyDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        facultyDropdown.classList.remove('show');
    });

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userRole');
        window.location.href = '/Login/Login.html';
    });

    // Add event listener for semester dropdown in results section
    document.getElementById('resultsSemester')?.addEventListener('change', (e) => {
        populateSubjectsDropdown(e.target.value);
        loadResultsAnalysis(); // Reload data when semester changes
    });
    
    // Add event listener for subject dropdown in results section
    document.getElementById('resultsSubject')?.addEventListener('change', () => {
        loadResultsAnalysis(); // Reload data when subject changes
    });
    
    // Add event listener for attendance semester selection
    document.getElementById('attendanceSemester')?.addEventListener('change', function() {
        populateAttendanceSubjectDropdown(this.value);
    });
    
    // Add event listener for marks semester selection
    document.getElementById('semesterSelect')?.addEventListener('change', function() {
        populateMarksSubjectDropdown(this.value);
    });
    
    // Add event listener for the save marks button
    const saveMarksBtn = document.getElementById('saveMarksBtn');
    if (saveMarksBtn) {
        saveMarksBtn.addEventListener('click', saveStudentMarks);
    }
    
    // Add event listener for student semester dropdown
    const studentSemesterSelect = document.getElementById('studentSemester');
    if (studentSemesterSelect) {
        studentSemesterSelect.addEventListener('change', function() {
            filterStudents();
        });
    }

    // Add event listener for bulk marks semester selection
    document.getElementById('bulkSemesterSelect')?.addEventListener('change', function() {
        populateBulkSubjectDropdown(this.value);
    });

    // Function to populate bulk marks subject dropdown
    function populateBulkSubjectDropdown(semester) {
        const subjectDropdown = document.getElementById('bulkSubjectSelect');
        if (!subjectDropdown) return;
        
        // Clear existing options
        subjectDropdown.innerHTML = '<option value="">Select Subject</option>';
        
        // Get faculty department from module variable
        const department = facultyData.department;
        console.log('Populating bulk marks subjects for department:', department);
        
        // Get subjects for the selected semester and department
        const subjects = getSubjectsForSemester(semester, department);
        
        // Add subjects to the dropdown
        if (subjects && subjects.length > 0) {
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.code;
                option.textContent = `${subject.code} - ${subject.name}`;
                subjectDropdown.appendChild(option);
            });
        }
    }

    // Handle file selection
    document.getElementById('marksExcelFile')?.addEventListener('change', function(e) {
        const fileName = e.target.files[0]?.name || 'No file selected';
        document.getElementById('selectedFileName').textContent = fileName;
        
        // Enable/disable upload button based on file selection and other required fields
        const uploadBtn = document.getElementById('uploadMarksBtn');
        const semester = document.getElementById('bulkSemesterSelect').value;
        const subject = document.getElementById('bulkSubjectSelect').value;
        
        if (uploadBtn) {
            uploadBtn.disabled = !(e.target.files.length > 0 && semester && subject);
        }
    });

    // Enable/disable upload button when semester or subject changes
    document.getElementById('bulkSemesterSelect')?.addEventListener('change', updateUploadButtonState);
    document.getElementById('bulkSubjectSelect')?.addEventListener('change', updateUploadButtonState);

    function updateUploadButtonState() {
        const uploadBtn = document.getElementById('uploadMarksBtn');
        const fileInput = document.getElementById('marksExcelFile');
        const semester = document.getElementById('bulkSemesterSelect').value;
        const subject = document.getElementById('bulkSubjectSelect').value;
        
        if (uploadBtn) {
            uploadBtn.disabled = !(fileInput.files.length > 0 && semester && subject);
        }
    }

    // Handle template download
    document.getElementById('downloadTemplateBtn')?.addEventListener('click', function() {
        downloadMarksTemplate();
    });

    // Function to download marks template
    function downloadMarksTemplate() {
        const semester = document.getElementById('bulkSemesterSelect').value;
        const subject = document.getElementById('bulkSubjectSelect').value;
        
        if (!semester || !subject) {
            showToast('Please select both semester and subject first', 'warning');
            return;
        }
        
        // In a real implementation, you would generate an Excel file
        // For this example, we'll create a CSV file
        const headers = ['Seat Number', 'Student Name', 'Internal (25)', 'Semester (75)', 'Practical (25)', 'Term Work (25)'];
        const csvContent = headers.join(',') + '\n12001,John Doe,,,,,\n12002,Jane Smith,,,,,';
        
        // Create a blob and download it
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `marks_template_${subject}_sem${semester}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Template downloaded successfully', 'success');
    }

    // Handle marks upload
    document.getElementById('uploadMarksBtn')?.addEventListener('click', function() {
        uploadBulkMarks();
    });

    // Function to upload bulk marks
    async function uploadBulkMarks() {
        const fileInput = document.getElementById('marksExcelFile');
        const semester = document.getElementById('bulkSemesterSelect').value;
        const subject = document.getElementById('bulkSubjectSelect').value;
        
        if (!fileInput.files.length || !semester || !subject) {
            showToast('Please select a file, semester, and subject', 'warning');
            return;
        }
        
        const file = fileInput.files[0];
        
        // Show loading state
        const uploadBtn = document.getElementById('uploadMarksBtn');
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        uploadBtn.disabled = true;
        
        try {
            // In a real implementation, you would use a library like SheetJS to parse Excel files
            // For this example, we'll simulate the process
            
            // Create FormData to send the file
            const formData = new FormData();
            formData.append('file', file);
            formData.append('semester', semester);
            formData.append('subject', subject);
            
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('No token found for authentication');
            }
            
            // Send the file to the server
            const response = await fetch('http://localhost:5000/api/faculty/marks/bulk', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Failed to upload marks: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Show results
                displayUploadResults(data.results);
                showToast('Marks uploaded successfully', 'success');
            } else {
                throw new Error(data.message || 'Failed to upload marks');
            }
        } catch (error) {
            console.error('Error uploading marks:', error);
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            // Reset button state
            uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Marks';
            uploadBtn.disabled = false;
        }
    }

    // Function to display upload results
    function displayUploadResults(results) {
        const resultsContainer = document.getElementById('uploadResults');
        const resultsBody = document.getElementById('uploadResultsBody');
        
        if (!resultsContainer || !resultsBody) return;
        
        // Show results container
        resultsContainer.style.display = 'block';
        
        // Clear previous results
        resultsBody.innerHTML = '';
        
        // Update summary counts
        document.getElementById('totalRecords').textContent = results.total || 0;
        document.getElementById('successfulRecords').textContent = results.successful || 0;
        document.getElementById('failedRecords').textContent = results.failed || 0;
        
        // Add rows for each record
        if (results.records && results.records.length > 0) {
            results.records.forEach(record => {
                const row = document.createElement('tr');
                
                const seatCell = document.createElement('td');
                seatCell.textContent = record.seatNumber;
                
                const nameCell = document.createElement('td');
                nameCell.textContent = record.studentName;
                
                const statusCell = document.createElement('td');
                statusCell.className = `status-cell ${record.success ? 'success' : 'error'}`;
                statusCell.innerHTML = record.success ? 
                    '<i class="fas fa-check-circle"></i> Success' : 
                    '<i class="fas fa-times-circle"></i> Failed';
                
                const messageCell = document.createElement('td');
                messageCell.textContent = record.message || '';
                
                row.appendChild(seatCell);
                row.appendChild(nameCell);
                row.appendChild(statusCell);
                row.appendChild(messageCell);
                
                resultsBody.appendChild(row);
            });
        } else {
            // Show empty state
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 4;
            emptyCell.textContent = 'No results to display';
            emptyCell.style.textAlign = 'center';
            emptyRow.appendChild(emptyCell);
            resultsBody.appendChild(emptyRow);
        }
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Tab switching in marks section
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding tab content
            const tabId = btn.dataset.tab;
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Add event listener for search button
    const searchStudentsBtn = document.getElementById('searchStudentsBtn');
    if (searchStudentsBtn) {
        searchStudentsBtn.addEventListener('click', filterStudents);
    }
    
    // Add event listener for search input (to search as you type)
    const studentSearch = document.getElementById('studentSearch');
    if (studentSearch) {
        studentSearch.addEventListener('input', filterStudents);
    }
});

async function loadFacultyInfo() {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch('http://localhost:5000/api/faculty/info', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch faculty info');
        }

        const data = await response.json();
        
        if (data.success) {
            // Update the module-level facultyData
            facultyData.name = data.name;
            facultyData.department = data.department;
            facultyData.id = data.id;
            
            // Update UI
            document.querySelector('.faculty-name').textContent = `Welcome, ${data.name}`;
            document.getElementById('facultyAvatar').src = 
                `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=4361ee&color=fff`;
            
            // Log faculty department if available
            if (data.department) {
                console.log('Faculty Department:', data.department);
            }
            
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading faculty information:', error);
        if (error.message.includes('Invalid token')) {
            // Redirect to login if token is invalid
            window.location.href = '/Login/Login.html';
        }
    }
}

async function loadProfileData() {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        // Fetch faculty profile data
        const response = await fetch('http://localhost:5000/api/faculty/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch profile data');
        }

        // Update profile information
        const { personalInfo, professionalInfo, otherDetails } = data;

        // Update profile header
        document.querySelector('.profile-name').textContent = `Dr. ${personalInfo.name}`;
        document.querySelector('.profile-designation').textContent = 
            `${professionalInfo.designation}, ${professionalInfo.department}`;
        document.querySelector('.profile-avatar img').src = 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.name)}&background=4361ee&color=fff&size=120`;

        // Update personal information
        document.getElementById('fullName').textContent = personalInfo.name;
        document.getElementById('email').textContent = personalInfo.email;
        document.getElementById('contact').textContent = personalInfo.contact;
        document.getElementById('address').textContent = personalInfo.address;
        document.getElementById('age').textContent = personalInfo.age;
        document.getElementById('gender').textContent = personalInfo.gender;

        // Update professional information
        document.getElementById('department').textContent = professionalInfo.department;
        document.getElementById('designation').textContent = professionalInfo.designation;
        document.getElementById('specialization').textContent = professionalInfo.specialization;
        document.getElementById('experience').textContent = `${professionalInfo.experience} years`;
        
        // Log faculty department to console
        console.log('Faculty Department (from profile):', professionalInfo.department);
        
        // Update the module-level facultyData
        facultyData.department = getDepartmentCode(professionalInfo.department);
        console.log('Department Code:', facultyData.department);

    } catch (error) {
        console.error('Error loading profile data:', error);
        alert('Failed to load profile data. Please try logging in again.');
    }
}

// Helper function to get department code from department name
function getDepartmentCode(departmentName) {
    if (!departmentName) return 'CS'; // Default to CS
    
    if (departmentName.includes('Computer Science')) {
        return 'CS';
    } else if (departmentName.includes('Information Technology')) {
        return 'IT';
    } else if (departmentName.includes('AI') || departmentName.includes('Machine Learning')) {
        return 'AIML';
    } else if (departmentName.includes('Electronics')) {
        return 'EC';
    } else if (departmentName.includes('Data Science')) {
        return 'DS';
    }
    
    return 'CS'; // Default to CS if no match
}

// Function to populate subjects dropdown based on semester
function populateSubjectsDropdown(semester) {
    const subjectsDropdown = document.getElementById('resultsSubject');
    subjectsDropdown.innerHTML = '<option value="">All Subjects</option>';
    
    if (!semester) return;
    
    // Get faculty department from module variable
    const department = facultyData.department;
    console.log('Populating subjects for department:', department);
    
    // Get subjects for the selected semester and department
    const semesterSubjects = getSubjectsForSemester(semester, department);
    
    if (semesterSubjects && semesterSubjects.length > 0) {
        semesterSubjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.code;
            option.textContent = `${subject.code} - ${subject.name}`;
            subjectsDropdown.appendChild(option);
        });
    }
}

// Helper function to get subjects for a semester based on faculty department
function getSubjectsForSemester(semester, department = null) {
    // If department is not provided, use the module-level variable
    if (!department) {
        department = facultyData.department || 'CS'; // Default to CS if not found
    }
    
    console.log('Getting subjects for department:', department, 'semester:', semester);
    
    // Use the subjects data from the shared/subjects.js file
    if (semester && subjectsData[department] && subjectsData[department][semester]) {
        return subjectsData[department][semester];
    } else if (department && subjectsData[department]) {
        // If no semester specified, return all subjects for the department
        const allSubjects = [];
        for (const sem in subjectsData[department]) {
            allSubjects.push(...subjectsData[department][sem]);
        }
        return allSubjects;
    }
    
    // Fallback to empty array if no subjects found
    return [];
}

// Also update the attendance subject dropdown with department-specific subjects
function populateAttendanceSubjectDropdown(semester) {
    const subjectDropdown = document.getElementById('attendanceSubject');
    if (!subjectDropdown) return;
    
    // Clear existing options
    subjectDropdown.innerHTML = '<option value="">Select Subject</option>';
    
    // Get faculty department from module variable
    const department = facultyData.department;
    console.log('Populating attendance subjects for department:', department);
    
    // Get subjects for the selected semester and department
    const subjects = getSubjectsForSemester(semester, department);
    
    // Add subjects to the dropdown
    if (subjects && subjects.length > 0) {
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.code;
            option.textContent = `${subject.code} - ${subject.name}`;
            subjectDropdown.appendChild(option);
        });
    }
}

// Update the marks section subject dropdown as well
function populateMarksSubjectDropdown(semester) {
    const subjectDropdown = document.getElementById('subjectSelect');
    if (!subjectDropdown) return;
    
    // Clear existing options
    subjectDropdown.innerHTML = '<option value="">Select Subject</option>';
    
    // Get faculty department from module variable
    const department = facultyData.department;
    console.log('Populating marks subjects for department:', department);
    
    // Get subjects for the selected semester and department
    const subjects = getSubjectsForSemester(semester, department);
    
    // Add subjects to the dropdown
    if (subjects && subjects.length > 0) {
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.code;
            option.textContent = `${subject.code} - ${subject.name}`;
            subjectDropdown.appendChild(option);
        });
    }
}

// Student Section Functionality
function initializeStudentSection() {
    // Set up event listeners for student section
    setupStudentEventListeners();
    
    // Load initial student data
    loadStudentData();
}

function setupStudentEventListeners() {
    // Search button
    document.getElementById('searchStudentsBtn')?.addEventListener('click', filterStudents);
    
    // Filter dropdowns
    document.getElementById('studentBranch')?.addEventListener('change', filterStudents);
    document.getElementById('studentSemester')?.addEventListener('change', filterStudents);
    document.getElementById('studentSubject')?.addEventListener('change', filterStudents);
    
    // Export buttons
    document.getElementById('exportExcelBtn')?.addEventListener('click', () => exportStudentList('excel'));
    document.getElementById('exportPdfBtn')?.addEventListener('click', () => exportStudentList('pdf'));
    
    // Pagination buttons
    document.getElementById('prevPageBtn')?.addEventListener('click', () => changePage('prev'));
    document.getElementById('nextPageBtn')?.addEventListener('click', () => changePage('next'));
    
    // Modal close buttons
    document.getElementById('closeProfileBtn')?.addEventListener('click', closeStudentProfile);
    document.getElementById('closeModalBtn')?.addEventListener('click', closeStudentProfile);
    
    // Tab buttons in student profile modal
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            showStudentTab(tabId);
        });
    });
    
    // Action buttons in modal
    document.getElementById('manageAttendanceBtn')?.addEventListener('click', manageAttendance);
    document.getElementById('manageMarksBtn')?.addEventListener('click', manageMarks);

    // Update search functionality
    document.getElementById('searchStudentsBtn')?.addEventListener('click', filterStudents);
    
    // Add input event for search field (optional, for real-time search)
    document.getElementById('studentSearch')?.addEventListener('input', debounce(filterStudents, 300));
    
    // Update semester filter
    document.getElementById('studentSemester')?.addEventListener('change', filterStudents);
}

// Add these global variables at the top of your file
let currentPage = 1;
const itemsPerPage = 10;
let filteredStudents = [];
let originalStudents = []; // Store the original student list

// Replace the mock data section with real data fetching
async function loadStudentData() {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        console.log('Token:', token ? 'Present' : 'Missing');

        // Mock data for now - replace with actual API call
        const response = await fetch('http://localhost:5000/api/faculty/my-students', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Received data:', data);

        if (data.success) {
            originalStudents = data.students; // Store original list
            filteredStudents = data.students; // Initialize filtered list
            updateStudentStats();
            renderStudentTable();
            updatePagination();
            
            // Add event listeners for pagination buttons
            setupPaginationListeners();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading student data:', error);
    }
}

// Add this new function to set up pagination button listeners
function setupPaginationListeners() {
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));
    }
}

// Add this function to handle student search
function filterStudents() {
    const searchInput = document.getElementById('studentSearch');
    const semesterSelect = document.getElementById('studentSemester');
    
    let filtered = [...originalStudents];
    
    // Filter by search term if provided
    if (searchInput && searchInput.value.trim() !== '') {
        const searchTerm = searchInput.value.toLowerCase().trim();
        filtered = filtered.filter(student => 
            (student.name && student.name.toLowerCase().includes(searchTerm)) || 
            (student.seatNo && student.seatNo.toString().includes(searchTerm))
        );
    }
    
    // Filter by semester if selected
    if (semesterSelect && semesterSelect.value) {
        filtered = filtered.filter(student => 
            student.semester && student.semester.toString() === semesterSelect.value
        );
    }
    
    filteredStudents = filtered;
    currentPage = 1; // Reset to first page when filtering
    updateStudentStats();
    renderStudentTable();
    updatePagination();
}

// Update the student stats calculation
function updateStudentStats() {
    if (!filteredStudents.length) return;

    document.getElementById('studentsTotalCount').textContent = filteredStudents.length;
    
    const activeStudents = filteredStudents.filter(s => s.attendance.overall >= 75).length;
    document.getElementById('activeStudents').textContent = activeStudents;
    
    const defaulters = filteredStudents.filter(s => s.attendance.overall < 75).length;
    document.getElementById('defaulterStudents').textContent = defaulters;
    
    const failedStudents = filteredStudents.filter(s => s.performance < 40).length;
    document.getElementById('failedStudents').textContent = failedStudents;
}

// Function to render student table
function renderStudentTable() {
    const tableBody = document.getElementById('studentTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Calculate start and end indices for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredStudents.length);
    
    // If no students found
    if (filteredStudents.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-cell">
                    <div class="empty-state">
                        <i class="fas fa-user-graduate"></i>
                        <p>No students found</p>
                        <span>Try adjusting your search or filters</span>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Create table rows for current page
    for (let i = startIndex; i < endIndex; i++) {
        const student = filteredStudents[i];
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${student.seatNo || 'N/A'}</td>
            <td>${student.name || 'N/A'}</td>
            <td>${getBranchName(student.branch) || 'N/A'}</td>
            <td>${student.semester || 'N/A'}</td>
        `;
        
        tableBody.appendChild(row);
    }
    
    // Update pagination
    updatePagination();
}

// Helper functions for class names
function getAttendanceClass(attendance) {
    if (attendance >= 85) return 'excellent';
    if (attendance >= 75) return 'good';
    if (attendance >= 65) return 'warning';
    return 'danger';
}

function getPerformanceClass(performance) {
    if (performance >= 85) return 'excellent';
    if (performance >= 70) return 'good';
    if (performance >= 50) return 'average';
    return 'poor';
}

// Helper function to get branch full name
function getBranchName(branchCode) {
    const branches = {
        'CE': 'Computer Engineering',
        'IT': 'Information Technology',
        'EXTC': 'Electronics & Telecomm'
    };
    return branches[branchCode] || branchCode;
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const pageIndicator = document.getElementById('pageIndicator');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    
    if (!pageIndicator || !prevPageBtn || !nextPageBtn) return;
    
    // Update page indicator
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    
    // Enable/disable previous button
    if (currentPage <= 1) {
        prevPageBtn.disabled = true;
        prevPageBtn.classList.add('disabled');
    } else {
        prevPageBtn.disabled = false;
        prevPageBtn.classList.remove('disabled');
    }
    
    // Enable/disable next button
    if (currentPage >= totalPages) {
        nextPageBtn.disabled = true;
        nextPageBtn.classList.add('disabled');
    } else {
        nextPageBtn.disabled = false;
        nextPageBtn.classList.remove('disabled');
    }
}

function changePage(newPage) {
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderStudentTable();
        updatePagination();
    }
}

// Helper functions for student actions
function viewStudent(studentId) {
    const student = filteredStudents.find(s => s.id === studentId);
    if (student) {
        // Implement your view logic here
        console.log('Viewing student:', student);
    }
}

function editStudent(studentId) {
    const student = filteredStudents.find(s => s.id === studentId);
    if (student) {
        // Implement your edit logic here
        console.log('Editing student:', student);
    }
}

// Make sure to expose the changePage function globally
window.changePage = changePage;
window.viewStudent = viewStudent;
window.editStudent = editStudent;

// Search students
function searchStudents() {
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        filteredStudents = [...mockStudents];
    } else {
        filteredStudents = mockStudents.filter(student => 
            student.name.toLowerCase().includes(searchTerm) || 
            student.seatNo.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    renderStudentTable();
    updatePagination();
}

// Filter students
function filterStudents() {
    const semester = document.getElementById('studentSemester').value;
    const searchQuery = document.getElementById('studentSearch').value.toLowerCase();

    // Start with original list
    filteredStudents = originalStudents;

    // Apply semester filter if selected
    if (semester) {
        filteredStudents = filteredStudents.filter(student => 
            student.semester.toString() === semester
        );
    }

    // Apply search filter if there's a query
    if (searchQuery) {
        filteredStudents = filteredStudents.filter(student => 
            student.name.toLowerCase().includes(searchQuery) ||
            student.seatNo.toString().includes(searchQuery)
        );
    }

    // Reset to page 1 when filtering
    currentPage = 1;
    
    // Update the UI
    updateStudentStats();
    renderStudentTable();
    updatePagination();
}

// Add a new function to update the subject dropdown
function updateSubjectDropdown(branch, semester) {
    const subjectDropdown = document.getElementById('studentSubject');
    if (!subjectDropdown) return;
    
    // Clear existing options except the first one
    while (subjectDropdown.options.length > 1) {
        subjectDropdown.remove(1);
    }
    
    // Get subjects for the selected branch and semester
    const subjects = getSubjectsByBranchAndSemester(branch, semester);
    
    // Add new options
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.code;
        option.textContent = `${subject.code} - ${subject.name}`;
        subjectDropdown.appendChild(option);
    });
}

// Export student list
function exportStudentList(format) {
    alert(`Exporting student list as ${format.toUpperCase()}...`);
    // In a real application, this would generate and download the file
}

// View student profile
function viewStudentProfile(studentId) {
    console.log('Viewing student with ID:', studentId);
    
    // Debug all students to find the right ID property
    console.log('All students:', filteredStudents);
    
    // Try to find the student using different possible ID properties
    let student = null;
    
    // First try with _id
    student = filteredStudents.find(s => s._id === studentId);
    
    // If not found, try with id
    if (!student) {
        student = filteredStudents.find(s => s.id === studentId);
    }
    
    // If still not found, try with studentId
    if (!student) {
        student = filteredStudents.find(s => s.studentId === studentId);
    }
    
    // If still not found, try with seatNo (as a fallback)
    if (!student) {
        student = filteredStudents.find(s => s.seatNo === studentId);
    }
    
    // If still not found, try finding by index if studentId is a number
    if (!student && !isNaN(studentId)) {
        const index = parseInt(studentId);
        if (index >= 0 && index < filteredStudents.length) {
            student = filteredStudents[index];
        }
    }
    
    if (!student) {
        console.error('Student not found with ID:', studentId);
        return;
    }
    
    console.log('Found student:', student);
    
    // Set student profile data
    document.getElementById('studentProfileImage').src = 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=4361ee&color=fff`;
    document.getElementById('studentProfileName').textContent = student.name;
    document.getElementById('studentProfileInfo').textContent = 
        `${getBranchName(student.branch)} - Semester ${student.semester}`;
    
    // Basic info tab
    document.getElementById('studentFullName').textContent = student.name || '';
    document.getElementById('studentSeatNo').textContent = student.seatNo || '';
    document.getElementById('studentEmail').textContent = student.email || '';
    document.getElementById('studentPhone').textContent = student.phone || '';
    document.getElementById('studentDOB').textContent = student.dob ? formatDate(student.dob) : '';
    document.getElementById('studentBranchInfo').textContent = getBranchName(student.branch);
    document.getElementById('studentSemesterInfo').textContent = `Semester ${student.semester}`;
    document.getElementById('studentAdmissionYear').textContent = student.admissionYear || '';
    document.getElementById('studentCGPA').textContent = student.cgpa || '';
    document.getElementById('studentAddress').textContent = student.address || '';
    document.getElementById('studentGuardianName').textContent = student.guardianName || '';
    document.getElementById('studentGuardianPhone').textContent = student.guardianPhone || '';
    
    // Attendance tab
    const theoryAttendance = student.attendance?.theory || 0;
    const practicalAttendance = student.attendance?.practical || 0;
    const overallAttendance = student.attendance?.overall || 0;
    
    document.getElementById('theoryAttendance').textContent = `${theoryAttendance}%`;
    document.getElementById('practicalAttendance').textContent = `${practicalAttendance}%`;
    document.getElementById('overallAttendance').textContent = `${overallAttendance}%`;
    
    const attendanceStatus = document.getElementById('attendanceStatus');
    if (overallAttendance >= 85) {
        attendanceStatus.textContent = 'Excellent';
        attendanceStatus.className = 'status-badge good';
    } else if (overallAttendance >= 75) {
        attendanceStatus.textContent = 'Satisfactory';
        attendanceStatus.className = 'status-badge good';
    } else if (overallAttendance >= 65) {
        attendanceStatus.textContent = 'Warning';
        attendanceStatus.className = 'status-badge warning';
    } else {
        attendanceStatus.textContent = 'Defaulter';
        attendanceStatus.className = 'status-badge danger';
    }
    
    // Initialize charts
    initializeAttendanceChart(student);
    initializePerformanceChart(student);
    
    // Show the modal
    document.getElementById('studentProfileModal').classList.add('show');
    
    // Reset to first tab
    showStudentTab('basic-info');
}

// Close student profile modal
function closeStudentProfile() {
    document.getElementById('studentProfileModal').classList.remove('show');
}

// Show student tab
function showStudentTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.student-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabId).classList.add('active');
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        }
    });
}

// Initialize attendance chart
function initializeAttendanceChart(student) {
    const ctx = document.getElementById('studentAttendanceChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.attendanceChart) {
        window.attendanceChart.destroy();
    }
    
    window.attendanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Theory', 'Practical', 'Overall'],
            datasets: [{
                label: 'Attendance Percentage',
                data: [student.attendance.theory, student.attendance.practical, student.attendance.overall],
                backgroundColor: [
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(40, 199, 111, 0.7)',
                    'rgba(255, 159, 67, 0.7)'
                ],
                borderColor: [
                    'rgba(67, 97, 238, 1)',
                    'rgba(40, 199, 111, 1)',
                    'rgba(255, 159, 67, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    });
    
    // Populate subject attendance table
    const subjectAttendanceBody = document.getElementById('subjectAttendanceBody');
    subjectAttendanceBody.innerHTML = '';
    
    // Mock subject attendance data
    const subjects = [
        {
            name: 'CS301 - Data Structures',
            theoryAttended: 32,
            theoryTotal: 40,
            practicalAttended: 12,
            practicalTotal: 15
        },
        {
            name: 'CS302 - Database Management',
            theoryAttended: 35,
            theoryTotal: 40,
            practicalAttended: 14,
            practicalTotal: 15
        },
        {
            name: 'CS303 - Computer Networks',
            theoryAttended: 30,
            theoryTotal: 40,
            practicalAttended: 13,
            practicalTotal: 15
        }
    ];
    
    subjects.forEach(subject => {
        const theoryPercentage = Math.round((subject.theoryAttended / subject.theoryTotal) * 100);
        const practicalPercentage = Math.round((subject.practicalAttended / subject.practicalTotal) * 100);
        const overallPercentage = Math.round(((subject.theoryAttended + subject.practicalAttended) / 
                                             (subject.theoryTotal + subject.practicalTotal)) * 100);
        
        let statusClass = 'good';
        let statusText = 'Good';
        
        if (overallPercentage < 75) {
            statusClass = 'danger';
            statusText = 'Defaulter';
        } else if (overallPercentage < 85) {
            statusClass = 'warning';
            statusText = 'Warning';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${subject.name}</td>
            <td>${subject.theoryAttended}/${subject.theoryTotal}</td>
            <td>${theoryPercentage}%</td>
            <td>${subject.practicalAttended}/${subject.practicalTotal}</td>
            <td>${practicalPercentage}%</td>
            <td>${overallPercentage}%</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        `;
        
        subjectAttendanceBody.appendChild(row);
    });

}

// Initialize performance chart
function initializePerformanceChart(student) {
    const ctx = document.getElementById('studentPerformanceChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.performanceChart) {
        window.performanceChart.destroy();
    }
    
    // Mock performance data
    const subjects = ['CS301', 'CS302', 'CS303'];
    const internalMarks = [22, 18, 20];
    const semesterMarks = [65, 58, 62];
    const practicalMarks = [22, 20, 21];
    const termWorkMarks = [23, 21, 22];
    
    window.performanceChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: subjects,
            datasets: [
                {
                    label: 'Internal (25)',
                    data: internalMarks.map(mark => (mark / 25) * 100),
                    backgroundColor: 'rgba(67, 97, 238, 0.2)',
                    borderColor: 'rgba(67, 97, 238, 1)',
                    pointBackgroundColor: 'rgba(67, 97, 238, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(67, 97, 238, 1)'
                },
                {
                    label: 'Semester (75)',
                    data: semesterMarks.map(mark => (mark / 75) * 100),
                    backgroundColor: 'rgba(40, 199, 111, 0.2)',
                    borderColor: 'rgba(40, 199, 111, 1)',
                    pointBackgroundColor: 'rgba(40, 199, 111, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(40, 199, 111, 1)'
                },
                {
                    label: 'Practical (25)',
                    data: practicalMarks.map(mark => (mark / 25) * 100),
                    backgroundColor: 'rgba(255, 159, 67, 0.2)',
                    borderColor: 'rgba(255, 159, 67, 1)',
                    pointBackgroundColor: 'rgba(255, 159, 67, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255, 159, 67, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
    
    // Populate subject marks table
    const subjectMarksBody = document.getElementById('subjectMarksBody');
    subjectMarksBody.innerHTML = '';
    
    const subjectNames = ['CS301 - Data Structures', 'CS302 - Database Management', 'CS303 - Computer Networks'];
    
    for (let i = 0; i < subjects.length; i++) {
        const total = internalMarks[i] + semesterMarks[i] + practicalMarks[i] + termWorkMarks[i];
        const percentage = Math.round((total / 150) * 100);
        let grade = '';
        
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B+';
        else if (percentage >= 60) grade = 'B';
        else if (percentage >= 50) grade = 'C';
        else if (percentage >= 40) grade = 'D';
        else grade = 'F';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${subjectNames[i]}</td>
            <td>${internalMarks[i]}</td>
            <td>${semesterMarks[i]}</td>
            <td>${practicalMarks[i]}</td>
            <td>${termWorkMarks[i]}</td>
            <td>${total}/150</td>
            <td>${grade}</td>
        `;
        
        subjectMarksBody.appendChild(row);
    }
}

// Manage attendance
function manageAttendance(studentId) {
    if (studentId) {
        viewStudentProfile(studentId);
        showStudentTab('attendance-info');
    }
    alert('Redirecting to attendance management...');
    // In a real application, this would navigate to the attendance management page
}

// Manage marks
function manageMarks(studentId) {
    if (studentId) {
        viewStudentProfile(studentId);
        showStudentTab('academic-info');
    }
    alert('Redirecting to marks management...');
    // In a real application, this would navigate to the marks management page
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Marks Management Functions
function initializeMarksSection() {
    // Find student button
    const findStudentBtn = document.getElementById('findStudentBtn');
    if (findStudentBtn) {
        findStudentBtn.addEventListener('click', fetchStudentDetails);
    }
    
    // Subject select dropdown
    const subjectSelect = document.getElementById('subjectSelect');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', function(e) {
            e.preventDefault(); // Prevent default behavior
            
            // Ensure the student details and marks entry form stay visible
            const studentDetailsCard = document.getElementById('studentDetailsCard');
            const marksEntryForm = document.getElementById('marksEntryForm');
            
            if (studentDetailsCard) {
                studentDetailsCard.style.display = 'block';
            }
            
            if (marksEntryForm) {
                marksEntryForm.style.display = 'block';
            }
            
            // Fetch existing marks for the new subject selection
            fetchExistingMarks();
        });
    }
    
    // Semester select dropdown (if it exists)
    const semesterSelect = document.getElementById('semesterSelect');
    if (semesterSelect) {
        semesterSelect.addEventListener('change', function(e) {
            e.preventDefault(); // Prevent default behavior
            
            // Ensure the student details and marks entry form stay visible
            const studentDetailsCard = document.getElementById('studentDetailsCard');
            const marksEntryForm = document.getElementById('marksEntryForm');
            
            if (studentDetailsCard) {
                studentDetailsCard.style.display = 'block';
            }
            
            if (marksEntryForm) {
                marksEntryForm.style.display = 'block';
            }
        });
    }
    
    // Clear form button
    const clearFormBtn = document.querySelector('.marks-actions .secondary');
    if (clearFormBtn) {
        clearFormBtn.addEventListener('click', clearForm);
    }
}

// Function to update subject dropdown in marks section
function updateMarksSubjectDropdown(branch, semester) {
    const subjectSelect = document.getElementById('subjectSelect');
    if (!subjectSelect) return;
    
    // Clear existing options except the first one
    while (subjectSelect.options.length > 1) {
        subjectSelect.remove(1);
    }
    
    // Get subjects for the selected branch and semester
    const subjects = getSubjectsByBranchAndSemester(branch, semester);
    
    console.log(`Found ${subjects.length} subjects for branch ${branch} and semester ${semester}`);
    
    // Add new options
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.code;
        option.textContent = `${subject.code} - ${subject.name}`;
        subjectSelect.appendChild(option);
    });
    
    // Prevent the dropdown from hiding the marks entry form
    subjectSelect.addEventListener('change', function(e) {
        e.preventDefault();
        // Make sure the student details and marks entry form stay visible
        const studentDetailsCard = document.getElementById('studentDetailsCard');
        const marksEntryForm = document.getElementById('marksEntryForm');
        
        if (studentDetailsCard) {
            studentDetailsCard.style.display = 'block';
        }
        
        if (marksEntryForm) {
            marksEntryForm.style.display = 'block';
        }
        
        // Fetch existing marks for the new subject selection
        fetchExistingMarks();
    });
}

// Helper function to get subjects by branch and semester
function getSubjectsByBranchAndSemester(branch, semester) {
    // Map the branch name from database to the format used in subjectsData
    const branchMap = {
        'Computer Science': 'CS',
        'Information Technology': 'IT',
        'AIML': 'AIML',
        'DS': 'DS',
        'Mechanical Engineering': 'MECHANICAL',
        'Computer Engineering': 'CS',
        'Electronics & Telecomm': 'EXTC'
        // Add more mappings as needed
    };
    
    const mappedBranch = branchMap[branch] || branch;
    console.log(`Mapped branch ${branch} to ${mappedBranch}`);
    
    // Check if we have the branch and semester in our subjects data
    if (subjectsData && subjectsData[mappedBranch] && subjectsData[mappedBranch][semester]) {
        return subjectsData[mappedBranch][semester];
    }
    
    console.warn(`No subjects found for branch ${mappedBranch} and semester ${semester}`);
    // Return empty array if no subjects found
    return [];
}

// Make sure the fetchStudentDetails function calls updateMarksSubjectDropdown with both branch and semester
async function fetchStudentDetails() {
    const seatNumber = document.getElementById('seatNumberInput').value.trim();
    
    if (!seatNumber) {
        showToast('Please enter a seat number', 'warning');
        return;
    }
    
    try {
        // Show loading state
        document.getElementById('studentDetailsCard').style.display = 'none';
        document.getElementById('subjectsContainer').style.display = 'none';
        showToast('Fetching student details...', 'info');
        
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // Fetch student details
        const studentResponse = await fetch(`http://localhost:5000/api/faculty/student/${seatNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!studentResponse.ok) {
            throw new Error('Failed to fetch student details');
        }
        
        const studentData = await studentResponse.json();
        
        if (!studentData.success) {
            showToast(studentData.message || 'Student not found', 'error');
            return;
        }
        
        // Display student details
        const student = studentData.student;
        document.getElementById('studentName').textContent = student.name;
        document.getElementById('studentRoll').textContent = student.rollNumber || student.seatNo;
        document.getElementById('studentBranch').textContent = getBranchName(student.branch);
        document.getElementById('studentSemester').textContent = `Semester ${student.semester}`;
        document.getElementById('studentDetailsCard').style.display = 'block';
        
        // Get all subjects for this student's branch and semester
        const subjects = getSubjectsByBranchAndSemester(student.branch, student.semester);
        
        if (!subjects || subjects.length === 0) {
            showToast('No subjects found for this student', 'warning');
            return;
        }
        
        // Generate subject cards
        generateSubjectCards(subjects, student);
        
        // Show the subjects container
        document.getElementById('subjectsContainer').style.display = 'block';
        
    } catch (error) {
        console.error('Error fetching student details:', error);
        showToast(error.message || 'Failed to fetch student details', 'error');
    }
}

// Generate cards for all subjects
function generateSubjectCards(subjects, student) {
    const subjectsGrid = document.getElementById('subjectsGrid');
    subjectsGrid.innerHTML = ''; // Clear existing content
    
    subjects.forEach(subject => {
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        subjectCard.dataset.subjectCode = subject.code;
        
        subjectCard.innerHTML = `
            <h4><i class="fas fa-book"></i> ${subject.name}</h4>
            <p class="subject-code">${subject.code}</p>
            <div class="marks-grid">
                <div class="marks-input-group">
                    <label><i class="fas fa-pen"></i> Semester Exam (75)</label>
                    <input type="number" class="form-input semester-marks" min="0" max="75" data-subject="${subject.code}">
                </div>
                <div class="marks-input-group">
                    <label><i class="fas fa-tasks"></i> Internal Assessment (25)</label>
                    <input type="number" class="form-input internal-marks" min="0" max="25" data-subject="${subject.code}">
                </div>
                <div class="marks-input-group">
                    <label><i class="fas fa-flask"></i> Practical Exam (25)</label>
                    <input type="number" class="form-input practical-marks" min="0" max="25" data-subject="${subject.code}">
                </div>
                <div class="marks-input-group">
                    <label><i class="fas fa-clipboard-check"></i> Term Work (25)</label>
                    <input type="number" class="form-input termwork-marks" min="0" max="25" data-subject="${subject.code}">
                </div>
            </div>
        `;
        
        subjectsGrid.appendChild(subjectCard);
        
        // Fetch existing marks for this subject if available
        fetchExistingMarks(student.rollNumber || student.seatNo, subject.code, student.semester);
    });
}

// Fetch existing marks for a subject
async function fetchExistingMarks(rollNumber, subjectCode, semester) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        const response = await fetch(`http://localhost:5000/api/faculty/marks/${rollNumber}/${subjectCode}/${semester}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            console.error('Failed to fetch marks for subject:', subjectCode);
            return;
        }
        
        const data = await response.json();
        
        if (data.success && data.marks) {
            // Fill in existing marks in the form
            const card = document.querySelector(`.subject-card[data-subject-code="${subjectCode}"]`);
            if (card) {
                card.querySelector('.semester-marks').value = data.marks.semester || '';
                card.querySelector('.internal-marks').value = data.marks.internal || '';
                card.querySelector('.practical-marks').value = data.marks.practical || '';
                card.querySelector('.termwork-marks').value = data.marks.termwork || '';
            }
        }
    } catch (error) {
        console.error('Error fetching existing marks:', error);
    }
}

// Save marks for all subjects
async function saveAllSubjectMarks() {
    const seatNumber = document.getElementById('seatNumberInput').value.trim();
    const studentSemester = document.getElementById('studentSemester').textContent.replace('Semester ', '').trim();
    
    if (!seatNumber) {
        showToast('Student seat number not found', 'error');
        return;
    }
    
    try {
        showToast('Saving marks for all subjects...', 'info');
        
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const subjectCards = document.querySelectorAll('.subject-card');
        let saveCount = 0;
        let errorCount = 0;
        
        for (const card of subjectCards) {
            const subjectCode = card.dataset.subjectCode;
            const semesterMarks = card.querySelector('.semester-marks').value;
            const internalMarks = card.querySelector('.internal-marks').value;
            const practicalMarks = card.querySelector('.practical-marks').value;
            const termworkMarks = card.querySelector('.termwork-marks').value;
            
            // Skip subjects with no marks entered
            if (!semesterMarks && !internalMarks && !practicalMarks && !termworkMarks) {
                continue;
            }
            
            try {
                // FIXED: Use the correct endpoint and parameter name (seatNumber instead of rollNumber)
                const response = await fetch('http://localhost:5000/api/faculty/marks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        seatNumber: seatNumber,  // FIXED: Using seatNumber instead of rollNumber
                        subject: subjectCode,
                        semester: studentSemester,
                        marks: {
                            semester: semesterMarks ? parseInt(semesterMarks) : 0,
                            internal: internalMarks ? parseInt(internalMarks) : 0,
                            practical: practicalMarks ? parseInt(practicalMarks) : 0,
                            termwork: termworkMarks ? parseInt(termworkMarks) : 0
                        }
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    saveCount++;
                } else {
                    errorCount++;
                    console.error(`Failed to save marks for ${subjectCode}:`, data.message);
                }
            } catch (error) {
                errorCount++;
                console.error(`Error saving marks for ${subjectCode}:`, error);
            }
        }
        
        if (errorCount === 0) {
            showToast(`Successfully saved marks for ${saveCount} subjects`, 'success');
        } else {
            showToast(`Saved ${saveCount} subjects, ${errorCount} failed. Check console for details.`, 'warning');
        }
    } catch (error) {
        console.error('Error saving marks:', error);
        showToast('Failed to save marks', 'error');
    }
}

// Clear all forms
function clearAllForms() {
    const inputs = document.querySelectorAll('.subject-card input');
    inputs.forEach(input => input.value = '');
    showToast('All forms cleared', 'info');
}

// Update the displayStudentDetails function to ensure forms stay visible
function displayStudentDetails(student) {
    const studentDetailsCard = document.getElementById('studentDetailsCard');
    const marksEntryForm = document.getElementById('marksEntryForm');
    
    if (studentDetailsCard) studentDetailsCard.style.display = 'block';
    if (marksEntryForm) marksEntryForm.style.display = 'block';
    
    const studentName = document.getElementById('studentName');
    const studentRoll = document.getElementById('studentRoll');
    const studentBranch = document.getElementById('studentBranch');
    
    if (studentName) studentName.textContent = student.name;
    if (studentRoll) studentRoll.textContent = student.rollNo || student.rollNumber;
    if (studentBranch) studentBranch.textContent = student.branch;
    
    // Fetch existing marks after a short delay to ensure the form is visible
    setTimeout(fetchExistingMarks, 100);
}

async function fetchExistingMarks(rollNo) {
    const subjectSelect = document.getElementById('subjectSelect');
    const semesterSelect = document.getElementById('semesterSelect');
    
    if (!subjectSelect || !subjectSelect.value || !semesterSelect || !semesterSelect.value) {
        // No subject or semester selected, so no need to fetch marks
        return;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
    }

    try {
        // Fetch existing marks from the server
        const response = await fetch(`http://localhost:5000/api/faculty/marks/${rollNo}/${subjectSelect.value}/${semesterSelect.value}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch existing marks');
        }

        const data = await response.json();
        
        if (data.success && data.marks) {
            // Populate the form with existing marks
            const semesterMarks = document.getElementById('semesterMarks');
            const internalMarks = document.getElementById('internalMarks');
            const practicalMarks = document.getElementById('practicalMarks');
            const termworkMarks = document.getElementById('termworkMarks');
            
            if (semesterMarks) semesterMarks.value = data.marks.semester || '';
            if (internalMarks) internalMarks.value = data.marks.internal || '';
            if (practicalMarks) practicalMarks.value = data.marks.practical || '';
            if (termworkMarks) termworkMarks.value = data.marks.termwork || '';
        }
    } catch (error) {
        console.error('Error fetching existing marks:', error);
        // No need to show an alert here, as this is just a convenience feature
    }
}

async function saveStudentMarks() {
    const seatNumberInput = document.getElementById('seatNumberInput');
    const subjectSelect = document.getElementById('subjectSelect');
    const semesterSelect = document.getElementById('semesterSelect');
    const semesterMarks = document.getElementById('semesterMarks');
    const internalMarks = document.getElementById('internalMarks');
    const practicalMarks = document.getElementById('practicalMarks');
    const termworkMarks = document.getElementById('termworkMarks');
    
    if (!seatNumberInput || !seatNumberInput.value) {
        alert('Please enter a seat number');
        return;
    }
    
    if (!subjectSelect || !subjectSelect.value) {
        alert('Please select a subject');
        return;
    }
    
    if (!semesterSelect || !semesterSelect.value) {
        alert('Please select a semester');
        return;
    }
    
    const marksData = {
        seatNumber: seatNumberInput.value.trim(),
        subject: subjectSelect.value,
        semester: semesterSelect.value,
        marks: {
            semester: parseInt(semesterMarks?.value) || 0,
            internal: parseInt(internalMarks?.value) || 0,
            practical: parseInt(practicalMarks?.value) || 0,
            termwork: parseInt(termworkMarks?.value) || 0
        }
    };

    // Validate marks
    if (!validateMarks(marksData.marks)) {
        alert('Please enter valid marks');
        return;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
    }

    // Show loading state
    const saveButton = document.querySelector('.marks-actions .action-btn');
    if (saveButton) {
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveButton.disabled = true;
    }

    try {
        console.log('Sending marks data:', marksData);
        
        // Save marks to the server
        const response = await fetch('http://localhost:5000/api/faculty/marks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(marksData)
        });

        // Log raw response for debugging
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
            throw new Error(data.message || `Failed to save marks. Status: ${response.status}`);
        }
        
        if (data.success) {
            alert('Marks saved successfully!');
            console.log('Marks saved:', data);
            // Optional: refresh form or fetch updated marks
        } else {
            alert(data.message || 'Failed to save marks');
        }
    } catch (error) {
        console.error('Error saving marks:', error);
        alert(`Failed to save marks: ${error.message}`);
    } finally {
        // Reset button state
        if (saveButton) {
            saveButton.innerHTML = '<i class="fas fa-save"></i> Save Marks';
            saveButton.disabled = false;
        }
    }
}

function validateMarks(marks) {
    if (marks.semester < 0 || marks.semester > 75) return false;
    if (marks.internal < 0 || marks.internal > 25) return false;
    if (marks.practical < 0 || marks.practical > 25) return false;
    if (marks.termwork < 0 || marks.termwork > 25) return false;
    return true;
}

function clearForm() {
    const studentDetailsCard = document.getElementById('studentDetailsCard');
    const marksEntryForm = document.getElementById('marksEntryForm');
    const semesterMarks = document.getElementById('semesterMarks');
    const internalMarks = document.getElementById('internalMarks');
    const practicalMarks = document.getElementById('practicalMarks');
    const termworkMarks = document.getElementById('termworkMarks');
    
    if (studentDetailsCard) studentDetailsCard.style.display = 'none';
    if (marksEntryForm) marksEntryForm.style.display = 'none';
    if (semesterMarks) semesterMarks.value = '';
    if (internalMarks) internalMarks.value = '';
    if (practicalMarks) practicalMarks.value = '';
    if (termworkMarks) termworkMarks.value = '';
}

// Add this function to display grade card history
async function viewGradeCardHistory(rollNumber) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
    }

    try {
        // Fetch grade cards for the student
        const response = await fetch(`http://localhost:5000/api/faculty/gradecards/${rollNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch grade card history');
        }

        const data = await response.json();
        
        if (data.success) {
            displayGradeCardHistory(data.gradeCards, rollNumber);
        } else {
            alert(data.message || 'No grade cards found');
        }
    } catch (error) {
        console.error('Error fetching grade card history:', error);
        alert('Failed to fetch grade card history. Please try again.');
    }
}

// Function to display grade card history
function displayGradeCardHistory(gradeCards, rollNumber) {
    // Create a modal to display grade card history
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'gradeCardHistoryModal';
    
    let modalContent = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Grade Card History - ${rollNumber}</h3>
                <button class="close-btn" onclick="closeGradeCardHistoryModal()">×</button>
            </div>
            <div class="modal-body">
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>Semester</th>
                            <th>SGPA</th>
                            <th>Result</th>
                            <th>Generated On</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    gradeCards.forEach(card => {
        const date = new Date(card.generatedAt).toLocaleDateString();
        modalContent += `
            <tr>
                <td>${card.semester}</td>
                <td>${card.sgpa}</td>
                <td class="${card.result === 'PASS' ? 'status-pass' : 'status-fail'}">${card.result}</td>
                <td>${date}</td>
                <td>
                    <button class="view-btn" onclick="viewGradeCardById('${card._id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    });
    
    modalContent += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Show the modal
    setTimeout(() => {
        modal.style.display = 'flex';
    }, 100);
}

// Function to close the grade card history modal
function closeGradeCardHistoryModal() {
    const modal = document.getElementById('gradeCardHistoryModal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Function to view a specific grade card by ID
async function viewGradeCardById(id) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            showToast('Authentication token not found', 'error');
            return;
        }

        // Show loading indicator
        showToast('Loading grade card...', 'info');

        // Fetch grade card by ID
        const response = await fetch(`http://localhost:5000/api/faculty/gradecard/id/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch grade card');
        }

        const data = await response.json();
        
        if (data.success) {
            // Create and show the grade card modal
            createGradeCardModal(data.gradeCard);
        } else {
            showToast(data.message || 'Grade card not found', 'error');
        }
    } catch (error) {
        console.error('Error viewing grade card:', error);
        showToast('Failed to load grade card', 'error');
    }
}

// Function to create and display a grade card modal
function createGradeCardModal(gradeCard) {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'gradeCardModal';
    
    // Calculate total marks and percentage
    let totalObtained = 0;
    let totalMaximum = 0;
    
    gradeCard.subjects.forEach(subject => {
        totalObtained += subject.totalMarks;
        // Assuming each subject has a maximum of 100 marks
        totalMaximum += 150;
    });
    
    const percentage = ((totalObtained / totalMaximum) * 100).toFixed(2);
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content grade-card-modal">
            <div class="modal-header">
                <h2>Student Grade Card</h2>
                <span class="close-modal" onclick="closeModal('gradeCardModal')">&times;</span>
            </div>
            <div class="modal-body">
                <div class="grade-card-header">
                    <div class="university-logo">
                        <i class="fas fa-university"></i>
                    </div>
                    <div class="university-details">
                        <h2>Mumbai University</h2>
                        <p>Grade Card</p>
                    </div>
                </div>
                
                <div class="student-details">
                    <div class="detail-row">
                        <div class="detail-item">
                            <span class="detail-label">Name:</span>
                            <span class="detail-value">${gradeCard.studentName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Roll Number:</span>
                            <span class="detail-value">${gradeCard.rollNumber}</span>
                        </div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-item">
                            <span class="detail-label">Branch:</span>
                            <span class="detail-value">${gradeCard.branch}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Semester:</span>
                            <span class="detail-value">${gradeCard.semester}</span>
                        </div>
                    </div>
                </div>
                
                <div class="marks-table-container">
                    <table class="marks-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Semester Exam (75)</th>
                                <th>Internal (25)</th>
                                <th>Practical (25)</th>
                                <th>Term Work (25)</th>
                                <th>Total</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${gradeCard.subjects.map(subject => `
                                <tr>
                                    <td>${subject.name}</td>
                                    <td>${subject.semesterMarks}</td>
                                    <td>${subject.internalMarks}</td>
                                    <td>${subject.practicalMarks}</td>
                                    <td>${subject.termworkMarks}</td>
                                    <td>${subject.totalMarks}</td>
                                    <td>${subject.grade}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="result-summary">
                    <div class="summary-item">
                        <span class="summary-label">Total Marks:</span>
                        <span class="summary-value">${totalObtained}/${totalMaximum}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Percentage:</span>
                        <span class="summary-value">${percentage}%</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">SGPA:</span>
                        <span class="summary-value">${gradeCard.sgpa}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Result:</span>
                        <span class="summary-value ${gradeCard.result === 'PASS' ? 'pass' : 'fail'}">${gradeCard.result}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                
                <button class="action-btn secondary" onclick="closeModal('gradeCardModal')">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    `;
    
    // Add modal to the document
    document.body.appendChild(modal);
    
    // Show the modal
    setTimeout(() => {
        modal.style.display = 'flex';
    }, 100);
}

// Function to close a modal by ID
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Function to print the grade card
function printGradeCard() {
    const printContent = document.querySelector('.grade-card-modal .modal-body');
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div class="print-container">
            ${printContent.innerHTML}
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContents;
    
    // Reattach event listeners
    document.addEventListener('DOMContentLoaded', () => {
        // Your initialization code here
    });
}

// Make functions available globally
window.viewGradeCardById = viewGradeCardById;
window.closeModal = closeModal;
window.printGradeCard = printGradeCard;

// Add a history button to the grade card section
function addHistoryButtonToGradeCard() {
    const resultSeatNumber = document.getElementById('resultSeatNumber');
    if (!resultSeatNumber || !resultSeatNumber.value) return;
    
    const resultsSearch = document.querySelector('.results-search');
    
    // Check if history button already exists
    if (!document.getElementById('viewHistoryBtn')) {
        const historyBtn = document.createElement('button');
        historyBtn.className = 'action-btn secondary';
        historyBtn.id = 'viewHistoryBtn';
        historyBtn.innerHTML = '<i class="fas fa-history"></i> View History';
        historyBtn.onclick = () => viewGradeCardHistory(resultSeatNumber.value);
        
        resultsSearch.appendChild(historyBtn);
    }
}

// Function to generate grade card
async function generateGradeCard() {
    const resultSeatNumber = document.getElementById('resultSeatNumber');
    if (!resultSeatNumber || !resultSeatNumber.value) {
        alert('Please enter a seat number');
        return;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
    }

    // Show loading state
    const generateButton = document.querySelector('.results-search .action-btn');
    if (generateButton) {
        generateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateButton.disabled = true;
    }

    try {
        // Fetch grade card data from the server
        const response = await fetch(`http://localhost:5000/api/faculty/gradecard/${resultSeatNumber.value}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to generate grade card');
        }

        const data = await response.json();
        
        if (data.success) {
            displayGradeCard(data);
            // Add history button after successful generation
            addHistoryButtonToGradeCard();
            console.log('Grade card generated and saved successfully');
        } else {
            alert(data.message || 'Failed to generate grade card');
        }
    } catch (error) {
        console.error('Error generating grade card:', error);
        alert(error.message || 'Failed to generate grade card. Please try again.');
    } finally {
        // Reset button state
        if (generateButton) {
            generateButton.innerHTML = '<i class="fas fa-file-alt"></i> Generate Grade Card';
            generateButton.disabled = false;
        }
    }
}

// Make sure to expose the new functions globally
window.viewGradeCardHistory = viewGradeCardHistory;
window.closeGradeCardHistoryModal = closeGradeCardHistoryModal;
window.viewGradeCardById = viewGradeCardById;

// Add this function to display the grade card
function displayGradeCard(data) {
    if (!data || !data.success) {
        alert('Failed to generate grade card');
        return;
    }

    // Get the grade card container
    const gradeCard = document.getElementById('gradeCard');
    
    // Update student information
    document.getElementById('gradeCardName').textContent = data.student.name;
    document.getElementById('gradeCardSeat').textContent = data.student.seatNo;
    document.getElementById('gradeCardBranch').textContent = data.student.branch;
    document.getElementById('gradeCardSemester').textContent = data.student.semester;
    
    // Update subjects table
    const tableBody = document.getElementById('gradeTableBody');
    tableBody.innerHTML = '';
    
    // Check if we have the gradeCard property with subjects
    const subjects = data.gradeCard ? data.gradeCard.subjects : data.subjects;
    
    if (!subjects || subjects.length === 0) {
        console.error('No subjects data found in the response:', data);
        showToast('No subject data found in the grade card', 'error');
        return;
    }
    
    subjects.forEach(subject => {
        const row = document.createElement('tr');
        
        // Extract marks data - handle different response formats
        const semesterMarks = subject.semesterMarks || subject.semester || 0;
        const internalMarks = subject.internalMarks || subject.internal || 0;
        const practicalMarks = subject.practicalMarks || subject.practical || 0;
        const termworkMarks = subject.termworkMarks || subject.termwork || 0;
        const totalMarks = subject.totalMarks || subject.total || 
                          (semesterMarks + internalMarks + practicalMarks + termworkMarks);
        const grade = subject.grade || 'F';
        
        row.innerHTML = `
            <td>${subject.name}</td>
            <td>${semesterMarks}</td>
            <td>${internalMarks}</td>
            <td>${practicalMarks}</td>
            <td>${termworkMarks}</td>
            <td>${totalMarks}</td>
            <td>${grade}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Update summary information
    document.getElementById('sgpa').textContent = data.gradeCard ? data.gradeCard.sgpa : data.sgpa;
    
    const result = data.gradeCard ? data.gradeCard.result : data.result;
    const resultElement = document.getElementById('finalResult');
    resultElement.textContent = result;
    resultElement.className = result === 'PASS' ? 'status-pass' : 'status-fail';
    
    // Show the grade card
    gradeCard.style.display = 'block';
    
    // Log success message
    console.log('Grade card displayed successfully');
}

// Function to print the grade card
function printGradeCard() {
    window.print();
}

// Make sure to expose the functions globally
window.displayGradeCard = displayGradeCard;
window.printGradeCard = printGradeCard;

function navigateToSection(sectionId) {
    // Remove active class from all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected section and nav item
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to initialize the attendance section
function initializeAttendanceSection() {
    console.log('Initializing attendance section');
    
    // Set up tabs
    const attendanceTabs = document.querySelectorAll('.attendance-tab');
    const attendanceContents = document.querySelectorAll('.attendance-content');
    
    attendanceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            attendanceTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            attendanceContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
            
            // Load data for selected tab if needed
            if (tabId === 'defaulters') {
                loadDefaultersList();
            } else if (tabId === 'reports') {
                loadAttendanceReports();
            }
        });
    });
    
    // Add event listener for search button
    document.getElementById('searchAttendanceStudentBtn')?.addEventListener('click', searchAttendanceStudent);
    
    // Add event listener for semester dropdown
    document.getElementById('attendanceSemester')?.addEventListener('change', function() {
        populateAttendanceSubjectDropdown(this.value);
    });
    
    // Setup batch filter
    document.getElementById('attendanceBatch')?.addEventListener('change', function() {
        // If on defaulters tab, refresh the list
        if (document.querySelector('.attendance-tab[data-tab="defaulters"]').classList.contains('active')) {
            loadDefaultersList();
        }
    });
    
    // Setup subject filter
    document.getElementById('attendanceSubject')?.addEventListener('change', function() {
        // If on reports tab, refresh the charts
        if (document.querySelector('.attendance-tab[data-tab="reports"]').classList.contains('active')) {
            loadAttendanceReports();
        }
    });
    
    // Add event listeners for defaulters actions
    document.getElementById('notifyDefaultersBtn')?.addEventListener('click', notifyDefaulters);
    document.getElementById('printDefaultersBtn')?.addEventListener('click', printDefaulters);
    
    // Add event listeners for export
    document.getElementById('exportAttendanceBtn')?.addEventListener('click', exportAttendanceReport);
    
    // Add event listeners for trend timeframe selection
    document.getElementById('trendTimeframe')?.addEventListener('change', function() {
        updateAttendanceTrendChart(this.value);
    });
    
    // Initialize the attendance input listeners
    initializeAttendanceInputs();
}

// Function to initialize attendance inputs
function initializeAttendanceInputs() {
    const theoryAttended = document.getElementById('theoryAttended');
    const theoryTotal = document.getElementById('theoryTotal');
    const practicalAttended = document.getElementById('practicalAttended');
    const practicalTotal = document.getElementById('practicalTotal');
    
    if (theoryAttended && theoryTotal) {
        theoryAttended.addEventListener('input', updateAttendancePercentages);
        theoryTotal.addEventListener('input', updateAttendancePercentages);
    }
    
    if (practicalAttended && practicalTotal) {
        practicalAttended.addEventListener('input', updateAttendancePercentages);
        practicalTotal.addEventListener('input', updateAttendancePercentages);
    }
}

// Add this utility function for showing toast messages
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="${getToastIcon(type)}"></i>
            <div class="toast-message">${message}</div>
        </div>
        <i class="fas fa-times toast-close"></i>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
    
    // Add close button functionality
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
}

// Helper function to get appropriate icon for toast type
function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fas fa-check-circle';
        case 'error': return 'fas fa-exclamation-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        default: return 'fas fa-info-circle';
    }
}

// Add the missing updateAttendanceTrendChart function
function updateAttendanceTrendChart() {
    const timeframe = document.getElementById('trendTimeframe').value;
    
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            showToast('Authentication token not found. Please login again.', 'error');
            return;
        }
        
        // In a real implementation, this would fetch data from the server
        // For now, we'll just update with different sample data based on timeframe
        let labels, data;
        
        if (timeframe === 'week') {
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            data = [85, 82, 78, 80, 75, 88];
        } else if (timeframe === 'month') {
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            data = [82, 78, 75, 80];
        } else {
            labels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            data = [90, 85, 78, 80, 82];
        }
        
        // Update the chart
        initializeAttendanceTrendChart({ labels, values: data });
        
    } catch (error) {
        console.error('Error updating attendance trend chart:', error);
        showToast('Error updating chart', 'error');
    }
}

// Fix the searchStudent function to match the actual API response structure
async function searchStudent() {
    const searchQuery = document.getElementById('attendanceStudentSearch').value.trim();
    if (!searchQuery) {
        showToast('Please enter a name or seat number', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            showToast('Authentication token not found. Please login again.', 'error');
            return;
        }
        
        // Show loading state
        document.getElementById('searchAttendanceStudentBtn').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // Use the same endpoint as in the "My Students" section
        const response = await fetch('http://localhost:5000/api/faculty/my-students', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch student data');
        }
        
        const data = await response.json();
        console.log("API response:", data);
        
        // Reset button state
        document.getElementById('searchAttendanceStudentBtn').innerHTML = '<i class="fas fa-search"></i> Search';
        
        if (data.success && data.students && Array.isArray(data.students)) {
            // Filter students based on search query
            const matchingStudents = data.students.filter(student => {
                // Based on the console output, the properties are seatNo and name
                const studentName = student.name || '';
                const studentSeatNo = student.seatNo || '';
                
                return studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       studentSeatNo.toLowerCase().includes(searchQuery.toLowerCase());
            });
            
            if (matchingStudents.length > 0) {
                // Use the first matching student
                const student = matchingStudents[0];
                
                // For now, create mock attendance data
                const studentWithAttendance = {
                    id: student.id || '',
                    name: student.name || 'Unknown Student',
                    seatNo: student.seatNo || 'N/A',
                    branch: student.branch || 'N/A',
                    semester: student.semester || 'N/A',
                    theoryAttended: 32,
                    theoryTotal: 40,
                    practicalAttended: 18,
                    practicalTotal: 20
                };
                
                displayStudentAttendance(studentWithAttendance);
                showToast(`Found student: ${student.name}`, 'success');
            } else {
                showToast('No student found with the given search term', 'error');
            }
        } else {
            console.log('API response format issue:', data);
            showToast('No students found or invalid data format', 'error');
        }
    } catch (error) {
        console.error('Error searching for student:', error);
        document.getElementById('searchAttendanceStudentBtn').innerHTML = '<i class="fas fa-search"></i> Search';
        showToast(error.message || 'Error searching for student', 'error');
    }
}

// Function to display student attendance form
function displayStudentAttendance(student) {
    document.getElementById('individualAttendanceForm').style.display = 'block';
    document.getElementById('attendanceStudentName').textContent = student.name;
    document.getElementById('attendanceStudentInfo').textContent = 
        `Seat No: ${student.seatNo} | ${student.branch} - Semester ${student.semester}`;
    
    // Set current attendance values
    document.getElementById('theoryAttended').value = student.theoryAttended;
    document.getElementById('theoryTotal').value = student.theoryTotal;
    document.getElementById('practicalAttended').value = student.practicalAttended;
    document.getElementById('practicalTotal').value = student.practicalTotal;
    
    // Calculate and display percentages
    calculateAttendancePercentages();
    
    // Load attendance history
    loadAttendanceHistory(student.id);
}

// Calculate attendance percentages
function calculateAttendancePercentages() {
    const theoryAttended = parseInt(document.getElementById('theoryAttended').value) || 0;
    const theoryTotal = parseInt(document.getElementById('theoryTotal').value) || 1; // Avoid division by zero
    const practicalAttended = parseInt(document.getElementById('practicalAttended').value) || 0;
    const practicalTotal = parseInt(document.getElementById('practicalTotal').value) || 1; // Avoid division by zero
    
    // Calculate percentages
    const theoryPercentage = Math.round((theoryAttended / theoryTotal) * 100);
    const practicalPercentage = Math.round((practicalAttended / practicalTotal) * 100);
    
    // Calculate overall percentage (weighted average based on total lectures)
    const totalAttended = theoryAttended + practicalAttended;
    const totalLectures = theoryTotal + practicalTotal;
    const overallPercentage = Math.round((totalAttended / totalLectures) * 100);
    
    // Update UI
    updatePercentageDisplay('theoryPercentage', theoryPercentage);
    updatePercentageDisplay('practicalPercentage', practicalPercentage);
    updatePercentageDisplay('overallPercentage', overallPercentage);
    
    // Update attendance status
    const statusElement = document.getElementById('attendanceStatus');
    if (overallPercentage >= 85) {
        statusElement.textContent = 'Status: Excellent Standing';
        statusElement.className = 'good';
    } else if (overallPercentage >= 75) {
        statusElement.textContent = 'Status: Good Standing';
        statusElement.className = 'warning';
    } else {
        statusElement.textContent = 'Status: Defaulter (Below 75%)';
        statusElement.className = 'danger';
    }
}

// Update percentage display with appropriate styling
function updatePercentageDisplay(elementId, percentage) {
    const element = document.getElementById(elementId);
    element.textContent = `${percentage}%`;
    
    // Remove existing classes
    element.classList.remove('good', 'warning', 'danger');
    
    // Add appropriate class based on percentage
    if (percentage >= 85) {
        element.classList.add('good');
    } else if (percentage >= 75) {
        element.classList.add('warning');
    } else {
        element.classList.add('danger');
    }
}

// Load attendance history for a student
async function loadAttendanceHistory(studentId) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            showToast('Authentication token not found. Please login again.', 'error');
            return;
        }
        
        const response = await fetch(`http://localhost:5000/api/faculty/attendance/history/${studentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch attendance history');
        }
        
        const data = await response.json();
        
        const tableBody = document.getElementById('attendanceHistoryBody');
        tableBody.innerHTML = '';
        
        if (data.success && data.history && data.history.length > 0) {
            data.history.forEach(entry => {
                const row = document.createElement('tr');
                const statusClass = entry.status === 'Present' ? 'good' : 'danger';
                
                row.innerHTML = `
                    <td>${new Date(entry.date).toLocaleDateString()}</td>
                    <td>${entry.type}</td>
                    <td>${entry.hours}</td>
                    <td><span class="status-badge ${statusClass}">${entry.status}</span></td>
                    <td>${entry.topic || 'N/A'}</td>
                    <td>${entry.updatedBy}</td>
                `;
                
                tableBody.appendChild(row);
            });
        } else {
            // Show empty state
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="6" class="text-center">No attendance history found</td>
            `;
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading attendance history:', error);
        const tableBody = document.getElementById('attendanceHistoryBody');
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Error loading attendance history</td>
            </tr>
        `;
    }
}

// Save individual attendance
async function saveIndividualAttendance() {
    const studentName = document.getElementById('attendanceStudentName').textContent;
    const theoryAttended = parseInt(document.getElementById('theoryAttended').value) || 0;
    const theoryTotal = parseInt(document.getElementById('theoryTotal').value) || 0;
    const practicalAttended = parseInt(document.getElementById('practicalAttended').value) || 0;
    const practicalTotal = parseInt(document.getElementById('practicalTotal').value) || 0;
    
    // Validate inputs
    if (theoryAttended > theoryTotal) {
        showToast('Attended theory lectures cannot exceed total lectures', 'error');
        return;
    }
    
    if (practicalAttended > practicalTotal) {
        showToast('Attended practical sessions cannot exceed total sessions', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            showToast('Authentication token not found. Please login again.', 'error');
            return;
        }
        
        // Show loading state
        const saveButton = document.getElementById('saveIndividualAttendanceBtn');
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveButton.disabled = true;
        
        // Get student ID from the search
        const searchQuery = document.getElementById('attendanceStudentSearch').value.trim();
        const searchResponse = await fetch(`http://localhost:5000/api/faculty/students/search?query=${searchQuery}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!searchResponse.ok) {
            throw new Error('Failed to fetch student data');
        }
        
        const searchData = await searchResponse.json();
        
        if (!searchData.success || !searchData.students || searchData.students.length === 0) {
            throw new Error('Student not found');
        }
        
        const studentId = searchData.students[0]._id;
        
        // Save attendance data
        const response = await fetch(`http://localhost:5000/api/faculty/attendance/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                studentId,
                theoryAttended,
                theoryTotal,
                practicalAttended,
                practicalTotal,
                subject: document.getElementById('attendanceSubject').value
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save attendance data');
        }
        
        const data = await response.json();
        
        // Reset button state
        saveButton.innerHTML = '<i class="fas fa-save"></i> Save Attendance';
        saveButton.disabled = false;
        
        if (data.success) {
            showToast('Attendance updated successfully', 'success');
            
            // Refresh attendance history
            loadAttendanceHistory(studentId);
        } else {
            showToast(data.message || 'Failed to update attendance', 'error');
        }
    } catch (error) {
        console.error('Error saving attendance:', error);
        document.getElementById('saveIndividualAttendanceBtn').innerHTML = '<i class="fas fa-save"></i> Save Attendance';
        document.getElementById('saveIndividualAttendanceBtn').disabled = false;
        showToast(error.message || 'Error saving attendance', 'error');
    }
}

// Reset individual attendance form
function resetIndividualAttendanceForm() {
    document.getElementById('theoryAttended').value = '0';
    document.getElementById('theoryTotal').value = '0';
    document.getElementById('practicalAttended').value = '0';
    document.getElementById('practicalTotal').value = '0';
    
    calculateAttendancePercentages();
}

// Load defaulters list
async function loadDefaultersList() {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            showToast('Authentication token not found. Please login again.', 'error');
            return;
        }
        
        const subject = document.getElementById('attendanceSubject').value;
        const semester = document.getElementById('attendanceSemester').value;
        
        if (!subject || !semester) {
            showToast('Please select subject and semester', 'error');
            return;
        }
        
        // Show loading state
        document.getElementById('defaultersList').innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading defaulters...</div>';
        
        // Fetch defaulters from the server
        const response = await fetch(`http://localhost:5000/api/faculty/attendance/defaulters?subject=${subject}&semester=${semester}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch defaulters list');
        }
        
        const data = await response.json();
        
        const defaultersList = document.getElementById('defaultersList');
        defaultersList.innerHTML = '';
        
        if (data.success && data.defaulters && data.defaulters.length > 0) {
            data.defaulters.forEach(student => {
                const card = document.createElement('div');
                card.className = 'defaulter-card';
                
                card.innerHTML = `
                    <div class="defaulter-info">
                        <div class="defaulter-name">${student.name}</div>
                        <div class="defaulter-details">${student.rollNumber} | ${student.branch} - Semester ${student.semester}</div>
                    </div>
                    <div class="defaulter-attendance">${student.attendancePercentage}%</div>
                    <div class="defaulter-actions">
                        <button class="action-btn" onclick="notifyDefaulter('${student._id}')">
                            <i class="fas fa-envelope"></i> Notify
                        </button>
                        <button class="action-btn secondary" onclick="viewStudentAttendance('${student.rollNumber}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                `;
                
                defaultersList.appendChild(card);
            });
            
            // Update defaulters count in reports
            document.getElementById('defaultersCount').textContent = data.defaulters.length;
        } else {
            defaultersList.innerHTML = '<div class="empty-state">No defaulters found for the selected criteria</div>';
            document.getElementById('defaultersCount').textContent = '0';
        }
    } catch (error) {
        console.error('Error loading defaulters list:', error);
        document.getElementById('defaultersList').innerHTML = '<div class="error-state">Error loading defaulters list</div>';
    }
}

// Notify a defaulter
function notifyDefaulter(studentId) {
    // In a real application, this would send a notification
    showToast('Notification sent to student', 'success');
}

// Notify all defaulters
function notifyAllDefaulters() {
    // In a real application, this would send notifications to all defaulters
    showToast('Notifications sent to all defaulters', 'success');
}

// Print defaulters list
function printDefaultersList() {
    // In a real application, this would generate a printable version
    window.print();
}

// View student attendance
function viewStudentAttendance(studentId) {
    // Switch to individual entry tab
    document.querySelector('.attendance-tab[data-tab="individual-entry"]').click();
    
    // Search for the student
    document.getElementById('attendanceStudentSearch').value = studentId;
    searchStudent();
}

// Export attendance report
function exportAttendanceReport() {
    // In a real application, this would generate a downloadable report
    showToast('Attendance report exported successfully', 'success');
}

// Initialize attendance reports
async function initializeAttendanceReports() {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            showToast('Authentication token not found. Please login again.', 'error');
            return;
        }
        
        const subject = document.getElementById('attendanceSubject').value;
        const semester = document.getElementById('attendanceSemester').value;
        
        if (!subject || !semester) {
            showToast('Please select subject and semester', 'error');
            return;
        }
        
        // Fetch attendance statistics from the server
        const response = await fetch(`http://localhost:5000/api/faculty/attendance/statistics?subject=${subject}&semester=${semester}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch attendance statistics');
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Update report cards
            document.getElementById('averageAttendance').textContent = `${data.averageAttendance}%`;
            document.getElementById('defaultersCount').textContent = data.defaultersCount;
            document.getElementById('lecturesConducted').textContent = data.lecturesConducted;
            
            // Initialize charts with the data
            initializeAttendanceTrendChart(data.trendData);
            initializeAttendanceDistributionChart(data.distributionData);
        } else {
            showToast(data.message || 'Failed to load attendance statistics', 'error');
        }
    } catch (error) {
        console.error('Error initializing attendance reports:', error);
        showToast('Error loading attendance reports', 'error');
    }
}

// Initialize attendance trend chart with real data
function initializeAttendanceTrendChart(trendData = null) {
    const ctx = document.getElementById('attendanceTrendChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.attendanceTrendChart) {
        window.attendanceTrendChart.destroy();
    }
    
    // Use provided data or fallback to sample data
    let labels, data;
    
    if (trendData && trendData.labels && trendData.values) {
        labels = trendData.labels;
        data = trendData.values;
    } else {
        // Sample data as fallback
        const timeframe = document.getElementById('trendTimeframe').value;
        
        if (timeframe === 'week') {
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            data = [85, 82, 78, 80, 75, 88];
        } else if (timeframe === 'month') {
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            data = [82, 78, 75, 80];
        } else {
            labels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            data = [90, 85, 78, 80, 82];
        }
    }
    
    // Create new chart
    window.attendanceTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Attendance %',
                data: data,
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100
                }
            }
        }
    });
}

// Initialize attendance distribution chart with real data
function initializeAttendanceDistributionChart(distributionData = null) {
    const ctx = document.getElementById('attendanceDistributionChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.attendanceDistributionChart) {
        window.attendanceDistributionChart.destroy();
    }
    
    // Use provided data or fallback to sample data
    let data, labels;
    
    if (distributionData && distributionData.values && distributionData.labels) {
        data = distributionData.values;
        labels = distributionData.labels;
    } else {
        // Sample data as fallback
        data = [45, 30, 25];
        labels = ['Excellent (>85%)', 'Good (75-85%)', 'Defaulters (<75%)'];
    }
    
    // Create new chart
    window.attendanceDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#28c76f',
                    '#4361ee',
                    '#ea5455'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

// Make functions available globally
window.notifyDefaulter = notifyDefaulter;
window.viewStudentAttendance = viewStudentAttendance;

// Store chart references
let gradeDistributionChart = null;
let passFailChart = null;
let subjectPerformanceChart = null;

function updateResultsStats(stats) {
    document.getElementById('resultsTotalStudents').textContent = stats.totalStudents || '0';
    document.getElementById('passPercentage').textContent = 
        stats.totalStudents > 0 ? `${((stats.passCount / stats.totalStudents) * 100).toFixed(1)}%` : '0.0%';
    document.getElementById('averageSGPA').textContent = stats.averageSGPA || '0.00';
}

function updateResultsTable(results) {
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';

    if (!results || results.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">
                    <i class="fas fa-info-circle"></i>
                    <p>No results found</p>
                </td>
            </tr>
        `;
        return 0;
    }

    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.rollNumber}</td>
            <td>${result.studentName}</td>
            <td>${result.sgpa}</td>
            <td><span class="badge ${result.result === 'PASS' ? 'success' : 'danger'}">${result.result}</span></td>
            <td>
                <button class="action-btn small" onclick="viewGradeCardById('${result._id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Return the count of results
    return results.length;
}

async function loadResultsAnalysis() {
    try {
        const semester = document.getElementById('resultsSemester').value;
        const subject = document.getElementById('resultsSubject').value;
        
        // Show loading state
        document.getElementById('resultsTableBody').innerHTML = `
            <tr>
                <td colspan="5" class="loading-state">
                    <i class="fas fa-spinner fa-spin"></i> Loading results...
                </td>
            </tr>
        `;
        
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            showToast('Authentication token not found', 'error');
            return;
        }

        const response = await fetch(`http://localhost:5000/api/faculty/results-analysis?semester=${semester}&subject=${subject}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch results');
        }

        const data = await response.json();
        
        if (data.success) {
            // Update the table and get the actual count
            const actualCount = updateResultsTable(data.results);
            
            // Update the stats with the actual count
            const updatedStats = {
                ...data.stats,
                totalStudents: actualCount
            };
            
            // Update the stats display
            updateResultsStats(updatedStats);
            
            // Update charts with the updated stats
            updateResultsCharts(updatedStats);
        } else {
            // Clear the charts
            clearResultsCharts();
            
            // Update the table (will show no data message)
            updateResultsTable([]);
            
            // Reset stats to zero
            updateResultsStats({
                totalStudents: 0,
                passCount: 0,
                failCount: 0,
                averageSGPA: '0.00'
            });
            
            // Show toast with error message
            showToast(data.message || 'No results found', 'info');
        }
    } catch (error) {
        console.error('Error loading results analysis:', error);
        showToast('Failed to load results analysis', 'error');
        
        // Show error message in table
        document.getElementById('resultsTableBody').innerHTML = `
            <tr>
                <td colspan="5" class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading results. Please try again.</p>
                </td>
            </tr>
        `;
        
        // Reset stats to zero on error
        updateResultsStats({
            totalStudents: 0,
            passCount: 0,
            failCount: 0,
            averageSGPA: '0.00'
        });
    }
}

// Helper function to clear charts
function clearResultsCharts() {
    // Clear grade distribution chart
    if (gradeDistributionChart) {
        gradeDistributionChart.destroy();
        gradeDistributionChart = null;
    }
    
    // Clear pass/fail chart
    if (passFailChart) {
        passFailChart.destroy();
        passFailChart = null;
    }
    
    // Clear subject performance chart
    if (subjectPerformanceChart) {
        subjectPerformanceChart.destroy();
        subjectPerformanceChart = null;
    }
}

function updateResultsCharts(stats) {
    // Destroy existing charts if they exist
    if (gradeDistributionChart) {
        gradeDistributionChart.destroy();
    }
    
    if (passFailChart) {
        passFailChart.destroy();
    }
    
    if (subjectPerformanceChart) {
        subjectPerformanceChart.destroy();
    }
    
    // Grade Distribution Chart
    const gradeCtx = document.getElementById('gradeDistributionChart').getContext('2d');
    gradeDistributionChart = new Chart(gradeCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(stats.gradeDistribution),
            datasets: [{
                label: 'Number of Grades',
                data: Object.values(stats.gradeDistribution),
                backgroundColor: '#4361ee'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Pass/Fail Chart
    const passFailCtx = document.getElementById('passFailChart').getContext('2d');
    passFailChart = new Chart(passFailCtx, {
        type: 'pie',
        data: {
            labels: ['Pass', 'Fail'],
            datasets: [{
                data: [stats.passCount, stats.failCount],
                backgroundColor: ['#28c76f', '#ea5455']
            }]
        },
        options: {
            responsive: true
        }
    });
    
    // Subject Performance Chart (only show when no specific subject is selected)
    if (stats.subjectPerformance && Object.keys(stats.subjectPerformance).length > 0) {
        const subjectCtx = document.getElementById('subjectPerformanceChart').getContext('2d');
        
        // Prepare data for the chart
        const subjects = Object.keys(stats.subjectPerformance);
        const averageMarks = subjects.map(subject => stats.subjectPerformance[subject].average);
        const passRates = subjects.map(subject => stats.subjectPerformance[subject].passRate * 100);
        
        subjectPerformanceChart = new Chart(subjectCtx, {
            type: 'bar',
            data: {
                labels: subjects,
                datasets: [
                    {
                        label: 'Average Marks',
                        data: averageMarks,
                        backgroundColor: '#4361ee',
                        yAxisID: 'y'
                    },
                    {
                        label: 'Pass Rate (%)',
                        data: passRates,
                        backgroundColor: '#28c76f',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Average Marks'
                        },
                        max: 100
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Pass Rate (%)'
                        },
                        max: 100,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
        
        // Show the subject performance section
        document.getElementById('subjectPerformanceSection').style.display = 'block';
    } else {
        // Hide the subject performance section if no data
        document.getElementById('subjectPerformanceSection').style.display = 'none';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Try to get faculty department from profile
    const departmentElement = document.getElementById('department');
    if (departmentElement && departmentElement.textContent && departmentElement.textContent !== 'Loading...') {
        // Extract department code from text (e.g., "Computer Science" -> "CS")
        let deptText = departmentElement.textContent;
        let deptCode = '';
        
        if (deptText.includes('Computer Science')) {
            deptCode = 'CS';
        } else if (deptText.includes('Information Technology')) {
            deptCode = 'IT';
        } else if (deptText.includes('AI') || deptText.includes('Machine Learning')) {
            deptCode = 'AIML';
        } else if (deptText.includes('Electronics')) {
            deptCode = 'EC';
        }
        
        if (deptCode) {
            localStorage.setItem('facultyDepartment', deptCode);
            console.log('Department code stored:', deptCode);
        }
    }
    
    // Add event listener for semester selection to update subject dropdown in results section
    const resultsSemesterSelect = document.getElementById('resultsSemester');
    if (resultsSemesterSelect) {
        resultsSemesterSelect.addEventListener('change', function() {
            populateSubjectsDropdown(this.value);
        });
    }
    
    // Add event listener for attendance semester selection
    const attendanceSemesterSelect = document.getElementById('attendanceSemester');
    if (attendanceSemesterSelect) {
        attendanceSemesterSelect.addEventListener('change', function() {
            populateAttendanceSubjectDropdown(this.value);
        });
    }
    
    // Add event listener for marks semester selection
    const marksSemesterSelect = document.getElementById('semesterSelect');
    if (marksSemesterSelect) {
        marksSemesterSelect.addEventListener('change', function() {
            populateMarksSubjectDropdown(this.value);
        });
    }
    
    // Initialize other components
    initializeAttendanceSection();
});

// Function to show toast messages
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="${getToastIcon(type)}"></i>
            <div class="toast-message">${message}</div>
        </div>
        <i class="fas fa-times toast-close"></i>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

async function fetchExistingMarks(rollNumber, subject, semester) {
    try {
        // If called without parameters, try to get them from the form
        if (!rollNumber) {
            const seatNumberInput = document.getElementById('seatNumberInput');
            rollNumber = seatNumberInput?.value?.trim();
        }
        
        if (!subject) {
            const subjectSelect = document.getElementById('subjectSelect');
            subject = subjectSelect?.value;
        }
        
        if (!semester) {
            const semesterSelect = document.getElementById('semesterSelect');
            semester = semesterSelect?.value;
        }
        
        // If we still don't have the necessary data, exit gracefully
        if (!rollNumber || !subject || !semester) {
            console.log('Missing data for fetching marks:', { rollNumber, subject, semester });
            return;
        }
        
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            console.error('No token found for authentication');
            return;
        }
        
        console.log(`Fetching marks for student ${rollNumber}, subject ${subject}, semester ${semester}`);
        
        const response = await fetch(`http://localhost:5000/api/faculty/marks/${rollNumber}/${subject}/${semester}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch marks: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.marks) {
            console.log('Marks data received:', data.marks);
            
            // Fill in existing marks in the form
            const semesterMarks = document.getElementById('semesterMarks');
            const internalMarks = document.getElementById('internalMarks');
            const practicalMarks = document.getElementById('practicalMarks');
            const termworkMarks = document.getElementById('termworkMarks');
            
            if (semesterMarks) semesterMarks.value = data.marks.semester || '';
            if (internalMarks) internalMarks.value = data.marks.internal || '';
            if (practicalMarks) practicalMarks.value = data.marks.practical || '';
            if (termworkMarks) termworkMarks.value = data.marks.termwork || '';
            
            // If this function was called with subject cards, update those too
            const card = document.querySelector(`.subject-card[data-subject-code="${subject}"]`);
            if (card) {
                card.querySelector('.semester-marks').value = data.marks.semester || '';
                card.querySelector('.internal-marks').value = data.marks.internal || '';
                card.querySelector('.practical-marks').value = data.marks.practical || '';
                card.querySelector('.termwork-marks').value = data.marks.termwork || '';
            }
        } else {
            console.log('No existing marks found or marks data empty');
        }
    } catch (error) {
        console.error('Error fetching existing marks:', error);
    }
}

// Function to search for student in attendance section
function searchAttendanceStudent() {
    const searchQuery = document.getElementById('attendanceStudentSearch').value.trim().toLowerCase();
    console.log('Searching for student:', searchQuery);
    
    if (!searchQuery) {
        alert('Please enter a name or seat number to search');
        return;
    }
    
    // Get filters
    const semester = document.getElementById('attendanceSemester').value;
    const subject = document.getElementById('attendanceSubject').value;
    const batch = document.getElementById('attendanceBatch').value;
    
    if (!semester || !subject) {
        alert('Please select both semester and subject');
        return;
    }
    
    // In a real application, this would fetch from the server
    // For now, we'll simulate finding a student
    const foundStudent = {
        name: 'John Smith',
        seatNo: '12345',
        branch: 'Computer Engineering',
        semester: semester,
        attendance: {
            theory: {
                attended: 32,
                total: 40
            },
            practical: {
                attended: 12,
                total: 15
            }
        }
    };
    
    // Display the attendance form
    displayStudentAttendance(foundStudent);
}

// Function to load defaulters list
function loadDefaultersList() {
    console.log('Loading defaulters list');
    const defaultersList = document.getElementById('defaultersList');
    
    // Get filters
    const semester = document.getElementById('attendanceSemester').value;
    const subject = document.getElementById('attendanceSubject').value;
    const batch = document.getElementById('attendanceBatch').value;
    
    if (!semester || !subject) {
        defaultersList.innerHTML = '<div class="empty-state">Please select both semester and subject to view defaulters</div>';
        return;
    }
    
    // Simulate loading data
    // In a real application, this would fetch from the server
    const defaulters = [
        { name: 'Alice Johnson', seatNo: '12001', percentage: 65, branch: 'CS' },
        { name: 'Bob Williams', seatNo: '12002', percentage: 52, branch: 'CS' },
        { name: 'Charlie Brown', seatNo: '12003', percentage: 70, branch: 'CS' },
    ];
    
    if (defaulters.length === 0) {
        defaultersList.innerHTML = '<div class="empty-state">No defaulters found for selected criteria</div>';
        return;
    }
    
    // Create defaulters table
    let html = `
        <table class="attendance-table">
            <thead>
                <tr>
                    <th>Seat No</th>
                    <th>Name</th>
                    <th>Branch</th>
                    <th>Attendance</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    defaulters.forEach(student => {
        html += `
            <tr>
                <td>${student.seatNo}</td>
                <td>${student.name}</td>
                <td>${student.branch}</td>
                <td><span class="percentage ${student.percentage < 60 ? 'danger' : 'warning'}">${student.percentage}%</span></td>
                <td>
                    <button class="action-btn small" onclick="notifyStudentAboutAttendance('${student.seatNo}')">
                        <i class="fas fa-envelope"></i> Notify
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    defaultersList.innerHTML = html;
}

// Function to notify a specific student about attendance
function notifyStudentAboutAttendance(seatNo) {
    console.log('Notifying student with seat number:', seatNo);
    alert(`Notification sent to student with seat number: ${seatNo}`);
}

// Function to notify all defaulters
function notifyDefaulters() {
    console.log('Notifying all defaulters');
    alert('Notifications sent to all defaulters');
}

// Function to print defaulters list
function printDefaulters() {
    console.log('Printing defaulters list');
    window.print();
}

// Function to load attendance reports
function loadAttendanceReports() {
    console.log('Loading attendance reports');
    
    // Get filters
    const semester = document.getElementById('attendanceSemester').value;
    const subject = document.getElementById('attendanceSubject').value;
    
    if (!semester || !subject) {
        // Display message in report cards
        document.getElementById('averageAttendance').textContent = 'N/A';
        document.getElementById('defaultersCount').textContent = 'N/A';
        document.getElementById('lecturesConducted').textContent = 'N/A';
        return;
    }
    
    // Simulate loading data
    // In a real application, this would fetch from the server
    document.getElementById('averageAttendance').textContent = '78%';
    document.getElementById('defaultersCount').textContent = '12';
    document.getElementById('lecturesConducted').textContent = '42';
    
    // Initialize charts
    initializeAttendanceCharts();
}

// Function to initialize attendance charts
function initializeAttendanceCharts() {
    // Attendance trend chart
    const trendCtx = document.getElementById('attendanceTrendChart').getContext('2d');
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            datasets: [{
                label: 'Average Attendance (%)',
                data: [82, 78, 76, 80, 75, 78, 80, 82],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
    
    // Attendance distribution chart
    const distributionCtx = document.getElementById('attendanceDistributionChart').getContext('2d');
    new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['90-100%', '75-89%', '60-74%', 'Below 60%'],
            datasets: [{
                data: [20, 45, 25, 10],
                backgroundColor: [
                    '#28c76f',
                    '#4361ee',
                    '#ff9f43',
                    '#ea5455'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

// Function to update attendance trend chart based on timeframe
function updateAttendanceTrendChart(timeframe) {
    console.log('Updating trend chart with timeframe:', timeframe);
    // In a real application, this would fetch new data based on the timeframe
    // For now, just log the action
}

// Function to export attendance report
function exportAttendanceReport() {
    console.log('Exporting attendance report');
    alert('Attendance report exported successfully');
}

// Add this function to load supervision allocations
function loadSupervisionAllocations() {
    const allocationsContainer = document.getElementById('supervisionAllocationsContainer');
    
    // Show loading state
    allocationsContainer.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-circle-notch fa-spin"></i>
            <p>Loading your supervision allocations...</p>
        </div>
    `;
    
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    fetch('http://localhost:5000/api/faculty/supervisor-allocations', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (!data.success || !data.allocations || data.allocations.length === 0) {
            allocationsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No supervision allocations found</p>
                    <span>You haven't been assigned any supervision duties yet.</span>
                </div>
            `;
            return;
        }
        
        console.log("Supervision allocations:", data.allocations);
        
        // Group allocations by date
        const groupedAllocations = {};
        
        data.allocations.forEach(allocation => {
            // Ensure allocation has all required fields
            if (!allocation.classroom || !allocation.paper || !allocation.examDate || !allocation.examTime) {
                console.warn("Skipping incomplete allocation:", allocation);
                return;
            }
            
            // Format the date
            const date = new Date(allocation.examDate).toLocaleDateString();
            
            if (!groupedAllocations[date]) {
                groupedAllocations[date] = [];
            }
            
            // Ensure classroom has building and room properties
            if (typeof allocation.classroom === 'string') {
                const parts = allocation.classroom.split('-');
                allocation.classroom = {
                    building: parts[0] || 'Unknown',
                    room: parts[1] || 'Unknown'
                };
            }
            
            // Ensure paper has code and name properties
            if (typeof allocation.paper === 'string') {
                allocation.paper = {
                    code: allocation.paper,
                    name: allocation.paper
                };
            }
            
            groupedAllocations[date].push(allocation);
        });
        
        // Create HTML for allocations
        let allocationsHTML = '';
        
        Object.keys(groupedAllocations).sort((a, b) => new Date(a) - new Date(b)).forEach(date => {
            allocationsHTML += `
                <div class="allocation-date-group">
                    <div class="allocation-date">
                        <i class="fas fa-calendar-day"></i>
                        <span>${date}</span>
                    </div>
                    <div class="allocation-cards">
                        ${groupedAllocations[date].map(allocation => `
                            <div class="allocation-card" data-allocation='${JSON.stringify({
                                classroom: allocation.classroom,
                                paper: allocation.paper,
                                examDate: allocation.examDate,
                                examTime: allocation.examTime
                            })}'>
                                <div class="allocation-time">
                                    <i class="fas fa-clock"></i>
                                    <span>${allocation.examTime}</span>
                                </div>
                                <div class="allocation-paper">
                                    <h4>${allocation.paper.name}</h4>
                                    <span class="paper-code">${allocation.paper.code}</span>
                                </div>
                                <div class="allocation-location">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <div>
                                        <span class="building">${allocation.classroom.building}</span>
                                        <span class="room">Room ${allocation.classroom.room}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        allocationsContainer.innerHTML = allocationsHTML;
        
        // Add click event listeners to allocation cards
        document.querySelectorAll('.allocation-card').forEach(card => {
            card.addEventListener('click', function() {
                try {
                    const allocationData = JSON.parse(this.dataset.allocation);
                    console.log("Clicked allocation:", allocationData);
                    showStudentListModal(
                        allocationData.classroom,
                        allocationData.paper,
                        allocationData.examDate,
                        allocationData.examTime
                    );
                } catch (error) {
                    console.error("Error parsing allocation data:", error);
                    alert("Error loading student list. Please try again.");
                }
            });
        });
    })
    .catch(error => {
        console.error('Error fetching supervision allocations:', error);
        allocationsContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load supervision allocations</p>
                <span>${error.message}</span>
            </div>
        `;
    });
}

// Make the function available globally
window.loadSupervisionAllocations = loadSupervisionAllocations;

// Function to show the student list modal
function showStudentListModal(classroom, paper, examDate, examTime) {
    const modal = document.getElementById('studentListModal');
    const modalRoomTitle = document.getElementById('modalRoomTitle');
    const modalPaperCode = document.getElementById('modalPaperCode');
    const modalPaperName = document.getElementById('modalPaperName');
    const modalExamDate = document.getElementById('modalExamDate');
    const modalExamTime = document.getElementById('modalExamTime');
    const studentListContainer = document.getElementById('studentListContainer');
    
    // Set modal title and details
    modalRoomTitle.textContent = `Students in ${classroom.building} Room ${classroom.room}`;
    modalPaperCode.textContent = paper.code;
    modalPaperName.textContent = paper.name;
    modalExamDate.textContent = new Date(examDate).toLocaleDateString();
    modalExamTime.textContent = examTime;
    
    // Show loading state
    studentListContainer.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-circle-notch fa-spin"></i>
            <p>Loading students...</p>
        </div>
    `;
    
    // Show the modal
    modal.classList.add('show');
    
    // Fetch students for this classroom
    fetchStudentsInClassroom(classroom, paper.code, examDate, examTime);
}

// Function to fetch students allocated to a classroom
function fetchStudentsInClassroom(classroom, paperCode, examDate, examTime) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        showToast('Authentication token not found. Please login again.', 'error');
        return;
    }
    
    const formattedDate = new Date(examDate).toISOString().split('T')[0];
    
    fetch(`http://localhost:5000/api/faculty/classroom-students`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            building: classroom.building,
            room: classroom.room,
            paperCode: paperCode,
            examDate: formattedDate,
            examTime: examTime
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const studentListContainer = document.getElementById('studentListContainer');
        const modalStudentCount = document.getElementById('modalStudentCount');
        
        if (!data.success || !data.students || data.students.length === 0) {
            studentListContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-slash"></i>
                    <p>No students found</p>
                    <span>There are no students allocated to this classroom for this exam.</span>
                </div>
            `;
            modalStudentCount.textContent = '0 Students';
            return;
        }
        
        // Update student count
        modalStudentCount.textContent = `${data.students.length} Students`;
        
        // Create table with student data
        let tableHTML = `
            <table class="student-list-table">
                <thead>
                    <tr>
                        <th>Hall Ticket No.</th>
                        <th>Student Name</th>
                        <th>Branch</th>
                        <th>Semester</th>
                        <th>Bench No.</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        data.students.forEach(student => {
            tableHTML += `
                <tr>
                    <td>${student.hallTicketNumber}</td>
                    <td>${student.studentName}</td>
                    <td>${student.branch}</td>
                    <td>${student.semester}</td>
                    <td><span class="bench-number">${student.benchNumber.number}</span></td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        studentListContainer.innerHTML = tableHTML;
    })
    .catch(error => {
        console.error('Error fetching students in classroom:', error);
        const studentListContainer = document.getElementById('studentListContainer');
        studentListContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load students</p>
                <span>${error.message}</span>
            </div>
        `;
    });
}

// Add event listener for closing the student list modal
document.addEventListener('DOMContentLoaded', function() {
    const closeStudentListBtn = document.getElementById('closeStudentListBtn');
    const studentListModal = document.getElementById('studentListModal');
    
    if (closeStudentListBtn && studentListModal) {
        closeStudentListBtn.addEventListener('click', function() {
            studentListModal.classList.remove('show');
        });
        
        // Close modal when clicking outside the content
        studentListModal.addEventListener('click', function(event) {
            if (event.target === studentListModal) {
                studentListModal.classList.remove('show');
            }
        });
    }
});

// Make the functions available globally
window.loadSupervisionAllocations = loadSupervisionAllocations;
window.showStudentListModal = showStudentListModal;
window.fetchStudentsInClassroom = fetchStudentsInClassroom;

// Function to fetch students in a classroom
async function fetchStudentsInClassroom(classroom, paperCode, examDate, examTime) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // First, try to get existing attendance data
        const attendanceResponse = await fetch('http://localhost:5000/api/faculty/get-attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                building: classroom.building,
                room: classroom.room,
                paperCode: paperCode,
                examDate: examDate,
                examTime: examTime
            })
        });
        
        const attendanceData = await attendanceResponse.json();
        let existingAttendance = null;
        
        if (attendanceData.success && attendanceData.attendance) {
            console.log("Found existing attendance data:", attendanceData.attendance);
            existingAttendance = attendanceData.attendance;
        }
        
        // Now fetch the student list
        const response = await fetch('http://localhost:5000/api/faculty/classroom-students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                building: classroom.building,
                room: classroom.room,
                paperCode: paperCode,
                examDate: examDate,
                examTime: examTime
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }
        
        const data = await response.json();
        
        // If we have existing attendance data, merge it with the student list
        if (existingAttendance && existingAttendance.students) {
            // Create a map of hall ticket numbers to attendance status
            const attendanceMap = {};
            existingAttendance.students.forEach(student => {
                attendanceMap[student.hallTicketNumber] = student.isPresent;
            });
            
            // Apply the attendance status to the student list
            return data.students.map(student => {
                return {
                    ...student,
                    // Use the existing attendance status if available, otherwise default to present
                    isPresent: attendanceMap[student.hallTicketNumber] !== undefined 
                        ? attendanceMap[student.hallTicketNumber] 
                        : true
                };
            });
        }
        
        // If no existing attendance, return students with default present status
        return data.students;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

// Function to show the student list modal with attendance marking
function showStudentListModal(classroom, paper, examDate, examTime) {
    const modal = document.getElementById('studentListModal');
    const modalRoomTitle = document.getElementById('modalRoomTitle');
    const modalPaperCode = document.getElementById('modalPaperCode');
    const modalPaperName = document.getElementById('modalPaperName');
    const modalExamDate = document.getElementById('modalExamDate');
    const modalExamTime = document.getElementById('modalExamTime');
    const studentListContainer = document.getElementById('studentListContainer');
    
    // Store the current classroom and exam info for later use
    currentExamInfo = {
        classroom,
        paper,
        examDate,
        examTime
    };
    
    console.log("Current exam info:", currentExamInfo);
    
    // Set modal title and details
    modalRoomTitle.textContent = `Students in ${classroom.building} Room ${classroom.room}`;
    modalPaperCode.textContent = paper.code;
    modalPaperName.textContent = paper.name;
    modalExamDate.textContent = new Date(examDate).toLocaleDateString();
    modalExamTime.textContent = examTime;
    
    // Show loading state
    studentListContainer.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-circle-notch fa-spin"></i>
            <p>Loading students...</p>
        </div>
    `;
    
    // Show the modal
    modal.classList.add('show');
    
    // Fetch students for this classroom
    fetchStudentsInClassroom(classroom, paper.code, examDate, examTime)
        .then(students => {
            // Store students globally for attendance tracking
            currentStudents = students.map(student => ({
                ...student,
                // Use the isPresent value from the fetched data, which may include existing attendance
                isPresent: student.isPresent !== undefined ? student.isPresent : true
            }));
            
            console.log("Loaded students with attendance:", currentStudents);
            
            // Update student count
            document.getElementById('modalStudentCount').textContent = `${students.length} Students`;
            
            // If no students found
            if (students.length === 0) {
                studentListContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-user-slash"></i>
                        <p>No students allocated to this classroom</p>
                    </div>
                `;
                return;
            }
            
            // Create table with attendance toggles
            let tableHTML = `
                <table class="student-list-table">
                    <thead>
                        <tr>
                            <th>Bench</th>
                            <th>Hall Ticket</th>
                            <th>Name</th>
                            <th>Branch</th>
                            <th>Semester</th>
                            <th>Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            students.forEach((student, index) => {
                const isPresentClass = student.isPresent ? 'present' : '';
                const attendanceStatus = student.isPresent ? 'Present' : 'Absent';
                
                tableHTML += `
                    <tr data-index="${index}">
                        <td><span class="bench-number">${student.benchNumber?.number || 'N/A'}</span></td>
                        <td>${student.hallTicketNumber}</td>
                        <td>${student.studentName}</td>
                        <td>${student.branch}</td>
                        <td>${student.semester}</td>
                        <td>
                            <div class="attendance-cell">
                                <div class="attendance-toggle ${isPresentClass}" onclick="toggleAttendance(${index})"></div>
                                <span class="attendance-status ${isPresentClass}">${attendanceStatus}</span>
                            </div>
                        </td>
                    </tr>
                `;
            });
            
            tableHTML += `
                    </tbody>
                </table>
            `;
            
            studentListContainer.innerHTML = tableHTML;
        })
        .catch(error => {
            console.error('Error fetching students:', error);
            studentListContainer.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load students</p>
                    <span>${error.message}</span>
                </div>
            `;
        });
}

// Global variables to store current exam info and students
let currentExamInfo = null;
let currentStudents = [];

// Function to toggle attendance for a student
function toggleAttendance(index) {
    if (!currentStudents[index]) return;
    
    // Toggle the present status
    currentStudents[index].isPresent = !currentStudents[index].isPresent;
    
    // Update the UI
    const row = document.querySelector(`tr[data-index="${index}"]`);
    const toggle = row.querySelector('.attendance-toggle');
    const status = row.querySelector('.attendance-status');
    
    if (currentStudents[index].isPresent) {
        toggle.classList.add('present');
        status.classList.remove('absent');
        status.classList.add('present');
        status.textContent = 'Present';
    } else {
        toggle.classList.remove('present');
        status.classList.remove('present');
        status.classList.add('absent');
        status.textContent = 'Absent';
    }
}

// Function to mark all students as present
function markAllPresent() {
    currentStudents.forEach((student, index) => {
        student.isPresent = true;
        
        // Update UI
        const row = document.querySelector(`tr[data-index="${index}"]`);
        if (row) {
            const toggle = row.querySelector('.attendance-toggle');
            const status = row.querySelector('.attendance-status');
            
            toggle.classList.add('present');
            status.classList.remove('absent');
            status.classList.add('present');
            status.textContent = 'Present';
        }
    });
}

// Function to save attendance
async function saveAttendance() {
    try {
        if (!currentExamInfo || !currentStudents || currentStudents.length === 0) {
            console.error("Missing current exam info or students");
            alert("No student data available to save");
            return;
        }
        
        const saveBtn = document.getElementById('saveAttendanceBtn');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // Prepare attendance data
        const attendanceData = {
            classroom: currentExamInfo.classroom,
            paper: currentExamInfo.paper,
            examDate: currentExamInfo.examDate,
            examTime: currentExamInfo.examTime,
            students: currentStudents.map(student => ({
                hallTicketNumber: student.hallTicketNumber,
                studentName: student.studentName,
                isPresent: student.isPresent
            }))
        };
        
        console.log("Sending attendance data:", JSON.stringify(attendanceData));
        
        // Send to server
        const response = await fetch('http://localhost:5000/api/faculty/save-attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(attendanceData)
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to save attendance');
        }
        
        console.log("Attendance saved successfully:", data);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Attendance saved successfully!</span>
        `;
        
        // Insert before the student list container
        const studentListContainer = document.getElementById('studentListContainer');
        studentListContainer.parentNode.insertBefore(successMessage, studentListContainer);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
        
        // Reset button
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Attendance';
        
    } catch (error) {
        console.error('Error saving attendance:', error);
        
        // Reset button
        const saveBtn = document.getElementById('saveAttendanceBtn');
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Attendance';
        
        // Show error message
        alert('Failed to save attendance: ' + error.message);
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Existing event listeners...
    
    // Add event listener for mark all present button
    const markAllPresentBtn = document.getElementById('markAllPresentBtn');
    if (markAllPresentBtn) {
        markAllPresentBtn.addEventListener('click', markAllPresent);
    }
    
    // Add event listener for save attendance button
    const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');
    if (saveAttendanceBtn) {
        saveAttendanceBtn.addEventListener('click', saveAttendance);
    }
});

// Make the functions available globally
window.toggleAttendance = toggleAttendance;

// Add this function to generate and download the attendance report
async function downloadAttendanceReport() {
    try {
        if (!currentExamInfo || !currentStudents || currentStudents.length === 0) {
            console.error("Missing current exam info or students");
            alert("No student data available to download");
            return;
        }
        
        const downloadBtn = document.getElementById('downloadAttendanceBtn');
        downloadBtn.disabled = true;
        
        // Add a progress indicator
        const progressSpan = document.createElement('span');
        progressSpan.className = 'download-progress';
        progressSpan.textContent = 'Preparing PDF...';
        downloadBtn.appendChild(progressSpan);
        
        // Call the PDF download function directly
        await downloadAttendancePDF();
        
        // Reset button state
        downloadBtn.removeChild(progressSpan);
        downloadBtn.disabled = false;
        
    } catch (error) {
        console.error('Error downloading attendance report:', error);
        
        // Reset button state
        const downloadBtn = document.getElementById('downloadAttendanceBtn');
        const progressSpan = downloadBtn.querySelector('.download-progress');
        if (progressSpan) {
            downloadBtn.removeChild(progressSpan);
        }
        downloadBtn.disabled = false;
        
        // Show error message
        alert(`Failed to download attendance report: ${error.message}`);
    }
}

// Add this to your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Existing event listeners...
    
    // Add event listener for download attendance report button
    const downloadAttendanceBtn = document.getElementById('downloadAttendanceBtn');
    if (downloadAttendanceBtn) {
        downloadAttendanceBtn.addEventListener('click', downloadAttendanceReport);
    }
    
    // Add event listener for close student list modal button
    const closeStudentListBtn = document.getElementById('closeStudentListBtn');
    if (closeStudentListBtn) {
        closeStudentListBtn.addEventListener('click', function() {
            document.getElementById('studentListModal').classList.remove('show');
        });
    }
});

// Make the download function available globally
window.downloadAttendanceReport = downloadAttendanceReport;

// Enhanced PDF generation function without the verification code
async function downloadAttendancePDF() {
    try {
        if (!currentExamInfo || !currentStudents || currentStudents.length === 0) {
            console.error("Missing current exam info or students");
            alert("No student data available to download");
            return;
        }
        
        // First, dynamically load the jsPDF library if it's not already loaded
        if (typeof jsPDF === 'undefined') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js');
        }
        
        // Create a new PDF document
        const doc = new jspdf.jsPDF();
        
        // Define colors for a professional look
        const primaryColor = [67, 97, 238];
        const secondaryColor = [45, 52, 54];
        const accentColor = [52, 152, 219];
        const successColor = [46, 204, 113];
        const dangerColor = [231, 76, 60];
        
        // Add university logo/header
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('EXAM CENTRAL', doc.internal.pageSize.width / 2, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('Attendance Report', doc.internal.pageSize.width / 2, 30, { align: 'center' });
        
        // Add a decorative line
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.setLineWidth(0.5);
        doc.line(14, 45, doc.internal.pageSize.width - 14, 45);
        
        // Add exam information in an elegant box
        doc.setFillColor(248, 249, 250);
        doc.roundedRect(14, 50, doc.internal.pageSize.width - 28, 50, 3, 3, 'F');
        
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Exam Information', 20, 60);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // Two-column layout for exam info
        const leftCol = 20;
        const rightCol = doc.internal.pageSize.width / 2 + 10;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Paper Code:', leftCol, 70);
        doc.text('Paper Name:', leftCol, 78);
        doc.text('Exam Date:', leftCol, 86);
        
        doc.text('Exam Time:', rightCol, 70);
        doc.text('Venue:', rightCol, 78);
        doc.text('Room:', rightCol, 86);
        
        doc.setFont('helvetica', 'normal');
        doc.text(currentExamInfo.paper.code, leftCol + 30, 70);
        doc.text(currentExamInfo.paper.name, leftCol + 30, 78);
        doc.text(new Date(currentExamInfo.examDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }), leftCol + 30, 86);
        
        doc.text(currentExamInfo.examTime, rightCol + 30, 70);
        doc.text(currentExamInfo.classroom.building, rightCol + 30, 78);
        doc.text(currentExamInfo.classroom.room, rightCol + 30, 86);
        
        // Add faculty information in an elegant box
        doc.setFillColor(248, 249, 250);
        doc.roundedRect(14, 105, doc.internal.pageSize.width - 28, 40, 3, 3, 'F');
        
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Faculty Information', 20, 115);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Name:', leftCol, 125);
        
        
        doc.text('Department:', rightCol, 125);
        doc.text('Role:', rightCol, 133);
        
        doc.setFont('helvetica', 'normal');
        doc.text(facultyData.name || 'Faculty', leftCol + 30, 125);
     
        
        doc.text(facultyData.department || 'Unknown', rightCol + 30, 125);
        doc.text('Exam Supervisor', rightCol + 30, 133);
        
        // Add attendance summary with visual indicators
        doc.setFillColor(248, 249, 250);
        doc.roundedRect(14, 150, doc.internal.pageSize.width - 28, 50, 3, 3, 'F');
        
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Attendance Summary', 20, 160);
        
        // Calculate attendance statistics
        const presentCount = currentStudents.filter(s => s.isPresent).length;
        const absentCount = currentStudents.filter(s => !s.isPresent).length;
        const attendancePercentage = Math.round((presentCount / currentStudents.length) * 100);
        
        // Draw attendance percentage as a circular progress indicator
        const centerX = doc.internal.pageSize.width - 50;
        const centerY = 175;
        const radius = 15;
        
        // Background circle
        doc.setDrawColor(220, 220, 220);
        doc.setFillColor(240, 240, 240);
        doc.circle(centerX, centerY, radius, 'FD');
        
        // Progress arc (filled portion)
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
        
        // Draw the progress as a filled circle with percentage text
        doc.circle(centerX, centerY, radius, 'FD');
        
        // Add percentage text in the center
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${attendancePercentage}%`, centerX, centerY + 3, { align: 'center' });
        
        // Add attendance statistics
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Total Students:', leftCol, 170);
        doc.text('Present:', leftCol, 178);
        doc.text('Absent:', leftCol, 186);
        
        doc.setFont('helvetica', 'normal');
        doc.text(currentStudents.length.toString(), leftCol + 40, 170);
        
        // Use color for present count (green)
        doc.setTextColor(successColor[0], successColor[1], successColor[2]);
        doc.text(presentCount.toString(), leftCol + 40, 178);
        
        // Use color for absent count (red)
        doc.setTextColor(dangerColor[0], dangerColor[1], dangerColor[2]);
        doc.text(absentCount.toString(), leftCol + 40, 186);
        
        // Reset text color
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        
        // Add student attendance table with elegant styling
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Student Attendance Details', 14, 210);
        
        // Prepare table data
        const tableColumn = ['Hall Ticket', 'Student Name', 'Branch', 'Semester', 'Bench', 'Status'];
        const tableRows = currentStudents.map(student => [
            student.hallTicketNumber,
            student.studentName,
            student.branch || 'N/A',
            student.semester || 'N/A',
            student.benchNumber?.number || 'N/A',
            student.isPresent ? 'Present' : 'Absent'
        ]);
        
        // Generate the table with elegant styling
        doc.autoTable({
            startY: 215,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: { 
                fontSize: 9,
                cellPadding: 3,
                lineColor: [220, 220, 220],
                lineWidth: 0.1
            },
            headStyles: { 
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center'
            },
            alternateRowStyles: { 
                fillColor: [248, 249, 250]
            },
            columnStyles: {
                0: { cellWidth: 30 }, // Hall Ticket
                1: { cellWidth: 50 }, // Student Name
                5: { halign: 'center' } // Status
            },
            rowStyles: row => {
                if (!currentStudents[row.index].isPresent) {
                    return { 
                        textColor: dangerColor,
                        fontStyle: 'bold'
                    };
                }
                return {};
            },
            didDrawCell: (data) => {
                // Add a green checkmark for present students or red X for absent
                if (data.column.index === 5 && data.cell.section === 'body') {
                    const isPresent = currentStudents[data.row.index].isPresent;
                    const text = isPresent ? '✓' : '✗';
                    const textColor = isPresent ? successColor : dangerColor;
                    
                    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.text(text, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2 + 1, {
                        align: 'center'
                    });
                }
            }
        });
        
        // Add a decorative footer
        const pageHeight = doc.internal.pageSize.height;
        
        // Footer background
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.1);
        doc.rect(0, pageHeight - 20, doc.internal.pageSize.width, 20, 'F');
        
        // Add footer text
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, pageHeight - 10);
        
        // Add page numbers to all pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.setFontSize(8);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, pageHeight - 10);
            
            // Add watermark if not the first page
            if (i > 1) {
                doc.setTextColor(200, 200, 200);
                doc.setFontSize(60);
                doc.setFont('helvetica', 'bold');
                doc.text('EXAM CENTRAL', doc.internal.pageSize.width / 2, doc.internal.pageSize.height / 2, {
                    align: 'center',
                    angle: 45
                });
            }
        }
        
        // Save the PDF
        doc.save(`attendance_report_${currentExamInfo.paper.code}_${new Date(currentExamInfo.examDate).toLocaleDateString().replace(/\//g, '-')}.pdf`);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Elegant PDF report downloaded successfully!</span>
        `;
        
        // Insert before the student list container
        const studentListContainer = document.getElementById('studentListContainer');
        studentListContainer.parentNode.insertBefore(successMessage, studentListContainer);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
        
    } catch (error) {
        console.error('Error generating PDF report:', error);
        alert('Failed to generate PDF report: ' + error.message);
    }
}

// Helper function to load external scripts
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Add these functions to your faculty.js file

// Show the bulk grade card generation modal
async function showGenerateAllGradeCards() {
    const modal = document.getElementById('bulkGradeCardModal');
    const tableBody = document.getElementById('bulkGenerationTableBody');
    tableBody.innerHTML = '';
    
    try {
        // Get students from the current faculty's assigned students
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        // Changed endpoint from /students to /my-students
        const response = await fetch('http://localhost:5000/api/faculty/my-students', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }
        
        const data = await response.json();
        
        if (data.success && data.students && data.students.length > 0) {
            // Added logging to debug the response
            console.log('Fetched students:', data.students);
            
            data.students.forEach(student => {
                const row = document.createElement('tr');
                // Using optional chaining to prevent undefined errors
                row.innerHTML = `
                    <td>${student?.seatNo || student?.rollNumber || 'N/A'}</td>
                    <td>${student?.name || 'N/A'}</td>
                    <td><span class="status-pending">Pending</span></td>
                `;
                row.dataset.seatNo = student?.seatNo || student?.rollNumber;
                tableBody.appendChild(row);
            });
            
            modal.style.display = 'flex';
        } else {
            showToast('No students found', 'warning');
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        showToast('Failed to fetch students. Please try again.', 'error');
    }
}

// Close the bulk grade card generation modal
function closeBulkGradeCardModal() {
    const modal = document.getElementById('bulkGradeCardModal');
    modal.style.display = 'none';
    
    // Reset progress
    document.querySelector('.generation-progress').style.display = 'none';
    document.getElementById('downloadSummaryBtn').style.display = 'none';
    document.getElementById('generationProgressBar').style.width = '0%';
}

// Start the bulk generation process
async function startBulkGeneration() {
    const semester = document.getElementById('bulkGradeCardSemester').value;
    if (!semester) {
        showToast('Please select a semester', 'error');
        return;
    }
    
    const rows = document.getElementById('bulkGenerationTableBody').getElementsByTagName('tr');
    const totalStudents = rows.length;
    let completedCount = 0;
    
    // Show progress elements
    document.querySelector('.generation-progress').style.display = 'block';
    document.getElementById('progressCount').textContent = `0/${totalStudents} Complete`;
    
    // Process each student
    for (const row of rows) {
        const seatNo = row.dataset.seatNo;
        const statusCell = row.querySelector('td:last-child span');
        
        try {
            statusCell.className = 'status-processing';
            statusCell.textContent = 'Processing...';
            
            // Generate grade card for the student
            const result = await generateGradeCardForStudent(seatNo, semester);
            
            if (result.success) {
                statusCell.className = 'status-success';
                statusCell.textContent = 'Complete';
            } else {
                statusCell.className = 'status-error';
                statusCell.textContent = 'Failed';
            }
        } catch (error) {
            statusCell.className = 'status-error';
            statusCell.textContent = 'Error';
            console.error(`Error generating grade card for ${seatNo}:`, error);
        }
        
        completedCount++;
        document.getElementById('progressCount').textContent = `${completedCount}/${totalStudents} Complete`;
        document.getElementById('generationProgressBar').style.width = `${(completedCount/totalStudents) * 100}%`;
    }
    
    // Show download summary button
    document.getElementById('downloadSummaryBtn').style.display = 'inline-flex';
}

// Generate grade card for a single student
async function generateGradeCardForStudent(seatNo, semester) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    try {
        const response = await fetch(`http://localhost:5000/api/faculty/gradecard/${seatNo}?semester=${semester}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate grade card');
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error generating grade card for ${seatNo}:`, error);
        return { success: false, error: error.message };
    }
}

// Download generation summary
function downloadGenerationSummary() {
    const rows = document.getElementById('bulkGenerationTableBody').getElementsByTagName('tr');
    let csvContent = "Seat No,Student Name,Status\n";
    
    for (const row of rows) {
        const seatNo = row.cells[0].textContent;
        const name = row.cells[1].textContent;
        const status = row.cells[2].querySelector('span').textContent;
        csvContent += `${seatNo},"${name}",${status}\n`;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grade_cards_generation_summary_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}