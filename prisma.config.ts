import { defineConfig } from 'prisma/config'
// Importamos dotenv para asegurar que las variables estén disponibles en la CLI
import 'dotenv/config'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in .env file')
}

export default defineConfig({
    datasource: {
        url: process.env.DATABASE_URL,
    },
})