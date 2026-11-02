// A .pptx of full-bleed slide images with real speaker notes, written by hand (no dependencies).
// PowerPoint refuses ("needs repair") unless the whole minimal part set is there: content types,
// presentation + rels, a slide master, a slide layout, a theme, a notes master with its own theme,
// presProps/viewProps/tableStyles and docProps. That is what this file assembles.
// Slide size is 12192000×6858000 EMU = 13.333×7.5 in, the standard widescreen deck.
import { crc32 } from 'node:zlib'

const EMU_W = 12192000
const EMU_H = 6858000

// ── zip (stored, no compression: simplest format PowerPoint accepts) ──────────
function zip(files) {
  const local = []
  const central = []
  let offset = 0
  for (const { name, data } of files) {
    const bytes = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')
    const nameBuf = Buffer.from(name, 'utf8')
    const sum = crc32(bytes)
    const head = Buffer.alloc(30)
    head.writeUInt32LE(0x04034b50, 0)
    head.writeUInt16LE(20, 4) // version needed
    head.writeUInt16LE(0, 6) // flags
    head.writeUInt16LE(0, 8) // stored
    head.writeUInt16LE(0, 10) // time
    head.writeUInt16LE(0x2821, 12) // date (2000-01-01)
    head.writeUInt32LE(sum, 14)
    head.writeUInt32LE(bytes.length, 18)
    head.writeUInt32LE(bytes.length, 22)
    head.writeUInt16LE(nameBuf.length, 26)
    local.push(head, nameBuf, bytes)

    const dir = Buffer.alloc(46)
    dir.writeUInt32LE(0x02014b50, 0)
    dir.writeUInt16LE(20, 4)
    dir.writeUInt16LE(20, 6)
    dir.writeUInt16LE(0, 8)
    dir.writeUInt16LE(0, 10)
    dir.writeUInt16LE(0, 12)
    dir.writeUInt16LE(0x2821, 14)
    dir.writeUInt32LE(sum, 16)
    dir.writeUInt32LE(bytes.length, 20)
    dir.writeUInt32LE(bytes.length, 24)
    dir.writeUInt16LE(nameBuf.length, 28)
    dir.writeUInt32LE(offset, 42)
    central.push(dir, nameBuf)
    offset += 30 + nameBuf.length + bytes.length
  }
  const centralBuf = Buffer.concat(central)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(centralBuf.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...local, centralBuf, end])
}

const xmlEsc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
const DECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
const PML = 'http://schemas.openxmlformats.org/presentationml/2006/main'
const DML = 'http://schemas.openxmlformats.org/drawingml/2006/main'

const theme = (name) => `${DECL}<a:theme xmlns:a="${DML}" name="${name}"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri Light"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>`

/**
 * @param {{ jpeg: Buffer, notes?: string, title?: string }[]} slides
 * @param {{ title?: string, author?: string }} opts
 */
