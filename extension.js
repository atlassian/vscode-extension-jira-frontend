const vscode = require('vscode');

function activate(context) {
    let generateApp = vscode.commands.registerCommand('extension.generateApp', function (e) {
        const currentPath = vscode.workspace.asRelativePath(e.fsPath);
        if (currentPath.includes('view') || currentPath.includes('state')) {
            vscode.window.showErrorMessage("Oops you tried to generate an app from inside a view/state folder");
            return;
        }

        let terminal = vscode.window.createTerminal();
        terminal.show();

        terminal.sendText("yarn generate", true);
        terminal.sendText(currentPath + "/config.json", true);
    });

    let generateView = vscode.commands.registerCommand('extension.generateView', function (e) {
        const currentPath = vscode.workspace.asRelativePath(e.fsPath);
        if (!currentPath.includes('view')) {
            vscode.window.showErrorMessage("Oops you tried to generate a view not from a view folder");
            return;
        }

        let terminal = vscode.window.createTerminal();
        terminal.show();

        terminal.sendText("yarn generate view", true);
        terminal.sendText(currentPath, true);
    });

    let generateState = vscode.commands.registerCommand('extension.generateState', function (e) {
        const currentPath = vscode.workspace.asRelativePath(e.fsPath);
        if (!currentPath.includes('state')) {
            vscode.window.showErrorMessage("Oops you tried to generate a state not from a state folder");
            return;
        }

        let terminal = vscode.window.createTerminal();
        terminal.show();

        terminal.sendText("yarn generate state", true);
        terminal.sendText(currentPath, true);
    });

    context.subscriptions.push(generateApp, generateView, generateState);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;