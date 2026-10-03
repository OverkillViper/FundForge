import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProvidentFundController::store
 * @see app/Http/Controllers/ProvidentFundController.php:186
 * @route '/investments/provident-fund/contribution'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/investments/provident-fund/contribution',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::store
 * @see app/Http/Controllers/ProvidentFundController.php:186
 * @route '/investments/provident-fund/contribution'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::store
 * @see app/Http/Controllers/ProvidentFundController.php:186
 * @route '/investments/provident-fund/contribution'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::store
 * @see app/Http/Controllers/ProvidentFundController.php:186
 * @route '/investments/provident-fund/contribution'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProvidentFundController::store
 * @see app/Http/Controllers/ProvidentFundController.php:186
 * @route '/investments/provident-fund/contribution'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:217
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
export const update = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/investments/provident-fund/contribution/{contribution}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:217
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
update.url = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contribution: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { contribution: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    contribution: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        contribution: typeof args.contribution === 'object'
                ? args.contribution.id
                : args.contribution,
                }

    return update.definition.url
            .replace('{contribution}', parsedArgs.contribution.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:217
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
update.put = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:217
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
    const updateForm = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:217
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
        updateForm.put = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ProvidentFundController::destroy
 * @see app/Http/Controllers/ProvidentFundController.php:252
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
export const destroy = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/investments/provident-fund/contribution/{contribution}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::destroy
 * @see app/Http/Controllers/ProvidentFundController.php:252
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
destroy.url = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contribution: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { contribution: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    contribution: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        contribution: typeof args.contribution === 'object'
                ? args.contribution.id
                : args.contribution,
                }

    return destroy.definition.url
            .replace('{contribution}', parsedArgs.contribution.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::destroy
 * @see app/Http/Controllers/ProvidentFundController.php:252
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
destroy.delete = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::destroy
 * @see app/Http/Controllers/ProvidentFundController.php:252
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
    const destroyForm = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProvidentFundController::destroy
 * @see app/Http/Controllers/ProvidentFundController.php:252
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
        destroyForm.delete = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const contribution = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default contribution