import { useRef, useState } from 'react'
import clsx from 'clsx'
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Link2,
  RefreshCw,
  RotateCcw,
  Table2,
  UploadCloud,
} from 'lucide-react'
import { useDashboardData } from '../context/useDashboardData'
import ChartCard from './ChartCard'

const sampleColumns = [
  'student_id',
  'month',
  'country',
  'counselor',
  'source',
  'segment',
  'stage',
  'drop_off_reason',
]

function DataPreviewTable({ rows }) {
  const previewRows = rows.length
    ? rows
    : [
        {
          student_id: 'S101',
          month: 'Jan',
          country: 'United States',
          counselor: 'Aisha Mehta',
          source: 'Webinars',
          segment: 'Masters STEM',
          stage: 'Applications Submitted',
          drop_off_reason: 'Timing',
        },
      ]

  const columns = rows.length ? Object.keys(previewRows[0] || {}).slice(0, 8) : sampleColumns

  return (
    <div className="overflow-x-auto rounded-lg border border-line/70 bg-white/70">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-slate-50/80 text-xs uppercase tracking-[0.12em] text-muted">
            {columns.map((column) => (
              <th key={column} className="px-3 py-3 font-bold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {previewRows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${Object.values(row).join('-')}`} className="border-b border-line/60 last:border-0">
              {columns.map((column) => (
                <td key={column} className="max-w-[190px] truncate px-3 py-3 text-muted">
                  {String(row[column] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DataUploadPanel() {
  const {
    uploadFile,
    syncGoogleSheet,
    refreshSavedSheet,
    resetToMockData,
    previewRows,
    source,
    message,
    isLoading,
    hasSheetConnection,
  } = useDashboardData()
  const [isDragging, setIsDragging] = useState(false)
  const [sheetUrl, setSheetUrl] = useState('')
  const [sheetName, setSheetName] = useState('Sheet1')
  const fileInputRef = useRef(null)

  const handleFiles = (files) => {
    const file = files?.[0]
    if (file) uploadFile(file)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    handleFiles(event.dataTransfer.files)
  }

  const handleSheetSync = () => {
    syncGoogleSheet(sheetUrl, sheetName)
  }

  return (
    <ChartCard
      title="Excel, CSV, and Google Sheets data sync"
      subtitle="Upload operational student rows or connect a public Google Sheet. The dashboard will normalize the data into the existing charts and KPI cards."
      className="mt-5"
    >
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div
            className={clsx(
              'rounded-lg border-2 border-dashed p-5 transition',
              isDragging ? 'border-ocean bg-ocean/10' : 'border-line bg-white/70',
            )}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-lg bg-ocean/10 text-ocean">
                <UploadCloud className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-ink">Drop CSV or Excel here</h3>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Supports student-level CSV files and .xlsx workbooks. Columns like country,
                  counselor, month, stage, source, and segment map into the dashboard.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={(event) => handleFiles(event.target.files)}
              />
              <button
                className="focus-ring inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white shadow-soft"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Choose file
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-line/70 bg-white/70 p-4">
            <div className="mb-3 flex items-center gap-2 font-bold text-ink">
              <Link2 className="h-4 w-4 text-ocean" />
              Google Sheets sync
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_130px]">
              <input
                className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-muted"
                placeholder="Paste public Google Sheets URL"
                value={sheetUrl}
                onChange={(event) => setSheetUrl(event.target.value)}
              />
              <input
                className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink"
                placeholder="Sheet1"
                value={sheetName}
                onChange={(event) => setSheetName(event.target.value)}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="focus-ring inline-flex items-center gap-2 rounded-lg bg-ocean px-3 py-2 text-sm font-bold text-white"
                onClick={handleSheetSync}
                disabled={isLoading}
              >
                <Link2 className="h-4 w-4" />
                Sync Google Sheet
              </button>
              <button
                className="focus-ring inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-ink"
                onClick={refreshSavedSheet}
                disabled={isLoading || !hasSheetConnection}
              >
                <RefreshCw className={clsx('h-4 w-4', isLoading && 'animate-spin')} />
                Refresh Data
              </button>
              <button
                className="focus-ring inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-muted"
                onClick={resetToMockData}
                disabled={isLoading}
              >
                <RotateCcw className="h-4 w-4" />
                Reset mock data
              </button>
            </div>
          </div>

          <div
            className={clsx(
              'flex items-start gap-3 rounded-lg border p-3 text-sm',
              message.type === 'success'
                ? 'border-teal/20 bg-teal/10 text-teal'
                : message.type === 'error'
                  ? 'border-coral/20 bg-coral/10 text-coral'
                  : 'border-ocean/20 bg-ocean/10 text-ocean',
            )}
          >
            {message.type === 'error' ? <AlertCircle className="mt-0.5 h-4 w-4" /> : <CheckCircle2 className="mt-0.5 h-4 w-4" />}
            <p className="leading-6">{message.text}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-line/70 bg-white/70 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Source</p>
              <p className="mt-1 truncate font-extrabold text-ink">{source.type}</p>
            </div>
            <div className="rounded-lg border border-line/70 bg-white/70 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Rows</p>
              <p className="mt-1 font-extrabold text-ink">{source.rowCount || 'Mock'}</p>
            </div>
            <div className="rounded-lg border border-line/70 bg-white/70 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Updated</p>
              <p className="mt-1 truncate font-extrabold text-ink">{source.updatedAt}</p>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-bold text-ink">
                <Table2 className="h-4 w-4 text-ocean" />
                {previewRows.length ? 'Uploaded data preview' : 'Expected row format'}
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-muted">
                {previewRows.length ? `${previewRows.length} preview rows` : 'sample columns'}
              </span>
            </div>
            <DataPreviewTable rows={previewRows} />
          </div>
        </div>
      </div>
    </ChartCard>
  )
}

export default DataUploadPanel
