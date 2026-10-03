import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import savingsCertificates from './savings-certificates'
import incomeSlabs from './income-slabs'
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
const taxSettings = {
    edit: Object.assign(edit, edit),
update: Object.assign(update, update),
savingsCertificates: Object.assign(savingsCertificates, savingsCertificates),
incomeSlabs: Object.assign(incomeSlabs, incomeSlabs),
restoreDefaults: Object.assign(restoreDefaults, restoreDefaults),
}

export default taxSettings