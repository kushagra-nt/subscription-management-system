import { useAuth } from '@/context/AuthContext';
import React from 'react'

const SubscriberPlanDetails = () => {

  const {user} = useAuth();

  return (
    <section>
      {user?.subscriptionPlan === 'Free' ? (

        // Free plan 
        <>
          <div
            className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
            <div className='flex flex-row gap-2'>
            <h5
              className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
              Current Plan Details
            </h5>
            {<p className="mb-4 p-1 rounded-md bg-green-100 text-sm text-green-500">Free</p>}
            </div>
            <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
              you are currently on the free plan. You can upgrade to a paid plan to get more features.
            </p>
          </div>
        </>
      ): (
        (user && user?.subscriptionPlan === 'Cancelled') ? (
          // cancelled Plan
          <>
            <div
              className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
              <div className='flex flex-row gap-2'>
              <h5
                className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                Current Plan Details
              </h5>
              <p className="mb-4 p-1 rounded-md bg-red-100 text-sm text-red-500">Cancelled</p>
              </div>
              <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
                {`You have cancelled your subscription plan, you have access to services till ${(new Date(user?.subscriptionEndsAt || '')).toLocaleDateString()}. You can resubscribe to any plan.`}
              </p>
            </div>
          </> 
        ): (
          <>
            <div
              className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
              <div className='flex flex-row gap-2'>
              <h5
                className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                Current Plan Details
              </h5>
              <p className="mb-4 p-1 rounded-md bg-blue-100 text-sm text-blue-500">{user?.subscriptionPlan}</p>
              </div>
              <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
                {`your subscription has started on ${(new Date(user?.subscribedAt || '')).toLocaleDateString()} and will auto renew on ${(new Date(user?.subscriptionEndsAt || '')).toLocaleDateString()}`}
              </p>
            </div>
          </>
        )
      )}
    
    </section>
  )
}

export default SubscriberPlanDetails