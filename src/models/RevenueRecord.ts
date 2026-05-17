export interface RevenueRecord {
  bfy: string;
  ftyp: string;
  fundType: string;
  department: string;
  rsrc: string;
  revSource: string;
  budCurr: string;
  revBfy: string;
}

function cleanNumber(val: string): string {
  return val.replace(/[\u00A0\s]/g, '').trim();
}

export function rowToRecord(row: string[]): RevenueRecord {
  return {
    bfy: row[0]?.trim() ?? '',
    ftyp: row[1]?.trim() ?? '',
    fundType: row[2]?.trim() ?? '',
    department: row[3]?.trim() ?? '',
    rsrc: row[4]?.trim() ?? '',
    revSource: row[5]?.trim() ?? '',
    budCurr: cleanNumber(row[6] ?? ''),
    revBfy: cleanNumber(row[7] ?? ''),
  };
}

export function recordToString(record: RevenueRecord): string {
  return (
    `[${record.bfy}] ${record.ftyp} | ${record.fundType} | ` +
    `${record.department} | ${record.rsrc} - ${record.revSource} | ` +
    `Budget: ${record.budCurr} | Actual: ${record.revBfy}`
  );
}

export function recordToJson(record: RevenueRecord): string {
  return JSON.stringify({
    BFY: record.bfy,
    FTYP: record.ftyp,
    FUNDTYPE: record.fundType,
    DEPARTMENT: record.department,
    RSRC: record.rsrc,
    REVSOURCE: record.revSource,
    BUDCURR: record.budCurr,
    REVBFY: record.revBfy,
  });
}
