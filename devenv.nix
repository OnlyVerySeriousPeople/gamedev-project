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
}
