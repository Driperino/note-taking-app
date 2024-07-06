const API_URL = "http://localhost:3000"
//This Variable NEEDS to be set BEFORE saving a note, otherwise it will not work
let currentNoteID = '' //Might replace this later on with a more robust solution

//Get note
async function getNote() {
    try {
        const response = await fetch(`${API_URL}/notes`)
        const data = await response.json()
        console.log(data)

        //Area IDs
        const noteTitle = document.getElementById('noteTitle')
        const contentArea = document.getElementById('noteContent')
        const idArea = document.getElementById('noteID')
        const noteDate = document.getElementById('noteDate')

        if (data.length) {
            console.log(data[0].title, data[0].content)
            noteTitle.value = data[0].title //Update the title area
            contentArea.innerHTML = data[0].content //Update the content area
            currentNoteID = data[0]._id //Update the gloval variable
            idArea.dataset.noteId = currentNoteID //Update the ID area
            idArea.innerHTML = currentNoteID //Use global variable to update the ID area
            noteDate.innerHTML = data[0].createDate //Update the date area
        } else {
            noteTitle.innerHTML = "Click the 'New Note' button to create a new note"
            contentArea.innerHTML = "Sad Note Taking App noises..."
            console.log("No notes found")

        }
    } catch (error) {
        console.error('Error fetching notes:', error)
    }
}
//Get note on Get button click
document.getElementById("getButton").addEventListener("click", async () => {
    await getNote();
    console.log(currentNoteID)
});


//Save note
async function saveNote() {
    const noteId = currentNoteID; // Assuming `currentNoteID` is defined somewhere in your script
    const noteTitle = document.getElementById('noteTitle').value;
    const noteContent = document.getElementById('noteContent').value;

    try {
        await fetch(`${API_URL}/notes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: noteTitle,
                content: noteContent
            })
        });
    } catch (error) {
        console.error('Error saving note:', error)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            await saveNote();
        });
    }
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

