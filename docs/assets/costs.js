const costDefaults = { usdKrw: 1465, tuitionUsd: 6620, monthlyMin: 2000000, monthlyMax: 2500000, initialSetup: 5000000, annualInflation: 3 };
const materialFees = [0, 800, 1600, 1600, 1600];
const academicYears = ['2026/27', '2027/28', '2028/29', '2029/30', '2030/31'];
const won = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 });
function money(value) { return `${won.format(Math.round(value / 10000))}만원`; }
function getInputs() { return Object.fromEntries(Object.keys(costDefaults).map((key) => [key, Number(document.querySelector(`[name="${key}"]`).value)])); }
function calculate() {
  const input = getInputs(); let fiveYearMin = 0; let fiveYearMax = 0; const yearlyRows = []; const semesterRows = []; const monthlyRows = [];
  academicYears.forEach((academicYear, yearIndex) => {
    const factor = (1 + input.annualInflation / 100) ** yearIndex;
    const tuitionPerSemester = input.tuitionUsd * input.usdKrw * factor;
    const materialPerYear = materialFees[yearIndex] * input.usdKrw * factor;
    const livingMin = input.monthlyMin * 12 * factor; const livingMax = input.monthlyMax * 12 * factor;
    const setup = yearIndex === 0 ? input.initialSetup : 0;
    const yearMin = tuitionPerSemester * 2 + materialPerYear + livingMin + setup;
    const yearMax = tuitionPerSemester * 2 + materialPerYear + livingMax + setup;
    fiveYearMin += yearMin; fiveYearMax += yearMax;
    yearlyRows.push(`<tr><td>${yearIndex + 1}학년</td><td>${academicYear}</td><td>${money(tuitionPerSemester * 2)}</td><td>${money(materialPerYear)}</td><td>${money(livingMin)}–${money(livingMax)}</td><td>${money(setup)}</td><td><strong>${money(yearMin)}–${money(yearMax)}</strong></td></tr>`);
    [1, 2].forEach((semester) => {
      const semesterMaterial = materialPerYear / 2; const semesterLivingMin = input.monthlyMin * 6 * factor; const semesterLivingMax = input.monthlyMax * 6 * factor;
      const semesterSetup = yearIndex === 0 && semester === 1 ? setup : 0;
      const semesterMin = tuitionPerSemester + semesterMaterial + semesterLivingMin + semesterSetup; const semesterMax = tuitionPerSemester + semesterMaterial + semesterLivingMax + semesterSetup;
      semesterRows.push(`<tr><td>${yearIndex + 1}학년 ${semester}학기</td><td>${academicYear}</td><td>${money(tuitionPerSemester)}</td><td>${money(semesterMaterial)}</td><td>${money(semesterLivingMin)}–${money(semesterLivingMax)}</td><td><strong>${money(semesterMin)}–${money(semesterMax)}</strong></td></tr>`);
    });
    for (let month = 1; month <= 12; month += 1) { const monthMin = input.monthlyMin * factor; const monthMax = input.monthlyMax * factor; monthlyRows.push(`<tr><td>${yearIndex + 1}학년</td><td>${academicYear}</td><td>${month}개월차</td><td>${month <= 6 ? '1학기' : '2학기'}</td><td>${money(monthMin)}–${money(monthMax)}</td></tr>`); }
  });
  document.querySelector('#yearly-body').innerHTML = yearlyRows.join(''); document.querySelector('#semester-body').innerHTML = semesterRows.join(''); document.querySelector('#monthly-body').innerHTML = monthlyRows.join('');
  document.querySelector('#total-min').textContent = money(fiveYearMin); document.querySelector('#total-max').textContent = money(fiveYearMax); document.querySelector('#monthly-target').textContent = `${money(fiveYearMin / 60)}–${money(fiveYearMax / 60)}`;
  document.querySelector('#calculated-at').textContent = `환율 ${won.format(input.usdKrw)}원/USD · 연 물가상승률 ${input.annualInflation}% 가정`;
}
function resetCalculator() { Object.entries(costDefaults).forEach(([key, value]) => { document.querySelector(`[name="${key}"]`).value = value; }); calculate(); }
document.addEventListener('DOMContentLoaded', () => { document.querySelector('#cost-form').addEventListener('input', calculate); document.querySelector('#reset-costs').addEventListener('click', resetCalculator); calculate(); });
