import AuthAccountSelector from "@/components/auth/account-selector";
import type { Component } from "solid-js";

const LoginPage: Component = () => {


  return (
    <div class="min-h-screen flex items-center justify-center bg-[#5865F2]">
      <AuthAccountSelector />
    </div>
  );
};

export default LoginPage;

