const DB_INSERT_ROM = "INSERT INTO TableROM (key, title, date, type, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration) VALUES (?, ?, ?, ?, ? ,? ,? ,? ,?, ?, ?)";

const DB_SELECT_BY_ID_ROM = "SELECT id, key, date, title, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration FROM TableROM WHERE key=?";

const DB_SELECT_ALL_ROM = "SELECT id, key, date, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration FROM TableROM";

const DB_SELECT_RECENT_ROM = "SELECT id, key, title, date, type FROM TableROM ORDER BY date DESC";

const DB_DELETE_ALL_ROM = "DELETE FROM TableROM";

export { DB_INSERT_ROM, DB_SELECT_ALL_ROM, DB_DELETE_ALL_ROM, DB_SELECT_BY_ID_ROM, DB_SELECT_RECENT_ROM }