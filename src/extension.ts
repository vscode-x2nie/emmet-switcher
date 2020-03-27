// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {getEmmetMode} from 'vscode-emmet-helper';

export class EmmetLang implements vscode.QuickPickItem {

	constructor(
		public readonly label: string,
		private version: string,
		// public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly picked: boolean
	) {
		// super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}-${this.version}`;
	}

	get description(): string {
		return ` (${this.version}) ${this.picked? ' *currently used': ''}`;
	}

	// get detail(): string | undefined {
	// 	return this.picked ? 'Currently used' : undefined;
	// }

	// iconPath = {
	// 	light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
	// 	dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	// };

	// contextValue = 'dependency';

}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "emmet-switcher" is now active!');
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.switchEmmetLanguage', () => {
		// The code you place here will be executed every time your command is executed
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('No editor is active');
			return false;
		}
		const ActiveEditorLang = editor.document.languageId;
		const includeLanguages = vscode.workspace.getConfiguration('emmet.includeLanguages');
		const currentEmmetLang = includeLanguages.get(ActiveEditorLang);
		vscode.languages.getLanguages().then((availableLanguages)=>{
			// console.log(langs);
			const emmetLanguages : EmmetLang[] = [];
			availableLanguages.forEach((lang)=>{
				console.log(' - lang:',lang);
				const emmetModeLang = getEmmetMode(lang);
				if(!!emmetModeLang){
					emmetLanguages.push( new EmmetLang(lang, emmetModeLang, lang===currentEmmetLang) ) ;
				}
				// emmetLanguages.push(`${lang} - ${getEmmetMode(lang)}`);
			});
			vscode.window
				// .showQuickPick(availableLanguages, {
				.showQuickPick<EmmetLang>(emmetLanguages, {
					placeHolder: `Select Emmet for ${editor.document.languageId}`
				})
				.then(selection => {
					// if (selection) {
					// 	var index = fontArray.indexOf(selection);
					// 	fontArray.splice(index, 1);
					// 	fontArray.splice(0, 0, selection);
					// 	fontString = fontArray.join(", ");
					// 	editorConfig.update("fontFamily", fontString, true);
					// }
					console.log('user select emmet:', selection?.label);
					vscode.workspace.getConfiguration('emmet').update('includeLanguages', { [ActiveEditorLang]: selection?.label }, vscode.ConfigurationTarget.Global);
				});
      
			// await workspace.getConfiguration('emmet').update('includeLanguages', { 'javascript': 'html' }, ConfigurationTarget.Global)
			// https://github.com/microsoft/vscode/blob/16a84b4902a664ad423e214c3f6120e9a68c6d55/extensions/emmet/src/test/abbreviationAction.test.ts
		});
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
