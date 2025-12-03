// Mumbai University Engineering Subjects Data
const subjectsData = {
    CS: {
        1: [
            { code: 'FEC101', name: 'Applied Mathematics - I' },
            { code: 'FEC102', name: 'Applied Physics - I' },
            { code: 'FEC103', name: 'Applied Chemistry - I' },
            { code: 'FEC104', name: 'Engineering Mechanics' },
            { code: 'FEC105', name: 'Basic Electrical Engineering' },
            { code: 'FEC106', name: 'Environmental Studies' }
        ],
        2: [
            { code: 'FEC201', name: 'Applied Mathematics - II' },
            { code: 'FEC202', name: 'Applied Physics - II' },
            { code: 'FEC203', name: 'Applied Chemistry - II' },
            { code: 'FEC204', name: 'Engineering Drawing' },
            { code: 'FEC205', name: 'C Programming' },
            { code: 'FEC206', name: 'Professional Communication and Ethics - I' }
        ],
        
        3: [
            { code: 'CSC301', name: 'Engineering Mathematics - III' },
            { code: 'CSC302', name: 'Discrete Structures and Graph Theory' },
            { code: 'CSC303', name: 'Data Structures' },
            { code: 'CSC304', name: 'Digital Logic & Computer Architecture' },
            { code: 'CSC305', name: 'Computer Graphics' }
        ],
        4: [
            { code: 'CSC401', name: 'Engineering Mathematics - IV' },
            { code: 'CSC402', name: 'Analysis of Algorithms' },
            { code: 'CSC403', name: 'Database Management System' },
            { code: 'CSC404', name: 'Operating Systems' },
            { code: 'CSC405', name: 'Microprocessor Programming' }
        ],
        5: [
            { code: 'CSC501', name: 'Theoretical Computer Science' },
            { code: 'CSC502', name: 'Software Engineering' },
            { code: 'CSC503', name: 'Computer Networks' },
            { code: 'CSC504', name: 'Data Warehousing & Mining' },
            { code: 'CSC505', name: 'Professional Communication and Ethics - II' }
        ],
        6: [
            { code: 'CSC601', name: 'System Programming & Compiler Construction' },
            { code: 'CSC602', name: 'Cryptography & System Security' },
            { code: 'CSC603', name: 'Mobile Computing' },
            { code: 'CSC604', name: 'Artificial Intelligence' },
            { code: 'CSC605', name: 'Internet Programming' }
        ],
        7: [
            { code: 'CSC701', name: 'Digital Signal & Image Processing' },
            { code: 'CSC702', name: 'Mobile Communication & Computing' },
            { code: 'CSC703', name: 'Artificial Intelligence & Soft Computing' },
            { code: 'CSC704', name: 'Advanced System Security & Digital Forensics' },
            { code: 'CSC705', name: 'Enterprise Resource Planning' }
        ],
        8: [
            { code: 'CSC801', name: 'Human Machine Interaction' },
            { code: 'CSC802', name: 'Distributed Computing' },
            { code: 'CSC803', name: 'Cloud Computing & Services' },
            { code: 'CSC804', name: 'Big Data Analytics' },
            { code: 'CSC805', name: 'Project Management' }
        ]
    },
    IT: {
        1: [
            { code: 'FEC101', name: 'Applied Mathematics - I' },
            { code: 'FEC102', name: 'Applied Physics - I' },
            { code: 'FEC103', name: 'Applied Chemistry - I' },
            { code: 'FEC104', name: 'Engineering Mechanics' },
            { code: 'FEC105', name: 'Basic Electrical Engineering' },
            { code: 'FEC106', name: 'Environmental Studies' }
        ],
        2: [
            { code: 'FEC201', name: 'Applied Mathematics - II' },
            { code: 'FEC202', name: 'Applied Physics - II' },
            { code: 'FEC203', name: 'Applied Chemistry - II' },
            { code: 'FEC204', name: 'Engineering Drawing' },
            { code: 'FEC205', name: 'C Programming' },
            { code: 'FEC206', name: 'Professional Communication and Ethics - I' }
        ],
        3: [
            { code: 'ITC301', name: 'Engineering Mathematics - III' },
            { code: 'ITC302', name: 'Data Structures & Analysis' },
            { code: 'ITC303', name: 'Database Management System' },
            { code: 'ITC304', name: 'Computer Networks' },
            { code: 'ITC305', name: 'Web Programming' }
        ],
        4: [
            { code: 'ITC401', name: 'Engineering Mathematics - IV' },
            { code: 'ITC402', name: 'Computer Organization & Architecture' },
            { code: 'ITC403', name: 'Operating Systems' },
            { code: 'ITC404', name: 'Software Engineering' },
            { code: 'ITC405', name: 'Computer Graphics & Virtual Reality' }
        ],
        5: [
            { code: 'ITC501', name: 'Internet Programming' },
            { code: 'ITC502', name: 'Advanced Database Management Systems' },
            { code: 'ITC503', name: 'Cryptography & Network Security' },
            { code: 'ITC504', name: 'Microcontroller & Embedded Programming' },
            { code: 'ITC505', name: 'Business Communication & Ethics' }
        ],
        6: [
            { code: 'ITC601', name: 'Software Project Management' },
            { code: 'ITC602', name: 'Cloud Computing & Services' },
            { code: 'ITC603', name: 'Wireless Networks' },
            { code: 'ITC604', name: 'Data Mining & Business Intelligence' },
            { code: 'ITC605', name: 'Enterprise Resource Planning' }
        ],
        7: [
            { code: 'ITC701', name: 'Enterprise Network Design' },
            { code: 'ITC702', name: 'Infrastructure Security' },
            { code: 'ITC703', name: 'Artificial Intelligence & Soft Computing' },
            { code: 'ITC704', name: 'Mobile Application Development' },
            { code: 'ITC705', name: 'Big Data Analytics' }
        ],
        8: [
            { code: 'ITC801', name: 'Internet of Things' },
            { code: 'ITC802', name: 'Distributed Computing' },
            { code: 'ITC803', name: 'Machine Learning' },
            { code: 'ITC804', name: 'Information & Network Security' },
            { code: 'ITC805', name: 'Digital Forensics' }
        ]
    },
    "AIML": {
        1: [
            { code: 'FEC101', name: 'Applied Mathematics - I' },
            { code: 'FEC102', name: 'Applied Physics - I' },
            { code: 'FEC103', name: 'Applied Chemistry - I' },
            { code: 'FEC104', name: 'Engineering Mechanics' },
            { code: 'FEC105', name: 'Basic Electrical Engineering' },
            { code: 'FEC106', name: 'Environmental Studies' }
        ],
        2: [
            { code: 'FEC201', name: 'Applied Mathematics - II' },
            { code: 'FEC202', name: 'Applied Physics - II' },
            { code: 'FEC203', name: 'Applied Chemistry - II' },
            { code: 'FEC204', name: 'Engineering Drawing' },
            { code: 'FEC205', name: 'C Programming' },
            { code: 'FEC206', name: 'Professional Communication and Ethics - I' }
        ],
        3: [
            { code: 'AIML301', name: 'Engineering Mathematics - III' },
            { code: 'AIML302', name: 'Data Structures & Algorithms' },
            { code: 'AIML303', name: 'Object Oriented Programming' },
            { code: 'AIML304', name: 'Digital Logic & Computer Architecture' },
            { code: 'AIML305', name: 'Introduction to AI & ML' }
        ],
        4: [
            { code: 'AIML401', name: 'Engineering Mathematics - IV' },
            { code: 'AIML402', name: 'Database Management Systems' },
            { code: 'AIML403', name: 'Operating Systems' },
            { code: 'AIML404', name: 'Statistical Learning' },
            { code: 'AIML405', name: 'Python Programming for AI' }
        ],
        5: [
            { code: 'AIML501', name: 'Machine Learning' },
            { code: 'AIML502', name: 'Deep Learning' },
            { code: 'AIML503', name: 'Computer Networks & Security' },
            { code: 'AIML504', name: 'Big Data Analytics' },
            { code: 'AIML505', name: 'Professional Communication and Ethics - II' }
        ],
        6: [
            { code: 'AIML601', name: 'Natural Language Processing' },
            { code: 'AIML602', name: 'Computer Vision' },
            { code: 'AIML603', name: 'Robotics & AI' },
            { code: 'AIML604', name: 'Cloud Computing & MLOps' },
            { code: 'AIML605', name: 'AI Ethics & Governance' }
        ],
        7: [
            { code: 'AIML701', name: 'Reinforcement Learning' },
            { code: 'AIML702', name: 'AI in Healthcare' },
            { code: 'AIML703', name: 'Speech Recognition & Processing' },
            { code: 'AIML704', name: 'Advanced Deep Learning' },
            { code: 'AIML705', name: 'AI Project Management' }
        ],
        8: [
            { code: 'AIML801', name: 'Generative AI' },
            { code: 'AIML802', name: 'Edge AI & IoT' },
            { code: 'AIML803', name: 'AI Systems Design' },
            { code: 'AIML804', name: 'Industry Project' },
            { code: 'AIML805', name: 'Research Methodology in AI' }
        ]
    },
    "DS": {
        1: [
            { code: 'FEC101', name: 'Applied Mathematics - I' },
            { code: 'FEC102', name: 'Applied Physics - I' },
            { code: 'FEC103', name: 'Applied Chemistry - I' },
            { code: 'FEC104', name: 'Engineering Mechanics' },
            { code: 'FEC105', name: 'Basic Electrical Engineering' },
            { code: 'FEC106', name: 'Environmental Studies' }
        ],
        2: [
            { code: 'FEC201', name: 'Applied Mathematics - II' },
            { code: 'FEC202', name: 'Applied Physics - II' },
            { code: 'FEC203', name: 'Applied Chemistry - II' },
            { code: 'FEC204', name: 'Engineering Drawing' },
            { code: 'FEC205', name: 'C Programming' },
            { code: 'FEC206', name: 'Professional Communication and Ethics - I' }
        ],
        3: [
            { code: 'DS301', name: 'Engineering Mathematics - III' },
            { code: 'DS302', name: 'Data Structures & Algorithms' },
            { code: 'DS303', name: 'Database Systems' },
            { code: 'DS304', name: 'Python Programming' },
            { code: 'DS305', name: 'Statistics for Data Science' }
        ],
        4: [
            { code: 'DS401', name: 'Engineering Mathematics - IV' },
            { code: 'DS402', name: 'Machine Learning Fundamentals' },
            { code: 'DS403', name: 'Data Visualization' },
            { code: 'DS404', name: 'Big Data Technologies' },
            { code: 'DS405', name: 'Operating Systems' }
        ],
        5: [
            { code: 'DS501', name: 'Advanced Database Systems' },
            { code: 'DS502', name: 'Data Mining & Analytics' },
            { code: 'DS503', name: 'Deep Learning' },
            { code: 'DS504', name: 'Cloud Computing' },
            { code: 'DS505', name: 'Professional Communication and Ethics - II' }
        ],
        6: [
            { code: 'DS601', name: 'Natural Language Processing' },
            { code: 'DS602', name: 'Time Series Analysis' },
            { code: 'DS603', name: 'Computer Vision' },
            { code: 'DS604', name: 'Data Engineering' },
            { code: 'DS605', name: 'Business Analytics' }
        ],
        7: [
            { code: 'DS701', name: 'Advanced Machine Learning' },
            { code: 'DS702', name: 'Data Science in Practice' },
            { code: 'DS703', name: 'Recommender Systems' },
            { code: 'DS704', name: 'Data Privacy & Security' },
            { code: 'DS705', name: 'Research Methodology' }
        ],
        8: [
            { code: 'DS801', name: 'Large Scale Data Processing' },
            { code: 'DS802', name: 'Data Science Capstone Project' },
            { code: 'DS803', name: 'Ethics in Data Science' },
            { code: 'DS804', name: 'Industry Project' },
            { code: 'DS805', name: 'Emerging Trends in Data Science' }
        ]
    },
    "MECHANICAL": {
        1: [
            { code: 'FEC101', name: 'Applied Mathematics - I' },
            { code: 'FEC102', name: 'Applied Physics - I' },
            { code: 'FEC103', name: 'Applied Chemistry - I' },
            { code: 'FEC104', name: 'Engineering Mechanics' },
            { code: 'FEC105', name: 'Basic Electrical Engineering' },
            { code: 'FEC106', name: 'Environmental Studies' }
        ],
        2: [
            { code: 'FEC201', name: 'Applied Mathematics - II' },
            { code: 'FEC202', name: 'Applied Physics - II' },
            { code: 'FEC203', name: 'Applied Chemistry - II' },
            { code: 'FEC204', name: 'Engineering Drawing' },
            { code: 'FEC205', name: 'Workshop Practice' },
            { code: 'FEC206', name: 'Professional Communication and Ethics - I' }
        ],
        3: [
            { code: 'MEC301', name: 'Engineering Mathematics - III' },
            { code: 'MEC302', name: 'Strength of Materials' },
            { code: 'MEC303', name: 'Engineering Thermodynamics' },
            { code: 'MEC304', name: 'Manufacturing Processes' },
            { code: 'MEC305', name: 'Computer Aided Machine Drawing' }
        ],
        4: [
            { code: 'MEC401', name: 'Engineering Mathematics - IV' },
            { code: 'MEC402', name: 'Fluid Mechanics' },
            { code: 'MEC403', name: 'Theory of Machines' },
            { code: 'MEC404', name: 'Production Technology' },
            { code: 'MEC405', name: 'Material Technology' }
        ],
        5: [
            { code: 'MEC501', name: 'Heat Transfer' },
            { code: 'MEC502', name: 'Dynamics of Machinery' },
            { code: 'MEC503', name: 'Machine Design - I' },
            { code: 'MEC504', name: 'Metrology & Quality Engineering' },
            { code: 'MEC505', name: 'Professional Communication and Ethics - II' }
        ],
        6: [
            { code: 'MEC601', name: 'Machine Design - II' },
            { code: 'MEC602', name: 'Industrial Engineering' },
            { code: 'MEC603', name: 'CAD/CAM/CAE' },
            { code: 'MEC604', name: 'Mechanical Vibrations' },
            { code: 'MEC605', name: 'Automobile Engineering' }
        ],
        7: [
            { code: 'MEC701', name: 'Refrigeration & Air Conditioning' },
            { code: 'MEC702', name: 'Mechatronics' },
            { code: 'MEC703', name: 'Power Plant Engineering' },
            { code: 'MEC704', name: 'Industrial Automation' },
            { code: 'MEC705', name: 'Project Management' }
        ],
        8: [
            { code: 'MEC801', name: 'Energy Management' },
            { code: 'MEC802', name: 'Industrial Product Design' },
            { code: 'MEC803', name: 'Robotics' },
            { code: 'MEC804', name: 'Industry 4.0' },
            { code: 'MEC805', name: 'Capstone Project' }
        ]
    }
};