export function buildPptx(slides, { title = 'Presentation', author = 'kimzPresentations' } = {}) {
  const files = []
  const n = slides.length

  // [Content_Types].xml must be the first entry
  files.push({
    name: '[Content_Types].xml',
    data: `${DECL}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/notesMasters/notesMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesMaster+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/ppt/theme/theme2.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/><Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/><Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/>${slides
      .map(
        (_, i) =>
          `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/><Override PartName="/ppt/notesSlides/notesSlide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml"/>`,
      )
      .join('')}<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`,
  })

  files.push({
    name: '_rels/.rels',
    data: `${DECL}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/officeDocument" Target="ppt/presentation.xml"/><Relationship Id="rId2" Type="${REL}/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="${REL}/extended-properties" Target="docProps/app.xml"/></Relationships>`,
  })

  // presentation + its rels: rId1 master, rId2..n+1 slides, then notesMaster, presProps, viewProps, theme, tableStyles
  const rSlide = (i) => `rId${i + 2}`
  const rNotesMaster = `rId${n + 2}`
  const rPresProps = `rId${n + 3}`
  const rViewProps = `rId${n + 4}`
  const rTheme = `rId${n + 5}`
  const rTableStyles = `rId${n + 6}`
  files.push({
    name: 'ppt/presentation.xml',
    data: `${DECL}<p:presentation xmlns:a="${DML}" xmlns:r="${REL}" xmlns:p="${PML}" saveSubsetFonts="1"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:notesMasterIdLst><p:notesMasterId r:id="${rNotesMaster}"/></p:notesMasterIdLst><p:sldIdLst>${slides.map((_, i) => `<p:sldId id="${256 + i}" r:id="${rSlide(i)}"/>`).join('')}</p:sldIdLst><p:sldSz cx="${EMU_W}" cy="${EMU_H}"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`,
  })
  files.push({
    name: 'ppt/_rels/presentation.xml.rels',
    data: `${DECL}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/slideMaster" Target="slideMasters/slideMaster1.xml"/>${slides
      .map((_, i) => `<Relationship Id="${rSlide(i)}" Type="${REL}/slide" Target="slides/slide${i + 1}.xml"/>`)
      .join(
        '',
      )}<Relationship Id="${rNotesMaster}" Type="${REL}/notesMaster" Target="notesMasters/notesMaster1.xml"/><Relationship Id="${rPresProps}" Type="${REL}/presProps" Target="presProps.xml"/><Relationship Id="${rViewProps}" Type="${REL}/viewProps" Target="viewProps.xml"/><Relationship Id="${rTheme}" Type="${REL}/theme" Target="theme/theme1.xml"/><Relationship Id="${rTableStyles}" Type="${REL}/tableStyles" Target="tableStyles.xml"/></Relationships>`,
  })

  const emptySpTree = (name) =>
    `<p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name="${name}"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>`

  files.push({
    name: 'ppt/slideMasters/slideMaster1.xml',
    data: `${DECL}<p:sldMaster xmlns:a="${DML}" xmlns:r="${REL}" xmlns:p="${PML}"><p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="000000"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>`,
  })
  files.push({
    name: 'ppt/slideMasters/_rels/slideMaster1.xml.rels',
    data: `${DECL}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="${REL}/theme" Target="../theme/theme1.xml"/></Relationships>`,
  })
  files.push({
    name: 'ppt/slideLayouts/slideLayout1.xml',
    data: `${DECL}<p:sldLayout xmlns:a="${DML}" xmlns:r="${REL}" xmlns:p="${PML}" type="blank" preserve="1">${emptySpTree('')}</p:sldLayout>`,
  })
  files.push({
    name: 'ppt/slideLayouts/_rels/slideLayout1.xml.rels',
    data: `${DECL}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`,
  })
  files.push({
    name: 'ppt/notesMasters/notesMaster1.xml',
    data: `${DECL}<p:notesMaster xmlns:a="${DML}" xmlns:r="${REL}" xmlns:p="${PML}"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/></p:notesMaster>`,
  })
  files.push({
    name: 'ppt/notesMasters/_rels/notesMaster1.xml.rels',
    data: `${DECL}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/theme" Target="../theme/theme2.xml"/></Relationships>`,
  })
  files.push({ name: 'ppt/theme/theme1.xml', data: theme('Office Theme') })
  files.push({ name: 'ppt/theme/theme2.xml', data: theme('Office Theme Notes') })
  files.push({ name: 'ppt/presProps.xml', data: `${DECL}<p:presentationPr xmlns:a="${DML}" xmlns:r="${REL}" xmlns:p="${PML}"/>` })
  files.push({
    name: 'ppt/viewProps.xml',
    data: `${DECL}<p:viewPr xmlns:a="${DML}" xmlns:r="${REL}" xmlns:p="${PML}"><p:normalViewPr><p:restoredLeft sz="15620"/><p:restoredTop sz="94660"/></p:normalViewPr><p:gridSpacing cx="76200" cy="76200"/></p:viewPr>`,
  })
  files.push({ name: 'ppt/tableStyles.xml', data: `${DECL}<a:tblStyleLst xmlns:a="${DML}" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>` })

  slides.forEach((s, i) => {
    const k = i + 1
    files.push({ name: `ppt/media/image${k}.jpeg`, data: s.jpeg })
    files.push({
      name: `ppt/slides/slide${k}.xml`,
      data: `${DECL}<p:sld xmlns:a="${DML}" xmlns:r="${REL}" xmlns:p="${PML}"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr><p:pic><p:nvPicPr><p:cNvPr id="2" name="${xmlEsc(s.title ?? `Slide ${k}`)}" descr="${xmlEsc(s.title ?? '')}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${EMU_W}" cy="${EMU_H}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`,
    })
    files.push({
      name: `ppt/slides/_rels/slide${k}.xml.rels`,
      data: `${DECL}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/image" Target="../media/image${k}.jpeg"/><Relationship Id="rId2" Type="${REL}/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId3" Type="${REL}/notesSlide" Target="../notesSlides/notesSlide${k}.xml"/></Relationships>`,
    })
    const notesRuns = String(s.notes ?? '')
      .split(/\n+/)
      .map((line) => `<a:p><a:r><a:rPr lang="en-US" dirty="0"/><a:t>${xmlEsc(line)}</a:t></a:r></a:p>`)
      .join('')
    files.push({
      name: `ppt/notesSlides/notesSlide${k}.xml`,
      data: `${DECL}<p:notes xmlns:a="${DML}" xmlns:r="${REL}" xmlns:p="${PML}"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr><p:sp><p:nvSpPr><p:cNvPr id="2" name="Notes Placeholder ${k}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/>${notesRuns || '<a:p><a:endParaRPr lang="en-US"/></a:p>'}</p:txBody></p:sp></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:notes>`,
    })
    files.push({
      name: `ppt/notesSlides/_rels/notesSlide${k}.xml.rels`,
      data: `${DECL}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/notesMaster" Target="../notesMasters/notesMaster1.xml"/><Relationship Id="rId2" Type="${REL}/slide" Target="../slides/slide${k}.xml"/></Relationships>`,
    })
  })

  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z')
  files.push({
    name: 'docProps/core.xml',
    data: `${DECL}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xmlEsc(title)}</dc:title><dc:creator>${xmlEsc(author)}</dc:creator><cp:lastModifiedBy>${xmlEsc(author)}</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`,
  })
  files.push({
    name: 'docProps/app.xml',
    data: `${DECL}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>kimzPresentations</Application><Slides>${n}</Slides><TitlesOfParts><vt:vector size="${n}" baseType="lpstr">${slides.map((s, i) => `<vt:lpstr>${xmlEsc(s.title ?? `Slide ${i + 1}`)}</vt:lpstr>`).join('')}</vt:vector></TitlesOfParts></Properties>`,
  })

  return zip(files)
}
