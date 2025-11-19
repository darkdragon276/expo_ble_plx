import { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

export function useDatabase(dbName: string = "headx.db") {
	const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

	useEffect(() => {
		const initDb = async () => {
			try {
				const database = await SQLite.openDatabaseAsync(dbName, {
					useNewConnection: true
				});

				setDb(database);

				await database.execAsync(`
					CREATE TABLE IF NOT EXISTS tb_asm_rom (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						key 		text,
						title		text,
						date		text,
						type		text,
						extension	decimal(3,1),
						flexion		decimal(3,1),
						l_rotation	decimal(3,1),
						r_rotation	decimal(3,1),
						l_lateral	decimal(3,1),
						r_lateral	decimal(3,1),
						duration	decimal(3,1)
					)
				`);

				await database.execAsync(`
					CREATE TABLE IF NOT EXISTS tb_asm_jps (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						key 		text,
						id_session 	text,
						title		text,
						date		text,
						type		text
					)
				`);

				await database.execAsync(`
					CREATE TABLE IF NOT EXISTS tb_asm_jps_record (
						id_session 		text,
						id_record 		int,
						horizontal		decimal(3,1),
						horizontalScale	decimal(3,1),
						vertical		decimal(3,1),
						verticalScale	decimal(3,1),
						l_lateral		decimal(3,1),
						r_lateral		decimal(3,1),
						angular			decimal(3,1),
						current			text,
						duration		decimal(3,1)
					)
				`);

				// await database.execAsync(`
				// 	DROP TABLE IF EXISTS tb_asm_jps
				// `);

				// await database.execAsync(`
				// 	DROP TABLE IF EXISTS tb_asm_jps_record
				// `);

				// await database.execAsync(`
				// 	DELETE FROM tb_asm_rom
				// `);

			} catch (error) {
				console.error("Error opening database:", error);
			}
		};

		initDb();

		return () => {
			db ? db.closeAsync() : null;
		};

	}, [dbName]);

	return db;
}
