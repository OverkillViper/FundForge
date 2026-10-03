<script lang="ts" setup>
import { computed, ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import Popover from 'primevue/popover';
import { Link, useForm } from '@inertiajs/vue3';
import Button from 'primevue/button';

import { formatCurrency } from '@/lib/formatters';

interface IncomeTax {
    user_id: number;
    from_year: number;
    to_year: number;

    current_salary: number;
    previous_salary: number;

    festival_bonus: number;
    other_bonus: number;

    net_bank_interest: number;
    net_bank_tds: number;
    net_bank_charges: number;
}

interface ProvidentFund {
    start_date: string;
}

const props = defineProps<{
    selectedIncomeYear: number;
    incomeTax: IncomeTax | null;
    salaryEffectiveMonth: number | null;
    providentFundPercentage: number | null;
    providentFund: ProvidentFund | null;
}>();

/*
|--------------------------------------------------------------------------
| Tax Form
|--------------------------------------------------------------------------
*/

const taxForm = useForm({
    from_year: props.incomeTax?.from_year ?? props.selectedIncomeYear,

    to_year: props.incomeTax?.to_year ?? props.selectedIncomeYear + 1,

    current_salary: Number(props.incomeTax?.current_salary ?? 0),

    previous_salary: Number(props.incomeTax?.previous_salary ?? 0),

    festival_bonus: Number(props.incomeTax?.festival_bonus ?? 0),

    other_bonus: Number(props.incomeTax?.other_bonus ?? 0),

    net_bank_interest: Number(props.incomeTax?.net_bank_interest ?? 0),

    net_bank_tds: Number(props.incomeTax?.net_bank_tds ?? 0),

    net_bank_charges: Number(props.incomeTax?.net_bank_charges ?? 0),
});

/*
|--------------------------------------------------------------------------
| Salary Months
|--------------------------------------------------------------------------
|
| Income year is July -> June.
|
| Example:
|
| Effective month = January
|
| July-Dec = previous salary = 6 months
| Jan-June = current salary  = 6 months
|
*/

const salaryEffectiveMonth = computed(() => {
    return props.salaryEffectiveMonth ?? 1;
});

const oldSalaryMonths = computed(() => {
    return salaryEffectiveMonth.value >= 7
        ? salaryEffectiveMonth.value - 7
        : salaryEffectiveMonth.value + 5;
});

const newSalaryMonths = computed(() => {
    return 12 - oldSalaryMonths.value;
});

/*
|--------------------------------------------------------------------------
| Income-Year Month Position
|--------------------------------------------------------------------------
|
| July      = 0
| August    = 1
| September = 2
| October   = 3
| November  = 4
| December  = 5
| January   = 6
| February  = 7
| March     = 8
| April     = 9
| May       = 10
| June      = 11
|
*/

const incomeYearPosition = (month: number): number => {
    return month >= 7 ? month - 7 : month + 5;
};

/*
|--------------------------------------------------------------------------
| Salary Effective Position
|--------------------------------------------------------------------------
*/

const salaryEffectivePosition = computed(() => {
    return incomeYearPosition(salaryEffectiveMonth.value);
});

/*
|--------------------------------------------------------------------------
| PF Start Position
|--------------------------------------------------------------------------
*/

const pfStartPosition = computed<number | null>(() => {
    if (!props.providentFund?.start_date) {
        return null;
    }

    const [startYear, startMonth] = props.providentFund.start_date
        .substring(0, 10)
        .split('-')
        .map(Number);

    const incomeYearStart = Number(taxForm.from_year);

    const incomeYearEnd = Number(taxForm.to_year);

    /*
        |--------------------------------------------------------------------------
        | PF starts after selected income year
        |--------------------------------------------------------------------------
        */

    if (
        startYear > incomeYearEnd ||
        (startYear === incomeYearEnd && startMonth >= 7)
    ) {
        return null;
    }

    /*
        |--------------------------------------------------------------------------
        | PF started before selected income year
        |--------------------------------------------------------------------------
        */

    if (
        startYear < incomeYearStart ||
        (startYear === incomeYearStart && startMonth < 7)
    ) {
        return 0;
    }

    /*
        |--------------------------------------------------------------------------
        | PF started during selected income year
        |--------------------------------------------------------------------------
        */

    return incomeYearPosition(startMonth);
});

/*
|--------------------------------------------------------------------------
| PF-covered Old Salary Months
|--------------------------------------------------------------------------
*/

const pfOldSalaryMonths = computed(() => {
    if (pfStartPosition.value === null) {
        return 0;
    }

    let count = 0;

    for (
        let position = 0;
        position < salaryEffectivePosition.value;
        position++
    ) {
        if (position >= pfStartPosition.value) {
            count++;
        }
    }

    return count;
});

/*
|--------------------------------------------------------------------------
| PF-covered New Salary Months
|--------------------------------------------------------------------------
*/

const pfNewSalaryMonths = computed(() => {
    if (pfStartPosition.value === null) {
        return 0;
    }

    let count = 0;

    for (
        let position = salaryEffectivePosition.value;
        position < 12;
        position++
    ) {
        if (position >= pfStartPosition.value) {
            count++;
        }
    }

    return count;
});

/*
|--------------------------------------------------------------------------
| Employer PF Monthly Contribution
|--------------------------------------------------------------------------
*/

const previousMonthlyContribution = computed(() => {
    if (!props.providentFund || pfStartPosition.value === null) {
        return 0;
    }

    const pfPercentage = Number(props.providentFundPercentage ?? 0);

    const previousBasicSalary = Number(taxForm.previous_salary ?? 0) / 2;

    return (previousBasicSalary * pfPercentage) / 100;
});

const currentMonthlyContribution = computed(() => {
    if (!props.providentFund || pfStartPosition.value === null) {
        return 0;
    }

    const pfPercentage = Number(props.providentFundPercentage ?? 0);

    const currentBasicSalary = Number(taxForm.current_salary ?? 0) / 2;

    return (currentBasicSalary * pfPercentage) / 100;
});

/*
|--------------------------------------------------------------------------
| Employer PF Contribution
|--------------------------------------------------------------------------
*/

const employerPfContribution = computed(() => {
    if (!props.providentFund || pfStartPosition.value === null) {
        return 0;
    }

    return (
        previousMonthlyContribution.value * pfOldSalaryMonths.value +
        currentMonthlyContribution.value * pfNewSalaryMonths.value
    );
});

/*
|--------------------------------------------------------------------------
| Salary Income Calculations
|--------------------------------------------------------------------------
*/

const currentSalaryTotal = computed(() => {
    return Number(taxForm.current_salary ?? 0) * newSalaryMonths.value;
});

const previousSalaryTotal = computed(() => {
    return Number(taxForm.previous_salary ?? 0) * oldSalaryMonths.value;
});

const festivalBonusTotal = computed(() => {
    return Number(taxForm.festival_bonus ?? 0);
});

const otherBonusTotal = computed(() => {
    return Number(taxForm.other_bonus ?? 0);
});

/*
|--------------------------------------------------------------------------
| Bank Income
|--------------------------------------------------------------------------
|
| Net bank interest is the income contributed by bank accounts.
| TDS and charges are tracked separately and are not income.
|
*/

const netBankIncome = computed(() => {
    return (
        Number(taxForm.net_bank_interest ?? 0) -
        Number(taxForm.net_bank_tds ?? 0) -
        Number(taxForm.net_bank_charges ?? 0)
    );
});

/*
|--------------------------------------------------------------------------
| Total Income
|--------------------------------------------------------------------------
*/

const totalIncomeFromSalary = computed(() => {
    return (
        currentSalaryTotal.value +
        previousSalaryTotal.value +
        festivalBonusTotal.value +
        otherBonusTotal.value +
        employerPfContribution.value
    );
});

const totalIncome = computed(() => {
    return totalIncomeFromSalary.value + netBankIncome.value;
});

/*
|--------------------------------------------------------------------------
| Submit
|--------------------------------------------------------------------------
*/

const submit = () => {
    taxForm.post('/income-taxes', {
        preserveScroll: true,
    });
};

/*
|--------------------------------------------------------------------------
| Popovers
|--------------------------------------------------------------------------
*/

const salaryInfoPopover = ref();

const toggleSalaryInfo = (event: Event) => {
    salaryInfoPopover.value.toggle(event);
};

const pfInfoPopover = ref();

const togglePfInfo = (event: Event) => {
    pfInfoPopover.value.toggle(event);
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const monthName = (month: number | null): string => {
    if (!month) {
        return 'not set';
    }

    return new Date(2000, month - 1, 1).toLocaleDateString('en-US', {
        month: 'long',
    });
};
</script>

<template>
    <div>
        <form @submit.prevent="submit">
            <!-- Salary & Bonuses -->
            <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div class="flex items-center gap-3">
                        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <span class="pi pi-wallet text-sm"></span>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-gray-900">Salary & Bonuses</div>
                            <div class="mt-0.5 text-xs text-gray-500">Employment income for the selected income year</div>
                        </div>
                    </div>
                </div>

                <div class="p-5">
                    <table class="w-full border-separate border-spacing-y-2 text-sm">
                        <thead>
                            <tr class="text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                <th class="w-3/10 pb-1">Particulars</th>
                                <th class="w-2/10 pb-1">Amount</th>
                                <th class="w-1/10 pb-1 text-center"></th>
                                <th class="w-2/10 pb-1">Multiplier</th>
                                <th class="w-2/10 pb-1 text-right">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            <!-- Current Salary -->
                            <tr>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium text-gray-700">Current Salary</span>
                                        <button type="button" class="text-gray-400 transition hover:text-primary" @click="toggleSalaryInfo">
                                            <i class="pi pi-info-circle text-xs"></i>
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <InputNumber
                                        v-model="taxForm.current_salary"
                                        size="small"
                                        suffix=" BDT"
                                        placeholder="Enter current salary"
                                        :min="0"
                                    />
                                </td>
                                <td class="text-center text-gray-400"><span class="pi pi-times text-xs"></span></td>
                                <td class="text-gray-600">{{ newSalaryMonths }}</td>
                                <td class="text-right font-medium text-gray-800">{{ formatCurrency(currentSalaryTotal) }} BDT</td>
                            </tr>

                            <!-- Previous Salary -->
                            <tr>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium text-gray-700">Previous Salary</span>
                                        <button type="button" class="text-gray-400 transition hover:text-primary" @click="toggleSalaryInfo">
                                            <i class="pi pi-info-circle text-xs"></i>
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <InputNumber
                                        v-model="taxForm.previous_salary"
                                        size="small"
                                        suffix=" BDT"
                                        placeholder="Enter previous salary"
                                        :min="0"
                                    />
                                </td>
                                <td class="text-center text-gray-400"><span class="pi pi-times text-xs"></span></td>
                                <td class="text-gray-600">{{ oldSalaryMonths }}</td>
                                <td class="text-right font-medium text-gray-800">{{ formatCurrency(previousSalaryTotal) }} BDT</td>
                            </tr>

                            <!-- Festival Bonus -->
                            <tr>
                                <td class="font-medium text-gray-700">Festival Bonus</td>
                                <td>
                                    <InputNumber
                                        v-model="taxForm.festival_bonus"
                                        size="small"
                                        suffix=" BDT"
                                        placeholder="Enter festival bonus"
                                        :min="0"
                                    />
                                </td>
                                <td class="text-center text-gray-400"><span class="pi pi-times text-xs"></span></td>
                                <td class="text-gray-600">1</td>
                                <td class="text-right font-medium text-gray-800">{{ formatCurrency(festivalBonusTotal) }} BDT</td>
                            </tr>

                            <!-- Other Bonus -->
                            <tr>
                                <td class="font-medium text-gray-700">Other Bonus</td>
                                <td>
                                    <InputNumber
                                        v-model="taxForm.other_bonus"
                                        size="small"
                                        suffix=" BDT"
                                        placeholder="Enter other bonus"
                                        :min="0"
                                    />
                                </td>
                                <td class="text-center text-gray-400"><span class="pi pi-times text-xs"></span></td>
                                <td class="text-gray-600">1</td>
                                <td class="text-right font-medium text-gray-800">{{ formatCurrency(otherBonusTotal) }} BDT</td>
                            </tr>

                            <!-- Employer PF -->
                            <tr>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium text-gray-700">Employer PF Contribution</span>
                                        <button type="button" class="text-gray-400 transition hover:text-primary" @click="togglePfInfo">
                                            <i class="pi pi-info-circle text-xs"></i>
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <div v-if="props.providentFund && pfStartPosition !== null" class="flex items-center gap-1 text-xs text-gray-600">
                                        <span>{{ pfOldSalaryMonths }}</span>
                                        <i class="pi pi-times text-[10px]!"></i>
                                        <span>{{ formatCurrency(previousMonthlyContribution) }}</span>
                                        <i class="pi pi-plus mx-1 text-[10px]!"></i>
                                        <span>{{ pfNewSalaryMonths }}</span>
                                        <i class="pi pi-times text-[10px]!"></i>
                                        <span>{{ formatCurrency(currentMonthlyContribution) }}</span>
                                    </div>
                                    <span v-else class="text-gray-400">0</span>
                                </td>
                                <td class="text-center text-gray-400"><span class="pi pi-times text-xs"></span></td>
                                <td class="text-gray-600">1</td>
                                <td class="text-right font-medium text-gray-800">{{ formatCurrency(employerPfContribution) }} BDT</td>
                            </tr>

                            <!-- Total -->
                            <tr>
                                <td colspan="4" class="border-t border-gray-200 pt-4 font-semibold text-gray-800">Total Income from Salary</td>
                                <td class="border-t border-gray-200 pt-4 text-right font-bold text-gray-900">{{ formatCurrency(totalIncomeFromSalary) }} BDT</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Bank Income -->
            <div class="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div class="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                    <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span class="pi pi-building-columns text-sm"></span>
                    </div>
                    <div>
                        <div class="text-sm font-semibold text-gray-900">Bank Interest, TDS & Charges</div>
                        <div class="mt-0.5 text-xs text-gray-500">Net income earned through your bank accounts</div>
                    </div>
                </div>

                <div class="p-5">
                    <table class="w-full border-separate border-spacing-y-2 text-sm">
                        <thead>
                            <tr class="text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                <th class="w-1/5 pb-1">Particulars</th>
                                <th class="w-1/5 pb-1"></th>
                                <th class="w-1/5 px-2 pb-1">Net Bank Interest</th>
                                <th class="w-1/5 px-2 pb-1">Net Bank TDS</th>
                                <th class="w-1/5 px-2 pb-1">Net Bank Charges</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td class="font-medium text-gray-700">Amount</td>
                                <td></td>
                                <td class="px-2">
                                    <InputNumber
                                        v-model="taxForm.net_bank_interest"
                                        size="small"
                                        suffix=" BDT"
                                        placeholder="Net bank interest"
                                        :min="0"
                                    />
                                </td>
                                <td class="px-2">
                                    <InputNumber
                                        v-model="taxForm.net_bank_tds"
                                        size="small"
                                        suffix=" BDT"
                                        placeholder="Net bank TDS"
                                        :min="0"
                                    />
                                </td>
                                <td class="px-2">
                                    <InputNumber
                                        v-model="taxForm.net_bank_charges"
                                        size="small"
                                        suffix=" BDT"
                                        placeholder="Net bank charges"
                                        :min="0"
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td colspan="2" class="border-t border-gray-200 pt-4 font-semibold text-gray-800">Total Income from Bank Accounts</td>
                                <td colspan="2" class="border-t border-gray-200 px-2 pt-4 text-xs text-gray-500">Net Interest − (Net TDS + Net Charges)</td>
                                <td class="border-t border-gray-200 px-4 pt-4 text-right font-bold text-gray-900">{{ formatCurrency(netBankIncome) }} BDT</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Save -->
            <div class="mt-4 flex justify-end">
                <Button
                    type="submit"
                    label="Save Income Information"
                    icon="pi pi-save"
                    size="small"
                    :loading="taxForm.processing"
                />
            </div>
        </form>

        <!-- Salary Information -->
        <Popover ref="salaryInfoPopover">
            <div class="max-w-xs text-sm leading-relaxed text-gray-600">
                Salary is multiplied by the number of months based on your
                <span class="font-medium text-gray-800">Effective Increment Month</span>
                setting, which is currently
                <span class="font-medium text-gray-800">{{ monthName(salaryEffectiveMonth) }}</span>.
                <div class="mt-2">You can change this in <Link href="/settings" class="font-medium text-primary hover:underline">Settings</Link>.</div>
            </div>
        </Popover>

        <!-- PF Information -->
        <Popover ref="pfInfoPopover">
            <div class="max-w-xs text-sm leading-relaxed text-gray-600">
                <template v-if="props.providentFund">
                    Employer's contribution is calculated as
                    <span class="font-medium text-gray-800">{{ props.providentFundPercentage ?? 0 }}%</span>
                    of your basic salary, where basic salary is 50% of your total salary.
                    <div class="mt-2">Your Provident Fund started on <span class="font-medium text-gray-800">{{ props.providentFund.start_date }}</span>. Therefore, employer contributions are only calculated for the months after the PF start date within this income year.</div>
                </template>
                <template v-else>
                    You do not currently have a <span class="font-medium text-gray-800">Provident Fund</span> record.
                    <div class="mt-2">Therefore, no employer PF contribution is included in this calculation.</div>
                </template>
                <div class="mt-2">You can change your PF settings in <Link href="/settings" class="font-medium text-primary hover:underline">Settings</Link>.</div>
            </div>
        </Popover>
    </div>
</template>
