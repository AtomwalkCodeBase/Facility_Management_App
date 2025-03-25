import { authAxios } from "./HttpMethod";
import { profileInfoURL, companyInfoURL, } from "./ConstantServies";

export function getProfileInfo() {
    // console.log('getProfileInfo')
    return authAxios(profileInfoURL)
}

export function getCompanyInfo() {
    return authAxios(companyInfoURL)
}

