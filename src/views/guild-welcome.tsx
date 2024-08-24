import type { Component } from "solid-js";

const GuildWelcomeView: Component = () => {
  return (
    <div class="h-full flex justify-center items-center p-6">
      <div class="flex flex-col gap-3 max-w-[480px]">
        <h1 class="text-4xl font-semibold text-white">You're in a guild !</h1>
        <p class="text-white/80">This view is not done, yet, so please select a channel on the left to see DMs instead of this kinda empty view.</p>
      </div>
    </div>
  )
}

export default GuildWelcomeView;
