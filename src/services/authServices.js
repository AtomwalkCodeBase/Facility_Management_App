import { authAxios, authAxiosGET } from "./HttpMethod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { profileInfoURL, companyInfoURL, profileDtlURL, getDbList } from "./ConstantServies";

// Corrected: moved AsyncStorage call inside the function
export async function getProfileInfo() {
    const url = await profileDtlURL(); 
    try {
        const emp_id = await AsyncStorage.getItem('empId');
        console.log("Auth Employee ID:", emp_id);

        let data = {};
        if (emp_id) {
            data['emp_id'] = emp_id;
        }

        return authAxios(url, data);
    } catch (error) {
        console.error("Error fetching profile info:", error);
        throw error;
    }
}

export async function getCompanyInfo() {
    const url = await companyInfoURL(); // Await the async function
    return authAxios(url);
  }

export function getDBListInfo() {
   let data = {
             'mobile_app_type': 'CRM_C'
    };
    return authAxiosGET(getDbList, data)
}