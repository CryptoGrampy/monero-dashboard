# monero dashboard

## TODOs
- [ ] Create Front end rxjs data store
- [ ] Create Back end data store for Dashboard state, widget state
- [ ] Create widget-like example for Monero Node and Timer (for other Monero Bounty)
- [ ] Add Drag and Drop library
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
- Social
  - Current CCS list
  - Monero Bounties
  - Chat?
  - XMR.radio player

## Architecture thoughts

- Widgets
  - should implement onAddToDashboard, onRemoveFromDashboard, widget-name, display name, height/width reqs, usesExternalApiCall (display as icon) 
  - should not talk to each other/depend on one another
  - should consider when to pull their own data vs adding a new subscribable data service
  - should not have push conflicting state changes (i.e. a pushes a config different from the monero node widget)
  - could be categorized via a sidebar router
  - timer example- should set start and stop time, and retrieve that time from electron store on start
 
