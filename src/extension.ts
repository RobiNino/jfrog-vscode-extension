import * as vscode from 'vscode';
import { CodeLensManager } from './main/codeLens/codeLensManager';
import { CommandManager } from './main/commands/commandManager';
import { ConnectionManager } from './main/connect/connectionManager';
import { DiagnosticsManager } from './main/diagnostics/diagnosticsManager';
import { FilterManager } from './main/filter/filterManager';
import { FocusManager } from './main/focus/focusManager';
import { HoverManager } from './main/hover/hoverManager';
import { ScanCacheManager } from './main/scanCache/scanCacheManager';
import { TreesManager } from './main/treeDataProviders/treesManager';
import { WatcherManager } from './main/watchers/watcherManager';

/**
 * This method is called when the extension is activated.
 * @param context - The extension context
 */
export async function activate(context: vscode.ExtensionContext) {
    let workspaceFolders: vscode.WorkspaceFolder[] = vscode.workspace.workspaceFolders || [];

    let connectionManager: ConnectionManager = await new ConnectionManager().activate(context);
    let scanCacheManager: ScanCacheManager = new ScanCacheManager().activate(context);
    let treesManager: TreesManager = await new TreesManager(workspaceFolders, connectionManager, scanCacheManager).activate(context);
    let filterManager: FilterManager = new FilterManager(treesManager).activate(context);
    let focusManager: FocusManager = new FocusManager().activate(context);

    new DiagnosticsManager(treesManager).activate(context);
    new WatcherManager(treesManager).activate(context);
    new HoverManager(treesManager).activate(context);
    new CodeLensManager().activate(context);
    new CommandManager(connectionManager, treesManager, filterManager, focusManager).activate(context);
}
