"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Modal";

interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
}

interface FeeType {
  id: string;
  name: string;
  amount: number;
  description: string;
  semester: string;
}

interface StudentFee {
  id: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: string;
  feeType: FeeType;
  payments: Payment[];
}

export default function PaymentsPage() {
  const router = useRouter();
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingFeeId, setPayingFeeId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await fetch("/api/student/fees");
      const data = await response.json();
      setFees(data.fees || []);
    } catch (error) {
      console.error("Error fetching fees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (feeId: string, method: string) => {
    const amount = parseFloat(paymentAmount);
    const fee = fees.find((f) => f.id === feeId);

    if (!amount || amount <= 0) {
      setModal({
        isOpen: true,
        title: "Invalid Amount",
        message: "Please enter a valid amount",
        type: "error",
      });
    }

    if (amount > fee!.balance) {
      setModal({
        isOpen: true,
        title: "Invalid Amount",
        message: `Amount cannot exceed balance of ${fee!.balance.toLocaleString()} FCFA`,
        type: "error",
      });
      return;
    }

    // Simulate payment processing
    setSelectedMethod(method);

    // Simulate success after 2 seconds
    setTimeout(async () => {
      try {
        const response = await fetch("/api/student/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentFeeId: feeId,
            amount: amount,
            paymentMethod: method,
          }),
        });

        if (response.ok) {
          setModal({
            isOpen: true,
            title: "Payment Successful",
            message: `Payment of ${amount.toLocaleString()} FCFA via ${method} was successful!`,
            type: "success",
          });
          setPayingFeeId(null);
          setPaymentAmount("");
          setSelectedMethod("");
          fetchFees(); // Refresh fees
        } else {
          setModal({
            isOpen: true,
            title: "Payment Failed",
            message: "Payment failed. Please try again.",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Payment error:", error);
        setModal({
          isOpen: true,
          title: "Payment Failed",
          message: "Payment failed. Please try again.",
          type: "error",
        });
      } finally {
        setSelectedMethod("");
      }
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Partial":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Loading fees...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold mb-4 cursor-pointer px-4 py-2 rounded-lg border border-transparent hover:border-blue-200 transition-all"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Fee Payments</h1>
          <p className="text-gray-600 mt-2">View and pay your fees</p>
        </div>

        {/* Fee Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-blue-600 font-semibold mb-2">Total Fees</p>
            <p className="text-3xl font-bold text-gray-900">
              {fees
                .reduce((sum, fee) => sum + fee.totalAmount, 0)
                .toLocaleString()}{" "}
              FCFA
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-green-600 font-semibold mb-2">Paid Amount</p>
            <p className="text-3xl font-bold text-gray-900">
              {fees
                .reduce((sum, fee) => sum + fee.paidAmount, 0)
                .toLocaleString()}{" "}
              FCFA
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-red-600 font-semibold mb-2">Balance</p>
            <p className="text-3xl font-bold text-gray-900">
              {fees.reduce((sum, fee) => sum + fee.balance, 0).toLocaleString()}{" "}
              FCFA
            </p>
          </div>
        </div>

        {/* Fee Cards */}
        <div className="space-y-6">
          {fees.map((fee) => (
            <div
              key={fee.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {fee.feeType.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {fee.feeType.description}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Semester: {fee.feeType.semester}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    fee.status
                  )}`}
                >
                  {fee.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">
                    {fee.totalAmount.toLocaleString()} FCFA
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Paid</p>
                  <p className="text-lg font-bold text-green-600">
                    {fee.paidAmount.toLocaleString()} FCFA
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Balance</p>
                  <p className="text-lg font-bold text-red-600">
                    {fee.balance.toLocaleString()} FCFA
                  </p>
                </div>
              </div>

              {fee.balance > 0 && (
                <>
                  {payingFeeId === fee.id ? (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="mb-4">
                        <label className="block text-gray-900 font-semibold mb-2">
                          Payment Amount (FCFA)
                        </label>
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                          max={fee.balance}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Maximum: {fee.balance.toLocaleString()} FCFA
                        </p>
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-900 font-semibold mb-3">
                          Select Payment Method
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {/* MTN Mobile Money */}
                          <button
                            onClick={() => handlePayment(fee.id, "MTN")}
                            disabled={!paymentAmount || selectedMethod !== ""}
                            className="flex flex-col items-center justify-center p-4 border-2 border-yellow-400 rounded-lg hover:bg-yellow-50 transition disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                          >
                            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-2">
                              <span className="text-white font-bold text-xl">
                                M
                              </span>
                            </div>
                            <span className="text-gray-900 font-semibold">
                              MTN
                            </span>
                            <span className="text-gray-600 text-sm">
                              Mobile Money
                            </span>
                          </button>

                          {/* Orange Money */}
                          <button
                            onClick={() => handlePayment(fee.id, "Orange")}
                            disabled={!paymentAmount || selectedMethod !== ""}
                            className="flex flex-col items-center justify-center p-4 border-2 border-orange-500 rounded-lg hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                          >
                            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-2">
                              <span className="text-white font-bold text-xl">
                                O
                              </span>
                            </div>
                            <span className="text-gray-900 font-semibold">
                              Orange
                            </span>
                            <span className="text-gray-600 text-sm">Money</span>
                          </button>

                          {/* Express Exchange */}
                          <button
                            onClick={() => handlePayment(fee.id, "Express")}
                            disabled={!paymentAmount || selectedMethod !== ""}
                            className="flex flex-col items-center justify-center p-4 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                          >
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                              <span className="text-white font-bold text-xl">
                                E
                              </span>
                            </div>
                            <span className="text-gray-900 font-semibold">
                              Express
                            </span>
                            <span className="text-gray-600 text-sm">
                              Exchange
                            </span>
                          </button>
                        </div>
                      </div>

                      {selectedMethod && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-blue-800 text-sm">
                            Processing payment via {selectedMethod}...
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setPayingFeeId(null);
                          setPaymentAmount("");
                          setSelectedMethod("");
                        }}
                        disabled={selectedMethod !== ""}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPayingFeeId(fee.id)}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      Make Payment
                    </button>
                  )}
                </>
              )}

              {/* Payment History */}
              {fee.payments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-900 font-semibold mb-2">
                    Payment History
                  </p>
                  <div className="space-y-2">
                    {fee.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {new Date(payment.createdAt).toLocaleDateString()} -{" "}
                          {payment.paymentMethod}
                        </span>
                        <span className="text-green-600 font-semibold">
                          {payment.amount.toLocaleString()} FCFA
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {fees.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-600">No fees found</p>
          </div>
        )}
      </div>
      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
}
