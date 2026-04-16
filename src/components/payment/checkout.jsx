import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShield, FiLock, FiChevronLeft, FiCreditCard, FiActivity, FiZap } from "react-icons/fi";
import { paymentIntentAPI } from "../../reactQuery/payment/payment";
import { getSingleCourseAPI } from "../../reactQuery/courses/coursesAPI";
import AlertMessage from "../Alert/AlertMessage";

const CheckoutForm = () => {
  const { courseId } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch course details for the summary
  const { data: courseData } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getSingleCourseAPI(courseId),
  });

  const paymentMutation = useMutation({
    mutationKey: ["checkout"],
    mutationFn: paymentIntentAPI,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error: submitErr } = await elements.submit();
    if (submitErr) {
      setErrorMessage(submitErr.message);
      setIsProcessing(false);
      return;
    }

    try {
      const response = await paymentMutation.mutateAsync(courseId);
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: response?.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Payment initiation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-24 pb-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10"
      >
        {/* Left Side: Order Summary */}
        <div className="space-y-6">
          <Link to={`/courses/${courseId}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm mb-4">
            <FiChevronLeft /> Back to Course
          </Link>
          
          <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FiShield size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Secure Checkout</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Payment Gateway</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="pb-6 border-b border-white/5">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black block mb-2">Course Selection</span>
                <h3 className="text-3xl font-bold text-blue-400 leading-tight">{courseData?.title || "Loading System Data..."}</h3>
                <p className="text-gray-500 mt-2 italic text-sm">Full access to all lessons and assignments.</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Access Tier</span>
                  <span className="font-mono text-gray-300">Lifetime Student Access</span>
                </div>

              </div>

              <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black block">Total Price</span>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-white tabular-nums">${courseData?.price || "0.00"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-[10px] uppercase tracking-widest text-blue-400 font-black">
            <FiLock className="text-sm" /> Secure Transaction Active
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-[#161B28] border border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                  <FiCreditCard className="text-blue-500" /> Payment Details
                </div>

              </div>

              <div className="payment-element-wrapper p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
                <PaymentElement 
                  options={{
                    layout: "tabs",
                  }}
                />
              </div>

              <AnimatePresence>
                {(errorMessage || paymentMutation.isError) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <AlertMessage 
                      type="error" 
                      message={errorMessage || paymentMutation?.error?.response?.data?.message || "Authentication error."} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                disabled={!stripe || isProcessing}
                className="w-full relative group overflow-hidden py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-black uppercase tracking-[0.2em] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <>
                      <FiZap className="group-hover:animate-bounce" />
                      <span>Confirm Authorization</span>
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
              
              <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed">
                By confirming, you authorize Skill Buddy to activate your <br/> course access and debit the specified amount.
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutForm;
