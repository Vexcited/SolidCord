import { Navigate, Route, Router } from "@solidjs/router";

import AuthView from "@/views/auth";
import AccountLayout from "@/views/account-layout";
import GuildLayout from "@/views/guild-layout";
import ChannelView from "@/views/channel";
import FriendsView from "@/views/friends";

import accounts from "@/stores/accounts";
import { PrivateDMLayout } from "@/views/private-dm-layout";
import WelcomeView from "@/views/welcome";
import GuildWelcomeView from "@/views/guild-welcome";

const Redirection = () => {
  const account = accounts.use();
  return <Navigate href={`/${account.id}/@me`} />;
}

const Routes = () => {
  return (
    <Router>
      <Route path="/" component={AuthView} />
      <Route path="/:id" component={AccountLayout}>
        <Route path="/:me" component={PrivateDMLayout} matchFilters={{ me: /^@me$/ }}>
          <Route path="/" component={WelcomeView} />
          <Route path="/friends" component={FriendsView} />
          <Route path="/:channel_id" component={ChannelView} />
        </Route>

        <Route path="/:guild_id" component={GuildLayout}>
          <Route path="/:channel_id" component={ChannelView} />
          <Route path="/" component={GuildWelcomeView} />
        </Route>

        <Route path="*404" component={Redirection} />
      </Route>
    </Router>
  )
};

export default Routes;
