import { getConversionRate, getDropOffRate } from './formatters.js'

const stageDefinitions = [
  {
    stage: 'Lead Generated',
    short: 'Leads',
    color: '#3178c6',
    summary: 'New inquiries from webinars, referrals, SEO, and university fairs.',
  },
  {
    stage: 'Counseling',
    short: 'Counseling',
    color: '#13a89e',
    summary: 'Students who completed at least one counseling session.',
  },
  {
    stage: 'Applications Submitted',
    short: 'Applications',
    color: '#7467ef',
    summary: 'Students with one or more university applications submitted.',
  },
  {
    stage: 'Admits Received',
    short: 'Admits',
    color: '#f2aa3b',
    summary: 'Students who received at least one university admit.',
  },
  {
    stage: 'Visa Approved',
    short: 'Visa',
    color: '#f9735b',
    summary: 'Students who secured visa approval for the selected intake.',
  },
  {
    stage: 'Enrollment Confirmed',
    short: 'Enrollment',
    color: '#172033',
    summary: 'Students who paid deposit and confirmed their university.',
  },
]

const stageAliases = [
  ['leadgenerated', 'lead', 'leads', 'newlead', 'inquiry', 'enquiry'],
  ['counseling', 'counselling', 'counseled', 'counselled', 'counselingsession'],
  ['applicationssubmitted', 'applicationsubmitted', 'applications', 'application', 'applied'],
  ['admitsreceived', 'admitreceived', 'admits', 'admit', 'offerreceived'],
  ['visaapproved', 'visa', 'visas', 'visaapproval', 'approvedvisa'],
  ['enrollmentconfirmed', 'enrolmentconfirmed', 'enrollment', 'enrolment', 'enrolled', 'confirmed'],
]

const fieldAliases = {
  month: ['month', 'intakemonth', 'createdmonth', 'applicationmonth', 'reportingmonth'],
  country: ['country', 'destinationcountry', 'destination', 'targetcountry'],
  countryCode: ['code', 'countrycode', 'destinationcode'],
  counselor: ['counselor', 'counsellor', 'counselorname', 'counsellorname', 'advisor', 'owner'],
  source: ['source', 'leadsource', 'sourcechannel', 'channel', 'acquisitionchannel'],
  segment: ['segment', 'studentsegment', 'programsegment', 'program', 'course', 'degree'],
  stage: ['stage', 'currentstage', 'funnelstage', 'status'],
  dropOffReason: ['dropoffreason', 'dropreason', 'reason', 'lostreason', 'inactivecause'],
  visaStatus: ['visastatus', 'visa_status', 'visaresult'],
  responseHours: ['responsehours', 'responsetimehours', 'avgresponsetime', 'slahours'],
  satisfaction: ['satisfaction', 'csat', 'rating', 'studentsatisfaction'],
  processingDays: ['processingdays', 'avgprocessingdays', 'visaprocessingdays'],
}

const countryCodes = {
  'United States': 'USA',
  USA: 'USA',
  US: 'USA',
  Canada: 'CAN',
  'United Kingdom': 'UK',
  UK: 'UK',
  Germany: 'DEU',
  Australia: 'AUS',
  Ireland: 'IRL',
}

const colors = ['#3178c6', '#13a89e', '#7467ef', '#f2aa3b', '#f9735b', '#172033']
const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fallbackReasons = ['lowIntent', 'unreachable', 'budget', 'timing']

const toKey = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === '') return fallback
  const cleaned = String(value).replace(/[%₹,$\s]/g, '')
  const number = Number(cleaned)
  return Number.isFinite(number) ? number : fallback
}

const toPercent = (value, fallback = 0) => toNumber(value, fallback)

const getValue = (row, aliases, fallback = '') => {
  const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [toKey(key), value]))
  const match = aliases.map(toKey).find((alias) => alias in normalized)
  return match ? normalized[match] : fallback
}

const parseBoolean = (value) => {
  const text = toKey(value)
  return ['1', 'yes', 'y', 'true', 'done', 'completed', 'approved', 'submitted', 'confirmed'].includes(text)
}

