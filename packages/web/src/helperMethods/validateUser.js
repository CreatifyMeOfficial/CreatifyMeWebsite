import PasswordValidator from "password-validator"
import { parsePhoneNumberWithError } from "libphonenumber-js"

const validateUser = ({firstName , lastName , userName , email , password , confirmPassword , countryKey , phone , birthDate}, t) => {
    if (!(firstName.length >= 3 && firstName.length <= 25)){
        return {msg: t('validateUser.firstNameWarning'), state: false}
    }
    if (!(lastName.length >= 3 && lastName.length <= 25)){
        return {msg: t('validateUser.lastNameWarning'), state: false}
    }
    if (!(userName.length >= 3 && userName.length <= 30)){
        return {msg: t('validateUser.userNameWarning'), state: false}
    }
    
    const passwordSchema = new PasswordValidator()
    passwordSchema.is().min(10).max(50).has().uppercase().has().lowercase().has().digits().has().symbols().has().not().spaces();
    if (!passwordSchema.validate(password)){
        return {msg: `Password must be 10-50 chars, include upper, lower, number, symbol, and no spaces.`, state: false}
    }
    if (!(confirmPassword === password)){
        return {msg: t('validateUser.confirmPasswordWarning'), state: false}
    }
    if(countryKey === "" || !countryKey){
        return {msg: t('validateUser.countryKeyWarning'), state: false}
    }
    
    const fullPhoneNumber = parsePhoneNumberWithError(phone, countryKey.toUpperCase());
    if (!fullPhoneNumber.isValid()){
        return {msg: t('validateUser.phoneNumberWarning'), state: false}
    }
    
    let now = new Date();
    let bd = new Date(birthDate);
    let age = now.getFullYear() - bd.getFullYear();
    if( age < 15){
        return {msg: t('validateUser.birthdayWarning'), state: false}
    }
    return {
        state: true
    }
}

export default validateUser;