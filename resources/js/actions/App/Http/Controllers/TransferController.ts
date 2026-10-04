import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TransferController::index
 * @see app/Http/Controllers/TransferController.php:19
 * @route '/transfers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/transfers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransferController::index
 * @see app/Http/Controllers/TransferController.php:19
 * @route '/transfers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransferController::index
 * @see app/Http/Controllers/TransferController.php:19
 * @route '/transfers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransferController::index
 * @see app/Http/Controllers/TransferController.php:19
 * @route '/transfers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransferController::index
 * @see app/Http/Controllers/TransferController.php:19
 * @route '/transfers'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransferController::index
 * @see app/Http/Controllers/TransferController.php:19
 * @route '/transfers'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransferController::index
 * @see app/Http/Controllers/TransferController.php:19
 * @route '/transfers'
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
* @see \App\Http\Controllers\TransferController::create
 * @see app/Http/Controllers/TransferController.php:40
 * @route '/transfers/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/transfers/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransferController::create
 * @see app/Http/Controllers/TransferController.php:40
 * @route '/transfers/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransferController::create
 * @see app/Http/Controllers/TransferController.php:40
 * @route '/transfers/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransferController::create
 * @see app/Http/Controllers/TransferController.php:40
 * @route '/transfers/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransferController::create
 * @see app/Http/Controllers/TransferController.php:40
 * @route '/transfers/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransferController::create
 * @see app/Http/Controllers/TransferController.php:40
 * @route '/transfers/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransferController::create
 * @see app/Http/Controllers/TransferController.php:40
 * @route '/transfers/create'
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
* @see \App\Http\Controllers\TransferController::store
 * @see app/Http/Controllers/TransferController.php:56
 * @route '/transfers'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/transfers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransferController::store
 * @see app/Http/Controllers/TransferController.php:56
 * @route '/transfers'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransferController::store
 * @see app/Http/Controllers/TransferController.php:56
 * @route '/transfers'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransferController::store
 * @see app/Http/Controllers/TransferController.php:56
 * @route '/transfers'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransferController::store
 * @see app/Http/Controllers/TransferController.php:56
 * @route '/transfers'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TransferController::show
 * @see app/Http/Controllers/TransferController.php:177
 * @route '/transfers/{transfer}'
 */
export const show = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/transfers/{transfer}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransferController::show
 * @see app/Http/Controllers/TransferController.php:177
 * @route '/transfers/{transfer}'
 */
show.url = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transfer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transfer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transfer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transfer: typeof args.transfer === 'object'
                ? args.transfer.id
                : args.transfer,
                }

    return show.definition.url
            .replace('{transfer}', parsedArgs.transfer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransferController::show
 * @see app/Http/Controllers/TransferController.php:177
 * @route '/transfers/{transfer}'
 */
show.get = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransferController::show
 * @see app/Http/Controllers/TransferController.php:177
 * @route '/transfers/{transfer}'
 */
show.head = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransferController::show
 * @see app/Http/Controllers/TransferController.php:177
 * @route '/transfers/{transfer}'
 */
    const showForm = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransferController::show
 * @see app/Http/Controllers/TransferController.php:177
 * @route '/transfers/{transfer}'
 */
        showForm.get = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransferController::show
 * @see app/Http/Controllers/TransferController.php:177
 * @route '/transfers/{transfer}'
 */
        showForm.head = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TransferController::edit
 * @see app/Http/Controllers/TransferController.php:194
 * @route '/transfers/{transfer}/edit'
 */
export const edit = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/transfers/{transfer}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransferController::edit
 * @see app/Http/Controllers/TransferController.php:194
 * @route '/transfers/{transfer}/edit'
 */
edit.url = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transfer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transfer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transfer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transfer: typeof args.transfer === 'object'
                ? args.transfer.id
                : args.transfer,
                }

    return edit.definition.url
            .replace('{transfer}', parsedArgs.transfer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransferController::edit
 * @see app/Http/Controllers/TransferController.php:194
 * @route '/transfers/{transfer}/edit'
 */
edit.get = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransferController::edit
 * @see app/Http/Controllers/TransferController.php:194
 * @route '/transfers/{transfer}/edit'
 */
edit.head = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransferController::edit
 * @see app/Http/Controllers/TransferController.php:194
 * @route '/transfers/{transfer}/edit'
 */
    const editForm = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransferController::edit
 * @see app/Http/Controllers/TransferController.php:194
 * @route '/transfers/{transfer}/edit'
 */
        editForm.get = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransferController::edit
 * @see app/Http/Controllers/TransferController.php:194
 * @route '/transfers/{transfer}/edit'
 */
        editForm.head = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TransferController::update
 * @see app/Http/Controllers/TransferController.php:213
 * @route '/transfers/{transfer}'
 */
export const update = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/transfers/{transfer}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TransferController::update
 * @see app/Http/Controllers/TransferController.php:213
 * @route '/transfers/{transfer}'
 */
update.url = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transfer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transfer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transfer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transfer: typeof args.transfer === 'object'
                ? args.transfer.id
                : args.transfer,
                }

    return update.definition.url
            .replace('{transfer}', parsedArgs.transfer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransferController::update
 * @see app/Http/Controllers/TransferController.php:213
 * @route '/transfers/{transfer}'
 */
update.put = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TransferController::update
 * @see app/Http/Controllers/TransferController.php:213
 * @route '/transfers/{transfer}'
 */
update.patch = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TransferController::update
 * @see app/Http/Controllers/TransferController.php:213
 * @route '/transfers/{transfer}'
 */
    const updateForm = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransferController::update
 * @see app/Http/Controllers/TransferController.php:213
 * @route '/transfers/{transfer}'
 */
        updateForm.put = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\TransferController::update
 * @see app/Http/Controllers/TransferController.php:213
 * @route '/transfers/{transfer}'
 */
        updateForm.patch = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\TransferController::destroy
 * @see app/Http/Controllers/TransferController.php:379
 * @route '/transfers/{transfer}'
 */
export const destroy = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/transfers/{transfer}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TransferController::destroy
 * @see app/Http/Controllers/TransferController.php:379
 * @route '/transfers/{transfer}'
 */
destroy.url = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transfer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transfer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transfer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transfer: typeof args.transfer === 'object'
                ? args.transfer.id
                : args.transfer,
                }

    return destroy.definition.url
            .replace('{transfer}', parsedArgs.transfer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransferController::destroy
 * @see app/Http/Controllers/TransferController.php:379
 * @route '/transfers/{transfer}'
 */
destroy.delete = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TransferController::destroy
 * @see app/Http/Controllers/TransferController.php:379
 * @route '/transfers/{transfer}'
 */
    const destroyForm = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransferController::destroy
 * @see app/Http/Controllers/TransferController.php:379
 * @route '/transfers/{transfer}'
 */
        destroyForm.delete = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const TransferController = { index, create, store, show, edit, update, destroy }

export default TransferController