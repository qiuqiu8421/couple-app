import { defineConfig } from "prisma/config";
import * as dotenv from "fs";
import * as path from "path";

// Load .env manually
const envPath = path.join(process.cwd(), ".env");
if (dotenv.existsSync(envPath)) {
  const content = dotenv.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, "");
  }
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
