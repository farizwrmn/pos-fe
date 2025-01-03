export const getReportName = (data) => {
  switch (data) {
    case 'AJOUT':
      return 'ADJUST OUT'
    case 'RBB':
      return 'RETUR BELI'
    case 'RJJ':
      return 'RETUR JUAL'
    case 'AJIN':
      return 'ADJUST IN'
    default:
      return ''
  }
}
