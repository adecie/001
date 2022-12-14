#!/usr/bin/env -S tea -E

/*
---
args:
  - deno
  - run
  - --allow-net
  - --allow-read
  - --allow-write={{ tea.prefix }}
  - --import-map={{ srcroot }}/import-map.json
---
*/

import { pkg } from "utils"
import { useCellar } from "hooks"
import repair from "./repair.ts"

const pkgs = Deno.args.map(pkg.parse);  console.verbose({ received: pkgs })
const { resolve } = useCellar()

for (const pkg of pkgs) {
  console.info({ uninstalling: pkg })
  const installation = await resolve(pkg)
  installation.path.rm({ recursive: true })
  await repair(pkg.project)  //FIXME this is overkill, be precise
}
