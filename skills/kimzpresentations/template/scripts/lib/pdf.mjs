// A PDF of full-bleed JPEG pages, written by hand (no dependencies).
// Each page is 960×540 pt — exactly 13.333×7.5 in, the PowerPoint 16:9 size — so the file
// prints and imports at 1:1 with no scaling. The images are the deck's own frames, so what
// you saw on screen is what lands in the file (see export.mjs for why this is raster, not vector).

/** width/height from a JPEG's SOF marker */
export function jpegSize(buf) {
  let i = 2
  while (i < buf.length) {
    if (buf[i] !== 0xff) {
      i++
      continue
    }
    const marker = buf[i + 1]
    // SOF0..SOF15, minus the non-frame markers DHT (c4), JPG (c8) and DAC (cc)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7), channels: buf[i + 9] }
    }
    i += 2 + buf.readUInt16BE(i + 2)
  }
  throw new Error('not a JPEG')
}

/**
 * @param {{ jpeg: Buffer, title?: string }[]} pages
 * @param {{ width?: number, height?: number, title?: string }} opts  page size in points
 */
export function buildPdf(pages, { width = 960, height = 540, title = 'Presentation' } = {}) {
  const objects = [] // 1-based; objects[i] is object number i+1
  const add = (body) => {
    objects.push(body)
    return objects.length
  }
  const esc = (s) => String(s).replace(/([\\()])/g, '\\$1')

  const catalogNo = add(null) // placed first so /Root is object 1
  const pagesNo = add(null)
  const kids = []

  for (const { jpeg } of pages) {
    const { width: iw, height: ih, channels } = jpegSize(jpeg)
    const imgNo = add({
      dict: `<< /Type /XObject /Subtype /Image /Width ${iw} /Height ${ih} /ColorSpace /${channels === 1 ? 'DeviceGray' : 'DeviceRGB'} /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>`,
      stream: jpeg,
    })
    const content = Buffer.from(`q ${width} 0 0 ${height} 0 0 cm /Im0 Do Q\n`, 'latin1')
    const contentNo = add({ dict: `<< /Length ${content.length} >>`, stream: content })
    const pageNo = add(
      `<< /Type /Page /Parent ${pagesNo} 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im0 ${imgNo} 0 R >> >> /Contents ${contentNo} 0 R >>`,
    )
    kids.push(pageNo)
  }

  const infoNo = add(`<< /Title (${esc(title)}) /Producer (kimzPresentations) >>`)
  objects[catalogNo - 1] = `<< /Type /Catalog /Pages ${pagesNo} 0 R >>`
  objects[pagesNo - 1] = `<< /Type /Pages /Count ${kids.length} /Kids [${kids.map((k) => `${k} 0 R`).join(' ')}] >>`

  const chunks = [Buffer.from('%PDF-1.7\n%\xe2\xe3\xcf\xd3\n', 'latin1')]
  let offset = chunks[0].length
  const xref = []
  objects.forEach((body, i) => {
    xref[i] = offset
    const head = Buffer.from(`${i + 1} 0 obj\n`, 'latin1')
    const parts = [head]
    if (typeof body === 'string') parts.push(Buffer.from(`${body}\n`, 'latin1'))
    else parts.push(Buffer.from(`${body.dict}\nstream\n`, 'latin1'), body.stream, Buffer.from('\nendstream\n', 'latin1'))
    parts.push(Buffer.from('endobj\n', 'latin1'))
    const obj = Buffer.concat(parts)
    chunks.push(obj)
    offset += obj.length
  })

  const startxref = offset
  let table = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const pos of xref) table += `${String(pos).padStart(10, '0')} 00000 n \n`
  table += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogNo} 0 R /Info ${infoNo} 0 R >>\nstartxref\n${startxref}\n%%EOF\n`
  chunks.push(Buffer.from(table, 'latin1'))
  return Buffer.concat(chunks)
}
