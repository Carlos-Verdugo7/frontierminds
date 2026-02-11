import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Shared styling constants
const HEADER_FILL: ExcelJS.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
const INPUT_FILL: ExcelJS.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFBEB' } };
const RESULT_FILL: ExcelJS.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } };
const SECTION_FILL: ExcelJS.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };
const HEADER_FONT: Partial<ExcelJS.Font> = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
const LABEL_FONT: Partial<ExcelJS.Font> = { bold: true, size: 11 };
const FORMULA_FONT: Partial<ExcelJS.Font> = { name: 'Consolas', size: 10, color: { argb: 'FF1D4ED8' } };
const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' }, bottom: { style: 'thin' },
  left: { style: 'thin' }, right: { style: 'thin' },
};

function styleInputCell(cell: ExcelJS.Cell) {
  cell.fill = INPUT_FILL;
  cell.border = { top: { style: 'medium', color: { argb: 'FFCA8A04' } }, bottom: { style: 'medium', color: { argb: 'FFCA8A04' } }, left: { style: 'medium', color: { argb: 'FFCA8A04' } }, right: { style: 'medium', color: { argb: 'FFCA8A04' } } };
  cell.font = { bold: true, size: 12 };
}

function styleResultCell(cell: ExcelJS.Cell) {
  cell.fill = RESULT_FILL;
  cell.border = THIN_BORDER;
  cell.font = { bold: true, size: 11, color: { argb: 'FF16A34A' } };
}

function addSectionHeader(ws: ExcelJS.Worksheet, row: number, text: string, cols: number = 6) {
  const cell = ws.getCell(row, 1);
  cell.value = text;
  cell.font = HEADER_FONT;
  cell.fill = HEADER_FILL;
  ws.mergeCells(row, 1, row, cols);
}

function addLabel(ws: ExcelJS.Worksheet, row: number, col: number, text: string) {
  const cell = ws.getCell(row, col);
  cell.value = text;
  cell.font = LABEL_FONT;
}

function addFormulaNote(ws: ExcelJS.Worksheet, row: number, col: number, text: string) {
  const cell = ws.getCell(row, col);
  cell.value = text;
  cell.font = FORMULA_FONT;
}

