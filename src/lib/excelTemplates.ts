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
// EXPORT SAMPLES AS CSV
// ============================================================
export function exportSamplesCSV(samples: number[], distName: string) {
  const header = `Sample #,Value,Distribution: ${distName}\n`;
  const rows = samples.map((s, i) => `${i + 1},${s.toFixed(6)}`).join('\n');
  const csv = header + rows;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `ExamP_${distName.replace(/[^a-zA-Z0-9]/g, '_')}_Samples.csv`);
}
