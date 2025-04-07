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
}
