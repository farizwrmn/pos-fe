export const getTotal = (list) => {
  return list
    .filter(filtered => filtered.active)
    .reduce((prev, next) => (prev + (((next.depositTotal || 0)) - (next.expenseTotal || 0))) + (next.discount || 0), 0)
}
