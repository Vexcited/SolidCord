import { getUserAvatarURL } from "@/utils/api/images"
import { Show, type Component } from "solid-js"

const UserAvatar: Component<{
  hash: string | null,
  user_id: string,
  username: string
}> = (props) => {
  return (
    <Show when={props.hash}
      fallback={
        <div class="h-8 w-8 flex items-center justify-center rounded-full bg-black text-white">
          {props.username[0].toUpperCase()}
        </div>
      }
    >
      {hash => (
        <img class="h-8 w-8 rounded-full"
          src={getUserAvatarURL(props.user_id, hash())}
        />
      )}
    </Show>
  )
};

export default UserAvatar;