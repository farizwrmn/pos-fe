export const rearrangeDirectPrinting = (pos, directPrinting) => {
  const headerPrint = [
    {
      style: 'title',
      alignment: 'center',
      text: directPrinting.groupName
    },
    {
      alignment: 'line',
      text: ''
    },
    {
      style: 'title',
      alignment: 'center',
      text: `Antrian: ${pos.queueName}`
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
      text: `${item.productCode} - ${item.productName}`,
      rightText: ''
    })
    headerPrint.push({
      alignment: 'two',
      text: `Qty: ${item.qty.toLocaleString()}`,
      rightText: `Subtotal: ${item.subtotal.toLocaleString()}`
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
      rightText: directPrinting.detail.reduce((prev, next) => prev + next.subtotal, 0)
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
