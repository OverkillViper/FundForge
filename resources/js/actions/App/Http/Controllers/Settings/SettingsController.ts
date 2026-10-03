import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\SettingsController::edit
 * @see app/Http/Controllers/Settings/SettingsController.php:17
 * @route '/settings/tax'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/tax',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::edit
 * @see app/Http/Controllers/Settings/SettingsController.php:17
 * @route '/settings/tax'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::edit
 * @see app/Http/Controllers/Settings/SettingsController.php:17
 * @route '/settings/tax'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\SettingsController::edit
 * @see app/Http/Controllers/Settings/SettingsController.php:17
 * @route '/settings/tax'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\SettingsController::edit
 * @see app/Http/Controllers/Settings/SettingsController.php:17
 * @route '/settings/tax'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\SettingsController::edit
 * @see app/Http/Controllers/Settings/SettingsController.php:17
 * @route '/settings/tax'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\SettingsController::edit
 * @see app/Http/Controllers/Settings/SettingsController.php:17
 * @route '/settings/tax'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:39
 * @route '/settings/tax'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/tax',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:39
 * @route '/settings/tax'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:39
 * @route '/settings/tax'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:39
 * @route '/settings/tax'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:39
 * @route '/settings/tax'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Settings\SettingsController::updateSavingsCertificateTaxBrackets
 * @see app/Http/Controllers/Settings/SettingsController.php:57
 * @route '/settings/tax/savings-certificates'
 */
export const updateSavingsCertificateTaxBrackets = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSavingsCertificateTaxBrackets.url(options),
    method: 'put',
})

updateSavingsCertificateTaxBrackets.definition = {
    methods: ["put"],
    url: '/settings/tax/savings-certificates',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateSavingsCertificateTaxBrackets
 * @see app/Http/Controllers/Settings/SettingsController.php:57
 * @route '/settings/tax/savings-certificates'
 */
updateSavingsCertificateTaxBrackets.url = (options?: RouteQueryOptions) => {
    return updateSavingsCertificateTaxBrackets.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateSavingsCertificateTaxBrackets
 * @see app/Http/Controllers/Settings/SettingsController.php:57
 * @route '/settings/tax/savings-certificates'
 */
updateSavingsCertificateTaxBrackets.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSavingsCertificateTaxBrackets.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Settings\SettingsController::updateSavingsCertificateTaxBrackets
 * @see app/Http/Controllers/Settings/SettingsController.php:57
 * @route '/settings/tax/savings-certificates'
 */
    const updateSavingsCertificateTaxBracketsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSavingsCertificateTaxBrackets.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\SettingsController::updateSavingsCertificateTaxBrackets
 * @see app/Http/Controllers/Settings/SettingsController.php:57
 * @route '/settings/tax/savings-certificates'
 */
        updateSavingsCertificateTaxBracketsForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSavingsCertificateTaxBrackets.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateSavingsCertificateTaxBrackets.form = updateSavingsCertificateTaxBracketsForm
/**
* @see \App\Http\Controllers\Settings\SettingsController::updateIncomeTaxSlabs
 * @see app/Http/Controllers/Settings/SettingsController.php:82
 * @route '/settings/tax/income-slabs'
 */
export const updateIncomeTaxSlabs = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateIncomeTaxSlabs.url(options),
    method: 'put',
})

updateIncomeTaxSlabs.definition = {
    methods: ["put"],
    url: '/settings/tax/income-slabs',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateIncomeTaxSlabs
 * @see app/Http/Controllers/Settings/SettingsController.php:82
 * @route '/settings/tax/income-slabs'
 */
updateIncomeTaxSlabs.url = (options?: RouteQueryOptions) => {
    return updateIncomeTaxSlabs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateIncomeTaxSlabs
 * @see app/Http/Controllers/Settings/SettingsController.php:82
 * @route '/settings/tax/income-slabs'
 */
updateIncomeTaxSlabs.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateIncomeTaxSlabs.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Settings\SettingsController::updateIncomeTaxSlabs
 * @see app/Http/Controllers/Settings/SettingsController.php:82
 * @route '/settings/tax/income-slabs'
 */
    const updateIncomeTaxSlabsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateIncomeTaxSlabs.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\SettingsController::updateIncomeTaxSlabs
 * @see app/Http/Controllers/Settings/SettingsController.php:82
 * @route '/settings/tax/income-slabs'
 */
        updateIncomeTaxSlabsForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateIncomeTaxSlabs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateIncomeTaxSlabs.form = updateIncomeTaxSlabsForm
/**
* @see \App\Http\Controllers\Settings\SettingsController::restoreDefaults
 * @see app/Http/Controllers/Settings/SettingsController.php:109
 * @route '/settings/tax/restore-defaults'
 */
export const restoreDefaults = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: restoreDefaults.url(options),
    method: 'put',
})

restoreDefaults.definition = {
    methods: ["put"],
    url: '/settings/tax/restore-defaults',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::restoreDefaults
 * @see app/Http/Controllers/Settings/SettingsController.php:109
 * @route '/settings/tax/restore-defaults'
 */
restoreDefaults.url = (options?: RouteQueryOptions) => {
    return restoreDefaults.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::restoreDefaults
 * @see app/Http/Controllers/Settings/SettingsController.php:109
 * @route '/settings/tax/restore-defaults'
 */
restoreDefaults.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: restoreDefaults.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Settings\SettingsController::restoreDefaults
 * @see app/Http/Controllers/Settings/SettingsController.php:109
 * @route '/settings/tax/restore-defaults'
 */
    const restoreDefaultsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: restoreDefaults.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\SettingsController::restoreDefaults
 * @see app/Http/Controllers/Settings/SettingsController.php:109
 * @route '/settings/tax/restore-defaults'
 */
        restoreDefaultsForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: restoreDefaults.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    restoreDefaults.form = restoreDefaultsForm
const SettingsController = { edit, update, updateSavingsCertificateTaxBrackets, updateIncomeTaxSlabs, restoreDefaults }

export default SettingsController