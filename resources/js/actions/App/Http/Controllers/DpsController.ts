import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DpsController::index
 * @see app/Http/Controllers/DpsController.php:21
 * @route '/investments/dps'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/investments/dps',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DpsController::index
 * @see app/Http/Controllers/DpsController.php:21
 * @route '/investments/dps'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DpsController::index
 * @see app/Http/Controllers/DpsController.php:21
 * @route '/investments/dps'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DpsController::index
 * @see app/Http/Controllers/DpsController.php:21
 * @route '/investments/dps'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DpsController::index
 * @see app/Http/Controllers/DpsController.php:21
 * @route '/investments/dps'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DpsController::index
 * @see app/Http/Controllers/DpsController.php:21
 * @route '/investments/dps'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DpsController::index
 * @see app/Http/Controllers/DpsController.php:21
 * @route '/investments/dps'
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
* @see \App\Http\Controllers\DpsController::create
 * @see app/Http/Controllers/DpsController.php:42
 * @route '/investments/dps/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/investments/dps/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DpsController::create
 * @see app/Http/Controllers/DpsController.php:42
 * @route '/investments/dps/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DpsController::create
 * @see app/Http/Controllers/DpsController.php:42
 * @route '/investments/dps/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DpsController::create
 * @see app/Http/Controllers/DpsController.php:42
 * @route '/investments/dps/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DpsController::create
 * @see app/Http/Controllers/DpsController.php:42
 * @route '/investments/dps/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DpsController::create
 * @see app/Http/Controllers/DpsController.php:42
 * @route '/investments/dps/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DpsController::create
 * @see app/Http/Controllers/DpsController.php:42
 * @route '/investments/dps/create'
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
* @see \App\Http\Controllers\DpsController::store
 * @see app/Http/Controllers/DpsController.php:61
 * @route '/investments/dps/store'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/investments/dps/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DpsController::store
 * @see app/Http/Controllers/DpsController.php:61
 * @route '/investments/dps/store'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DpsController::store
 * @see app/Http/Controllers/DpsController.php:61
 * @route '/investments/dps/store'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DpsController::store
 * @see app/Http/Controllers/DpsController.php:61
 * @route '/investments/dps/store'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DpsController::store
 * @see app/Http/Controllers/DpsController.php:61
 * @route '/investments/dps/store'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\DpsController::show
 * @see app/Http/Controllers/DpsController.php:100
 * @route '/investments/dps/{dps}'
 */
export const show = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/investments/dps/{dps}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DpsController::show
 * @see app/Http/Controllers/DpsController.php:100
 * @route '/investments/dps/{dps}'
 */
show.url = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{dps}', parsedArgs.dps.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DpsController::show
 * @see app/Http/Controllers/DpsController.php:100
 * @route '/investments/dps/{dps}'
 */
show.get = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DpsController::show
 * @see app/Http/Controllers/DpsController.php:100
 * @route '/investments/dps/{dps}'
 */
show.head = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DpsController::show
 * @see app/Http/Controllers/DpsController.php:100
 * @route '/investments/dps/{dps}'
 */
    const showForm = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DpsController::show
 * @see app/Http/Controllers/DpsController.php:100
 * @route '/investments/dps/{dps}'
 */
        showForm.get = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DpsController::show
 * @see app/Http/Controllers/DpsController.php:100
 * @route '/investments/dps/{dps}'
 */
        showForm.head = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\DpsController::edit
 * @see app/Http/Controllers/DpsController.php:47
 * @route '/investments/dps/edit/{dps}'
 */
export const edit = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/investments/dps/edit/{dps}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DpsController::edit
 * @see app/Http/Controllers/DpsController.php:47
 * @route '/investments/dps/edit/{dps}'
 */
edit.url = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{dps}', parsedArgs.dps.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DpsController::edit
 * @see app/Http/Controllers/DpsController.php:47
 * @route '/investments/dps/edit/{dps}'
 */
edit.get = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DpsController::edit
 * @see app/Http/Controllers/DpsController.php:47
 * @route '/investments/dps/edit/{dps}'
 */
edit.head = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DpsController::edit
 * @see app/Http/Controllers/DpsController.php:47
 * @route '/investments/dps/edit/{dps}'
 */
    const editForm = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DpsController::edit
 * @see app/Http/Controllers/DpsController.php:47
 * @route '/investments/dps/edit/{dps}'
 */
        editForm.get = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DpsController::edit
 * @see app/Http/Controllers/DpsController.php:47
 * @route '/investments/dps/edit/{dps}'
 */
        editForm.head = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\DpsController::destroy
 * @see app/Http/Controllers/DpsController.php:183
 * @route '/investments/dps/{dps}'
 */
export const destroy = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/investments/dps/{dps}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DpsController::destroy
 * @see app/Http/Controllers/DpsController.php:183
 * @route '/investments/dps/{dps}'
 */
