#!/usr/bin/env -S tea -E

/*---
args:
  - deno
  - run
  - --allow-net
  - --allow-env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,S3_BUCKET
  - --import-map={{ srcroot }}/import-map.json
---*/

import { S3 } from "s3";
import { stringify as yaml } from "deno/encoding/yaml.ts"
import { stringify as csv } from "deno/encoding/csv.ts"

const s3 = new S3({
  accessKeyID: Deno.env.get("AWS_ACCESS_KEY_ID")!,
  secretKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
  region: "us-east-1",
});

const bucket = s3.getBucket(Deno.env.get("S3_BUCKET")!);

const inventory: Inventory = {}
const flat = []

for await (const pkg of bucket.listAllObjects({ batchSize: 200 })) {
  if (!pkg.key?.endsWith('.tar.gz')) { continue }

  const matches = pkg.key.match(new RegExp("^(.*)/(.*)/(.*)/v([0-9]+\.[0-9]+\.[0-9]+)\.tar\.gz$"))

  if (!matches) { continue }

  const [_, project, platform, arch, version] = matches

  if (!inventory[project]) inventory[project] = {}
  if (!inventory[project][platform]) inventory[project][platform] = {}
  if (!inventory[project][platform]) inventory[project][platform] = {}
  inventory[project][platform][arch] = [...(inventory[project]?.[platform]?.[arch] ?? []), version]
  flat.push({ project, platform, arch, version })
}

/// For ultimate user-friendliness, we store this data 4 ways:
/// YAML, JSON, CSV, flat text

const te = new TextEncoder()

const yml = te.encode(yaml(inventory))

bucket.putObject("versions.yaml", yml)
bucket.putObject("versions.yml", yml)  // Some people like 8.3 filenames

const json = te.encode(JSON.stringify(inventory))

bucket.putObject("versions.json", json)

const csvData = te.encode(await csv(flat, ["project", "platform", "arch", "version"]))

bucket.putObject("versions.csv", csvData)

const txt = te.encode(flat.map(({ project, platform, arch, version }) => `${project}/${platform}/${arch}/${version}`).join("\n"))

bucket.putObject("versions.txt", txt)

//end

type Inventory = {
  [project: string]: {
    [platform: string]: {
      [arch: string]: string[]
    }
  }
}