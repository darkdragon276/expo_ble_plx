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
					CREATE TABLE IF NOT EXISTS TableROM (
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

				// await database.execAsync(`
				// 	DROP TABLE IF EXISTS TableROM
				// `);

				// await database.execAsync(`
				// 	DELETE FROM TableROM
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
