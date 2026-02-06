 import { useState } from 'react';
 import HeroSection from '@/components/HeroSection';
 import SearchSection from '@/components/SearchSection';
 import AnalysisDashboard from '@/components/AnalysisDashboard';
 import { generateMockAnalysis } from '@/lib/mockData';
 import { AnalysisResult } from '@/types/finance';
 
 const Index = () => {
   const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
   const [isLoading, setIsLoading] = useState(false);
 
   const handleAnalyze = (cik: string, companyName: string) => {
     setIsLoading(true);
     
     // Simulate API call delay
     setTimeout(() => {
       const data = generateMockAnalysis(companyName, cik);
       setAnalysisData(data);
       setIsLoading(false);
     }, 1500);
   };
 
   const handleBack = () => {
     setAnalysisData(null);
   };
 
   if (analysisData) {
     return <AnalysisDashboard data={analysisData} onBack={handleBack} />;
   }
 
   return (
     <div className="min-h-screen bg-background">
       <HeroSection />
       <SearchSection onAnalyze={handleAnalyze} isLoading={isLoading} />
       
       {/* Background decoration */}
       <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
         <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
         <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
       </div>
     </div>
   );
 };
 
 export default Index;
