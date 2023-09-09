export const rearrangeDirectPrinting = (pos, directPrinting) => {
  const headerPrint = [
    {
      alignment: 'two',
      text: 'Antrian:',
      rightText: ''
    },
    {
      style: 'title',
      alignment: 'center',
      text: pos.orderShortNumber
    },
    {
      alignment: 'line',
      text: ''
    },
    {
      style: 'subtitle',
      alignment: 'center',
      text: directPrinting.groupName
    },
    {
      alignment: 'line',
      text: ''
    },
    {
      alignment: 'two',
      text: 'Item',
      rightText: 'Price'
    },
    {
      alignment: 'line',
      text: ''
    }
  ]

  for (let key in directPrinting.detail) {
    const item = directPrinting.detail[key]
    headerPrint.push({
      alignment: 'two',
      text: `${item.productName} - ${item.productCode}`,
      rightText: ''
    })
    headerPrint.push({
      alignment: 'two',
      style: 'subtitle',
      text: '',
      rightText: `Qty: ${item.qty.toLocaleString()}`
    })
  }

  const footerPrint = [
    {
      alignment: 'line',
      text: ''
    },
    {
      alignment: 'two',
      text: 'Total',
      rightText: directPrinting.detail.reduce((prev, next) => prev + next.qty, 0)
    },
    {
      alignment: 'line',
      text: ''
    },
    {
      alignment: 'center',
      text: 'Thank you for shopping with us!'
    }
  ]
  const resultData = headerPrint.concat(footerPrint)
  return resultData
}
