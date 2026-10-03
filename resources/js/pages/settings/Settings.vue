<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { useForm, router } from '@inertiajs/vue3';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import ScrollPanel from 'primevue/scrollpanel';
import { update } from '@/routes/tax-settings';
import { restoreDefaults as restoreDefaultsRoute } from '@/routes/tax-settings';
import { update as updateIncomeTaxSlabs } from '@/routes/tax-settings/income-slabs';
import { update as updateSavingsCertificateTaxBrackets } from '@/routes/tax-settings/savings-certificates';
import { ref } from 'vue';

interface UserSetting {
    salary_effective_month: number;
    provident_fund_percentage: number;
    rebate_percentage: number;
    dps_investment_cap: number;
    max_rebate_cap: number;
}

interface SavingsCertificateTaxBracket {
    id?: number;
    minimum_investment: number;
    tax_percent: number;
}

interface IncomeTaxSlab {
    id?: number;
    income_from: number;
    income_to: number | null;
    tax_percent: number;
}

const props = defineProps<{
    settings: UserSetting;
    savingsCertificateTaxBrackets: SavingsCertificateTaxBracket[];
    incomeTaxSlabs: IncomeTaxSlab[];
}>();

const months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
];

const settingsForm = useForm({
    salary_effective_month: props.settings.salary_effective_month,
    provident_fund_percentage: props.settings.provident_fund_percentage,
    rebate_percentage: props.settings.rebate_percentage,
    dps_investment_cap: props.settings.dps_investment_cap,
    max_rebate_cap: props.settings.max_rebate_cap,
});

const savingsCertificateForm = useForm({
    brackets: props.savingsCertificateTaxBrackets.map(bracket => ({ ...bracket })),
});

const incomeTaxForm = useForm({
    slabs: props.incomeTaxSlabs.map(slab => ({ ...slab })),
});

const restoreDefaultsDialog = ref(false);
const restoringDefaults = ref(false);

const saveSettings = () => {
    settingsForm.put(update.url());
};

const saveSavingsCertificateTaxBrackets = () => {
    savingsCertificateForm.put(updateSavingsCertificateTaxBrackets.url());
};

const saveIncomeTaxSlabs = () => {
    incomeTaxForm.put(updateIncomeTaxSlabs.url());
};

const addSavingsCertificateBracket = () => {
    savingsCertificateForm.brackets.push({
        minimum_investment: 0,
        tax_percent: 0,
    });
};

const removeSavingsCertificateBracket = (index: number) => {
    savingsCertificateForm.brackets.splice(index, 1);
};

const addIncomeTaxSlab = () => {
    incomeTaxForm.slabs.push({
        income_from: 0,
        income_to: null,
        tax_percent: 0,
    });
};

const removeIncomeTaxSlab = (index: number) => {
    incomeTaxForm.slabs.splice(index, 1);
};

const getSlabAmount = (slab: IncomeTaxSlab) => {
    if (slab.income_to === null) {
        return null;
    }

    return slab.income_to - slab.income_from;
};

const getSlabLabel = (index: number) => {
    return index === 0 ? 'First' : 'Next';
};

const openRestoreDefaultsDialog = () => {
    restoreDefaultsDialog.value = true;
};

const restoreDefaults = () => {
    restoringDefaults.value = true;

    router.put(restoreDefaultsRoute.url(), {}, {
        preserveScroll: true,
        onFinish: () => {
            restoringDefaults.value = false;
            restoreDefaultsDialog.value = false;
        },
    });
};
</script>

