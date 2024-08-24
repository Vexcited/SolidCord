import type { Component } from "solid-js";

const WelcomeView: Component = () => {
  return (
    <div class="h-full flex justify-center items-center">
      <div class="flex flex-col gap-3">
        <h1 class="text-4xl font-semibold text-white">Welcome to SolidCord !</h1>
        <p class="text-white/80">Navigate through your private DMs by selecting a DM on the left.</p>
      </div>
    </div>
  )
}

export default WelcomeView;
