document.getElementById('seatForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const studentData = {
        name: document.getElementById('name').value.trim(),
        branch: document.getElementById('branch').value.trim(),
        paper: document.getElementById('paper').value.trim(),
        examDate: document.getElementById('examDate').value.trim()
    };

    if (!studentData.name || !studentData.branch || !studentData.paper || !studentData.examDate) {
        alert("❌ All fields are required!");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/seating', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message);
            return;
        }

        alert(result.message);

        document.getElementById('displayName').textContent = result.seat.name;
        document.getElementById('displayBranch').textContent = result.seat.branch;
        document.getElementById('displayPaper').textContent = result.seat.paper;
        document.getElementById('displayExamDate').textContent = result.seat.examDate;
        document.getElementById('displayRoll').textContent = result.seat.roll;
        document.getElementById('displayFloor').textContent = result.seat.floor;
        document.getElementById('displayClassroom').textContent = result.seat.classroom;
        document.getElementById('displayBenchRow').textContent = result.seat.benchRow;
        document.getElementById('displayBenchColumn').textContent = result.seat.benchColumn;

        document.getElementById('seatInfo').style.display = 'block';
        await updateClassroomLayout(
            result.seat.floor, 
            result.seat.classroom, 
            result.seat.benchRow, 
            result.seat.benchColumn,
            result.seat.examDate
        );

        document.getElementById('seatForm').reset();

    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error retrieving seat details. Check server logs.');
    }
});

async function getOccupiedSeats(floor, classroom, examDate) {
    try {
        const response = await fetch(`http://localhost:5000/api/occupied-seats/${floor}/${classroom}/${examDate}`);
        const occupiedSeats = await response.json();
        return occupiedSeats;
    } catch (error) {
        console.error('Error fetching occupied seats:', error);
        return [];
    }
}

async function updateClassroomLayout(floor, classroom, benchRow, benchColumn, examDate) {
    // Clear existing columns
    for (let col = 1; col <= 4; col++) {
        const column = document.getElementById(`column${col}`);
        column.innerHTML = '';
    }

    try {
        // Fetch all occupied seats for this classroom
        const occupiedSeats = await getOccupiedSeats(floor, classroom, examDate);

        // Create benches for each column
        for (let col = 1; col <= 4; col++) {
            const column = document.getElementById(`column${col}`);
            
            for (let row = 1; row <= 8; row++) {
                let bench = document.createElement("div");
                bench.classList.add("bench");
                
                // Add bench number and icon
                let benchNumber = document.createElement("span");
                benchNumber.textContent = `R${row}-C${col}`;
                
                let benchIcon = document.createElement("i");
                benchIcon.classList.add("fas", "fa-chair");
                
                bench.appendChild(benchIcon);
                bench.appendChild(benchNumber);

                // Check seat status
                const isOccupied = occupiedSeats.some(seat => 
                    seat.benchRow === row && 
                    seat.benchColumn === col
                );

                if (row === Number(benchRow) && col === Number(benchColumn)) {
                    // Your seat
                    bench.classList.add("your-seat");
                    benchIcon.classList.replace("fa-chair", "fa-user");
                    bench.title = "Your Seat";
                } else if (isOccupied) {
                    // Occupied seat
                    bench.classList.add("occupied");
                    bench.title = "Occupied";
                } else {
                    // Available seat
                    bench.classList.add("available");
                    bench.title = "Available";
                }

                column.appendChild(bench);
            }
        }
    } catch (error) {
        console.error('Error updating layout:', error);
    }
}

// Helper function to generate consistent colors for groups
function getColorForGroup(groupKey) {
    const colors = [
        '#4facfe', '#00f2fe', '#a8eb12', '#fed6e3',
        '#fab2ff', '#00dbde', '#fc00ff', '#fbda61'
    ];
    const index = Array.from(groupKey).reduce((acc, char) => 
        acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
}

window.addEventListener('resize', async () => {
    const floor = document.getElementById('displayFloor').textContent;
    const classroom = document.getElementById('displayClassroom').textContent;
    const benchRow = document.getElementById('displayBenchRow').textContent;
    const benchColumn = document.getElementById('displayBenchColumn').textContent;
    const examDate = document.getElementById('displayExamDate').textContent;
    
    if (floor !== '-' && classroom !== '-') {
        await updateClassroomLayout(floor, classroom, benchRow, benchColumn, examDate);
    }
});
