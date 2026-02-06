 import { AnalysisResult } from '@/types/finance';
 
 export interface QAResponse {
   answer: string;
   relatedQuestions: string[];
 }
 
 export const generateAnswer = (question: string, data: AnalysisResult): QAResponse => {
   const q = question.toLowerCase();
   const { instruments, totalDebtFormatted, weightedAvgRate, simpleAvgRate, instrumentCount, 
           minMaturityYear, maxMaturityYear, peakYear, companyName } = data;
   
   // Extract years from question
   const yearMatches = question.match(/\d{4}/g);
   const years = yearMatches ? yearMatches.map(Number) : [];
 
   if (q.includes('total') && (q.includes('debt') || q.includes('amount'))) {
     return {
       answer: `**${companyName}** has a total outstanding debt of **${totalDebtFormatted}** across **${instrumentCount}** debt instruments.\n\nThis represents the aggregate principal amount of all long-term debt obligations as reported in the latest SEC filing.`,
       relatedQuestions: [
         "What is the debt maturity profile?",
         "Which year has the most debt maturing?",
         "What is the average interest rate?"
       ]
     };
   }
 
   if ((q.includes('average') || q.includes('avg')) && (q.includes('rate') || q.includes('interest'))) {
     return {
       answer: `**Interest Rate Analysis for ${companyName}:**\n\n• **Weighted Average Rate:** ${weightedAvgRate}%\n• **Simple Average Rate:** ${simpleAvgRate}%\n\nThe weighted average accounts for the principal amount of each instrument, providing a more accurate representation of the company's cost of debt.`,
       relatedQuestions: [
         "What is the highest interest rate?",
         "What is the lowest interest rate?",
         "Show me high-rate instruments above 4%"
       ]
     };
   }
 
   if (q.includes('highest') && q.includes('rate')) {
     const maxRate = instruments.reduce((a, b) => a.interestRate > b.interestRate ? a : b);
     return {
       answer: `**Highest Interest Rate:** ${maxRate.interestRate}%\n\n• **Instrument:** ${maxRate.noteBond}\n• **Due Year:** ${maxRate.dueYear}\n• **Principal:** ${maxRate.amountFormatted}\n• **Annual Interest:** $${maxRate.annualInterest.toFixed(2)}M`,
       relatedQuestions: [
         "What is the lowest interest rate?",
         "What is the average interest rate?",
         "List all debt instruments"
       ]
     };
   }
 
   if (q.includes('lowest') && q.includes('rate')) {
     const minRate = instruments.reduce((a, b) => a.interestRate < b.interestRate ? a : b);
     return {
       answer: `**Lowest Interest Rate:** ${minRate.interestRate}%\n\n• **Instrument:** ${minRate.noteBond}\n• **Due Year:** ${minRate.dueYear}\n• **Principal:** ${minRate.amountFormatted}\n• **Annual Interest:** $${minRate.annualInterest.toFixed(2)}M`,
       relatedQuestions: [
         "What is the highest interest rate?",
         "What is the average interest rate?",
         "Show me instruments with rates below 3%"
       ]
     };
   }
 
   if ((q.includes('year') || q.includes('peak')) && (q.includes('most') || q.includes('highest')) && q.includes('debt')) {
     const yearTotals: Record<number, number> = {};
     instruments.forEach(i => { yearTotals[i.dueYear] = (yearTotals[i.dueYear] || 0) + i.amount; });
     const peak = Object.entries(yearTotals).reduce((a, b) => b[1] > a[1] ? b : a);
     const peakAmount = peak[1] >= 1000 ? `$${(peak[1] / 1000).toFixed(2)}B` : `$${peak[1]}M`;
     
     return {
       answer: `**${peak[0]}** is the peak maturity year for ${companyName}'s debt portfolio.\n\n• **Amount Maturing:** ${peakAmount}\n• **Instruments Count:** ${instruments.filter(i => i.dueYear === parseInt(peak[0])).length}\n\nThis concentration may indicate refinancing risk in that year.`,
       relatedQuestions: [
         "What is the debt maturity profile?",
         `What debt matures in ${peak[0]}?`,
         "How is debt distributed across years?"
       ]
     };
   }
 
   if (q.includes('between') && years.length >= 2) {
     const [start, end] = years.sort((a, b) => a - b);
     const filtered = instruments.filter(i => i.dueYear >= start && i.dueYear <= end);
     const total = filtered.reduce((sum, i) => sum + i.amount, 0);
     const totalFormatted = total >= 1000 ? `$${(total / 1000).toFixed(2)}B` : `$${total}M`;
     
     return {
       answer: `**Debt Maturing ${start}-${end}:**\n\n• **Instruments:** ${filtered.length}\n• **Total Principal:** ${totalFormatted}\n• **% of Total Debt:** ${((total / data.totalDebt) * 100).toFixed(1)}%\n\n**Breakdown:**\n${filtered.slice(0, 5).map(i => `• ${i.noteBond}: ${i.amountFormatted} @ ${i.interestRate}%`).join('\n')}${filtered.length > 5 ? `\n• ...and ${filtered.length - 5} more` : ''}`,
       relatedQuestions: [
         `What debt matures after ${end}?`,
         "What is the average rate for this period?",
         "Show the full debt table"
       ]
     };
   }
 
   if (q.includes('maturity') || q.includes('profile')) {
     const yearTotals: Record<number, number> = {};
     instruments.forEach(i => { yearTotals[i.dueYear] = (yearTotals[i.dueYear] || 0) + i.amount; });
     const sortedYears = Object.entries(yearTotals).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
     
     return {
       answer: `**Debt Maturity Profile for ${companyName}:**\n\n• **Maturity Range:** ${minMaturityYear} - ${maxMaturityYear}\n• **Total Span:** ${maxMaturityYear - minMaturityYear} years\n• **Peak Year:** ${peakYear}\n\n**Annual Distribution:**\n${sortedYears.slice(0, 6).map(([y, a]) => `• **${y}:** $${a}M`).join('\n')}${sortedYears.length > 6 ? `\n• ...plus ${sortedYears.length - 6} more years` : ''}`,
       relatedQuestions: [
         "Which year has the most debt?",
         "What is the refinancing risk?",
         "Show debt due in next 5 years"
       ]
     };
   }
 
   if (q.includes('list') || q.includes('all') || q.includes('instruments')) {
     return {
       answer: `**All Debt Instruments (${instrumentCount} total):**\n\n${instruments.map(i => `• **${i.noteBond}:** ${i.amountFormatted} @ ${i.interestRate}% (Due ${i.dueYear})`).join('\n')}\n\n*View the Data Table tab for complete details.*`,
       relatedQuestions: [
         "What is the total debt?",
         "Sort by interest rate",
         "Show high-rate instruments"
       ]
     };
   }
 
   if ((q.includes('next') || q.includes('coming')) && (q.includes('year') || q.includes('3') || q.includes('5'))) {
     const currentYear = new Date().getFullYear();
     const yearsAhead = q.includes('5') ? 5 : 3;
     const filtered = instruments.filter(i => i.dueYear <= currentYear + yearsAhead);
     const total = filtered.reduce((sum, i) => sum + i.amount, 0);
     
     return {
       answer: `**Debt Maturing in Next ${yearsAhead} Years:**\n\n• **Instruments:** ${filtered.length}\n• **Total:** $${total}M\n• **% of Portfolio:** ${((total / data.totalDebt) * 100).toFixed(1)}%\n\n${filtered.map(i => `• ${i.noteBond}: ${i.amountFormatted} (${i.dueYear})`).join('\n')}`,
       relatedQuestions: [
         "What is the refinancing strategy?",
         "Show long-term debt (5+ years)",
         "What is the average rate for near-term debt?"
       ]
     };
   }
 
  // Refinancing risk assessment
  if (q.includes('risk') || q.includes('refinanc')) {
    const yearTotals: Record<number, number> = {};
    instruments.forEach(i => { yearTotals[i.dueYear] = (yearTotals[i.dueYear] || 0) + i.amount; });
    const peakAmount = yearTotals[peakYear] || 0;
    const concentrationRisk = ((peakAmount / data.totalDebt) * 100).toFixed(1);
    const riskLevel = parseFloat(concentrationRisk) > 30 ? 'HIGH' : parseFloat(concentrationRisk) > 20 ? 'MODERATE' : 'LOW';
    
    return {
      answer: `**Refinancing Risk Assessment for ${companyName}:**\n\n• **Risk Level:** ${riskLevel}\n• **Peak Year Concentration:** ${concentrationRisk}% in ${peakYear}\n• **Spread:** ${maxMaturityYear - minMaturityYear} years\n• **Avg Rate:** ${weightedAvgRate}%\n\n**Recommendations:**\n${riskLevel === 'HIGH' ? '⚠️ Consider early refinancing or debt restructuring' : '✅ Portfolio is reasonably diversified'}`,
      relatedQuestions: [
        "What is the debt maturity profile?",
        `What debt matures in ${peakYear}?`,
        "What is the total debt amount?"
      ]
    };
  }

  // Short-term vs long-term comparison
  if (q.includes('compare') || (q.includes('short') && q.includes('long'))) {
    const currentYear = new Date().getFullYear();
    const shortTerm = instruments.filter(i => i.dueYear <= currentYear + 3);
    const longTerm = instruments.filter(i => i.dueYear > currentYear + 3);
    const shortTotal = shortTerm.reduce((sum, i) => sum + i.amount, 0);
    const longTotal = longTerm.reduce((sum, i) => sum + i.amount, 0);
    
    return {
      answer: `**Short-term vs Long-term Debt Analysis:**\n\n**Short-term (≤3 years):**\n• Count: ${shortTerm.length} instruments\n• Total: $${shortTotal}M (${((shortTotal/data.totalDebt)*100).toFixed(1)}%)\n\n**Long-term (>3 years):**\n• Count: ${longTerm.length} instruments\n• Total: $${longTotal}M (${((longTotal/data.totalDebt)*100).toFixed(1)}%)`,
      relatedQuestions: [
        "What is the refinancing risk?",
        "Show debt due in next 5 years",
        "What is the average rate?"
      ]
    };
  }

  // High rate instruments
  if ((q.includes('high') && q.includes('rate')) || q.includes('above 4')) {
    const highRate = instruments.filter(i => i.interestRate > 4);
    if (highRate.length === 0) {
      return {
        answer: `**No high-rate instruments found.**\n\nAll ${instrumentCount} instruments have interest rates below 4%.`,
        relatedQuestions: ["What is the average interest rate?", "What is the highest rate?", "List all instruments"]
      };
    }
    const total = highRate.reduce((sum, i) => sum + i.amount, 0);
    return {
      answer: `**High-Rate Instruments (>4%):**\n\n• **Count:** ${highRate.length}\n• **Total Principal:** $${total}M\n\n${highRate.map(i => `• **${i.noteBond}:** ${i.interestRate}% @ ${i.amountFormatted}`).join('\n')}`,
      relatedQuestions: ["What is the lowest rate?", "What is the weighted average?", "Show refinancing risk"]
    };
  }

   // Default response
   return {
    answer: `⚠️ **I couldn't understand that question.**\n\nPlease try asking in a clearer format. Here are some examples:\n\n• "What is the total debt amount?"\n• "Which year has the most debt?"\n• "What is the average interest rate?"\n• "Show debt between 2025-2030"\n• "What is the highest/lowest rate?"\n\n**Available data for ${companyName}:**\n• ${instrumentCount} debt instruments\n• Total: ${totalDebtFormatted}\n• Maturity range: ${minMaturityYear}-${maxMaturityYear}`,
     relatedQuestions: [
       "What is the total debt amount?",
       "What is the weighted average rate?",
      "Which year has the most debt?",
      "List all debt instruments"
     ]
   };
 };