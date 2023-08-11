"use client";
import AllPlans from "@/components/AllPlans";
import Navbar from "@/components/Navbar";
import SubscriberPlanDetails from "@/components/SubscriberPlanDetails";

export default function Home() {

  return ( 
    <div className="w-full min-h-full">
      {/* Navbar  */}
      < Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full bg-gray-100 pt-20">
        <SubscriberPlanDetails />
        < AllPlans /> 
      </div>

    </div >
  )
}
