import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\BudgetController::index
 * @see app/Http/Controllers/BudgetController.php:20
 * @route '/budgets'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/budgets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BudgetController::index
 * @see app/Http/Controllers/BudgetController.php:20
 * @route '/budgets'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BudgetController::index
 * @see app/Http/Controllers/BudgetController.php:20
 * @route '/budgets'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BudgetController::index
 * @see app/Http/Controllers/BudgetController.php:20
 * @route '/budgets'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BudgetController::index
 * @see app/Http/Controllers/BudgetController.php:20
 * @route '/budgets'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BudgetController::index
 * @see app/Http/Controllers/BudgetController.php:20
 * @route '/budgets'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BudgetController::index
 * @see app/Http/Controllers/BudgetController.php:20
 * @route '/budgets'
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
* @see \App\Http\Controllers\BudgetController::store
 * @see app/Http/Controllers/BudgetController.php:112
 * @route '/budgets'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/budgets',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BudgetController::store
 * @see app/Http/Controllers/BudgetController.php:112
 * @route '/budgets'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BudgetController::store
 * @see app/Http/Controllers/BudgetController.php:112
 * @route '/budgets'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BudgetController::store
 * @see app/Http/Controllers/BudgetController.php:112
 * @route '/budgets'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BudgetController::store
 * @see app/Http/Controllers/BudgetController.php:112
 * @route '/budgets'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\BudgetController::show
 * @see app/Http/Controllers/BudgetController.php:0
 * @route '/budgets/{budget}'
 */
