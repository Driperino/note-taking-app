const API_URL = "http://localhost:3000"
let currentNoteID = null

async function getNote() {
    try {
        const response = await fetch(`${API_URL}/notes`)
        const data = await response.json()
        console.log(data)

        //Area IDs
        const noteTitle = document.getElementById('noteTitle')
        const contentArea = document.getElementById('noteContent')

        if (data.length) {
            console.log(data[0].title, data[0].content)
            noteTitle.value = data[0].title
            contentArea.innerHTML = data[0].content
            currentNoteID = data[0]._id
        } else {
            noteTitle.innerHTML = "Click the 'New Note' button to create a new note"
            contentArea.innerHTML = "Sad Note Taking App noises..."
            console.log("No notes found")

        }
    } catch (error) {
        console.error('Error fetching notes:', error)
    }
}

document.getElementById("getButton").addEventListener("click", async () => {
    await getNote();
});

async function saveNote() {
    const noteId = currentNoteID
    const noteTitle = document.getElementById('noteTitle').value;
    const noteContent = document.getElementById('noteContent').value;

    try {
        let method = 'PUT'; // Default to creating a new note

        // Check if noteId is provided and try to fetch the existing note
        if (noteId) {
            const existingNoteResponse = await fetch(`${API_URL}/notes/${noteId}`);
            if (existingNoteResponse.ok) {
                method = 'PATCH'; // Use PATCH if the note with noteId exists
            }
        }

        const response = await fetch(`${API_URL}/notes`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: noteId, title: noteTitle, content: noteContent })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        console.log(`Note ${method === 'PATCH' ? 'updated' : 'saved'}`);

    } catch (error) {
        console.error('Error saving note:', error);
    }
}


document.getElementById("saveButton").addEventListener("click", async () => {
    await saveNote();
});



//Expanding menus 
document.getElementById('menuButton').addEventListener('click', function () {
    var menu = document.getElementById('menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
    } else {
        menu.classList.add('hidden');
    }
});

document.getElementById('notesButton').addEventListener('click', function () {
    var notesMenu = document.getElementById('notesMenu');
    if (notesMenu.classList.contains('hidden')) {
        notesMenu.classList.remove('hidden');
    } else {
        notesMenu.classList.add('hidden');
    }
});

