#!/usr/bin/env bash

# EXIT CODES
#   1 - hoppy-*.vsix not found
#   2 - invalid usage
#   3 - invalid argument

if [ ! -e ./hoppy-*.vsix ]; then
  echo -e "\x1b[91merror:\x1b[0m \x1b[93mhoppy-*.vsix\x1b[0m not found"
  exit 1
fi


if (("$#" != 1)); then
  echo -e "\x1b[91merror: usage:\x1b[0m \x1b[96m$0 [vscode|cursor]\x1b[0m"
  exit 2
fi

if [ "$1" == "help" ] || [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
  echo -e "\x1b[96musage:\x1b[0m \x1b[96m$0 [vscode|cursor]\x1b[0m"
  exit 0
elif [ "$1" == "vscode" ]; then
  vscode --uninstall-extension ./hoppy-*.vsix
  vscode --install-extension ./hoppy-*.vsix
elif [ "$1" == "cursor" ]; then
  cursor --uninstall-extension ./hoppy-*.vsix
  cursor --install-extension ./hoppy-*.vsix
else
  echo -e "\x1b[91merror: invalid argument:\x1b[0m \x1b[96m$1\x1b[0m"
  exit 3
fi

echo -e "\n\x1b[92msuccess:\x1b[0m installed \x1b[93mhoppy-*.vsix\x1b[0m"
