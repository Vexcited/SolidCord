export interface DiscordCaptchaRequiredResponse {
  captcha_key: ["captcha-required"];
  captcha_service: "hcaptcha";

  /** should be set in the enterprise payload for hcaptcha. */
  captcha_rqdata: string;

  /** should be sent in the login http request. */
  captcha_rqtoken: string;

  /** `sitekey` to use in the `HCaptcha` component. */
  captcha_sitekey: string;
}

export interface DiscordLoginTokenResponse {
  token: string;
  user_settings: {
    locale: string;
    theme: "dark" | "light";
  };
}

export interface DiscordLoginMfaRequiredResponse {
  token: null;
  sms: false;
  mfa: true;

  /** Ticket to use in the MFA request. */
  ticket: string;
}

/** When logging-in from a new location. */
export interface DiscordLoginVerificationEmailResponse {
  code: 50035;
  message: string;

  errors: {
    login: {
      _errors: [{
        code: "ACCOUNT_LOGIN_VERIFICATION_EMAIL";
        message: string;
      }]; // Should always be at index "0".
    };
  };
}

interface InvalidLogin {
  _errors: [{
    code: "INVALID_LOGIN";
    message: string;
  }];
}

export interface DiscordLoginInvalidLoginResponse {
  code: 50035;
  message: string;

  errors: (
    | { login: InvalidLogin; password: InvalidLogin }
    | { password: InvalidLogin }
  );
}
