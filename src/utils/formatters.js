export const formatNumber = (value) =>
  new Intl.NumberFormat('en-IN').format(value)

export const formatPercent = (value, digits = 1) => `${Number(value).toFixed(digits)}%`

export const getConversionRate = (current, previous) =>
  previous ? Number(((current / previous) * 100).toFixed(1)) : 0

export const getDropOffRate = (current, previous) =>
  previous ? Number((((previous - current) / previous) * 100).toFixed(1)) : 0

export const sumBy = (items, key) =>
  items.reduce((total, item) => total + Number(item[key] || 0), 0)

export const compactNumber = (value) =>
  new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