const parseStageIndex = (row) => {
  const explicitStage = getValue(row, fieldAliases.stage)
  const explicitKey = toKey(explicitStage)

  if (explicitKey) {
    const exactIndex = stageAliases.findIndex((aliases) => aliases.includes(explicitKey))
    if (exactIndex >= 0) return exactIndex

    const fuzzyIndex = stageAliases.findIndex((aliases) => aliases.some((alias) => explicitKey.includes(alias)))
    if (fuzzyIndex >= 0) return fuzzyIndex

    const numericStage = Number(explicitStage)
    if (Number.isFinite(numericStage) && numericStage >= 0 && numericStage <= 5) {
      return numericStage
    }
  }

  for (let index = stageDefinitions.length - 1; index >= 0; index -= 1) {
    const aliases = stageAliases[index]
    const stageValue = getValue(row, aliases)
    if (parseBoolean(stageValue)) return index
  }

  return 0
}

const getMonth = (row) => {
  const value = String(getValue(row, fieldAliases.month, 'Uploaded')).trim()
  if (!value || value === 'undefined') return 'Uploaded'

  const date = new Date(value)
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleString('en-US', { month: 'short' })
  }

  const normalized = value.slice(0, 3)
  const matchedMonth = monthOrder.find((month) => month.toLowerCase() === normalized.toLowerCase())
  return matchedMonth || value
}

const sortMonths = (months) =>
  [...months].sort((a, b) => {
    const aIndex = monthOrder.indexOf(a)
    const bIndex = monthOrder.indexOf(b)
    if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex
    return String(a).localeCompare(String(b))
  })

const groupBy = (items, getKey) =>
  items.reduce((groups, item) => {
    const key = getKey(item)
    groups[key] = groups[key] || []
    groups[key].push(item)
    return groups
  }, {})

const countAtOrBeyond = (rows, index) => rows.filter((row) => row.stageIndex >= index).length

const getCountryCode = (country, explicitCode = '') => {
  if (explicitCode) return String(explicitCode).trim().toUpperCase()
  return countryCodes[country] || String(country || 'UNK').slice(0, 3).toUpperCase()
}

const createActivityAndInsights = (funnelStages, countryData, counselors) => {
  const topCountry = countryData[0] || { country: 'Top country', applications: 0, visaSuccess: 0 }
  const fastestCountry = [...countryData].sort((a, b) => b.demandGrowth - a.demandGrowth)[0] || topCountry
  const topCounselor = [...counselors].sort((a, b) => b.conversion - a.conversion)[0] || {
    name: 'Top counselor',
    conversion: 0,
  }
  const applicationStage = funnelStages[2]?.value || 0
  const admitStage = funnelStages[3]?.value || 0
  const appToAdmitDrop = getDropOffRate(admitStage, applicationStage)

  return {
    recentActivity: [
      {
        title: `${topCountry.country} has the highest application volume`,
        meta: `${topCountry.applications} applications in the uploaded data`,
        impact: 'Prioritize capacity',
        tone: 'teal',
      },
      {
        title: 'Application to admit stage needs monitoring',
        meta: `${appToAdmitDrop}% drop-off at this stage`,
        impact: 'Review shortlists',
        tone: 'coral',
      },
      {
        title: `${fastestCountry.country} shows the strongest demand signal`,
        meta: `+${fastestCountry.demandGrowth || 0}% month trend`,
        impact: 'Campaign fit',
        tone: 'amber',
      },
      {
        title: `${topCounselor.name} leads counselor conversion`,
        meta: `${topCounselor.conversion}% lead to enrollment`,
        impact: 'Replicate playbook',
        tone: 'ocean',
      },
    ],
    quickInsights: [
      {
        label: 'Operational focus',
        title: 'Application stage is the main bottleneck',
        detail: `The uploaded data shows ${appToAdmitDrop}% drop-off between applications and admits.`,
        metric: `${appToAdmitDrop}% drop-off`,
      },
      {
        label: 'Country signal',
        title: `${fastestCountry.country} demand is growing fastest`,
        detail: 'Use this signal to plan webinars, counselor allocation, and destination-specific content.',
        metric: `+${fastestCountry.demandGrowth || 0}% demand`,
      },
      {
        label: 'Counselor signal',
        title: 'Response speed and conversion can be tracked together',
        detail: `${topCounselor.name} currently has the best counselor conversion in this dataset.`,
        metric: `${topCounselor.conversion}% conversion`,
      },
    ],
  }
}

