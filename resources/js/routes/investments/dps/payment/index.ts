import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DpsController::store
 * @see app/Http/Controllers/DpsController.php:261
 * @route '/investments/dps/{dps}/payment'
 */
export const store = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/investments/dps/{dps}/payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DpsController::store
 * @see app/Http/Controllers/DpsController.php:261
 * @route '/investments/dps/{dps}/payment'
 */
store.url = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { dps: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { dps: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    dps: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        dps: typeof args.dps === 'object'
                ? args.dps.id
                : args.dps,
                }

    return store.definition.url
            .replace('{dps}', parsedArgs.dps.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DpsController::store
 * @see app/Http/Controllers/DpsController.php:261
 * @route '/investments/dps/{dps}/payment'
 */
store.post = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DpsController::store
 * @see app/Http/Controllers/DpsController.php:261
 * @route '/investments/dps/{dps}/payment'
 */
    const storeForm = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DpsController::store
 * @see app/Http/Controllers/DpsController.php:261
 * @route '/investments/dps/{dps}/payment'
 */
        storeForm.post = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\DpsController::update
 * @see app/Http/Controllers/DpsController.php:348
 * @route '/investments/dps/payment/{payment}'
 */
export const update = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/investments/dps/payment/{payment}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DpsController::update
 * @see app/Http/Controllers/DpsController.php:348
 * @route '/investments/dps/payment/{payment}'
 */
update.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment: typeof args.payment === 'object'
                ? args.payment.id
                : args.payment,
                }

    return update.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DpsController::update
 * @see app/Http/Controllers/DpsController.php:348
 * @route '/investments/dps/payment/{payment}'
 */
update.put = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\DpsController::update
 * @see app/Http/Controllers/DpsController.php:348
 * @route '/investments/dps/payment/{payment}'
 */
    const updateForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DpsController::update
 * @see app/Http/Controllers/DpsController.php:348
 * @route '/investments/dps/payment/{payment}'
 */
        updateForm.put = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DpsController::destroy
 * @see app/Http/Controllers/DpsController.php:454
 * @route '/investments/dps/payment/{payment}'
 */
export const destroy = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/investments/dps/payment/{payment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DpsController::destroy
 * @see app/Http/Controllers/DpsController.php:454
 * @route '/investments/dps/payment/{payment}'
 */
destroy.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment: typeof args.payment === 'object'
                ? args.payment.id
                : args.payment,
                }

    return destroy.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DpsController::destroy
 * @see app/Http/Controllers/DpsController.php:454
 * @route '/investments/dps/payment/{payment}'
 */
destroy.delete = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\DpsController::destroy
 * @see app/Http/Controllers/DpsController.php:454
 * @route '/investments/dps/payment/{payment}'
 */
    const destroyForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DpsController::destroy
 * @see app/Http/Controllers/DpsController.php:454
 * @route '/investments/dps/payment/{payment}'
 */
        destroyForm.delete = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const payment = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default payment