// ============================================================
// EXPONENTIAL DISTRIBUTION WORKBOOK
// ============================================================
export async function generateExponentialWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Exam P Trainer - FrontierMinds';
  wb.created = new Date();

  // ---- Sheet 1: Parameters & Key Formulas ----
  const ws1 = wb.addWorksheet('Parameters', { properties: { tabColor: { argb: 'FF22C55E' } } });
  ws1.columns = [
    { width: 30 }, { width: 18 }, { width: 5 }, { width: 30 }, { width: 18 }, { width: 20 },
  ];

  addSectionHeader(ws1, 1, 'EXPONENTIAL DISTRIBUTION - Parameters & Key Formulas');

  addLabel(ws1, 3, 1, 'INPUT PARAMETERS (edit yellow cells):');

  addLabel(ws1, 4, 1, 'λ (rate) =');
  const lambdaCell = ws1.getCell('B4');
  lambdaCell.value = 0.5;
  styleInputCell(lambdaCell);
  lambdaCell.numFmt = '0.0000';

  addLabel(ws1, 6, 1, 'COMPUTED VALUES:');

  addLabel(ws1, 7, 1, 'θ (mean) = 1/λ');
  ws1.getCell('B7').value = { formula: '1/B4' }; ws1.getCell('B7').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B7'));

  addLabel(ws1, 8, 1, 'Variance = 1/λ²');
  ws1.getCell('B8').value = { formula: '1/B4^2' }; ws1.getCell('B8').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B8'));

  addLabel(ws1, 9, 1, 'Std Dev = 1/λ');
  ws1.getCell('B9').value = { formula: 'SQRT(B8)' }; ws1.getCell('B9').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B9'));

  addLabel(ws1, 10, 1, 'Median = ln(2)/λ');
  ws1.getCell('B10').value = { formula: 'LN(2)/B4' }; ws1.getCell('B10').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B10'));

  // Excel Function Reference
  addSectionHeader(ws1, 12, 'EXCEL FUNCTION REFERENCE');
  addLabel(ws1, 13, 1, 'Function');
  addLabel(ws1, 13, 2, 'Formula');
  addLabel(ws1, 13, 4, 'Description');

  const funcs = [
    ['PDF f(x)', '=EXPON.DIST(x, λ, FALSE)', 'Probability density at x'],
    ['CDF F(x)', '=EXPON.DIST(x, λ, TRUE)', 'P(X ≤ x)'],
    ['Survival P(X>x)', '=1-EXPON.DIST(x, λ, TRUE)', 'Tail probability'],
    ['Percentile', '=-LN(1-p)/λ', 'Value at percentile p'],
    ['Random Sample', '=-LN(RAND())/λ', 'Generate one sample'],
    ['Memoryless', '=1-EXPON.DIST(t, λ, TRUE)', 'P(X>s+t|X>s) = P(X>t)'],
  ];
  funcs.forEach((f, i) => {
    addLabel(ws1, 14 + i, 1, f[0]);
    addFormulaNote(ws1, 14 + i, 2, f[1]);
    ws1.getCell(14 + i, 4).value = f[2];
    ws1.getCell(14 + i, 4).font = { size: 10, color: { argb: 'FF64748B' } };
  });

  // ---- Sheet 2: PDF & CDF Table ----
  const ws2 = wb.addWorksheet('PDF & CDF Table', { properties: { tabColor: { argb: 'FF3B82F6' } } });
  ws2.columns = [{ width: 10 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 22 }];

  addSectionHeader(ws2, 1, 'PDF & CDF VALUES  (λ from Parameters sheet)', 5);

  ws2.getCell('A2').value = 'x'; ws2.getCell('A2').font = LABEL_FONT;
  ws2.getCell('B2').value = 'PDF f(x)'; ws2.getCell('B2').font = LABEL_FONT;
  ws2.getCell('C2').value = 'CDF F(x)'; ws2.getCell('C2').font = LABEL_FONT;
  ws2.getCell('D2').value = 'P(X > x)'; ws2.getCell('D2').font = LABEL_FONT;
  ws2.getCell('E2').value = 'Excel Formula Used'; ws2.getCell('E2').font = LABEL_FONT;

  for (let i = 0; i <= 40; i++) {
    const row = 3 + i;
    const x = i * 0.25;
    ws2.getCell(row, 1).value = x;
    ws2.getCell(row, 1).numFmt = '0.00';
    ws2.getCell(row, 2).value = { formula: `EXPON.DIST(A${row},Parameters!B4,FALSE)` };
    ws2.getCell(row, 2).numFmt = '0.000000';
    ws2.getCell(row, 3).value = { formula: `EXPON.DIST(A${row},Parameters!B4,TRUE)` };
    ws2.getCell(row, 3).numFmt = '0.000000';
    ws2.getCell(row, 4).value = { formula: `1-C${row}` };
    ws2.getCell(row, 4).numFmt = '0.000000';
    if (i === 0) {
      ws2.getCell(row, 5).value = '=EXPON.DIST(x, λ, FALSE/TRUE)';
      ws2.getCell(row, 5).font = FORMULA_FONT;
    }
    [1, 2, 3, 4].forEach(c => { ws2.getCell(row, c).border = THIN_BORDER; });
  }

  // ---- Sheet 3: Probability Calculator ----
  const ws3 = wb.addWorksheet('Probability Calc', { properties: { tabColor: { argb: 'FFA855F7' } } });
  ws3.columns = [{ width: 30 }, { width: 18 }, { width: 5 }, { width: 30 }, { width: 18 }];

  addSectionHeader(ws3, 1, 'PROBABILITY CALCULATOR', 5);

  addLabel(ws3, 3, 1, 'Using λ from Parameters sheet:');
  ws3.getCell('B3').value = { formula: 'Parameters!B4' }; ws3.getCell('B3').numFmt = '0.0000';

  addLabel(ws3, 5, 1, 'INPUT: Lower bound a =');
  const aCell = ws3.getCell('B5'); aCell.value = 1; styleInputCell(aCell); aCell.numFmt = '0.00';

  addLabel(ws3, 6, 1, 'INPUT: Upper bound b =');
  const bCell = ws3.getCell('B6'); bCell.value = 3; styleInputCell(bCell); bCell.numFmt = '0.00';

  addSectionHeader(ws3, 8, 'RESULTS', 5);

  addLabel(ws3, 9, 1, 'P(X ≤ a) = F(a)');
  ws3.getCell('B9').value = { formula: 'EXPON.DIST(B5,B3,TRUE)' }; ws3.getCell('B9').numFmt = '0.000000';
  styleResultCell(ws3.getCell('B9'));

  addLabel(ws3, 10, 1, 'P(X ≤ b) = F(b)');
  ws3.getCell('B10').value = { formula: 'EXPON.DIST(B6,B3,TRUE)' }; ws3.getCell('B10').numFmt = '0.000000';
  styleResultCell(ws3.getCell('B10'));

  addLabel(ws3, 11, 1, 'P(a < X < b) = F(b) - F(a)');
  ws3.getCell('B11').value = { formula: 'B10-B9' }; ws3.getCell('B11').numFmt = '0.000000';
  styleResultCell(ws3.getCell('B11'));

  addLabel(ws3, 12, 1, 'P(X > b)');
  ws3.getCell('B12').value = { formula: '1-B10' }; ws3.getCell('B12').numFmt = '0.000000';
  styleResultCell(ws3.getCell('B12'));

  // Memoryless property demo
  addSectionHeader(ws3, 14, 'MEMORYLESS PROPERTY DEMO', 5);
  addLabel(ws3, 15, 1, 'Given X > s, find P(X > s+t)');
  addLabel(ws3, 16, 1, 'INPUT: s (already survived) =');
  const sCell = ws3.getCell('B16'); sCell.value = 5; styleInputCell(sCell); sCell.numFmt = '0.00';
  addLabel(ws3, 17, 1, 'INPUT: t (additional time) =');
  const tCell = ws3.getCell('B17'); tCell.value = 3; styleInputCell(tCell); tCell.numFmt = '0.00';

  addLabel(ws3, 19, 1, 'P(X > s+t | X > s) =');
  ws3.getCell('B19').value = { formula: '1-EXPON.DIST(B17,B3,TRUE)' }; ws3.getCell('B19').numFmt = '0.000000';
  styleResultCell(ws3.getCell('B19'));
  addLabel(ws3, 20, 1, 'P(X > t) =');
  ws3.getCell('B20').value = { formula: '1-EXPON.DIST(B17,B3,TRUE)' }; ws3.getCell('B20').numFmt = '0.000000';
  styleResultCell(ws3.getCell('B20'));
  addLabel(ws3, 21, 1, 'They are equal! ✓');
  ws3.getCell('B21').value = { formula: 'IF(ABS(B19-B20)<0.0001,"CONFIRMED ✓","Check values")' };
  ws3.getCell('B21').font = { bold: true, color: { argb: 'FF16A34A' } };

  // ---- Sheet 4: Monte Carlo Simulation ----
  const ws4 = wb.addWorksheet('Monte Carlo Sim', { properties: { tabColor: { argb: 'FFF97316' } } });
  ws4.columns = [{ width: 8 }, { width: 18 }, { width: 18 }, { width: 5 }, { width: 22 }, { width: 18 }];

  addSectionHeader(ws4, 1, 'MONTE CARLO SIMULATION  (Press F9 to regenerate!)');

  addLabel(ws4, 3, 1, '#');
  addLabel(ws4, 3, 2, 'Random Sample');
  addLabel(ws4, 3, 3, 'Formula');

  for (let i = 0; i < 1000; i++) {
    const row = 4 + i;
    ws4.getCell(row, 1).value = i + 1;
    ws4.getCell(row, 2).value = { formula: `-LN(RAND())/Parameters!$B$4` };
    ws4.getCell(row, 2).numFmt = '0.0000';
    if (i === 0) {
      ws4.getCell(row, 3).value = '=-LN(RAND())/λ';
      ws4.getCell(row, 3).font = FORMULA_FONT;
    }
  }

  // Summary statistics
  addLabel(ws4, 3, 5, 'SUMMARY STATISTICS');
  ws4.getCell('E3').fill = SECTION_FILL;
  ws4.getCell('F3').fill = SECTION_FILL;

  const stats = [
    ['Sample Size', '=COUNT(B4:B1003)'],
    ['Sample Mean', '=AVERAGE(B4:B1003)'],
    ['Theoretical Mean', '=Parameters!B7'],
    ['Sample Variance', '=VAR.P(B4:B1003)'],
    ['Theoretical Variance', '=Parameters!B8'],
    ['Sample Std Dev', '=STDEV.P(B4:B1003)'],
    ['Theoretical Std Dev', '=Parameters!B9'],
    ['Sample Min', '=MIN(B4:B1003)'],
    ['Sample Max', '=MAX(B4:B1003)'],
    ['Sample Median', '=MEDIAN(B4:B1003)'],
    ['Theoretical Median', '=Parameters!B10'],
    ['% within 1 StdDev', '=COUNTIF(B4:B1003,"<="&F7)/1000'],
  ];
  stats.forEach((s, i) => {
    addLabel(ws4, 4 + i, 5, s[0]);
    ws4.getCell(4 + i, 6).value = { formula: s[1] };
    ws4.getCell(4 + i, 6).numFmt = '0.0000';
    if (s[0].startsWith('Theoretical')) {
      ws4.getCell(4 + i, 6).font = { color: { argb: 'FF3B82F6' } };
    }
  });

  // ---- Sheet 5: Insurance Application ----
  const ws5 = wb.addWorksheet('Insurance Claims', { properties: { tabColor: { argb: 'FFEF4444' } } });
  ws5.columns = [{ width: 30 }, { width: 18 }, { width: 5 }, { width: 30 }, { width: 18 }];

  addSectionHeader(ws5, 1, 'ACTUARIAL APPLICATION: Claims Interarrival Times', 5);

  ws5.getCell('A3').value = 'Scenario: An insurance company receives claims at a Poisson rate.';
  ws5.getCell('A3').font = { italic: true, size: 10 };
  ws5.mergeCells('A3:E3');
  ws5.getCell('A4').value = 'The time between claims follows an Exponential distribution.';
  ws5.getCell('A4').font = { italic: true, size: 10 };
  ws5.mergeCells('A4:E4');

  addLabel(ws5, 6, 1, 'INPUT: Claims per day =');
  const claimsCell = ws5.getCell('B6'); claimsCell.value = 8; styleInputCell(claimsCell);

  addLabel(ws5, 7, 1, 'Mean time between claims (hours) =');
  ws5.getCell('B7').value = { formula: '24/B6' }; ws5.getCell('B7').numFmt = '0.00';
  styleResultCell(ws5.getCell('B7'));

  addLabel(ws5, 8, 1, 'λ (claims per hour) =');
  ws5.getCell('B8').value = { formula: 'B6/24' }; ws5.getCell('B8').numFmt = '0.0000';
  styleResultCell(ws5.getCell('B8'));

  addSectionHeader(ws5, 10, 'KEY QUESTIONS', 5);

  addLabel(ws5, 11, 1, 'P(next claim within 1 hour) =');
  ws5.getCell('B11').value = { formula: 'EXPON.DIST(1,B8,TRUE)' }; ws5.getCell('B11').numFmt = '0.00%';
  styleResultCell(ws5.getCell('B11'));

  addLabel(ws5, 12, 1, 'P(next claim within 30 min) =');
  ws5.getCell('B12').value = { formula: 'EXPON.DIST(0.5,B8,TRUE)' }; ws5.getCell('B12').numFmt = '0.00%';
  styleResultCell(ws5.getCell('B12'));

  addLabel(ws5, 13, 1, 'P(wait > 4 hours between claims) =');
  ws5.getCell('B13').value = { formula: '1-EXPON.DIST(4,B8,TRUE)' }; ws5.getCell('B13').numFmt = '0.00%';
  styleResultCell(ws5.getCell('B13'));

  addLabel(ws5, 14, 1, 'Median wait time (hours) =');
  ws5.getCell('B14').value = { formula: 'LN(2)/B8' }; ws5.getCell('B14').numFmt = '0.00';
  styleResultCell(ws5.getCell('B14'));

  addLabel(ws5, 15, 1, '90th percentile wait (hours) =');
  ws5.getCell('B15').value = { formula: '-LN(1-0.9)/B8' }; ws5.getCell('B15').numFmt = '0.00';
  styleResultCell(ws5.getCell('B15'));

  addSectionHeader(ws5, 17, 'DEDUCTIBLE ANALYSIS', 5);
  addLabel(ws5, 18, 1, 'If claims arrive randomly and each has');
  addLabel(ws5, 19, 1, 'an exponential severity with mean:');
  addLabel(ws5, 19, 4, 'Deductible ($) =');
  const dedCell = ws5.getCell('E19'); dedCell.value = 500; styleInputCell(dedCell); dedCell.numFmt = '$#,##0';

  addLabel(ws5, 20, 1, 'INPUT: Mean claim severity ($) =');
  const sevCell = ws5.getCell('B20'); sevCell.value = 2000; styleInputCell(sevCell); sevCell.numFmt = '$#,##0';

  addLabel(ws5, 22, 1, '% claims below deductible =');
  ws5.getCell('B22').value = { formula: 'EXPON.DIST(E19,1/B20,TRUE)' }; ws5.getCell('B22').numFmt = '0.00%';
  styleResultCell(ws5.getCell('B22'));

  addLabel(ws5, 23, 1, '% claims above deductible =');
  ws5.getCell('B23').value = { formula: '1-B22' }; ws5.getCell('B23').numFmt = '0.00%';
  styleResultCell(ws5.getCell('B23'));

  addLabel(ws5, 24, 1, 'E[payment per claim | X > d] =');
  ws5.getCell('B24').value = { formula: 'B20' }; ws5.getCell('B24').numFmt = '$#,##0.00';
  styleResultCell(ws5.getCell('B24'));
  ws5.getCell('D24').value = '(Memoryless! E[X-d|X>d] = θ)';
  ws5.getCell('D24').font = { italic: true, color: { argb: 'FFCA8A04' }, size: 10 };

  // Save
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'ExamP_Exponential_Template.xlsx');
}

// ============================================================
// GAMMA DISTRIBUTION WORKBOOK
// ============================================================
export async function generateGammaWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Exam P Trainer - FrontierMinds';
  wb.created = new Date();

  // ---- Sheet 1: Parameters ----
  const ws1 = wb.addWorksheet('Parameters', { properties: { tabColor: { argb: 'FF3B82F6' } } });
  ws1.columns = [{ width: 30 }, { width: 18 }, { width: 5 }, { width: 30 }, { width: 18 }, { width: 20 }];

  addSectionHeader(ws1, 1, 'GAMMA DISTRIBUTION - Parameters & Key Formulas');

  addLabel(ws1, 3, 1, 'INPUT PARAMETERS (edit yellow cells):');

  addLabel(ws1, 4, 1, 'α (shape) =');
  const alphaCell = ws1.getCell('B4'); alphaCell.value = 3; styleInputCell(alphaCell); alphaCell.numFmt = '0.00';

  addLabel(ws1, 5, 1, 'β (scale) =');
  const betaCell = ws1.getCell('B5'); betaCell.value = 2; styleInputCell(betaCell); betaCell.numFmt = '0.00';

  addLabel(ws1, 7, 1, 'COMPUTED VALUES:');

  addLabel(ws1, 8, 1, 'Mean = αβ');
  ws1.getCell('B8').value = { formula: 'B4*B5' }; ws1.getCell('B8').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B8'));

  addLabel(ws1, 9, 1, 'Variance = αβ²');
  ws1.getCell('B9').value = { formula: 'B4*B5^2' }; ws1.getCell('B9').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B9'));

  addLabel(ws1, 10, 1, 'Std Dev = β√α');
  ws1.getCell('B10').value = { formula: 'SQRT(B9)' }; ws1.getCell('B10').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B10'));

  addLabel(ws1, 11, 1, 'Γ(α) =');
  ws1.getCell('B11').value = { formula: 'EXP(GAMMALN(B4))' }; ws1.getCell('B11').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B11'));

  // Excel Function Reference
  addSectionHeader(ws1, 13, 'EXCEL FUNCTION REFERENCE');
  const funcs = [
    ['PDF f(x)', '=GAMMA.DIST(x, α, β, FALSE)', 'Probability density at x'],
    ['CDF F(x)', '=GAMMA.DIST(x, α, β, TRUE)', 'P(X ≤ x)'],
    ['Inverse / Percentile', '=GAMMA.INV(p, α, β)', 'Value at percentile p'],
    ['Gamma Function Γ(α)', '=EXP(GAMMALN(α))', 'Gamma function value'],
    ['Log-Gamma ln Γ(α)', '=GAMMALN(α)', 'Natural log of Γ(α)'],
    ['Random Sample', '=GAMMA.INV(RAND(), α, β)', 'Generate one sample'],
  ];
  addLabel(ws1, 14, 1, 'Function'); addLabel(ws1, 14, 2, 'Formula'); addLabel(ws1, 14, 4, 'Description');
  funcs.forEach((f, i) => {
    addLabel(ws1, 15 + i, 1, f[0]);
    addFormulaNote(ws1, 15 + i, 2, f[1]);
    ws1.getCell(15 + i, 4).value = f[2];
    ws1.getCell(15 + i, 4).font = { size: 10, color: { argb: 'FF64748B' } };
  });

  // Special cases
  addSectionHeader(ws1, 22, 'SPECIAL CASES & RELATIONSHIPS');
  const specials = [
    ['Gamma(1, β) = Exponential(θ = β)', 'α = 1 → Exponential distribution'],
    ['Gamma(r/2, 2) = Chi-Square(r)', 'β = 2, α = r/2 → Chi-Square'],
    ['Sum of α iid Exp(β)', 'X₁+...+Xₐ where Xᵢ ~ Exp(β)'],
    ['Gamma(α₁,β) + Gamma(α₂,β)', '= Gamma(α₁+α₂, β) [same β only!]'],
  ];
  specials.forEach((s, i) => {
    addLabel(ws1, 23 + i, 1, s[0]);
    ws1.getCell(23 + i, 4).value = s[1];
    ws1.getCell(23 + i, 4).font = { italic: true, size: 10, color: { argb: 'FF64748B' } };
  });

  // ---- Sheet 2: PDF & CDF Table ----
  const ws2 = wb.addWorksheet('PDF & CDF Table', { properties: { tabColor: { argb: 'FFA855F7' } } });
  ws2.columns = [{ width: 10 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 22 }];

  addSectionHeader(ws2, 1, 'PDF & CDF VALUES  (α, β from Parameters sheet)', 5);

  ws2.getCell('A2').value = 'x'; ws2.getCell('A2').font = LABEL_FONT;
  ws2.getCell('B2').value = 'PDF f(x)'; ws2.getCell('B2').font = LABEL_FONT;
  ws2.getCell('C2').value = 'CDF F(x)'; ws2.getCell('C2').font = LABEL_FONT;
  ws2.getCell('D2').value = 'P(X > x)'; ws2.getCell('D2').font = LABEL_FONT;

  for (let i = 0; i <= 50; i++) {
    const row = 3 + i;
    const x = i * 0.5;
    ws2.getCell(row, 1).value = x; ws2.getCell(row, 1).numFmt = '0.0';
    ws2.getCell(row, 2).value = { formula: `GAMMA.DIST(A${row},Parameters!B4,Parameters!B5,FALSE)` };
    ws2.getCell(row, 2).numFmt = '0.000000';
    ws2.getCell(row, 3).value = { formula: `GAMMA.DIST(A${row},Parameters!B4,Parameters!B5,TRUE)` };
    ws2.getCell(row, 3).numFmt = '0.000000';
    ws2.getCell(row, 4).value = { formula: `1-C${row}` };
    ws2.getCell(row, 4).numFmt = '0.000000';
    [1, 2, 3, 4].forEach(c => { ws2.getCell(row, c).border = THIN_BORDER; });
  }

  // ---- Sheet 3: Monte Carlo ----
  const ws3 = wb.addWorksheet('Monte Carlo Sim', { properties: { tabColor: { argb: 'FFF97316' } } });
  ws3.columns = [{ width: 8 }, { width: 18 }, { width: 18 }, { width: 5 }, { width: 22 }, { width: 18 }];

  addSectionHeader(ws3, 1, 'MONTE CARLO SIMULATION  (Press F9 to regenerate!)');

  addLabel(ws3, 3, 1, '#'); addLabel(ws3, 3, 2, 'Random Sample'); addLabel(ws3, 3, 3, 'Formula');

  for (let i = 0; i < 1000; i++) {
    const row = 4 + i;
    ws3.getCell(row, 1).value = i + 1;
    ws3.getCell(row, 2).value = { formula: `GAMMA.INV(RAND(),Parameters!$B$4,Parameters!$B$5)` };
    ws3.getCell(row, 2).numFmt = '0.0000';
    if (i === 0) {
      ws3.getCell(row, 3).value = '=GAMMA.INV(RAND(), α, β)';
      ws3.getCell(row, 3).font = FORMULA_FONT;
    }
  }

  // Summary
  addLabel(ws3, 3, 5, 'SUMMARY STATISTICS');
  ws3.getCell('E3').fill = SECTION_FILL; ws3.getCell('F3').fill = SECTION_FILL;
  const gstats = [
    ['Sample Size', '=COUNT(B4:B1003)'],
    ['Sample Mean', '=AVERAGE(B4:B1003)'],
    ['Theoretical Mean (αβ)', '=Parameters!B8'],
    ['Sample Variance', '=VAR.P(B4:B1003)'],
    ['Theoretical Variance (αβ²)', '=Parameters!B9'],
    ['Sample Std Dev', '=STDEV.P(B4:B1003)'],
    ['Theoretical Std Dev', '=Parameters!B10'],
    ['Sample Min', '=MIN(B4:B1003)'],
    ['Sample Max', '=MAX(B4:B1003)'],
    ['Sample Median', '=MEDIAN(B4:B1003)'],
  ];
  gstats.forEach((s, i) => {
    addLabel(ws3, 4 + i, 5, s[0]);
    ws3.getCell(4 + i, 6).value = { formula: s[1] };
    ws3.getCell(4 + i, 6).numFmt = '0.0000';
    if (s[0].startsWith('Theoretical')) ws3.getCell(4 + i, 6).font = { color: { argb: 'FF3B82F6' } };
  });

  // ---- Sheet 4: Aggregate Claims Application ----
  const ws4 = wb.addWorksheet('Aggregate Claims', { properties: { tabColor: { argb: 'FFEF4444' } } });
  ws4.columns = [{ width: 35 }, { width: 18 }, { width: 5 }, { width: 30 }, { width: 18 }];

  addSectionHeader(ws4, 1, 'ACTUARIAL APPLICATION: Aggregate Claims Model', 5);

  ws4.getCell('A3').value = 'Scenario: Model the total time to process α claims, where each';
  ws4.getCell('A3').font = { italic: true, size: 10 }; ws4.mergeCells('A3:E3');
  ws4.getCell('A4').value = 'individual processing time is Exponential with mean β hours.';
  ws4.getCell('A4').font = { italic: true, size: 10 }; ws4.mergeCells('A4:E4');

  addLabel(ws4, 6, 1, 'INPUT: Number of claims (α) =');
  const ncCell = ws4.getCell('B6'); ncCell.value = 5; styleInputCell(ncCell);
  addLabel(ws4, 7, 1, 'INPUT: Mean time per claim (β hours) =');
  const mtCell = ws4.getCell('B7'); mtCell.value = 2; styleInputCell(mtCell); mtCell.numFmt = '0.00';

  addSectionHeader(ws4, 9, 'TOTAL PROCESSING TIME ~ Gamma(α, β)', 5);

  addLabel(ws4, 10, 1, 'Expected total time (hours) =');
  ws4.getCell('B10').value = { formula: 'B6*B7' }; ws4.getCell('B10').numFmt = '0.00';
  styleResultCell(ws4.getCell('B10'));

  addLabel(ws4, 11, 1, 'Std Dev of total time (hours) =');
  ws4.getCell('B11').value = { formula: 'B7*SQRT(B6)' }; ws4.getCell('B11').numFmt = '0.00';
  styleResultCell(ws4.getCell('B11'));

  addLabel(ws4, 13, 1, 'P(finish all claims within 8 hours) =');
  ws4.getCell('B13').value = { formula: 'GAMMA.DIST(8,B6,B7,TRUE)' }; ws4.getCell('B13').numFmt = '0.00%';
  styleResultCell(ws4.getCell('B13'));

  addLabel(ws4, 14, 1, 'P(finish all claims within 12 hours) =');
  ws4.getCell('B14').value = { formula: 'GAMMA.DIST(12,B6,B7,TRUE)' }; ws4.getCell('B14').numFmt = '0.00%';
  styleResultCell(ws4.getCell('B14'));

  addLabel(ws4, 15, 1, '95th percentile time (hours) =');
  ws4.getCell('B15').value = { formula: 'GAMMA.INV(0.95,B6,B7)' }; ws4.getCell('B15').numFmt = '0.00';
  styleResultCell(ws4.getCell('B15'));

  addLabel(ws4, 16, 1, '99th percentile time (hours) =');
  ws4.getCell('B16').value = { formula: 'GAMMA.INV(0.99,B6,B7)' }; ws4.getCell('B16').numFmt = '0.00';
  styleResultCell(ws4.getCell('B16'));

  addSectionHeader(ws4, 18, 'SENSITIVITY: How does # of claims affect total time?', 5);
  addLabel(ws4, 19, 1, 'Claims'); addLabel(ws4, 19, 2, 'Mean Time');
  addLabel(ws4, 19, 4, 'P(≤12 hrs)'); addLabel(ws4, 19, 5, '95th Pctile');
  for (let n = 1; n <= 10; n++) {
    const row = 19 + n;
    ws4.getCell(row, 1).value = n;
    ws4.getCell(row, 2).value = { formula: `${n}*B7` }; ws4.getCell(row, 2).numFmt = '0.00';
    ws4.getCell(row, 4).value = { formula: `GAMMA.DIST(12,${n},B7,TRUE)` }; ws4.getCell(row, 4).numFmt = '0.00%';
    ws4.getCell(row, 5).value = { formula: `GAMMA.INV(0.95,${n},B7)` }; ws4.getCell(row, 5).numFmt = '0.00';
    [1, 2, 4, 5].forEach(c => { ws4.getCell(row, c).border = THIN_BORDER; });
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'ExamP_Gamma_Template.xlsx');
}