export const buildDashboardData = (dashboardData) => {
  const funnelStages = (dashboardData.funnelStages || []).map((stage, index) => ({
    ...stageDefinitions[index],
    ...stage,
    value: toNumber(stage.value),
  }))

  const countryData = [...(dashboardData.countryData || [])]
    .map((country) => ({
      ...country,
      applications: toNumber(country.applications),
      admits: toNumber(country.admits),
      visas: toNumber(country.visas),
      enrollments: toNumber(country.enrollments),
      admitRate: toPercent(country.admitRate),
      visaSuccess: toPercent(country.visaSuccess),
      avgProcessingDays: toNumber(country.avgProcessingDays, 34),
      demandGrowth: toNumber(country.demandGrowth),
    }))
    .sort((a, b) => b.applications - a.applications)

  const counselors = [...(dashboardData.counselors || [])].map((counselor) => ({
    ...counselor,
    students: toNumber(counselor.students),
    applications: toNumber(counselor.applications),
    admits: toNumber(counselor.admits),
    visas: toNumber(counselor.visas),
    enrollments: toNumber(counselor.enrollments),
    conversion: toPercent(counselor.conversion),
    responseHours: toNumber(counselor.responseHours),
    satisfaction: toNumber(counselor.satisfaction, 4.5),
    targetProgress: toNumber(counselor.targetProgress, 80),
  }))

  const funnelAnalytics = funnelStages.map((stage, index, stages) => {
    const previous = index === 0 ? stage.value : stages[index - 1].value
    return {
      ...stage,
      conversion: index === 0 ? 100 : getConversionRate(stage.value, previous),
      dropOff: index === 0 ? 0 : getDropOffRate(stage.value, previous),
      lost: index === 0 ? 0 : Math.max(previous - stage.value, 0),
    }
  })

  const { recentActivity, quickInsights } =
    dashboardData.recentActivity?.length && dashboardData.quickInsights?.length
      ? dashboardData
      : createActivityAndInsights(funnelStages, countryData, counselors)

  return {
    ...dashboardData,
    funnelStages,
    countryData,
    counselors,
    recentActivity,
    quickInsights,
    monthlyTrend: dashboardData.monthlyTrend || [],
    sourceMix: dashboardData.sourceMix || [],
    countryTrend: dashboardData.countryTrend || [],
    visaTrend: dashboardData.visaTrend || [],
    counselorTrend: dashboardData.counselorTrend || [],
    counselorRadar: dashboardData.counselorRadar || [],
    dropOffReasons: dashboardData.dropOffReasons || [],
    studentSegments: dashboardData.studentSegments || [],
    funnelAnalytics,
    intakeSummary: {
      ...dashboardData.intakeSummary,
      activeCountries: countryData.length,
      leadToEnrollment: getConversionRate(funnelStages[5]?.value || 0, funnelStages[0]?.value || 0),
      applicationToAdmit: getConversionRate(funnelStages[3]?.value || 0, funnelStages[2]?.value || 0),
      visaToEnrollment: getConversionRate(funnelStages[5]?.value || 0, funnelStages[4]?.value || 0),
    },
  }
}

export const normalizeDashboardDataset = (partialData, fallbackData) =>
  buildDashboardData({
    ...fallbackData,
    ...partialData,
    intakeSummary: {
      ...fallbackData.intakeSummary,
      ...partialData.intakeSummary,
    },
  })

