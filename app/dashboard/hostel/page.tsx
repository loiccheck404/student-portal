"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Modal";

interface HostelApplication {
  id: string;
  dormId: string | null;
  roomId: string | null;
  feeAmount: number;
  paidAmount: number;
  status: string;
  dorm: {
    id: string;
    name: string;
    description: string;
  } | null;
  room: {
    id: string;
    roomNumber: string;
  } | null;
  payments: {
    id: string;
    amount: number;
    paymentMethod: string;
    createdAt: string;
  }[];
}

export default function HostelPage() {
  const router = useRouter();
  const [application, setApplication] = useState<HostelApplication | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showPayment, setShowPayment] = useState(false);
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
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const response = await fetch("/api/student/hostel");
      const data = await response.json();
      setApplication(data.application);
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const response = await fetch("/api/student/hostel", {
        method: "POST",
      });

      if (response.ok) {
        alert("Hostel application submitted successfully!");
        fetchApplication();
      } else {
        const data = await response.json();
        setModal({
          isOpen: true,
          title: "Application Failed",
          message: data.error || "Failed to submit application",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error applying:", error);
      setModal({
        isOpen: true,
        title: "Application Failed",
        message: "Failed to submit application",
        type: "error",
      });
    } finally {
      setApplying(false);
    }
  };

  const handlePayment = async (method: string) => {
    const amount = parseFloat(paymentAmount);

    if (!amount || amount <= 0) {
      setModal({
        isOpen: true,
        title: "Invalid Amount",
        message: "Please enter a valid amount",
        type: "error",
      });
      return;
    }

    const balance = application!.feeAmount - application!.paidAmount;
    if (amount > balance) {
      setModal({
        isOpen: true,
        title: "Invalid Amount",
        message: `Amount cannot exceed balance of ${balance.toLocaleString()} FCFA`,
        type: "error",
      });
      return;
    }

    setSelectedMethod(method);

    setTimeout(async () => {
      try {
        const response = await fetch("/api/student/hostel/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
          setShowPayment(false);
          setPaymentAmount("");
          setSelectedMethod("");
          fetchApplication();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold mb-4 cursor-pointer px-4 py-2 rounded-lg border border-transparent hover:border-blue-200 transition-all"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Hostel Accommodation
          </h1>
          <p className="text-gray-600 mt-2">Apply for campus accommodation</p>
        </div>

        {/* No Application Yet */}
        {!application && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Apply for Hostel Accommodation
            </h2>
            <p className="text-gray-600 mb-6">
              Submit your application to be assigned a dorm room. Hostel fee:
              50,000 FCFA
            </p>
            <button
              onClick={handleApply}
              disabled={applying}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
            >
              {applying ? "Submitting..." : "Apply Now"}
            </button>
          </div>
        )}

        {/* Application Exists */}
        {application && (
          <>
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Application Status
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {application.status === "Pending" && !application.dorm
                      ? "Waiting for dorm assignment by admin"
                      : application.status === "Pending" && application.dorm
                      ? "Dorm assigned - Pay hostel fees to complete"
                      : "Application completed"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    application.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {application.status}
                </span>
              </div>

              {/* Dorm Information */}
              {application.dorm && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-900 font-semibold mb-2">
                    📍 Assigned Dorm: {application.dorm.name}
                  </p>
                  <p className="text-blue-800 text-sm">
                    {application.dorm.description}
                  </p>
                  {application.room && (
                    <p className="text-blue-900 font-semibold mt-2">
                      🚪 Room Number: {application.room.roomNumber}
                    </p>
                  )}
                </div>
              )}

              {/* Payment Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Total Fee</p>
                  <p className="text-lg font-bold text-gray-900">
                    {application.feeAmount.toLocaleString()} FCFA
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Paid</p>
                  <p className="text-lg font-bold text-green-600">
                    {application.paidAmount.toLocaleString()} FCFA
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Balance</p>
                  <p className="text-lg font-bold text-red-600">
                    {(
                      application.feeAmount - application.paidAmount
                    ).toLocaleString()}{" "}
                    FCFA
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            {application.feeAmount - application.paidAmount > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Pay Hostel Fees
                </h3>

                {!showPayment ? (
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Make Payment
                  </button>
                ) : (
                  <div>
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
                        max={application.feeAmount - application.paidAmount}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Maximum:{" "}
                        {(
                          application.feeAmount - application.paidAmount
                        ).toLocaleString()}{" "}
                        FCFA
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-900 font-semibold mb-3">
                        Select Payment Method
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {/* MTN */}
                        <button
                          onClick={() => handlePayment("MTN")}
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

                        {/* Orange */}
                        <button
                          onClick={() => handlePayment("Orange")}
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

                        {/* Express */}
                        <button
                          onClick={() => handlePayment("Express")}
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
                        setShowPayment(false);
                        setPaymentAmount("");
                        setSelectedMethod("");
                      }}
                      disabled={selectedMethod !== ""}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Payment History */}
            {application.payments.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Payment History
                </h3>
                <div className="space-y-2">
                  {application.payments.map((payment) => (
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
          </>
        )}
      </div>
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
