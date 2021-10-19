// Dependecncies
const util = require("util");
const fs = require("fs");

//Create new UUIDID
const { v4: uuidv4 } = require("uuid"); // Newest update

const readNote = util.promisify(fs.readFile);
const writeNote = util.promisify(fs.writeFile);

class Save {
  
  /* Write a new Note*/
  write(note) {
    return writeNote("db/db.json", JSON.stringify(note));
  }

  /* Read a Note */
  read() {
    return readNote("db/db.json", "utf8");
  }

  /* Retreive list of Notes */
  retrieveNotes() {
    return this.read().then((notes) => {
      let parsedNotes;
      try {
        parsedNotes = [].concat(JSON.parse(notes));
      } catch (err) {
        parsedNotes = [];
      }
      return parsedNotes;
    });
  }

  /* Add note to list of notes */
  addNote(note) {
    const { title, text } = note;
    if (!title || !text) {
      throw new Error("Both title and text can not be blank");
    }
    // Use UUID package to add unique IDs
    const newNote = { title, text, id: uuidv4() };

    // update by calling retreiveNotes() and display
    return this.retrieveNotes()
      //Learned this neat thing on js. The '...notes' is called a spread-operator operator
      //The purpose of this is to "spread" over the notes object and get all of its properites, then overwrite the existing properties
      .then((notes) => [...notes, newNote])
      .then((updatedNotes) => this.write(updatedNotes))
      .then(() => newNote);
  }

  // Delete Note by id function
  deleteNote(id) {
    return this.retrieveNotes()
      .then((notes) => notes.filter((note) => note.id !== id))
      .then((filteredNotes) => this.write(filteredNotes));
  }
}

module.exports = new Save();
