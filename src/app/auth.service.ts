import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
public PUBLIC_URL='http://localhost:8081/public'
  public BASE_URL = 'http://localhost:8081/api'; 
  public OTP_URL = 'http://localhost:8081/otp';
  public DASHBOARD_URL='http://localhost:8081/dashboard';
  public STU_URL=`${this.DASHBOARD_URL}/student/profile`
  public RESET_PASSWORD_URL = `${this.BASE_URL}/resetpassword`;
  public CAPTCHA_GENERATE_URL = `${this.BASE_URL}/captcha/generate`;
  public CAPTCHA_RELOAD_URL=`${this.BASE_URL}/captcha/captchaReload`;
  public REGISTER_URL=`${this.BASE_URL}/register`;
  public OTP_SEND_URL = `${this.OTP_URL}/send`;
  public OTP_VERIFY_URL=`${this.OTP_URL}/verify`;
  public OTP_LOGIN_VERIFY=`${this.BASE_URL}/otp_verify`
  public LOGIN_URL=`${this.BASE_URL}/authenticate`;
  public ROLES_URL=`${this.PUBLIC_URL}/roles`;
  public PROGRAM_URL=`${this.PUBLIC_URL}/program`;
  public DEPARTMENT_URL=`${this.PUBLIC_URL}/department`;
  public LOGOUT_URL=`${this.BASE_URL}/logout`;
  public FAC_URL=`${this.DASHBOARD_URL}/faculty/profile`;
  public NT_URL=`${this.DASHBOARD_URL}/management/mprofile`;
  public REQUIST_URL=`${this.BASE_URL}/requisition-form/submit`;
  public LIST_URL=`${this.BASE_URL}/requisition-form/list`;
  public FETCH_URL=`${this.BASE_URL}/requisition-form/fetchAll`;
  public DOWNLOAD_REQUISITION_URL=`${this.BASE_URL}/requisition-form/download`;
  public STOCKREGISTER_URL='${this.BASE_URL}/requisition-form/download';
  public STATUS_UPDATE_URL=`${this.BASE_URL}/requisition-form/status_update`;
  public DATA_URL=`${this.BASE_URL}/requisition-form/_next`;
  public FETCH_DEPT=`${this.BASE_URL}/indent-form/_next`;
  public SUBMIT_INDENT_URL=`${this.BASE_URL}/indent-form/submit`;
  public INDENT_LIST_URL=`${this.BASE_URL}/indent-form/list`;
  public INDENT_DOWNLOAD_URL=`${this.BASE_URL}/indent-form/download`;
  public INDENT_FETCH_URL=`${this.BASE_URL}/indent-form/fetchAll`;
  public STATUS_INDENT_URL=`${this.BASE_URL}/indent-form/status_update`;
}
