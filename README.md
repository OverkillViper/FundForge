# FundForge

**Laravel and VueJS based finance management web application.**

<img src="/resources/images/landing.png" width="79.5%" />
<img src="/resources/images/landing_mobile.png" width="18%" />

FundForge is a personal finance management web application built with **Laravel 13, PostgreSQL, Vue 3, Inertia.js, Tailwind CSS v4, and PrimeVue.** Its goal is to bring everyday money management, investments, budgeting, and income-tax calculations (based on Bangladesh income-tax laws) into one place.

### Deployed at: [fundforge.de.deplexo.com](https://fundforge.de.deplexo.com)

## Features
| Features      | Description |
|---------------|-------------|
| Dashboard	    | Balances, summaries, recent transactions, expense chart |
| Accounts	    | Multiple accounts, balances, active/deactive accounts |
| Transactions  | Income, expenses, investments, lending, borrowing. Categorize transactions. |
| Transfers     | Transfer fund between accounts |
| Investments   | Manage avings certificates, DPS, provident fund |
| Income tax    | Progressive slabs, taxable income, gross tax, TDS |
| Budgets       | Daily, monthly, quarterly tracking |
| Obligations   | Money lent, borrowed, and settlement tracking |
| Settings	    | Financial preferences and tax configuration |

## Detailed Features
- **Dashboard**
    - Total balance overview across accounts.
    - Transaction summary with income and expense comparisons.
    - Recent Transactions widget showing the latest transactions.
    - Expense Trends chart with daily and monthly views.
    - Expense category breakdown with spending totals and averages.
    - Budget overview showing budget progress.
    - Obligations overview for unsettled money lent or borrowed.
- **Account Management**
    - Manage multiple financial accounts.
    - Support for bank, cash, bKash, and other account types.
    - Track opening balance and current balance.
    - Store account number.
    - Activate or deactivate accounts.
- **Transaction Management**
    - Record day-to-day income and expenses.
    - Record investment-related transactions.
    - Track lending and borrowing transactions.
    - Assign categories to transactions where applicable.
    - Store transaction title, amount, date, account, notes, and reference.
- **Investments**

    **Savings Certificates**
    - Record certificate issue date, principal value, duration, and interest-payment interval.
    - Configure interest rates by certificate type, investment tier, and year.
    - View interest payments over the certificate's lifetime.
    
    **DPS — Deposit Pension Scheme**
    - Track DPS investments and payments.
    - Record payment amounts and dates.
    - Calculate total paid amounts and payment counts.
    - Apply the configured DPS investment cap for tax-rebate calculations.
    
    **Provident Fund**
    - Track employee provident-fund contributions by amount and date.
    - Configure the employee contribution percentage.
    - Project employer contributions based on employee contributions.
    - Configure employer-contribution vesting or eligibility boundaries.
    - Account for early encashment, where the employer portion is excluded under the specified rules.

- **Bangladesh Income-Tax Calculator**

    One of FundForge's major features is calculating personal income tax using configurable tax slabs.
    - Income-year selection based on the July–June tax-year cycle.
    - Progressive tax slabs stored in the database.
    - Calculate taxable income before calculating gross tax liability.
    - Include salary income, bank income, and savings-certificate interest.
    - Apply the salary exemption rule.
    - Calculate gross tax liability using the configured progressive slabs.
    - Show a breakdown of tax calculated across the applicable slabs.
    - Track salary tax deducted at source (TDS) by month.
    - Save income-tax records against the relevant income year.
    
    **Investment tax rebates**
    - Calculate rebate using the intended Bangladesh tax rule.
    - Include eligible savings certificates, DPS, and provident-fund investments.
    - Applies the DPS investment cap.
    - Determine savings-certificate rebate eligibility based on issue-date
    - Break down eligible investment amounts by investment type.
    
    **Tax and financial settings**
    - Configure the salary effective month.
    - Configure provident-fund contribution percentage.
    - Configure rebate percentage.
    - Set the DPS investment cap.
    - Set the maximum rebate cap.
    - Manage progressive income-tax slab thresholds and rates.

- **Budget Management**
    - Create daily budgets.
    - Create monthly budgets.
    - Create quarterly budgets.
    - Track expenses against budget limits.

- **Obligations — Money Lent and Borrowed**
    - Track money lent to other people.
    - Track money borrowed from other people.
    - Record the person, amount, and date.
    - Track unsettled obligations.
    - Mark obligations as settled.
    - Represent lending and borrowing activity through associated bookkeeping transactions.