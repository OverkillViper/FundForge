export interface NavigationItem {
    name: string;
    icon: string;
    href: string;
    children?: NavigationItem[];
}

export interface NavigationSection {
    section: string;
    items: NavigationItem[];
}

export const navigation: NavigationSection[] = [
    {
        section: 'Overview',
        items: [
            { name: 'Overview'   , icon: 'pi-th-large'   , href: '/dashboard' }  ,
            // { name: 'Reports'    , icon: 'pi-file'       , href: '/reports' }    ,
            { name: 'Income Tax' , icon: 'pi-calculator' , href: '/income-taxes' ,
                children: [
                    { name: 'TDS Records', icon: 'pi-history', href: '/income-taxes/salary-tds' },
                ],
            },
        ],
    },
    {
        section: 'Money',
        items: [
            { name: 'Transactions', icon: 'pi-money-bill', href: '/transactions',
                children: [
                    { name: 'Categories', icon: 'pi-list-tree', href: '/transactions/categories' },
                ],
            },
            { name: 'Transfers', icon: 'pi-arrow-right-arrow-left', href: '/transfers' },
        ],
    },
    {
        section: 'Manage',
        items: [
            { name: 'Accounts'    , icon: 'pi-book'             , href: '/accounts' }    ,
            { name: 'Budget'      , icon: 'pi-wallet'           , href: '/budgets' }     ,
            { name: 'Investments' , icon: 'pi-building-columns' , href: '/investments',
                children: [
                    { name: 'Savings Certificate', icon: 'icon-receipt', href: '/investments/savings-certificates' },
                    { name: 'Deposite Pension Schemes', icon: 'icon-piggy-bank', href: '/investments/dps' },
                    { name: 'Provident Fund', icon: 'icon-banknote-arrow-down', href: '/investments/provident-fund' },
                ],
            } ,
            { name: 'Obligations' , icon: 'pi-users'            , href: '/obligations',
                children: [
                    { name: 'Settled Obligations', icon: 'pi-history', href: '/obligations/settled' },
                ],
            } ,
        ],
    },
    {
        section: 'APP',
        items: [
            { name: 'Settings' , icon: 'pi-cog'      , href: '/settings/tax' } ,
            { name: 'Sign Out' , icon: 'pi-sign-out' , href: '/logout' }   ,
        ],
    },
];