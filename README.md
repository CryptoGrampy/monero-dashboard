# monero dashboard

## TODOs
- [x] Create Front end rxjs data store
- [ ] Add UI component library
- [ ] Simplify status widget
- [ ] Add on/off/syncing/error tracking for monerod that updates monerod status
- [ ] Add user config input to monerod w/default 'safe' config
- [ ] Wrap widgets in 'cards'/Wrapper class providing widget styles/standardized widget function calls
- [ ] 
- [ ] Create widget-like example for Monero Node and Timer (for other Monero Bounty)
- [ ] Create Back end data store for Dashboard state
- [ ] Get Monerod updater working
- [ ] Add Drag and Drop library
- [ ] Clean up back end code / Electron main.ts
- [ ] Add Typescript/ESlint rules
- [ ] Improve back end Monerod state manager
- [ ] Create Widget template and interface to implement

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

## Architecture thoughts

- Widgets
  - should implement onAddToDashboard, onRemoveFromDashboard, widget-name, display name, height/width reqs, usesExternalApiCall (display as icon) 
  - should not talk to each other/depend on one another
  - should consider when to pull their own data vs adding a new subscribable data service
  - should not have push conflicting state changes (i.e. a pushes a config different from the monero node widget)
  - could be categorized via a sidebar router
  - timer example- should set start and stop time, and retrieve that time from electron store on start
 
