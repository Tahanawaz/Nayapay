import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import html2canvas from 'html2canvas'
import jsQR from 'jsqr'
import './App.css'

const initialProfile = {
  name: 'Taha Nawaz',
  handle: 'taha.nawaz',
  email: 'taha.nawaz@example.com',
  phone: '03096733225',
  account: 'PK93NAYA200826054515103516',
  photo: 'TN',
}

const banks = [
  'Easypaisa',
  'JazzCash',
  'SadaPay',
  'NayaPay',
  'Meezan Bank',
  'HBL',
  'HBL Konnect',
  'HBL Microfinance Bank',
  'UBL Digital',
  'Bank Alfalah',
  'Bank Alfalah Islamic',
  'MCB Bank',
  'MCB Islamic Bank',
  'Allied Bank',
  'Askari Bank',
  'Faysal Bank',
  'Soneri Bank',
  'Bank Al Habib',
  'Habib Metro',
  'Standard Chartered',
  'National Bank',
  'Bank of Punjab',
  'Bank of Khyber',
  'JS Bank',
  'Samba Bank',
  'BankIslami',
  'Dubai Islamic Bank',
  'Al Baraka Bank',
  'United Bank Limited',
  'Sindh Bank',
  'Summit Bank',
  'First Women Bank',
  'Zarai Taraqiati Bank',
  'Punjab Provincial Cooperative Bank',
  'U Microfinance Bank',
  'Mobilink Microfinance Bank',
  'NRSP Microfinance Bank',
  'Khushhali Microfinance Bank',
  'FINCA Microfinance Bank',
  'APNA Microfinance Bank',
  'ASA Microfinance Bank',
  'LOLC Microfinance Bank',
  'Halan Microfinance Bank',
  'ABHI Microfinance Bank',
  'ICBC Pakistan',
  'Bank of China',
  'Citibank Pakistan',
  'Deutsche Bank Pakistan',
  'Mashreq Bank Pakistan',
  'Raqami Islamic Digital Bank',
  'DigiBOP',
  'PayMax',
  'Finja EMI',
  'Bykea',
]

const bankDomains = {
  Easypaisa: 'easypaisa.com.pk',
  JazzCash: 'jazzcash.com.pk',
  SadaPay: 'sadapay.pk',
  NayaPay: 'nayapay.com',
  'Meezan Bank': 'meezanbank.com',
  HBL: 'hbl.com',
  'HBL Konnect': 'hbl.com',
  'HBL Microfinance Bank': 'hbl.com',
  'UBL Digital': 'ubldigital.com',
  'Bank Alfalah': 'bankalfalah.com',
  'Bank Alfalah Islamic': 'bankalfalah.com',
  'MCB Bank': 'mcb.com.pk',
  'MCB Islamic Bank': 'mcbislamicbank.com',
  'Allied Bank': 'abl.com',
  'Askari Bank': 'akbl.com.pk',
  'Faysal Bank': 'faysalbank.com',
  'Soneri Bank': 'soneribank.com',
  'Bank Al Habib': 'bankalhabib.com',
  'Habib Metro': 'habibmetro.com',
  'Standard Chartered': 'standardchartered.com.pk',
  'National Bank': 'nbp.com.pk',
  'Bank of Punjab': 'bop.com.pk',
  'Bank of Khyber': 'bok.com.pk',
  'JS Bank': 'jsbl.com',
  'Samba Bank': 'www.samba.com.pk',
  BankIslami: 'bankislami.com.pk',
  'Dubai Islamic Bank': 'dibpak.com',
  'Al Baraka Bank': 'albaraka.com.pk',
  'United Bank Limited': 'ubl.com.pk',
  'Sindh Bank': 'sindhbankltd.com',
  'Summit Bank': 'bankmakramah.com',
  'First Women Bank': 'fwbl.com.pk',
  'Zarai Taraqiati Bank': 'ztbl.com.pk',
  'Punjab Provincial Cooperative Bank': 'ppcbl.com.pk',
  'U Microfinance Bank': 'ubank.com.pk',
  'Mobilink Microfinance Bank': 'mobilinkbank.com',
  'NRSP Microfinance Bank': 'nrspbank.com',
  'Khushhali Microfinance Bank': 'khushhalibank.com.pk',
  'FINCA Microfinance Bank': 'finca.org',
  'APNA Microfinance Bank': 'apnabank.com.pk',
  'ASA Microfinance Bank': 'pakistan.asa-international.com',
  'LOLC Microfinance Bank': 'lolc.com.pk',
  'Halan Microfinance Bank': 'halan.com',
  'ABHI Microfinance Bank': 'abhi.com.pk',
  'ICBC Pakistan': 'icbc.com.cn',
  'Bank of China': 'bankofchina.com.pk',
  'Citibank Pakistan': 'citibank.com',
  'Deutsche Bank Pakistan': 'db.com',
  'Mashreq Bank Pakistan': 'mashreq.com',
  'Raqami Islamic Digital Bank': 'raqamidigital.com',
  DigiBOP: 'digibop.com.pk',
  PayMax: 'paymax.com.pk',
  'Finja EMI': 'finja.pk',
  Bykea: 'bykea.com',
}

const logoLabels = {
  Easypaisa: 'e',
  JazzCash: 'JC',
  SadaPay: 'S',
  NayaPay: 'N',
  'Meezan Bank': 'M',
  HBL: 'HBL',
  'HBL Konnect': 'H',
  'HBL Microfinance Bank': 'H',
  'UBL Digital': 'UBL',
  'Bank Alfalah': 'BA',
  'Bank Alfalah Islamic': 'BA',
  'MCB Bank': 'MCB',
  'MCB Islamic Bank': 'MCB',
  'Allied Bank': 'ABL',
  'Askari Bank': 'AK',
  'Faysal Bank': 'FB',
  'Soneri Bank': 'SB',
  'Bank Al Habib': 'BAH',
  'Habib Metro': 'HM',
  'Standard Chartered': 'SC',
  'National Bank': 'NBP',
  'Bank of Punjab': 'BOP',
  'Bank of Khyber': 'BOK',
  'JS Bank': 'JS',
  'Samba Bank': 'S',
  BankIslami: 'BI',
  'Dubai Islamic Bank': 'DIB',
  'Al Baraka Bank': 'AB',
  'United Bank Limited': 'UBL',
  'Sindh Bank': 'SB',
  'Summit Bank': 'SM',
  'First Women Bank': 'FW',
  'Zarai Taraqiati Bank': 'ZT',
  'Punjab Provincial Cooperative Bank': 'PB',
  'U Microfinance Bank': 'UB',
  'Mobilink Microfinance Bank': 'MB',
  'NRSP Microfinance Bank': 'NR',
  'Khushhali Microfinance Bank': 'KB',
  'FINCA Microfinance Bank': 'FN',
  'APNA Microfinance Bank': 'AP',
  'ASA Microfinance Bank': 'ASA',
  'LOLC Microfinance Bank': 'L',
  'Halan Microfinance Bank': 'HL',
  'ABHI Microfinance Bank': 'AB',
  'ICBC Pakistan': 'ICBC',
  'Bank of China': 'BOC',
  'Citibank Pakistan': 'CITI',
  'Deutsche Bank Pakistan': 'DB',
  'Mashreq Bank Pakistan': 'M',
  'Raqami Islamic Digital Bank': 'R',
  DigiBOP: 'BOP',
  PayMax: 'PM',
  'Finja EMI': 'F',
  Bykea: 'B',
}

const NAYAPAY_LOGO_URL = '/logo.jpeg'

const bankNameAliases = {
  'easypaisa Bank': 'Easypaisa',
  easypaisa: 'Easypaisa',
  'JazzCash Wallet': 'JazzCash',
  Silkbank: 'United Bank Limited',
  silkbank: 'United Bank Limited',
}

const bankLogoSlugs = {
  Easypaisa: 'easypaisa-bank',
  JazzCash: 'jazzcash-wallet',
  'United Bank Limited': 'ubl-digital',
}

const initialFavorites = [
  {
    id: 'fav-1',
    name: 'Taha Nawaz',
    bank: 'Easypaisa',
    account: 'PK24EASY0000000003516',
  },
]

const initialTransactions = [
  {
    direction: 'received',
    name: 'Taha Nawaz',
    bank: 'Easypaisa',
    account: 'PK24EASY0000000003516',
    amount: 50,
    tid: 'TMICFBPK200826054515103516',
    date: '20 Aug 2026',
    time: '10:17 PM',
  },
]

const STORAGE_KEY = 'nayapay.app.state.v1'

function loadAppState() {
  const defaults = {
    profile: initialProfile,
    balance: 0.13,
    favorites: initialFavorites,
    transactions: initialTransactions,
    notifications: [],
    theme: 'light',
  }

  if (typeof window === 'undefined') return defaults

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaults
    const parsed = JSON.parse(stored)
    const normalizeBankItem = (item) => ({ ...item, bank: normalizeBankName(item?.bank) })
    const transactions = Array.isArray(parsed.transactions) ? parsed.transactions.map(normalizeBankItem) : defaults.transactions
    const fallbackStamp = nowStamp()
    const notifications = Array.isArray(parsed.notifications)
      ? parsed.notifications.map((notice) => {
        const normalized = normalizeBankItem(notice)
        const transaction = transactions.find((item) => item.tid === normalized.tid)
        return {
          ...normalized,
          date: normalized.date || transaction?.date || fallbackStamp.date,
          time: normalized.time || transaction?.time || fallbackStamp.time,
          direction: normalized.direction || transaction?.direction || 'sent',
          amount: Number.isFinite(Number(normalized.amount)) ? Number(normalized.amount) : transaction?.amount,
        }
      })
      : defaults.notifications
    return {
      profile: { ...initialProfile, ...(parsed.profile || {}) },
      balance: Number.isFinite(Number(parsed.balance)) ? Number(parsed.balance) : defaults.balance,
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites.map(normalizeBankItem) : defaults.favorites,
      transactions,
      notifications,
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
    }
  } catch {
    return defaults
  }
}

function saveAppState(state) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can fail in private mode or low-space devices; keep the in-memory app usable.
  }
}

