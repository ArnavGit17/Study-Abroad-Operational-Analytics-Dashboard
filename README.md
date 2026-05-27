# Study Abroad Operational Analytics Dashboard

The dashboard tracks the student funnel:

`Lead Generated -> Counseling -> Applications Submitted -> Admits Received -> Visa Approved -> Enrollment Confirmed`

## What This Project Shows

- Funnel analytics and conversion tracking
- Country-wise application, admit, visa, and enrollment trends
- Counselor workload and performance analysis
- Operational KPIs, bottlenecks, and business insights
- Clean SaaS-style UI built with React, Tailwind CSS, and Recharts
- Realistic mock JSON-style data with no backend or authentication

## Tech Stack

- React
- Tailwind CSS
- Recharts
- Lucide React icons
- PapaParse for CSV upload
- SheetJS for Excel upload
- Mock data stored in `src/data/mockData.js`
- Vite for local development

## How To Run

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal, usually:

```bash
http://localhost:5173
```

To create a production build:

```bash
npm run build
```
---

## 🚀 Live Demo & Repository

🌐 Live Demo: https://study-abroad-operational-analytics.vercel.app/

💻 GitHub Repository: https://github.com/ArnavGit17/Study-Abroad-Operational-Analytics-Dashboard

---

## Project Structure

```text
src/
  App.jsx
  main.jsx
  index.css
  components/
    ChartCard.jsx
    ChartTooltip.jsx
    DataUploadPanel.jsx
    FilterChip.jsx
    FunnelSnapshot.jsx
    KpiCard.jsx
    Navbar.jsx
    PageHeader.jsx
    ProgressBar.jsx
    Sidebar.jsx
  data/
    mockData.js
    mockData.json
  context/
    DashboardDataContext.jsx
    dashboardDataContextObject.js
    useDashboardData.js
  pages/
    ExecutiveDashboard.jsx
    FunnelAnalytics.jsx
    CountryAnalytics.jsx
    CounselorPerformance.jsx
  utils/
    dataTransformer.js
    fileParsers.js
    formatters.js
sample-data/
  students.csv
```

## Excel, CSV, and Google Sheets Upload

The dashboard also supports spreadsheet-driven analytics:

- CSV upload using PapaParse
- Excel `.xlsx` / `.xls` upload using SheetJS
- Google Sheets public CSV fetching
- Data preview table
- Refresh Data button for synced Google Sheets
- Reset mock data button
- Automatic chart and KPI updates

Install command for these libraries:

```bash
npm install papaparse xlsx
```

The libraries are already added to this project. Running `npm install` is enough after cloning/downloading.

### Upload Format

Use student-level operational rows. The simplest columns are:

```text
student_id, month, country, counselor, source, segment, stage, drop_off_reason,
visa_status, response_hours, satisfaction, processing_days
```

The most important column is `stage`. Accepted stage values:

```text
Lead Generated
Counseling
Applications Submitted
Admits Received
Visa Approved
Enrollment Confirmed
```

Try the included sample file:

```text
sample-data/students.csv
```

### Data Flow

```text
CSV / Excel / Google Sheet
  -> fileParsers.js
  -> dataTransformer.js
  -> DashboardDataContext.jsx
  -> existing pages and charts
```

The transformer converts uploaded student rows into the same shape used by the original mock dashboard:

- `funnelStages`
- `monthlyTrend`
- `sourceMix`
- `countryData`
- `countryTrend`
- `visaTrend`
- `counselors`
- `counselorTrend`
- `counselorRadar`
- `dropOffReasons`
- `studentSegments`

This is why the current KPI cards and Recharts charts keep working.

### Google Sheets Setup

1. Create a Google Sheet.
2. Add the upload-format columns above.
3. Keep the tab name as `Sheet1`, or enter your custom tab name in the dashboard.
4. Click `Share`.
5. Change access to `Anyone with the link can view`.
6. Copy the Google Sheets URL.
7. Paste it into the dashboard's Google Sheets input.
8. Click `Sync Google Sheet`.
9. When the sheet changes later, click `Refresh Data`.

No backend is needed. The app reads the public sheet as CSV and normalizes it inside the browser.

### Interview Explanation For Upload Feature

> I added CSV, Excel, and Google Sheets upload so the dashboard is not limited to hardcoded mock data. Operations teams usually work in spreadsheets, so this feature lets them import student funnel data, normalize it, and instantly update KPI cards, charts, funnel analytics, country analytics, and counselor performance.

Why this strengthens the project:

- It matches real operational analyst workflows.
- It shows spreadsheet handling, which is common in analyst internships.
- It connects raw rows to business metrics.
- It keeps the project practical without adding a complex backend.

## Pages

### Executive Dashboard

High-level KPI view for leadership:

- Total students
- Lead-to-enrollment conversion
- Application submission rate
- Visa success rate
- Funnel overview
- Top countries
- Lead source mix
- Recent activity and quick insights

### Funnel Analytics

Operational funnel deep dive:

- Funnel chart
- Stage-wise conversion
- Drop-off analysis
- Drop-off reasons
- Student segment conversion

### Country Analytics

Market and destination analysis:

- Applications by country
- Admit and visa trends
- Visa success comparison
- Country comparison table
- Market ranking cards

### Counselor Performance

Team productivity dashboard:

- Students handled
- Conversion performance
- Top counselor
- Response speed
- Workload vs outcomes
- Counselor leaderboard

  # 👨‍💻 Author

## Arnav Tripathi

GitHub: https://github.com/ArnavGit17
