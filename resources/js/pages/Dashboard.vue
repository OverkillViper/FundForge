<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { dashboard } from '@/routes';
import TotalBalance from './Dashboard/TotalBalance.vue';
import TransactionSummary from './Dashboard/TransactionSummary.vue';
import ExpenseCategory from './Dashboard/ExpenseCategory.vue';
import RecentTransactions from './Dashboard/RecentTransactions.vue';
import Obligations from './Dashboard/Obligations.vue';
import Budget from './Dashboard/Budget.vue';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard(),
            },
        ],
    },
});

interface User {
    id: number;
    name: string;
    email: string;
}

interface Account {
    id: number;
    name: string;
    type: string;
    currency: string;
    balance: number;
}

interface TotalBalance {
    balance: number;
    accounts: Account[];
    account_count: number;
    percentage_change: number;
}

interface Income {
    amount: number;
    percentage_change: number;
}

interface Expense {
    amount: number;
    percentage_change: number;
}

interface Savings {
    amount: number;
    percentage_change: number;
}

interface Investment {
    amount: number;
    percentage_change: number;
}

interface TransactionSummary {
    income: Income;
    expense: Expense;
    savings: Savings;
    investment: Investment;
    savings_invested_percentage: number;
}

interface Category {
    id: number;
    name: string;
    amount: number;
    percentage: number;
}

interface ExpenseCategory {
    categories: Category[];
    average_daily: number;
    average_monthly: number;
    ytd_yearly: number;
}

interface Transaction {
    id : number;
    title : string;
    date : string;
    category : string | null;
    account : string;
    account_type : string;
    amount : number;
    currency : string;
    type : string;
}

interface Budget {
    budget: number;
    spent: number;
    remaining: number;
    spent_percentage: number;
}

interface Budgets {
    daily: Budget;
    monthly: Budget;
    quarterly: Budget;
}

interface Obligation {
    lent: number;
    borrowed: number;
}

const page = usePage<{
    auth: {
        user: User;
    };
}>();

const user = page.props.auth.user;

const now = new Date();
const day = String(new Date().getDate()).padStart(2, '0');
const monthName = now.toLocaleString('en-US', {
    month: 'long',
});
const dayName = now.toLocaleString('en-US', {
    weekday: 'long',
});

const props = defineProps<{
    totalBalance: TotalBalance;
    transactionSummary: TransactionSummary;
    expenseCategories: ExpenseCategory;
    recentTransactions: Transaction[];
    budgets: Budgets;
    obligations: Obligation;
}>();

</script>

<template>
<AppLayout pageTitle="Overview" :hide-background="true">
    <template #content>
        <div class="flex justify-between -mt-2">
            <div class="text-3xl">
                <div class="text-gray-500 font-light">Welcome back, <span class="text-black">{{ user.name }}</span></div>
                <div class="text-xs text-gray-500">Stay on top of your finances</div>
            </div>
            <div class="flex gap-x-2 items-center">
                <div class="text-[38px] font-light">{{ day }}</div>
                <div class="flex flex-col">
                    <div class="uppercase text-sm font-light text-gray-500 tracking-widest">
                        {{ dayName }}
                    </div>
                    <div class="flex items-center text-xs">
                        <span>{{ monthName }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-3 mt-2 gap-3">
            <TotalBalance :total-balance="totalBalance"/>
            <TransactionSummary :transaction-summary="transactionSummary"/>
            <ExpenseCategory :expense-categories="expenseCategories"/>
            <RecentTransactions class="col-span-2" :recent-transactions="recentTransactions"/>
            <div class="flex flex-col gap-y-3">
                <Budget :budgets="budgets"/>
                <Obligations :obligations="obligations"/>
            </div>
        </div>
    </template>
</AppLayout>
</template>