const tiles = [
  ['quickpay', 'QuickPay'],
  ['bills', 'Bills'],
  ['merchant', 'Merchants'],
  ['topup', 'Mobile Top-Up'],
  ['split', 'Bill Split'],
  ['gift', 'Gift Envelope'],
]

const navItems = [
  ['home', 'Home'],
  ['chat', 'Chat'],
  ['card', 'Cards'],
  ['transfer', 'Activity'],
]

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function money(value) {
  return Number(value || 0).toLocaleString('en-PK', {
    minimumFractionDigits: Number(value) % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })
}

function shortAccount(value) {
  const clean = String(value || '').replace(/\s/g, '')
  if (clean.length < 8) return clean
  return `${clean.slice(0, 4)}****${clean.slice(-4)}`
}

function normalizeAccount(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
}

function bankSlug(value) {
  const label = bankNameAliases[value] || value
  return String(bankLogoSlugs[label] || label || 'bank').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function normalizeBankName(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (bankNameAliases[raw]) return bankNameAliases[raw]
  const compact = raw.toLowerCase().replace(/[^a-z0-9]/g, '')
  const exact = banks.find((bank) => bank.toLowerCase().replace(/[^a-z0-9]/g, '') === compact)
  if (exact) return exact
  if (compact.includes('easypaisa') || compact.includes('easypay')) return 'Easypaisa'
  if (compact.includes('jazzcash') || compact.includes('jazz')) return 'JazzCash'
  return raw
}

function generateTid() {
  const random = new Uint32Array(2)
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(random)
  } else {
    random[0] = Math.floor(Math.random() * 0xffffffff)
    random[1] = Math.floor(Math.random() * 0xffffffff)
  }
  return `TMICFBPK${Date.now()}${Array.from(random).map((part) => part.toString(16).padStart(8, '0')).join('').toUpperCase()}`
}

async function copyText(value) {
  const text = String(value || '')
  if (!text) return false
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Try the legacy path below.
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(textarea)
  return ok
}

function makeReceiptPng(item) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1350
  const ctx = canvas.getContext('2d')
  const sent = item.direction !== 'received'
  const bankColors = {
    Easypaisa: '#24a16f', JazzCash: '#e5ad00', NayaPay: '#ff4d13',
    'Meezan Bank': '#5b277f', HBL: '#1b9e91', 'HBL Konnect': '#1b9e91',
  }
  const bankColor = bankColors[item.bank] || '#7651e6'
  const account = item.account || ''
  const drawCenter = (text, y, font, color) => {
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText(String(text), canvas.width / 2, y)
  }
  const roundRect = (x, y, width, height, radius) => {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + width, y, x + width, y + height, radius)
    ctx.arcTo(x + width, y + height, x, y + height, radius)
    ctx.arcTo(x, y + height, x, y, radius)
    ctx.arcTo(x, y, x + width, y, radius)
    ctx.closePath()
  }

  ctx.fillStyle = '#f8f6fb'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#f0e7ff'
  ctx.fillRect(0, 0, canvas.width, 290)
  roundRect(70, 210, 940, 990, 38)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  drawCenter(sent ? 'PAYMENT SUCCESSFUL' : 'MONEY RECEIVED', 125, '800 42px Roboto, Arial, sans-serif', '#211821')
  ctx.beginPath()
  ctx.arc(540, 295, 58, 0, Math.PI * 2)
  ctx.fillStyle = bankColor
  ctx.fill()
  drawCenter((item.bank || 'Bank').split(' ').map((word) => word[0]).join('').slice(0, 3), 310, '800 27px Roboto, Arial, sans-serif', '#ffffff')
  drawCenter(`Rs. ${money(item.amount)}`, 420, '800 70px Roboto, Arial, sans-serif', '#17131a')
  drawCenter(sent ? 'Paid to' : 'Received from', 475, '400 26px Roboto, Arial, sans-serif', '#7a727d')
  drawCenter(item.name || 'Saved account', 525, '700 34px Roboto, Arial, sans-serif', '#211b22')
  drawCenter(`${item.bank || 'Bank'}-${account.slice(-4)}`, 570, '400 25px Roboto, Arial, sans-serif', '#77707a')

  ctx.strokeStyle = '#ece7ed'
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(126, 640); ctx.lineTo(954, 640); ctx.stroke()
  const rows = [
    ['Amount', `Rs. ${money(item.amount)}`],
    ['Service Fee', 'Rs. 0'],
    ['Transaction ID', item.tid || '—'],
    ['Date & Time', `${item.date || ''}  ${item.time || ''}`.trim()],
    [sent ? 'Recipient Account' : 'Source Account', account || '—'],
  ]
  rows.forEach(([label, value], index) => {
    const y = 710 + index * 94
    ctx.textAlign = 'left'; ctx.font = '400 25px Roboto, Arial, sans-serif'; ctx.fillStyle = '#77707a'; ctx.fillText(label, 130, y)
    ctx.textAlign = 'right'; ctx.font = index === 0 ? '700 28px Roboto, Arial, sans-serif' : '500 25px Roboto, Arial, sans-serif'; ctx.fillStyle = '#211b22'; ctx.fillText(value, 950, y)
    if (index < rows.length - 1) { ctx.strokeStyle = '#f0edf1'; ctx.beginPath(); ctx.moveTo(130, y + 34); ctx.lineTo(950, y + 34); ctx.stroke() }
  })
  drawCenter('NayaPay', 1150, '800 30px Roboto, Arial, sans-serif', '#ff4d13')
  drawCenter('Digital receipt', 1192, '400 22px Roboto, Arial, sans-serif', '#8f8790')
  return canvas.toDataURL('image/png')
}

async function renderedReceiptPng(item, receiptElement) {
  if (receiptElement) {
    try {
      const canvas = await html2canvas(receiptElement, {
        backgroundColor: '#f8f8f9',
        scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      ignoreElements: (element) => element.dataset?.receiptControl === 'true',
      windowWidth: receiptElement.scrollWidth,
        windowHeight: receiptElement.scrollHeight,
      })
      return canvas.toDataURL('image/png')
    } catch {
      // A generated receipt remains available if a browser blocks an external bank logo.
    }
  }
  return makeReceiptPng(item)
}

async function shareReceipt(item, receiptElement) {
  try {
    const dataUrl = await renderedReceiptPng(item, receiptElement)
    const fileName = `nayapay-receipt-${item.tid || Date.now()}.png`
    if (Capacitor.isNativePlatform()) {
      const saved = await Filesystem.writeFile({ path: `receipts/${fileName}`, data: dataUrl, directory: Directory.Cache, recursive: true })
      await Share.share({ title: 'NayaPay receipt', dialogTitle: 'Share receipt', files: [saved.uri] })
      return
    }
    const blob = await (await fetch(dataUrl)).blob()
    const file = new File([blob], fileName, { type: 'image/png' })
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      await navigator.share({ title: 'NayaPay receipt', files: [file] })
      return
    }
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = fileName
    link.click()
    window.alert('Receipt PNG downloaded. You can share it from your gallery or files app.')
  } catch (error) {
    if (error?.name !== 'AbortError') window.alert('Could not create the receipt image.')
  }
}

async function decodeQrFromBitmap(source) {
  if ('BarcodeDetector' in window) {
    try {
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
      const codes = await detector.detect(source)
      if (codes[0]?.rawValue) return codes[0].rawValue
    } catch {
      // Fall through to jsQR.
    }
  }

  const width = source.videoWidth || source.naturalWidth || source.width
  const height = source.videoHeight || source.naturalHeight || source.height
  if (!width || !height) return ''

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return ''
  context.drawImage(source, 0, 0, width, height)
  const image = context.getImageData(0, 0, width, height)
  return jsQR(image.data, image.width, image.height)?.data || ''
}

function profileMatches(profile, value) {
  const clean = normalizeAccount(value)
  return [profile.phone, profile.account].some((item) => normalizeAccount(item) === clean)
}

function findFavorite(favorites, account) {
  const clean = normalizeAccount(account)
  return favorites.find((favorite) => normalizeAccount(favorite.account) === clean)
}

