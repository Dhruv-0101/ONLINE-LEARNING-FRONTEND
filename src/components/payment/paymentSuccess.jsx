import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiLoader, FiArrowRight, FiShield } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { paymentVerificationAPI } from "../../../src/reactQuery/payment/payment";
import { motion } from "framer-motion";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["verify-payment"],
    queryFn: () => paymentVerificationAPI(paymentIntentId),
  });

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full p-12 rounded-[4rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-3xl text-center relative z-10"
      >
        {isLoading ? (
          <div className="flex flex-col items-center space-y-8 py-12">
            <div className="relative">
               <div className="w-24 h-24 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
               <FiLoader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-blue-400" />
            </div>
            <div>
               <h2 className="text-2xl font-black mb-2 tracking-tight">Verifying Transaction</h2>
               <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em]">Synchronizing Secure Protocol...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center space-y-8 py-12">
            <div className="w-24 h-24 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
              <FiXCircle size={48} />
            </div>
            <div>
              <h2 className="text-3xl font-black mb-4 tracking-tighter text-red-400">Verification Failed</h2>
              <p className="text-gray-500 text-sm italic mb-8 px-8 leading-relaxed">
                {error?.message || "Something went wrong during payment validation. Please contact support if the amount was debited."}
              </p>
              <Link to="/courses" className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                Try Again <FiArrowRight />
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-10 py-8">
            <motion.div 
               initial={{ scale: 0.8 }}
               animate={{ scale: 1 }}
               className="w-28 h-28 rounded-[3rem] bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shadow-[0_0_60px_rgba(34,197,94,0.15)]"
            >
              <FiCheckCircle size={56} />
            </motion.div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 mb-4 block px-6 py-2 bg-blue-500/10 rounded-full w-fit mx-auto border border-blue-500/20">Payment Confirmed</span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-tight">Welcome Aboard!</h1>
              <p className="text-gray-500 text-sm italic mb-10 leading-relaxed px-4">
                Thank you for your purchase. Your payment was processed successfully. <br/> Your transaction ID is <span className="text-white font-mono text-[10px] bg-white/5 py-1 px-3 rounded-md">{paymentIntentId}</span>
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-10 text-left">
                 <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                       <FiShield size={24} />
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 leading-none mb-1">Status</p>
                       <p className="text-lg font-black tracking-tight">Curriculum Unlocked</p>
                    </div>
                 </div>
              </div>

              <Link
                to="/student-dashboard"
                className="w-full relative group overflow-hidden py-6 rounded-3xl bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:scale-95"
              >
                <span className="relative z-10 text-xs font-black uppercase tracking-[0.3em]">Launch Learning Dashboard</span>
                <FiArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
