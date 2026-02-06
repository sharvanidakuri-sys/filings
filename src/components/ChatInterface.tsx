 import { useState, useRef, useEffect } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Sparkles, User, Bot, ArrowRight, AlertCircle } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { AnalysisResult, ChatMessage } from '@/types/finance';
 import { generateAnswer } from '@/lib/qaEngine';
 import { suggestedQuestions } from '@/lib/mockData';
 
 interface ChatInterfaceProps {
   data: AnalysisResult;
 }
 
 const ChatInterface = ({ data }: ChatInterfaceProps) => {
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [input, setInput] = useState('');
   const [isTyping, setIsTyping] = useState(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);
 
   const scrollToBottom = () => {
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };
 
   useEffect(() => {
     scrollToBottom();
   }, [messages]);
 
   const handleSend = (question?: string) => {
     const q = question || input.trim();
     if (!q) return;
 
     const userMessage: ChatMessage = {
       id: Date.now().toString(),
       type: 'user',
       content: q,
       timestamp: new Date()
     };
 
     setMessages(prev => [...prev, userMessage]);
     setInput('');
     setIsTyping(true);
 
     // Simulate AI response delay
     setTimeout(() => {
       const response = generateAnswer(q, data);
       const assistantMessage: ChatMessage = {
         id: (Date.now() + 1).toString(),
         type: 'assistant',
         content: response.answer,
         timestamp: new Date(),
         relatedQuestions: response.relatedQuestions
       };
       setMessages(prev => [...prev, assistantMessage]);
       setIsTyping(false);
     }, 800);
   };
 
   const handleKeyDown = (e: React.KeyboardEvent) => {
     if (e.key === 'Enter' && !e.shiftKey) {
       e.preventDefault();
       handleSend();
     }
   };
 
   const formatMessage = (content: string) => {
     return content.split('\n').map((line, i) => {
       // Bold text
       const parts = line.split(/(\*\*.*?\*\*)/g);
       return (
         <p key={i} className="mb-1">
           {parts.map((part, j) => {
             if (part.startsWith('**') && part.endsWith('**')) {
               return <strong key={j} className="text-foreground">{part.slice(2, -2)}</strong>;
             }
             return <span key={j}>{part}</span>;
           })}
         </p>
       );
     });
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
      className="glass-card h-full flex flex-col"
     >
       <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl btn-premium flex items-center justify-center">
           <MessageCircle className="w-5 h-5 text-primary-foreground" />
         </div>
         <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            Financial Intelligence Hub
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </h3>
           <p className="text-sm text-muted-foreground">Ask questions about {data.companyName}</p>
         </div>
       </div>
 
       {/* Messages area */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[500px]">
         {messages.length === 0 && (
           <div className="text-center py-8">
             <Sparkles className="w-12 h-12 text-primary/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2 font-medium">
                Financial Analysis Workspace
             </p>
            <p className="text-sm text-muted-foreground/70 mb-6 max-w-md mx-auto">
              Ask specific questions about debt amounts, interest rates, maturity profiles, or risk assessments.
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {suggestedQuestions.slice(0, 6).map((q) => (
                 <button
                   key={q}
                   onClick={() => handleSend(q)}
                  className="chip-action text-left text-xs py-2"
                 >
                   {q}
                 </button>
               ))}
             </div>
           </div>
         )}
 
         <AnimatePresence>
           {messages.map((message) => (
             <motion.div
               key={message.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0 }}
               className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
             >
               {message.type === 'assistant' && (
                <div className="w-8 h-8 rounded-lg btn-premium flex-shrink-0 flex items-center justify-center">
                   <Bot className="w-4 h-4 text-primary-foreground" />
                 </div>
               )}
               
               <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                 <div className={`rounded-xl px-4 py-3 ${
                   message.type === 'user' 
                    ? 'btn-premium text-primary-foreground' 
                    : 'glass-card text-secondary-foreground'
                 }`}>
                   <div className="text-sm leading-relaxed">
                     {formatMessage(message.content)}
                   </div>
                 </div>
 
                 {/* Related questions */}
                 {message.type === 'assistant' && message.relatedQuestions && (
                   <div className="mt-3 space-y-2">
                     <p className="text-xs text-muted-foreground">Related questions:</p>
                     {message.relatedQuestions.map((q, i) => (
                       <button
                         key={i}
                         onClick={() => handleSend(q)}
                         className="flex items-center gap-2 text-sm text-primary hover:underline"
                       >
                         <ArrowRight className="w-3 h-3" />
                         {q}
                       </button>
                     ))}
                   </div>
                 )}
               </div>
 
               {message.type === 'user' && (
                 <div className="w-8 h-8 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center">
                   <User className="w-4 h-4 text-muted-foreground" />
                 </div>
               )}
             </motion.div>
           ))}
         </AnimatePresence>
 
         {isTyping && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex gap-3"
           >
              <div className="w-8 h-8 rounded-lg btn-premium flex items-center justify-center">
               <Bot className="w-4 h-4 text-primary-foreground" />
             </div>
              <div className="glass-card rounded-xl px-4 py-3">
               <div className="flex gap-1">
                 <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
           </motion.div>
         )}
 
         <div ref={messagesEndRef} />
       </div>
 
       {/* Input area */}
       <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Ask clear, specific questions for best results
        </p>
         <div className="flex gap-2">
           <Input
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={handleKeyDown}
            placeholder="e.g., What is the total debt amount?"
            className="flex-1 bg-secondary/30 border-border focus:border-primary rounded-xl"
           />
           <Button 
             onClick={() => handleSend()}
             disabled={!input.trim() || isTyping}
            className="btn-premium rounded-xl"
           >
             <Send className="w-4 h-4" />
           </Button>
         </div>
       </div>
     </motion.div>
   );
 };
 
 export default ChatInterface;