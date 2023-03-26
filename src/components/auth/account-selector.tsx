import type { Component } from "solid-js";

const AccountItem: Component<{
  username: string,
  discriminator: string
}> = (props) => (
  <div class="py-3 px-4">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <img src="https://cdn.discordapp.com/avatars/466655433415720992/547ce88c3f56021f32a812b7b9970f75.webp?size=56"
          class="h-10 w-10 rounded-full"
        />

        <div class="flex items-center">
          <p class="text-[#f2f3f5] text-[16px] leading-[20px] ">
            {props.username}
          </p>
          <p class="text-[#b5bac1] text-[14px] leading-[18px]">
            #{props.discriminator}
          </p>
        </div>

      </div>

      <button type="button"
        class="px-4 py-0.5 text-white text-[14px] h-[38px] leading-[16px] min-h-[38px] min-w-[96px] bg-[#4e5058] rounded-[3px]"
      >
        Log in
      </button>
    </div>

  </div>
);

const AuthAccountSelector: Component<{
  onAddAccountClick: () => void
}> = (props) => {
  return (
    <div class="bg-[#313338] flex flex-col items-center w-full max-w-[480px] rounded-md shadow-lg">
      <div class="flex flex-col items-center px-4 py-6 gap-2">
        <h1 class="text-[24px] font-semibold text-[#F2F3F5] leading-[30px]">
          Choose an account
        </h1>
        <p class="text-[16px] font-normal text-[#B5BAC1] leading-[20px]">
          Select an account to log in with or add a new one.
        </p>
      </div>

      <div class="flex flex-col items-center w-full px-4">
        <div class="flex flex-col w-full divide-y-2 divide-[#313338] rounded bg-[#2b2d31]" />
      </div>

      <button type="button" class="py-0.5 px-4 group my-4 h-[38px]"
        onClick={() => props.onAddAccountClick()}
      >
        <p class="text-center text-[#dbdee1] text-[14px] leading-[16px] border-b border-b-transparent group-hover:border-b-[#dbdee1]">
          Add an account
        </p>
      </button>
    </div>
  );
};

export default AuthAccountSelector;
