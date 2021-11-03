
export const moneyFormat = (value?: string | number | null, decimal: number = 2): string | null => {
  if (value === null || value === undefined) {
    return null
  }
  let val: number = 0.0
  if (typeof value === 'string') {
    val = Number(value)
  } else if (typeof value === 'number') {
    val = value
  } else {
    throw new Error(`Unknown money ${value}`)
  }
  const pow = Math.pow(10, decimal)
  const res = Math.round(val * pow) / pow
  // console.log('pow', pow, res.toFixed(decimal))

  return res.toFixed(decimal)
}
