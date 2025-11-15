const DB_INSERT_ROM = "INSERT INTO tb_asm_rom (key, title, date, type, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration) VALUES (?, ?, ?, ?, ? ,? ,? ,? ,?, ?, ?)";

const DB_SELECT_BY_ID_ROM = "SELECT id, key, date, title, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration FROM tb_asm_rom WHERE key=?";

//const DB_SELECT_ALL_ROM = "SELECT id, key, date, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration FROM tb_asm_rom";

const DB_SELECT_RECENT_ROM = "SELECT id, key, title, date, type FROM tb_asm_rom ORDER BY id DESC";

const DB_DELETE_ALL_ROM = "DELETE FROM tb_asm_rom";

const DB_DELETE_BY_KEY_ROM = "DELETE FROM tb_asm_rom WHERE key = ?";

const DB_UPDATE_BY_KEY_ROM = "UPDATE tb_asm_rom SET title = ? WHERE key = ?";

const DB_INSERT_JPS = "INSERT INTO tb_asm_jps (key, title, date, type, horizontal, vertical, angular, current, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

const DB_SELECT_ALL_JPS = "SELECT id, key, title, date, type, horizontal, vertical, angular, current, duration FROM tb_asm_jps";

const DB_SELECT_ALL_ROM =
    `SELECT 
        (key + type) AS id 
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
    FROM tb_asm_rom

    UNION ALL

    SELECT
        (key + type) AS id 
        , key
        , title
        , date
        , 0 AS extension
        , 0 AS flexion
        , 0 AS l_rotation
        , 0 AS r_rotation
        , 0 AS l_lateral
        , 0 AS r_lateral
        , 0 AS duration
        , angular AS mean_err
        , 7.8 AS variability
        , 'JPS' AS type

    FROM tb_asm_jps
    
    ORDER BY date DESC
`;

export {
    DB_INSERT_ROM
    , DB_SELECT_ALL_ROM
    , DB_DELETE_ALL_ROM
    , DB_SELECT_BY_ID_ROM
    , DB_SELECT_RECENT_ROM
    , DB_UPDATE_BY_KEY_ROM
    , DB_DELETE_BY_KEY_ROM
    , DB_INSERT_JPS
    //temp
    , DB_SELECT_ALL_JPS
}