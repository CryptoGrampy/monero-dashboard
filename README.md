# monero dashboard

## Who

This dashboard is geared toward (in priority order) users who:

1. want to push the boundaries
2. want to have fun
3. are newbs who may not have experience / enjoyment /capability in running apps from the CLI

For the time being this app is *not* geared toward those:
1. with high security/opsec requirements
2. who may not have a lot of system resources
3. who are passionate about performance (this app might run like dogshit for the forseeable future)

## Install

```bash
git clone git@github.com:CryptoGrampy/monero-dashboard.git
cd monero-dashboard
npm i
npm run start
```

## Build

To run a build on your platform / generate an executable:

```bash
npm run electron:build
```



## TODOs
- [ ] Add user config input to monerod w/default 'safe' config (specify file?)
- [ ] Wrap widgets in 'cards'/Wrapper class providing widget styles/standardized widget function calls
- [ ] Remove boilerplate cruft
- [ ] Refactor/Rebuild Data Store
- [ ] Can Monerod Updater work from app using hardcoded paths?
- [ ] Clean up back end code / Electron main.ts... very messy
- [ ] Add Typescript/ESlint/Prettier rules and clean up disabled rules
- [ ] Improve back end Monerod state manager
- [ ] Configure Github releases
- [ ] Tests?

## Where to go from here
- Monerod Custom Configs
- Codebase is extremely messy and needs a lot of refactoring- especially for state-store and electron ipc handlers.  It's currently cobbled together with duct tape.  Also needs linting
- Replace widget select with a horizontal scrollbar with widget icons/add buttons on each one, or ideally drag and drop onto dashboard
- Include monerod/xmrig/p2pool binaries?
- P2Pool mining capability

## Widget ideas

- Monero Node
  - Controller (starts/stops monerod, sets config, monerod location, updates monerod, sets autostart?)
  - On/Off Timer
  - Gaming Mode (lowers peers)
  - Display Stats
  - Create Tor Hidden Service/Display Onion URL as text/QR code 
- Mining
  - Mining controls similar to Feather Wallet
  - P2Pool Share Status: https://p2pool.observer/api
- Social
  - Current CCS list
  - Monero.Observer rss
  - Monero Bounties
  - Chat?
  - XMR.radio player
- Donation
- Data Charts

## Architecture thoughts

- Widgets
  - different types- stateful vs non-stateful widget
  - should have a static representation that includes title/image or icon/tags that can be used for cataloguing purposes and in select menu
  - should implement onAddToDashboard, onRemoveFromDashboard, widget-name, display name, minimum height/width reqs, usesExternalApiCall (display as icon) 
  - should not talk to each other/depend on one another
  - should consider when to pull their own data vs adding a new shared subscribable data service
  - should not push conflicting state changes (i.e. a pushes a config different from the monero node widget)
  - could be categorized via a sidebar router
 
