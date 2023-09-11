export const rearrangeDirectPrinting = (pos, directPrinting) => {
  const headerPrint = [
    {
      alignment: 'two',
      style: 'subtitle',
      text: ' ',
      rightText: ''
    },
    {
      style: 'title',
      alignment: 'left',
      text: directPrinting.groupName
    },
    {
      alignment: 'line',
      text: ''
    },
    {
      alignment: 'two',
      style: 'subtitle',
      text: `Date: ${pos.transDate} ${pos.transTime}`,
      rightText: ''
    },
    {
      alignment: 'line',
      text: ''
    },
    {
      alignment: 'two',
      style: 'subtitle',
      text: 'Item',
      rightText: ''
    }
  ]

  for (let key in directPrinting.detail) {
    const item = directPrinting.detail[key]
    headerPrint.push({
      alignment: 'line',
      text: ''
    })
    headerPrint.push({
      alignment: 'two',
      style: 'subtitle',
      text: `${item.productName}`,
      rightText: ''
    })
    headerPrint.push({
      alignment: 'two',
      style: 'subtitle',
      text: `Qty: ${item.qty.toLocaleString()}`,
      rightText: ''
    })
  }

  const footerPrint = [
    {
      alignment: 'line',
      text: ''
    },
    {
      alignment: 'two',
      style: 'subtitle',
      text: `Total: ${directPrinting.detail.reduce((prev, next) => prev + next.qty, 0)}`,
      rightText: ''
    },
    {
      style: 'title',
      alignment: 'center',
      text: pos.orderShortNumber
    }
  ]
  const resultData = headerPrint.concat(footerPrint)
  return resultData
}
