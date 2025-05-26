import AsyncStorage from "@react-native-async-storage/async-storage";
import { getActivities, userTaskListURL, empLoginURL, updateTaskURL, forgetEmpPinURL, setUserPinURL } from "../services/ConstantServies";
import { authAxios, authAxiosPost, publicAxiosRequest } from "./HttpMethod";

export async function getUserTasks(task_type, customer_id, lead_id) {
  const url = await userTaskListURL();
  let data = {};
  
  // Fetch emp_id asynchronously
  const emp_id = await AsyncStorage.getItem('empId');

  if (task_type) {
    data['task_type'] = task_type;
  }
  if (customer_id) {
    data['customer_id'] = customer_id;
  }
  if (emp_id) {
    data['emp_id'] = emp_id;
  }
  if (lead_id) {
    data['lead_id'] = lead_id;
  }

  console.log('getUserTasks', data)
  return authAxios(url, data);
}

  export async function getActivityList() { 
    const url = await getActivities();
    
    return authAxios(url)
  }

  export async function getManagerActivityList(res) {
    const url = await getActivities(); 
    let data = {
      'call_mode': res.call_mode 
    };
    console.log('callt type==',res.call_mode)
    return authAxios(url,data)
  }

  export async function empLoginPrc(res) {
    const url = await empLoginURL();
    let data = {};
    if (res) {
      data['login_data'] = res;
    }
    console.log('Data to be sent:', data);
    return authAxiosPost(url, data)
  
  }


  export async function updateTask(task_data, is_completed='N', assign_user='N') {
    // console.log('updateTask', task_data, is_completed, assign_user)
    let data = {};
    data['task_data'] = task_data
    data['is_completed'] = is_completed; 
    data['assign_user'] = assign_user; 
    console.log("On call data===",data)
    const url = await updateTaskURL();
    
    return authAxiosPost(url, data);
}

export async function setUserPinView(o_pin, n_pin, employeeId) {
    
    const effectiveEmpoyeeId = employeeId;

    let data = {
      u_id: effectiveEmpoyeeId,
      o_pin: o_pin,
      n_pin: n_pin,
      user_type: "EMP",
    };

    console.log("Data to be sent--->",data)
    const url = await setUserPinURL();
    return authAxiosPost(url, data);
  }

  export async function forgetUserPinView(data) {
    console.log("Data to be sent--->", data);
    const url = await forgetEmpPinURL();
    return publicAxiosRequest.post(url, data);
}