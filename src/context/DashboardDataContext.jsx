import { useState } from 'react'
import baseMockData from '../data/mockData.json'
import { buildDashboardData, createPreviewRows, normalizeDashboardDataset, normalizeOperationalRows } from '../utils/dataTransformer'
import { fetchGoogleSheetRows, parseCsvFile, parseExcelFile } from '../utils/fileParsers'
import { DashboardDataContext } from './dashboardDataContextObject'

const initialSource = {
  type: 'Mock data',
  name: 'src/data/mockData.json',
  rowCount: 0,
  updatedAt: new Date().toLocaleString(),
}

export function DashboardDataProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(() => buildDashboardData(baseMockData))
  const [previewRows, setPreviewRows] = useState([])
  const [source, setSource] = useState(initialSource)
  const [message, setMessage] = useState({
    type: 'info',
    text: 'Using built-in mock data. Upload CSV/XLSX or sync Google Sheets to replace it.',
  })
  const [savedSheet, setSavedSheet] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const applyOperationalRows = (rows, meta) => {
    const normalized = normalizeOperationalRows(rows, baseMockData)
    setDashboardData(normalized)
    setPreviewRows(createPreviewRows(rows))
    setSource({
      type: meta.type,
      name: meta.name,
      rowCount: rows.length,
      updatedAt: new Date().toLocaleString(),
    })
    setMessage({
      type: 'success',
      text: `${meta.name} loaded successfully. Charts and KPI cards now use ${rows.length} uploaded rows.`,
    })
  }

  const applyDashboardWorkbook = (partialData, rows, meta) => {
    const normalized = normalizeDashboardDataset(partialData, baseMockData)
    setDashboardData(normalized)
    setPreviewRows(createPreviewRows(rows))
    setSource({
      type: meta.type,
      name: meta.name,
      rowCount: rows.length,
      updatedAt: new Date().toLocaleString(),
    })
    setMessage({
      type: 'success',
      text: `${meta.name} matched the dashboard workbook format and updated the analytics.`,
    })
  }

  const uploadFile = async (file) => {
    if (!file) return

    setIsLoading(true)
    try {
      const extension = file.name.split('.').pop().toLowerCase()
      if (extension === 'csv') {
        const rows = await parseCsvFile(file)
        applyOperationalRows(rows, { type: 'CSV upload', name: file.name })
      } else if (['xlsx', 'xls'].includes(extension)) {
        const parsed = await parseExcelFile(file)
        if (parsed.type === 'dashboardWorkbook') {
          applyDashboardWorkbook(parsed.dashboardData, parsed.previewRows, {
            type: 'Excel workbook',
            name: file.name,
          })
        } else {
          applyOperationalRows(parsed.rows, { type: 'Excel upload', name: file.name })
        }
      } else {
        throw new Error('Upload a .csv, .xlsx, or .xls file.')
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const syncGoogleSheet = async (url, sheetName = 'Sheet1') => {
    setIsLoading(true)
    try {
      const rows = await fetchGoogleSheetRows(url, sheetName)
      applyOperationalRows(rows, {
        type: 'Google Sheets',
        name: sheetName ? `${sheetName} tab` : 'Public sheet',
      })
      setSavedSheet({ url, sheetName })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSavedSheet = async () => {
    if (!savedSheet) {
      setMessage({ type: 'error', text: 'Sync a Google Sheet once before using Refresh Data.' })
      return
    }
    await syncGoogleSheet(savedSheet.url, savedSheet.sheetName)
  }

  const resetToMockData = () => {
    setDashboardData(buildDashboardData(baseMockData))
    setPreviewRows([])
    setSource({
      ...initialSource,
      updatedAt: new Date().toLocaleString(),
    })
    setMessage({ type: 'info', text: 'Dashboard reset to built-in mock data.' })
  }

  const value = {
    ...dashboardData,
    previewRows,
    source,
    message,
    isLoading,
    hasSheetConnection: Boolean(savedSheet),
    uploadFile,
    syncGoogleSheet,
    refreshSavedSheet,
    resetToMockData,
  }

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>
}
