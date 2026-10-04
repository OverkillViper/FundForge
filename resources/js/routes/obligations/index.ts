import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ObligationController::index
 * @see app/Http/Controllers/ObligationController.php:16
 * @route '/obligations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/obligations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ObligationController::index
 * @see app/Http/Controllers/ObligationController.php:16
 * @route '/obligations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ObligationController::index
 * @see app/Http/Controllers/ObligationController.php:16
 * @route '/obligations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ObligationController::index
 * @see app/Http/Controllers/ObligationController.php:16
 * @route '/obligations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ObligationController::index
 * @see app/Http/Controllers/ObligationController.php:16
 * @route '/obligations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ObligationController::index
 * @see app/Http/Controllers/ObligationController.php:16
 * @route '/obligations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ObligationController::index
 * @see app/Http/Controllers/ObligationController.php:16
 * @route '/obligations'
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
* @see \App\Http\Controllers\ObligationController::create
 * @see app/Http/Controllers/ObligationController.php:50
 * @route '/obligations/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/obligations/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ObligationController::create
 * @see app/Http/Controllers/ObligationController.php:50
 * @route '/obligations/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ObligationController::create
 * @see app/Http/Controllers/ObligationController.php:50
 * @route '/obligations/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ObligationController::create
 * @see app/Http/Controllers/ObligationController.php:50
 * @route '/obligations/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ObligationController::create
 * @see app/Http/Controllers/ObligationController.php:50
 * @route '/obligations/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ObligationController::create
 * @see app/Http/Controllers/ObligationController.php:50
 * @route '/obligations/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ObligationController::create
 * @see app/Http/Controllers/ObligationController.php:50
 * @route '/obligations/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\ObligationController::settled
 * @see app/Http/Controllers/ObligationController.php:66
 * @route '/obligations/settled'
 */
export const settled = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settled.url(options),
    method: 'get',
})

