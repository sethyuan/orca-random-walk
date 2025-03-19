import { shuffle } from "rambdax"
import LogoImg from "../icon.png"
import { setupL10N, t } from "./libs/l10n"
import type { Block, DbId } from "./orca"
import zhCN from "./translations/zhCN"

const MAX_SIZE = 500

let pluginName: string
let shuffledResults: DbId[] = []
let currentIndex: number = 0

export async function load(_name: string) {
  pluginName = _name

  setupL10N(orca.state.locale, { "zh-CN": zhCN })

  orca.themes.injectCSSResource(`${pluginName}/dist/main.css`, pluginName)

  const Button = orca.components.Button
  const Tooltip = orca.components.Tooltip

  await orca.plugins.setSettingsSchema(pluginName, {
    queryBlockId: {
      label: t("Query scope"),
      description: t(
        "Specify a query block's ID, it will be used as the data source.",
      ),
      type: "number",
    },
  })

  if (orca.state.commands["randomwalk.next"] == null) {
    orca.commands.registerCommand(
      "randomwalk.next",
      async () => {
        const settings = orca.state.plugins[pluginName].settings
        const queryBlockId = settings?.queryBlockId

        try {
          if (shuffledResults.length === 0 || currentIndex === 0) {
            const queryBlock: Block = await orca.invokeBackend(
              "get-block",
              queryBlockId,
            )
            const queryBlockRepr = queryBlock?.properties.find(
              (p) => p.name === "_repr",
            )?.value

            if (queryBlockRepr?.type !== "query") {
              orca.notify("error", t("Please give a valid query block."))
              return
            }

            queryBlockRepr.q.page = 1
            queryBlockRepr.q.pageSize = MAX_SIZE
            const queryResults: DbId[] = await orca.invokeBackend(
              "query",
              queryBlockRepr.q,
            )

            if (!queryResults?.length) {
              orca.notify("warn", t("No results found for the query."))
              return
            }

            shuffledResults = shuffle(queryResults)
            currentIndex = 0
          }

          currentIndex = (currentIndex + 1) % shuffledResults.length
          const nextBlockId = shuffledResults[currentIndex]
          orca.nav.goTo("block", { blockId: nextBlockId })
        } catch (err) {
          console.error(err)
        }
      },
      t("Go to the next randomly picked note"),
    )
  }

  if (orca.state.headbarButtons["randomwalk.next"] == null) {
    orca.headbar.registerHeadbarButton("randomwalk.next", () => (
      <Tooltip text={t("Random walk")}>
        <Button
          variant="plain"
          onClick={() => orca.commands.invokeCommand("randomwalk.next")}
        >
          <img
            className="randomwalk-button"
            src={LogoImg}
            alt={t("Random walk")}
          />
        </Button>
      </Tooltip>
    ))
  }

  console.log(`${pluginName} loaded.`)
}

export async function unload() {
  // Clean up any resources used by the plugin here.
  orca.headbar.unregisterHeadbarButton("randomwalk.next")
  orca.commands.unregisterCommand("randomwalk.next")
  orca.themes.removeCSSResources(pluginName)

  console.log(`${pluginName} unloaded.`)
}
