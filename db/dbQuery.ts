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
        , title
        , date
        , extension
        , flexion
        , l_rotation
        , r_rotation
        , l_lateral
        , r_lateral
        , duration
        , 0 AS mean_err
        , 0 AS variability
        , type
    FROM TableROM

    UNION ALL

    SELECT
        (id + id) AS id
        , key || key AS key
        , title
        , date
        , 0 AS extension
        , 0 AS flexion
        , 0 AS l_rotation
        , 0 AS r_rotation
        , 0 AS l_lateral
        , 0 AS r_lateral
        , 0 AS duration
        , 2.6 AS mean_err
        , 7.8 AS variability
        , 'JPS' AS type
    FROM TableROM

    ORDER BY id DESC
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