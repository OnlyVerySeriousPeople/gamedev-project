{ pkgs, ... }:
{
  languages = {
    javascript = {
      enable = true;
      npm.enable = true;
    };
  };

  packages = with pkgs; [
    typescript-language-server
    vscode-langservers-extracted # provides HTML and CSS language servers
  ];

  git-hooks.hooks = {
    prettier = {
      enable = true;
      settings.binPath = "./node_modules/.bin/prettier";
    };
    eslint = {
      enable = true;
      settings.binPath = "./node_modules/.bin/eslint";
    };
  };
}
