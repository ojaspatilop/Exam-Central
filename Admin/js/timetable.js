document.addEventListener('DOMContentLoaded', function() {
    // Get filter elements
    const branchFilter = document.getElementById('timetableBranch');
    const semesterFilter = document.getElementById('timetableSemester');

    // Get all branch sections
    const branchSections = document.querySelectorAll('.branch-section');
    const semesterSections = document.querySelectorAll('.semester-section');

    // Function to filter timetable
    function filterTimetable() {
        const selectedBranch = branchFilter.value;
        const selectedSemester = semesterFilter.value;

        // First, handle branch filtering
        branchSections.forEach(branchSection => {
            const branchTitle = branchSection.querySelector('.branch-title').textContent;
            
            // Check if branch matches filter
            const shouldShowBranch = !selectedBranch || branchTitle.includes(selectedBranch);
            
            // Handle semester filtering within each branch
            const semestersInBranch = branchSection.querySelectorAll('.semester-section');
            let hasVisibleSemesters = false;

            semestersInBranch.forEach(semesterSection => {
                const semesterTitle = semesterSection.querySelector('.semester-subtitle').textContent;
                const semesterNumber = semesterTitle.match(/Semester (\d+)/)[1];
                
                // Show semester if it matches filter or no semester is selected
                const shouldShowSemester = !selectedSemester || semesterNumber === selectedSemester;
                
                if (shouldShowBranch && shouldShowSemester) {
                    semesterSection.style.display = '';
                    hasVisibleSemesters = true;
                } else {
                    semesterSection.style.display = 'none';
                }
            });

            // Show/hide branch section based on whether it has visible semesters
            branchSection.style.display = shouldShowBranch && hasVisibleSemesters ? '' : 'none';
        });

        // Show "No results found" message if needed
        updateNoResultsMessage();
    }

    // Function to show/hide "No results found" message
    function updateNoResultsMessage() {
        let hasVisibleContent = false;
        branchSections.forEach(section => {
            if (section.style.display !== 'none') {
                hasVisibleContent = true;
            }
        });

        // Get or create the no results message element
        let noResultsMsg = document.getElementById('noTimetableResults');
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noTimetableResults';
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <p>No examination schedule found for the selected filters.</p>
                </div>
            `;
            document.querySelector('.timetable-container').appendChild(noResultsMsg);
        }

        noResultsMsg.style.display = hasVisibleContent ? 'none' : 'block';
    }

    // Add event listeners to filters
    branchFilter.addEventListener('change', filterTimetable);
    semesterFilter.addEventListener('change', filterTimetable);

    // Add CSS for the no results message
    const style = document.createElement('style');
    style.textContent = `
        .no-results-message {
            text-align: center;
            padding: 2rem;
            display: none;
        }
        .no-results-message .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        .no-results-message i {
            font-size: 3rem;
            color: #ccc;
        }
        .no-results-message p {
            color: #666;
            font-size: 1.1rem;
        }
    `;
    document.head.appendChild(style);

    // Initialize filters
    filterTimetable();
}); 