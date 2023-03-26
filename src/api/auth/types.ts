export interface DiscordCaptchaRequiredResponse {
  captcha_key: ["captcha-required"];
  captcha_service: "hcaptcha";

  /** `sitekey` to use in the `HCaptcha` component. */
  captcha_sitekey: string;
}

export interface DiscordLoginTokenResponse {
  token: string;
  user_settings: {
    locale: string;
    theme: "dark" | "light"
  }
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
  code: 50035,
  message: string,

  errors: {
    login: {
      _errors: [{
        code: "ACCOUNT_LOGIN_VERIFICATION_EMAIL",
        message: string
      }] // Should always be at index "0".
    }
  }
}
