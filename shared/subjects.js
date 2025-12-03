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
            { code: 'CSC302', name: 'Data Structures & Algorithms' },
            { code: 'CSC303', name: 'Database Management System' },
            { code: 'CSC304', name: 'Computer Organization & Architecture' },
            { code: 'CSC305', name: 'Discrete Mathematics' }
        ],
        4: [
            { code: 'CSC401', name: 'Engineering Mathematics - IV' },
            { code: 'CSC402', name: 'Analysis of Algorithms' },
            { code: 'CSC403', name: 'Operating Systems' },
            { code: 'CSC404', name: 'Computer Networks' },
            { code: 'CSC405', name: 'Web Programming' }
        ],
        5: [
            { code: 'CSC501', name: 'Theoretical Computer Science' },
            { code: 'CSC502', name: 'Software Engineering' },
            { code: 'CSC503', name: 'Computer Graphics & Virtual Reality' },
            { code: 'CSC504', name: 'Data Warehousing & Mining' },
            { code: 'CSC505', name: 'Professional Communication & Ethics - II' }
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
    AIML: {
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
            { code: 'AIML303', name: 'Database Management Systems' },
            { code: 'AIML304', name: 'Introduction to AI & ML' },
            { code: 'AIML305', name: 'Python Programming' }
        ],
        4: [
            { code: 'AIML401', name: 'Engineering Mathematics - IV' },
            { code: 'AIML402', name: 'Computer Networks' },
            { code: 'AIML403', name: 'Operating Systems' },
            { code: 'AIML404', name: 'Statistical Learning' },
            { code: 'AIML405', name: 'Data Visualization' }
        ],
        5: [
            { code: 'AIML501', name: 'Machine Learning Algorithms' },
            { code: 'AIML502', name: 'Deep Learning Fundamentals' },
            { code: 'AIML503', name: 'Big Data Analytics' },
            { code: 'AIML504', name: 'Neural Networks' },
            { code: 'AIML505', name: 'Professional Communication & Ethics' }
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
    DS: {
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
            { code: 'DS303', name: 'Database Management Systems' },
            { code: 'DS304', name: 'Introduction to Data Science' },
            { code: 'DS305', name: 'Python for Data Science' }
        ],
        4: [
            { code: 'DS401', name: 'Engineering Mathematics - IV' },
            { code: 'DS402', name: 'Statistical Methods' },
            { code: 'DS403', name: 'Machine Learning Fundamentals' },
            { code: 'DS404', name: 'Data Wrangling & Exploration' },
            { code: 'DS405', name: 'Data Visualization Techniques' }
        ],
        5: [
            { code: 'DS501', name: 'Advanced Machine Learning' },
            { code: 'DS502', name: 'Big Data Technologies' },
            { code: 'DS503', name: 'Data Mining Techniques' },
            { code: 'DS504', name: 'Predictive Analytics' },
            { code: 'DS505', name: 'Professional Communication & Ethics' }
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
    }
};

// Helper function to get subject details by code
function getSubjectByCode(code) {
    for (const branch in subjectsData) {
        for (const semester in subjectsData[branch]) {
            const subject = subjectsData[branch][semester].find(s => s.code === code);
            if (subject) {
                return subject;
            }
        }
    }
    return null;
}

// Helper function to get all subjects for a branch and semester
function getSubjects(branch, semester) {
    if (subjectsData[branch] && subjectsData[branch][semester]) {
        return subjectsData[branch][semester];
    }
    return [];
}

// Helper function to get all available branches
function getBranches() {
    return Object.keys(subjectsData);
}

// Helper function to get all semesters for a branch
function getSemesters(branch) {
    if (subjectsData[branch]) {
        return Object.keys(subjectsData[branch]).map(Number).sort((a, b) => a - b);
    }
    return [];
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        subjectsData,
        getSubjectByCode,
        getSubjects,
        getBranches,
        getSemesters
    };
} 