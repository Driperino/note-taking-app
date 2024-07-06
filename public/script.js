const API_URL = "http://localhost:3000"


async function getNotes() {
    try {
        const response = await fetch(`${API_URL}/notes`)
        const data = await response.json()
        console.log(data)

        if (data.length) {
            data.forEach(note => {
                const noteElement = document.createElement("div")
                noteElement.className = "note"
                noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
            `
                document.body.appendChild(noteElement)
            })
        } else {

        }
    } catch (error) {
        console.error(error)
    }
}


addEventListener("DOMContentLoaded", async () => {
    await getNotes()
})

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