settled.definition = {
    methods: ["get","head"],
    url: '/obligations/settled',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ObligationController::settled
 * @see app/Http/Controllers/ObligationController.php:66
 * @route '/obligations/settled'
 */
settled.url = (options?: RouteQueryOptions) => {
    return settled.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ObligationController::settled
 * @see app/Http/Controllers/ObligationController.php:66
 * @route '/obligations/settled'
 */
settled.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settled.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ObligationController::settled
 * @see app/Http/Controllers/ObligationController.php:66
 * @route '/obligations/settled'
 */
settled.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: settled.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ObligationController::settled
 * @see app/Http/Controllers/ObligationController.php:66
 * @route '/obligations/settled'
 */
    const settledForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: settled.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ObligationController::settled
 * @see app/Http/Controllers/ObligationController.php:66
 * @route '/obligations/settled'
 */
        settledForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: settled.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ObligationController::settled
 * @see app/Http/Controllers/ObligationController.php:66
 * @route '/obligations/settled'
 */
        settledForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: settled.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    settled.form = settledForm
/**
* @see \App\Http\Controllers\ObligationController::store
 * @see app/Http/Controllers/ObligationController.php:83
 * @route '/obligations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/obligations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ObligationController::store
 * @see app/Http/Controllers/ObligationController.php:83
 * @route '/obligations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ObligationController::store
 * @see app/Http/Controllers/ObligationController.php:83
 * @route '/obligations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ObligationController::store
 * @see app/Http/Controllers/ObligationController.php:83
 * @route '/obligations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ObligationController::store
 * @see app/Http/Controllers/ObligationController.php:83
 * @route '/obligations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ObligationController::edit
 * @see app/Http/Controllers/ObligationController.php:191
 * @route '/obligations/{obligation}/edit'
 */
export const edit = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/obligations/{obligation}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ObligationController::edit
 * @see app/Http/Controllers/ObligationController.php:191
 * @route '/obligations/{obligation}/edit'
 */
edit.url = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { obligation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { obligation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    obligation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        obligation: typeof args.obligation === 'object'
                ? args.obligation.id
                : args.obligation,
                }

    return edit.definition.url
            .replace('{obligation}', parsedArgs.obligation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ObligationController::edit
 * @see app/Http/Controllers/ObligationController.php:191
 * @route '/obligations/{obligation}/edit'
 */
edit.get = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ObligationController::edit
 * @see app/Http/Controllers/ObligationController.php:191
 * @route '/obligations/{obligation}/edit'
 */
edit.head = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ObligationController::edit
 * @see app/Http/Controllers/ObligationController.php:191
 * @route '/obligations/{obligation}/edit'
 */
    const editForm = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ObligationController::edit
 * @see app/Http/Controllers/ObligationController.php:191
 * @route '/obligations/{obligation}/edit'
 */
        editForm.get = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ObligationController::edit
 * @see app/Http/Controllers/ObligationController.php:191
 * @route '/obligations/{obligation}/edit'
 */
        editForm.head = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\ObligationController::update
 * @see app/Http/Controllers/ObligationController.php:233
 * @route '/obligations/{obligation}'
 */
export const update = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/obligations/{obligation}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ObligationController::update
 * @see app/Http/Controllers/ObligationController.php:233
 * @route '/obligations/{obligation}'
 */
update.url = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { obligation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { obligation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    obligation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        obligation: typeof args.obligation === 'object'
                ? args.obligation.id
                : args.obligation,
                }

    return update.definition.url
            .replace('{obligation}', parsedArgs.obligation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ObligationController::update
 * @see app/Http/Controllers/ObligationController.php:233
 * @route '/obligations/{obligation}'
 */
update.put = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ObligationController::update
 * @see app/Http/Controllers/ObligationController.php:233
 * @route '/obligations/{obligation}'
 */
    const updateForm = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ObligationController::update
 * @see app/Http/Controllers/ObligationController.php:233
 * @route '/obligations/{obligation}'
 */
        updateForm.put = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ObligationController::settle
 * @see app/Http/Controllers/ObligationController.php:374
 * @route '/obligations/{obligation}/settle'
 */
export const settle = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: settle.url(args, options),
    method: 'post',
})

settle.definition = {
    methods: ["post"],
    url: '/obligations/{obligation}/settle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ObligationController::settle
 * @see app/Http/Controllers/ObligationController.php:374
 * @route '/obligations/{obligation}/settle'
 */
settle.url = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { obligation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { obligation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    obligation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        obligation: typeof args.obligation === 'object'
                ? args.obligation.id
                : args.obligation,
                }

    return settle.definition.url
            .replace('{obligation}', parsedArgs.obligation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ObligationController::settle
 * @see app/Http/Controllers/ObligationController.php:374
 * @route '/obligations/{obligation}/settle'
 */
settle.post = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: settle.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ObligationController::settle
 * @see app/Http/Controllers/ObligationController.php:374
 * @route '/obligations/{obligation}/settle'
 */
    const settleForm = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: settle.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ObligationController::settle
 * @see app/Http/Controllers/ObligationController.php:374
 * @route '/obligations/{obligation}/settle'
 */
        settleForm.post = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: settle.url(args, options),
            method: 'post',
        })
    
    settle.form = settleForm
/**
* @see \App\Http\Controllers\ObligationController::destroy
 * @see app/Http/Controllers/ObligationController.php:483
 * @route '/obligations/{obligation}'
 */
export const destroy = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/obligations/{obligation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ObligationController::destroy
 * @see app/Http/Controllers/ObligationController.php:483
 * @route '/obligations/{obligation}'
 */
destroy.url = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { obligation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { obligation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    obligation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        obligation: typeof args.obligation === 'object'
                ? args.obligation.id
                : args.obligation,
                }

    return destroy.definition.url
            .replace('{obligation}', parsedArgs.obligation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ObligationController::destroy
 * @see app/Http/Controllers/ObligationController.php:483
 * @route '/obligations/{obligation}'
 */
destroy.delete = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ObligationController::destroy
 * @see app/Http/Controllers/ObligationController.php:483
 * @route '/obligations/{obligation}'
 */
    const destroyForm = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ObligationController::destroy
 * @see app/Http/Controllers/ObligationController.php:483
 * @route '/obligations/{obligation}'
 */
        destroyForm.delete = (args: { obligation: number | { id: number } } | [obligation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const obligations = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
settled: Object.assign(settled, settled),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
settle: Object.assign(settle, settle),
destroy: Object.assign(destroy, destroy),
}

export default obligations