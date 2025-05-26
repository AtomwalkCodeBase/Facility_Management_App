import AsyncStorage from '@react-native-async-storage/async-storage';

const getDbName = async (path) => {
  let dbData = await AsyncStorage.getItem('dbName');
  return dbData
};
// const localhost = "https://www.atomwalk.com"
const localhost = "https://crm.atomwalk.com"

const apiURL = "/api";
const newApiURL = "/hr_api"
const db_name = getDbName();
// console.log('Dbbvjkdvnc',db_name)
export const endpoint = `${localhost}${apiURL}`;
export const newEndpoint = `${localhost}${newApiURL}`;



export const companyInfoURL = async () => {
  const db_name = await getDbName();
  return `${endpoint}/company_info/${db_name}/`;
};

export const profileDtlURL = async () => {
  const db_name = await getDbName();
  return `${endpoint}/get_employee_list/${db_name}/`;
}

export const getActivities = async () => {
  const db_name = await getDbName();
  return `${endpoint}/get_user_activity/${db_name}/`;
}

export const updateTaskURL = async () => {
    const db_name = await getDbName();
    return `${endpoint}/update_task/${db_name}/`;
}

export const userTaskListURL =  async () => {
    const db_name = await getDbName();
    return `${endpoint}/user_task/${db_name}/`;
}

export const empLoginURL = async () => {
  const db_name = await getDbName();
  return `${endpoint}/emp_user_login/${db_name}/`;
}; 

export const getDbList = `${endpoint}/get_applicable_site/`;

export const setUserPinURL =  async () => {
  const db_name = await getDbName();
  return `${endpoint}/set_user_pin/${db_name}/`;
} 

export const forgetEmpPinURL =  async () => {
  const db_name = await getDbName();
  return `${newEndpoint}/emp_forget_pin/${db_name}/`;
}