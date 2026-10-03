import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AccountController::index
 * @see app/Http/Controllers/AccountController.php:17
 * @route '/accounts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AccountController::index
 * @see app/Http/Controllers/AccountController.php:17
 * @route '/accounts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountController::index
 * @see app/Http/Controllers/AccountController.php:17
 * @route '/accounts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AccountController::index
 * @see app/Http/Controllers/AccountController.php:17
 * @route '/accounts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AccountController::index
 * @see app/Http/Controllers/AccountController.php:17
 * @route '/accounts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AccountController::index
 * @see app/Http/Controllers/AccountController.php:17
 * @route '/accounts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AccountController::index
 * @see app/Http/Controllers/AccountController.php:17
 * @route '/accounts'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\AccountController::store
 * @see app/Http/Controllers/AccountController.php:40
 * @route '/accounts'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/accounts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AccountController::store
 * @see app/Http/Controllers/AccountController.php:40
 * @route '/accounts'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountController::store
 * @see app/Http/Controllers/AccountController.php:40
 * @route '/accounts'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AccountController::store
 * @see app/Http/Controllers/AccountController.php:40
 * @route '/accounts'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AccountController::store
 * @see app/Http/Controllers/AccountController.php:40
 * @route '/accounts'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AccountController::update
 * @see app/Http/Controllers/AccountController.php:113
 * @route '/accounts/{account}'
 */
export const update = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/accounts/{account}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AccountController::update
 * @see app/Http/Controllers/AccountController.php:113
 * @route '/accounts/{account}'
 */
update.url = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { account: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { account: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        account: typeof args.account === 'object'
                ? args.account.id
                : args.account,
                }

    return update.definition.url
            .replace('{account}', parsedArgs.account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountController::update
 * @see app/Http/Controllers/AccountController.php:113
 * @route '/accounts/{account}'
 */
update.put = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AccountController::update
 * @see app/Http/Controllers/AccountController.php:113
 * @route '/accounts/{account}'
 */
    const updateForm = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AccountController::update
 * @see app/Http/Controllers/AccountController.php:113
 * @route '/accounts/{account}'
 */
        updateForm.put = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AccountController::toggleActive
 * @see app/Http/Controllers/AccountController.php:170
 * @route '/accounts/{account}/status'
 */
export const toggleActive = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActive.url(args, options),
    method: 'patch',
})

toggleActive.definition = {
    methods: ["patch"],
    url: '/accounts/{account}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AccountController::toggleActive
 * @see app/Http/Controllers/AccountController.php:170
 * @route '/accounts/{account}/status'
 */
toggleActive.url = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { account: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { account: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        account: typeof args.account === 'object'
                ? args.account.id
                : args.account,
                }

    return toggleActive.definition.url
            .replace('{account}', parsedArgs.account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountController::toggleActive
 * @see app/Http/Controllers/AccountController.php:170
 * @route '/accounts/{account}/status'
 */
toggleActive.patch = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActive.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AccountController::toggleActive
 * @see app/Http/Controllers/AccountController.php:170
 * @route '/accounts/{account}/status'
 */
    const toggleActiveForm = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleActive.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AccountController::toggleActive
 * @see app/Http/Controllers/AccountController.php:170
 * @route '/accounts/{account}/status'
 */
        toggleActiveForm.patch = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleActive.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleActive.form = toggleActiveForm
/**
* @see \App\Http\Controllers\AccountController::destroy
 * @see app/Http/Controllers/AccountController.php:192
 * @route '/accounts/{account}'
 */
export const destroy = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/accounts/{account}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AccountController::destroy
 * @see app/Http/Controllers/AccountController.php:192
 * @route '/accounts/{account}'
 */
destroy.url = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { account: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { account: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        account: typeof args.account === 'object'
                ? args.account.id
                : args.account,
                }

    return destroy.definition.url
            .replace('{account}', parsedArgs.account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountController::destroy
 * @see app/Http/Controllers/AccountController.php:192
 * @route '/accounts/{account}'
 */
destroy.delete = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AccountController::destroy
 * @see app/Http/Controllers/AccountController.php:192
 * @route '/accounts/{account}'
 */
    const destroyForm = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AccountController::destroy
 * @see app/Http/Controllers/AccountController.php:192
 * @route '/accounts/{account}'
 */
        destroyForm.delete = (args: { account: string | number | { id: string | number } } | [account: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AccountController = { index, store, update, toggleActive, destroy }

export default AccountController