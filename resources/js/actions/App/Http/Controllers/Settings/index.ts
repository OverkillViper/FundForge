import ProfileController from './ProfileController'
import SecurityController from './SecurityController'
import SettingsController from './SettingsController'
const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
SecurityController: Object.assign(SecurityController, SecurityController),
SettingsController: Object.assign(SettingsController, SettingsController),
}

export default Settings