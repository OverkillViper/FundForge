import DashboardController from './DashboardController'
import AccountController from './AccountController'
import TransactionController from './TransactionController'
import CategoryController from './CategoryController'
import TransferController from './TransferController'
import BudgetController from './BudgetController'
import InvestmentController from './InvestmentController'
import SavingsCertificateController from './SavingsCertificateController'
import DpsController from './DpsController'
import ProvidentFundController from './ProvidentFundController'
import ObligationController from './ObligationController'
import IncomeTaxController from './IncomeTaxController'
import SalaryTdsController from './SalaryTdsController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
AccountController: Object.assign(AccountController, AccountController),
TransactionController: Object.assign(TransactionController, TransactionController),
CategoryController: Object.assign(CategoryController, CategoryController),
TransferController: Object.assign(TransferController, TransferController),
BudgetController: Object.assign(BudgetController, BudgetController),
InvestmentController: Object.assign(InvestmentController, InvestmentController),
SavingsCertificateController: Object.assign(SavingsCertificateController, SavingsCertificateController),
DpsController: Object.assign(DpsController, DpsController),
ProvidentFundController: Object.assign(ProvidentFundController, ProvidentFundController),
ObligationController: Object.assign(ObligationController, ObligationController),
IncomeTaxController: Object.assign(IncomeTaxController, IncomeTaxController),
SalaryTdsController: Object.assign(SalaryTdsController, SalaryTdsController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers