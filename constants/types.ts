
export type User = {
    id: string;
    userName: string;
    email: string;
    subscriptionPlan:  string;
    subscribedAt: Date | null;
    subscriptionEndsAt: Date | null;
}

export type Plan = {
    id: string;
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    videoQuality: string;
    resolution: string;
    devices: string[];
    stripeMonthlyId: string;
    stripeYearlyId: string;
}