import React from 'react'
import pdfMake from 'pdfmake/build/pdfmake.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'
pdfMake.vfs = pdfFonts.pdfMake.vfs

const RepeatReport = ({
  name,
  className,
  width = [],
  pageMargins = [0, 0, 0, 0],
  tableStyle,
  style,
  layout = '',
  groupByParams1 = '',
  groupByDesc = '',
  pageSize = 'A4',
  groupByParams2 = '',
  tableHeader = [],
  tableBody = [],
  tableFooter = [],
  data,
  contentPdf = [],
  header = [],
  footer = []
}) => {
  const printPdf = (data) => {
    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: pageMargins,
      content: contentPdf,
      styles: tableStyle
    }
    try {
      pdfMake.createPdf(docDefinition).open()
    } catch (e) {
      pdfMake.createPdf(docDefinition).download()
    }
  }

  return (
    <div>
      <button onClick={() => printPdf(tableBody)} style={style} className={className}>{name}</button>
    </div>
  )
}

export default RepeatReport;
