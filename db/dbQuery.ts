const DB_INSERT_ROM = "INSERT INTO TableROM (key, title, date, type, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration) VALUES (?, ?, ?, ?, ? ,? ,? ,? ,?, ?, ?)";

const DB_SELECT_BY_ID_ROM = "SELECT id, key, date, title, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration FROM TableROM WHERE key=?";

//const DB_SELECT_ALL_ROM = "SELECT id, key, date, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration FROM TableROM";

const DB_SELECT_RECENT_ROM = "SELECT id, key, title, date, type FROM TableROM ORDER BY id DESC";

const DB_DELETE_ALL_ROM = "DELETE FROM TableROM";

const DB_DELETE_BY_KEY_ROM = "DELETE FROM TableROM WHERE key = ?";

const DB_UPDATE_BY_KEY_ROM = "UPDATE TableROM SET title = ? WHERE key = ?";

const DB_SELECT_ALL_ROM =
    `SELECT 
        id
        , key
        , date
        , CAST(replace(replace(replace(replace(date, '/', ''), ',', ''), ' ', ''), ":", "") AS REAL) AS date_n
        , extension
        , flexion
        , l_rotation
        , r_rotation
        , l_lateral
        , r_lateral
        , duration
    FROM TableROM
`;

export {
    DB_INSERT_ROM
    , DB_SELECT_ALL_ROM
    , DB_DELETE_ALL_ROM
    , DB_SELECT_BY_ID_ROM
    , DB_SELECT_RECENT_ROM
    , DB_UPDATE_BY_KEY_ROM
    , DB_DELETE_BY_KEY_ROM
}