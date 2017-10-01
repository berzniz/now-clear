# now-clear

A utility to delete all zeit now instances that aren't aliased.

## Install

```
$ npm install -g now-clear
```

## Usage

```bash
$ now-clear
```

Filter by deployment name

```bash
$ now-clear -n my-deployment-name
```

Passing Token and Team ID

```bash
$ now-clear -t my_now_token -tm my_team_id
```

Token and Team ID are read from `~/.now.json` by default
