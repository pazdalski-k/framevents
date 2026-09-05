import { NextResponse } from 'next/server'

export async function GET() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Krzysztof Pazdalski',
    'N:Pazdalski;Krzysztof;;;',
    'ORG:FramEvents',
    'TEL;TYPE=CELL:+33668687565',
    'EMAIL;TYPE=WORK:contact@framevents.fr',
    'ADR;TYPE=WORK:;;Caen;Normandie;;France',
    'URL:https://www.framevents.fr',
    'NOTE:Photographe événementiel - FramEvents',
    'END:VCARD',
  ].join('\r\n')

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition':
        'attachment; filename="Krzysztof-Pazdalski-FramEvents.vcf"',
      'Cache-Control': 'no-store',
    },
  })
}
