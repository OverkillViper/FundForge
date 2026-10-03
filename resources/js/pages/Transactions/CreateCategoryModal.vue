<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { store } from '@/routes/transactions/categories';
import IconPicker from '@/pages/Components/IconPicker.vue';

const visible = ref(false);

const form = useForm({
    name: '',
    icon: '',
});

const createCategory = () => {
    form.post(store.url(), {
        onSuccess: () => {
            visible.value = false;
            form.reset();
        },
    });
};
</script>

<template>
    <Button
        label="Create Category"
        size="small"
        icon="pi pi-plus"
        @click="visible = true"
    />

    <Dialog
        v-model:visible="visible"
        modal
        header="Create Category"
        :style="{ width: '24rem' }"
    >
        <div class="flex flex-col gap-4">
            <!-- Category Name Field -->
            <div class="flex flex-col gap-1.5">
                <label for="name" class="text-sm font-medium"
                    >Category Name</label
                >
                <InputText
                    size="small"
                    id="name"
                    v-model="form.name"
                    autoFocus
                    placeholder="Enter category name"
                    :class="{ 'p-invalid': form.errors.name }"
                />
                <small v-if="form.errors.name" class="text-xs text-red-500">{{
                    form.errors.name
                }}</small>
            </div>

            <!-- Icon Picker Field -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium">Category Icon</label>
                <IconPicker v-model="form.icon" :show-label="true" />
                <small v-if="form.errors.icon" class="text-xs text-red-500">{{
                    form.errors.icon
                }}</small>
            </div>
        </div>

        <template #footer>
            <Button
                size="small"
                severity="secondary"
                variant="outlined"
                @click="visible = false"
                >Cancel</Button
            >
            <Button
                size="small"
                @click="createCategory"
                :loading="form.processing"
                >Create</Button
            >
        </template>
    </Dialog>
</template>
