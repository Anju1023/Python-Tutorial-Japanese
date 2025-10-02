import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;

if (!token || !databaseId) {
	throw new Error(
		'NOTION_TOKEN and NOTION_DATABASE_ID must be set in environment variables'
	);
}

async function main() {
	const notion = new Client({ auth: token });

	const res = await notion.databases.retrieve({ database_id: databaseId! });
	console.dir(res, { depth: null });
}

main();