export const show = (args: { budget: string | number } | [budget: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/budgets/{budget}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BudgetController::show
 * @see app/Http/Controllers/BudgetController.php:0
 * @route '/budgets/{budget}'
 */
show.url = (args: { budget: string | number } | [budget: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { budget: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    budget: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        budget: args.budget,
                }

    return show.definition.url
            .replace('{budget}', parsedArgs.budget.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BudgetController::show
 * @see app/Http/Controllers/BudgetController.php:0
 * @route '/budgets/{budget}'
 */
show.get = (args: { budget: string | number } | [budget: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BudgetController::show
 * @see app/Http/Controllers/BudgetController.php:0
 * @route '/budgets/{budget}'
 */
show.head = (args: { budget: string | number } | [budget: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BudgetController::show
 * @see app/Http/Controllers/BudgetController.php:0
 * @route '/budgets/{budget}'
 */
    const showForm = (args: { budget: string | number } | [budget: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BudgetController::show
 * @see app/Http/Controllers/BudgetController.php:0
 * @route '/budgets/{budget}'
 */
        showForm.get = (args: { budget: string | number } | [budget: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BudgetController::show
 * @see app/Http/Controllers/BudgetController.php:0
 * @route '/budgets/{budget}'
 */
        showForm.head = (args: { budget: string | number } | [budget: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\BudgetController::edit
 * @see app/Http/Controllers/BudgetController.php:178
 * @route '/budgets/{budget}/edit'
 */
export const edit = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/budgets/{budget}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BudgetController::edit
 * @see app/Http/Controllers/BudgetController.php:178
 * @route '/budgets/{budget}/edit'
 */
edit.url = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { budget: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { budget: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    budget: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        budget: typeof args.budget === 'object'
                ? args.budget.id
                : args.budget,
                }

    return edit.definition.url
            .replace('{budget}', parsedArgs.budget.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BudgetController::edit
 * @see app/Http/Controllers/BudgetController.php:178
 * @route '/budgets/{budget}/edit'
 */
edit.get = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BudgetController::edit
 * @see app/Http/Controllers/BudgetController.php:178
 * @route '/budgets/{budget}/edit'
 */
edit.head = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BudgetController::edit
 * @see app/Http/Controllers/BudgetController.php:178
 * @route '/budgets/{budget}/edit'
 */
    const editForm = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BudgetController::edit
 * @see app/Http/Controllers/BudgetController.php:178
 * @route '/budgets/{budget}/edit'
 */
        editForm.get = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BudgetController::edit
 * @see app/Http/Controllers/BudgetController.php:178
 * @route '/budgets/{budget}/edit'
 */
        editForm.head = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\BudgetController::update
 * @see app/Http/Controllers/BudgetController.php:193
 * @route '/budgets/{budget}'
 */
export const update = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/budgets/{budget}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\BudgetController::update
 * @see app/Http/Controllers/BudgetController.php:193
 * @route '/budgets/{budget}'
 */
update.url = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { budget: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { budget: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    budget: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        budget: typeof args.budget === 'object'
                ? args.budget.id
                : args.budget,
                }

    return update.definition.url
            .replace('{budget}', parsedArgs.budget.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BudgetController::update
 * @see app/Http/Controllers/BudgetController.php:193
 * @route '/budgets/{budget}'
 */
update.put = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\BudgetController::update
 * @see app/Http/Controllers/BudgetController.php:193
 * @route '/budgets/{budget}'
 */
update.patch = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\BudgetController::update
 * @see app/Http/Controllers/BudgetController.php:193
 * @route '/budgets/{budget}'
 */
    const updateForm = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BudgetController::update
 * @see app/Http/Controllers/BudgetController.php:193
 * @route '/budgets/{budget}'
 */
        updateForm.put = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\BudgetController::update
 * @see app/Http/Controllers/BudgetController.php:193
 * @route '/budgets/{budget}'
 */
        updateForm.patch = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\BudgetController::destroy
 * @see app/Http/Controllers/BudgetController.php:216
 * @route '/budgets/{budget}'
 */
export const destroy = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/budgets/{budget}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BudgetController::destroy
 * @see app/Http/Controllers/BudgetController.php:216
 * @route '/budgets/{budget}'
 */
destroy.url = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { budget: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { budget: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    budget: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        budget: typeof args.budget === 'object'
                ? args.budget.id
                : args.budget,
                }

    return destroy.definition.url
            .replace('{budget}', parsedArgs.budget.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BudgetController::destroy
 * @see app/Http/Controllers/BudgetController.php:216
 * @route '/budgets/{budget}'
 */
destroy.delete = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\BudgetController::destroy
 * @see app/Http/Controllers/BudgetController.php:216
 * @route '/budgets/{budget}'
 */
    const destroyForm = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BudgetController::destroy
 * @see app/Http/Controllers/BudgetController.php:216
 * @route '/budgets/{budget}'
 */
        destroyForm.delete = (args: { budget: number | { id: number } } | [budget: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\BudgetController::create
 * @see app/Http/Controllers/BudgetController.php:101
 * @route '/budgets/create/{serial}'
 */
export const create = (args: { serial: string | number } | [serial: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/budgets/create/{serial}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BudgetController::create
 * @see app/Http/Controllers/BudgetController.php:101
 * @route '/budgets/create/{serial}'
 */
create.url = (args: { serial: string | number } | [serial: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { serial: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    serial: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        serial: args.serial,
                }

    return create.definition.url
            .replace('{serial}', parsedArgs.serial.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BudgetController::create
 * @see app/Http/Controllers/BudgetController.php:101
 * @route '/budgets/create/{serial}'
 */
create.get = (args: { serial: string | number } | [serial: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BudgetController::create
 * @see app/Http/Controllers/BudgetController.php:101
 * @route '/budgets/create/{serial}'
 */
create.head = (args: { serial: string | number } | [serial: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BudgetController::create
 * @see app/Http/Controllers/BudgetController.php:101
 * @route '/budgets/create/{serial}'
 */
    const createForm = (args: { serial: string | number } | [serial: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BudgetController::create
 * @see app/Http/Controllers/BudgetController.php:101
 * @route '/budgets/create/{serial}'
 */
        createForm.get = (args: { serial: string | number } | [serial: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BudgetController::create
 * @see app/Http/Controllers/BudgetController.php:101
 * @route '/budgets/create/{serial}'
 */
        createForm.head = (args: { serial: string | number } | [serial: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
const budgets = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
create: Object.assign(create, create),
}

export default budgets