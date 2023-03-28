import type { Component } from "solid-js";

import { Show, For } from "solid-js";
import { A } from "@solidjs/router";

import { accountsStore } from "@/stores/accounts";
import { getUserAvatarURL } from "@/utils/api/images";

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
        <div class="flex flex-col w-full divide-y-2 divide-[#313338] rounded bg-[#2b2d31]">
          <For each={accountsStore()}>
            {account => (
              <div class="py-3 px-4">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <Show when={account.avatar_hash}
                      fallback={
                        <>
                          {/** In case the user doesn't have any avatar. */}
                          <div class="h-10 w-10 rounded-full" />
                        </>
                      }
                    >
                      <img src={getUserAvatarURL(account.id, account.avatar_hash as string)}
                        class="bg-[#313338] h-10 w-10 rounded-full"
                      />
                    </Show>

                    <div class="flex items-center">
                      <p class="text-[#f2f3f5] text-[16px] leading-[20px] ">
                        {account.username}
                      </p>
                      <p class="text-[#b5bac1] text-[14px] leading-[18px]">
                        #{account.discriminator}
                      </p>
                    </div>
                  </div>

                  <A href={`/${account.id}`}
                    class="flex justify-center items-center px-4 py-0.5 text-white text-[14px] h-[38px] leading-[16px] min-h-[38px] min-w-[96px] bg-[#4e5058] rounded-[3px]"
                  >
                    Log in
                  </A>
                </div>
              </div>
            )}
          </For>
        </div>
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
