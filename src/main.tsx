import LogoImg from "../icon.png"
import { setupL10N, t } from "./libs/l10n"
import zhCN from "./translations/zhCN"

let pluginName: string

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

        if (queryBlockId == null) {
          orca.notify(
            "error",
            t("You have to specify a query scope in the plugin settings."),
          )
          return
        }

        // TODO: Query, shuffle and return the next note.
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