<template>
    <AppLayout page-title="Settings">
        <template #content>
            <ScrollPanel class="mt-4 h-[720px] w-full">
                <div class="mx-auto max-w-5xl space-y-5 pb-8">
                    <!-- Page Header -->
                    <div class="flex items-start justify-between gap-4 px-1">
                        <div>
                            <h1 class="text-lg font-semibold text-gray-900">Settings</h1>
                            <p class="mt-1 text-xs text-gray-500">
                                Configure the values used to calculate your interest, income tax and rebates.
                            </p>
                        </div>

                        <Button
                            label="Restore Defaults"
                            icon="pi pi-refresh"
                            outlined
                            size="small"
                            @click="openRestoreDefaultsDialog"
                        />
                    </div>

                    <!-- General Tax Settings -->
                    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <div class="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <i class="pi pi-sliders-h text-sm"></i>
                            </div>
                            <div>
                                <div class="text-sm font-semibold text-gray-900">Tax Settings</div>
                                <div class="mt-0.5 text-xs text-gray-500">General values used throughout your tax calculations.</div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 p-5">
                            <div class="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                                <label class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Salary Effective Month</label>
                                <p class="mb-3 mt-1 text-xs text-gray-500">Month from which you get your incremented salary.</p>
                                <Select
                                    v-model="settingsForm.salary_effective_month"
                                    :options="months"
                                    optionLabel="label"
                                    optionValue="value"
                                    class="w-full"
                                    size="small"
                                    filter
                                />
                            </div>

                            <div class="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                                <label class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Provident Fund Contribution Rate</label>
                                <p class="mb-3 mt-1 text-xs text-gray-500">Percentage of your basic salary considered as PF contribution</p>
                                <InputNumber
                                    v-model="settingsForm.provident_fund_percentage"
                                    suffix="%"
                                    :min="0"
                                    :max="100"
                                    :minFractionDigits="0"
                                    :maxFractionDigits="2"
                                    class="w-full"
                                    size="small"
                                />
                            </div>

                            <div class="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                                <label class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Rebate Percentage</label>
                                <p class="mb-3 mt-1 text-xs text-gray-500">Percentage of eligible investment used for rebate calculation.</p>
                                <InputNumber
                                    v-model="settingsForm.rebate_percentage"
                                    suffix="%"
                                    :min="0"
                                    :max="100"
                                    :minFractionDigits="0"
                                    :maxFractionDigits="2"
                                    class="w-full"
                                    size="small"
                                />
                            </div>

                            <div class="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                                <label class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">DPS Investment Cap</label>
                                <p class="mb-3 mt-1 text-xs text-gray-500">Maximum DPS investment considered eligible for rebate.</p>
                                <InputNumber
                                    v-model="settingsForm.dps_investment_cap"
                                    prefix="৳ "
                                    :min="0"
                                    :minFractionDigits="0"
                                    :maxFractionDigits="2"
                                    class="w-full"
                                    size="small"
                                />
                            </div>

                            <div class="col-span-2 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                                <label class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Maximum Rebate Cap</label>
                                <p class="mb-3 mt-1 text-xs text-gray-500">Maximum rebate that can be applied during tax calculation.</p>
                                <InputNumber
                                    v-model="settingsForm.max_rebate_cap"
                                    prefix="৳ "
                                    :min="0"
                                    :minFractionDigits="0"
                                    :maxFractionDigits="2"
                                    class="w-full"
                                    size="small"
                                />
                            </div>
                        </div>

                        <div class="flex justify-end border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                            <Button
                                label="Save Settings"
                                icon="pi pi-check"
                                size="small"
                                :loading="settingsForm.processing"
                                @click="saveSettings"
                            />
                        </div>
                    </section>

                    <!-- Savings Certificate Tax Brackets -->
                    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div class="flex items-center gap-3">
                                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <i class="pi pi-percentage text-sm"></i>
                                </div>
                                <div>
                                    <div class="text-sm font-semibold text-gray-900">Savings Certificate Tax Brackets</div>
                                    <div class="mt-0.5 text-xs text-gray-500">Tax rates based on cumulative savings certificate investment.</div>
                                </div>
                            </div>

                            <Button
                                label="Add Bracket"
                                icon="pi pi-plus"
                                outlined
                                size="small"
                                @click="addSavingsCertificateBracket"
                            />
                        </div>

                        <div class="p-5">
                            <div class="grid grid-cols-12 border-b border-gray-100 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                <div class="col-span-6">Minimum Investment</div>
                                <div class="col-span-4">Tax Rate</div>
                                <div class="col-span-2 text-right">Action</div>
                            </div>

                            <div
                                v-for="(bracket, index) in savingsCertificateForm.brackets"
                                :key="bracket.id ?? index"
                                class="grid grid-cols-12 items-center gap-3 border-b border-gray-100 py-3 last:border-b-0"
                            >
                                <div class="col-span-6">
                                    <InputNumber
                                        v-model="bracket.minimum_investment"
                                        prefix="৳ "
                                        :min="0"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="2"
                                        class="w-full"
                                        size="small"
                                    />
                                </div>

                                <div class="col-span-4">
                                    <InputNumber
                                        v-model="bracket.tax_percent"
                                        suffix="%"
                                        :min="0"
                                        :max="100"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="2"
                                        class="w-full"
                                        size="small"
                                    />
                                </div>

                                <div class="col-span-2 flex justify-end">
                                    <Button
                                        icon="pi pi-trash"
                                        severity="danger"
                                        text
                                        rounded
                                        size="small"
                                        aria-label="Remove bracket"
                                        @click="removeSavingsCertificateBracket(index)"
                                    />
                                </div>
                            </div>

                            <div v-if="!savingsCertificateForm.brackets.length" class="flex flex-col items-center justify-center py-10 text-gray-400">
                                <i class="pi pi-percentage text-2xl"></i>
                                <span class="mt-2 text-sm">No tax brackets configured.</span>
                                <span class="mt-1 text-xs">Add a bracket to configure savings certificate tax.</span>
                            </div>
                        </div>

                        <div class="flex justify-end border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                            <Button
                                label="Save Tax Brackets"
                                icon="pi pi-check"
                                size="small"
                                :loading="savingsCertificateForm.processing"
                                @click="saveSavingsCertificateTaxBrackets"
                            />
                        </div>
                    </section>

                    <!-- Income Tax Slabs -->
                    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div class="flex items-center gap-3">
                                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <i class="pi pi-chart-line text-sm"></i>
                                </div>
                                <div>
                                    <div class="text-sm font-semibold text-gray-900">Income Tax Rates</div>
                                    <div class="mt-0.5 text-xs text-gray-500">Set the tax rate for each portion of your taxable income.</div>
                                </div>
                            </div>

                            <Button
                                label="Add Slab"
                                icon="pi pi-plus"
                                outlined
                                size="small"
                                @click="addIncomeTaxSlab"
                            />
                        </div>

                        <div class="p-5">
                            <div class="grid grid-cols-12 border-b border-gray-100 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                <div class="col-span-6">Income Portion</div>
                                <div class="col-span-4">Rate</div>
                                <div class="col-span-2 text-right">Action</div>
                            </div>

                            <div
                                v-for="(slab, index) in incomeTaxForm.slabs"
                                :key="slab.id ?? index"
                                class="grid grid-cols-12 items-center gap-3 border-b border-gray-100 py-3 last:border-b-0"
                            >
                                <div class="col-span-6">
                                    <div class="flex items-center gap-3">
                                        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                                            <span class="pi pi-wallet text-xs"></span>
                                        </div>

                                        <div class="min-w-0 flex-1">
                                            <div class="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                                {{ getSlabLabel(index) }}
                                            </div>

                                            <InputNumber
                                                v-if="slab.income_to !== null"
                                                :modelValue="getSlabAmount(slab)"
                                                @update:modelValue="value => slab.income_to = slab.income_from + (value ?? 0)"
                                                prefix="৳ "
                                                :min="0"
                                                :minFractionDigits="0"
                                                :maxFractionDigits="2"
                                                class="w-full"
                                                size="small"
                                            />

                                            <div v-else class="flex h-8 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600">
                                                <span>Above ৳ {{ slab.income_from.toLocaleString() }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-span-4">
                                    <div class="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                        Tax Rate
                                    </div>
                                    <InputNumber
                                        v-model="slab.tax_percent"
                                        suffix="%"
                                        :min="0"
                                        :max="100"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="2"
                                        class="w-full"
                                        size="small"
                                    />
                                </div>

                                <div class="col-span-2 flex justify-end">
                                    <Button
                                        icon="pi pi-trash"
                                        severity="danger"
                                        text
                                        rounded
                                        size="small"
                                        aria-label="Remove slab"
                                        @click="removeIncomeTaxSlab(index)"
                                    />
                                </div>
                            </div>

                            <div v-if="!incomeTaxForm.slabs.length" class="flex flex-col items-center justify-center py-10 text-gray-400">
                                <i class="pi pi-chart-line text-2xl"></i>
                                <span class="mt-2 text-sm">No income tax rates configured.</span>
                                <span class="mt-1 text-xs">Add a slab to configure progressive income tax.</span>
                            </div>
                        </div>

                        <div class="flex justify-end border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                            <Button
                                label="Save Tax Rates"
                                icon="pi pi-check"
                                size="small"
                                :loading="incomeTaxForm.processing"
                                @click="saveIncomeTaxSlabs"
                            />
                        </div>
                    </section>
                </div>
            </ScrollPanel>

            <!-- Restore Defaults Dialog -->
            <Dialog
                v-model:visible="restoreDefaultsDialog"
                modal
                header="Restore Default Settings"
                :style="{ width: '32rem' }"
                :closable="!restoringDefaults"
                :dismissableMask="!restoringDefaults"
            >
                <div class="space-y-4">
                    <div class="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <i class="pi pi-exclamation-triangle mt-0.5 text-amber-600"></i>

                        <div class="text-sm text-amber-900">
                            <div class="font-semibold">Your customized settings will be replaced.</div>
                            <div class="mt-1 leading-5 text-amber-800">
                                This action will restore the default tax configuration for your account.
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="text-sm font-semibold text-gray-800">
                            The following settings will be restored:
                        </div>

                        <ul class="mt-3 space-y-2 text-sm text-gray-600">
                            <li class="flex items-start gap-2">
                                <i class="pi pi-check mt-0.5 text-xs text-gray-400"></i>
                                General tax and rebate settings
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="pi pi-check mt-0.5 text-xs text-gray-400"></i>
                                Income tax rates and slabs
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="pi pi-check mt-0.5 text-xs text-gray-400"></i>
                                Savings certificate tax brackets
                            </li>
                        </ul>
                    </div>

                    <div class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                        <div class="flex gap-2 text-xs leading-5 text-gray-500">
                            <i class="pi pi-info-circle mt-0.5 text-gray-400"></i>
                            <span>
                                Your income, investment, transaction and other financial records
                                will not be deleted or modified.
                            </span>
                        </div>
                    </div>

                    <div class="text-sm font-medium text-gray-700">
                        Are you sure you want to restore the default settings?
                    </div>
                </div>

                <template #footer>
                    <Button
                        label="Cancel"
                        severity="secondary"
                        variant="text"
                        :disabled="restoringDefaults"
                        @click="restoreDefaultsDialog = false"
                    />

                    <Button
                        label="Restore Defaults"
                        icon="pi pi-refresh"
                        severity="danger"
                        :loading="restoringDefaults"
                        @click="restoreDefaults"
                    />
                </template>
            </Dialog>
        </template>
    </AppLayout>
</template>