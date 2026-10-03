import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SavingsCertificateController::index
 * @see app/Http/Controllers/SavingsCertificateController.php:21
 * @route '/investments/savings-certificates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/investments/savings-certificates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SavingsCertificateController::index
 * @see app/Http/Controllers/SavingsCertificateController.php:21
 * @route '/investments/savings-certificates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavingsCertificateController::index
 * @see app/Http/Controllers/SavingsCertificateController.php:21
 * @route '/investments/savings-certificates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SavingsCertificateController::index
 * @see app/Http/Controllers/SavingsCertificateController.php:21
 * @route '/investments/savings-certificates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SavingsCertificateController::index
 * @see app/Http/Controllers/SavingsCertificateController.php:21
 * @route '/investments/savings-certificates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SavingsCertificateController::index
 * @see app/Http/Controllers/SavingsCertificateController.php:21
 * @route '/investments/savings-certificates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SavingsCertificateController::index
 * @see app/Http/Controllers/SavingsCertificateController.php:21
 * @route '/investments/savings-certificates'
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
* @see \App\Http\Controllers\SavingsCertificateController::create
 * @see app/Http/Controllers/SavingsCertificateController.php:76
 * @route '/investments/savings-certificates/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/investments/savings-certificates/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SavingsCertificateController::create
 * @see app/Http/Controllers/SavingsCertificateController.php:76
 * @route '/investments/savings-certificates/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavingsCertificateController::create
 * @see app/Http/Controllers/SavingsCertificateController.php:76
 * @route '/investments/savings-certificates/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SavingsCertificateController::create
 * @see app/Http/Controllers/SavingsCertificateController.php:76
 * @route '/investments/savings-certificates/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SavingsCertificateController::create
 * @see app/Http/Controllers/SavingsCertificateController.php:76
 * @route '/investments/savings-certificates/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SavingsCertificateController::create
 * @see app/Http/Controllers/SavingsCertificateController.php:76
 * @route '/investments/savings-certificates/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SavingsCertificateController::create
 * @see app/Http/Controllers/SavingsCertificateController.php:76
 * @route '/investments/savings-certificates/create'
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
* @see \App\Http\Controllers\SavingsCertificateController::show
 * @see app/Http/Controllers/SavingsCertificateController.php:162
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
export const show = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/investments/savings-certificates/{savingsCertificate}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SavingsCertificateController::show
 * @see app/Http/Controllers/SavingsCertificateController.php:162
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
show.url = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { savingsCertificate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { savingsCertificate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    savingsCertificate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        savingsCertificate: typeof args.savingsCertificate === 'object'
                ? args.savingsCertificate.id
                : args.savingsCertificate,
                }

    return show.definition.url
            .replace('{savingsCertificate}', parsedArgs.savingsCertificate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavingsCertificateController::show
 * @see app/Http/Controllers/SavingsCertificateController.php:162
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
show.get = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SavingsCertificateController::show
 * @see app/Http/Controllers/SavingsCertificateController.php:162
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
show.head = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SavingsCertificateController::show
 * @see app/Http/Controllers/SavingsCertificateController.php:162
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
    const showForm = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SavingsCertificateController::show
 * @see app/Http/Controllers/SavingsCertificateController.php:162
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
        showForm.get = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SavingsCertificateController::show
 * @see app/Http/Controllers/SavingsCertificateController.php:162
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
        showForm.head = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SavingsCertificateController::store
 * @see app/Http/Controllers/SavingsCertificateController.php:83
 * @route '/investments/savings-certificates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/investments/savings-certificates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SavingsCertificateController::store
 * @see app/Http/Controllers/SavingsCertificateController.php:83
 * @route '/investments/savings-certificates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavingsCertificateController::store
 * @see app/Http/Controllers/SavingsCertificateController.php:83
 * @route '/investments/savings-certificates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SavingsCertificateController::store
 * @see app/Http/Controllers/SavingsCertificateController.php:83
 * @route '/investments/savings-certificates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SavingsCertificateController::store
 * @see app/Http/Controllers/SavingsCertificateController.php:83
 * @route '/investments/savings-certificates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SavingsCertificateController::edit
 * @see app/Http/Controllers/SavingsCertificateController.php:227
 * @route '/investments/savings-certificates/edit/{savingsCertificate}'
 */
export const edit = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/investments/savings-certificates/edit/{savingsCertificate}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SavingsCertificateController::edit
 * @see app/Http/Controllers/SavingsCertificateController.php:227
 * @route '/investments/savings-certificates/edit/{savingsCertificate}'
 */
edit.url = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { savingsCertificate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { savingsCertificate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    savingsCertificate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        savingsCertificate: typeof args.savingsCertificate === 'object'
                ? args.savingsCertificate.id
                : args.savingsCertificate,
                }

    return edit.definition.url
            .replace('{savingsCertificate}', parsedArgs.savingsCertificate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavingsCertificateController::edit
 * @see app/Http/Controllers/SavingsCertificateController.php:227
 * @route '/investments/savings-certificates/edit/{savingsCertificate}'
 */
edit.get = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SavingsCertificateController::edit
 * @see app/Http/Controllers/SavingsCertificateController.php:227
 * @route '/investments/savings-certificates/edit/{savingsCertificate}'
 */
edit.head = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SavingsCertificateController::edit
 * @see app/Http/Controllers/SavingsCertificateController.php:227
 * @route '/investments/savings-certificates/edit/{savingsCertificate}'
 */
    const editForm = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SavingsCertificateController::edit
 * @see app/Http/Controllers/SavingsCertificateController.php:227
 * @route '/investments/savings-certificates/edit/{savingsCertificate}'
 */
        editForm.get = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SavingsCertificateController::edit
 * @see app/Http/Controllers/SavingsCertificateController.php:227
 * @route '/investments/savings-certificates/edit/{savingsCertificate}'
 */
        editForm.head = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SavingsCertificateController::update
 * @see app/Http/Controllers/SavingsCertificateController.php:249
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
export const update = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/investments/savings-certificates/{savingsCertificate}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SavingsCertificateController::update
 * @see app/Http/Controllers/SavingsCertificateController.php:249
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
update.url = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { savingsCertificate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { savingsCertificate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    savingsCertificate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        savingsCertificate: typeof args.savingsCertificate === 'object'
                ? args.savingsCertificate.id
                : args.savingsCertificate,
                }

    return update.definition.url
            .replace('{savingsCertificate}', parsedArgs.savingsCertificate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavingsCertificateController::update
 * @see app/Http/Controllers/SavingsCertificateController.php:249
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
update.put = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\SavingsCertificateController::update
 * @see app/Http/Controllers/SavingsCertificateController.php:249
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
    const updateForm = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SavingsCertificateController::update
 * @see app/Http/Controllers/SavingsCertificateController.php:249
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
        updateForm.put = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\SavingsCertificateController::destroy
 * @see app/Http/Controllers/SavingsCertificateController.php:348
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
export const destroy = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/investments/savings-certificates/{savingsCertificate}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SavingsCertificateController::destroy
 * @see app/Http/Controllers/SavingsCertificateController.php:348
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
destroy.url = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { savingsCertificate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { savingsCertificate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    savingsCertificate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        savingsCertificate: typeof args.savingsCertificate === 'object'
                ? args.savingsCertificate.id
                : args.savingsCertificate,
                }

    return destroy.definition.url
            .replace('{savingsCertificate}', parsedArgs.savingsCertificate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavingsCertificateController::destroy
 * @see app/Http/Controllers/SavingsCertificateController.php:348
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
destroy.delete = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SavingsCertificateController::destroy
 * @see app/Http/Controllers/SavingsCertificateController.php:348
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
    const destroyForm = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SavingsCertificateController::destroy
 * @see app/Http/Controllers/SavingsCertificateController.php:348
 * @route '/investments/savings-certificates/{savingsCertificate}'
 */
        destroyForm.delete = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const savingsCertificates = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
show: Object.assign(show, show),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default savingsCertificates