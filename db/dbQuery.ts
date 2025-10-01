const DB_INSERT_ROM = "INSERT INTO TableROM (dt, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration) VALUES (?, ? ,? ,? ,? ,?, ?, ?)";

const DB_SELECT_ALL_ROM = "SELECT dt, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration FROM TableROM";

const DB_DELETE_ALL_ROM = "DELETE FROM TableROM";






export { DB_INSERT_ROM, DB_SELECT_ALL_ROM, DB_DELETE_ALL_ROM }