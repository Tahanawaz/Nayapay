import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { request as httpsRequest } from 'node:https'
import { request as httpRequest } from 'node:http'

const source = await readFile(new URL('./src/App.jsx', import.meta.url), 'utf8')
const body = source.match(/const bankDomains = \{([\s\S]*?)\n\}/)?.[1]
if (!body) throw new Error('bankDomains object not found')

const bankDomains = Function(`return ({${body}})`)()
const outDir = new URL('./public/bank-logos/', import.meta.url)
await mkdir(outDir, { recursive: true })

const slug = (value) => String(value || 'bank').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const download = (url, redirects = 0) => new Promise((resolve, reject) => {
  const client = url.startsWith('http://') ? httpRequest : httpsRequest
  const req = client(url, { headers: { 'user-agent': 'Mozilla/5.0' } }, (res) => {
    if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 5) {
      const nextUrl = new URL(res.headers.location, url).toString()
      res.resume()
      download(nextUrl, redirects + 1).then(resolve, reject)
      return
    }
    if (res.statusCode < 200 || res.statusCode >= 300) {
      res.resume()
      reject(new Error(`HTTP ${res.statusCode}`))
      return
    }
    const chunks = []
    res.on('data', (chunk) => chunks.push(chunk))
    res.on('end', () => {
      const buffer = Buffer.concat(chunks)
      const type = res.headers['content-type'] || ''
      if (buffer.length < 120 || type.includes('html')) {
        reject(new Error(`Bad logo response: ${type || 'unknown'}`))
        return
      }
      resolve(buffer)
    })
  })
  req.on('error', reject)
  req.setTimeout(12000, () => req.destroy(new Error('timeout')))
  req.end()
})

for (const [bank, domain] of Object.entries(bankDomains)) {
  const cleanDomain = String(domain).replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const urls = [
    `https://logo.clearbit.com/${cleanDomain}`,
    `https://www.google.com/s2/favicons?domain_url=https://${cleanDomain}&sz=128`,
    `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`,
  ]

  let saved = false
  for (const url of urls) {
    try {
      const buffer = await download(url)
      await writeFile(new URL(`${slug(bank)}.png`, outDir), buffer)
      console.log(`saved ${bank} <- ${url}`)
      saved = true
      break
    } catch (error) {
      console.log(`skip ${bank} <- ${url}: ${error.message}`)
    }
  }
  if (!saved) console.log(`missing ${bank}`)
}