// ============================================================
// CHI-SQUARE DISTRIBUTION WORKBOOK
// ============================================================
export async function generateChiSquareWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Exam P Trainer - FrontierMinds';
  wb.created = new Date();

  // ---- Sheet 1: Parameters ----
  const ws1 = wb.addWorksheet('Parameters', { properties: { tabColor: { argb: 'FFF97316' } } });
  ws1.columns = [{ width: 30 }, { width: 18 }, { width: 5 }, { width: 30 }, { width: 18 }, { width: 20 }];

  addSectionHeader(ws1, 1, 'CHI-SQUARE DISTRIBUTION - Parameters & Key Formulas');

  addLabel(ws1, 3, 1, 'INPUT PARAMETERS (edit yellow cells):');
  addLabel(ws1, 4, 1, 'r (degrees of freedom) =');
  const rCell = ws1.getCell('B4'); rCell.value = 6; styleInputCell(rCell);

  addLabel(ws1, 6, 1, 'COMPUTED VALUES:');
  addLabel(ws1, 7, 1, 'Mean = r');
  ws1.getCell('B7').value = { formula: 'B4' }; ws1.getCell('B7').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B7'));

  addLabel(ws1, 8, 1, 'Variance = 2r');
  ws1.getCell('B8').value = { formula: '2*B4' }; ws1.getCell('B8').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B8'));

  addLabel(ws1, 9, 1, 'Std Dev = √(2r)');
  ws1.getCell('B9').value = { formula: 'SQRT(2*B4)' }; ws1.getCell('B9').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B9'));

  addLabel(ws1, 10, 1, 'Gamma α = r/2');
  ws1.getCell('B10').value = { formula: 'B4/2' }; ws1.getCell('B10').numFmt = '0.00';
  styleResultCell(ws1.getCell('B10'));

  addLabel(ws1, 11, 1, 'Gamma β = 2 (always)');
  ws1.getCell('B11').value = 2;
  styleResultCell(ws1.getCell('B11'));

  addLabel(ws1, 12, 1, 'Variance/Mean ratio (always 2)');
  ws1.getCell('B12').value = { formula: 'B8/B7' }; ws1.getCell('B12').numFmt = '0.00';
  styleResultCell(ws1.getCell('B12'));

  // Excel Function Reference
  addSectionHeader(ws1, 14, 'EXCEL FUNCTION REFERENCE');
  const funcs = [
    ['PDF f(x)', '=CHISQ.DIST(x, r, FALSE)', 'Probability density at x'],
    ['CDF F(x)', '=CHISQ.DIST(x, r, TRUE)', 'P(X ≤ x)'],
    ['Right tail P(X>x)', '=CHISQ.DIST.RT(x, r)', 'Right-tail probability'],
    ['Inverse / Percentile', '=CHISQ.INV(p, r)', 'Value at percentile p'],
    ['Right-tail Inverse', '=CHISQ.INV.RT(p, r)', 'Value where P(X>x) = p'],
    ['Random Sample', '=CHISQ.INV(RAND(), r)', 'Generate one sample'],
    ['Alt: via Gamma', '=GAMMA.INV(RAND(), r/2, 2)', 'Same result, Gamma form'],
  ];
  addLabel(ws1, 15, 1, 'Function'); addLabel(ws1, 15, 2, 'Formula'); addLabel(ws1, 15, 4, 'Description');
  funcs.forEach((f, i) => {
    addLabel(ws1, 16 + i, 1, f[0]);
    addFormulaNote(ws1, 16 + i, 2, f[1]);
    ws1.getCell(16 + i, 4).value = f[2];
    ws1.getCell(16 + i, 4).font = { size: 10, color: { argb: 'FF64748B' } };
  });

  // ---- Sheet 2: PDF & CDF Table ----
  const ws2 = wb.addWorksheet('PDF & CDF Table', { properties: { tabColor: { argb: 'FFA855F7' } } });
  ws2.columns = [{ width: 10 }, { width: 18 }, { width: 18 }, { width: 18 }];

  addSectionHeader(ws2, 1, 'PDF & CDF VALUES  (r from Parameters sheet)', 4);

  ws2.getCell('A2').value = 'x'; ws2.getCell('A2').font = LABEL_FONT;
  ws2.getCell('B2').value = 'PDF f(x)'; ws2.getCell('B2').font = LABEL_FONT;
  ws2.getCell('C2').value = 'CDF F(x)'; ws2.getCell('C2').font = LABEL_FONT;
  ws2.getCell('D2').value = 'P(X > x)'; ws2.getCell('D2').font = LABEL_FONT;

  for (let i = 0; i <= 60; i++) {
    const row = 3 + i;
    const x = i * 0.5;
    ws2.getCell(row, 1).value = x; ws2.getCell(row, 1).numFmt = '0.0';
    ws2.getCell(row, 2).value = { formula: `CHISQ.DIST(A${row},Parameters!B4,FALSE)` };
    ws2.getCell(row, 2).numFmt = '0.000000';
    ws2.getCell(row, 3).value = { formula: `CHISQ.DIST(A${row},Parameters!B4,TRUE)` };
    ws2.getCell(row, 3).numFmt = '0.000000';
    ws2.getCell(row, 4).value = { formula: `1-C${row}` };
    ws2.getCell(row, 4).numFmt = '0.000000';
    [1, 2, 3, 4].forEach(c => { ws2.getCell(row, c).border = THIN_BORDER; });
  }

  // ---- Sheet 3: Critical Values Table ----
  const ws3 = wb.addWorksheet('Critical Values', { properties: { tabColor: { argb: 'FF22C55E' } } });
  ws3.columns = [{ width: 8 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }];

  addSectionHeader(ws3, 1, 'CHI-SQUARE CRITICAL VALUES TABLE', 7);

  ws3.getCell('A2').value = 'df \\ α'; ws3.getCell('A2').font = LABEL_FONT;
  const alphas = [0.10, 0.05, 0.025, 0.01, 0.005, 0.001];
  alphas.forEach((a, i) => {
    ws3.getCell(2, 2 + i).value = a;
    ws3.getCell(2, 2 + i).font = LABEL_FONT;
    ws3.getCell(2, 2 + i).numFmt = '0.000';
  });

  for (let df = 1; df <= 30; df++) {
    const row = 2 + df;
    ws3.getCell(row, 1).value = df;
    ws3.getCell(row, 1).font = LABEL_FONT;
    alphas.forEach((a, i) => {
      ws3.getCell(row, 2 + i).value = { formula: `CHISQ.INV.RT(${a},${df})` };
      ws3.getCell(row, 2 + i).numFmt = '0.000';
      ws3.getCell(row, 2 + i).border = THIN_BORDER;
    });
  }

  // ---- Sheet 4: Monte Carlo ----
  const ws4 = wb.addWorksheet('Monte Carlo Sim', { properties: { tabColor: { argb: 'FFF97316' } } });
  ws4.columns = [{ width: 8 }, { width: 18 }, { width: 18 }, { width: 5 }, { width: 22 }, { width: 18 }];

  addSectionHeader(ws4, 1, 'MONTE CARLO SIMULATION  (Press F9 to regenerate!)');

  addLabel(ws4, 3, 1, '#'); addLabel(ws4, 3, 2, 'Random Sample'); addLabel(ws4, 3, 3, 'Formula');

  for (let i = 0; i < 1000; i++) {
    const row = 4 + i;
    ws4.getCell(row, 1).value = i + 1;
    ws4.getCell(row, 2).value = { formula: `CHISQ.INV(RAND(),Parameters!$B$4)` };
    ws4.getCell(row, 2).numFmt = '0.0000';
    if (i === 0) {
      ws4.getCell(row, 3).value = '=CHISQ.INV(RAND(), r)';
      ws4.getCell(row, 3).font = FORMULA_FONT;
    }
  }

  addLabel(ws4, 3, 5, 'SUMMARY STATISTICS');
  ws4.getCell('E3').fill = SECTION_FILL; ws4.getCell('F3').fill = SECTION_FILL;
  const stats = [
    ['Sample Size', '=COUNT(B4:B1003)'],
    ['Sample Mean', '=AVERAGE(B4:B1003)'],
    ['Theoretical Mean (r)', '=Parameters!B7'],
    ['Sample Variance', '=VAR.P(B4:B1003)'],
    ['Theoretical Variance (2r)', '=Parameters!B8'],
    ['Var/Mean Ratio', '=E8/E6'],
    ['Theoretical Ratio', '=2'],
    ['Sample Std Dev', '=STDEV.P(B4:B1003)'],
    ['Sample Min', '=MIN(B4:B1003)'],
    ['Sample Max', '=MAX(B4:B1003)'],
  ];
  stats.forEach((s, i) => {
    addLabel(ws4, 4 + i, 5, s[0]);
    ws4.getCell(4 + i, 6).value = { formula: s[1] };
    ws4.getCell(4 + i, 6).numFmt = '0.0000';
    if (s[0].startsWith('Theoretical')) ws4.getCell(4 + i, 6).font = { color: { argb: 'FF3B82F6' } };
  });

  // ---- Sheet 5: Additive Property Demo ----
  const ws5 = wb.addWorksheet('Additive Property', { properties: { tabColor: { argb: 'FFEF4444' } } });
  ws5.columns = [{ width: 30 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 20 }];

  addSectionHeader(ws5, 1, 'CHI-SQUARE ADDITIVE PROPERTY DEMO', 5);

  ws5.getCell('A3').value = 'Demonstrate: χ²(r₁) + χ²(r₂) = χ²(r₁ + r₂)';
  ws5.getCell('A3').font = { italic: true, size: 10 }; ws5.mergeCells('A3:E3');

  addLabel(ws5, 5, 1, 'INPUT: r₁ =');
  const r1Cell = ws5.getCell('B5'); r1Cell.value = 3; styleInputCell(r1Cell);
  addLabel(ws5, 6, 1, 'INPUT: r₂ =');
  const r2Cell = ws5.getCell('B6'); r2Cell.value = 5; styleInputCell(r2Cell);
  addLabel(ws5, 7, 1, 'r₁ + r₂ =');
  ws5.getCell('B7').value = { formula: 'B5+B6' }; styleResultCell(ws5.getCell('B7'));

  addLabel(ws5, 9, 1, '#');
  addLabel(ws5, 9, 2, 'X₁ ~ χ²(r₁)');
  addLabel(ws5, 9, 3, 'X₂ ~ χ²(r₂)');
  addLabel(ws5, 9, 4, 'X₁ + X₂');
  addLabel(ws5, 9, 5, 'Y ~ χ²(r₁+r₂)');

  for (let i = 0; i < 500; i++) {
    const row = 10 + i;
    ws5.getCell(row, 1).value = i + 1;
    ws5.getCell(row, 2).value = { formula: `CHISQ.INV(RAND(),$B$5)` }; ws5.getCell(row, 2).numFmt = '0.000';
    ws5.getCell(row, 3).value = { formula: `CHISQ.INV(RAND(),$B$6)` }; ws5.getCell(row, 3).numFmt = '0.000';
    ws5.getCell(row, 4).value = { formula: `B${row}+C${row}` }; ws5.getCell(row, 4).numFmt = '0.000';
    ws5.getCell(row, 5).value = { formula: `CHISQ.INV(RAND(),$B$7)` }; ws5.getCell(row, 5).numFmt = '0.000';
  }

  // Comparison stats
  addSectionHeader(ws5, 3, '', 5);
  ws5.getCell('D5').value = 'Sum X₁+X₂'; ws5.getCell('D5').font = LABEL_FONT;
  ws5.getCell('E5').value = 'Direct χ²(r₁+r₂)'; ws5.getCell('E5').font = LABEL_FONT;
  ws5.getCell('D6').value = { formula: 'AVERAGE(D10:D509)' }; ws5.getCell('D6').numFmt = '0.000';
  ws5.getCell('E6').value = { formula: 'AVERAGE(E10:E509)' }; ws5.getCell('E6').numFmt = '0.000';
  ws5.getCell('C6').value = 'Mean →'; ws5.getCell('C6').font = LABEL_FONT;
  ws5.getCell('D7').value = { formula: 'VAR.P(D10:D509)' }; ws5.getCell('D7').numFmt = '0.000';
  ws5.getCell('E7').value = { formula: 'VAR.P(E10:E509)' }; ws5.getCell('E7').numFmt = '0.000';
  ws5.getCell('C7').value = 'Var →'; ws5.getCell('C7').font = LABEL_FONT;

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'ExamP_ChiSquare_Template.xlsx');
}