destroy.url = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{dps}', parsedArgs.dps.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DpsController::destroy
 * @see app/Http/Controllers/DpsController.php:183
 * @route '/investments/dps/{dps}'
 */
destroy.delete = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\DpsController::destroy
 * @see app/Http/Controllers/DpsController.php:183
 * @route '/investments/dps/{dps}'
 */
    const destroyForm = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/DpsController.php:183
 * @route '/investments/dps/{dps}'
 */
        destroyForm.delete = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\DpsController::update
 * @see app/Http/Controllers/DpsController.php:146
 * @route '/investments/dps/update/{dps}'
 */
export const update = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/investments/dps/update/{dps}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DpsController::update
 * @see app/Http/Controllers/DpsController.php:146
 * @route '/investments/dps/update/{dps}'
 */
update.url = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{dps}', parsedArgs.dps.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DpsController::update
 * @see app/Http/Controllers/DpsController.php:146
 * @route '/investments/dps/update/{dps}'
 */
update.put = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\DpsController::update
 * @see app/Http/Controllers/DpsController.php:146
 * @route '/investments/dps/update/{dps}'
 */
    const updateForm = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/DpsController.php:146
 * @route '/investments/dps/update/{dps}'
 */
        updateForm.put = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DpsController::storePayment
 * @see app/Http/Controllers/DpsController.php:261
 * @route '/investments/dps/{dps}/payment'
 */
export const storePayment = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

storePayment.definition = {
    methods: ["post"],
    url: '/investments/dps/{dps}/payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DpsController::storePayment
 * @see app/Http/Controllers/DpsController.php:261
 * @route '/investments/dps/{dps}/payment'
 */
storePayment.url = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return storePayment.definition.url
            .replace('{dps}', parsedArgs.dps.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DpsController::storePayment
 * @see app/Http/Controllers/DpsController.php:261
 * @route '/investments/dps/{dps}/payment'
 */
storePayment.post = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DpsController::storePayment
 * @see app/Http/Controllers/DpsController.php:261
 * @route '/investments/dps/{dps}/payment'
 */
    const storePaymentForm = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DpsController::storePayment
 * @see app/Http/Controllers/DpsController.php:261
 * @route '/investments/dps/{dps}/payment'
 */
        storePaymentForm.post = (args: { dps: number | { id: number } } | [dps: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePayment.url(args, options),
            method: 'post',
        })
    
    storePayment.form = storePaymentForm
/**
* @see \App\Http\Controllers\DpsController::updatePayment
 * @see app/Http/Controllers/DpsController.php:348
 * @route '/investments/dps/payment/{payment}'
 */
export const updatePayment = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePayment.url(args, options),
    method: 'put',
})

updatePayment.definition = {
    methods: ["put"],
    url: '/investments/dps/payment/{payment}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DpsController::updatePayment
 * @see app/Http/Controllers/DpsController.php:348
 * @route '/investments/dps/payment/{payment}'
 */
updatePayment.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updatePayment.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DpsController::updatePayment
 * @see app/Http/Controllers/DpsController.php:348
 * @route '/investments/dps/payment/{payment}'
 */
updatePayment.put = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePayment.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\DpsController::updatePayment
 * @see app/Http/Controllers/DpsController.php:348
 * @route '/investments/dps/payment/{payment}'
 */
    const updatePaymentForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePayment.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DpsController::updatePayment
 * @see app/Http/Controllers/DpsController.php:348
 * @route '/investments/dps/payment/{payment}'
 */
        updatePaymentForm.put = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePayment.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatePayment.form = updatePaymentForm
/**
* @see \App\Http\Controllers\DpsController::destroyPayment
 * @see app/Http/Controllers/DpsController.php:454
 * @route '/investments/dps/payment/{payment}'
 */
export const destroyPayment = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPayment.url(args, options),
    method: 'delete',
})

destroyPayment.definition = {
    methods: ["delete"],
    url: '/investments/dps/payment/{payment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DpsController::destroyPayment
 * @see app/Http/Controllers/DpsController.php:454
 * @route '/investments/dps/payment/{payment}'
 */
destroyPayment.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroyPayment.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DpsController::destroyPayment
 * @see app/Http/Controllers/DpsController.php:454
 * @route '/investments/dps/payment/{payment}'
 */
destroyPayment.delete = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPayment.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\DpsController::destroyPayment
 * @see app/Http/Controllers/DpsController.php:454
 * @route '/investments/dps/payment/{payment}'
 */
    const destroyPaymentForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyPayment.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DpsController::destroyPayment
 * @see app/Http/Controllers/DpsController.php:454
 * @route '/investments/dps/payment/{payment}'
 */
        destroyPaymentForm.delete = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyPayment.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyPayment.form = destroyPaymentForm
const DpsController = { index, create, store, show, edit, destroy, update, storePayment, updatePayment, destroyPayment }

export default DpsController