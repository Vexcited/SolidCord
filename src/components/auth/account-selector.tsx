import type { Component } from "solid-js";

import { Show, For } from "solid-js";
import { A } from "@solidjs/router";

import accounts from "@/stores/accounts";
import { getUserAvatarURL } from "@/utils/api/images";

const AuthAccountSelector: Component<{
  onAddAccountClick: () => void;
}> = (props) => {
  return (
    <div class="max-w-[480px] w-full flex flex-col items-center rounded-md">
      <div class="flex flex-col items-center gap-2 px-4 py-6">
        <h1 class="text-[24px] font-semibold leading-[30px] text-[#F2F3F5]">
          Choose an account
        </h1>
        <p class="text-[16px] font-normal leading-[20px] text-[#B5BAC1]">
          Select an account to log in with or add a new one.
        </p>
      </div>

      <div class="w-full flex flex-col items-center px-4">
        <div class="w-full flex flex-col rounded bg-[#2b2d31] divide-y-2 divide-[#313338]">
          <For each={accounts.values()}>
            {account => (
              <div class="px-4 py-3">
                <div class="flex items-center justify-between">
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
                        class="h-10 w-10 rounded-full bg-[#313338]"
                      />
                    </Show>

                    <div class="flex items-center">
                      <p class="text-[16px] leading-[20px] text-[#f2f3f5]">
                        {account.username}
                      </p>
                      <Show when={account.discriminator !== "0"}>
                        <p class="text-[14px] leading-[18px] text-[#b5bac1]">
                          #{account.discriminator}
                        </p>
                      </Show>
                    </div>
                  </div>

                  <A href={`/${account.id}`}
                    class="h-[38px] min-h-[38px] min-w-[96px] flex items-center justify-center rounded-[3px] bg-[#4e5058] px-4 py-0.5 text-[14px] leading-[16px] text-white"
                  >
                    Log in
                  </A>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      <button type="button" class="group my-8 h-[38px] px-4 py-0.5"
        onClick={() => props.onAddAccountClick()}
      >
        <p class="border-b border-b-transparent text-center text-[14px] leading-[16px] text-[#dbdee1] group-hover:border-b-[#dbdee1]">
          Add an account
        </p>
      </button>
    </div>
  );
};

export default AuthAccountSelector;
