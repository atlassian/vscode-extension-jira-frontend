const vscode = require('vscode');
const path = require('path');

function sendToTerminal(command, currentPath) {
    let terminal = vscode.window.createTerminal();
    terminal.show();

    terminal.sendText(command, true);
    terminal.sendText(currentPath, true);
}

function activate(context) {
    let generateApp = vscode.commands.registerCommand('extension.generateApp', function (e) {
        const pathSplit = vscode.workspace.asRelativePath(e.fsPath).split(path.sep);

        if (pathSplit.includes('view') || pathSplit.includes('state')) {
            vscode.window.showErrorMessage("Oops you tried to generate an app from inside a view/state folder");
            return;
        }

        const pathToConfig = [...pathSplit, 'config.json'].join(path.sep);
        sendToTerminal("yarn generate", pathToConfig);
    });

    let generateView = vscode.commands.registerCommand('extension.generateView', function (e) {
        const pathSplit = vscode.workspace.asRelativePath(e.fsPath).split(path.sep);

        if (!pathSplit.includes('view')) {
            vscode.window.showErrorMessage("Oops you tried to generate a view not from a view folder");
            return;
        }

        sendToTerminal("yarn generate view", pathSplit.join(path.sep));
    });

    let generateState = vscode.commands.registerCommand('extension.generateState', function (e) {
        const pathSplit = vscode.workspace.asRelativePath(e.fsPath).split(path.sep);
        
        if (!pathSplit.includes('state')) {
            vscode.window.showErrorMessage("Oops you tried to generate a state not from a state folder");
            return;
        }

        sendToTerminal("yarn generate state", pathSplit.join(path.sep));
    });

    context.subscriptions.push(generateApp, generateView, generateState);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;