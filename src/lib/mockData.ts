import { DebtInstrument, AnalysisResult } from "@/types/finance";

const noteNames = [
  "Alpha Senior Notes",
  "Beta Corporate Bond",
  "Gamma Term Loan",
  "Delta Secured Notes",
  "Epsilon Debenture",
  "Zeta Credit Facility",
  "Eta Convertible Bond",
  "Theta Fixed Rate",
  "Iota Floating Rate",
  "Kappa Senior Secured",
  "Lambda Subordinated",
  "Mu Term Notes",
  "Nu Credit Agreement",
  "Xi Bridge Loan",
  "Omicron Asset-Backed",
];
 
 const generateMockInstruments = (): DebtInstrument[] => {
   const instruments: DebtInstrument[] = [];
   const entities = [
    "Goldman Sachs & Co.",
    "JP Morgan Securities",
    "Morgan Stanley",
    "Bank of America Merrill Lynch",
    "Citigroup Global Markets",
    "Wells Fargo Securities",
    "UBS Investment Bank",
    "Deutsche Bank AG",
    "Barclays Capital",
    "HSBC Securities",
   ];
 
   for (let i = 1; i <= 15; i++) {
    const year = 2025 + Math.floor(i / 2) + Math.floor(Math.random() * 3);
    const rate = 2.0 + i * 0.22 + (Math.random() - 0.5) * 0.4;
    const amount = 150 + i * 25 + Math.floor(Math.random() * 50);

     instruments.push({
       id: `note-${i}`,
      noteBond: `${noteNames[i - 1]} ${year}`,
       interestRate: Math.round(rate * 1000) / 1000,
       dueYear: year,
       amount: amount,
       amountFormatted: `$${amount}M`,
       relatedEntity: entities[Math.floor(Math.random() * entities.length)],
       currency: 'USD',
       maturityPeriod: year - new Date().getFullYear(),
      annualInterest: Math.round(amount * (rate / 100) * 100) / 100,
     });
   }
 
   return instruments.sort((a, b) => a.dueYear - b.dueYear);
 };
 
 export const generateMockAnalysis = (companyName: string, cik: string): AnalysisResult => {
   const instruments = generateMockInstruments();
   
   const totalDebt = instruments.reduce((sum, inst) => sum + inst.amount, 0);
   const rates = instruments.map(i => i.interestRate);
   const years = instruments.map(i => i.dueYear);
   
   const weightedSum = instruments.reduce((sum, inst) => sum + inst.interestRate * inst.amount, 0);
   const weightedAvgRate = Math.round((weightedSum / totalDebt) * 1000) / 1000;
   const simpleAvgRate = Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 1000) / 1000;
   
   const yearCounts: Record<number, number> = {};
   years.forEach(y => { yearCounts[y] = (yearCounts[y] || 0) + 1; });
   const peakYear = Object.entries(yearCounts).reduce((a, b) => b[1] > a[1] ? b : a, ['0', 0])[0];
 
   return {
     companyName,
     cik,
     filingType: '10-K',
     filingDate: new Date().toISOString().split('T')[0],
     totalDebt,
     totalDebtFormatted: totalDebt >= 1000 ? `$${(totalDebt / 1000).toFixed(2)}B` : `$${totalDebt}M`,
     weightedAvgRate,
     simpleAvgRate,
     instrumentCount: instruments.length,
     minMaturityYear: Math.min(...years),
     maxMaturityYear: Math.max(...years),
     peakYear: parseInt(peakYear),
     instruments
   };
 };
 
 export const sampleCompanies: Record<string, string> = {
   '0000320193': 'Apple Inc.',
   '0000789019': 'Microsoft Corporation',
   '0001018724': 'Amazon.com Inc.',
   '0001652044': 'Alphabet Inc.',
   '0001326801': 'Meta Platforms Inc.',
   '0001045810': 'NVIDIA Corporation',
   '0000051143': 'IBM Corporation',
   '0000078003': 'Pfizer Inc.'
 };
 
 export const suggestedQuestions = [
   "What is the total debt amount?",
   "Which year has the most debt maturing?",
   "What is the weighted average interest rate?",
  "Show me debt due between 2025-2030",
   "What is the highest interest rate?",
   "List all debt instruments",
   "What is the debt maturity profile?",
  "How much debt matures in the next 3 years?",
  "What is the lowest interest rate?",
  "Show high-rate instruments above 4%",
  "What is the refinancing risk assessment?",
  "Compare short-term vs long-term debt",
 ];