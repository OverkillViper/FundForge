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
                <div class="flex items-center justify-between border-b border-gray-300 p-3 lg:p-4">
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

                <div class="p-3 lg:p-4">
                    <div class="flex flex-col gap-2 text-sm">
                        <!-- Column headings -->
                        <div class="hidden grid-cols-[3fr_2fr_0.5fr_2fr_2fr] gap-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400 lg:grid">
                            <div>Particulars</div>
                            <div>Amount</div>
                            <div class="text-center"></div>
                            <div>Multiplier</div>
                            <div class="text-right">Total</div>
                        </div>

                        <!-- Current Salary -->
                        <div class="grid grid-cols-1 gap-2 border-b border-gray-300 pb-2 lg:grid-cols-[3fr_2fr_0.5fr_4fr] lg:items-center lg:gap-3 lg:border-0 lg:pb-0">
                            <div class="flex items-center gap-2 font-medium text-gray-700">
                                <span>Current Salary</span>
                                <button type="button" class="text-gray-400 transition hover:text-primary" @click="toggleSalaryInfo">
                                    <i class="pi pi-info-circle text-xs"></i>
                                </button>
                            </div>
                            <div class="flex flex-col gap-1">
                                <InputNumber v-model="taxForm.current_salary" size="small" suffix=" BDT" placeholder="Enter current salary" :min="0" fluid />
                            </div>
                            <div class="hidden text-center text-gray-400 lg:block"><i class="pi pi-times text-xs"></i></div>
                            <div class="flex items-center justify-between lg:justify-start text-xs lg:text-sm">
                                <span class="w-1/4 lg:w-auto text-gray-500 lg:hidden">Multiplier</span>
                                <span class="w-1/4 lg:w-auto text-gray-600 lg:flex-1">{{ newSalaryMonths }}</span>
                                <span class="w-1/4 lg:w-auto text-gray-500 lg:hidden">Total</span>
                                <span class="w-1/4 lg:w-auto font-medium text-gray-800 text-end">{{ formatCurrency(currentSalaryTotal) }} BDT</span>
                            </div>
                        </div>

                        <!-- Previous Salary -->
                        <div class="grid grid-cols-1 gap-2 border-b border-gray-300 pb-2 lg:grid-cols-[3fr_2fr_0.5fr_4fr] lg:items-center lg:gap-3 lg:border-0 lg:pb-0">
                            <div class="flex items-center gap-2 font-medium text-gray-700">
                                <span>Previous Salary</span>
                                <button type="button" class="text-gray-400 transition hover:text-primary" @click="toggleSalaryInfo">
                                    <i class="pi pi-info-circle text-xs"></i>
                                </button>
                            </div>
                            <div class="flex flex-col gap-1">
                                <InputNumber v-model="taxForm.previous_salary" size="small" suffix=" BDT" placeholder="Enter previous salary" :min="0" fluid />
                            </div>
                            <div class="hidden text-center text-gray-400 lg:block"><i class="pi pi-times text-xs"></i></div>
                            <div class="flex items-center justify-between lg:justify-start text-xs lg:text-sm">
                                <span class="w-1/4 lg:w-auto text-gray-500 lg:hidden">Multiplier</span>
                                <span class="w-1/4 lg:w-auto text-gray-600 lg:flex-1">{{ oldSalaryMonths }}</span>
                                <span class="w-1/4 lg:w-auto text-gray-500 lg:hidden">Total</span>
                                <span class="w-1/4 lg:w-auto font-medium text-gray-800 text-end">{{ formatCurrency(previousSalaryTotal) }} BDT</span>
                            </div>
                        </div>

                        <!-- Festival Bonus -->
                        <div class="grid grid-cols-1 gap-2 border-b border-gray-300 pb-2 lg:grid-cols-[3fr_2fr_0.5fr_4fr] lg:items-center lg:gap-3 lg:border-0 lg:pb-0">
                            <div class="font-medium text-gray-700">Festival Bonus</div>
                            <div class="flex flex-col gap-1">
                                <InputNumber v-model="taxForm.festival_bonus" size="small" suffix=" BDT" placeholder="Enter festival bonus" :min="0" fluid />
                            </div>
                            <div class="hidden text-center text-gray-400 lg:block"><i class="pi pi-times text-xs"></i></div>
                            <div class="flex items-center justify-between lg:justify-start text-xs lg:text-sm">
                                <span class="w-1/4 lg:w-auto text-gray-500 lg:hidden">Multiplier</span>
                                <span class="w-1/4 lg:w-auto text-gray-600 lg:flex-1">1</span>
                                <span class="w-1/4 lg:w-auto text-gray-500 lg:hidden">Total</span>
                                <span class="w-1/4 lg:w-auto font-medium text-gray-800 text-end">{{ formatCurrency(festivalBonusTotal) }} BDT</span>
                            </div>
                        </div>

                        <!-- Other Bonus -->
                        <div class="grid grid-cols-1 gap-2 border-b border-gray-300 pb-2 lg:grid-cols-[3fr_2fr_0.5fr_4fr] lg:items-center lg:gap-3 lg:border-0 lg:pb-0">
                            <div class="font-medium text-gray-700">Other Bonus</div>
                            <div class="flex flex-col gap-1">
                                <InputNumber v-model="taxForm.other_bonus" size="small" suffix=" BDT" placeholder="Enter other bonus" :min="0" fluid />
                            </div>
                            <div class="hidden text-center text-gray-400 lg:block"><i class="pi pi-times text-xs"></i></div>
                            <div class="flex items-center justify-between lg:justify-start text-xs lg:text-sm">
                                <span class="w-1/4 lg:w-auto text-gray-500 lg:hidden">Multiplier</span>
                                <span class="w-1/4 lg:w-auto text-gray-600 lg:flex-1">1</span>
                                <span class="w-1/4 lg:w-auto text-gray-500 lg:hidden">Total</span>
                                <span class="w-1/4 lg:w-auto font-medium text-gray-800 text-end">{{ formatCurrency(otherBonusTotal) }} BDT</span>
                            </div>
                        </div>

                        <!-- Employer PF -->
                        <div class="grid grid-cols-1 gap-2 pb-2 lg:grid-cols-[3fr_2fr_0.5fr_4fr] lg:items-center lg:gap-3 lg:border-0 lg:py-2">
                            <div class="flex items-center gap-2 font-medium text-gray-700">
                                <span>Employer PF Contribution</span>
                                <button type="button" class="text-gray-400 transition hover:text-primary" @click="togglePfInfo">
                                    <i class="pi pi-info-circle text-xs"></i>
                                </button>
                            </div>
                            <div>
                                <div v-if="props.providentFund && pfStartPosition !== null" class="flex flex-wrap items-center gap-1 text-xs text-gray-600">
                                    <span>{{ pfOldSalaryMonths }}</span>
                                    <i class="pi pi-times text-[10px]!"></i>
                                    <span>{{ formatCurrency(previousMonthlyContribution) }}</span>
                                    <i class="pi pi-plus mx-1 text-[10px]!"></i>
                                    <span>{{ pfNewSalaryMonths }}</span>
                                    <i class="pi pi-times text-[10px]!"></i>
                                    <span>{{ formatCurrency(currentMonthlyContribution) }}</span>
                                </div>
                                <span v-else class="text-gray-400">0</span>
                            </div>
                            <div class="hidden text-center text-gray-400 lg:block"><i class="pi pi-times text-xs"></i></div>
                            <div class="flex items-center justify-between lg:justify-start text-xs lg:text-sm">
                                <span class="w-1/4 lg:w-auto text-gray-500 lg:hidden">Multiplier</span>
                                <span class="w-1/4 lg:w-auto text-gray-600 lg:flex-1">1</span>
                                <span class="w-1/4 lg:w-auto text-gray-500 lg:hidden">Total</span>
                                <span class="w-1/4 lg:w-auto font-medium text-gray-800 text-end">{{ formatCurrency(employerPfContribution) }} BDT</span>
                            </div>
                        </div>

                        <!-- Total -->
                        <div class="flex flex-col gap-2 border-t border-gray-300 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <span class="font-semibold text-gray-800">Total Income from Salary</span>
                            <span class="text-base font-bold text-gray-900">{{ formatCurrency(totalIncomeFromSalary) }} BDT</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bank Income -->
            <div class="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div class="flex items-center gap-3 border-b border-gray-300 p-4">
                    <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span class="pi pi-building-columns text-sm"></span>
                    </div>
                    <div>
                        <div class="text-sm font-semibold text-gray-900">Bank Interest, TDS & Charges</div>
                        <div class="mt-0.5 text-xs text-gray-500">Net income earned through your bank accounts</div>
                    </div>
                </div>

                <div class="flex flex-col lg:grid lg:grid-cols-4 gap-2 text-sm p-4 uppercase tracking-wider text-gray-400 text-[10px]">
                    <div class="font-semibold hidden lg:block lg:order-1">Particulars</div>
                    <div class="font-semibold lg:order-2">Net Bank Interest</div>
                    <InputNumber
                        v-model="taxForm.net_bank_interest"
                        size="small"
                        suffix=" BDT"
                        placeholder="Net bank interest"
                        :min="0"
                        fluid
                        class="lg:order-6"
                    />
                    <div class="font-semibold lg:order-3">Net Bank TDS</div>
                    <InputNumber
                        v-model="taxForm.net_bank_tds"
                        size="small"
                        suffix=" BDT"
                        placeholder="Net bank TDS"
                        :min="0"
                        fluid
                        class="lg:order-7"
                    />
                    <div class="font-semibold lg:order-4">Net Bank Charges</div>
                    <InputNumber
                        v-model="taxForm.net_bank_charges"
                        size="small"
                        suffix=" BDT"
                        placeholder="Net bank charges"
                        :min="0"
                        fluid
                        class="lg:order-8"
                    />
                    <div class="font-medium text-gray-700 text-md hidden lg:block lg:order-5">Amount</div>
                </div>

                <div class="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row sm:items-start sm:justify-between">
                    <div class="flex flex-col gap-1 sm:flex-1">
                        <div class="font-semibold text-gray-800 text-sm">Total Income from Bank Accounts</div>
                        <div class="text-xs text-gray-500">Net Interest − (Net TDS + Net Charges)</div>
                    </div>

                    <div class="text-left text-base font-bold text-gray-900 sm:text-right">
                        {{ formatCurrency(netBankIncome) }} BDT
                    </div>
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
                <div class="mt-2">You can change this in <Link href="/settings/app" class="font-medium text-primary hover:underline">Settings</Link>.</div>
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
                <div class="mt-2">You can change your PF settings in <Link href="/settings/app" class="font-medium text-primary hover:underline">Settings</Link>.</div>
            </div>
        </Popover>
    </div>
</template>