export const normalizeOperationalRows = (rows, fallbackData) => {
  const preparedRows = rows
    .filter((row) => Object.values(row).some((value) => String(value || '').trim()))
    .map((row) => {
      const stageIndex = parseStageIndex(row)
      const country = String(getValue(row, fieldAliases.country, 'Unknown')).trim() || 'Unknown'
      const counselor = String(getValue(row, fieldAliases.counselor, 'Unassigned')).trim() || 'Unassigned'
      return {
        ...row,
        stageIndex,
        month: getMonth(row),
        country,
        countryCode: getCountryCode(country, getValue(row, fieldAliases.countryCode)),
        counselor,
        source: String(getValue(row, fieldAliases.source, 'Unknown')).trim() || 'Unknown',
        segment: String(getValue(row, fieldAliases.segment, 'General')).trim() || 'General',
        dropOffReason: String(getValue(row, fieldAliases.dropOffReason, '')).trim(),
        visaStatus: String(getValue(row, fieldAliases.visaStatus, '')).trim(),
        responseHours: toNumber(getValue(row, fieldAliases.responseHours), 16),
        satisfaction: toNumber(getValue(row, fieldAliases.satisfaction), 4.5),
        processingDays: toNumber(getValue(row, fieldAliases.processingDays), 34),
      }
    })

  if (!preparedRows.length) {
    return normalizeDashboardDataset({}, fallbackData)
  }

  const funnelStages = stageDefinitions.map((stage, index) => ({
    ...stage,
    value: countAtOrBeyond(preparedRows, index),
  }))

  const months = sortMonths(new Set(preparedRows.map((row) => row.month)))
  const monthlyTrend = months.map((month) => {
    const monthRows = preparedRows.filter((row) => row.month === month)
    return {
      month,
      leads: countAtOrBeyond(monthRows, 0),
      counseling: countAtOrBeyond(monthRows, 1),
      applications: countAtOrBeyond(monthRows, 2),
      admits: countAtOrBeyond(monthRows, 3),
      visas: countAtOrBeyond(monthRows, 4),
      enrollments: countAtOrBeyond(monthRows, 5),
    }
  })

  const countryGroups = groupBy(preparedRows, (row) => row.country)
  const countryData = Object.entries(countryGroups)
    .map(([country, countryRows]) => {
      const applications = countAtOrBeyond(countryRows, 2)
      const admits = countAtOrBeyond(countryRows, 3)
      const visas = countAtOrBeyond(countryRows, 4)
      const enrollments = countAtOrBeyond(countryRows, 5)
      const countryMonths = sortMonths(new Set(countryRows.map((row) => row.month)))
      const previousMonth = countryMonths[countryMonths.length - 2]
      const latestMonth = countryMonths[countryMonths.length - 1]
      const previousApps = previousMonth
        ? countryRows.filter((row) => row.month === previousMonth && row.stageIndex >= 2).length
        : applications
      const latestApps = latestMonth
        ? countryRows.filter((row) => row.month === latestMonth && row.stageIndex >= 2).length
        : applications

      return {
        country,
        code: countryRows[0]?.countryCode || getCountryCode(country),
        applications,
        admits,
        visas,
        enrollments,
        admitRate: getConversionRate(admits, applications),
        visaSuccess: getConversionRate(visas, admits),
        avgProcessingDays: Math.round(
          countryRows.reduce((total, row) => total + row.processingDays, 0) / countryRows.length,
        ),
        demandGrowth: previousApps ? Math.round(((latestApps - previousApps) / previousApps) * 100) : 0,
      }
    })
    .sort((a, b) => b.applications - a.applications)

  const topCountryCodes = countryData.slice(0, 5).map((country) => country.code)
  const countryTrend = months.map((month) => {
    const row = { month }
    topCountryCodes.forEach((code) => {
      row[code] = preparedRows.filter(
        (student) => student.month === month && student.countryCode === code && student.stageIndex >= 2,
      ).length
    })
    return row
  })

  const sourceGroups = groupBy(preparedRows, (row) => row.source)
  const sourceMix = Object.entries(sourceGroups)
    .map(([name, sourceRows], index) => ({
      name,
      value: Number(((sourceRows.length / preparedRows.length) * 100).toFixed(1)),
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.value - a.value)

  const visaTrend = months.map((month) => {
    const monthRows = preparedRows.filter((row) => row.month === month)
    const visaRows = monthRows.filter((row) => row.stageIndex >= 3 || row.visaStatus)
    const totalVisaRows = visaRows.length || 1
    const success = visaRows.filter((row) => row.stageIndex >= 4 || toKey(row.visaStatus).includes('approved')).length
    const rejected = visaRows.filter((row) => toKey(row.visaStatus).includes('reject')).length
    const pending = Math.max(totalVisaRows - success - rejected, 0)
    return {
      month,
      success: Number(((success / totalVisaRows) * 100).toFixed(1)),
      rejected: Number(((rejected / totalVisaRows) * 100).toFixed(1)),
      pending: Number(((pending / totalVisaRows) * 100).toFixed(1)),
    }
  })

  const counselorGroups = groupBy(preparedRows, (row) => row.counselor)
  const counselors = Object.entries(counselorGroups)
    .map(([name, counselorRows]) => {
      const applications = countAtOrBeyond(counselorRows, 2)
      const admits = countAtOrBeyond(counselorRows, 3)
      const visas = countAtOrBeyond(counselorRows, 4)
      const enrollments = countAtOrBeyond(counselorRows, 5)
      return {
        name,
        region: counselorRows[0]?.country || 'Multi-country',
        students: counselorRows.length,
        applications,
        admits,
        visas,
        enrollments,
        conversion: getConversionRate(enrollments, counselorRows.length),
        responseHours: Math.round(
          counselorRows.reduce((total, row) => total + row.responseHours, 0) / counselorRows.length,
        ),
        satisfaction: Number(
          (counselorRows.reduce((total, row) => total + row.satisfaction, 0) / counselorRows.length).toFixed(1),
        ),
        targetProgress: Math.min(Math.round((enrollments / Math.max(counselorRows.length * 0.18, 1)) * 100), 100),
      }
    })
    .sort((a, b) => b.students - a.students)

  const counselorKeys = counselors.slice(0, 5).map((counselor) => counselor.name.split(' ')[0])
  const counselorTrend = months.map((month) => {
    const trendRow = { month }
    counselors.slice(0, 5).forEach((counselor) => {
      trendRow[counselor.name.split(' ')[0]] = preparedRows.filter(
        (student) => student.month === month && student.counselor === counselor.name && student.stageIndex >= 5,
      ).length
    })
    return trendRow
  })

  const counselorRadar = ['Conversion', 'Speed', 'Admits', 'Visa', 'CSAT'].map((metric) => {
    const row = { metric }
    counselors.slice(0, 4).forEach((counselor) => {
      const key = counselor.name.split(' ')[0]
      row[key] =
        metric === 'Conversion'
          ? Math.min(Math.round(counselor.conversion * 4), 100)
          : metric === 'Speed'
            ? Math.max(100 - counselor.responseHours * 3, 30)
            : metric === 'Admits'
              ? Math.min(Math.round(getConversionRate(counselor.admits, counselor.applications) * 1.4), 100)
              : metric === 'Visa'
                ? Math.min(Math.round(getConversionRate(counselor.visas, counselor.admits) * 1.2), 100)
                : Math.min(Math.round(counselor.satisfaction * 20), 100)
    })
    return row
  })

  const dropOffReasons = stageDefinitions.slice(1).map((stage, index) => {
    const lostRows = preparedRows.filter((row) => row.stageIndex === index)
    const row = {
      stage: `${stageDefinitions[index].short} to ${stage.short}`,
      lowIntent: 0,
      unreachable: 0,
      budget: 0,
      timing: 0,
    }

    lostRows.forEach((student, studentIndex) => {
      const reasonKey = toKey(student.dropOffReason)
      const mappedReason = reasonKey.includes('budget')
        ? 'budget'
        : reasonKey.includes('unreach')
          ? 'unreachable'
          : reasonKey.includes('timing') || reasonKey.includes('document') || reasonKey.includes('fit')
            ? 'timing'
            : reasonKey.includes('intent')
              ? 'lowIntent'
              : fallbackReasons[studentIndex % fallbackReasons.length]
      row[mappedReason] += 1
    })

    return row
  })

  const segmentGroups = groupBy(preparedRows, (row) => row.segment)
  const studentSegments = Object.entries(segmentGroups)
    .map(([segment, segmentRows]) => {
      const enrollments = countAtOrBeyond(segmentRows, 5)
      return {
        segment,
        students: segmentRows.length,
        enrollments,
        conversion: getConversionRate(enrollments, segmentRows.length),
      }
    })
    .sort((a, b) => b.students - a.students)

  const normalized = {
    ...fallbackData,
    funnelStages,
    monthlyTrend,
    sourceMix,
    countryData,
    countryTrend,
    visaTrend,
    counselors,
    counselorTrend,
    counselorRadar,
    dropOffReasons,
    studentSegments,
    recentActivity: [],
    quickInsights: [],
    intakeSummary: {
      ...fallbackData.intakeSummary,
      openFollowUps: preparedRows.filter((row) => row.stageIndex < 5).length,
      slaAdherence: Math.round(
        (preparedRows.filter((row) => row.responseHours <= 15).length / preparedRows.length) * 100,
      ),
      counselorKeys,
    },
  }

  return buildDashboardData(normalized)
}

export const createPreviewRows = (rows, limit = 6) =>
  rows.slice(0, limit).map((row) =>
    Object.fromEntries(
      Object.entries(row)
        .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
        .slice(0, 8),
    ),
  )
