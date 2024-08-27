// import { useNavigate } from "@solidjs/router";
import caching, { type CacheStoreReady } from "@/stores/cache";
import UserAvatar from "@/components/atoms/avatar";

const UserWidget = () => {
  // const navigate = useNavigate();
  const [cache] = caching.use<CacheStoreReady>();

  // const switchAccount = () => {
  //   localStorage.removeItem("lastVisitedAccount");
  //   navigate("/");
  // }

  return (
    <div class="flex justify-between items-center h-[58px] w-full p-1.5">
      <div class="flex gap-2 justify-start p-1.5 hover:bg-white/10 rounded-md w-fit transition-colors">
        <UserAvatar
          hash={cache.gateway.user.avatar}
          user_id={cache.gateway.user.id}
          username={cache.gateway.user.username}
        />

        <p class="text-white -mt-1">
          {cache.gateway.user.display_name || cache.gateway.user.username}
        </p>
      </div>
    </div>
  )
}

export default UserWidget;