function firstValue(source, keys) {
  const normalizeKey = (key) => String(key || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  const entries = Object.entries(source || {})
  for (const key of keys) {
    const expected = normalizeKey(key)
    const found = entries.find(([itemKey]) => normalizeKey(itemKey) === expected)
    const value = found?.[1]
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim()
  }
  return ''
}

function cleanQrAccount(value) {
  const text = String(value || '').trim()
  if (!text) return ''
  const compact = text.toUpperCase().replace(/[\s-]/g, '')
  if (/^[A-Z]{2}\d{2}[A-Z0-9]{8,30}$/.test(compact)) return compact
  const phone = text.match(/(?:\+?92|0)3\d{9}/)?.[0]
  if (phone) return phone
  if (/^[A-Z0-9]{8,34}$/i.test(compact) && !/[?=&/:]/.test(text)) return compact
  return ''
}

function extractQrAccount(raw) {
  const labelPattern = /(?:account(?:\s*(?:number|no))?|iban|raast(?:\s*id)?|mobile(?:\s*(?:number|no))?)\s*[:=]\s*([A-Z0-9+\-\s]{8,40})/ig
  let labeled = labelPattern.exec(raw)
  while (labeled) {
    const account = cleanQrAccount(labeled[1])
    if (account) return account
    labeled = labelPattern.exec(raw)
  }
  const compact = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  const pakistanIban = compact.match(/PK\d{2}[A-Z0-9]{20}/)?.[0]
  if (pakistanIban) return pakistanIban
  return cleanQrAccount(raw.match(/\b[A-Z]{2}\d{2}[A-Z0-9]{8,30}\b/i)?.[0])
    || cleanQrAccount(raw.match(/(?:\+?92|0)3\d{9}/)?.[0])
    || cleanQrAccount(raw)
}

function parseQrPayload(text) {
  const raw = String(text || '').trim()
  if (!raw) return null

  try {
    const data = JSON.parse(raw)
    const account = firstValue(data, ['account', 'accountNumber', 'accountNo', 'iban', 'raast', 'raastId', 'number', 'mobile', 'mobileNumber'])
    return {
      name: firstValue(data, ['name', 'accountTitle', 'title', 'receiverName', 'beneficiaryName']),
      bank: normalizeBankName(firstValue(data, ['bank', 'bankName', 'institution', 'receiverBank'])),
      account: cleanQrAccount(account),
      amount: firstValue(data, ['amount', 'transactionAmount', 'value']),
    }
  } catch {
    const normalized = raw
      .replace(/\r?\n/g, '&')
      .replace(/[;,|]+/g, '&')
      .replace(/\s*:\s*/g, '=')
    const paramsText = normalized.includes('?') ? normalized.split('?').at(-1) : normalized
    const params = new URLSearchParams(paramsText)
    const pairs = Object.fromEntries(params.entries())
    const account = firstValue(pairs, ['account', 'accountNumber', 'accountNo', 'iban', 'raast', 'raastId', 'number', 'mobile', 'mobileNumber'])
    return {
      name: firstValue(pairs, ['name', 'accountTitle', 'title', 'receiverName', 'beneficiaryName']),
      bank: normalizeBankName(firstValue(pairs, ['bank', 'bankName', 'institution', 'receiverBank'])),
      account: cleanQrAccount(account) || extractQrAccount(raw),
      amount: firstValue(pairs, ['amount', 'transactionAmount', 'value']),
    }
  }
}

function nowStamp() {
  const date = new Date()
  return {
    date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
  }
}

function LogoMark({ small = false }) {
  return (
    <span className={small ? 'np-logo np-logo--small' : 'np-logo'} aria-hidden="true">
      <img src={NAYAPAY_LOGO_URL} alt="" />
    </span>
  )
}

function BankLogo({ bank }) {
  const [logoState, setLogoState] = useState({ bank, index: 0 })
  const colors = {
    Easypaisa: ['#101015', '#24a16f'],
    JazzCash: ['#f5c21b', '#d51f2d'],
    'Meezan Bank': ['#78245f', '#f6b333'],
    HBL: ['#107c59', '#ffffff'],
    'UBL Digital': ['#0066b3', '#ffffff'],
    'United Bank Limited': ['#0066b3', '#ffffff'],
    'Bank Alfalah': ['#b8202f', '#ffffff'],
    'MCB Bank': ['#006844', '#ffffff'],
    'Allied Bank': ['#0f55a3', '#ffffff'],
  }
  const [bg, fg] = colors[bank] || ['#ff4d13', '#ffffff']
  const domain = bankDomains[bank]
  const index = logoState.bank === bank ? logoState.index : 0
  const sources = domain ? [
    `/bank-logos/${bankSlug(bank)}.png`,
    `/bank-logos/${bankSlug(bank)}.svg`,
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain_url=https://${domain}&sz=128`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ] : []
  const src = sources[index]
  return (
    <span className="bank-badge" style={{ background: bg, color: fg }}>
      {src && (
        <img
          key={`${bank}-${src}`}
          src={src}
          alt=""
          onError={(event) => {
            if (index < sources.length - 1) {
              setLogoState({ bank, index: index + 1 })
            } else {
              event.currentTarget.style.display = 'none'
            }
          }}
        />
      )}
      <em>{logoLabels[bank] || initials(bank || 'Bank')}</em>
    </span>
  )
}

function Icon({ name }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    send: <path d="M5 12h14m-6-6 6 6-6 6" />,
    more: <path d="M5 12h.01M12 12h.01M19 12h.01" />,
    search: <path d="m20 20-4.5-4.5M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />,
    scan: <path d="M7 4H5a1 1 0 0 0-1 1v2m13-3h2a1 1 0 0 1 1 1v2M7 20H5a1 1 0 0 1-1-1v-2m13 3h2a1 1 0 0 0 1-1v-2M8 12h8" />,
    bell: <path d="M18 9a6 6 0 0 0-12 0c0 7-3 6-3 8h18c0-2-3-1-3-8M10 21h4" />,
    eye: <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A9.4 9.4 0 0 1 12 5c5 0 8.5 4.3 9.5 7a13 13 0 0 1-2.1 3.3M6.6 6.6A13.4 13.4 0 0 0 2.5 12c1 2.7 4.5 7 9.5 7 1.4 0 2.7-.3 3.8-.9" />,
    'eye-open': <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
    refresh: <path d="M20 6v5h-5M4 18v-5h5M18 11a6.5 6.5 0 0 0-11-4M6 13a6.5 6.5 0 0 0 11 4" />,
    back: <path d="M19 12H5m6-6-6 6 6 6" />,
    share: <path d="M18 8a3 3 0 1 0-2.8-4M6 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM8.7 15.5l6.6-3M8.7 18.5l6.6-3" />,
    copy: <path d="M8 8h11v11H8zM5 16H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1" />,
    share2: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    home: (
      <>
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </>
    ),
    chat: <path d="M21 11.5a8.5 8.5 0 0 1-11.8 7.8L4 21l1.7-4.4A8.5 8.5 0 1 1 21 11.5Z" />,
    card: <path d="M3 7h18v10H3zM3 10h18" />,
    transfer: <path d="M17 7H4m7-4 6 4-6 4M7 17h13m-7-4-6 4 6 4" />,
    quickpay: <path d="M7 7h4v4H7zM13 7h4v4h-4zM7 13h4v4H7zM14 14h3v3h-3z" />,
    bills: <path d="M7 3h10v18l-2-1-2 1-2-1-2 1-2-1zM9 8h6M9 12h6M9 16h4" />,
    merchant: <path d="M4 9h16l-1-5H5zM6 9v11h12V9M9 20v-6h6v6" />,
    topup: <path d="M9 2h6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm3 14V8m-4 4 4-4 4 4" />,
    split: <path d="M7 4h10v16H7zM9 8h6M9 12h6M9 16h2m5 0h.01" />,
    gift: <path d="M4 11h16v10H4zM2 7h20v4H2zM12 7v14M12 7H8.5a2 2 0 1 1 0-4C11 3 12 7 12 7Zm0 0h3.5a2 2 0 1 0 0-4C13 3 12 7 12 7Z" />,
    trash: <path d="M4 7h16M10 11v6m4-6v6M9 7l1-3h4l1 3m-9 0 1 14h10l1-14" />,
  }

  return (
    <svg className={`icon icon--${name}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function StatusBar() {
  return null
}

function Home({ profile, balance, showBalance, setShowBalance, onAdd, onSend, onProfile, onReceipt, onNav, onQr, transactions, unreadNotifications, onNotifications }) {
  return (
    <main className="screen home-screen">
      <StatusBar />
      <header className="home-top">
        <button className="avatar-button" type="button" onClick={onProfile}>
          {profile.photo?.startsWith('data:') ? <img src={profile.photo} alt="Profile" /> : (profile.photo || initials(profile.name))}
        </button>
        <div className="search-pill">
          <Icon name="search" />
          <span>Find people and merchants</span>
        </div>
        <button className="round-action" type="button" onClick={onQr}><Icon name="scan" /></button>
        <button className={`round-action notify ${unreadNotifications ? 'notify--unread' : ''}`} type="button" onClick={onNotifications} aria-label={`Notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ''}`}>
          <Icon name="bell" />
          {unreadNotifications > 0 && <i className="notify-count">{unreadNotifications > 9 ? '9+' : unreadNotifications}</i>}
        </button>
      </header>

      <section className="balance-area">
        <p>Hi <b>{profile.name.split(' ')[0]}</b> 🇵🇰</p>
        <div className="balance-line">
          <strong>{showBalance ? `Rs. ${money(balance)}` : 'Rs. ••••'}</strong>
          <button type="button" onClick={() => setShowBalance(!showBalance)}><Icon name="eye" /></button>
        </div>
        <button className="refresh-line" type="button" onClick={() => setShowBalance(true)}>
          <Icon name="refresh" />
          <span>Updated moments ago</span>
        </button>
      </section>

      <section className="quick-actions">
        <button type="button" onClick={onAdd}><span><Icon name="plus" /></span><b>Add Money</b></button>
        <button type="button" onClick={onSend}><span><Icon name="send" /></span><b>Send Money</b></button>
        <button type="button" onClick={() => onNav('more')}><span><Icon name="more" /></span><b>More</b></button>
      </section>

      <section className="content-sheet">
        <div className="demo-banner">
          <button type="button" aria-label="Close">×</button>
          <div>
            <b>You’re here! ✨</b>
            <p>Let’s make money things happen.</p>
            <p>You know you want to.</p>
          </div>
          <LogoMark />
        </div>

        <div className="tile-grid">
          {tiles.map(([icon, label]) => (
            <button type="button" key={label} onClick={() => onNav(icon)}>
              <span><Icon name={icon} /></span>
              <b>{label}</b>
            </button>
          ))}
        </div>

        {transactions.length > 0 && (
          <button className="latest-card" type="button" onClick={() => onReceipt(transactions[0])}>
            <span>Latest transaction</span>
            <b>{transactions[0].direction === 'received' ? 'Received' : 'Sent'} Rs. {money(transactions[0].amount)}</b>
          </button>
        )}
      </section>

      <BottomNav active="home" onNav={onNav} />
    </main>
  )
}

function BottomNav({ active, onNav }) {
  return (
    <nav className="bottom-nav">
      {navItems.map(([icon, label]) => (
        <button className={active === icon ? 'active' : ''} type="button" key={label} onClick={() => onNav(icon)}>
          <Icon name={icon} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

function MoneyForm({ type, profile, favorites, initialDraft, onBack, onSubmit, onScan, showRecipientName = false }) {
  const isReceive = type === 'receive'
  const [draft, setDraft] = useState({
    name: initialDraft?.name || (isReceive ? 'Taha Nawaz' : ''),
    bank: initialDraft?.bank || (isReceive ? 'Easypaisa' : ''),
    account: initialDraft?.account || (isReceive ? 'PK24EASY0000000003516' : ''),
    targetAccount: initialDraft?.targetAccount || profile.phone,
    amount: initialDraft?.amount || (isReceive ? '50' : ''),
  })

  const title = isReceive ? 'Add Money' : 'Send Money'
  const button = isReceive ? 'Receive' : 'Next'
  const matchedFavorite = findFavorite(favorites, draft.account)

  const updateAccount = (account) => {
    const favorite = findFavorite(favorites, account)
    setDraft({
      ...draft,
      account,
      name: favorite?.name || draft.name,
      bank: favorite?.bank || draft.bank,
    })
  }

  const continuePayment = () => {
    if (!isReceive && (!draft.bank || !draft.account.trim())) {
      window.alert('Please select a bank and enter an account number.')
      return
    }
    if (!isReceive && showRecipientName && !draft.name.trim()) {
      window.alert('Please enter the recipient name.')
      return
    }
    onSubmit({
      ...draft,
      name: draft.name.trim() || matchedFavorite?.name || 'Account Holder',
    })
  }

  return (
    <main className="screen form-screen">
      <StatusBar />
      <Header title={title} onBack={onBack} />
      <section className="form-card">
        <div className="mode-title">
          {(isReceive || draft.bank) && <BankLogo bank={draft.bank} />}
          <div>
            <b>{isReceive ? 'Receive from bank' : 'Transfer to account'}</b>
            <span>{matchedFavorite ? 'Favorite matched, details fetched' : 'Enter account details'}</span>
          </div>
          <button className="scan-inline" type="button" onClick={onScan}><Icon name="scan" /></button>
        </div>

        {(isReceive || showRecipientName) && (
          <label>
            <span>{isReceive ? 'Source Acc. Title' : 'Recipient Name'}</span>
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </label>
        )}

        <label>
          <span>{isReceive ? 'Source Bank' : 'Destination Bank'}</span>
          <div className={`select-with-logo ${!isReceive && !draft.bank ? 'select-with-logo--empty' : ''}`}>
            {(isReceive || draft.bank) && <BankLogo bank={draft.bank} />}
            <select value={draft.bank} onChange={(e) => setDraft({ ...draft, bank: e.target.value })}>
              {!isReceive && <option value="">Select Bank</option>}
              {banks.map((bank) => <option key={bank}>{bank}</option>)}
            </select>
          </div>
        </label>

        <label>
          <span>{isReceive ? 'Raast ID / IBAN' : 'Account / IBAN'}</span>
          <input value={draft.account} onChange={(e) => updateAccount(e.target.value)} />
        </label>

        {isReceive && (
          <label>
            <span>Your linked account / mobile number</span>
            <input value={draft.targetAccount} onChange={(e) => setDraft({ ...draft, targetAccount: e.target.value })} />
          </label>
        )}

        {isReceive && (
          <label>
            <span>Amount</span>
            <input inputMode="numeric" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value.replace(/\D/g, '') })} />
          </label>
        )}

        {(isReceive || showRecipientName) && <div className="linked-account">
          <span>Linked wallet</span>
          <b>{profile.name}</b>
          <small>{profile.phone} • {shortAccount(profile.account)}</small>
        </div>}

        <button className="primary-btn" type="button" onClick={continuePayment}>
          {isReceive ? `${button} Rs. ${money(draft.amount)}` : button}
          <Icon name={isReceive ? 'plus' : 'send'} />
        </button>
      </section>
    </main>
  )
}

function ScannedAccountAmount({ draft, balance, onBack, onNext }) {
  const [amount, setAmount] = useState('')
  const cleanAmount = amount.replace(/^0+(?=\d)/, '')
  const amountValue = Number(cleanAmount || 0)
  const exceedsBalance = amountValue > Number(balance || 0)
  const canContinue = Number.isInteger(amountValue) && amountValue > 0 && !exceedsBalance
  const recipientBank = draft.bank || 'Easypaisa'
  const recipientAccount = draft.account || ''

  const enterKey = (key) => {
    if (key === 'backspace') {
      setAmount((current) => current.slice(0, -1))
      return
    }
    setAmount((current) => {
      if (current.length >= 10) return current
      return `${current}${key}`
    })
  }

  return (
    <main className="screen scanned-amount-screen">
      <StatusBar />
      <button className="scanned-amount-back" type="button" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
      <h1>Enter Amount</h1>

      <section className="scanned-recipient">
        <BankLogo bank={recipientBank} />
        <div>
          <b>{draft.name || 'Saved account'}</b>
          <span>{recipientAccount || 'Account details unavailable'}</span>
          <small>{recipientBank}</small>
        </div>
      </section>

      <section className="scanned-amount-value" aria-label="Amount to send">
        <span>Rs.</span><b>{cleanAmount || ''}</b><i aria-hidden="true" />
      </section>
      <p className="scanned-wallet"><b>My Wallet</b><span>Rs. {money(balance)}</span></p>
      {exceedsBalance && <p className="scanned-amount-error">Amount is greater than your available wallet balance.</p>}

      <div className="scanned-actions">
        <button type="button" className="scanned-next" disabled={!canContinue} onClick={() => canContinue && onNext({ ...draft, amount: cleanAmount })}>Next</button>
        <div className="scanned-keypad" aria-label="Number keypad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'].map((key, index) => (
            key ? <button key={key} type="button" onClick={() => enterKey(key)} aria-label={key === 'backspace' ? 'Delete last digit' : key}>{key === 'backspace' ? '⌫' : key}</button> : <span key={`space-${index}`} aria-hidden="true" />
          ))}
        </div>
      </div>
    </main>
  )
}

function Header({ title, onBack, right, captureControls = false }) {
  return (
    <header className="page-header">
      <button type="button" onClick={onBack} data-receipt-control={captureControls ? 'true' : undefined}><Icon name="back" /></button>
      <h1>{title}</h1>
      {right || <span />}
    </header>
  )
}

function Receipt({ item, profile, onBack, onShare, autoShare = false, onAutoShared, animate = false }) {
  const isReceived = item.direction === 'received'
  const [copied, setCopied] = useState(false)
  const receiptRef = useRef(null)
  const topName = item.name
  const topBank = item.bank || 'Easypaisa'
  const topAccount = item.account
  const sub = `${topBank}-${topAccount.slice(-4)}`
  const destinationName = isReceived ? profile.name : item.name
  const sourceName = isReceived ? item.name : profile.name
  const destinationAccount = isReceived ? profile.account : item.account

  useEffect(() => {
    if (!autoShare) return undefined
    const timer = window.setTimeout(() => {
      onAutoShared?.()
      onShare(item, receiptRef.current)
    }, 180)
    return () => window.clearTimeout(timer)
  }, [autoShare, item, onAutoShared, onShare])

  return (
    <main ref={receiptRef} className={`screen receipt-screen ${animate ? 'receipt-screen--animate' : ''}`}>
      <StatusBar />
      <Header
        title=""
        onBack={onBack}
        captureControls
        right={<button className="share-btn" type="button" onClick={() => onShare(item, receiptRef.current)} aria-label="Share receipt" data-receipt-control="true"><Icon name="share2" /></button>}
      />

      <section className="receipt-hero">
        <div className="receipt-bank-logo"><BankLogo bank={topBank} /></div>
        <h2>{topName}</h2>
        <p>{sub}</p>
        <strong>Rs. {money(item.amount)}</strong>
        <time>{item.date}, {item.time}</time>
      </section>

      <section className="amount-card">
        <Row label={isReceived ? 'Amount Received' : 'Amount Sent'} value={`Rs. ${money(item.amount)}`} />
        <Row label="Service Fee (Incl. Tax)" value="Rs. 0" />
        <Row label="Total Amount" value={`Rs. ${money(item.amount)}`} />
      </section>

      <button
        className={`copy-card ${copied ? 'copy-card--copied' : ''}`}
        type="button"
        onClick={async () => {
          const ok = await copyText(item.tid)
          setCopied(ok)
          window.setTimeout(() => setCopied(false), 1300)
        }}
      >
        <span>Transaction ID</span>
        <b>{copied ? 'Copied' : `${item.tid.slice(0, 21)}...`}</b>
        <Icon name="copy" />
      </button>

      <section className="info-card">
        <h3>ADDITIONAL INFORMATION <span>⌃</span></h3>
        <Row label="Destination Acc. Title" value={destinationName} />
        <Row label="Destination Bank" value={topBank} />
        <Row label="Destination Acc. Number" value={shortAccount(destinationAccount)} />
        <Row label="Source Acc. Title" value={sourceName} />
        <Row label="Channel" value="Raast" />
      </section>

      <footer className="receipt-footer">
        <span>Received on</span>
        <LogoMark small />
        <b>NayaPay</b>
      </footer>
    </main>
  )
}

function historyDateLabel(value) {
  const transactionDate = new Date(value)
  if (Number.isNaN(transactionDate.getTime())) return value

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  transactionDate.setHours(0, 0, 0, 0)

  if (transactionDate.getTime() === today.getTime()) return 'Today'
  if (transactionDate.getTime() === yesterday.getTime()) return 'Yesterday'
  return transactionDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

function PaymentReview({ direction, draft, profile, onBack, onConfirm }) {
  const isReceived = direction === 'received'
  const topName = draft.name
  const topBank = normalizeBankName(draft.bank) || 'Easypaisa'
  const topAccount = draft.account
  const destinationName = isReceived ? profile.name : draft.name
  const sourceName = isReceived ? draft.name : profile.name
  const destinationAccount = isReceived ? profile.account : draft.account

  return (
    <main className="screen receipt-screen review-screen">
      <StatusBar />
      <Header title="Confirm Details" onBack={onBack} />

      <section className="receipt-hero">
        <div className="receipt-bank-logo"><BankLogo bank={topBank} /></div>
        <h2>{topName}</h2>
        <p>{topBank}-{topAccount.slice(-4)}</p>
        <strong>Rs. {money(draft.amount)}</strong>
      </section>

      <section className="amount-card">
        <Row label={isReceived ? 'Amount Received' : 'Amount Sent'} value={`Rs. ${money(draft.amount)}`} />
        <Row label="Service Fee (Incl. Tax)" value="Rs. 0" />
        <Row label="Total Amount" value={`Rs. ${money(draft.amount)}`} />
      </section>

      <section className="info-card">
        <h3>ADDITIONAL INFORMATION <span>⌃</span></h3>
        <Row label="Destination Acc. Title" value={destinationName} />
        <Row label="Destination Bank" value={topBank} />
        <Row label="Destination Acc. Number" value={shortAccount(destinationAccount)} />
        <Row label="Source Acc. Title" value={sourceName} />
        <Row label="Channel" value="Raast" />
      </section>

      <button className="primary-btn review-confirm-btn" type="button" onClick={onConfirm}>
        Confirm Rs. {money(draft.amount)}
        <Icon name={isReceived ? 'plus' : 'send'} />
      </button>
    </main>
  )
}

function PaymentLoading() {
  return (
    <main className="screen payment-loading-screen">
      <StatusBar />
      <section className="payment-loading-card">
        <div className="payment-loader">
          <LogoMark small />
        </div>
        <h2>Processing transfer</h2>
        <p>Please wait...</p>
      </section>
    </main>
  )
}

function PaymentHand({ src, className }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const image = new Image()
    image.onload = () => {
      const size = 360
      canvas.width = size
      canvas.height = size
      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (!context) return

      context.clearRect(0, 0, size, size)
      const scale = Math.min(size / image.naturalWidth, size / image.naturalHeight)
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale
      context.drawImage(image, (size - drawWidth) / 2, (size - drawHeight) / 2, drawWidth, drawHeight)
      const frame = context.getImageData(0, 0, size, size)
      const { data } = frame
      const visited = new Uint8Array(size * size)
      const queue = new Int32Array(size * size)
      let head = 0
      let tail = 0

      const isImageBackground = (position) => {
        const offset = position * 4
        const red = data[offset]
        const green = data[offset + 1]
        const blue = data[offset + 2]
        const brightness = (red + green + blue) / 3
        const chroma = Math.max(red, green, blue) - Math.min(red, green, blue)
        return chroma < 16 && brightness > 125
      }

      const addBackgroundPixel = (position) => {
        if (!visited[position] && isImageBackground(position)) {
          visited[position] = 1
          queue[tail] = position
          tail += 1
        }
      }

      for (let coordinate = 0; coordinate < size; coordinate += 1) {
        addBackgroundPixel(coordinate)
        addBackgroundPixel((size - 1) * size + coordinate)
        addBackgroundPixel(coordinate * size)
        addBackgroundPixel(coordinate * size + size - 1)
      }

      while (head < tail) {
        const position = queue[head]
        head += 1
        const x = position % size
        const y = Math.floor(position / size)
        if (x > 0) addBackgroundPixel(position - 1)
        if (x < size - 1) addBackgroundPixel(position + 1)
        if (y > 0) addBackgroundPixel(position - size)
        if (y < size - 1) addBackgroundPixel(position + size)
      }

      for (let position = 0; position < visited.length; position += 1) {
        if (visited[position]) data[position * 4 + 3] = 0
      }
      context.putImageData(frame, 0, 0)
    }
    image.src = src

    return () => {
      image.onload = null
    }
  }, [src])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}

function ClappingHands() {
  return (
    <div className="done-clap" aria-label="Celebration high-five">
      <PaymentHand src="/left.png" className="done-hand-layer done-hand-layer--left" />
      <PaymentHand src="/right.png" className="done-hand-layer done-hand-layer--right" />
      <span className="done-clap-impact" aria-hidden="true" />
    </div>
  )
}

function PaymentDone({ item, onBack, onViewDetails, onShare }) {
  const actionLabel = item.direction === 'received' ? 'Received from' : 'Paid to'
  const accountHint = `${item.bank}-${item.account.slice(-4)}`

  return (
    <main className="screen payment-done-screen">
      <StatusBar />
      <section className="payment-done-card">
        <h2>ALL DONE!</h2>
        <div className="done-illustration" aria-hidden="true">
          <span className="confetti confetti--one" />
          <span className="confetti confetti--two" />
          <span className="confetti confetti--three" />
          <span className="confetti confetti--four" />
          <ClappingHands />
          <svg className="done-hands" viewBox="0 0 180 122" role="img" aria-hidden="true">
            <defs>
              <linearGradient id="doneHandFill" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset=".46" stopColor="#f2efff" />
                <stop offset=".73" stopColor="#e6ddff" />
                <stop offset="1" stopColor="#ff5620" />
              </linearGradient>
              <linearGradient id="doneWristFill" x1="0" x2="1">
                <stop offset="0" stopColor="#2e2061" />
                <stop offset=".42" stopColor="#48337f" />
                <stop offset=".78" stopColor="#faf8ff" />
                <stop offset="1" stopColor="#ff5b21" />
              </linearGradient>
              <radialGradient id="donePalmGlow" cx=".4" cy=".25" r=".75">
                <stop offset="0" stopColor="#ffffff" stopOpacity=".95" />
                <stop offset=".62" stopColor="#ffffff" stopOpacity=".18" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g className="done-hand-svg done-hand-svg--left">
              <path className="done-finger" d="M55 25c-2.8-3.2-2.5-7.8.6-10.4 3.2-2.7 7.9-2.2 10.6 1l18.4 22.2-10.8 9.1z" />
              <path className="done-finger" d="M42 34.5c-2.8-3.2-2.5-7.8.6-10.4 3.2-2.7 7.8-2.2 10.5 1l21.8 26.1-10.8 9.1z" />
              <path className="done-finger" d="M30.7 45.5c-2.8-3.1-2.6-7.7.4-10.3 3.1-2.7 7.7-2.4 10.5.7L65 62.4l-10.5 9.4z" />
              <path className="done-finger" d="M21.8 59.2c-2.9-3-2.9-7.5 0-10.3s7.5-2.8 10.4.2L55 73.2l-10.1 9.7z" />
              <path className="done-palm" d="M44.2 88.2C29.5 73.9 24 59.2 31.7 51.5c5.9-5.9 14.1-1.9 21.9 5.3l15.5 14.3-1.3-28.7c-.3-5.4 3.4-9.5 8.3-9.7 5.2-.2 9.1 3.8 9.4 9.2l2.6 42.5c.5 8-1.7 14.7-6.8 19.9-9.6 9.7-23.7-3-37.1-16.1z" />
              <path className="done-palm-glow" d="M39 59c7-1 17 8 26 17 3 3 8 2 8-3l-1-29c3 12 5 28 4 39-1 8-7 11-14 8-9-3-19-13-25-22-3-5-2-9 2-10z" />
              <path className="done-crease" d="M52 58l20 22M43 68l19 19M35 77l16 16M73 49l3 36" />
              <path className="done-wrist" d="M28 85.5c12.7 10.5 30.1 19.2 45.5 20.8l-13.1 15.1c-17.8-2.9-33.2-11.1-45.1-23.3z" />
            </g>
            <g className="done-hand-svg done-hand-svg--right">
              <path className="done-finger" d="M55 25c-2.8-3.2-2.5-7.8.6-10.4 3.2-2.7 7.9-2.2 10.6 1l18.4 22.2-10.8 9.1z" />
              <path className="done-finger" d="M42 34.5c-2.8-3.2-2.5-7.8.6-10.4 3.2-2.7 7.8-2.2 10.5 1l21.8 26.1-10.8 9.1z" />
              <path className="done-finger" d="M30.7 45.5c-2.8-3.1-2.6-7.7.4-10.3 3.1-2.7 7.7-2.4 10.5.7L65 62.4l-10.5 9.4z" />
              <path className="done-finger" d="M21.8 59.2c-2.9-3-2.9-7.5 0-10.3s7.5-2.8 10.4.2L55 73.2l-10.1 9.7z" />
              <path className="done-palm" d="M44.2 88.2C29.5 73.9 24 59.2 31.7 51.5c5.9-5.9 14.1-1.9 21.9 5.3l15.5 14.3-1.3-28.7c-.3-5.4 3.4-9.5 8.3-9.7 5.2-.2 9.1 3.8 9.4 9.2l2.6 42.5c.5 8-1.7 14.7-6.8 19.9-9.6 9.7-23.7-3-37.1-16.1z" />
              <path className="done-palm-glow" d="M39 59c7-1 17 8 26 17 3 3 8 2 8-3l-1-29c3 12 5 28 4 39-1 8-7 11-14 8-9-3-19-13-25-22-3-5-2-9 2-10z" />
              <path className="done-crease" d="M52 58l20 22M43 68l19 19M35 77l16 16M73 49l3 36" />
              <path className="done-wrist" d="M28 85.5c12.7 10.5 30.1 19.2 45.5 20.8l-13.1 15.1c-17.8-2.9-33.2-11.1-45.1-23.3z" />
            </g>
          </svg>
        </div>
        <strong>Rs. {money(item.amount)}</strong>
        <span>{actionLabel}</span>
        <b>{item.name}</b>
        <small>{accountHint}</small>
        <button className="done-details-link" type="button" onClick={onViewDetails}>View Details</button>
      </section>

      <div className="done-powered">
        <span>Powered by</span>
        <img className="done-raast" src="/raast-logo.png" alt="Raast" />
      </div>

      <button className="view-details-button" type="button" onClick={() => onShare(item)}>
        Share receipt
      </button>
      <button className="done-close-button" type="button" onClick={onBack}>Close</button>
    </main>
  )
}

function Row({ label, value }) {
  return (
    <div className="row">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  )
}

function Notifications({ notifications, onBack, onOpen, onDelete, onMarkAllRead }) {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const longPressTimer = useRef(null)
  const longPressed = useRef(false)
  const notificationGroups = notifications.reduce((groups, notice) => {
    const key = notice.date || 'Today'
    const group = groups.find((item) => item.date === key)
    if (group) group.items.push(notice)
    else groups.push({ date: key, items: [notice] })
    return groups
  }, [])

  const clearLongPress = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const startLongPress = (notice) => {
    clearLongPress()
    longPressed.current = false
    longPressTimer.current = window.setTimeout(() => {
      longPressed.current = true
      setDeleteTarget(notice)
      longPressTimer.current = null
    }, 10000)
  }

  useEffect(() => () => clearLongPress(), [])

  return (
    <main className="screen notifications-screen">
      <StatusBar />
      <Header
        title="Notifications"
        onBack={onBack}
        right={notifications.some((item) => !item.read) ? <button className="notifications-read-all" type="button" onClick={onMarkAllRead}>Read all</button> : null}
      />
      <section className="notifications-list" aria-label="Payment notifications">
        {notifications.length > 0 && (
          <div className="notifications-intro">
            <span>System  activity</span>
            {/* <small>Press and hold a notification for 10 seconds to delete it.</small> */}
          </div>
        )}
        {notifications.length === 0 ? (
          <div className="notifications-empty">
            <span><Icon name="bell" /></span>
            <h2>No notifications yet</h2>
            <p>Your sent and received payment updates will appear here.</p>
          </div>
        ) : notificationGroups.map((group) => (
          <Fragment key={group.date}>
            <h2 className="notifications-date">{historyDateLabel(group.date)}</h2>
            {group.items.map((notice) => (
          <article className={`notification-row ${notice.read ? '' : 'notification-row--unread'}`} key={notice.id}>
            <button
              className="notification-open"
              type="button"
              onPointerDown={() => startLongPress(notice)}
              onPointerUp={clearLongPress}
              onPointerLeave={clearLongPress}
              onPointerCancel={clearLongPress}
              onContextMenu={(event) => event.preventDefault()}
              onClick={() => {
                if (longPressed.current) {
                  longPressed.current = false
                  return
                }
                onOpen(notice)
              }}
            >
              <div className="notification-logo"><BankLogo bank={notice.bank || 'NayaPay'} /></div>
              <div className="notification-copy">
                <b>{notice.title}</b>
                <p>{notice.message}</p>
              </div>
              <div className="notification-meta">
                <time>{notice.time || '—'}</time>
                <small>{notice.date || '—'}</small>
              </div>
              {!notice.read && <i className="notification-unread" aria-label="Unread" />}
            </button>
          </article>
            ))}
          </Fragment>
        ))}
      </section>
      {deleteTarget && (
        <div className="delete-dialog-backdrop" role="presentation">
          <section className="delete-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-notification-title">
            <h2 id="delete-notification-title">Delete notification?</h2>
            <p>This payment notification will be removed. The transaction history will remain unchanged.</p>
            <div>
              <button type="button" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button type="button" className="delete-dialog__confirm" onClick={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}>Delete</button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

function History({ transactions, profile, balance, showBalance, setShowBalance, onBack, onOpen, onNav, onDelete }) {
  const longPressTimer = useRef(null)
  const longPressed = useRef(false)
  const [deleteItem, setDeleteItem] = useState(null)
  const lastReceived = transactions.find((item) => item.direction === 'received')
  const lastSent = transactions.find((item) => item.direction !== 'received')
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date())

  const clearLongPress = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const startLongPress = (item) => {
    clearLongPress()
    longPressed.current = false
    longPressTimer.current = window.setTimeout(() => {
      longPressed.current = true
      longPressTimer.current = null
      setDeleteItem(item)
    }, 10000)
  }

  const openTransaction = (item) => {
    if (longPressed.current) {
      longPressed.current = false
      return
    }
    onOpen(item)
  }

  useEffect(() => () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current)
    }
  }, [])

  return (
    <main className="screen history-screen">
      <StatusBar />
      <header className="history-topbar">
        <button className="history-profile" type="button" onClick={onBack} aria-label="Back to home">
          {profile.photo?.startsWith('data:') ? <img src={profile.photo} alt="Profile" /> : (profile.photo || initials(profile.name))}
        </button>
        <button className="history-download" type="button" aria-label="Download history"><Icon name="copy" /></button>
      </header>
      <section className="history-balance">
        <span>Total Balance</span>
        <div>
          <b>{showBalance ? `Rs. ${money(balance)}` : 'Rs. ••••'}</b>
          <button
            className="history-visibility"
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            aria-label={showBalance ? 'Hide balance' : 'Show balance'}
            aria-pressed={showBalance}
          >
            <Icon name={showBalance ? 'eye-open' : 'eye'} />
          </button>
        </div>
      </section>
      <div className="history-divider" />
      <div className="history-month">{monthLabel}</div>
      <section className="activity-summary">
        <div className="activity-summary__incoming">
          <span><i aria-hidden="true">↘</i>Incoming</span>
          <b>Rs. {money(lastReceived?.amount)}</b>
        </div>
        <div className="activity-summary__outgoing">
          <span>Outgoing<i aria-hidden="true">↗</i></span>
          <b>Rs. {money(lastSent?.amount)}</b>
        </div>
      </section>
      <section className="history-list">
        {transactions.map((item, index) => {
          const previous = transactions[index - 1]
          const showDate = !previous || previous.date !== item.date
          return (
          <Fragment key={item.tid}>
            {showDate && <h2>{historyDateLabel(item.date)}</h2>}
          <button
            type="button"
            onClick={() => openTransaction(item)}
            onPointerDown={() => startLongPress(item)}
            onPointerUp={clearLongPress}
            onPointerLeave={clearLongPress}
            onPointerCancel={clearLongPress}
            onContextMenu={(event) => event.preventDefault()}
          >
            <BankLogo bank={item.bank} />
            <span className={item.direction === 'received' ? 'history-icon received' : 'history-icon sent'}>
              {item.direction === 'received' ? '+' : '→'}
            </span>
            <div>
              <b>{item.name}</b>
              <small>{item.bank}-{item.account.slice(-4)}</small>
              <em>{item.bank} • {shortAccount(item.account)}</em>
            </div>
            <aside>
              <time>{item.time}</time>
              <strong className={item.direction === 'received' ? 'received' : 'sent'}>
                {item.direction === 'received' ? '+' : '-'} Rs. {money(item.amount)}
              </strong>
            </aside>
          </button>
          </Fragment>
          )
        })}
        {transactions.length === 0 && <p className="empty">No transactions yet.</p>}
      </section>
      {deleteItem && (
        <div className="delete-dialog-backdrop" role="presentation">
          <section className="delete-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-transaction-title">
            <h2 id="delete-transaction-title">Delete transaction?</h2>
            <p>{deleteItem.direction === 'received' ? 'Amount Received' : 'Money Sent'} Rs. {money(deleteItem.amount)} will be removed from history.</p>
            <div>
              <button
                type="button"
                onClick={() => {
                  setDeleteItem(null)
                  longPressed.current = false
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(deleteItem.tid)
                  setDeleteItem(null)
                  longPressed.current = false
                }}
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
      <BottomNav active="transfer" onNav={onNav} />
    </main>
  )
}

function SimpleSection({ title, icon, onBack, onNav }) {
  const options = {
    chat: ['Messages', 'Payment requests', 'Support inbox'],
    card: ['Virtual card', 'Card controls', 'Recent card payments'],
    more: ['Profile', 'Limits', 'Invite friends', 'Settings'],
    quickpay: ['Scan to pay', 'Saved QR', 'Recent merchants'],
    bills: ['Electricity', 'Gas', 'Internet', 'Water'],
    merchant: ['Nearby merchants', 'Food', 'Shopping'],
    topup: ['Mobile balance', 'Data bundles', 'Saved numbers'],
    split: ['Create split', 'Pending splits', 'Settled splits'],
    gift: ['Send envelope', 'Received gifts', 'Saved templates'],
  }

  return (
    <main className="screen simple-screen">
      <StatusBar />
      <Header title={title} onBack={onBack} />
      <section className="simple-hero">
        <span><Icon name={icon} /></span>
        <h2>{title}</h2>
        <p>This section is connected and ready for UI expansion.</p>
      </section>
      <section className="simple-list">
        {(options[icon] || ['Option one', 'Option two', 'Option three']).map((item) => (
          <button type="button" key={item}>
            <b>{item}</b>
            <Icon name="send" />
          </button>
        ))}
      </section>
      <BottomNav active={icon === 'chat' || icon === 'card' ? icon : 'home'} onNav={onNav} />
    </main>
  )
}

function QrScanner({ favorites, onBack, onUse }) {
  const videoRef = useRef(null)
  const fileRef = useRef(null)
  const [scanning, setScanning] = useState(false)

  const handlePayload = useCallback((text) => {
    const parsed = parseQrPayload(text)
    if (!parsed?.account) {
      window.alert('No account number found in QR data.')
      return
    }
    const favorite = findFavorite(favorites, parsed.account)
    onUse({
      ...parsed,
      name: favorite?.name || parsed.name,
      bank: favorite?.bank || normalizeBankName(parsed.bank),
      amount: '',
    })
  }, [favorites, onUse])

  useEffect(() => {
    if (!scanning) return undefined
    let stream
    let cancelled = false

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        window.alert('Camera is not available here. Please upload a QR image.')
        setScanning(false)
        return
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (!videoRef.current) return
        videoRef.current.srcObject = stream
        await videoRef.current.play()

        const scan = async () => {
          if (cancelled || !videoRef.current) return
          try {
            const rawValue = await decodeQrFromBitmap(videoRef.current)
            if (rawValue) {
              handlePayload(rawValue)
              return
            }
          } catch {
            // Keep scanning quietly while the camera is active.
          }
          window.setTimeout(scan, 600)
        }
        scan()
      } catch {
        window.alert('Camera permission not available. Please upload a QR image.')
        setScanning(false)
      }
    }

    startCamera()
    return () => {
      cancelled = true
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [handlePayload, scanning])

  const readFile = async (file) => {
    if (!file) return
    try {
      const bitmap = await createImageBitmap(file)
      const rawValue = await decodeQrFromBitmap(bitmap)
      bitmap.close?.()
      if (rawValue) {
        handlePayload(rawValue)
      } else {
        window.alert('No QR found in selected image.')
      }
    } catch {
      window.alert('Could not read this QR image.')
    }
  }

  return (
    <main className="screen qr-screen">
      <StatusBar />
      <Header title="Scan QR" onBack={onBack} />
      <section className={`qr-camera ${scanning ? 'qr-camera--active' : ''}`}>
        {scanning ? (
          <video ref={videoRef} playsInline muted />
        ) : (
          <div className="qr-placeholder">
            <Icon name="scan" />
            <b>QR Scanner</b>
          </div>
        )}
        <div className="qr-frame" />
      </section>
      <section className="qr-card">
        <button type="button" onClick={() => fileRef.current?.click()}>Upload QR</button>
        <input ref={fileRef} type="file" accept="image/*" onChange={(event) => readFile(event.target.files?.[0])} hidden />
        <button type="button" onClick={() => setScanning(true)}>Scan QR Code</button>
      </section>
    </main>
  )
}

function FavoritesManager({ favorites, onBack, onNav, onSave, onDelete }) {
  const emptyDraft = { name: '', bank: banks[0], account: '' }
  const [draft, setDraft] = useState(emptyDraft)
  const [editingId, setEditingId] = useState(null)

  const editFavorite = (favorite) => {
    setEditingId(favorite.id)
    setDraft({ name: favorite.name, bank: favorite.bank, account: favorite.account })
  }

  const save = () => {
    if (!draft.name.trim() || !draft.account.trim()) return
    onSave({ ...draft, id: editingId || `fav-${Date.now()}` })
    setDraft(emptyDraft)
    setEditingId(null)
  }

  return (
    <main className="screen favorites-screen">
      <StatusBar />
      <Header title="Cards" onBack={onBack} />
      <section className="favorites-card">
        <h2>Favorite Accounts</h2>
        <p>Saved accounts auto-fill name and bank when the same account or QR is used.</p>
        <div className="favorite-form">
          <label>
            <span>Name</span>
            <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          </label>
          <label>
            <span>Bank</span>
            <div className="select-with-logo">
              <BankLogo bank={draft.bank} />
              <select value={draft.bank} onChange={(event) => setDraft({ ...draft, bank: event.target.value })}>
                {banks.map((bank) => <option key={bank}>{bank}</option>)}
              </select>
            </div>
          </label>
          <label>
            <span>Account / IBAN</span>
            <input value={draft.account} onChange={(event) => setDraft({ ...draft, account: event.target.value })} />
          </label>
          <button type="button" onClick={save}>{editingId ? 'Update Favorite' : 'Add Favorite'}</button>
        </div>
      </section>

      <section className="favorite-list">
        {favorites.map((favorite) => (
          <article key={favorite.id}>
            <BankLogo bank={favorite.bank} />
            <div>
              <b>{favorite.name}</b>
              <span>{favorite.bank} • {shortAccount(favorite.account)}</span>
            </div>
            <button type="button" onClick={() => editFavorite(favorite)}>Edit</button>
            <button type="button" onClick={() => onDelete(favorite.id)}>Delete</button>
          </article>
        ))}
      </section>
      <BottomNav active="card" onNav={onNav} />
    </main>
  )
}

function Profile({ profile, balance, onBack, onHistory, onNav, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const photoInputRef = useRef(null)

  const uploadPhoto = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      window.alert('Please choose an image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      window.alert('Please choose an image smaller than 2 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setDraft((value) => ({ ...value, photo: String(reader.result) }))
    reader.readAsDataURL(file)
  }

  const saveProfile = () => {
    const cleanName = draft.name.trim() || profile.name
    const cleanPhone = draft.phone.replace(/[^\d+]/g, '') || profile.phone
    const cleanEmail = draft.email.trim() || profile.email
    onSave({
      ...profile,
      ...draft,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      handle: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '') || profile.handle,
      photo: draft.photo?.startsWith('data:') ? draft.photo : initials(cleanName),
    })
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(profile)
    setEditing(false)
  }

  return (
    <main className="screen profile-screen">
      <StatusBar />
      <Header title="Profile" onBack={onBack} />

      <section className="profile-card">
        <div className="profile-photo">
          {profile.photo?.startsWith('data:') ? <img src={profile.photo} alt={`${profile.name} profile`} /> : (profile.photo || initials(profile.name))}
        </div>
        <h2>{profile.name}</h2>
        <p>@{profile.handle}</p>
        <small>{profile.phone} • {profile.email}</small>
        <div className="profile-balance">
          <span>Wallet balance</span>
          <b>Rs. {money(balance)}</b>
        </div>
      </section>

      <section className="profile-details">
        <Row label="Account title" value={profile.name} />
        <Row label="Mobile number" value={profile.phone} />
        <Row label="Email" value={profile.email} />
        <Row label="Raast ID / IBAN" value={shortAccount(profile.account)} />
        <Row label="Account status" value="Active" />
      </section>

      <section className="profile-edit-card">
        <div className="profile-edit-head">
          <div>
            <b>Edit profile</b>
            <span>Saved info updates the whole app UI</span>
          </div>
          {!editing && <button type="button" onClick={() => setEditing(true)}>Edit</button>}
        </div>

        {editing && (
          <div className="profile-edit-form">
            <div className="profile-photo-upload">
              <div className="profile-photo profile-photo--preview">
                {draft.photo?.startsWith('data:') ? <img src={draft.photo} alt="Profile preview" /> : (draft.photo || initials(draft.name || profile.name))}
              </div>
              <div>
                <b>Profile photo</b>
                <span>JPG or PNG, maximum 2 MB</span>
                <button type="button" onClick={() => photoInputRef.current?.click()}>Upload photo</button>
                <input ref={photoInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadPhoto(event.target.files?.[0])} hidden />
              </div>
            </div>
            <label>
              <span>Name</span>
              <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
            </label>
            <label>
              <span>Mobile number</span>
              <input inputMode="tel" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
            </label>
            <div className="profile-edit-buttons">
              <button type="button" onClick={cancelEdit}>Cancel</button>
              <button type="button" onClick={saveProfile}>Save</button>
            </div>
          </div>
        )}
      </section>

      <section className="profile-actions">
        <button type="button" onClick={onHistory}>
          <span><Icon name="transfer" /></span>
          <div>
            <b>Transaction History</b>
            <small>View sent and received money</small>
          </div>
          <Icon name="send" />
        </button>
        <button type="button" onClick={() => onNav('card')}>
          <span><Icon name="card" /></span>
          <div>
            <b>Cards</b>
            <small>Manage virtual card</small>
          </div>
          <Icon name="send" />
        </button>
        <button type="button" onClick={() => onNav('more')}>
          <span><Icon name="more" /></span>
          <div>
            <b>Settings</b>
            <small>Limits, security and preferences</small>
          </div>
          <Icon name="send" />
        </button>
      </section>

      <BottomNav active="home" onNav={onNav} />
    </main>
  )
}

function Settings({ theme, onThemeChange, onBack, onNav, onSend }) {
  return (
    <main className="screen settings-screen">
      <StatusBar />
      <Header title="Settings" onBack={onBack} />
      <section className="settings-card">
        <div>
          <b>Appearance</b>
          <span>Choose a theme for the whole app.</span>
        </div>
        <div className="theme-options" role="group" aria-label="Choose app theme">
          <button className={theme === 'light' ? 'active' : ''} type="button" onClick={() => onThemeChange('light')}>
            <span className="theme-swatch theme-swatch--light" />Light
          </button>
          <button className={theme === 'dark' ? 'active' : ''} type="button" onClick={() => onThemeChange('dark')}>
            <span className="theme-swatch theme-swatch--dark" />Dark
          </button>
        </div>
      </section>
      <section className="settings-card settings-send-card">
        <div>
          <b>Send Money</b>
          <span>Transfer using a bank and account number.</span>
        </div>
        <button type="button" onClick={onSend}>
          <span><Icon name="send" /></span>
          Send Money
          <Icon name="send" />
        </button>
      </section>
      <BottomNav active="home" onNav={onNav} />
    </main>
  )
}

function LaunchScreen() {
  return (
    <main className="screen launch-screen">
      <StatusBar />
      <section>
        <div className="launch-logo-wrap">
          <LogoMark />
        </div>
        <h1>NayaPay</h1>
      </section>
    </main>
  )
}

function App() {
  const [savedState] = useState(loadAppState)
  const [profile, setProfile] = useState(savedState.profile)
  const [balance, setBalance] = useState(savedState.balance)
  const [showBalance, setShowBalance] = useState(false)
  const [launching, setLaunching] = useState(true)
  const [screen, setScreen] = useState('home')
  const [selected, setSelected] = useState(null)
  const [pendingDraft, setPendingDraft] = useState(null)
  const [sendReturnScreen, setSendReturnScreen] = useState('home')
  const [amountReturnScreen, setAmountReturnScreen] = useState('send')
  const [pendingDirection, setPendingDirection] = useState('sent')
  const [receiptIntro, setReceiptIntro] = useState(false)
  const [shareOnReceiptOpen, setShareOnReceiptOpen] = useState(false)
  const paymentTimerRef = useRef(null)
  const screenRef = useRef('home')
  const paymentCompletedRef = useRef(false)
  const [favorites, setFavorites] = useState(savedState.favorites)
  const [transactions, setTransactions] = useState(savedState.transactions)
  const [notifications, setNotifications] = useState(savedState.notifications)
  const [theme, setTheme] = useState(savedState.theme)

  const currentReceipt = useMemo(() => selected || transactions[0], [selected, transactions])

  const navigate = useCallback((nextScreen) => {
    screenRef.current = nextScreen
    setScreen(nextScreen)
    if (window.history.state?.screen !== nextScreen) {
      window.history.pushState({ screen: nextScreen }, '', `#${nextScreen}`)
    }
  }, [])

  const replaceScreen = useCallback((nextScreen) => {
    screenRef.current = nextScreen
    setScreen(nextScreen)
    window.history.replaceState({ screen: nextScreen }, '', `#${nextScreen}`)
  }, [])

  const goHome = useCallback(() => {
    if (paymentTimerRef.current) {
      window.clearTimeout(paymentTimerRef.current)
      paymentTimerRef.current = null
    }
    setPendingDraft(null)
    setReceiptIntro(false)
    paymentCompletedRef.current = false
    replaceScreen('home')
  }, [replaceScreen])

  useEffect(() => {
    const timer = window.setTimeout(() => setLaunching(false), 1800)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => () => {
    if (paymentTimerRef.current) {
      window.clearTimeout(paymentTimerRef.current)
    }
  }, [])

  useEffect(() => {
    saveAppState({ profile, balance, favorites, transactions, notifications, theme })
  }, [profile, balance, favorites, transactions, notifications, theme])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (!window.history.state?.screen) {
      window.history.replaceState({ screen: 'home' }, '', '#home')
    }

    const handlePopState = (event) => {
      if (paymentCompletedRef.current && ['processing', 'done', 'receipt'].includes(screenRef.current)) {
        if (paymentTimerRef.current) {
          window.clearTimeout(paymentTimerRef.current)
          paymentTimerRef.current = null
        }
        paymentCompletedRef.current = false
        setPendingDraft(null)
        setReceiptIntro(false)
        replaceScreen('home')
        return
      }
      const previousScreen = event.state?.screen || 'home'
      screenRef.current = previousScreen
      setScreen(previousScreen)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [replaceScreen])

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined

    let listener
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      const currentScreen = screenRef.current
      if (currentScreen === 'home') {
        CapacitorApp.minimizeApp()
        return
      }
      if (paymentCompletedRef.current || currentScreen === 'processing' || currentScreen === 'done') {
        goHome()
        return
      }
      if (canGoBack) {
        window.history.back()
        return
      }
      goHome()
    }).then((handle) => {
      listener = handle
    })

    return () => {
      listener?.remove()
    }
  }, [goHome])

  const saveFavorite = (favorite) => {
    setFavorites((list) => {
      const clean = normalizeAccount(favorite.account)
      const exists = list.some((item) => item.id === favorite.id || normalizeAccount(item.account) === clean)
      if (exists) {
        return list.map((item) => (
          item.id === favorite.id || normalizeAccount(item.account) === clean
            ? { ...item, ...favorite, id: item.id }
            : item
        ))
      }
      return [{ ...favorite, id: favorite.id || `fav-${Date.now()}` }, ...list]
    })
  }

  const openNav = (target) => {
    if (target === 'home') {
      goHome()
      return
    }
    if (target === 'transfer') {
      navigate('history')
      return
    }
    if (target === 'chat' || target === 'card') {
      navigate(target)
      return
    }
    if (target === 'quickpay') {
      navigate('qr')
      return
    }
    navigate(target)
  }

  const startSend = (returnScreen = 'home') => {
    paymentCompletedRef.current = false
    setPendingDraft(null)
    setSendReturnScreen(returnScreen)
    navigate('send')
  }

  const validatePaymentDraft = (direction, draft) => {
    const amount = Number(draft.amount || 0)
    if (!draft.bank || !draft.account?.trim() || (direction === 'received' && !draft.name?.trim())) {
      window.alert(direction === 'sent'
        ? 'Please select a bank and enter an account number.'
        : 'Please fill account name, bank and account number.')
      return false
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      window.alert('Please enter a whole-rupee amount greater than zero.')
      return false
    }
    if (direction === 'received' && !profileMatches(profile, draft.targetAccount)) {
      window.alert('Linked account number does not match your profile account.')
      return false
    }
    if (direction === 'sent' && amount > balance) {
      window.alert('Insufficient balance for this transfer.')
      return false
    }
    return true
  }

  const openPaymentReview = (direction, draft) => {
    if (!validatePaymentDraft(direction, draft)) return
    setPendingDraft(draft)
    setPendingDirection(direction)
    navigate('review')
  }

  const addTransaction = (direction, draft) => {
    const amount = Number(draft.amount || 0)
    if (!validatePaymentDraft(direction, draft)) return
    const stamp = nowStamp()
    const item = {
      direction,
      name: draft.name || 'Saved User',
      bank: normalizeBankName(draft.bank),
      account: draft.account,
      amount,
      tid: generateTid(),
      ...stamp,
    }
    saveFavorite({
      id: findFavorite(favorites, draft.account)?.id || `fav-${Date.now()}`,
      name: item.name,
      bank: item.bank,
      account: item.account,
    })
    setTransactions((list) => [item, ...list])
    setNotifications((list) => [{
      id: `notice-${item.tid}`,
      tid: item.tid,
      bank: item.bank,
      read: false,
      createdAt: new Date().toISOString(),
      date: item.date,
      time: item.time,
      direction,
      amount,
      title: direction === 'received' ? 'Money received' : 'Money sent',
      message: direction === 'received'
        ? `Rs. ${money(amount)} received from ${item.name}`
        : `Rs. ${money(amount)} sent to ${item.name}`,
    }, ...list])
    setBalance((value) => direction === 'received' ? value + amount : Math.max(0, value - amount))
    setSelected(item)
    setPendingDraft(null)
    setReceiptIntro(false)
    paymentCompletedRef.current = true
    navigate('processing')
    if (paymentTimerRef.current) {
      window.clearTimeout(paymentTimerRef.current)
    }
    paymentTimerRef.current = window.setTimeout(() => {
      paymentTimerRef.current = null
      replaceScreen('done')
    }, 5000)
  }

  if (launching) {
    return <LaunchScreen />
  }

  if (screen === 'add') {
    return <MoneyForm type="receive" profile={profile} favorites={favorites} initialDraft={pendingDraft} onBack={goHome} onSubmit={(draft) => openPaymentReview('received', draft)} onScan={() => navigate('qr')} />
  }

  if (screen === 'send') {
    return <MoneyForm type="send" profile={profile} favorites={favorites} initialDraft={pendingDraft} onBack={() => navigate(sendReturnScreen)} onSubmit={(draft) => { setPendingDraft({ ...draft, amount: '' }); setAmountReturnScreen('send'); navigate('scanned-amount') }} onScan={() => navigate('qr')} showRecipientName={sendReturnScreen === 'home'} />
  }

  if (screen === 'history') {
    return (
      <History
        transactions={transactions}
        profile={profile}
        balance={balance}
        showBalance={showBalance}
        setShowBalance={setShowBalance}
        onBack={goHome}
        onOpen={(item) => { setReceiptIntro(false); setSelected(item); navigate('receipt') }}
        onDelete={(tid) => {
          setTransactions((list) => list.filter((item) => item.tid !== tid))
          setSelected((item) => item?.tid === tid ? null : item)
        }}
        onNav={openNav}
      />
    )
  }

  if (screen === 'notifications') {
    return (
      <Notifications
        notifications={notifications}
        onBack={goHome}
        onMarkAllRead={() => setNotifications((list) => list.map((item) => ({ ...item, read: true })))}
        onDelete={(id) => setNotifications((list) => list.filter((item) => item.id !== id))}
        onOpen={(notice) => {
          setNotifications((list) => list.map((item) => item.id === notice.id ? { ...item, read: true } : item))
          const transaction = transactions.find((item) => item.tid === notice.tid)
          if (transaction) {
            setReceiptIntro(false)
            setSelected(transaction)
            navigate('receipt')
          }
        }}
      />
    )
  }

  if (screen === 'review' && pendingDraft) {
    return (
      <PaymentReview
        direction={pendingDirection}
        draft={pendingDraft}
        profile={profile}
        onBack={() => navigate(pendingDirection === 'received' ? 'add' : 'send')}
        onConfirm={() => addTransaction(pendingDirection, pendingDraft)}
      />
    )
  }

  if (screen === 'processing') {
    return <PaymentLoading />
  }

  if (screen === 'done' && currentReceipt) {
    return (
      <PaymentDone
        item={currentReceipt}
        onBack={goHome}
        onViewDetails={() => {
          setReceiptIntro(true)
          navigate('receipt')
        }}
        onShare={() => {
          setReceiptIntro(false)
          setShareOnReceiptOpen(true)
          navigate('receipt')
        }}
      />
    )
  }

  if (screen === 'receipt' && currentReceipt) {
    return <Receipt item={currentReceipt} profile={profile} onBack={goHome} onShare={shareReceipt} autoShare={shareOnReceiptOpen} onAutoShared={() => setShareOnReceiptOpen(false)} animate={receiptIntro} />
  }

  if (screen === 'qr') {
    return <QrScanner favorites={favorites} onBack={goHome} onUse={(draft) => { setPendingDraft(draft); setAmountReturnScreen('qr'); navigate('scanned-amount') }} />
  }

  if (screen === 'scanned-amount' && pendingDraft) {
    return (
      <ScannedAccountAmount
        draft={pendingDraft}
        balance={balance}
        onBack={() => navigate(amountReturnScreen)}
        onNext={(draft) => openPaymentReview('sent', draft)}
      />
    )
  }

  if (screen === 'card') {
    return <FavoritesManager favorites={favorites} onBack={goHome} onNav={openNav} onSave={saveFavorite} onDelete={(id) => setFavorites((list) => list.filter((item) => item.id !== id))} />
  }

  if (screen === 'profile') {
    return <Profile profile={profile} balance={balance} onBack={goHome} onHistory={() => navigate('history')} onNav={openNav} onSave={setProfile} />
  }

  if (screen === 'more') {
    return <Settings theme={theme} onThemeChange={setTheme} onBack={() => navigate('profile')} onNav={openNav} onSend={() => startSend('more')} />
  }

  if (screen !== 'home') {
    const labels = {
      chat: 'Messages',
      card: 'Cards',
      quickpay: 'QuickPay',
      bills: 'Bills',
      merchant: 'Merchants',
      topup: 'Mobile Top-Up',
      split: 'Bill Split',
      gift: 'Gift Envelope',
    }

    return <SimpleSection title={labels[screen] || 'Section'} icon={screen} onBack={goHome} onNav={openNav} />
  }

  return (
    <Home
      profile={profile}
      balance={balance}
      showBalance={showBalance}
      setShowBalance={setShowBalance}
      onAdd={() => navigate('add')}
      onSend={() => startSend('home')}
      onProfile={() => navigate('profile')}
      onReceipt={(item) => { setReceiptIntro(false); setSelected(item); navigate('receipt') }}
      onNav={openNav}
      onQr={() => navigate('qr')}
      transactions={transactions}
      unreadNotifications={notifications.filter((item) => !item.read).length}
      onNotifications={() => navigate('notifications')}
    />
  )
}

export default App
