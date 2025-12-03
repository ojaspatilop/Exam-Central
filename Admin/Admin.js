document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5001/api';
    let students = [];
    let currentEditingStudent = null;
    let currentPage = 1;
    let totalPages = 1;
    let hallTickets = [];
    let hallTicketCurrentPage = 1;
    let hallTicketTotalPages = 1;
    let allocations = [];
    let allocationCurrentPage = 1;
    let allocationTotalPages = 1;
    let supervisors = [];
    let supervisorCurrentPage = 1;
    let supervisorTotalPages = 1;
    let gradeCards = [];
    let gradeCardCurrentPage = 1;
    let gradeCardTotalPages = 1;


    // Form elements
    const studentForm = document.getElementById('studentForm');
    const searchInput = document.getElementById('searchStudent');
    const studentTableBody = document.getElementById('studentTableBody');
    const filterBranch = document.getElementById('filterBranch');
    const filterSemester = document.getElementById('filterSemester');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');

    // Function to initialize quick actions
    function initializeQuickActions() {
        const actionButtons = document.querySelectorAll('.action-card');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const sectionId = button.getAttribute('data-section');
                
                // Find and click the corresponding nav item
                const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
                if (navItem) {
                    navItem.click();
                    
                    // If it's the students section, click the add student tab
                    if (sectionId === 'students') {
                        setTimeout(() => {
                            const addStudentTab = document.querySelector('.student-tabs .tab-btn[data-tab="add-student"]');
                            if (addStudentTab) {
                                addStudentTab.click();
                            }
                        }, 100);
                    }
                    
                    // If it's the allocations section, click the hall tickets tab
                    if (sectionId === 'allocations') {
                        setTimeout(() => {
                            const hallTicketsTab = document.querySelector('.allocation-tabs .tab-btn[data-tab="hall-tickets"]');
                            if (hallTicketsTab) {
                                hallTicketsTab.click();
                            }
                        }, 100);
                    }
                    
                    // If it's the results section, focus on the results tab
                    if (sectionId === 'results') {
                        setTimeout(() => {
                            const resultsTab = document.querySelector('#results');
                            if (resultsTab) {
                                resultsTab.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 100);
                    }
                }
            });
        });
    }

    // Initialize dashboard
    function initializeDashboard() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');
        const sectionTitle = document.getElementById('section-title');
        const studentTabBtns = document.querySelectorAll('.student-tabs .tab-btn');
        const studentTabContents = document.querySelectorAll('.students-container .tab-content');
        const allocationTabBtns = document.querySelectorAll('.allocation-tabs .tab-btn');
        const allocationTabContents = document.querySelectorAll('.allocations-container .tab-content');

        // Hide all sections except home initially
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === 'home') {
                section.classList.add('active');
            }
        });

        // Navigation menu click handlers
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all nav items and sections
                navItems.forEach(nav => nav.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));

                // Add active class to clicked nav item
                item.classList.add('active');

                // Show corresponding section
                const sectionId = item.getAttribute('data-section');
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    // Update section title
                    sectionTitle.textContent = item.querySelector('span').textContent;
                }

                // Load section-specific data if needed
                if (sectionId === 'supervisors') {
                    initializeSupervisorTabs();
                    loadSupervisors();
                } else if (sectionId === 'students') {
                    loadStudents();
                } else if (sectionId === 'allocations') {
                    // Load hall tickets by default since it's the first tab
                    loadHallTickets();
                } else if (sectionId === 'results') {
                    loadGradeCards();
                } else if (sectionId === 'virtual') {
                    initializeClassroomSection();
                }
            });
        });

        // Student section tab switching handlers
        studentTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Update active states
                studentTabBtns.forEach(b => b.classList.remove('active'));
                studentTabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');

                // Load data based on tab
                if (tabId === 'view-students') {
                    loadStudents();
                } else if (tabId === 'student-analytics') {
                    loadAnalytics();
                }
            });
        });

        // Allocation section tab switching handlers
        allocationTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Update active states
                allocationTabBtns.forEach(b => b.classList.remove('active'));
                allocationTabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');

                // Load data based on tab
                if (tabId === 'hall-tickets') {
                    loadHallTickets();
                } else if (tabId === 'manage-allocations') {
                    loadAllocations();
                }
            });
        });

        // Initialize form handlers
        initializeFormHandlers();

        // Initialize quick actions
        initializeQuickActions();

        // Initialize admin dropdown and logout button
        const adminAvatar = document.getElementById('adminAvatar');
        const adminDropdown = document.getElementById('adminDropdown');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (adminAvatar && adminDropdown) {
            adminAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                adminDropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (adminDropdown.classList.contains('show') && 
                    !adminDropdown.contains(e.target) && 
                    e.target !== adminAvatar) {
                    adminDropdown.classList.remove('show');
                }
            });
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        // Load dashboard data
        loadDashboardData();
    }

    // Function to load dashboard data
    function loadDashboardData() {
        // Set admin name
        const adminName = localStorage.getItem('adminName') || 'Admin';
        document.getElementById('adminName').textContent = adminName;
        
        // Try to fetch real data first
        fetchStudentCount();
        fetchHallTicketCount();
        fetchSupervisorCount();
        fetchGradeCardCount();
        
        // If we're in development and API calls fail, use mock data after a delay
        setTimeout(() => {
            const allZeros = 
                document.getElementById('totalStudents').textContent === '0' &&
                document.getElementById('totalHallTickets').textContent === '0' &&
                document.getElementById('totalSupervisors').textContent === '0' &&
                document.getElementById('totalGradeCards').textContent === '0';
                
            if (allZeros && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
                generateMockData();
            }
        }, 2000);
    }

    // Function to fetch student count
    function fetchStudentCount() {
        fetch(`${API_URL}/students/count`)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    document.getElementById('totalStudents').textContent = data.count;
                } else {
                    document.getElementById('totalStudents').textContent = '0';
                }
            })
            .catch(() => {
                // Silently use fallback data from localStorage if available
                const fallbackCount = localStorage.getItem('studentCount') || '0';
                document.getElementById('totalStudents').textContent = fallbackCount;
                
                // Try alternative endpoint as fallback
                fetch(`${API_URL}/students?limit=1000`)
                    .then(response => response.ok ? response.json() : Promise.reject())
                    .then(data => {
                        if (data.totalCount) {
                            // Use totalCount if available in the API response
                            const count = data.totalCount;
                            document.getElementById('totalStudents').textContent = count;
                            localStorage.setItem('studentCount', count);
                        } else if (data.students) {
                            // Otherwise use the length of the students array
                            const count = data.students.length;
                            document.getElementById('totalStudents').textContent = count;
                            localStorage.setItem('studentCount', count);
                        }
                    })
                    .catch(() => {
                        // Silent fallback already handled
                    });
            });
    }

    // Function to fetch hall ticket count
    function fetchHallTicketCount() {
        fetch(`${API_URL}/hall-tickets/count`)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    document.getElementById('totalHallTickets').textContent = data.count;
                } else {
                    document.getElementById('totalHallTickets').textContent = '0';
                }
            })
            .catch(() => {
                // Silently use fallback data
                const fallbackCount = localStorage.getItem('hallTicketCount') || '0';
                document.getElementById('totalHallTickets').textContent = fallbackCount;
                
                // Try alternative endpoint with a large limit to get all hall tickets
                fetch(`${API_URL}/hall-tickets?limit=1000`)
                    .then(response => response.ok ? response.json() : Promise.reject())
                    .then(data => {
                        if (data.totalCount) {
                            // Use totalCount if available in the API response
                            const count = data.totalCount;
                            document.getElementById('totalHallTickets').textContent = count;
                            localStorage.setItem('hallTicketCount', count);
                        } else if (data.hallTickets) {
                            // Otherwise use the length of the hallTickets array
                            const count = data.hallTickets.length;
                            document.getElementById('totalHallTickets').textContent = count;
                            localStorage.setItem('hallTicketCount', count);
                        }
                    })
                    .catch(() => {
                        // Silent fallback already handled
                    });
            });
    }

    // Function to fetch supervisor count
    function fetchSupervisorCount() {
        fetch(`${API_URL}/supervisors/count`)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    document.getElementById('totalSupervisors').textContent = data.count;
                } else {
                    document.getElementById('totalSupervisors').textContent = '0';
                }
            })
            .catch(() => {
                // Silently use fallback data
                const fallbackCount = localStorage.getItem('supervisorCount') || '0';
                document.getElementById('totalSupervisors').textContent = fallbackCount;
                
                // Try alternative endpoint
                fetch(`${API_URL}/supervisors?limit=1000`)
                    .then(response => response.ok ? response.json() : Promise.reject())
                    .then(data => {
                        if (data.totalCount) {
                            // Use totalCount if available in the API response
                            const count = data.totalCount;
                            document.getElementById('totalSupervisors').textContent = count;
                            localStorage.setItem('supervisorCount', count);
                        } else if (data.supervisors) {
                            // Otherwise use the length of the supervisors array
                            const count = data.supervisors.length;
                            document.getElementById('totalSupervisors').textContent = count;
                            localStorage.setItem('supervisorCount', count);
                        }
                    })
                    .catch(() => {
                        // Silent fallback already handled
                    });
            });
    }

    // Function to fetch grade card count
    function fetchGradeCardCount() {
        fetch(`${API_URL}/grade-cards/count`)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Update both instances of the grade card count
                    document.querySelectorAll('[id="totalGradeCards"]').forEach(element => {
                        element.textContent = data.count;
                    });
                    // Store for fallback
                    localStorage.setItem('gradeCardCount', data.count);
                } else {
                    document.querySelectorAll('[id="totalGradeCards"]').forEach(element => {
                        element.textContent = '0';
                    });
                }
            })
            .catch(() => {
                // Silently use fallback data
                const fallbackCount = localStorage.getItem('gradeCardCount') || '0';
                document.querySelectorAll('[id="totalGradeCards"]').forEach(element => {
                    element.textContent = fallbackCount;
                });
                
                // Try alternative endpoint
                fetch(`${API_URL}/grade-cards`)
                    .then(response => response.ok ? response.json() : Promise.reject())
                    .then(data => {
                        if (data.gradeCards) {
                            const count = data.gradeCards.length;
                            document.querySelectorAll('[id="totalGradeCards"]').forEach(element => {
                                element.textContent = count;
                            });
                            localStorage.setItem('gradeCardCount', count);
                        }
                    })
                    .catch(() => {
                        // Silent fallback already handled
                    });
            });
    }

    // Add a function to generate mock data for development/testing
    function generateMockData() {
        // Only use this in development environment
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Generate random counts between 50-200
            const studentCount = Math.floor(Math.random() * 150) + 50;
            const hallTicketCount = Math.floor(Math.random() * 120) + 30;
            const supervisorCount = Math.floor(Math.random() * 30) + 10;
            const gradeCardCount = Math.floor(Math.random() * 100) + 20;
            
            // Store in localStorage for persistence
            localStorage.setItem('studentCount', studentCount);
            localStorage.setItem('hallTicketCount', hallTicketCount);
            localStorage.setItem('supervisorCount', supervisorCount);
            localStorage.setItem('gradeCardCount', gradeCardCount);
            
            // Update UI
            document.getElementById('totalStudents').textContent = studentCount;
            document.getElementById('totalHallTickets').textContent = hallTicketCount;
            document.getElementById('totalSupervisors').textContent = supervisorCount;
            document.getElementById('totalGradeCards').textContent = gradeCardCount;
            
            console.log('Using mock data for dashboard counts');
        }
    }

    function initializeFormHandlers() {
        // Form submission
        studentForm.addEventListener('submit', handleStudentSubmit);
        
        // Search and filters
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        filterBranch.addEventListener('change', () => loadStudents());
        filterSemester.addEventListener('change', () => loadStudents());
        
        // Pagination
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadStudents();
            }
        });
        
        nextPageBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                loadStudents();
            }
        });

        // Hall ticket search and filters
        document.getElementById('searchHallTicket')?.addEventListener('input', debounce(handleHallTicketSearch, 300));
        document.getElementById('filterHallTicketBranch')?.addEventListener('change', () => loadHallTickets());
        document.getElementById('filterHallTicketSemester')?.addEventListener('change', () => loadHallTickets());
        
        // Hall ticket pagination
        document.getElementById('prevHallTicketPage')?.addEventListener('click', () => {
            if (hallTicketCurrentPage > 1) {
                hallTicketCurrentPage--;
                loadHallTickets();
            }
        });
        
        document.getElementById('nextHallTicketPage')?.addEventListener('click', () => {
            if (hallTicketCurrentPage < hallTicketTotalPages) {
                hallTicketCurrentPage++;
                loadHallTickets();
            }
        });

        // Allocation search and filters
        document.getElementById('searchAllocation')?.addEventListener('input', debounce(handleAllocationSearch, 300));
        document.getElementById('filterAllocationBranch')?.addEventListener('change', () => loadAllocations());
        document.getElementById('filterAllocationSemester')?.addEventListener('change', () => loadAllocations());
        
        // Allocation pagination
        document.getElementById('prevAllocationPage')?.addEventListener('click', () => {
            if (allocationCurrentPage > 1) {
                allocationCurrentPage--;
                loadAllocations();
            }
        });
        
        document.getElementById('nextAllocationPage')?.addEventListener('click', () => {
            if (allocationCurrentPage < allocationTotalPages) {
                allocationCurrentPage++;
                loadAllocations();
            }
        });

        // Allocate Classroom button handler
        const allocateClassroomBtn = document.getElementById('allocateClassroomBtn');
        if (allocateClassroomBtn) {
            allocateClassroomBtn.addEventListener('click', handleAllocateClassroom);
        }

        // Grade card search and filters
        document.getElementById('searchResult')?.addEventListener('input', debounce(handleGradeCardSearch, 300));
        document.getElementById('filterResultBranch')?.addEventListener('change', () => loadGradeCards());
        document.getElementById('filterResultSemester')?.addEventListener('change', () => loadGradeCards());
        document.getElementById('filterResultYear')?.addEventListener('change', () => loadGradeCards());

        // Grade card pagination
        document.getElementById('prevResultPage')?.addEventListener('click', () => {
            if (gradeCardCurrentPage > 1) {
                gradeCardCurrentPage--;
                loadGradeCards();
            }
        });

        document.getElementById('nextResultPage')?.addEventListener('click', () => {
            if (gradeCardCurrentPage < gradeCardTotalPages) {
                gradeCardCurrentPage++;
                loadGradeCards();
            }
        });

        // Close grade card modal
        document.getElementById('closeGradeCardModal')?.addEventListener('click', () => {
            document.getElementById('gradeCardModal').style.display = 'none';
        });

        // Print grade card
        document.getElementById('printGradeCardBtn')?.addEventListener('click', printGradeCard);

        // Add reset allocation button handler
        document.getElementById('resetSupervisorAllocationsBtn')?.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all supervisor allocations? This will set all faculty to unavailable and clear all classroom assignments.')) {
                resetAllSupervisors();
            }
        });
    }

    async function loadStudents() {
        try {
            // Show loading state
            studentTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="loading-state">
                        <i class="fas fa-spinner fa-spin"></i> Loading students...
                    </td>
                </tr>
            `;

            const branch = filterBranch.value;
            const semester = filterSemester.value;
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: 10
            });

            if (branch) queryParams.append('branch', branch);
            if (semester) queryParams.append('semester', semester);

            const response = await fetch(`${API_URL}/students?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to load students');
            }

            const data = await response.json();
            
            if (!data || !Array.isArray(data.students)) {
                throw new Error('Invalid data format received from server');
            }

            students = data.students;
            totalPages = data.totalPages || 1;
            currentPage = data.currentPage || 1;
            
            updatePagination();
            
            if (students.length === 0) {
                studentTableBody.innerHTML = `
                    <tr>
                        <td colspan="8" class="no-data">
                            <div class="no-data-message">
                                <i class="fas fa-info-circle"></i>
                                <p>No students found</p>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                renderStudentTable();
            }

            // Clear any previous error messages
            const errorElement = document.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        } catch (error) {
            studentTableBody.innerHTML = `
                <tr>
                    <td colspan="8">
                        <div class="error-message">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>${error.message}</p>
                            <button onclick="loadStudents()" class="retry-btn">
                                <i class="fas fa-sync-alt"></i> Retry
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            showNotification(error.message, 'error');
        }
    }

    function renderStudentTable() {
        studentTableBody.innerHTML = '';
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.rollNumber}</td>
                <td>${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}</td>
                <td>${student.branch}</td>
                <td>${student.semester}</td>
                <td>${student.academicYear}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td class="action-buttons">
                    <button class="edit-btn" onclick="handleEdit('${student._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="handleDelete('${student._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            studentTableBody.appendChild(row);
        });
    }

    async function handleStudentSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            middleName: document.getElementById('middleName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            rollNumber: document.getElementById('rollNumber').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            branch: document.getElementById('branch').value,
            semester: parseInt(document.getElementById('semester').value),
            academicYear: parseInt(document.getElementById('academicYear').value)
        };

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'rollNumber', 'email', 'phone', 'branch', 'semester', 'academicYear'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
            return;
        }

        // Add this before sending the data to the API
        if (formData.branch === "CS") {
            formData.branch = "Computer Science";
        } else if (formData.branch === "IT") {
            formData.branch = "Information Technology";
        } else if (formData.branch === "AIML") {
            formData.branch = "AIML";
        } else if (formData.branch === "DS") {
            formData.branch = "DS";
        } else if (formData.branch === "MECHANICAL") {
            formData.branch = "Mechanical Engineering";
        }

        // Add this line for debugging
        console.log('Sending student data:', formData);

        try {
            const response = currentEditingStudent 
                ? await updateStudent(currentEditingStudent, formData)
                : await addStudent(formData);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                throw new Error(errorData.message || 'Failed to save student');
            }

            studentForm.reset();
            currentEditingStudent = null;
            await loadStudents();
            showNotification('Student saved successfully', 'success');
            
            // Switch to view students tab
            document.querySelector('[data-tab="view-students"]').click();
        } catch (error) {
            console.error('Complete error:', error);
            showNotification(error.message, 'error');
        }
    }

    async function addStudent(studentData) {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add student');
        }
        
        return response;
    }

    async function updateStudent(id, studentData) {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update student');
        }
        
        return response;
    }

    // Make these functions available in the global scope
    window.handleEdit = async function(id) {
        const student = students.find(s => s._id === id);
        if (student) {
            currentEditingStudent = id;
            
            // Populate form fields
            document.getElementById('firstName').value = student.firstName || '';
            document.getElementById('middleName').value = student.middleName || '';
            document.getElementById('lastName').value = student.lastName || '';
            document.getElementById('rollNumber').value = student.rollNumber || '';
            document.getElementById('email').value = student.email || '';
            document.getElementById('phone').value = student.phone || '';
            document.getElementById('branch').value = student.branch || '';
            document.getElementById('semester').value = student.semester || '';
            document.getElementById('academicYear').value = student.academicYear || '';

            // Switch to add/edit tab and scroll to form
            document.querySelector('[data-tab="add-student"]').click();
            document.querySelector('.add-student-form').scrollIntoView({ behavior: 'smooth' });
            
            // Update form title and button text to indicate editing mode
            document.querySelector('.add-student-form h2').textContent = 'Edit Student';
            document.querySelector('.submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Student';
        }
    };

    window.handleDelete = async function(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            try {
                const response = await fetch(`${API_URL}/students/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete student');
                }

                await loadStudents();
                showNotification('Student deleted successfully', 'success');
            } catch (error) {
                showNotification(error.message, 'error');
            }
        }
    };

    async function handleSearch(e) {
        const searchTerm = e.target.value;
        if (searchTerm.length > 0) {
            try {
                const response = await fetch(`${API_URL}/students/search?term=${searchTerm}`);
                students = await response.json();
            } catch (error) {
                console.error('Error searching students:', error);
                students = [];
            }
        } else {
            await loadStudents();
        }
        renderStudentTable();
    }

    // Utility Functions
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

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Add icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <p>${message}</p>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    function updatePagination() {
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    }

    async function loadAnalytics() {
        try {
            // Show loading state
            document.querySelectorAll('.chart-container').forEach(container => {
                container.innerHTML = `
                    <div class="loading-state">
                        <i class="fas fa-spinner fa-spin"></i> Loading analytics...
                    </div>
                `;
            });

            const response = await fetch(`${API_URL}/students/analytics`);
            if (!response.ok) {
                throw new Error('Failed to fetch analytics data');
            }

            const data = await response.json();
            
            // Destroy existing charts if they exist
            ['branchChart', 'semesterChart', 'yearChart'].forEach(chartId => {
                const chartCanvas = document.getElementById(chartId);
                if (chartCanvas) {
                    const existingChart = Chart.getChart(chartId);
                    if (existingChart) {
                        existingChart.destroy();
                    }
                }
            });

            // Create new canvas elements
            document.querySelectorAll('.chart-container').forEach(container => {
                const chartId = container.id;
                container.innerHTML = `<canvas id="${chartId}Canvas"></canvas>`;
            });

            // Branch Distribution Chart
            new Chart(document.getElementById('branchChartCanvas'), {
                type: 'pie',
                data: {
                    labels: data.branchDistribution.map(item => item._id),
                    datasets: [{
                        data: data.branchDistribution.map(item => item.count),
                        backgroundColor: [
                            '#4361ee',
                            '#3730a3',
                            '#818cf8',
                            '#06b6d4',
                            '#10b981',
                            '#f59e0b'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Students by Branch'
                        }
                    }
                }
            });

            // Semester Distribution Chart
            new Chart(document.getElementById('semesterChartCanvas'), {
                type: 'bar',
                data: {
                    labels: data.semesterDistribution
                        .sort((a, b) => a._id - b._id)
                        .map(item => `Semester ${item._id}`),
                    datasets: [{
                        label: 'Number of Students',
                        data: data.semesterDistribution
                            .sort((a, b) => a._id - b._id)
                            .map(item => item.count),
                        backgroundColor: '#4361ee'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Students by Semester'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });

            // Yearly Enrollment Chart
            new Chart(document.getElementById('yearChartCanvas'), {
                type: 'line',
                data: {
                    labels: data.yearlyEnrollment
                        .sort((a, b) => a._id - b._id)
                        .map(item => item._id.toString()),
                    datasets: [{
                        label: 'Number of Students',
                        data: data.yearlyEnrollment
                            .sort((a, b) => a._id - b._id)
                            .map(item => item.count),
                        borderColor: '#4361ee',
                        backgroundColor: 'rgba(67, 97, 238, 0.1)',
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Yearly Student Enrollment'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Error loading analytics:', error);
            document.querySelectorAll('.chart-container').forEach(container => {
                container.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>${error.message}</p>
                        <button onclick="loadAnalytics()" class="retry-btn">
                            <i class="fas fa-sync-alt"></i> Retry
                        </button>
                    </div>
                `;
            });
        }
    }

    // Function to load hall tickets
    async function loadHallTickets() {
        try {
            const hallTicketTableBody = document.getElementById('hallTicketTableBody');
            if (!hallTicketTableBody) return;
            
            // Show loading state
            hallTicketTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="loading-cell">
                        <div class="loading-spinner"></div>
                        <p>Loading hall tickets...</p>
                    </td>
                </tr>
            `;
            
            // Get filter values
            const branch = document.getElementById('filterHallTicketBranch').value;
            const semester = document.getElementById('filterHallTicketSemester').value;
            
            // Build query parameters
            let queryParams = new URLSearchParams();
            queryParams.append('page', hallTicketCurrentPage);
            if (branch) queryParams.append('branch', branch);
            if (semester) queryParams.append('semester', semester);
            
            // Fetch hall tickets from API
            const response = await fetch(`${API_URL}/hall-tickets?${queryParams.toString()}`);
            const data = await response.json();
            
            // Update state
            hallTickets = data.hallTickets;
            hallTicketTotalPages = data.totalPages;
            
            // Render hall tickets
            renderHallTicketTable();
            updateHallTicketPagination();
        } catch (error) {
            console.error('Error loading hall tickets:', error);
            showNotification('Failed to load hall tickets. Please try again.', 'error');
        }
    }

    // Function to render hall ticket table
    function renderHallTicketTable() {
        const hallTicketTableBody = document.getElementById('hallTicketTableBody');
        if (!hallTicketTableBody) return;
        
        if (!hallTickets || hallTickets.length === 0) {
            hallTicketTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-cell">
                        <div class="empty-state">
                            <i class="fas fa-ticket-alt"></i>
                            <p>No hall tickets found</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        hallTicketTableBody.innerHTML = hallTickets.map(ticket => `
            <tr>
                <td>${ticket.hallTicketNumber || 'N/A'}</td>
                <td>${ticket.studentRollNo || 'N/A'}</td>
                <td>${ticket.firstName || ''} ${ticket.middleName || ''} ${ticket.lastName || ''}</td>
                <td>${ticket.branch || 'N/A'}</td>
                <td>${ticket.semester || 'N/A'}</td>
                <td>${ticket.examination || 'N/A'}</td>
                <td>${ticket.generatedDate ? new Date(ticket.generatedDate).toLocaleDateString() : 'N/A'}</td>
                <td class="actions-cell">
                    <button class="action-btn view-btn" data-id="${ticket.hallTicketNumber}" title="View Hall Ticket">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn print-btn" data-id="${ticket.hallTicketNumber}" title="Print Hall Ticket">
                        <i class="fas fa-print"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners to action buttons
        const viewButtons = hallTicketTableBody.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const hallTicketNumber = btn.getAttribute('data-id');
                viewHallTicket(hallTicketNumber);
            });
        });
        
        const printButtons = hallTicketTableBody.querySelectorAll('.print-btn');
        printButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const hallTicketNumber = btn.getAttribute('data-id');
                printHallTicket(hallTicketNumber);
            });
        });
    }

    // Function to update hall ticket pagination
    function updateHallTicketPagination() {
        document.getElementById('currentHallTicketPage').textContent = hallTicketCurrentPage;
        document.getElementById('totalHallTicketPages').textContent = hallTicketTotalPages;
        document.getElementById('prevHallTicketPage').disabled = hallTicketCurrentPage <= 1;
        document.getElementById('nextHallTicketPage').disabled = hallTicketCurrentPage >= hallTicketTotalPages;
    }

    // Function to handle hall ticket search
    async function handleHallTicketSearch(e) {
        const searchTerm = e.target.value.trim();
        if (searchTerm.length < 2) {
            hallTicketCurrentPage = 1;
            loadHallTickets();
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/hall-tickets/search?term=${searchTerm}`);
            const data = await response.json();
            hallTickets = data;
            renderHallTicketTable();
            
            // Hide pagination for search results
            document.querySelector('#hall-tickets .pagination').style.display = 'none';
        } catch (error) {
            console.error('Error searching hall tickets:', error);
            showNotification('Failed to search hall tickets', 'error');
        }
    }

    // Function to view hall ticket details
    function viewHallTicket(hallTicketNumber) {
        const ticket = hallTickets.find(t => t.hallTicketNumber === hallTicketNumber);
        if (!ticket) {
            showNotification('Hall ticket not found', 'error');
            return;
        }
        
        // Create modal for viewing hall ticket
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content hall-ticket-modal">
                <div class="modal-header">
                    <h2>Hall Ticket Details</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="hall-ticket-preview">
                        <div class="ticket-header">
                            <div class="university-logo">
                                <i class="fas fa-university"></i>
                            </div>
                            <div class="university-info">
                                <h2>Mumbai University</h2>
                                <h3>Examination Hall Ticket</h3>
                                <p>${ticket.examination} Examination</p>
                            </div>
                            <div class="ticket-number">
                                <span>Hall Ticket No.</span>
                                <strong>${ticket.hallTicketNumber}</strong>
                            </div>
                        </div>
                        
                        <div class="ticket-body">
                            <div class="student-photo">
                                <div class="photo-placeholder">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="signature-box">
                                    <p>Signature of Candidate</p>
                                </div>
                            </div>
                            
                            <div class="student-details">
                                <div class="detail-row">
                                    <div class="detail-group">
                                        <label>Student Name</label>
                                        <p>${ticket.firstName} ${ticket.middleName || ''} ${ticket.lastName}</p>
                                    </div>
                                    <div class="detail-group">
                                        <label>Roll Number</label>
                                        <p>${ticket.studentRollNo}</p>
                                    </div>
                                </div>
                                
                                <div class="detail-row">
                                    <div class="detail-group">
                                        <label>Branch</label>
                                        <p>${ticket.branch}</p>
                                    </div>
                                    <div class="detail-group">
                                        <label>Semester</label>
                                        <p>${ticket.semester}</p>
                                    </div>
                                </div>
                                
                                <div class="detail-row">
                                    <div class="detail-group">
                                        <label>Examination</label>
                                        <p>${ticket.examination}</p>
                                    </div>
                                    <div class="detail-group">
                                        <label>Generated Date</label>
                                        <p>${new Date(ticket.generatedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="ticket-subjects">
                            <h4>Examination Subjects</h4>
                            <table class="subjects-table">
                                <thead>
                                    <tr>
                                        <th>Subject Code</th>
                                        <th>Subject Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${ticket.subjects && ticket.subjects.length > 0 ? 
                                        ticket.subjects.map(subject => `
                                            <tr>
                                                <td>${subject.code}</td>
                                                <td>${subject.name}</td>
                                            </tr>
                                        `).join('') : 
                                        '<tr><td colspan="2">No subjects found</td></tr>'
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="action-btn print-btn">
                        <i class="fas fa-print"></i> Print Hall Ticket
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show the modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Add event listeners
        modal.querySelector('.close-btn').addEventListener('click', () => {
            closeModal(modal);
        });
        
        modal.querySelector('.print-btn').addEventListener('click', () => {
            printHallTicket(hallTicketNumber);
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }

    // Helper function to close modal with animation
    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }

    // Function to print hall ticket
    function printHallTicket(hallTicketNumber) {
        const ticket = hallTickets.find(t => t.hallTicketNumber === hallTicketNumber);
        if (!ticket) return;
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        
        // Generate print-friendly HTML
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Hall Ticket - ${ticket.hallTicketNumber}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                    }
                    .hall-ticket {
                        border: 2px solid #000;
                        padding: 20px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .ticket-header {
                        display: flex;
                        justify-content: space-between;
                        border-bottom: 2px solid #000;
                        padding-bottom: 15px;
                        margin-bottom: 20px;
                    }
                    .university-info {
                        text-align: center;
                    }
                    .university-info h2, .university-info h3 {
                        margin: 5px 0;
                    }
                    .ticket-body {
                        display: flex;
                        margin-bottom: 20px;
                    }
                    .student-photo {
                        width: 150px;
                        margin-right: 20px;
                    }
                    .photo-placeholder {
                        border: 1px solid #000;
                        height: 150px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 10px;
                    }
                    .signature-box {
                        border-top: 1px solid #000;
                        padding-top: 5px;
                        text-align: center;
                    }
                    .student-details {
                        flex: 1;
                    }
                    .detail-row {
                        display: flex;
                        margin-bottom: 15px;
                    }
                    .detail-group {
                        flex: 1;
                        margin-right: 15px;
                    }
                    .detail-group label {
                        font-weight: bold;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .subjects-table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .subjects-table th, .subjects-table td {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: left;
                    }
                    .subjects-table th {
                        background-color: #f2f2f2;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                        .hall-ticket {
                            border: none;
                        }
                        .print-instructions {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-instructions">
                    <p>This page will automatically print. Click the print button below if it doesn't.</p>
                    <button onclick="window.print()">Print Hall Ticket</button>
                </div>
                
                <div class="hall-ticket">
                    <div class="ticket-header">
                        <div class="university-logo">
                            University Logo
                        </div>
                        <div class="university-info">
                            <h2>Mumbai University</h2>
                            <h3>Examination Hall Ticket</h3>
                            <p>${ticket.examination} Examination</p>
                        </div>
                        <div class="ticket-number">
                            <span>Hall Ticket No.</span>
                            <strong>${ticket.hallTicketNumber}</strong>
                        </div>
                    </div>
                    
                    <div class="ticket-body">
                        <div class="student-photo">
                            <div class="photo-placeholder">
                                Photo
                            </div>
                            <div class="signature-box">
                                <p>Signature of Candidate</p>
                            </div>
                        </div>
                        
                        <div class="student-details">
                            <div class="detail-row">
                                <div class="detail-group">
                                    <label>Student Name</label>
                                    <p>${ticket.firstName} ${ticket.middleName || ''} ${ticket.lastName}</p>
                                </div>
                                <div class="detail-group">
                                    <label>Roll Number</label>
                                    <p>${ticket.studentRollNo}</p>
                                </div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-group">
                                    <label>Branch</label>
                                    <p>${ticket.branch}</p>
                                </div>
                                <div class="detail-group">
                                    <label>Semester</label>
                                    <p>${ticket.semester}</p>
                                </div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-group">
                                    <label>Examination</label>
                                    <p>${ticket.examination}</p>
                                </div>
                                <div class="detail-group">
                                    <label>Generated Date</label>
                                    <p>${new Date(ticket.generatedDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ticket-subjects">
                        <h4>Examination Subjects</h4>
                        <table class="subjects-table">
                            <thead>
                                <tr>
                                    <th>Subject Code</th>
                                    <th>Subject Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ticket.subjects.map(subject => `
                                    <tr>
                                        <td>${subject.code}</td>
                                        <td>${subject.name}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <script>
                    // Auto print
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    }

    // Update the handleLogout function
    function handleLogout() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to logout?')) {
            // Clear any stored authentication data
            localStorage.removeItem('adminToken');
            sessionStorage.removeItem('adminToken');
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            localStorage.removeItem('userRole');
            sessionStorage.removeItem('userRole');
            
            // Show logout notification
            showNotification('Logged out successfully', 'success');
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = '../Login/Login.html';
            }, 1000);
        }
    }

    // Function to handle classroom allocation
    function handleAllocateClassroom() {
        const button = document.getElementById('allocateClassroomBtn');
        
        // Disable button and show loading state
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Allocating...';

        // Make API call
        fetch('http://localhost:5000/api/allocate-classrooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success message
                alert(`Successfully allocated classrooms for ${data.allocationsCount} students!`);
                
                // Switch to manage allocations tab and show allocations
                const manageAllocationsTab = document.querySelector('[href="#manageAllocations"]');
                if (manageAllocationsTab) {
                    manageAllocationsTab.click();
                }

                // Display the allocations immediately
                displayAllocations(data.allocations);
            } else {
                alert('Failed to allocate classrooms: ' + data.message);
            }
        })
        .catch(error => {
            alert('Error allocating classrooms: ' + error.message);
        })
        .finally(() => {
            // Reset button state
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-school"></i> Allocate Classrooms';
        });
    }

    // Function to display allocations
    function displayAllocations(allocations) {
        const tableBody = document.querySelector('#allocationsTable tbody');
        if (!tableBody) return;

        tableBody.innerHTML = ''; // Clear existing rows

        if (!allocations || allocations.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center">No allocations found</td>
                </tr>`;
            return;
        }

        allocations.forEach(allocation => {
            const row = document.createElement('tr');
            
            // Fix the date issue by handling the timezone correctly
            // Parse the date in UTC to avoid timezone shifts
            const examDateStr = allocation.examDate;
            let examDate;
            
            if (typeof examDateStr === 'string') {
                // If the date is a string, parse it correctly
                // Split the ISO string and take just the date part to avoid timezone issues
                const dateParts = examDateStr.split('T')[0].split('-');
                examDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            } else {
                // If it's already a Date object or timestamp
                examDate = new Date(examDateStr);
            }
            
            // Format date as DD/MM/YYYY
            const formattedDate = `${examDate.getDate().toString().padStart(2, '0')}/${(examDate.getMonth() + 1).toString().padStart(2, '0')}/${examDate.getFullYear()}`;
            
            // Get bench number or display placeholder if not available
            const benchNumber = allocation.benchNumber ? allocation.benchNumber.number : 'N/A';
            
            row.innerHTML = `
                <td>${allocation.studentRollNo}</td>
                <td>${allocation.hallTicketNumber}</td>
                <td>${allocation.studentName}</td>
                <td>${allocation.branch}</td>
                <td>${allocation.semester}</td>
                <td>${allocation.paper.name}</td>
                <td>${allocation.classroom.room}</td>
                <td>${benchNumber}</td>
                <td>${formattedDate}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to load existing allocations
    function loadAllocations() {
        // Show loading state
        const tableBody = document.querySelector('#allocationsTable tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    <i class="fas fa-spinner fa-spin"></i> Loading allocations...
                </td>
            </tr>`;
        
        // Make API call to get allocations
        fetch('http://localhost:5000/api/allocated_classrooms') // Use the correct endpoint
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayAllocations(data.allocations);
                } else {
                    console.error('Failed to load allocations:', data.message);
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="9" class="text-center">
                                Failed to load allocations: ${data.message}
                            </td>
                        </tr>`;
                }
            })
            .catch(error => {
                console.error('Error loading allocations:', error);
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="9" class="text-center">
                            Error loading allocations. Please try again.
                        </td>
                    </tr>`;
            });
    }

    // Function to handle allocation search
    async function handleAllocationSearch(e) {
        const searchTerm = e.target.value.trim();
        if (searchTerm.length < 2) {
            allocationCurrentPage = 1;
            loadAllocations();
            return;
        }
        
        try {
            // Show loading state
            const tableBody = document.querySelector('#allocationsTable tbody');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="9" class="text-center">
                            <i class="fas fa-spinner fa-spin"></i> Searching...
                        </td>
                    </tr>`;
            }
            
            const response = await fetch(`${API_URL}/allocated_classrooms/search?term=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();
            
            if (data.success) {
                displayAllocations(data.allocations);
            } else {
                throw new Error(data.message || 'Failed to search allocations');
            }
            
            // Hide pagination for search results
            const paginationElement = document.querySelector('#manage-allocations .pagination');
            if (paginationElement) {
                paginationElement.style.display = 'none';
            }
        } catch (error) {
            console.error('Error searching allocations:', error);
            const tableBody = document.querySelector('#allocationsTable tbody');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="9" class="text-center">
                            <i class="fas fa-exclamation-triangle"></i> Error: ${error.message}
                        </td>
                    </tr>`;
            }
        }
    }

    async function handleVirtualClassroom() {
        try {
            const classroom = document.getElementById('classroomSelector').value;
            const paperCode = document.getElementById('paperSelector').value;
            
            if (!classroom || !paperCode) {
                showNotification('Please select both classroom and paper', 'warning');
                return;
            }
            
            // Show loading state
            const seatingContainer = document.getElementById('seatingContainer');
            seatingContainer.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading seating arrangement...</p>
                </div>
            `;
            
            // Fetch seating data from API
            const response = await fetch(`${API_URL}/seating-arrangement?classroom=${classroom}&paperCode=${paperCode}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch seating arrangement');
            }
            
            const seatingData = await response.json();
            
            if (!seatingData || seatingData.length === 0) {
                seatingContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-chair fa-3x"></i>
                        <p>No seating arrangement found for this classroom and paper</p>
                    </div>
                `;
                return;
            }
            
            // Update classroom info display
            updateClassroomInfo(seatingData, classroom, paperCode);
            
            // Generate and display seating layout
            generateSeatingLayout(seatingData);
        } catch (error) {
            console.error('Error loading seating arrangement:', error);
            document.getElementById('seatingContainer').innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle fa-3x"></i>
                    <p>${error.message || 'Failed to load seating arrangement'}</p>
                    <button onclick="handleVirtualClassroom()" class="retry-btn">
                        <i class="fas fa-sync-alt"></i> Retry
                    </button>
                </div>
            `;
            showNotification(error.message || 'Failed to load seating arrangement', 'error');
        }
    }

    function updateClassroomInfo(seatingData, classroom, paperCode) {
        // Get the first record to extract common information
        const firstRecord = seatingData[0];
        
        // Update classroom information display
        document.getElementById('displayRoom').textContent = classroom;
        document.getElementById('displayDate').textContent = new Date(firstRecord.examDate).toLocaleDateString();
        document.getElementById('displayTime').textContent = firstRecord.examTime || 'Not specified';
        document.getElementById('displayPaper').textContent = `${paperCode} - ${firstRecord.paper.name}`;
        document.getElementById('displayTotalStudents').textContent = seatingData.length;
        
        // Calculate total seats (this is an approximation - you might want to get actual classroom capacity)
        // For now, we'll assume a standard layout with some empty seats
        const totalSeats = Math.max(seatingData.length * 1.2, 30); // At least 20% more than students or minimum 40
        document.getElementById('displayTotalSeats').textContent = Math.floor(totalSeats);
        
        // Calculate occupancy percentage
        const occupancyPercentage = (seatingData.length / totalSeats) * 100;
        document.getElementById('displayOccupancy').textContent = `${Math.round(occupancyPercentage)}%`;
    }

    function generateSeatingLayout(seatingData) {
        const seatingContainer = document.getElementById('seatingContainer');
        
        // Clear previous content
        seatingContainer.innerHTML = '';
        
        // Set fixed dimensions
        const ROWS = 6;
        const COLUMNS = 5;
        
        // Create seating grid
        const seatingGrid = document.createElement('div');
        seatingGrid.className = 'seating-grid';
        seatingGrid.style.gridTemplateColumns = `repeat(${COLUMNS}, 1fr);`;
        
        // Create a map for quick lookup of seat assignments
        const seatMap = {};
        seatingData.forEach(student => {
            if (student.benchNumber) {
                const key = `${student.benchNumber.row}-${student.benchNumber.column}`;
                seatMap[key] = student;
            }
        });
        
        // Generate seats
        for (let row = 1; row <= ROWS; row++) {
            for (let col = 1; col <= COLUMNS; col++) {
                const seatKey = `${row}-${col}`;
                const seat = document.createElement('div');
                seat.className = 'seat';
                
                if (seatMap[seatKey]) {
                    const student = seatMap[seatKey];
                    seat.classList.add('occupied');
                    
                    // Get student name (checking multiple possible property names)
                    const studentName = student.studentName || 
                                      (student.firstName && student.lastName ? 
                                       `${student.firstName} ${student.lastName}` : 
                                       student.name) || 
                                      'N/A';
                    
                    // Create tooltip element
                    const tooltip = document.createElement('div');
                    tooltip.className = 'seat-tooltip';
                    
                    // Add tooltip content with proper name display
                    tooltip.innerHTML = `
                        <div class="tooltip-content">
                            <div class="student-name">
                                <i class="fas fa-user"></i>
                                ${studentName}
                            </div>
                            <div>
                                <i class="fas fa-id-card"></i>
                                Roll No: ${student.rollNumber || student.studentRollNo || 'N/A'}
                            </div>
                            <div>
                                <i class="fas fa-graduation-cap"></i>
                                Branch: ${student.branch || 'N/A'}
                            </div>
                            <div>
                                <i class="fas fa-book"></i>
                                Paper: ${student.paper?.name || student.paperCode || 'N/A'}
                            </div>
                            <div>
                                <i class="fas fa-chair"></i>
                                Bench: ${student.benchNumber?.number || `${row}-${col}`}
                            </div>
                        </div>
                    `;
                    
                    seat.appendChild(tooltip);
                    
                    // Add seat number
                    const seatNumber = document.createElement('span');
                    seatNumber.className = 'seat-number';
                    seatNumber.textContent = student.benchNumber?.number || `${row}-${col}`;
                    seat.appendChild(seatNumber);
                    
                    // Add roll number display
                    const rollNumber = document.createElement('span');
                    rollNumber.className = 'roll-number';
                    rollNumber.textContent = student.rollNumber || student.studentRollNo || 'N/A';
                    seat.appendChild(rollNumber);
                    
                    // Add click event to show student details
                    seat.addEventListener('click', () => showStudentDetails(student));
                } else {
                    // Empty seat
                    seat.classList.add('empty');
                    const seatNumber = document.createElement('span');
                    seatNumber.className = 'seat-number';
                    seatNumber.textContent = `${row}-${col}`;
                    seat.appendChild(seatNumber);
                }
                
                seatingGrid.appendChild(seat);
            }
        }
        
        seatingContainer.appendChild(seatingGrid);
    }

    function showStudentDetails(student) {
        // Get the student info panel
        const studentInfoPanel = document.getElementById('studentInfoPanel');
        
        // Update student information
        document.getElementById('studentName').textContent = `${student.studentName}`;
        document.getElementById('studentRollNo').textContent = student.studentRollNo;
        document.getElementById('studentHallTicket').textContent = student.hallTicketNumber;
        document.getElementById('studentBranch').textContent = student.branch;
        document.getElementById('studentSemester').textContent = student.semester;
        document.getElementById('studentPaper').textContent = `${student.paper.code} - ${student.paper.name}`;
        document.getElementById('studentBench').textContent = student.benchNumber.number;
        
        // Show the panel
        studentInfoPanel.classList.add('show');
        
        // Highlight the selected seat
        document.querySelectorAll('.seat').forEach(seat => {
            seat.classList.remove('selected');
        });
        
        const selectedSeat = document.querySelector(`.seat[data-student-id="${student.studentRollNo}"]`);
        if (selectedSeat) {
            selectedSeat.classList.add('selected');
        }
    }

    // Close student info panel when close button is clicked
    document.getElementById('closeStudentInfo')?.addEventListener('click', () => {
        document.getElementById('studentInfoPanel').classList.remove('show');
        document.querySelectorAll('.seat.selected').forEach(seat => {
            seat.classList.remove('selected');
        });
    });

    // Print seating chart
    document.getElementById('printSeatingBtn')?.addEventListener('click', () => {
        const classroom = document.getElementById('classroomSelector').value;
        const paperCode = document.getElementById('paperSelector').value;
        
        if (!classroom || !paperCode) {
            showNotification('Please select classroom and paper first', 'warning');
            return;
        }
        
        // Create print window
        const printWindow = window.open('', '_blank');
        
        // Get classroom info
        const room = document.getElementById('displayRoom').textContent;
        const date = document.getElementById('displayDate').textContent;
        const time = document.getElementById('displayTime').textContent;
        const paper = document.getElementById('displayPaper').textContent;
        
        // Create print content
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Seating Chart - Room ${room}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #ccc;
                    }
                    .classroom-info {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                        flex-wrap: wrap;
                    }
                    .info-item {
                        margin-bottom: 10px;
                        flex-basis: 48%;
                    }
                    .seating-grid {
                        display: grid;
                        grid-template-columns: repeat(8, 1fr);
                        gap: 10px;
                        margin-bottom: 30px;
                    }
                    .seat {
                        border: 1px solid #ccc;
                        padding: 10px;
                        text-align: center;
                        position: relative;
                    }
                    .seat.occupied {
                        background-color: #e6f7ff;
                        border-color: #1890ff;
                    }
                    .seat-number {
                        position: absolute;
                        top: 5px;
                        left: 5px;
                        font-size: 10px;
                        color: #666;
                    }
                    .student-info {
                        font-size: 12px;
                    }
                    .teacher-desk {
                        grid-column: 1 / -1;
                        text-align: center;
                        padding: 10px;
                        background-color: #f0f0f0;
                        margin-bottom: 20px;
                    }
                    @media print {
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Classroom Seating Arrangement</h1>
                </div>
                
                <div class="classroom-info">
                    <div class="info-item">
                        <strong>Room:</strong> ${room}
                    </div>
                    <div class="info-item">
                        <strong>Date:</strong> ${date}
                    </div>
                    <div class="info-item">
                        <strong>Time:</strong> ${time}
                    </div>
                    <div class="info-item">
                        <strong>Paper:</strong> ${paper}
                    </div>
                </div>
                
                <div class="teacher-desk">
                    Teacher's Desk
                </div>
                
                <div class="seating-grid">
                    ${document.querySelector('.seating-grid').innerHTML}
                </div>
                
                <div class="no-print">
                    <button onclick="window.print()">Print</button>
                    <button onclick="window.close()">Close</button>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    });

    // Export seating chart as PDF
    document.getElementById('exportSeatingBtn')?.addEventListener('click', () => {
        showNotification('PDF export functionality will be implemented soon', 'info');
    });

    document.getElementById('viewSeatingBtn').addEventListener('click', handleVirtualClassroom);

    // Initialize supervisor tab navigation
    function initializeSupervisorTabs() {
        const tabBtns = document.querySelectorAll('.supervisor-tabs .tab-btn');
        const tabContents = document.querySelectorAll('.supervisors-container .tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked tab and its content
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // Add these functions to handle supervisor data
    async function loadSupervisors() {
        try {
            console.log('Loading supervisors...');
            const queryParams = new URLSearchParams({
                page: supervisorCurrentPage,
                limit: 10
            });

            if (document.getElementById('filterDepartment')?.value) {
                queryParams.append('department', document.getElementById('filterDepartment').value);
            }

            const response = await fetch(`${API_URL}/faculty?${queryParams}`);
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Received data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to load supervisors');
            }

            // Make sure we're accessing the faculty array from the response
            supervisors = data.faculty || [];
            supervisorTotalPages = data.totalPages || 1;
            
            console.log('Supervisors to display:', supervisors);
            renderSupervisorTable();
        } catch (error) {
            console.error('Error loading supervisors:', error);
            showNotification('Error loading supervisors', 'error');
        }
    }

    function renderSupervisorTable() {
        const supervisorTableBody = document.getElementById('supervisorTableBody');
        if (!supervisorTableBody) return;
        
        supervisorTableBody.innerHTML = '';

        if (!supervisors || supervisors.length === 0) {
            supervisorTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="no-data">No supervisors found</td>
                </tr>
            `;
            return;
        }

        supervisors.forEach(supervisor => {
            const isAvailable = supervisor.professionalInfo?.status !== 'Unavailable';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${supervisor.personalInfo?.ID || ''}</td>
                <td>${supervisor.personalInfo?.name || ''}</td>
                <td>${supervisor.professionalInfo?.department || ''}</td>
                <td>${supervisor.personalInfo?.email || ''}</td>
                <td>${supervisor.personalInfo?.contact || ''}</td>
                <td>
                    <div class="availability-toggle">
                        <input type="checkbox" id="availability-${supervisor.personalInfo?.ID}" 
                            class="availability-checkbox" ${isAvailable ? 'checked' : ''} 
                            onchange="toggleSupervisorAvailability('${supervisor.personalInfo?.ID}', this.checked)">
                        <label for="availability-${supervisor.personalInfo?.ID}" class="availability-label">
                            <span class="toggle-text">${isAvailable ? 'Available' : 'Unavailable'}</span>
                        </label>
                    </div>
                </td>
            `;
            supervisorTableBody.appendChild(row);
        });
    }

    // Add this function to handle supervisor availability toggle
    async function toggleSupervisorAvailability(supervisorId, isAvailable) {
        try {
            console.log(`Toggling availability for supervisor ${supervisorId} to ${isAvailable ? 'Active' : 'Unavailable'}`);
            
            const response = await fetch(`${API_URL}/faculty/${supervisorId}/availability`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: isAvailable ? 'Active' : 'Unavailable',
                    resetAllocation: !isAvailable // Add this flag to indicate allocation reset
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update supervisor availability');
            }

            // Update the toggle text without reloading the entire table
            const toggleText = document.querySelector(`#availability-${supervisorId}`).nextElementSibling.querySelector('.toggle-text');
            if (toggleText) {
                toggleText.textContent = isAvailable ? 'Available' : 'Unavailable';
            }

            // Update the local data
            const supervisor = supervisors.find(s => s.personalInfo?.ID === supervisorId);
            if (supervisor) {
                supervisor.professionalInfo.status = isAvailable ? 'Active' : 'Unavailable';
                // Also update the allocated class in local data
                if (!isAvailable) {
                    supervisor.professionalInfo.allocatedclass = 'None';
                }
            }

            showNotification(`Supervisor marked as ${isAvailable ? 'Available' : 'Unavailable'}`, 'success');
        } catch (error) {
            console.error('Error updating supervisor availability:', error);
            showNotification(error.message, 'error');
            
            // Revert the checkbox state on error
            const checkbox = document.querySelector(`#availability-${supervisorId}`);
            if (checkbox) {
                checkbox.checked = !isAvailable;
                const toggleText = checkbox.nextElementSibling.querySelector('.toggle-text');
                if (toggleText) {
                    toggleText.textContent = !isAvailable ? 'Available' : 'Unavailable';
                }
            }
        }
    }

    // Make sure to expose the function globally
    window.toggleSupervisorAvailability = toggleSupervisorAvailability;

    // Initialize the dashboard
    initializeDashboard();

    // Fresh styling for the classroom section
    const style = document.createElement('style');
    style.textContent = `
        /* Classroom Section Container */
        #virtual {
            padding: 2rem;
            background: linear-gradient(to bottom right, #f8faff, #ffffff);
        }

        /* Section Header */
        .section-header {
            margin-bottom: 2.5rem;
            text-align: center;
        }

        .section-header h1 {
            font-size: 2rem;
            color: #1a237e;
            margin-bottom: 0.5rem;
        }

        .section-header p {
            color: #5c6bc0;
            font-size: 1.1rem;
        }

        /* Control Panel */
        .classroom-controls {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            margin-bottom: 2.5rem;
            display: flex;
            gap: 2rem;
            align-items: flex-end;
        }

        .control-group {
            flex: 1;
        }

        .control-group label {
            display: block;
            margin-bottom: 0.75rem;
            color: #3949ab;
            font-weight: 500;
        }

        .form-control {
            width: 100%;
            padding: 0.875rem;
            border: 2px solid #e8eaf6;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .form-control:focus {
            border-color: #3949ab;
            box-shadow: 0 0 0 4px rgba(57, 73, 171, 0.1);
            outline: none;
        }

        /* Classroom Layout */
        .classroom-layout-container {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        /* Info Cards */
        .classroom-info {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .info-card, .legend-card {
            background: white;
            padding: 1.5rem;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .info-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            color: #3949ab;
        }

        .info-item i {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #e8eaf6;
            border-radius: 10px;
            color: #3949ab;
        }

        /* Seating Layout */
        .classroom-layout {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            align-items: center;
        }

        .teacher-desk {
            background: #e8eaf6;
            padding: 1rem 2rem;
            border-radius: 12px;
            color: #3949ab;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
            font-weight: 500;
        }

        .seating-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 1.5rem;
            padding: 1.5rem;
        }

        .seat {
            aspect-ratio: 1;
            background: #f8faff;
            width:100px;
            border: 2px solid #e8eaf6;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        .seat.empty {
            background: #f8faff;
        }

        .seat.occupied {
            background: #3949ab;
            border-color: #3949ab;
            color: white;
        }

        .seat.selected {
            background: #ffd54f;
            border-color: #ffc107;
            transform: translateY(-4px);
            box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
        }

        .seat:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .seat-number {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        /* Student Info Panel */
        .student-info-panel {
            position: fixed;
            top: 50%;
            right: 2rem;
            transform: translateY(-50%);
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            width: 400px;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .student-info-panel.active {
            opacity: 1;
            visibility: visible;
        }

        /* Action Buttons */
        .classroom-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 2rem;
        }

        .btn {
            padding: 0.875rem 1.5rem;
            border-radius: 12px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .primary-btn {
            background: #3949ab;
            color: white;
            border: none;
        }

        .primary-btn:hover {
            background: #283593;
            transform: translateY(-2px);
        }

        .secondary-btn {
            background: white;
            color: #3949ab;
            border: 2px solid #3949ab;
        }

        .secondary-btn:hover {
            background: #e8eaf6;
            transform: translateY(-2px);
        }

        @media (max-width: 1200px) {
            .classroom-layout-container {
                grid-template-columns: 1fr;
            }
            
            .classroom-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            }
        }

        @media (max-width: 768px) {
            .classroom-controls {
                flex-direction: column;
                gap: 1rem;
            }
            
            .seating-grid {
                grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            }
            
            .classroom-actions {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
                justify-content: center;
            }
        }

        /* Enhanced Seat Hover Info */
        .seat {
            position: relative;
        }

        .seat.occupied .seat-tooltip {
            position: absolute;
            top: -130px;
            left: 50%;
            transform: translateX(-50%) scale(0.95);
            width: 220px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            padding: 12px;
            visibility: hidden;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            z-index: 100;
            pointer-events: none;
        }

        .seat.occupied:hover .seat-tooltip {
            visibility: visible;
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }

        /* Tooltip Arrow */
        .seat-tooltip::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid white;
        }

        /* Tooltip Content Styling */
        .tooltip-content {
            display: grid;
            gap: 8px;
        }

        .tooltip-content div {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: #1a237e;
        }

        .tooltip-content i {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #e8eaf6;
            border-radius: 4px;
            font-size: 10px;
            color: #3949ab;
        }

        .tooltip-content .student-name {
            font-weight: 600;
            color: #1a237e;
            font-size: 14px;
            border-bottom: 1px solid #e8eaf6;
            padding-bottom: 4px;
            margin-bottom: 4px;
        }
    `;

    document.head.appendChild(style);

    // Add this in your DOMContentLoaded event listener
    const filterDepartment = document.getElementById('filterDepartment');
    if (filterDepartment) {
        filterDepartment.addEventListener('change', () => {
            supervisorCurrentPage = 1; // Reset to first page when filter changes
            loadSupervisors();
        });
    }

    // Add this to ensure the table is rendered when the supervisors section is shown
    const supervisorsSection = document.querySelector('[data-section="supervisors"]');
    if (supervisorsSection) {
        supervisorsSection.addEventListener('click', () => {
            console.log('Supervisors section clicked');
            loadSupervisors();
        });
    }

    async function handleAllocateSupervisors() {
        const button = document.getElementById('allocateSupervisorBtn');
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Allocating...';
        
        try {
            console.log('Sending allocation request...');

            const response = await fetch(`${API_URL}/allocate-supervisors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server response:', errorData);
                throw new Error(`Failed to allocate supervisors: ${errorData}`);
            }

            const data = await response.json();
            console.log('Allocation response:', data);

            showNotification(data.message, 'success');

            // Switch to the allocation tab to show results
            const allocationTab = document.querySelector('[data-tab="supervisor-allocation"]');
            if (allocationTab) {
                allocationTab.click();
            } else {
                // If tab click doesn't work, load allocations directly
                loadSupervisorAllocations();
            }
            
        } catch (error) {
            console.error('Error:', error);
            showNotification(error.message, 'error');
        } finally {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-user-plus"></i> Allocate Supervisor';
        }
    }

    // Add this to your DOMContentLoaded event listener
    document.getElementById('allocateSupervisorBtn').addEventListener('click', handleAllocateSupervisors);

    // Function to display supervisor allocations - improved debugging
    function displaySupervisorAllocations(allocations) {
        const tableBody = document.getElementById('supervisorAllocationTableBody');
        if (!tableBody) {
            console.error('Supervisor allocation table body not found');
            return;
        }

        console.log('Raw allocations data:', JSON.stringify(allocations));
        
        tableBody.innerHTML = '';

        if (!allocations || allocations.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <i class="fas fa-info-circle"></i> 
                        No allocations found. Please allocate supervisors first.
                    </td>
                </tr>`;
            return;
        }

        allocations.forEach(allocation => {
            console.log('Processing allocation:', allocation);
            const row = document.createElement('tr');
            
            // Format the date
            let examDate = 'N/A';
            if (allocation.examDate) {
                try {
                    examDate = new Date(allocation.examDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    });
                } catch (error) {
                    console.error('Error formatting date:', error);
                }
            }

            // Handle different property names and formats
            const supervisorName = allocation.supervisorName || allocation.supervisor || 'N/A';
            const department = allocation.department || 'N/A';
            const examTime = allocation.examTime || 'N/A';
            
            // Handle classroom format (could be string or object)
            let classroom = 'N/A';
            if (typeof allocation.classroom === 'string') {
                classroom = allocation.classroom;
            } else if (allocation.classroom && typeof allocation.classroom === 'object') {
                classroom = `${allocation.classroom.building || ''}-${allocation.classroom.room || ''}`;
            }
            
            // Handle paper format (could be string or object)
            let paper = 'N/A';
            if (typeof allocation.paper === 'string') {
                paper = allocation.paper;
            } else if (allocation.paper && typeof allocation.paper === 'object') {
                paper = `${allocation.paper.code || ''} - ${allocation.paper.name || ''}`;
            }

            row.innerHTML = `
                <td>${classroom}</td>
                <td>${supervisorName}</td>
                <td>${department}</td>
                <td>${examDate}</td>
                <td>${examTime}</td>
                <td>${paper}</td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Improved loadSupervisorAllocations function with better debugging
    async function loadSupervisorAllocations() {
        try {
            const tableBody = document.getElementById('supervisorAllocationTableBody');
            if (!tableBody) {
                console.error('Supervisor allocation table body not found');
                return;
            }
            
            // Show loading state
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <i class="fas fa-spinner fa-spin"></i> Loading allocations...
                    </td>
                </tr>`;
    
            console.log('Fetching supervisor allocations...');
            const response = await fetch(`${API_URL}/supervisor-allocations`);
            
            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response text:', responseText);
            
            // Parse the JSON manually to avoid errors
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Error parsing JSON:', e);
                throw new Error('Invalid JSON response from server');
            }
            
            console.log('Parsed data:', data);
            
            if (data.success) {
                if (data.allocations && data.allocations.length > 0) {
                    console.log(`Found ${data.allocations.length} allocations`);
                    displaySupervisorAllocations(data.allocations);
                } else {
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="6" class="text-center">
                                <i class="fas fa-info-circle"></i> 
                                No allocations found. Please allocate supervisors first.
                            </td>
                        </tr>`;
                }
            } else {
                console.error('Invalid data format:', data);
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center">
                            <i class="fas fa-exclamation-triangle"></i> 
                            Invalid data format received from server.
                        </td>
                    </tr>`;
            }
        } catch (error) {
            console.error('Error loading supervisor allocations:', error);
            const tableBody = document.getElementById('supervisorAllocationTableBody');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-danger">
                            <i class="fas fa-exclamation-circle"></i> 
                            ${error.message}
                        </td>
                    </tr>`;
            }
        }
    }

    // Update the event listener for the supervisor allocation tab
    document.querySelector('[data-tab="supervisor-allocation"]').addEventListener('click', () => {
        console.log('Supervisor allocation tab clicked');
        loadSupervisorAllocations();
    });

    // Add this function to handle displaying supervisor allocations
    function displaySupervisorAllocations(allocations) {
        const tableBody = document.getElementById('supervisorAllocationTableBody');
        if (!tableBody) {
            console.error('Supervisor allocation table body not found');
            return;
        }

        tableBody.innerHTML = '';

        if (!allocations || allocations.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <i class="fas fa-info-circle"></i> 
                        No allocations found. Please allocate supervisors first.
                    </td>
                </tr>`;
            return;
        }

        console.log('Displaying allocations:', allocations);

        allocations.forEach(allocation => {
            const row = document.createElement('tr');
            
            // Format the date
            let examDate = 'N/A';
            try {
                if (allocation.examDate) {
                    examDate = new Date(allocation.examDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    });
                }
            } catch (error) {
                console.error('Error formatting date:', error);
            }

            // Get classroom string
            const classroom = allocation.classroom ? 
                (typeof allocation.classroom === 'string' ? 
                    allocation.classroom : 
                    `${allocation.classroom.building || ''}-${allocation.classroom.room || ''}`) : 
                'N/A';

            // Get paper string
            const paper = allocation.paper ? 
                (typeof allocation.paper === 'string' ? 
                    allocation.paper : 
                    `${allocation.paper.code || ''} - ${allocation.paper.name || ''}`) : 
                'N/A';

            row.innerHTML = `
                <td>${classroom}</td>
                <td>${allocation.supervisor || allocation.supervisorName || 'N/A'}</td>
                <td>${allocation.department || 'N/A'}</td>
                <td>${examDate}</td>
                <td>${allocation.examTime || 'N/A'}</td>
                <td>${paper}</td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Add this function to fetch and display the assigned faculty
    async function displayAssignedFaculty(classroom, paperCode) {
        try {
            console.log(`Looking up faculty for classroom: ${classroom}, paper code: ${paperCode || 'Not specified'}`);
            
            // Build the URL based on available parameters
            let url = `${API_URL}/faculty/assigned/${classroom}`;
            if (paperCode) {
                url += `/${paperCode}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            console.log('Faculty data received:', data);
            
            const teacherDisplay = document.getElementById('assignedTeacher');
            
            if (!teacherDisplay) {
                console.error('Element with ID "assignedTeacher" not found');
                return;
            }
            
            if (data.success && data.faculty) {
                // Display faculty name if found
                const name = data.faculty.personalInfo?.name || 
                             data.faculty.supervisorName ||
                             data.faculty.name || 
                             'Name Not Available';
                
                teacherDisplay.textContent = name;
                teacherDisplay.style.color = '#16a34a'; // Green color for assigned
            } else {
                teacherDisplay.textContent = 'Not Assigned';
                teacherDisplay.style.color = '#dc2626'; // Red color for not assigned
            }
        } catch (error) {
            console.error('Error fetching assigned faculty:', error);
            const teacherDisplay = document.getElementById('assignedTeacher');
            if (teacherDisplay) {
                teacherDisplay.textContent = 'Error loading supervisor';
                teacherDisplay.style.color = '#dc2626'; // Red for error
            }
        }
    }

    // Modify the existing classroom view function to include faculty display
    document.getElementById('viewSeatingBtn')?.addEventListener('click', async () => {
        const selectedClassroom = document.getElementById('classroomSelector').value;
        const selectedPaper = document.getElementById('paperSelector').value;
        
        if (!selectedClassroom || !selectedPaper) {
            alert('Please select both classroom and paper');
            return;
        }
        
        // Get the paper code from the selected paper (assuming format: "CODE - Name")
        const paperCode = selectedPaper.split(' - ')[0];
        
        // Display the assigned faculty with both classroom and paper code
        await displayAssignedFaculty(selectedClassroom, paperCode);
        
        // Rest of your existing seating view logic...
    });

    function generateTimetable(branch, semester) {
      // Get subjects for the selected branch and semester
      const subjects = getSubjectsByBranchAndSemester(branch, semester);
      
      if (!subjects || subjects.length === 0) {
        showNotification('No subjects found for selected branch and semester', 'error');
        return;
      }

      // Generate examination dates starting from two weeks from now
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 14); // Start 2 weeks from now

      const timetableHTML = `
        <div class="timetable-header">
          <h3>${branch} - Semester ${semester}</h3>
          <p>Examination Schedule: ${startDate.toLocaleDateString()} onwards</p>
        </div>
        <table>
          <thead>
            <tr>
              <th width="15%">Date</th>
              <th width="15%">Day</th>
              <th width="35%">Morning Session<br/><span class="session-time">(10:30 AM - 1:30 PM)</span></th>
              <th width="35%">Afternoon Session<br/><span class="session-time">(2:30 PM - 5:30 PM)</span></th>
            </tr>
          </thead>
          <tbody>
            ${generateTimetableRows(subjects, startDate)}
          </tbody>
        </table>
      `;

      document.getElementById('timetableGrid').innerHTML = timetableHTML;
    }

    function generateTimetableRows(subjects, startDate) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let currentDate = new Date(startDate);
      let html = '';
      let subjectIndex = 0;

      // Add gap between theory papers
      const gapDays = 2; // 2 days gap between exams

      while (subjectIndex < subjects.length) {
        // Skip weekends
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }

        const morningSubject = subjects[subjectIndex];
        const afternoonSubject = subjects[subjectIndex + 1];
        
        html += `
          <tr>
            <td>${currentDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</td>
            <td>${days[currentDate.getDay()]}</td>
            <td>
              ${morningSubject ? `
                <div class="exam-slot">
                  <div class="subject-code">${morningSubject.code}</div>
                  <div class="subject-name">${morningSubject.name}</div>
                  <div class="exam-details">
                    <span><i class="fas fa-clock"></i> 10:30 AM - 1:30 PM</span>
                    <span><i class="fas fa-file-alt"></i> Theory Paper</span>
                  </div>
                </div>
              ` : '<div class="no-exam">No Examination</div>'}
            </td>
            <td>
              ${afternoonSubject ? `
                <div class="exam-slot">
                  <div class="subject-code">${afternoonSubject.code}</div>
                  <div class="subject-name">${afternoonSubject.name}</div>
                  <div class="exam-details">
                    <span><i class="fas fa-clock"></i> 2:30 PM - 5:30 PM</span>
                    <span><i class="fas fa-file-alt"></i> Theory Paper</span>
                  </div>
                </div>
              ` : '<div class="no-exam">No Examination</div>'}
            </td>
          </tr>
        `;

        subjectIndex += 2;
        // Add gap days between exams
        currentDate.setDate(currentDate.getDate() + (1 + gapDays));
      }

      return html;
    }

    // Helper function to get subjects using the branch mapping
    function getSubjectsByBranchAndSemester(branch, semester) {
      const branchMap = {
        'Computer Science': 'CS',
        'Information Technology': 'IT',
        'AIML': 'AIML',
        'DS': 'DS'
      };

      const mappedBranch = branchMap[branch] || branch;
      return subjectsData[mappedBranch]?.[semester] || [];
    }

    // Add this function after initializeDashboard()
    async function resetAllSupervisors() {
        try {
            // Show loading notification
            showNotification('Resetting all supervisor allocations...', 'info');
            
            const response = await fetch(`${API_URL}/reset-supervisor-availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
            const data = await response.json();
            if (data.success) {
                // Show success notification
                showNotification(`Successfully reset ${data.updatedCount} supervisor allocations`, 'success');
                
                // Reload the supervisors table to show updated status
                loadSupervisors();
                
                // Also reload the supervisor allocations table to show it's empty
                loadSupervisorAllocations();
            } else {
                console.error('Failed to reset supervisors:', data.message);
                showNotification('Failed to reset supervisor allocations', 'error');
            }
        } catch (error) {
            console.error('Error resetting supervisors:', error);
            showNotification('Error occurred while resetting allocations', 'error');
        }
    }

    // Modify the DOMContentLoaded event listener to remove the automatic reset
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize the dashboard
        initializeDashboard();
    });

    // Function to load grade cards
    async function loadGradeCards() {
        try {
            const branch = document.getElementById('filterResultBranch').value;
            const semester = document.getElementById('filterResultSemester').value;
            const year = document.getElementById('filterResultYear').value;
            const search = document.getElementById('searchResult').value;
            
            // Build query parameters
            const params = new URLSearchParams();
            if (branch) params.append('branch', branch);
            if (semester) params.append('semester', semester);
            if (year) params.append('year', year);
            if (search) params.append('search', search);
            params.append('page', gradeCardCurrentPage);
            params.append('limit', 10); // 10 items per page
            
            const response = await fetch(`${API_URL}/grade-cards?${params.toString()}`);
            const data = await response.json();
            
            if (data.success) {
                gradeCards = data.gradeCards;
                gradeCardTotalPages = data.totalPages || 1;
                
                // Update pagination UI
                document.getElementById('currentResultPage').textContent = gradeCardCurrentPage;
                document.getElementById('totalResultPages').textContent = gradeCardTotalPages;
                
                // Update stats
                document.getElementById('totalGradeCards').textContent = data.totalCount || 0;
                document.getElementById('passPercentage').textContent = `${data.passPercentage || 0}%`;
                document.getElementById('averageSGPA').textContent = data.averageSGPA?.toFixed(2) || '0.00';
                
                // Update table
                updateGradeCardsTable(gradeCards);
            } else {
                console.error('Failed to load grade cards:', data.message);
                showNotification('Failed to load grade cards', 'error');
            }
        } catch (error) {
            console.error('Error loading grade cards:', error);
            showNotification('Error loading grade cards', 'error');
        }
    }

    // Function to update grade cards table
    function updateGradeCardsTable(gradeCards) {
        const tbody = document.getElementById('resultsTableBody');
        if (!tbody) {
            console.error('Results table body not found');
            return;
        }
        
        tbody.innerHTML = '';
        
        if (!gradeCards || gradeCards.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="no-data">
                        <i class="fas fa-info-circle"></i>
                        <p>No grade cards found</p>
                    </td>
                </tr>`;
        
            // Update the count to 0 when no grade cards are found
            document.getElementById('totalGradeCards').textContent = '0';
            document.getElementById('resultsGradeCardCount').textContent = '0';
            return;
        }
        
        // Update the count based on the actual number of grade cards in the table
        document.getElementById('totalGradeCards').textContent = gradeCards.length;
        document.getElementById('resultsGradeCardCount').textContent = gradeCards.length;
        
        gradeCards.forEach(card => {
            const row = document.createElement('tr');
            
            // Format date
            const generatedDate = new Date(card.generatedAt);
            const formattedDate = generatedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            row.innerHTML = `
                <td>${card.rollNumber || 'N/A'}</td>
                <td>${card.studentName || 'N/A'}</td>
                <td>${card.branch || 'N/A'}</td>
                <td>${card.semester || 'N/A'}</td>
                <td>${card.sgpa ? card.sgpa.toFixed(2) : 'N/A'}</td>
                <td>
                    <span class="badge ${card.result === 'PASS' ? 'success' : 'danger'}">
                        ${card.result || 'N/A'}
                    </span>
                </td>
                <td>${formattedDate}</td>
                <td>
                <button class="action-btn small view-grade-card" data-id="${card._id}">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to all view buttons
    document.querySelectorAll('.view-grade-card').forEach(button => {
        button.addEventListener('click', function() {
            const gradeCardId = this.getAttribute('data-id');
            console.log("View button clicked for grade card ID:", gradeCardId);
            viewGradeCard(gradeCardId);
        });
    });
}
    // Function to handle grade card search
    function handleGradeCardSearch() {
        gradeCardCurrentPage = 1; // Reset to first page on search
        loadGradeCards();
    }

    // Function to view a specific grade card
    function viewGradeCard(gradeCardId) {
        try {
            console.log('Viewing grade card with ID:', gradeCardId);
            
            // Get the modal element
            const modal = document.getElementById('gradeCardModal');
            if (!modal) {
                console.error('Grade card modal not found in the DOM');
                alert('Modal element not found. Please check the HTML structure.');
                return;
            }
            
            console.log('Modal element found:', modal);
            
            // Force the modal to be visible with inline styles
            modal.style.display = 'block';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            
            console.log('Modal display style set to:', modal.style.display);
            
            // Get the modal body
            const modalBody = modal.querySelector('.modal-body');
            if (!modalBody) {
                console.error('Modal body not found');
                alert('Modal body element not found. Please check the HTML structure.');
                return;
            }
            
            console.log('Modal body found:', modalBody);
            
            // Show loading state
            modalBody.innerHTML = `
                <div class="loading-container" style="text-align: center; padding: 30px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 15px;"></i>
                    <p>Loading grade card details...</p>
                </div>
            `;
            
            // Add a simple message to check if content updates are working
            setTimeout(() => {
                console.log('Checking if modal content updates are working...');
                const loadingContainer = modalBody.querySelector('.loading-container');
                if (loadingContainer) {
                    loadingContainer.innerHTML += '<p>If you can see this message, content updates are working.</p>';
                }
            }, 1000);
            
            // Fetch the grade card data
            fetch(`${API_URL}/grade-cards/${gradeCardId}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Grade card data received:', data);
                    
                    if (!data.success) {
                        throw new Error(data.message || 'Failed to load grade card');
                    }
                    
                    const gradeCard = data.gradeCard;
                    
                    // Create the grade card HTML
                    const gradeCardHTML = `
                        <div class="grade-card">
                            <div class="grade-card-header">
                                <div class="university-logo">
                                    <i class="fas fa-university"></i>
                                </div>
                                <div class="university-details">
                                    <h2>Mumbai University</h2>
                                    <p>Grade Card</p>
                                </div>
                            </div>
                            
                            <div class="student-info">
                                <div class="info-grid">
                                    <div class="info-item">
                                        <span>Student Name:</span>
                                        <p>${gradeCard.studentName || 'N/A'}</p>
                                    </div>
                                    <div class="info-item">
                                        <span>Roll Number:</span>
                                        <p>${gradeCard.rollNumber || 'N/A'}</p>
                                    </div>
                                    <div class="info-item">
                                        <span>Branch:</span>
                                        <p>${gradeCard.branch || 'N/A'}</p>
                                    </div>
                                    <div class="info-item">
                                        <span>Semester:</span>
                                        <p>${gradeCard.semester || 'N/A'}</p>
                                    </div>
                                    <div class="info-item">
                                        <span>Academic Year:</span>
                                        <p>${gradeCard.academicYear || 'N/A'}</p>
                                    </div>
                                    <div class="info-item">
                                        <span>Generated By:</span>
                                        <p>${gradeCard.generatedByName || 'Faculty'}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="marks-table-container">
                                <table class="grade-table">
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Semester Exam</th>
                                            <th>Internal</th>
                                            <th>Practical</th>
                                            <th>Term Work</th>
                                            <th>Total</th>
                                            <th>Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${gradeCard.subjects && gradeCard.subjects.length > 0 
                                            ? gradeCard.subjects.map(subject => `
                                                <tr>
                                                    <td>${subject.name || 'N/A'}</td>
                                                    <td>${subject.semesterMarks || '0'}</td>
                                                    <td>${subject.internalMarks || '0'}</td>
                                                    <td>${subject.practicalMarks || '0'}</td>
                                                    <td>${subject.termworkMarks || '0'}</td>
                                                    <td>${subject.totalMarks || '0'}</td>
                                                    <td><span class="grade grade-${subject.grade}">${subject.grade || 'N/A'}</span></td>
                                                </tr>
                                            `).join('')
                                            : `<tr><td colspan="7" style="text-align: center; padding: 20px;">No subject data available</td></tr>`
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <div class="grade-summary">
                                <div class="summary-grid">
                                    <div class="summary-item">
                                        <span>SGPA:</span>
                                        <p>${gradeCard.sgpa ? gradeCard.sgpa.toFixed(2) : 'N/A'}</p>
                                    </div>
                                    <div class="summary-item">
                                        <span>Result:</span>
                                        <p class="${gradeCard.result === 'PASS' ? 'text-success' : 'text-danger'}">${gradeCard.result || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="grade-card-footer">
                                <button class="action-btn" id="printGradeCardBtn">
                                    <i class="fas fa-print"></i> Print Grade Card
                                </button>
                            </div>
                        </div>
                    `;
                    
                    console.log('About to update modal content with grade card HTML');
                    
                    // Update the modal body with the grade card HTML
                    modalBody.innerHTML = gradeCardHTML;
                    
                    console.log('Modal content updated');
                    
                    // Add event listener to the print button
                    const printBtn = document.getElementById('printGradeCardBtn');
                    if (printBtn) {
                        printBtn.addEventListener('click', function() {
                            printGradeCard();
                        });
                    }
                })
                .catch(error => {
                    console.error('Error viewing grade card:', error);
                    
                    modalBody.innerHTML = `
                        <div class="error-container" style="text-align: center; padding: 30px; color: #ef4444;">
                            <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 15px;"></i>
                            <p>Error loading grade card: ${error.message}</p>
                        </div>
                    `;
                });
        } catch (error) {
            console.error('Error in viewGradeCard function:', error);
            alert(`Error: ${error.message}`);
        }
    }

    // Add this to ensure the modal is properly styled
    document.addEventListener('DOMContentLoaded', function() {
        // Add CSS to ensure the modal displays properly
        const style = document.createElement('style');
        style.textContent = `
            /* Modal Styles */
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .modal-content {
                background-color: #ffffff;
                margin: 3% auto;
                width: 85%;
                max-width: 1000px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                overflow: hidden;
                animation: slideDown 0.4s ease-out;
            }
            
            @keyframes slideDown {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 30px;
                background-color: var(--primary);
                color: white;
                border-bottom: 1px solid var(--border);
            }
            
            .modal-header h2 {
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0;
            }
            
            .close-btn {
                background: transparent;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                transition: transform 0.2s;
            }
            
            .close-btn:hover {
                transform: scale(1.1);
            }
            
            .modal-body {
                padding: 30px;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            /* Grade Card Styles */
            .grade-card {
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .grade-card-header {
                display: flex;
                align-items: center;
                padding: 25px 30px;
                background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                color: white;
                margin-bottom: 30px;
                border-radius: 8px 8px 0 0;
            }
            
            .university-logo {
                width: 70px;
                height: 70px;
                background-color: rgba(255, 255, 255, 0.2);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 25px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            
            .university-logo i {
                font-size: 2rem;
            }
            
            .university-details h2 {
                margin: 0;
                font-size: 1.8rem;
                font-weight: 600;
            }
            
            .university-details p {
                margin: 5px 0 0;
                font-size: 1.1rem;
                opacity: 0.9;
            }
            
            .student-info {
                padding: 0 30px 20px;
                border-bottom: 1px solid var(--border);
                margin-bottom: 25px;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
            
            .info-item {
                background-color: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .info-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            }
            
            .info-item span {
                font-size: 0.85rem;
                color: var(--text-light);
                display: block;
                margin-bottom: 5px;
            }
            
            .info-item p {
                font-size: 1.1rem;
                font-weight: 500;
                margin: 0;
                color: var(--text);
            }
            
            .marks-table-container {
                padding: 0 30px 25px;
                margin-bottom: 25px;
            }
            
            .grade-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            }
            
            .grade-table th {
                background-color: var(--primary-light);
                color: white;
                padding: 15px;
                text-align: left;
                font-weight: 500;
            }
            
            .grade-table td {
                padding: 15px;
                border-bottom: 1px solid var(--border);
                background-color: white;
            }
            
            .grade-table tr:last-child td {
                border-bottom: none;
            }
            
            .grade-table tr:nth-child(even) td {
                background-color: #f8fafc;
            }
            
            .grade {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                font-weight: 600;
                font-size: 0.9rem;
            }
            
            .grade-A {
                background-color: #d1fae5;
                color: #047857;
            }
            
            .grade-B {
                background-color: #e0f2fe;
                color: #0369a1;
            }
            
            .grade-C {
                background-color: #fef3c7;
                color: #92400e;
            }
            
            .grade-D {
                background-color: #fef9c3;
                color: #854d0e;
            }
            
            .grade-E {
                background-color: #fce7f3;
                color: #9d174d;
            }
            
            .grade-F {
                background-color: #fee2e2;
                color: #b91c1c;
            }
            
            .grade-summary {
                padding: 0 30px 20px;
                border-top: 1px solid var(--border);
                margin-top: 10px;
                padding-top: 25px;
            }
            
            .summary-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }
            
            .summary-item {
                background-color: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .summary-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            }
            
            .summary-item span {
                font-size: 0.9rem;
                color: var(--text-light);
                display: block;
                margin-bottom: 8px;
            }
            
            .summary-item p {
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0;
            }
            
            .text-success {
                color: var(--success);
            }
            
            .text-danger {
                color: var(--danger);
            }
            
            .grade-card-footer {
                padding: 20px 30px;
                display: flex;
                justify-content: flex-end;
                background-color: #f8fafc;
                border-top: 1px solid var(--border);
                border-radius: 0 0 8px 8px;
            }
            
            #printGradeCardBtn {
                background-color: var(--primary);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background-color 0.2s, transform 0.2s;
            }
            
            #printGradeCardBtn:hover {
                background-color: var(--primary-dark);
                transform: translateY(-2px);
            }
            
            #printGradeCardBtn i {
                font-size: 1rem;
            }
            
            /* Loading and Error Styles */
            .loading-container {
                text-align: center;
                padding: 50px 30px;
            }
            
            .loading-container i {
                font-size: 3rem;
                color: var(--primary);
                margin-bottom: 20px;
            }
            
            .loading-container p {
                font-size: 1.1rem;
                color: var(--text-light);
            }
            
            .error-container {
                text-align: center;
                padding: 50px 30px;
                color: var(--danger);
            }
            
            .error-container i {
                font-size: 3rem;
                margin-bottom: 20px;
            }
            
            .error-container p {
                font-size: 1.1rem;
            }
            
            /* Responsive Styles */
            @media (max-width: 992px) {
                .info-grid, .summary-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    margin: 5% auto;
                }
                
                .info-grid {
                    grid-template-columns: 1fr;
                }
                
                .grade-table {
                    font-size: 0.9rem;
                }
            }
            
            @media (max-width: 576px) {
                .modal-header {
                    padding: 15px 20px;
                }
                
                .modal-body {
                    padding: 20px;
                }
                
                .university-logo {
                    width: 50px;
                    height: 50px;
                }
                
                .university-details h2 {
                    font-size: 1.4rem;
                }
                
                .grade-table th, .grade-table td {
                    padding: 10px;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Initialize modal close button
        const closeGradeCardModal = document.getElementById('closeGradeCardModal');
        if (closeGradeCardModal) {
            closeGradeCardModal.addEventListener('click', function() {
                const modal = document.getElementById('gradeCardModal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        }
    });

    // Make sure the close button works
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize modal close button
        const closeGradeCardModal = document.getElementById('closeGradeCardModal');
        if (closeGradeCardModal) {
            closeGradeCardModal.addEventListener('click', function() {
                const modal = document.getElementById('gradeCardModal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // Add print functionality
        const printGradeCardBtn = document.getElementById('printGradeCardBtn');
        if (printGradeCardBtn) {
            printGradeCardBtn.addEventListener('click', function() {
                const gradeCard = document.querySelector('.grade-card');
                if (gradeCard) {
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Grade Card</title>
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                            <style>
                                body { font-family: Arial, sans-serif; padding: 20px; }
                                .grade-card { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
                                /* Add more styles as needed */
                                @media print {
                                    body { margin: 0; padding: 0; }
                                    .grade-card { border: none; }
                                }
                            </style>
                        </head>
                        <body>
                            ${gradeCard.outerHTML}
                            <script>
                                window.onload = function() {
                                    window.print();
                                    setTimeout(function() {
                                        window.close();
                                    }, 500);
                                };
                            </script>
                        </body>
                        </html>
                    `);
                    printWindow.document.close();
                }
            });
        }
    });

    // Function to print grade card
    function printGradeCard() {
        const modal = document.getElementById('gradeCardModal');
        const modalContent = modal.querySelector('.modal-content');
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        
        // Get the grade card HTML
        const gradeCard = document.querySelector('.grade-card').cloneNode(true);
        
        // Remove the print button from the clone
        const printBtn = gradeCard.querySelector('.grade-card-footer');
        if (printBtn) {
            printBtn.remove();
        }
        
        // Create print HTML
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Grade Card</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    .grade-card {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                    }
                    .grade-card-header {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #eee;
                        margin-bottom: 20px;
                    }
                    .university-logo {
                        width: 60px;
                        height: 60px;
                        background-color: #4361ee;
                        color: white;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 30px;
                    }
                    .university-details h2 {
                        font-size: 22px;
                        margin: 0;
                    }
                    .university-details p {
                        font-size: 16px;
                        margin: 5px 0 0;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 15px;
                        margin-bottom: 20px;
                    }
                    .info-item span {
                        font-size: 12px;
                        color: #666;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .info-item p {
                        font-size: 16px;
                        font-weight: 500;
                        margin: 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        padding: 10px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        background-color: #f8f9fa;
                    }
                    .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15px;
                        margin-top: 20px;
                        padding-top: 15px;
                        border-top: 1px solid #eee;
                    }
                    .summary-item span {
                        font-size: 14px;
                        color: #666;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .summary-item p {
                        font-size: 18px;
                        font-weight: 600;
                        margin: 0;
                    }
                    .grade {
                        display: inline-block;
                        width: 30px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        border-radius: 50%;
                        font-weight: 600;
                    }
                    .grade-A { background-color: #d1fae5; color: #047857; }
                    .grade-B { background-color: #e0f2fe; color: #0369a1; }
                    .grade-C { background-color: #fef3c7; color: #92400e; }
                    .grade-D { background-color: #fef9c3; color: #854d0e; }
                    .grade-E { background-color: #fce7f3; color: #9d174d; }
                    .grade-F { background-color: #fee2e2; color: #b91c1c; }
                    @media print {
                        body { margin: 0; padding: 0; }
                        .grade-card { border: none; }
                    }
                </style>
            </head>
            <body>
                ${gradeCard.outerHTML}
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    }

    // Add event listener for the reset classroom allocations button
    document.getElementById('resetClassroomAllocationsBtn').addEventListener('click', function() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to reset all classroom allocations? This action cannot be undone.')) {
            resetAllClassroomAllocations();
        }
    });

    // Function to reset all classroom allocations
    async function resetAllClassroomAllocations() {
        try {
            // Show loading notification
            showNotification('Resetting all classroom allocations...', 'info');
            
            const response = await fetch(`${API_URL}/reset-classroom-allocations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
            const data = await response.json();
            if (data.success) {
                // Show success notification
                showNotification(`Successfully reset ${data.deletedCount} classroom allocations`, 'success');
                
                // Clear the table immediately without waiting for a reload
                const tableBody = document.getElementById('classroomAllocationTableBody') || 
                                 document.getElementById('allocationTableBody') ||
                                 document.getElementById('manageAllocationTableBody');
                
                if (tableBody) {
                    tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No allocations found</td></tr>';
                } else {
                    console.error('Could not find table body to update');
                }
                
                // Also try to reload the data (as a backup)
                loadClassroomAllocations();
            } else {
                console.error('Failed to reset classroom allocations:', data.message);
                showNotification('Failed to reset classroom allocations', 'error');
            }
        } catch (error) {
            console.error('Error resetting classroom allocations:', error);
            showNotification('Error occurred while resetting allocations', 'error');
        }
    }

    // Make sure this function exists to reload the classroom allocations table
    // If it doesn't exist yet, you'll need to implement it
    function loadClassroomAllocations() {
        // Fetch and display classroom allocations
        fetch(`${API_URL}/classroom-allocations`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayClassroomAllocations(data.allocations);
                } else {
                    console.error('Failed to load classroom allocations:', data.message);
                    showNotification('Failed to load classroom allocations', 'error');
                }
            })
            .catch(error => {
                console.error('Error loading classroom allocations:', error);
                showNotification('Error occurred while loading allocations', 'error');
            });
    }

    // Function to display classroom allocations in the table
    function displayClassroomAllocations(allocations) {
        const tableBody = document.getElementById('classroomAllocationTableBody');
        
        if (!tableBody) {
            console.error('Classroom allocation table body element not found');
            return;
        }
        
        if (allocations.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No allocations found</td></tr>';
            return;
        }
        
        tableBody.innerHTML = allocations.map(allocation => {
            const examDate = new Date(allocation.examDate).toLocaleDateString();
            return `
                <tr>
                    <td>${allocation.classroom?.building || 'N/A'} - ${allocation.classroom?.room || 'N/A'}</td>
                    <td>${allocation.studentRollNo || 'N/A'}</td>
                    <td>${allocation.paper?.code || 'N/A'} - ${allocation.paper?.name || 'N/A'}</td>
                    <td>${examDate}</td>
                    <td>${allocation.examTime || 'N/A'}</td>
                    <td>${allocation.benchNumber?.number || 'N/A'}</td>
                </tr>
            `;
        }).join('');
    }

    // Function to load available classrooms with scheduled exams
    async function loadAvailableClassrooms() {
        try {
            const response = await fetch(`${API_URL}/available-classrooms`);
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Get the classroom selector dropdown
                const classroomSelector = document.getElementById('classroomSelector');
                if (!classroomSelector) {
                    console.error('Classroom selector not found');
                    return;
                }
                
                // Clear existing options except the first one
                while (classroomSelector.options.length > 1) {
                    classroomSelector.remove(1);
                }
                
                // Add available classrooms to the dropdown
                if (data.classrooms && data.classrooms.length > 0) {
                    data.classrooms.forEach(classroom => {
                        const option = document.createElement('option');
                        option.value = classroom.room;
                        option.textContent = `${classroom.building} - ${classroom.room}`;
                        classroomSelector.appendChild(option);
                    });
                    console.log(`Loaded ${data.classrooms.length} classrooms`);
                } else {
                    console.log('No classrooms found with scheduled exams');
                    const option = document.createElement('option');
                    option.disabled = true;
                    option.textContent = 'No classrooms with scheduled exams';
                    classroomSelector.appendChild(option);
                }
                
                // Add event listener to the classroom selector
                classroomSelector.removeEventListener('change', handleClassroomChange);
                classroomSelector.addEventListener('change', handleClassroomChange);
            } else {
                console.error('Failed to load available classrooms:', data.message);
            }
        } catch (error) {
            console.error('Error loading available classrooms:', error);
        }
    }

    // Function to handle classroom selection change
    async function handleClassroomChange(event) {
        const selectedRoom = event.target.value;
        console.log(`Classroom selected: ${selectedRoom}`);
        
        // Load papers for the selected classroom
        await loadPapersForClassroom(selectedRoom);
    }

    // Function to load papers for a specific classroom
    async function loadPapersForClassroom(classroom) {
        try {
            if (!classroom) {
                console.log('No classroom selected');
                // Clear paper selector
                const paperSelector = document.getElementById('paperSelector');
                if (paperSelector) {
                    while (paperSelector.options.length > 1) {
                        paperSelector.remove(1);
                    }
                }
                return;
            }
            
            console.log(`Fetching papers for classroom: ${classroom}`);
            
            const response = await fetch(`${API_URL}/papers-by-classroom?room=${classroom}`);
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Papers response:', data);
            
            // Get the paper selector dropdown
            const paperSelector = document.getElementById('paperSelector');
            if (!paperSelector) {
                console.error('Paper selector not found');
                return;
            }
            
            // Clear existing options except the first one
            while (paperSelector.options.length > 1) {
                paperSelector.remove(1);
            }
            
            if (data.success && data.papers && data.papers.length > 0) {
                // Add papers to the dropdown
                data.papers.forEach(paper => {
                    if (paper.code && paper.name) {
                        const option = document.createElement('option');
                        option.value = paper.code;
                        option.textContent = `${paper.code} - ${paper.name}`;
                        paperSelector.appendChild(option);
                    }
                });
                console.log(`Added ${data.papers.length} papers to selector`);
            } else {
                console.log('No papers found for this classroom');
                const option = document.createElement('option');
                option.disabled = true;
                option.textContent = 'No papers scheduled in this classroom';
                paperSelector.appendChild(option);
            }
        } catch (error) {
            console.error('Error loading papers for classroom:', error);
        }
    }

    // Initialize the classroom section when the virtual tab is clicked
    function initializeClassroomSection() {
        console.log('Initializing classroom section');
        loadAvailableClassrooms();
        
        // Clear paper selector initially
        const paperSelector = document.getElementById('paperSelector');
        if (paperSelector) {
            while (paperSelector.options.length > 1) {
                paperSelector.remove(1);
            }
        }
    }

    // Make sure to call initializeClassroomSection when the virtual section is activated
    // This should be in your existing code where you handle section navigation
});

// Add event listener for allocation search
const searchAllocationInput = document.getElementById('searchAllocation');
if (searchAllocationInput) {
  searchAllocationInput.addEventListener('input', handleAllocationSearch);
}

