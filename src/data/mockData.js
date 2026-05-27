import mockData from './mockData.json'
import { buildDashboardData } from '../utils/dataTransformer'

const preparedMockData = buildDashboardData(mockData)

export const funnelStages = preparedMockData.funnelStages
export const monthlyTrend = preparedMockData.monthlyTrend
export const sourceMix = preparedMockData.sourceMix
export const countryData = preparedMockData.countryData
export const countryTrend = preparedMockData.countryTrend
export const visaTrend = preparedMockData.visaTrend
export const counselors = preparedMockData.counselors
export const counselorTrend = preparedMockData.counselorTrend
export const counselorRadar = preparedMockData.counselorRadar
export const dropOffReasons = preparedMockData.dropOffReasons
export const studentSegments = preparedMockData.studentSegments
export const recentActivity = preparedMockData.recentActivity
export const quickInsights = preparedMockData.quickInsights
export const funnelAnalytics = preparedMockData.funnelAnalytics
export const intakeSummary = preparedMockData.intakeSummary
