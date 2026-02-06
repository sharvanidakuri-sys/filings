 export interface DebtInstrument {
   id: string;
   noteBond: string;
   interestRate: number;
   dueYear: number;
   amount: number;
   amountFormatted: string;
   relatedEntity: string;
   currency: string;
   maturityPeriod: number;
   annualInterest: number;
 }
 
 export interface AnalysisResult {
   companyName: string;
   cik: string;
   filingType: string;
   filingDate: string;
   totalDebt: number;
   totalDebtFormatted: string;
   weightedAvgRate: number;
   simpleAvgRate: number;
   instrumentCount: number;
   minMaturityYear: number;
   maxMaturityYear: number;
   peakYear: number;
   instruments: DebtInstrument[];
 }
 
 export interface ChatMessage {
   id: string;
   type: 'user' | 'assistant';
   content: string;
   timestamp: Date;
   relatedQuestions?: string[];
 }