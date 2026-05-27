import Papa from 'papaparse'
import * as XLSX from 'xlsx'

const dashboardSheetKeys = [
  'funnelStages',
  'monthlyTrend',
  'sourceMix',
  'countryData',
  'countryTrend',
  'visaTrend',
  'counselors',
  'counselorTrend',
  'counselorRadar',
  'dropOffReasons',
  'studentSegments',
  'recentActivity',
  'quickInsights',
]

const toSheetKey = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')

const normalizeCellValue = (value) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return value
  const trimmed = String(value).trim()
  if (!trimmed) return ''
  const maybeNumber = Number(trimmed.replace(/[%₹,$\s]/g, ''))
  return Number.isFinite(maybeNumber) && /^[-+]?[\d,.₹$%\s]+$/.test(trimmed) ? maybeNumber : trimmed
}

const cleanRows = (rows) =>
  rows
    .map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [String(key).trim(), normalizeCellValue(value)]),
      ),
    )
    .filter((row) => Object.values(row).some((value) => String(value || '').trim()))

export const parseCsvFile = (file) =>
  new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (result) => {
        if (result.errors?.length) {
          reject(new Error(result.errors[0].message))
          return
        }
        resolve(cleanRows(result.data))
      },
      error: (error) => reject(error),
    })
  })

export const parseExcelFile = async (file) => {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const normalizedSheetMap = Object.fromEntries(workbook.SheetNames.map((name) => [toSheetKey(name), name]))

  const dashboardData = {}
  dashboardSheetKeys.forEach((key) => {
    const matchingSheetName = normalizedSheetMap[toSheetKey(key)]
    if (matchingSheetName) {
      dashboardData[key] = cleanRows(XLSX.utils.sheet_to_json(workbook.Sheets[matchingSheetName], { defval: '' }))
    }
  })

  if (Object.keys(dashboardData).length) {
    const firstRows = dashboardData[Object.keys(dashboardData)[0]] || []
    return {
      type: 'dashboardWorkbook',
      dashboardData,
      previewRows: firstRows,
    }
  }

  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  return {
    type: 'operationalRows',
    rows: cleanRows(XLSX.utils.sheet_to_json(firstSheet, { defval: '' })),
  }
}

export const getGoogleSheetCsvUrl = (url, sheetName = 'Sheet1') => {
  const trimmedUrl = String(url || '').trim()
  if (!trimmedUrl) {
    throw new Error('Paste a public Google Sheets URL first.')
  }

  if (trimmedUrl.endsWith('.csv') || trimmedUrl.includes('tqx=out:csv') || trimmedUrl.includes('output=csv')) {
    return trimmedUrl
  }

  const idMatch = trimmedUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (!idMatch) {
    throw new Error('Use a Google Sheets link or a direct public CSV URL.')
  }

  const sheetParam = sheetName ? `&sheet=${encodeURIComponent(sheetName)}` : ''
  return `https://docs.google.com/spreadsheets/d/${idMatch[1]}/gviz/tq?tqx=out:csv${sheetParam}`
}

export const fetchGoogleSheetRows = async (url, sheetName) => {
  const csvUrl = getGoogleSheetCsvUrl(url, sheetName)
  const response = await fetch(csvUrl)
  if (!response.ok) {
    throw new Error('Could not fetch the Google Sheet. Check sharing settings and sheet name.')
  }

  const csvText = await response.text()
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  })

  if (result.errors?.length) {
    throw new Error(result.errors[0].message)
  }

  return cleanRows(result.data)
}
