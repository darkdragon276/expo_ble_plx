const DB_INSERT_ROM = "INSERT INTO tb_asm_rom (key, title, date, type, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration) VALUES (?, ?, ?, ?, ? ,? ,? ,? ,?, ?, ?)";

const DB_SELECT_BY_ID_ROM = "SELECT id, key, date, title, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration FROM tb_asm_rom WHERE key=?";

const DB_SELECT_RECENT =
    `SELECT
        CAST(id AS TEXT) || type AS id
        , key
        , title
        , date
        , type 
    FROM tb_asm_rom

    UNION ALL

    SELECT
        CAST(id AS TEXT) || type AS id
        , key
        , title
        , date
        , type 
    FROM tb_asm_jps

    ORDER BY date DESC`;

const DB_DELETE_ALL_ROM = "DELETE FROM tb_asm_rom";

const DB_DELETE_BY_KEY_ROM = "DELETE FROM tb_asm_rom WHERE key = ?";

const DB_UPDATE_BY_KEY_ROM = "UPDATE tb_asm_rom SET title = ? WHERE key = ?";

const DB_INSERT_JPS = "INSERT INTO tb_asm_jps (key, id_session, title, date, type) VALUES (?, ?, ?, ?, ?)";

const DB_INSERT_JPS_RECORD = "INSERT INTO tb_asm_jps_record (id_session, id_record, horizontal, horizontalScale, vertical, verticalScale, rotate, angular, pst_txt, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

const DB_SELECT_ALL_JPS = "SELECT id, key, id_session, title, date, type FROM tb_asm_jps";

const DB_SELECT_ALL_JPS_RECORD = "SELECT id_session, id_record, horizontal, vertical, angular, pst_txt, duration FROM tb_asm_jps_record";

const DB_UPDATE_BY_KEY_JPS = "UPDATE tb_asm_jps SET title = ? WHERE key = ?";

const DB_SELECT_BY_ID_JPS =
    `SELECT 
       record.id_record AS id
        , jps.key
        , jps.id_session
        , jps.title
        , jps.date
        , record.id_record
        , record.horizontal
        , record.horizontalScale
        , record.vertical
        , record.verticalScale
        , record.rotate
        , record.angular
        , record.pst_txt
        , record.duration 
    FROM tb_asm_jps AS jps

    INNER JOIN tb_asm_jps_record AS record
    ON jps.id_session = record.id_session

    WHERE jps.key=?
    `;

const DB_DELETE_BY_KEY_JPS = "DELETE FROM tb_asm_jps WHERE key = ?";
const DB_DELETE_BY_KEY_JPS_RECORD = "DELETE FROM tb_asm_jps_record WHERE id_session = ?";

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
        , 0 AS mean_err
        , 7.8 AS variability
        , 'JPS' AS type

    FROM tb_asm_jps
    
    ORDER BY date DESC
`;

const DB_SELECT_JPS_RECORD_CHART =
    `SELECT 
       record.id_record AS id
        , jps.key
        , jps.id_session
        , jps.title
        , jps.date
        , record.id_record
        , record.horizontal
        , record.horizontalScale
        , record.vertical
        , record.verticalScale
        , record.rotate
        , record.angular
        , record.pst_txt
        , record.duration 
    FROM tb_asm_jps AS jps

    INNER JOIN tb_asm_jps_record AS record
    ON jps.id_session = record.id_session

    `;

const DB_SELECT_ALL_ASM_CSV =
    `SELECT 
        date
        , title
        , type
        , flexion
        , extension
        , l_rotation
        , r_rotation
        , l_lateral
        , r_lateral
        , '' AS horizontal
        , '' AS vertical
        , '' AS rotate
        , '' AS angular
        
    FROM tb_asm_rom

    UNION ALL

    SELECT
        date
        , title
        , type
        , '' AS flexion
        , '' AS extension
        , '' AS l_rotation
        , '' AS r_rotation
        , '' AS l_lateral
        , '' AS r_lateral
        , horizontal
        , vertical
        , rotate
        , angular
       
    FROM
    (
        SELECT
            jps.title
            , jps.date
            , record.horizontal
            , record.vertical
            , record.rotate
            , record.angular
            , 'JPS' AS type

        FROM tb_asm_jps jps

        INNER JOIN tb_asm_jps_record AS record
        ON jps.id_session = record.id_session
    )
    
    ORDER BY date ASC
`;

export {
    DB_INSERT_ROM
    , DB_SELECT_ALL_ROM
    , DB_DELETE_ALL_ROM
    , DB_SELECT_BY_ID_ROM
    , DB_SELECT_RECENT
    , DB_UPDATE_BY_KEY_ROM
    , DB_DELETE_BY_KEY_ROM
    , DB_DELETE_BY_KEY_JPS
    , DB_DELETE_BY_KEY_JPS_RECORD
    , DB_INSERT_JPS
    , DB_INSERT_JPS_RECORD
    , DB_UPDATE_BY_KEY_JPS
    , DB_SELECT_ALL_JPS
    , DB_SELECT_BY_ID_JPS
    , DB_SELECT_ALL_JPS_RECORD
    , DB_SELECT_JPS_RECORD_CHART
    , DB_SELECT_ALL_ASM_CSV
}