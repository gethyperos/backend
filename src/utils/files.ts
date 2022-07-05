import { readFile as fsReadFile, readdir as fsReadDir, writeFile as fsWriteFile } from 'fs/promises'

export async function readJSON(path: string) {
  const data = await fsReadFile(path, { encoding: 'utf-8' })
  return JSON.parse(data)
}

export async function readFile(path: string) {
  const data = await fsReadFile(path, { encoding: 'utf-8' })
  return data.toString()
}

export async function writeFile(path: string, data: string) {
  await fsWriteFile(path, data)
}
