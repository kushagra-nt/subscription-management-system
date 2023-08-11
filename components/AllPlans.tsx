import { PlanProperties } from '@/constants/PlanProperties';
import { usePlans } from '@/context/PlansContext';
import React from 'react'
import { Button } from './ui/button';
import { useAuth } from '@/context/AuthContext';
import useCheckout from '@/utils/useCheckout';
import { unmountComponentAtNode } from 'react-dom';

const AllPlans = () => {

    const [isMonthly, setIsMonthly] = React.useState(true);

    const {plans, cancelSubscription, isCancelling} = usePlans();
    const {user, updateSubsriptionPlan} = useAuth();
    const {isLoading, checkout} = useCheckout();

  return (
    <div className='my-20 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white py-10 px-16 max-w-full rounded-lg'>
        <h2 className='text-2xl font-semibold mb-5' >Choose the right Plan for you</h2>

        <div className="relative overflow-x-auto">
            <table className="w-full px-5 gap-6 text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {/* plan duration toggle */}
                        <th>
                            <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value='duration' onChange={()=>{setIsMonthly(!isMonthly)}} className="sr-only peer" />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-blue-900 dark:text-gray-300">{isMonthly? "Monthly": "yearly"}</span>
                            </label>
                        </th>
                        {plans?.map(plan => (
                            <th scope="col" className="px-6 py-3" key={plan.id}>
                                {plan.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        PlanProperties.map(property => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={property.id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {property.name}
                                </th>
                                {plans?.map(plan => {
                                    var key = property.id as keyof typeof plan;
                                    if(property.id==='Price')
                                    key = isMonthly? 'monthlyPrice': 'yearlyPrice';

                                    return (<td className="px-6 py-4" key={plan.id}>
                                        {plan[key]}
                                    </td>)
                                })}
                            </tr>
                        ))
                    }
                    <tr className="bg-white border-b align-top dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Devices you can use to watch
                        </th>
                        {plans?.map(plan => (
                            <td>
                                {plan.devices.map(device => (
                                    <div className="px-6 py-4" key={device}>
                                        {device}
                                    </div>
                                ))}
                            </td>
                        ))}
                    </tr>
                    {  (user?.subscriptionPlan==='Free' || user?.subscriptionPlan==='Cancelled')?
                        (<tr>
                            <td></td>
                            {plans?.map(plan => (
                                <td className='text-center'>
                                    <Button onClick={()=>{checkout(plan, isMonthly?'monthly':'yearly')}} disabled={isLoading} data-modal-target="authentication-modal" data-modal-toggle="authentication-modal" >
                                        Subscribe
                                    </Button>
                                </td>
                            ))}
                        </tr>): null
                    }
                </tbody>
            </table>
            {
                (user?.subscriptionPlan!=='Free' && user?.subscriptionPlan!=='Cancelled')?(
                    <div className='text-center'>
                        <h2 className='w-full text-md text-center my-5'>Cancel your current plan to subscribe other plan</h2>
                        <Button disabled={isCancelling} variant='destructive' onClick={async()=>{
                            await cancelSubscription(user?.id || '');
                            updateSubsriptionPlan();
                        }}>Cancel</Button>
                    </div >
                ):null
            }
        </div>

        {/* modal */}

    </div>
  )
}

export default AllPlans