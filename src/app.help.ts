import { useFlags } from "hooks"
import { print, undent } from "utils"

export default async function help() {
  const { verbose } = useFlags()

  // tea -mx +deno.land^1.18 foo.ts -- bar
  // tea -mx +deno.land^1.18 deno -- ./script-file foo bar baz
  // tea build
  // tea -mx ./README.md -- build

  //TODO make the stuff in brackets grayed out a bit

  if (!verbose) {
    //        10|       20|       30|       40|       50|       60|       70| |     80|
    await print(undent`
      usage:
        tea [-xdX] [flags] [+package~x.y] [file|URL|target|cmd|interpreter] -- [argβ¦]

      modes:                                            magical?
  05    --exec,-x         execute
        --dump,-d         dump
        -X                magic execute
        ππππ‘π‘ππ           infer operation                  β¨

      flags:
  10    --env,-E          inject virtual environment       β¨
        --sync,-S         sync pantries, etc. first        β¨
        --magic=no,-m     disable magic
        --verbose,-v      eg. tea -vv
        --silent,-s       no chat, no errors
        --cd,-C           change directory first
  15
      more:
        tea -vh
  18    open github.com/teaxyz/cli
      `)
    //HEYU! did you exceed 22 lines? Donβt! Thatβs the limit!
  } else {
    //        10|       20|       30|       40|       50|       60|       70| |     80|
    await print(undent`
      usage:
        tea [-xdX] [flags] [+package~x.y] [file|URL|target|cmd|interpreter] -- [argβ¦]

      modes:                                                    magical?  env-aware
        --exec,-x                   execute (omittable if β¨)      β¨         π
        --dump,-d                   dump                           β¨         π
        -X                          infer pkg requirements                    π

      aliases:
        --help,-h                   --dump=usage
        --version,-v                --dump=version                            π
        --prefix                    --dump=prefix

      flags:
        --env,-E                    inject virtual environment     β¨
        --sync,-S                   sync pantries, etc. first      β¨
        --json,-j                   output json
        --disable-magic,-m          disable magic
        --verbose,-v                short form accumulates, shows version first
        --silent,-s                 no chat, no errors
        --cd,-C,--chdir             change directory first

      environment variables:
        VERBOSE           {-1: silent, 0: default, 1: verbose, 2: debug}
        MAGIC             [0,1]
        DEBUG             [0,1]: alias for \`VERBOSE=2\`
        TEA_DIR           \`--chdir \${directory}\`

      notes:
        - explicit flags override any environment variables
        - the results of magic can be observed if verbosity is > 0

      ideology:
        > A successful tool is one that was used to do something undreamed of
        > by its author
          βπ βππππ€π¦ π π’πππ πππππ
    `)
  }
}
