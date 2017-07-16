namespace Config {
  export var ConstAllMoveAction: HTMLButtonElement[] = [];
}
namespace EnvState {
  export var volume: number;
  export var mute: any;
  export var isMuted: any;
  export var mainElement : FolderElement;
  export var isLeftMenueToggled: boolean;
  export var isFootMenue: boolean;
  export var forceElement: boolean;
  export var currentDirEntries: Array<string>;
  export var currentDirEntriesCleaned: boolean;
  export var currentDir: string;
  export var folderManager: FolderManager;
  export var lockedPaged: boolean;
  export var isLock: boolean;
  export var moveTargetManager: MoveTargetManager;
  export var fullSreen: boolean = false;
}