// ============================================================
// NORMAL DISTRIBUTION WORKBOOK
// ============================================================
export async function generateNormalWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Exam P Trainer - FrontierMinds';
  wb.created = new Date();

  // ---- Sheet 1: Parameters & Key Formulas ----
  const ws1 = wb.addWorksheet('Parameters', { properties: { tabColor: { argb: 'FFA855F7' } } });
  ws1.columns = [
    { width: 30 }, { width: 18 }, { width: 5 }, { width: 30 }, { width: 18 }, { width: 20 },
  ];

  addSectionHeader(ws1, 1, 'NORMAL DISTRIBUTION - Parameters & Key Formulas');

  addLabel(ws1, 3, 1, 'INPUT PARAMETERS (edit yellow cells):');

  addLabel(ws1, 4, 1, 'μ (mean) =');
  const muCell = ws1.getCell('B4');
  muCell.value = 0;
  styleInputCell(muCell);
  muCell.numFmt = '0.0000';

  addLabel(ws1, 5, 1, 'σ (standard deviation) =');
  const sigmaCell = ws1.getCell('B5');
  sigmaCell.value = 1;
  styleInputCell(sigmaCell);
  sigmaCell.numFmt = '0.0000';

  addLabel(ws1, 7, 1, 'COMPUTED VALUES:');

  addLabel(ws1, 8, 1, 'Variance σ² =');
  ws1.getCell('B8').value = { formula: 'B5^2' }; ws1.getCell('B8').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B8'));

  addLabel(ws1, 9, 1, 'Median =');
  ws1.getCell('B9').value = { formula: 'B4' }; ws1.getCell('B9').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B9'));

  addLabel(ws1, 10, 1, 'Mode =');
  ws1.getCell('B10').value = { formula: 'B4' }; ws1.getCell('B10').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B10'));

  addLabel(ws1, 11, 1, 'Skewness =');
  ws1.getCell('B11').value = 0; ws1.getCell('B11').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B11'));

  addLabel(ws1, 12, 1, 'Excess Kurtosis =');
  ws1.getCell('B12').value = 0; ws1.getCell('B12').numFmt = '0.0000';
  styleResultCell(ws1.getCell('B12'));

  addLabel(ws1, 13, 1, 'MGF M(t) = exp(μt + σ²t²/2)');

  // Excel Function Reference
  addSectionHeader(ws1, 15, 'EXCEL FUNCTION REFERENCE');
  addLabel(ws1, 16, 1, 'Function');
  addLabel(ws1, 16, 2, 'Formula');
  addLabel(ws1, 16, 4, 'Description');

  const funcs = [
    ['PDF f(x)', '=NORM.DIST(x, μ, σ, FALSE)', 'Probability density at x'],
    ['CDF F(x)', '=NORM.DIST(x, μ, σ, TRUE)', 'P(X ≤ x)'],
    ['Std Normal CDF Φ(z)', '=NORM.S.DIST(z, TRUE)', 'P(Z ≤ z) for Z~N(0,1)'],
    ['Inverse (percentile)', '=NORM.INV(p, μ, σ)', 'Value at percentile p'],
    ['Std Normal Inverse', '=NORM.S.INV(p)', 'z such that Φ(z) = p'],
    ['Random Sample', '=NORM.INV(RAND(), μ, σ)', 'Generate one sample'],
  ];
  funcs.forEach((f, i) => {
    addLabel(ws1, 17 + i, 1, f[0]);
    addFormulaNote(ws1, 17 + i, 2, f[1]);
    ws1.getCell(17 + i, 4).value = f[2];
    ws1.getCell(17 + i, 4).font = { size: 10, color: { argb: 'FF64748B' } };
  });

  // ---- Sheet 2: PDF & CDF Table ----
  const ws2 = wb.addWorksheet('PDF & CDF Table', { properties: { tabColor: { argb: 'FF3B82F6' } } });
  ws2.columns = [{ width: 10 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 22 }];

  addSectionHeader(ws2, 1, 'PDF & CDF VALUES  (μ, σ from Parameters sheet)', 5);

  ws2.getCell('A2').value = 'x'; ws2.getCell('A2').font = LABEL_FONT;
  ws2.getCell('B2').value = 'PDF f(x)'; ws2.getCell('B2').font = LABEL_FONT;
  ws2.getCell('C2').value = 'CDF F(x)'; ws2.getCell('C2').font = LABEL_FONT;
  ws2.getCell('D2').value = 'P(X > x)'; ws2.getCell('D2').font = LABEL_FONT;
  ws2.getCell('E2').value = 'Excel Formula Used'; ws2.getCell('E2').font = LABEL_FONT;

  // x from μ-4σ to μ+4σ in 0.25σ steps (33 rows)
  for (let i = 0; i <= 32; i++) {
    const row = 3 + i;
    // x = μ + (i-16)*0.25*σ = μ-4σ to μ+4σ
    ws2.getCell(row, 1).value = { formula: `Parameters!B4 + (${i - 16}*0.25)*Parameters!B5` };
    ws2.getCell(row, 1).numFmt = '0.00';
    ws2.getCell(row, 2).value = { formula: `NORM.DIST(A${row},Parameters!B4,Parameters!B5,FALSE)` };
    ws2.getCell(row, 2).numFmt = '0.000000';
    ws2.getCell(row, 3).value = { formula: `NORM.DIST(A${row},Parameters!B4,Parameters!B5,TRUE)` };
    ws2.getCell(row, 3).numFmt = '0.000000';
    ws2.getCell(row, 4).value = { formula: `1-C${row}` };
    ws2.getCell(row, 4).numFmt = '0.000000';
    if (i === 0) {
      ws2.getCell(row, 5).value = '=NORM.DIST(x, μ, σ, FALSE/TRUE)';
      ws2.getCell(row, 5).font = FORMULA_FONT;
    }
    [1, 2, 3, 4].forEach(c => { ws2.getCell(row, c).border = THIN_BORDER; });
  }

  // ---- Sheet 3: Z-Score Calculator ----
  const ws3 = wb.addWorksheet('Z-Score Calculator', { properties: { tabColor: { argb: 'FF22C55E' } } });
  ws3.columns = [{ width: 12 }, { width: 16 }, { width: 5 }, { width: 30 }, { width: 18 }];

  addSectionHeader(ws3, 1, 'Z-SCORE CALCULATOR & Z-TABLE', 5);

  addLabel(ws3, 3, 4, 'Standardization Demo:');
  addLabel(ws3, 4, 4, 'INPUT: X value =');
  const xInputCell = ws3.getCell('E4');
  xInputCell.value = 1.5;
  styleInputCell(xInputCell);
  xInputCell.numFmt = '0.00';

  addLabel(ws3, 5, 4, 'Z = (X - μ) / σ =');
  ws3.getCell('E5').value = { formula: '(E4 - Parameters!B4) / Parameters!B5' };
  ws3.getCell('E5').numFmt = '0.0000';
  styleResultCell(ws3.getCell('E5'));

  addLabel(ws3, 6, 4, 'P(X ≤ x) = Φ(z) =');
  ws3.getCell('E6').value = { formula: 'NORM.S.DIST(E5, TRUE)' };
  ws3.getCell('E6').numFmt = '0.000000';
  styleResultCell(ws3.getCell('E6'));

  addLabel(ws3, 7, 4, 'P(X > x) =');
  ws3.getCell('E7').value = { formula: '1 - E6' };
  ws3.getCell('E7').numFmt = '0.000000';
  styleResultCell(ws3.getCell('E7'));

  // Inverse lookup
  addLabel(ws3, 9, 4, 'Inverse Lookup:');
  addLabel(ws3, 10, 4, 'INPUT: probability p =');
  const pInputCell = ws3.getCell('E10');
  pInputCell.value = 0.975;
  styleInputCell(pInputCell);
  pInputCell.numFmt = '0.0000';

  addLabel(ws3, 11, 4, 'z = Φ⁻¹(p) =');
  ws3.getCell('E11').value = { formula: 'NORM.S.INV(E10)' };
  ws3.getCell('E11').numFmt = '0.0000';
  styleResultCell(ws3.getCell('E11'));

  addLabel(ws3, 12, 4, 'X = μ + zσ =');
  ws3.getCell('E12').value = { formula: 'NORM.INV(E10, Parameters!B4, Parameters!B5)' };
  ws3.getCell('E12').numFmt = '0.0000';
  styleResultCell(ws3.getCell('E12'));

  // Mini Z-table: z from -3.4 to 3.4 (rows) with hundredths 0.00-0.09 (cols)
  addLabel(ws3, 3, 1, 'z');
  for (let j = 0; j <= 9; j++) {
    ws3.getCell(3, 2 + j - 1).value = `0.0${j}`;
    ws3.getCell(3, 2 + j - 1).font = LABEL_FONT;
  }
  // Actually let's place the z-table starting at row 15 to not overlap
  addSectionHeader(ws3, 14, 'STANDARD NORMAL Z-TABLE  Φ(z) = P(Z ≤ z)', 11);
  ws3.getCell(15, 1).value = 'z'; ws3.getCell(15, 1).font = LABEL_FONT;
  for (let j = 0; j <= 9; j++) {
    ws3.getCell(15, 2 + j).value = j === 0 ? '0.00' : `0.0${j}`;
    ws3.getCell(15, 2 + j).font = LABEL_FONT;
  }

  // z from -3.4 to 3.4 in steps of 0.1
  for (let i = 0; i <= 68; i++) {
    const zBase = -3.4 + i * 0.1;
    const row = 16 + i;
    ws3.getCell(row, 1).value = parseFloat(zBase.toFixed(1));
    ws3.getCell(row, 1).numFmt = '0.0';
    ws3.getCell(row, 1).font = LABEL_FONT;
    for (let j = 0; j <= 9; j++) {
      const z = zBase + j * 0.01;
      ws3.getCell(row, 2 + j).value = { formula: `NORM.S.DIST(${z.toFixed(2)},TRUE)` };
      ws3.getCell(row, 2 + j).numFmt = '0.0000';
      ws3.getCell(row, 2 + j).border = THIN_BORDER;
    }
  }

  // ---- Sheet 4: Monte Carlo Simulation ----
  const ws4 = wb.addWorksheet('Monte Carlo Sim', { properties: { tabColor: { argb: 'FFF97316' } } });
  ws4.columns = [{ width: 8 }, { width: 18 }, { width: 18 }, { width: 5 }, { width: 22 }, { width: 18 }];

  addSectionHeader(ws4, 1, 'MONTE CARLO SIMULATION  (Press F9 to regenerate!)');

  addLabel(ws4, 3, 1, '#');
  addLabel(ws4, 3, 2, 'X ~ N(μ,σ²)');
  addLabel(ws4, 3, 3, 'Z-score');

  for (let i = 0; i < 1000; i++) {
    const row = 4 + i;
    ws4.getCell(row, 1).value = i + 1;
    ws4.getCell(row, 2).value = { formula: `NORM.INV(RAND(),Parameters!B4,Parameters!B5)` };
    ws4.getCell(row, 2).numFmt = '0.000';
    ws4.getCell(row, 3).value = { formula: `(B${row}-Parameters!B4)/Parameters!B5` };
    ws4.getCell(row, 3).numFmt = '0.000';
  }

  // Summary stats
  addSectionHeader(ws4, 3, '', 3);
  addLabel(ws4, 2, 5, 'Summary Statistics');
  addLabel(ws4, 3, 5, 'Sample Mean');
  ws4.getCell('F3').value = { formula: 'AVERAGE(B4:B1003)' }; ws4.getCell('F3').numFmt = '0.0000';
  styleResultCell(ws4.getCell('F3'));

  addLabel(ws4, 4, 5, 'Sample Variance');
  ws4.getCell('F4').value = { formula: 'VAR.S(B4:B1003)' }; ws4.getCell('F4').numFmt = '0.0000';
  styleResultCell(ws4.getCell('F4'));

  addLabel(ws4, 5, 5, 'Sample Std Dev');
  ws4.getCell('F5').value = { formula: 'STDEV.S(B4:B1003)' }; ws4.getCell('F5').numFmt = '0.0000';
  styleResultCell(ws4.getCell('F5'));

  addLabel(ws4, 7, 5, '% within 1σ');
  ws4.getCell('F7').value = { formula: 'COUNTIFS(B4:B1003,">="&(Parameters!B4-Parameters!B5),B4:B1003,"<="&(Parameters!B4+Parameters!B5))/1000' };
  ws4.getCell('F7').numFmt = '0.00%';
  styleResultCell(ws4.getCell('F7'));

  addLabel(ws4, 8, 5, '% within 2σ');
  ws4.getCell('F8').value = { formula: 'COUNTIFS(B4:B1003,">="&(Parameters!B4-2*Parameters!B5),B4:B1003,"<="&(Parameters!B4+2*Parameters!B5))/1000' };
  ws4.getCell('F8').numFmt = '0.00%';
  styleResultCell(ws4.getCell('F8'));

  addLabel(ws4, 9, 5, '% within 3σ');
  ws4.getCell('F9').value = { formula: 'COUNTIFS(B4:B1003,">="&(Parameters!B4-3*Parameters!B5),B4:B1003,"<="&(Parameters!B4+3*Parameters!B5))/1000' };
  ws4.getCell('F9').numFmt = '0.00%';
  styleResultCell(ws4.getCell('F9'));

  addLabel(ws4, 10, 5, 'Expected: 68.3%, 95.4%, 99.7%');
  ws4.getCell(10, 5).font = { size: 10, color: { argb: 'FF64748B' }, italic: true };

  // ---- Sheet 5: Normal Approximation to Binomial ----
  const ws5 = wb.addWorksheet('Normal Approx Binomial', { properties: { tabColor: { argb: 'FFEF4444' } } });
  ws5.columns = [{ width: 10 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 22 }];

  addSectionHeader(ws5, 1, 'NORMAL APPROXIMATION TO BINOMIAL');

  addLabel(ws5, 3, 1, 'INPUT:');
  addLabel(ws5, 4, 1, 'n (trials) =');
  const nCell = ws5.getCell('B4');
  nCell.value = 100;
  styleInputCell(nCell);

  addLabel(ws5, 5, 1, 'p (probability) =');
  const pCell = ws5.getCell('B5');
  pCell.value = 0.4;
  styleInputCell(pCell);
  pCell.numFmt = '0.0000';

  addLabel(ws5, 7, 1, 'COMPUTED:');
  addLabel(ws5, 8, 1, 'μ = np =');
  ws5.getCell('B8').value = { formula: 'B4*B5' }; ws5.getCell('B8').numFmt = '0.00';
  styleResultCell(ws5.getCell('B8'));

  addLabel(ws5, 9, 1, 'σ = √(npq) =');
  ws5.getCell('B9').value = { formula: 'SQRT(B4*B5*(1-B5))' }; ws5.getCell('B9').numFmt = '0.0000';
  styleResultCell(ws5.getCell('B9'));

  addLabel(ws5, 10, 1, 'np =');
  ws5.getCell('B10').value = { formula: 'B4*B5' }; ws5.getCell('B10').numFmt = '0.0';
  addLabel(ws5, 10, 3, 'nq =');
  ws5.getCell('D10').value = { formula: 'B4*(1-B5)' }; ws5.getCell('D10').numFmt = '0.0';
  addLabel(ws5, 10, 5, 'Rule: np≥5 and nq≥5');

  addLabel(ws5, 11, 1, 'Approx Valid?');
  ws5.getCell('B11').value = { formula: 'IF(AND(B10>=5,D10>=5),"YES ✓","NO - use exact")' };
  ws5.getCell('B11').font = { bold: true, color: { argb: 'FF16A34A' } };

  // Comparison table
  addSectionHeader(ws5, 13, 'EXACT BINOMIAL vs NORMAL APPROXIMATION', 6);
  ws5.getCell('A14').value = 'k'; ws5.getCell('A14').font = LABEL_FONT;
  ws5.getCell('B14').value = 'Exact P(X=k)'; ws5.getCell('B14').font = LABEL_FONT;
  ws5.getCell('C14').value = 'Normal P(X=k)*'; ws5.getCell('C14').font = LABEL_FONT;
  ws5.getCell('D14').value = 'Exact P(X≤k)'; ws5.getCell('D14').font = LABEL_FONT;
  ws5.getCell('E14').value = 'Normal P(X≤k)*'; ws5.getCell('E14').font = LABEL_FONT;
  ws5.getCell('F14').value = 'Error'; ws5.getCell('F14').font = LABEL_FONT;

  // Show k values around μ (from μ-3σ to μ+3σ in steps of 1)
  for (let i = 0; i < 30; i++) {
    const row = 15 + i;
    // k = np - 15 + i (centers around mean)
    ws5.getCell(row, 1).value = { formula: `ROUND(B8,0)-15+${i}` };
    // Exact P(X=k)
    ws5.getCell(row, 2).value = { formula: `IF(AND(A${row}>=0,A${row}<=B4),BINOM.DIST(A${row},B4,B5,FALSE),0)` };
    ws5.getCell(row, 2).numFmt = '0.000000';
    // Normal approx P(X=k) with continuity correction: P(k-0.5 < Y < k+0.5)
    ws5.getCell(row, 3).value = { formula: `NORM.DIST(A${row}+0.5,B8,B9,TRUE)-NORM.DIST(A${row}-0.5,B8,B9,TRUE)` };
    ws5.getCell(row, 3).numFmt = '0.000000';
    // Exact CDF P(X<=k)
    ws5.getCell(row, 4).value = { formula: `IF(AND(A${row}>=0,A${row}<=B4),BINOM.DIST(A${row},B4,B5,TRUE),IF(A${row}<0,0,1))` };
    ws5.getCell(row, 4).numFmt = '0.000000';
    // Normal approx CDF with continuity correction: P(Y <= k+0.5)
    ws5.getCell(row, 5).value = { formula: `NORM.DIST(A${row}+0.5,B8,B9,TRUE)` };
    ws5.getCell(row, 5).numFmt = '0.000000';
    // Error
    ws5.getCell(row, 6).value = { formula: `ABS(D${row}-E${row})` };
    ws5.getCell(row, 6).numFmt = '0.000000';
    [1, 2, 3, 4, 5, 6].forEach(c => { ws5.getCell(row, c).border = THIN_BORDER; });
  }

  ws5.getCell(46, 1).value = '* with continuity correction';
  ws5.getCell(46, 1).font = { size: 9, italic: true, color: { argb: 'FF64748B' } };

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'ExamP_Normal_Distribution_Template.xlsx');
}