// Keep the existing "CSE AIML" and "CSE DS" keys for backward compatibility
// This ensures any existing data will still work
subjectsData["CSE AIML"] = subjectsData["AIML"];
subjectsData["CSE DS"] = subjectsData["DS"];

document.addEventListener('DOMContentLoaded', () => {
    // Force activate the profile section when the page loads
    setTimeout(() => {
        const profileNavItem = document.querySelector('.nav-item[data-section="profile"]');
        if (profileNavItem) {
            // Programmatically click the profile nav item
            profileNavItem.click();
        }
    }, 100); // Small delay to ensure other initialization is complete
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get roll number from storage
        const rollNumber = localStorage.getItem('rollNumber') || sessionStorage.getItem('rollNumber');
        
        if (!rollNumber) {
            window.location.href = '/Login/Login.html';
            return;
        }

        // Fetch student profile data
        const response = await fetch(`http://localhost:5001/api/student/profile/${rollNumber}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch profile data');
        }

        const student = data.student;

        // Update profile information
        document.querySelector('.user-name').textContent = `${student.firstName} ${student.lastName}`;
        document.querySelector('.user-avatar').src = `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}`;

        // Update Personal Information Card
        const personalInfo = document.querySelector('#profile .profile-grid');
        personalInfo.innerHTML = `
            <div class="profile-card">
                <div class="card-header">
                    <i class="fas fa-user-circle"></i>
                    <h3>Personal Information</h3>
                </div>
                <div class="card-content">
                    <div class="info-group">
                        <label>Full Name</label>
                        <p>${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}</p>
                    </div>
                    <div class="info-group">
                        <label>Roll Number</label>
                        <p>${student.rollNumber}</p>
                    </div>
                    <div class="info-group">
                        <label>Branch</label>
                        <p>${student.branch}</p>
                    </div>
                    <div class="info-group">
                        <label>Semester</label>
                        <p>${student.semester}th Semester</p>
                    </div>
                </div>
            </div>

            <div class="profile-card">
                <div class="card-header">
                    <i class="fas fa-address-card"></i>
                    <h3>Contact Information</h3>
                </div>
                <div class="card-content">
                    <div class="info-group">
                        <label>Email</label>
                        <p>${student.email}</p>
                    </div>
                    <div class="info-group">
                        <label>Phone</label>
                        <p>${student.phone}</p>
                    </div>
                </div>
            </div>

            <div class="profile-card">
                <div class="card-header">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>Academic Status</h3>
                </div>
                <div class="card-content">
                    <div class="info-group">
                        <label>Academic Year</label>
                        <p>${student.academicYear}</p>
                    </div>
                    <div class="info-group">
                        <label>Branch</label>
                        <p>${student.branch}</p>
                    </div>
                    <div class="info-group">
                        <label>Current Semester</label>
                        <p>${student.semester}</p>
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Failed to load profile data. Please try logging in again.');
        window.location.href = '/Login/Login.html';
    }

    // Ensure the Profile section is active on page load
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const sectionTitle = document.getElementById('section-title');

    // Set Profile as the default active section
    navItems[0].classList.add('active'); // Assuming Profile is the first nav item
    document.getElementById('profile').classList.add('active'); // Set Profile section as active
    sectionTitle.textContent = navItems[0].querySelector('span').textContent; // Set section title to Profile

    // // Remove active class from all nav items and sections
    // navItems.forEach(item => item.classList.remove('active'));
    // contentSections.forEach(section => section.classList.remove('active'));

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            
            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(sectionId).classList.add('active');
            sectionTitle.textContent = item.querySelector('span').textContent;
        });
    });

    // Initialize user dropdown and logout button
    const userAvatar = document.getElementById('userAvatar');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userAvatar && userDropdown) {
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (userDropdown.classList.contains('show') && 
                !userDropdown.contains(e.target) && 
                e.target !== userAvatar) {
                userDropdown.classList.remove('show');
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Cache DOM elements
    const examForm = document.getElementById('examRegistrationForm');
    const subjectsContainer = document.getElementById('subjectsContainer');
    const branchSelect = document.getElementById('branch');
    const semesterSelect = document.getElementById('semester');
    const hallTicketSection = document.getElementById('hall-ticket');

    // Subject selection functionality
    function updateSubjects() {
        if (!branchSelect || !semesterSelect || !subjectsContainer) return;

        const branch = branchSelect.value;
        const semester = parseInt(semesterSelect.value);

        if (branch && semester && subjectsData[branch]?.[semester]) {
            const subjects = subjectsData[branch][semester];
            subjectsContainer.innerHTML = subjects.map(subject => `
                <div class="subject-card" data-subject-code="${subject.code}">
                    <label class="subject-checkbox">
                        <input type="checkbox" name="subjects" value="${subject.code} - ${subject.name}">
                        <div class="checkbox-custom"></div>
                        <div class="subject-info">
                            <span class="subject-code">${subject.code}</span>
                            <span class="subject-name">${subject.name}</span>
                        </div>
                    </label>
                </div>
            `).join('');

            // Add animation to subject cards
            const cards = subjectsContainer.querySelectorAll('.subject-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        } else {
            subjectsContainer.innerHTML = `
                <div class="no-subjects">
                    <i class="fas fa-books"></i>
                    <p>Please select branch and semester to view subjects</p>
                </div>
            `;
        }
    }

    // Initialize event listeners
    if (branchSelect && semesterSelect) {
        branchSelect.addEventListener('change', updateSubjects);
        semesterSelect.addEventListener('change', updateSubjects);
    }

    // File upload handling
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.files[0]?.name;
            const label = this.nextElementSibling;
            if (label && fileName) {
                label.querySelector('span').textContent = fileName;
                label.classList.add('has-file');
            }
        });
    });

    // Add this at the top of your file
    function loadConfetti() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
        document.head.appendChild(script);
    }

    // Load confetti script
    loadConfetti();

    // Add loading state function
    function setLoadingState(isLoading) {
        const submitBtn = document.querySelector('.submit-btn');
        if (isLoading) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
        } else {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Form';
            submitBtn.disabled = false;
        }
    }

    // Success animation function
    function showSuccessAnimation() {
        // Create success overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        
        const content = document.createElement('div');
        content.className = 'success-content';
        content.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Successfully Submitted!</h2>
            <p>Your exam registration form has been submitted successfully.</p>
        `;
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Remove overlay after animation
        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }, 2000);
    }

    // Hall Ticket Storage
    let generatedHallTicket = null;

    // Function to fetch hall ticket for current student
    async function fetchHallTicket() {
        try {
            const rollNumber = localStorage.getItem('rollNumber') || 
                              sessionStorage.getItem('rollNumber') || 
                              document.getElementById('rollNo')?.value;
            
            if (rollNumber) {
                const response = await fetch(`http://localhost:5000/api/student/${rollNumber}`);
                
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data.hallTicket) {
                        generatedHallTicket = result.data.hallTicket;
                        return result.data.hallTicket;
                    }
                } else if (response.status !== 404) {
                    console.warn('Server returned status:', response.status);
                }
            }
        } catch (error) {
            console.error('Error fetching hall ticket:', error);
        }
    }

    // Update form submission code
    if (examForm) {
        examForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                setLoadingState(true);
                
                // Validate form
                const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'email', 
                                       'mobile', 'branch', 'semester', 'rollNo', 'examPeriod', 'examType'];
                
                const missingFields = requiredFields.filter(field => {
                    const element = document.getElementById(field);
                    return !element || !element.value.trim();
                });
                
                if (missingFields.length > 0) {
                    throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
                }
                
                // Check if subjects are selected
                const selectedSubjects = document.querySelectorAll('input[name="subjects"]:checked');
                if (selectedSubjects.length === 0) {
                    throw new Error('Please select at least one subject');
                }
                
                // Get all form inputs
                const formInputs = {
                    firstName: document.getElementById('firstName').value,
                    middleName: document.getElementById('middleName').value,
                    lastName: document.getElementById('lastName').value,
                    dateOfBirth: document.getElementById('dateOfBirth').value,
                    gender: document.getElementById('gender').value,
                    category: document.getElementById('category').value,
                    email: document.getElementById('email').value,
                    mobile: document.getElementById('mobile').value,
                    fatherName: document.getElementById('fatherName').value,
                    motherName: document.getElementById('motherName').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    pincode: document.getElementById('pincode').value,
                    branch: document.getElementById('branch').value,
                    semester: parseInt(document.getElementById('semester').value),
                    rollNo: document.getElementById('rollNo').value,
                    examination: document.getElementById('examPeriod').value,
                    examType: document.getElementById('examType').value,
                    subjects: Array.from(selectedSubjects)
                        .map(checkbox => {
                            const [code, name] = checkbox.value.split(' - ');
                            return { code, name };
                        })
                };

                // Debug log
                console.log('Submitting form data:', formInputs);

                // Submit to server
                const response = await fetch('http://localhost:5000/api/submit-exam-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formInputs)
                });

                const result = await response.json();
                console.log('Server response:', result);
                
                if (!response.ok) {
                    throw new Error(result.message || `Server error: ${response.status}`);
                }
                
                if (result.success) {
                    // Store the hall ticket in memory
                    generatedHallTicket = result.hallTicket;
                    
                    // Show success notification
                    showNotification('success', 'Exam form submitted successfully!');
                    
                    // Show success animation
                    showSuccessAnimation();
                    
                    // Switch to hall ticket section after animation
                    setTimeout(() => {
                        document.querySelector('.nav-item[data-section="hall-ticket"]').click();
                        renderHallTicket();
                    }, 2000);
                    
                    // Reset form
                    examForm.reset();
                    updateSubjects();
                } else {
                    throw new Error(result.message || 'Form submission failed');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Show error in a more subtle way
                const submitBtn = document.querySelector('.submit-btn');
                submitBtn.classList.add('error');
                submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error';
                
                // Show error notification
                showNotification('error', error.message || 'Form submission failed');
                
                setTimeout(() => {
                    submitBtn.classList.remove('error');
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Form';
                }, 2000);
            } finally {
                setLoadingState(false);
            }
        });
    }

    // Function to render hall ticket
    async function renderHallTicket() {
        // Try to get hall ticket from memory first
        let hallTicket = generatedHallTicket;
        
        if (!hallTicket) {
            // Try to fetch from server
            try {
                const rollNumber = localStorage.getItem('rollNumber') || 
                                  sessionStorage.getItem('rollNumber') || 
                                  document.getElementById('rollNo')?.value;
                
                if (rollNumber) {
                    const response = await fetch(`http://localhost:5000/api/hall-ticket/${rollNumber}`);
                    
                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            hallTicket = result.hallTicket;
                            console.log('Hall ticket fetched from server:', hallTicket);
                        }
                    } else if (response.status !== 404) {
                        console.warn('Server returned status:', response.status);
                    }
                }
            } catch (error) {
                console.error('Error fetching hall ticket:', error);
            }
        }
        
        if (!hallTicket) {
            hallTicketSection.innerHTML = `
                <div class="no-hall-ticket">
                    <div class="empty-state">
                        <i class="fas fa-ticket-alt"></i>
                        <h3>No Hall Ticket Available</h3>
                        <p>Please submit your exam registration form to generate your hall ticket.</p>
                        <button class="action-btn" id="goToExamForm">
                            <i class="fas fa-file-alt"></i> Go to Exam Form
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listener to the button
            document.getElementById('goToExamForm')?.addEventListener('click', () => {
                document.querySelector('.nav-item[data-section="exam-form"]').click();
            });
            
            return;
        }
        
        // Format date for display
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        };
        
        // Get subject names from codes
        const getSubjectName = (code) => {
            const subject = hallTicket.subjects.find(s => s.code === code);
            return subject ? subject.name : code;
        };
        
        // Create hall ticket HTML
        hallTicketSection.innerHTML = `
            <div class="hall-ticket-container">
                <div class="hall-ticket">
                    <div class="ticket-header">
                        <div class="university-logo">
                            <i class="fas fa-university"></i>
                        </div>
                        <div class="university-info">
                            <h2>Mumbai University</h2>
                            <h3>Examination Hall Ticket</h3>
                            <p>${hallTicket.examination} Examination</p>
                        </div>
                        <div class="ticket-number">
                            <span>Hall Ticket No.</span>
                            <strong>${hallTicket.hallTicketNumber}</strong>
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
                                    <p>${hallTicket.firstName} ${hallTicket.middleName || ''} ${hallTicket.lastName}</p>
                                </div>
                                <div class="detail-group">
                                    <label>Roll Number</label>
                                    <p>${hallTicket.studentRollNo || hallTicket.rollNo}</p>
                                </div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-group">
                                    <label>Branch</label>
                                    <p>${hallTicket.branch}</p>
                                </div>
                                <div class="detail-group">
                                    <label>Semester</label>
                                    <p>${hallTicket.semester}</p>
                                </div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-group">
                                    <label>Exam Type</label>
                                    <p>${hallTicket.examType.toUpperCase()}</p>
                                </div>
                                <div class="detail-group">
                                    <label>Date of Birth</label>
                                    <p>${formatDate(hallTicket.dateOfBirth)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="exam-schedule">
                        <h3>Examination Schedule</h3>
                        <div class="schedule-table">
                            <div class="table-header">
                                <div class="table-cell">Subject Code</div>
                                <div class="table-cell">Subject Name</div>
                                <div class="table-cell">Date</div>
                                <div class="table-cell">Time</div>
                         
                            </div>
                            ${hallTicket.examCenters.map((exam, index) => {
                                if (!exam.subject) return '';
                                return `
                                <div class="table-row">
                                    <div class="table-cell">${exam.subject}</div>
                                    <div class="table-cell">${getSubjectName(exam.subject)}</div>
                                    <div class="table-cell">${exam.date}</div>
                                    <div class="table-cell">${exam.time}</div>
                              
                                </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="ticket-footer">
                        <div class="instructions">
                            <h4>Important Instructions:</h4>
                            <ul>
                                <li>Bring this hall ticket to every examination along with your college ID card.</li>
                                <li>Reach the examination center at least 30 minutes before the scheduled time.</li>
                                <li>Electronic devices are strictly prohibited in the examination hall.</li>
                                <li>Follow all COVID-19 safety protocols as instructed by the examination center.</li>
                            </ul>
                        </div>
                        
                        <div class="signatures">
                            <div class="signature-box">
                                <div class="signature-line"></div>
                                <p>Controller of Examinations</p>
                            </div>
                            <div class="signature-box">
                                <div class="signature-line"></div>
                                <p>Principal</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="ticket-actions">
                    <button class="action-btn print-btn" id="printHallTicket">
                        <i class="fas fa-print"></i> Print Hall Ticket
                    </button>
                    <button class="action-btn download-btn" id="downloadHallTicket">
                        <i class="fas fa-download"></i> Download PDF
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners for buttons
        document.getElementById('printHallTicket')?.addEventListener('click', () => {
            window.print();
        });
        
        document.getElementById('downloadHallTicket')?.addEventListener('click', () => {
            alert('PDF download functionality will be implemented soon.');
            // In a real implementation, you would use a library like html2pdf.js or jsPDF
        });
    }

    // Check for hall ticket when switching to hall ticket section
    document.querySelector('.nav-item[data-section="hall-ticket"]')?.addEventListener('click', renderHallTicket);
    
    // Also check on page load
    window.addEventListener('load', async () => {
        // Fetch student profile data and populate form fields
        try {
            const rollNumber = localStorage.getItem('rollNumber') || sessionStorage.getItem('rollNumber');
            
            if (rollNumber) {
                // Fetch student profile
                const response = await fetch(`http://localhost:5001/api/student/profile/${rollNumber}`);
                const data = await response.json();
                
                if (data.success) {
                    const student = data.student;
                    
                    // Populate form fields with student data
                    document.getElementById('firstName').value = student.firstName || '';
                    document.getElementById('middleName').value = student.middleName || '';
                    document.getElementById('lastName').value = student.lastName || '';
                    document.getElementById('email').value = student.email || '';
                    document.getElementById('mobile').value = student.phone || '';
                    document.getElementById('branch').value = student.branch || '';
                    document.getElementById('semester').value = student.semester || '';
                    document.getElementById('rollNo').value = student.rollNumber || '';
                    
                    // Update subjects based on branch and semester
                    if (student.branch && student.semester) {
                        updateSubjects();
                    }
                }
            }
        } catch (error) {
            console.error('Error loading student profile:', error);
        }
        
        // If we're on the hall ticket section, render it
        if (document.querySelector('.nav-item[data-section="hall-ticket"]').classList.contains('active')) {
            renderHallTicket();
        }
    });

    // Add progress tracking
    function updateFormProgress() {
        const form = document.getElementById('examRegistrationForm');
        const inputs = form.querySelectorAll('input, select, textarea');
        const requiredInputs = Array.from(inputs).filter(input => input.required);
        const filledInputs = requiredInputs.filter(input => input.value.trim() !== '');
        const progress = (filledInputs.length / requiredInputs.length) * 100;
        
        const progressBar = document.getElementById('formProgress');
        progressBar.style.width = `${progress}%`;
    }

    // Add input listeners for progress tracking
    const form = document.getElementById('examRegistrationForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', updateFormProgress);
        input.addEventListener('change', updateFormProgress);
    });
    
    // Initial progress check
    updateFormProgress();

    // Draft functionality
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    
    function saveDraft() {
        const formData = {
            firstName: document.getElementById('firstName')?.value || '',
            middleName: document.getElementById('middleName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            dateOfBirth: document.getElementById('dateOfBirth')?.value || '',
            gender: document.getElementById('gender')?.value || '',
            category: document.getElementById('category')?.value || '',
            email: document.getElementById('email')?.value || '',
            mobile: document.getElementById('mobile')?.value || '',
            fatherName: document.getElementById('fatherName')?.value || '',
            motherName: document.getElementById('motherName')?.value || '',
            address: document.getElementById('address')?.value || '',
            city: document.getElementById('city')?.value || '',
            state: document.getElementById('state')?.value || '',
            pincode: document.getElementById('pincode')?.value || '',
            branch: document.getElementById('branch')?.value || '',
            semester: document.getElementById('semester')?.value || '',
            rollNo: document.getElementById('rollNo')?.value || '',
            examination: document.getElementById('examPeriod')?.value || '',
            examType: document.getElementById('examType')?.value || '',
            subjects: Array.from(document.querySelectorAll('input[name="subjects"]:checked'))
                .map(checkbox => checkbox.value)
        };

        // Save to localStorage with timestamp
        const draft = {
            data: formData,
            timestamp: new Date().toISOString(),
            id: 'draft_' + Date.now()
        };

        // Save to localStorage
        localStorage.setItem('examFormDraft', JSON.stringify(draft));

        // Show success animation
        const btn = document.querySelector('.save-draft-btn');
        btn.innerHTML = '<i class="fas fa-check"></i> Draft Saved';
        btn.classList.add('saved');

        // Reset button after 2 seconds
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-save"></i> Save as Draft';
            btn.classList.remove('saved');
        }, 2000);
    }

    // Load draft function
    function loadDraft() {
        const savedDraft = localStorage.getItem('examFormDraft');
        if (savedDraft) {
            const { data } = JSON.parse(savedDraft);
            
            // Populate form fields
            Object.keys(data).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (key === 'subjects') {
                        // Handle subjects separately
                        data[key].forEach(subjectValue => {
                            const checkbox = document.querySelector(`input[value="${subjectValue}"]`);
                            if (checkbox) checkbox.checked = true;
                        });
                    } else {
                        element.value = data[key];
                    }
                }
            });

            // Update subjects if branch and semester are selected
            if (data.branch && data.semester) {
                updateSubjects();
            }

            // Update form progress
            updateFormProgress();

            return true;
        }
        return false;
    }

    // Add event listeners
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', saveDraft);
    }

    // Try to load draft when form is first loaded
    window.addEventListener('load', () => {
        if (loadDraft()) {
            showNotification('info', 'Draft loaded successfully');
        }
    });

    // Add draft recovery warning before page unload
    window.addEventListener('beforeunload', (e) => {
        const formHasData = Array.from(document.querySelectorAll('#examRegistrationForm input, #examRegistrationForm select, #examRegistrationForm textarea'))
            .some(input => input.value.trim() !== '');
        
        if (formHasData) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Add these functions to your existing JavaScript
    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function showDraftsModal() {
        const modal = document.getElementById('draftsModal');
        const draftsList = document.getElementById('draftsList');
        const drafts = getAllDrafts();
        
        // Clear existing drafts
        draftsList.innerHTML = '';
        
        if (drafts.length === 0) {
            draftsList.innerHTML = `
                <div class="no-drafts">
                    <i class="fas fa-folder-open"></i>
                    <p>No saved drafts found</p>
                </div>
            `;
        } else {
            drafts.forEach(draft => {
                const draftElement = document.createElement('div');
                draftElement.className = 'draft-item';
                draftElement.innerHTML = `
                    <div class="draft-info">
                        <h3>Draft - ${formatDate(draft.timestamp)}</h3>
                        <p>
                            <span class="draft-detail">
                                <i class="fas fa-user"></i> 
                                ${draft.data.firstName || 'Unnamed'} ${draft.data.lastName || ''}
                            </span>
                            <span class="draft-detail">
                                <i class="fas fa-graduation-cap"></i>
                                ${draft.data.branch || 'No branch'} - Sem ${draft.data.semester || 'N/A'}
                            </span>
                        </p>
                    </div>
                    <div class="draft-actions">
                        <button class="load-draft-btn" data-draft-id="${draft.id}">
                            <i class="fas fa-upload"></i> Load
                        </button>
                        <button class="delete-draft-btn" data-draft-id="${draft.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                draftsList.appendChild(draftElement);
            });
        }
        
        modal.style.display = 'block';
    }

    function getAllDrafts() {
        const drafts = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('examFormDraft_')) {
                try {
                    const draft = JSON.parse(localStorage.getItem(key));
                    drafts.push({...draft, id: key});
                } catch (e) {
                    console.error('Error parsing draft:', e);
                }
            }
        }
        return drafts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Add event listeners
    document.addEventListener('DOMContentLoaded', () => {
        const viewDraftsBtn = document.getElementById('viewDraftsBtn');
        const modal = document.getElementById('draftsModal');
        const closeModal = document.querySelector('.close-modal');
        
        viewDraftsBtn?.addEventListener('click', showDraftsModal);
        
        closeModal?.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Event delegation for draft actions
        document.getElementById('draftsList')?.addEventListener('click', (e) => {
            const loadBtn = e.target.closest('.load-draft-btn');
            const deleteBtn = e.target.closest('.delete-draft-btn');
            
            if (loadBtn) {
                const draftId = loadBtn.dataset.draftId;
                loadDraft(draftId);
                modal.style.display = 'none';
            }
            
            if (deleteBtn) {
                const draftId = deleteBtn.dataset.draftId;
                if (confirm('Are you sure you want to delete this draft?')) {
                    localStorage.removeItem(draftId);
                    showDraftsModal(); // Refresh the list
                }
            }
        });
    });

    const clearFormBtn = document.getElementById('clearFormBtn');
    
    if (clearFormBtn) {
        clearFormBtn.addEventListener('click', () => {
            // Show confirmation dialog
            const confirmClear = confirm('Are you sure you want to clear all form data? This action cannot be undone.');
            
            if (confirmClear) {
                // Clear all form fields
                const form = document.getElementById('examRegistrationForm');
                form.reset();
                
                // Clear any checked subjects
                const subjectCheckboxes = document.querySelectorAll('input[name="subjects"]');
                subjectCheckboxes.forEach(checkbox => checkbox.checked = false);
                
                // Update form progress
                updateFormProgress();
                
                // Show clear success message
                const overlay = document.createElement('div');
                overlay.className = 'clear-notification';
                overlay.innerHTML = `
                    <div class="clear-content">
                        <i class="fas fa-eraser"></i>
                        <p>Form cleared successfully</p>
                    </div>
                `;
                
                document.body.appendChild(overlay);
                
                // Remove notification after animation
                setTimeout(() => {
                    overlay.classList.add('fade-out');
                    setTimeout(() => {
                        overlay.remove();
                    }, 500);
                }, 1500);
                
                // Reset any visual states
                const submitBtn = document.querySelector('.submit-btn');
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Form';
                submitBtn.classList.remove('error');
            }
        });
    }

    // Function to handle section switching
    function switchSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add('active');
            
            // Update section title
            const sectionTitle = document.getElementById('section-title');
            sectionTitle.textContent = sectionId.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            
            // Update nav item
            const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
            if (navItem) {
                navItem.classList.add('active');
            }
            
            // Save current section to localStorage
            localStorage.setItem('currentSection', sectionId);
        }
    }

    // Add click handlers to nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;
            switchSection(sectionId);
        });
    });

    // Load last active section on page load
    const lastSection = localStorage.getItem('currentSection') || 'profile';
    switchSection(lastSection);

    // Date of Birth validation and formatting
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    
    if (dateOfBirthInput) {
        // Set default max date (18 years ago from current date)
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        const minDate = new Date(today.getFullYear() - 35, today.getMonth(), today.getDate());
        
        dateOfBirthInput.max = maxDate.toISOString().split('T')[0];
        dateOfBirthInput.min = minDate.toISOString().split('T')[0];
        
        // Add validation
        dateOfBirthInput.addEventListener('change', (e) => {
            const selectedDate = new Date(e.target.value);
            
            if (selectedDate > maxDate) {
                alert('You must be at least 18 years old to register.');
                e.target.value = '';
            } else if (selectedDate < minDate) {
                alert('Please enter a valid date of birth (not more than 35 years ago).');
                e.target.value = '';
            }
        });
    }


    async function loadStudentAllocations(studentRollNo) {
        try {
            const response = await fetch(`http://localhost:5000/api/student/allocations/${studentRollNo}`);
            const data = await response.json();

            if (data.success) {
                console.log("Student Allocations:", data.allocations);
                displayAllocations(data.allocations); // Call the function to display allocations
            } else {
                console.error('Failed to load allocations:', data.message);
            }
        } catch (error) {
            console.error('Error loading allocations:', error);
        }
    }

    // Call this function after the student logs in
    const studentRollNo = localStorage.getItem('rollNumber') || sessionStorage.getItem('rollNumber'); // Get roll number from storage
    if (studentRollNo) {
        loadStudentAllocations(studentRollNo);
    } else {
        console.error('No roll number found for the logged-in student.');
    }

    // Function to display seating allocations in an elegant way
    function displayAllocations(allocations) {
        const seatingSection = document.getElementById('seating');
        if (!seatingSection) return;
        
        let seatingContent = document.getElementById('seatingContent');
        if (!seatingContent) {
            seatingContent = document.createElement('div');
            seatingContent.id = 'seatingContent';
            seatingContent.className = 'seating-content';
            seatingSection.querySelector('.seating-container').appendChild(seatingContent);
        }
        
        seatingContent.innerHTML = '';

        if (allocations.length === 0) {
            seatingContent.innerHTML = `
                <div class="no-allocations">
                    <i class="fas fa-chair"></i>
                    <h3>No Seating Arrangements Found</h3>
                    <p>There are currently no seating arrangements assigned to you.</p>
                </div>
            `;
            return;
        }

        // Create paper selection dropdown
        const paperFilter = document.createElement('div');
        paperFilter.className = 'paper-filter';
        
        // Get unique papers from allocations
        const papers = [...new Set(allocations.map(a => a.paper?.name))].filter(Boolean);
        
        paperFilter.innerHTML = `
            <div class="filter-container">
                <label for="paperSelect">Select Paper:</label>
                <select id="paperSelect">
                    <option value="all">All Papers</option>
                    ${papers.map(paper => `
                        <option value="${paper}">${paper}</option>
                    `).join('')}
                </select>
            </div>
        `;
        seatingContent.appendChild(paperFilter);

        // Add view toggle
        const viewToggle = document.createElement('div');
        viewToggle.className = 'view-toggle';
        viewToggle.innerHTML = `
            <button class="view-toggle-btn active" data-view="cards">
                <i class="fas fa-th"></i> Card View
            </button>
            <button class="view-toggle-btn" data-view="table">
                <i class="fas fa-table"></i> Table View
            </button>
            <button class="view-toggle-btn" data-view="classroom">
                <i class="fas fa-chalkboard"></i> Classroom View
            </button>
        `;
        seatingContent.appendChild(viewToggle);

        // Create views containers
        const cardsView = document.createElement('div');
        cardsView.className = 'seating-cards';

        const tableView = document.createElement('div');
        tableView.className = 'seating-table-view';
        tableView.style.display = 'none';

        const classroomView = document.createElement('div');
        classroomView.className = 'classroom-view';
        classroomView.style.display = 'none';

        // Function to update views based on selected paper
        function updateViews(selectedPaper) {
            const filteredAllocations = selectedPaper === 'all' 
                ? allocations 
                : allocations.filter(a => a.paper?.name === selectedPaper);

            // Update cards view
            cardsView.innerHTML = '';
            filteredAllocations.forEach(allocation => {
                const examCard = document.createElement('div');
                examCard.className = 'exam-card';
                
                // Format date as DD MMM YYYY (e.g., 15 Nov 2023)
                const formattedDate = new Date(allocation.examDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
                
                examCard.innerHTML = `
                    <div class="exam-card-header">
                        <div class="exam-date">
                            <i class="fas fa-calendar-day"></i>
                            ${formattedDate}
                        </div>
                        <div class="exam-time">
                            <i class="fas fa-clock"></i>
                            ${allocation.examTime}
                        </div>
                        <span class="exam-status status-${allocation.status}">${allocation.statusText}</span>
                    </div>
                    <div class="exam-card-body">
                        <div class="exam-subject-info">
                            <span class="subject-code">${allocation.paper?.code || 'N/A'}</span>
                            <div class="subject-name">${allocation.paper?.name || 'N/A'}</div>
                        </div>
                        <div class="seating-info-grid">
                            <div class="seating-info-item">
                                <span class="info-label">Room</span>
                                <span class="info-value">
                                    <i class="fas fa-door-open"></i>
                                    ${allocation.classroom?.room || 'N/A'}
                                </span>
                            </div>
                            <div class="seating-info-item">
                                <span class="info-label">Bench</span>
                                <span class="info-value">
                                    <i class="fas fa-chair"></i>
                                    ${allocation.benchNumber?.number || 'N/A'}
                                </span>
                            </div>
                            <div class="seating-info-item">
                                <span class="info-label">Hall Ticket</span>
                                <span class="info-value">
                                    <i class="fas fa-ticket-alt"></i>
                                    ${allocation.hallTicketNumber || 'N/A'}
                                </span>
                            </div>
                            <div class="seating-info-item">
                                <span class="info-label">Roll Number</span>
                                <span class="info-value">
                                    <i class="fas fa-id-card"></i>
                                    ${allocation.studentRollNo || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
                
                cardsView.appendChild(examCard);
            });

            // Update table view
            tableView.innerHTML = '';
            const table = document.createElement('table');
            table.className = 'seating-table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th>Subject</th>
                        <th>Room</th>
                        <th>Bench</th>
                        <th>Hall Ticket</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredAllocations.map(allocation => {
                        const examDate = new Date(allocation.examDate);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        // Determine exam status
                        let status = 'upcoming';
                        let statusText = 'Upcoming';
                        let statusClass = 'text-primary';
                        
                        if (examDate.getTime() === today.getTime()) {
                            status = 'today';
                            statusText = 'Today';
                            statusClass = 'text-warning';
                        } else if (examDate < today) {
                            status = 'completed';
                            statusText = 'Completed';
                            statusClass = 'text-success';
                        }
                        
                        // Format date as DD MMM YYYY (e.g., 15 Nov 2023)
                        const formattedDate = examDate.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        });
                        
                        return `
                            <tr>
                                <td>
                                    <div class="exam-date-time">
                                        <div>${formattedDate}</div>
                                        <div class="exam-time-small">${allocation.examTime}</div>
                                    </div>
                                </td>
                                <td>
                                    <div class="subject-info">
                                        <div class="subject-code-small">${allocation.paper?.code || 'N/A'}</div>
                                        <div>${allocation.paper?.name || 'N/A'}</div>
                                    </div>
                                </td>
                                <td>${allocation.classroom?.room || 'N/A'}</td>
                                <td>${allocation.benchNumber?.number || 'N/A'}</td>
                                <td>${allocation.hallTicketNumber || 'N/A'}</td>
                                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            `;
            tableView.appendChild(table);

            // Update classroom view
            classroomView.innerHTML = '';
            
            // Group allocations by room and date for selected paper
            const roomDateAllocations = {};
            filteredAllocations.forEach(allocation => {
                const dateKey = new Date(allocation.examDate).toLocaleDateString();
                const key = `${allocation.classroom?.room || 'TBA'}-${dateKey}`;
                
                if (!roomDateAllocations[key]) {
                    roomDateAllocations[key] = {
                        room: allocation.classroom?.room || 'TBA',
                        date: dateKey,
                        allocations: []
                    };
                }
                roomDateAllocations[key].allocations.push(allocation);
            });

            // Create classroom layout for each room
            Object.values(roomDateAllocations).forEach(({ room, date, allocations }) => {
                const roomSection = document.createElement('div');
                roomSection.className = 'classroom-container';
                
                // Room header with paper info
                const header = document.createElement('div');
                header.className = 'classroom-header';
                header.innerHTML = `
                    <h3>Room ${room}</h3>
                    <p>${date}</p>
                    <p class="paper-name">${selectedPaper === 'all' ? 'All Papers' : selectedPaper}</p>
                `;
                roomSection.appendChild(header);
                
                // Create classroom layout
                const classroomLayout = document.createElement('div');
                classroomLayout.className = 'classroom-layout';
                
                // Create seating area
                const seatingArea = document.createElement('div');
                seatingArea.className = 'seating-area';
                
                // Create rows (6 rows)
                for (let row = 0; row < 6; row++) {
                    const rowDiv = document.createElement('div');
                    rowDiv.className = 'bench-row';
                    
                    // Create benches in each row (5 benches per row)
                    for (let col = 0; col < 5; col++) {
                        const benchNumber = row * 5 + col + 1;
                        const bench = document.createElement('div');
                        bench.className = 'bench';
                        
                        // Find allocation for this bench
                        const benchAllocation = allocations.find(a => 
                            a.benchNumber?.number === benchNumber
                        );
                        
                        // Create single seat
                        const seat = document.createElement('div');
                        seat.className = 'seat';
                        
                        const currentStudentRoll = localStorage.getItem('rollNumber') || 
                                                 sessionStorage.getItem('rollNumber');
                        
                        // Set up seat
                        if (benchAllocation) {
                            const isCurrentStudent = benchAllocation.studentRollNo === currentStudentRoll;
                            seat.className += isCurrentStudent ? ' current-student' : ' occupied';
                            seat.innerHTML = `
                                <span class="seat-number">B${benchNumber}</span>
                                <span class="student-roll">${benchAllocation.studentRollNo}</span>
                            `;
                            seat.title = `
                                Roll No: ${benchAllocation.studentRollNo}
                                Subject: ${benchAllocation.paper?.name || 'N/A'}
                                Time: ${benchAllocation.examTime || 'TBA'}
                            `;
                        }
                        
                        bench.appendChild(seat);
                        rowDiv.appendChild(bench);
                    }
                    seatingArea.appendChild(rowDiv);
                }
                
                classroomLayout.appendChild(seatingArea);
                
                // Add legend
                const legend = document.createElement('div');
                legend.className = 'classroom-legend';
                legend.innerHTML = `
                    <div class="legend-item">
                        <div class="legend-color current"></div>
                        <span>Your Seat</span>
                    </div>
                    
                `;
                
                roomSection.appendChild(classroomLayout);
                roomSection.appendChild(legend);
                classroomView.appendChild(roomSection);
            });
        }

        // Add event listener to paper select
        const paperSelect = paperFilter.querySelector('#paperSelect');
        paperSelect.addEventListener('change', (e) => {
            updateViews(e.target.value);
        });

        // Initial view setup
        updateViews('all');

        // Add views to container
        seatingContent.appendChild(cardsView);
        seatingContent.appendChild(tableView);
        seatingContent.appendChild(classroomView);

        // View toggle event listeners
        const toggleButtons = viewToggle.querySelectorAll('.view-toggle-btn');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.getAttribute('data-view');
                toggleButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                cardsView.style.display = 'none';
                tableView.style.display = 'none';
                classroomView.style.display = 'none';
                
                switch(view) {
                    case 'cards':
                        cardsView.style.display = 'grid';
                        break;
                    case 'table':
                        tableView.style.display = 'block';
                        break;
                    case 'classroom':
                        classroomView.style.display = 'block';
                        break;
                }
            });
        });
    }

    // Add print styles
    const printStyles = document.createElement('style');
    printStyles.innerHTML = `
        @media print {
            body * {
                visibility: hidden;
            }
            .seating-content, .seating-content * {
                visibility: visible;
            }
            .seating-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            .view-toggle, .seating-actions {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(printStyles);

    // Timetable specific code
    const timetableSection = document.getElementById('timetable');
    if (timetableSection) {
        async function loadStudentTimetable(branch, semester) {
            const timetableContent = document.createElement('div');
            timetableContent.className = 'timetable-content';
            
            try {
                // Generate examination dates starting from two weeks from now
                const startDate = new Date();
                startDate.setDate(startDate.getDate() + 14);

                // Get subjects based on branch and semester from the existing subjectsData
                const subjects = subjectsData[branch]?.[semester] || [];

                let timetableHTML = `
                    <div class="timetable-grid">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Day</th>
                                    <th>Examination Details</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                let currentDate = new Date(startDate);

                subjects.forEach(subject => {
                    // Skip weekends
                    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                        currentDate.setDate(currentDate.getDate() + 1);
                    }

                    timetableHTML += `
                        <tr>
                            <td>${currentDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}</td>
                            <td>${currentDate.toLocaleDateString('en-US', { weekday: 'long' })}</td>
                            <td>
                                <div class="exam-slot">
                                    <div class="subject-code">${subject.code}</div>
                                    <div class="subject-name">${subject.name}</div>
                                </div>
                            </td>
                            <td class="exam-time">
                                <div class="time-container">
                                    <div class="time-badge">
                                        <i class="fas fa-clock"></i>
                                        <span class="time-text">10:30 AM - 1:30 PM</span>
                                    </div>
                                    <div class="duration-badge">
                                        <i class="fas fa-hourglass-half"></i>
                                        <span>3 hours</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;

                    // Add 2 days gap between exams
                    currentDate.setDate(currentDate.getDate() + 3);
                });

                timetableHTML += `
                            </tbody>
                        </table>
                    </div>
                `;

                timetableContent.innerHTML = timetableHTML;
                
                // Clear existing content and append new timetable
                timetableSection.innerHTML = `
                    <div class="section-header">
                        <h2><i class="fas fa-calendar-alt"></i> Examination Timetable</h2>
                        <p>Winter 2024 Examination Schedule</p>
                    </div>
                `;
                timetableSection.appendChild(timetableContent);

            } catch (error) {
                console.error('Error loading timetable:', error);
                timetableContent.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Failed to load timetable. Please try again later.</p>
                    </div>
                `;
            }
        }

        // Add click handler for timetable section
        document.querySelector('.nav-item[data-section="timetable"]')?.addEventListener('click', async () => {
            try {
                const rollNumber = localStorage.getItem('rollNumber') || sessionStorage.getItem('rollNumber');
                if (rollNumber) {
                    const response = await fetch(`http://localhost:5001/api/student/profile/${rollNumber}`);
                    const data = await response.json();
                    
                    if (data.success && data.student) {
                        // Map full branch name to code
                        const branchCode = {
                            'Computer Science': 'CS',
                            'Information Technology': 'IT',
                            'Artificial Intelligence & ML': 'AIML',
                            'Data Science': 'DS'
                        }[data.student.branch] || data.student.branch;
                        
                        loadStudentTimetable(branchCode, data.student.semester);
                    }
                }
            } catch (error) {
                console.error('Error loading student profile:', error);
            }
        });
    }

    // Function to load and display grade cards
    async function loadGradeCards() {
        const resultsContainer = document.getElementById('resultsContainer');
        
        if (!resultsContainer) return;
        
        // Show loading state with enhanced animation
        resultsContainer.innerHTML = `
            <div class="loading-container">
                <div class="loader-animation">
                    <div class="loader-circle"></div>
                    <div class="loader-circle"></div>
                    <div class="loader-circle"></div>
                </div>
                <p>Retrieving your academic records...</p>
            </div>
        `;
        
        try {
            const rollNumber = localStorage.getItem('rollNumber') || sessionStorage.getItem('rollNumber');
            
            if (!rollNumber) {
                throw new Error('Roll number not found. Please log in again.');
            }
            
            // Fetch grade cards from the server
            const response = await fetch(`http://localhost:5000/api/student/gradecards/${rollNumber}`);
            const data = await response.json();
            
            // Log the grade cards to console as requested
            console.log('Student Grade Cards:', data.gradeCards);
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch grade cards');
            }
            
            if (!data.gradeCards || data.gradeCards.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="info-container">
                        <i class="fas fa-info-circle"></i>
                        <h3>No Results Available Yet</h3>
                        <p>Your academic performance records will appear here once they are published.</p>
                        <p>Check back after your semester results are announced.</p>
                    </div>
                `;
                return;
            }
            
            // Generate HTML for grade cards
            let gradeCardsHTML = `
                <div class="grade-cards-container">
            `;
            
            // Sort grade cards by semester
            const sortedGradeCards = [...data.gradeCards].sort((a, b) => b.semester - a.semester);
            
            sortedGradeCards.forEach(gradeCard => {
                const resultClass = gradeCard.result === 'PASS' ? 'result-pass' : 'result-fail';
                
                gradeCardsHTML += `
                    <div class="grade-card">
                        <div class="grade-card-header">
                            <div class="semester-info">
                                <h3>Semester ${gradeCard.semester}</h3>
                                <p>Academic Year: ${gradeCard.academicYear}</p>
                            </div>
                            <div class="grade-summary">
                                <div class="sgpa">
                                    <span class="label">SGPA</span>
                                    <span class="value">${gradeCard.sgpa.toFixed(2)}</span>
                                </div>
                                <div class="result ${resultClass}">
                                    <span>${gradeCard.result}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="subjects-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Semester Marks</th>
                                        <th>Internal Marks</th>
                                        <th>Practical</th>
                                        <th>Term Work</th>
                                        <th>Total</th>
                                        <th>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                `;
                
                gradeCard.subjects.forEach(subject => {
                    const subjectName = getSubjectNameByCode(subject.name, gradeCard.branch, gradeCard.semester);
                    
                    gradeCardsHTML += `
                        <tr>
                            <td>
                                <div class="subject-info">
                                    <div class="subject-code">${subject.name}</div>
                                    <div class="subject-name">${subjectName || subject.name}</div>
                                </div>
                            </td>
                            <td>${subject.semesterMarks}/75</td>
                            <td>${subject.internalMarks}/25</td>
                            <td>${subject.practicalMarks}/25</td>
                            <td>${subject.termworkMarks}/25</td>
                            <td>${subject.totalMarks}/150</td>
                            <td><span class="grade grade-${subject.grade.toLowerCase()}">${subject.grade}</span></td>
                        </tr>
                    `;
                });
                
                gradeCardsHTML += `
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="grade-card-footer">
                            <div class="generated-info">
                                <p>Generated on: ${new Date(gradeCard.generatedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</p>
                            </div>
                            <button class="print-btn" onclick="printGradeCard(this)">
                                <i class="fas fa-print"></i> Print Grade Card
                            </button>
                        </div>
                    </div>
                `;
            });
            
            gradeCardsHTML += `</div>`;
            
            resultsContainer.innerHTML = gradeCardsHTML;
            
        } catch (error) {
            console.error('Error loading grade cards:', error);
            resultsContainer.innerHTML = `
                <div class="error-container">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Failed to Load Results</h3>
                    <p>${error.message || 'An error occurred while loading your academic records.'}</p>
                    <button class="retry-btn" onclick="loadGradeCards()">
                        <i class="fas fa-sync-alt"></i> Try Again
                    </button>
                </div>
            `;
        }
    }

    // Helper function to get subject name from code
    function getSubjectNameByCode(code, branch, semester) {
        // Try to find the subject in our subjects data
        const branchSubjects = subjectsData[branch]?.[semester];
        if (branchSubjects) {
            const subject = branchSubjects.find(s => s.code === code);
            if (subject) return subject.name;
        }
        return code; // Return code if name not found
    }

    // Function to print grade card with enhanced styling
    function printGradeCard(button) {
        const gradeCard = button.closest('.grade-card');
        const printWindow = window.open('', '_blank');
        
        const studentName = document.querySelector('.user-name').textContent;
        const rollNumber = document.querySelector('.profile-card .info-group:nth-child(2) p').textContent;
        const semester = gradeCard.querySelector('.semester-info h3').textContent;
        const academicYear = gradeCard.querySelector('.semester-info p').textContent.replace('Academic Year: ', '');
        const sgpa = gradeCard.querySelector('.sgpa .value').textContent;
        const result = gradeCard.querySelector('.result span').textContent;
        const resultClass = gradeCard.querySelector('.result').classList.contains('result-pass') ? 'result-pass' : 'result-fail';
        
        // Get all subject rows
        const subjectRows = Array.from(gradeCard.querySelectorAll('.subjects-table tbody tr'));
        let subjectsHTML = '';
        
        subjectRows.forEach(row => {
            const subjectCode = row.querySelector('.subject-code').textContent;
            const subjectName = row.querySelector('.subject-name').textContent;
            const semMarks = row.querySelectorAll('td')[1].textContent;
            const intMarks = row.querySelectorAll('td')[2].textContent;
            const practicalMarks = row.querySelectorAll('td')[3].textContent;
            const termworkMarks = row.querySelectorAll('td')[4].textContent;
            const totalMarks = row.querySelectorAll('td')[5].textContent;
            const grade = row.querySelector('.grade').textContent;
            const gradeClass = row.querySelector('.grade').classList[1];
            
            subjectsHTML += `
                <tr>
                    <td>
                        <div class="subject-info">
                            <div class="subject-code">${subjectCode}</div>
                            <div class="subject-name">${subjectName}</div>
                        </div>
                    </td>
                    <td>${semMarks}</td>
                    <td>${intMarks}</td>
                    <td>${practicalMarks}</td>
                    <td>${termworkMarks}</td>
                    <td>${totalMarks}</td>
                    <td><span class="grade ${gradeClass}">${grade}</span></td>
                </tr>
            `;
        });
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Grade Card - ${studentName} - ${semester}</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    @page {
                        size: A4;
                        margin: 1cm;
                    }
                    
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Poppins', sans-serif;
                        color: #1e293b;
                        background-color: white;
                        line-height: 1.6;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    .grade-card-print {
                        max-width: 100%;
                        margin: 0 auto;
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                        position: relative;
                    }
                    
                    .print-header {
                        background: linear-gradient(135deg, #4361ee, #3730a3);
                        color: white;
                        padding: 2rem;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .print-header::after {
                        content: '';
                        position: absolute;
                        top: -50%;
                        right: -50%;
                        width: 100%;
                        height: 200%;
                        background: rgba(255, 255, 255, 0.1);
                        transform: rotate(25deg);
                    }
                    
                    .university-name {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 5px;
                        position: relative;
                        z-index: 1;
                    }
                    
                    .document-title {
                        font-size: 18px;
                        margin-bottom: 10px;
                        position: relative;
                        z-index: 1;
                        font-weight: 500;
                        letter-spacing: 1px;
                    }
                    
                    .watermark {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 120px;
                        color: rgba(255, 255, 255, 0.05);
                        font-weight: bold;
                        white-space: nowrap;
                        pointer-events: none;
                        z-index: 0;
                    }
                    
                    .student-info {
                        display: flex;
                        justify-content: space-between;
                        padding: 1.5rem 2rem;
                        background: #f8fafc;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    
                    .info-column {
                        flex: 1;
                    }
                    
                    .info-item {
                        margin-bottom: 0.8rem;
                    }
                    
                    .info-label {
                        font-weight: 600;
                        color: #64748b;
                        font-size: 0.85rem;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 0.2rem;
                        display: block;
                    }
                    
                    .info-value {
                        font-weight: 500;
                        font-size: 1rem;
                        color: #1e293b;
                    }
                    
                    .subjects-container {
                        padding: 1.5rem 2rem;
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 1.5rem;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    }
                    
                    thead {
                        background: linear-gradient(135deg, #4361ee, #3730a3);
                        color: white;
                    }
                    
                    th {
                        padding: 1rem;
                        text-align: left;
                        font-weight: 600;
                        font-size: 0.9rem;
                        letter-spacing: 0.5px;
                    }
                    
                    td {
                        padding: 0.8rem 1rem;
                        border-bottom: 1px solid #e2e8f0;
                        font-size: 0.9rem;
                    }
                    
                    tr:last-child td {
                        border-bottom: none;
                    }
                    
                    tr:nth-child(even) {
                        background-color: #f8fafc;
                    }
                    
                    .subject-info {
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .subject-code {
                        font-weight: 600;
                        color: #3730a3;
                        margin-bottom: 0.2rem;
                    }
                    
                    .subject-name {
                        font-size: 0.85rem;
                        color: #64748b;
                    }
                    
                    .grade {
                        display: inline-block;
                        padding: 0.3rem 0.6rem;
                        border-radius: 4px;
                        font-weight: 600;
                        text-align: center;
                        min-width: 2.5rem;
                    }
                    
                    .grade-a {
                        background-color: #e8f5e9;
                        color: #2e7d32;
                        border-left: 2px solid #2e7d32;
                    }
                    
                    .grade-b {
                        background-color: #e3f2fd;
                        color: #1565c0;
                        border-left: 2px solid #1565c0;
                    }
                    
                    .grade-c {
                        background-color: #e0f2f1;
                        color: #00695c;
                        border-left: 2px solid #00695c;
                    }
                    
                    .grade-d {
                        background-color: #fff3e0;
                        color: #ef6c00;
                        border-left: 2px solid #ef6c00;
                    }
                    
                    .grade-e {
                        background-color: #fff8e1;
                        color: #f57f17;
                        border-left: 2px solid #f57f17;
                    }
                    
                    .grade-f {
                        background-color: #ffebee;
                        color: #c62828;
                        border-left: 2px solid #c62828;
                    }
                    
                    .result-summary {
                        display: flex;
                        justify-content: space-between;
                        padding: 1.5rem 2rem;
                        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
                        border-top: 1px solid #e2e8f0;
                        align-items: center;
                    }
                    
                    .sgpa-display {
                        display: flex;
                        align-items: center;
                    }
                    
                    .sgpa-label {
                        font-weight: 600;
                        font-size: 1rem;
                        margin-right: 1rem;
                        color: #64748b;
                    }
                    
                    .sgpa-value {
                        font-size: 1.8rem;
                        font-weight: 700;
                        color: #3730a3;
                        background: white;
                        padding: 0.5rem 1.5rem;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                        position: relative;
                    }
                    
                    .sgpa-value::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, rgba(67, 97, 238, 0.1), transparent);
                        border-radius: 8px;
                        z-index: -1;
                    }
                    
                    .result-display {
                        font-size: 1.2rem;
                        font-weight: 700;
                        padding: 0.5rem 1.5rem;
                        border-radius: 8px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    
                    .result-pass {
                        background-color: #e8f5e9;
                        color: #2e7d32;
                        border-left: 3px solid #2e7d32;
                    }
                    
                    .result-fail {
                        background-color: #ffebee;
                        color: #c62828;
                        border-left: 3px solid #c62828;
                    }
                    
                    .print-footer {
                        padding: 1.5rem 2rem;
                        text-align: center;
                        font-size: 0.85rem;
                        color: #64748b;
                        border-top: 1px solid #e2e8f0;
                        position: relative;
                    }
                    
                    .print-footer::before {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 200px;
                        height: 4px;
                        background: linear-gradient(90deg, transparent, #4361ee, transparent);
                        border-radius: 2px;
                    }
                    
                    .signatures {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 3rem;
                        padding: 0 4rem;
                    }
                    
                    .signature-box {
                        text-align: center;
                        width: 200px;
                    }
                    
                    .signature-line {
                        border-bottom: 1px solid #000;
                        margin-bottom: 0.5rem;
                        height: 1.5rem;
                    }
                    
                    .signature-title {
                        font-size: 0.85rem;
                        font-weight: 500;
                    }
                    
                    .qr-code {
                        position: absolute;
                        bottom: 2rem;
                        right: 2rem;
                        width: 80px;
                        height: 80px;
                        background: #f1f5f9;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 2rem;
                        color: #64748b;
                    }
                    
                    @media print {
                        body {
                            background: white;
                        }
                        
                        .grade-card-print {
                            box-shadow: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="grade-card-print">
                    <div class="print-header">
                        <div class="university-name">Mumbai University</div>
                        <div class="document-title">STATEMENT OF MARKS</div>
                        <div class="watermark">OFFICIAL RECORD</div>
                    </div>
                    
                    <div class="student-info">
                        <div class="info-column">
                            <div class="info-item">
                                <span class="info-label">Student Name</span>
                                <span class="info-value">${studentName}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Roll Number</span>
                                <span class="info-value">${rollNumber}</span>
                            </div>
                        </div>
                        <div class="info-column">
                            <div class="info-item">
                                <span class="info-label">Semester</span>
                                <span class="info-value">${semester}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Academic Year</span>
                                <span class="info-value">${academicYear}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="subjects-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Semester Marks</th>
                                    <th>Internal Marks</th>
                                    <th>Practical</th>
                                    <th>Term Work</th>
                                    <th>Total</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${subjectsHTML}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="result-summary">
                        <div class="sgpa-display">
                            <span class="sgpa-label">SGPA:</span>
                            <span class="sgpa-value">${sgpa}</span>
                        </div>
                        <div class="result-display ${resultClass}">
                            ${result}
                        </div>
                    </div>
                    
                    <div class="signatures">
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <div class="signature-title">Examination Controller</div>
                        </div>
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <div class="signature-title">Principal</div>
                        </div>
                    </div>
                    
                    <div class="print-footer">
                        <p>This is a computer-generated document. No signature is required.</p>
                        <p>Printed on: ${new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                        <div class="qr-code">
                            <i class="fas fa-qrcode"></i>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Add a slight delay to ensure styles are applied before printing
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    // Add this to the global scope
    window.printGradeCard = printGradeCard;

    // Add event listener for results section
    document.querySelector('.nav-item[data-section="results"]')?.addEventListener('click', loadGradeCards);
});

// Helper function to validate form data
function validateFormData(data) {
    const missingFields = [];
    const requiredFields = {
        personalInfo: ['firstName', 'lastName', 'dateOfBirth', 'email', 'mobile'],
        academicInfo: ['branch', 'semester', 'rollNo'],
        examInfo: ['examPeriod', 'examType']
    };

    Object.entries(requiredFields).forEach(([section, fields]) => {
        fields.forEach(field => {
            if (!data[section][field]) {
                missingFields.push(field);
            }
        });
    });

    if (data.examInfo.subjects.length === 0) {
        missingFields.push('subjects');
    }

    return missingFields;
}

// Helper function to show notifications
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

// Add notification sound function
function playNotificationSound(type) {
    const audio = new Audio();
    audio.volume = 0.5;
    audio.src = type === 'success' 
        ? 'https://assets.mixkit.co/active_storage/sfx/2186/2186-preview.mp3'
        : 'https://assets.mixkit.co/active_storage/sfx/2185/2185-preview.mp3';
    audio.play().catch(e => console.log('Audio play failed:', e));
}

// Add this function to handle logout
function handleLogout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // Clear any stored authentication data
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('userRole');
        sessionStorage.removeItem('userRole');
        localStorage.removeItem('rollNumber');
        sessionStorage.removeItem('rollNumber');
        
        // Show logout notification
        showNotification('Logged out successfully', 'success');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = '../Login/Login.html';
        }, 1000);
    }
}
