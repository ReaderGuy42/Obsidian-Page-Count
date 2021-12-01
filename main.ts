import { Plugin, PluginSettingTab, Setting } from "obsidian"

import PCount from "page-count"

export default class PageCount extends Plugin {

settings: PageCountSettings

statusBar: HTMLElement

async onload() {

this.settings = (await this.loadData()) || new PageCountSettings()

this.statusBar = this.addStatusBarItem()

this.statusBar.setText("")

this.addSettingTab(new PageCountSettingsTab(this.app, this))

this.registerEvent(

this.app.workspace.on("file-open", this.calculatePageCount)

)

this.registerEvent(this.app.on("codemirror", this.codeMirror))

}

codeMirror = (cm: any) => {

cm.on("change", this.calculatePageCount)

}

calculatePageCount = (e: any) => {

let activeLeaf: any = this.app.workspace.activeLeaf ?? null

try {

if (activeLeaf?.view?.data) {

let stats = PCount(activeLeaf.view.data, {

wordsPerPage: this.settings.pageLength,

})

this.statusBar.setText(`${stats.text}`)

} else {

this.statusBar.setText("")

}

} catch (e) {

console.log(e.message)

}

}

}

class PageCountSettings {

pageLength: number = 300

}

class PageCountSettingsTab extends PluginSettingTab {

display(): void {

let { containerEl } = this

const plugin: any = (this as any).plugin

containerEl.empty()

new Setting(containerEl)

.setName("Words per Page")

.setDesc("Words per page used for page count (default: 300).")

.addText((text) =>

text

.setPlaceholder("Example: 300")

.setValue((plugin.settings.pageLength || "") + "")

.onChange((value) => {

console.log("Page Length: " + value)

plugin.settings.pageLength = parseInt(value.trim())

plugin.saveData(plugin.settings)

plugin.calculatePageCount()

})

)

}

}