// ============================================================
// ADDITIONAL MODELS (BETA, WEIBULL, PARETO) WORKBOOK
// ============================================================
export async function generateAdditionalModelsWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Exam P Trainer - FrontierMinds';
  wb.created = new Date();

  // ---- Sheet 1: Parameters ----
  const ws1 = wb.addWorksheet('Parameters', { properties: { tabColor: { argb: 'FFA855F7' } } });
  ws1.columns = [
    { width: 30 }, { width: 18 }, { width: 5 }, { width: 30 }, { width: 18 }, { width: 20 },
  ];

  addSectionHeader(ws1, 1, 'ADDITIONAL MODELS - Parameters & Key Formulas');

  // Beta panel
  addSectionHeader(ws1, 3, 'BETA DISTRIBUTION  Beta(α, β)');
  addLabel(ws1, 4, 1, 'α (shape 1) =');
  const betaA = ws1.getCell('B4'); betaA.value = 2; styleInputCell(betaA); betaA.numFmt = '0.00';
  addLabel(ws1, 5, 1, 'β (shape 2) =');
  const betaB = ws1.getCell('B5'); betaB.value = 5; styleInputCell(betaB); betaB.numFmt = '0.00';

  addLabel(ws1, 6, 1, 'Mean = α/(α+β)');
  ws1.getCell('B6').value = { formula: 'B4/(B4+B5)' }; ws1.getCell('B6').numFmt = '0.000000'; styleResultCell(ws1.getCell('B6'));
  addLabel(ws1, 7, 1, 'Variance = αβ/((α+β)²(α+β+1))');
  ws1.getCell('B7').value = { formula: '(B4*B5)/((B4+B5)^2*(B4+B5+1))' }; ws1.getCell('B7').numFmt = '0.000000'; styleResultCell(ws1.getCell('B7'));
  addLabel(ws1, 8, 1, 'Mode = (α-1)/(α+β-2)  (α,β>1)');
  ws1.getCell('B8').value = { formula: 'IF(AND(B4>1,B5>1),(B4-1)/(B4+B5-2),"N/A")' }; ws1.getCell('B8').numFmt = '0.000000'; styleResultCell(ws1.getCell('B8'));

  // Weibull panel
  addSectionHeader(ws1, 10, 'WEIBULL DISTRIBUTION  Weibull(k, λ)');
  addLabel(ws1, 11, 1, 'k (shape) =');
  const weibK = ws1.getCell('B11'); weibK.value = 1.5; styleInputCell(weibK); weibK.numFmt = '0.00';
  addLabel(ws1, 12, 1, 'λ (scale) =');
  const weibL = ws1.getCell('B12'); weibL.value = 2; styleInputCell(weibL); weibL.numFmt = '0.00';

  addLabel(ws1, 13, 1, 'Mean = λΓ(1 + 1/k)');
  ws1.getCell('B13').value = { formula: 'B12*EXP(GAMMALN(1+1/B11))' }; ws1.getCell('B13').numFmt = '0.000000'; styleResultCell(ws1.getCell('B13'));
  addLabel(ws1, 14, 1, 'Variance = λ²[Γ(1+2/k) - Γ(1+1/k)²]');
  ws1.getCell('B14').value = { formula: 'B12^2*(EXP(GAMMALN(1+2/B11))-EXP(GAMMALN(1+1/B11))^2)' }; ws1.getCell('B14').numFmt = '0.000000'; styleResultCell(ws1.getCell('B14'));

  // Pareto panel
  addSectionHeader(ws1, 16, 'PARETO DISTRIBUTION (SOA)  Pareto(α, θ)');
  addLabel(ws1, 17, 1, 'α (shape) =');
  const parA = ws1.getCell('B17'); parA.value = 3; styleInputCell(parA); parA.numFmt = '0.00';
  addLabel(ws1, 18, 1, 'θ (scale) =');
  const parT = ws1.getCell('B18'); parT.value = 2000; styleInputCell(parT); parT.numFmt = '0.00';

  addLabel(ws1, 19, 1, 'Mean = θ/(α-1)  (α>1)');
  ws1.getCell('B19').value = { formula: 'IF(B17>1,B18/(B17-1),"undefined")' }; ws1.getCell('B19').numFmt = '0.000000'; styleResultCell(ws1.getCell('B19'));
  addLabel(ws1, 20, 1, 'Variance = αθ²/((α-1)²(α-2))  (α>2)');
  ws1.getCell('B20').value = { formula: 'IF(B17>2,(B17*B18^2)/((B17-1)^2*(B17-2)),"undefined")' }; ws1.getCell('B20').numFmt = '0.000000'; styleResultCell(ws1.getCell('B20'));

  // Excel function reference
  addSectionHeader(ws1, 22, 'EXCEL FUNCTION REFERENCE');
  const funcRef = [
    ['Beta PDF', '=BETA.DIST(x, α, β, FALSE)', 'Probability density at x'],
    ['Beta CDF', '=BETA.DIST(x, α, β, TRUE)', 'P(X ≤ x)'],
    ['Beta Inverse', '=BETA.INV(p, α, β)', 'Value at percentile p'],
    ['Weibull PDF', '=WEIBULL.DIST(x, k, λ, FALSE)', 'Probability density at x'],
    ['Weibull CDF', '=WEIBULL.DIST(x, k, λ, TRUE)', 'P(X ≤ x)'],
    ['Pareto PDF', '=α*θ^α/(x+θ)^(α+1)', 'Manual formula (no built-in)'],
    ['Pareto CDF', '=1-(θ/(x+θ))^α', 'Manual formula (no built-in)'],
    ['Pareto Sample', '=θ*(RAND()^(-1/α)-1)', 'Inverse transform sampling'],
  ];
  addLabel(ws1, 23, 1, 'Function'); addLabel(ws1, 23, 2, 'Formula'); addLabel(ws1, 23, 4, 'Description');
  funcRef.forEach((f, i) => {
    addLabel(ws1, 24 + i, 1, f[0]);
    addFormulaNote(ws1, 24 + i, 2, f[1]);
    ws1.getCell(24 + i, 4).value = f[2];
    ws1.getCell(24 + i, 4).font = { size: 10, color: { argb: 'FF64748B' } };
  });

  // ---- Sheet 2: Beta Distribution ----
  const ws2 = wb.addWorksheet('Beta Distribution', { properties: { tabColor: { argb: 'FF22C55E' } } });
  ws2.columns = [{ width: 10 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 22 }];

  addSectionHeader(ws2, 1, 'BETA DISTRIBUTION  (α, β from Parameters sheet)', 5);
  ws2.getCell('A2').value = 'x'; ws2.getCell('A2').font = LABEL_FONT;
  ws2.getCell('B2').value = 'PDF f(x)'; ws2.getCell('B2').font = LABEL_FONT;
  ws2.getCell('C2').value = 'CDF F(x)'; ws2.getCell('C2').font = LABEL_FONT;
  ws2.getCell('D2').value = '1 - F(x)'; ws2.getCell('D2').font = LABEL_FONT;
  ws2.getCell('E2').value = 'Excel Formula'; ws2.getCell('E2').font = LABEL_FONT;

  for (let i = 0; i <= 20; i++) {
    const row = 3 + i;
    const x = i * 0.05;
    ws2.getCell(row, 1).value = x; ws2.getCell(row, 1).numFmt = '0.00';
    ws2.getCell(row, 2).value = { formula: `IF(AND(A${row}>0,A${row}<1),BETA.DIST(A${row},Parameters!B4,Parameters!B5,FALSE),0)` };
    ws2.getCell(row, 2).numFmt = '0.000000';
    ws2.getCell(row, 3).value = { formula: `BETA.DIST(A${row},Parameters!B4,Parameters!B5,TRUE)` };
    ws2.getCell(row, 3).numFmt = '0.000000';
    ws2.getCell(row, 4).value = { formula: `1-C${row}` }; ws2.getCell(row, 4).numFmt = '0.000000';
    if (i === 0) { ws2.getCell(row, 5).value = '=BETA.DIST(x, α, β, FALSE/TRUE)'; ws2.getCell(row, 5).font = FORMULA_FONT; }
    [1, 2, 3, 4].forEach(c => { ws2.getCell(row, c).border = THIN_BORDER; });
  }

  // Special cases reference
  addSectionHeader(ws2, 25, 'SPECIAL CASES', 5);
  addLabel(ws2, 26, 1, 'Beta(1,1)'); ws2.getCell('B26').value = '= Uniform(0,1)';
  addLabel(ws2, 27, 1, 'Beta(½,½)'); ws2.getCell('B27').value = '= Arcsine distribution';
  addLabel(ws2, 28, 1, 'Beta(α,β) with α=β'); ws2.getCell('B28').value = '= Symmetric about 0.5';

  // ---- Sheet 3: Weibull Distribution ----
  const ws3 = wb.addWorksheet('Weibull Distribution', { properties: { tabColor: { argb: 'FF3B82F6' } } });
  ws3.columns = [{ width: 10 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 22 }];

  addSectionHeader(ws3, 1, 'WEIBULL DISTRIBUTION  (k, λ from Parameters sheet)');
  ws3.getCell('A2').value = 'x'; ws3.getCell('A2').font = LABEL_FONT;
  ws3.getCell('B2').value = 'PDF f(x)'; ws3.getCell('B2').font = LABEL_FONT;
  ws3.getCell('C2').value = 'CDF F(x)'; ws3.getCell('C2').font = LABEL_FONT;
  ws3.getCell('D2').value = 'R(x)=1-F(x)'; ws3.getCell('D2').font = LABEL_FONT;
  ws3.getCell('E2').value = 'h(x)=f(x)/R(x)'; ws3.getCell('E2').font = LABEL_FONT;
  ws3.getCell('F2').value = 'Excel Formula'; ws3.getCell('F2').font = LABEL_FONT;

  for (let i = 0; i <= 40; i++) {
    const row = 3 + i;
    const x = i * 0.25;
    ws3.getCell(row, 1).value = x; ws3.getCell(row, 1).numFmt = '0.00';
    ws3.getCell(row, 2).value = { formula: `IF(A${row}>0,WEIBULL.DIST(A${row},Parameters!B11,Parameters!B12,FALSE),0)` };
    ws3.getCell(row, 2).numFmt = '0.000000';
    ws3.getCell(row, 3).value = { formula: `WEIBULL.DIST(A${row},Parameters!B11,Parameters!B12,TRUE)` };
    ws3.getCell(row, 3).numFmt = '0.000000';
    ws3.getCell(row, 4).value = { formula: `1-C${row}` }; ws3.getCell(row, 4).numFmt = '0.000000';
    ws3.getCell(row, 5).value = { formula: `IF(D${row}>0.0001,B${row}/D${row},0)` }; ws3.getCell(row, 5).numFmt = '0.000000';
    if (i === 0) { ws3.getCell(row, 6).value = '=WEIBULL.DIST(x, k, λ, FALSE/TRUE)'; ws3.getCell(row, 6).font = FORMULA_FONT; }
    [1, 2, 3, 4, 5].forEach(c => { ws3.getCell(row, c).border = THIN_BORDER; });
  }

  addSectionHeader(ws3, 45, 'FAILURE RATE INTERPRETATION');
  addLabel(ws3, 46, 1, 'k < 1:'); ws3.getCell('B46').value = 'Decreasing failure rate (infant mortality)';
  addLabel(ws3, 47, 1, 'k = 1:'); ws3.getCell('B47').value = 'Constant failure rate (Exponential)';
  addLabel(ws3, 48, 1, 'k > 1:'); ws3.getCell('B48').value = 'Increasing failure rate (wear-out)';

  // ---- Sheet 4: Pareto Distribution ----
  const ws4 = wb.addWorksheet('Pareto Distribution', { properties: { tabColor: { argb: 'FFF97316' } } });
  ws4.columns = [{ width: 12 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 22 }];

  addSectionHeader(ws4, 1, 'PARETO DISTRIBUTION (SOA)  (α, θ from Parameters sheet)', 5);
  addLabel(ws4, 2, 1, 'CDF: F(x) = 1 - (θ/(x+θ))^α  for x ≥ 0');

  ws4.getCell('A3').value = 'x'; ws4.getCell('A3').font = LABEL_FONT;
  ws4.getCell('B3').value = 'PDF f(x)'; ws4.getCell('B3').font = LABEL_FONT;
  ws4.getCell('C3').value = 'CDF F(x)'; ws4.getCell('C3').font = LABEL_FONT;
  ws4.getCell('D3').value = 'P(X > x)'; ws4.getCell('D3').font = LABEL_FONT;
  ws4.getCell('E3').value = 'Formula Used'; ws4.getCell('E3').font = LABEL_FONT;

  // x values from 0 outward in steps related to θ
  for (let i = 0; i <= 30; i++) {
    const row = 4 + i;
    ws4.getCell(row, 1).value = { formula: `${i}*Parameters!B18/5` }; ws4.getCell(row, 1).numFmt = '0.00';
    // PDF: α*θ^α/(x+θ)^(α+1)
    ws4.getCell(row, 2).value = { formula: `Parameters!B17*Parameters!B18^Parameters!B17/(A${row}+Parameters!B18)^(Parameters!B17+1)` };
    ws4.getCell(row, 2).numFmt = '0.00000000';
    // CDF: 1 - (θ/(x+θ))^α
    ws4.getCell(row, 3).value = { formula: `1-(Parameters!B18/(A${row}+Parameters!B18))^Parameters!B17` };
    ws4.getCell(row, 3).numFmt = '0.000000';
    ws4.getCell(row, 4).value = { formula: `1-C${row}` }; ws4.getCell(row, 4).numFmt = '0.000000';
    if (i === 0) { ws4.getCell(row, 5).value = '=α*θ^α/(x+θ)^(α+1)'; ws4.getCell(row, 5).font = FORMULA_FONT; }
    [1, 2, 3, 4].forEach(c => { ws4.getCell(row, c).border = THIN_BORDER; });
  }

  // Heavy tail demo
  addSectionHeader(ws4, 36, 'HEAVY TAIL DEMONSTRATION', 5);
  addLabel(ws4, 37, 1, 'P(X > 5θ) =');
  ws4.getCell('B37').value = { formula: '(Parameters!B18/(5*Parameters!B18+Parameters!B18))^Parameters!B17' }; ws4.getCell('B37').numFmt = '0.000000'; styleResultCell(ws4.getCell('B37'));
  addLabel(ws4, 38, 1, 'P(X > 10θ) =');
  ws4.getCell('B38').value = { formula: '(Parameters!B18/(10*Parameters!B18+Parameters!B18))^Parameters!B17' }; ws4.getCell('B38').numFmt = '0.000000'; styleResultCell(ws4.getCell('B38'));
  addLabel(ws4, 39, 1, 'P(X > 50θ) =');
  ws4.getCell('B39').value = { formula: '(Parameters!B18/(50*Parameters!B18+Parameters!B18))^Parameters!B17' }; ws4.getCell('B39').numFmt = '0.000000'; styleResultCell(ws4.getCell('B39'));

  // ---- Sheet 5: Monte Carlo Comparison ----
  const ws5 = wb.addWorksheet('Monte Carlo Comparison', { properties: { tabColor: { argb: 'FFEF4444' } } });
  ws5.columns = [{ width: 8 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 5 }, { width: 20 }, { width: 16 }];

  addSectionHeader(ws5, 1, 'MONTE CARLO COMPARISON  (Press F9 to regenerate!)', 7);

  ws5.getCell('A2').value = '#'; ws5.getCell('A2').font = LABEL_FONT;
  ws5.getCell('B2').value = 'Beta Sample'; ws5.getCell('B2').font = LABEL_FONT;
  ws5.getCell('C2').value = 'Weibull Sample'; ws5.getCell('C2').font = LABEL_FONT;
  ws5.getCell('D2').value = 'Pareto Sample'; ws5.getCell('D2').font = LABEL_FONT;

  for (let i = 1; i <= 1000; i++) {
    const row = 2 + i;
    ws5.getCell(row, 1).value = i;
    // Beta sample via BETA.INV(RAND(), α, β)
    ws5.getCell(row, 2).value = { formula: `BETA.INV(RAND(),Parameters!B4,Parameters!B5)` };
    ws5.getCell(row, 2).numFmt = '0.000000';
    // Weibull sample via inverse transform: λ*(-LN(RAND()))^(1/k)
    ws5.getCell(row, 3).value = { formula: `Parameters!B12*(-LN(RAND()))^(1/Parameters!B11)` };
    ws5.getCell(row, 3).numFmt = '0.000000';
    // Pareto sample via inverse transform: θ*(RAND()^(-1/α)-1)
    ws5.getCell(row, 4).value = { formula: `Parameters!B18*(RAND()^(-1/Parameters!B17)-1)` };
    ws5.getCell(row, 4).numFmt = '0.000000';
  }

  // Summary stats
  addLabel(ws5, 2, 6, 'Summary Statistics');
  addLabel(ws5, 3, 6, 'Statistic'); addLabel(ws5, 3, 7, 'Beta');
  addLabel(ws5, 4, 6, 'Sample Mean'); ws5.getCell('G4').value = { formula: 'AVERAGE(B3:B1002)' }; ws5.getCell('G4').numFmt = '0.000000';
  addLabel(ws5, 5, 6, 'Sample Var'); ws5.getCell('G5').value = { formula: 'VAR.S(B3:B1002)' }; ws5.getCell('G5').numFmt = '0.000000';
  addLabel(ws5, 6, 6, 'Theoretical Mean'); ws5.getCell('G6').value = { formula: 'Parameters!B6' }; ws5.getCell('G6').numFmt = '0.000000';
  addLabel(ws5, 7, 6, 'Theoretical Var'); ws5.getCell('G7').value = { formula: 'Parameters!B7' }; ws5.getCell('G7').numFmt = '0.000000';

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'ExamP_Additional_Models_Template.xlsx');
}

// ============================================================
// EXPORT SAMPLES AS CSV
// ============================================================
export function exportSamplesCSV(samples: number[], distName: string) {
  const header = `Sample #,Value,Distribution: ${distName}\n`;
  const rows = samples.map((s, i) => `${i + 1},${s.toFixed(6)}`).join('\n');
  const csv = header + rows;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `ExamP_${distName.replace(/[^a-zA-Z0-9]/g, '_')}_Samples.csv`);
}
