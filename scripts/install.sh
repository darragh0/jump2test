#!/usr/bin/env bash

# EXIT CODES
#   1 - jump2test-*.vsix not found
#   2 - invalid usage
#   3 - invalid argument

if [ ! -e ./jump2test-*.vsix ]; then
  echo -e "\x1b[91merror:\x1b[0m \x1b[93mjump2test-*.vsix\x1b[0m not found"
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
  vscode --uninstall-extension ./jump2test-*.vsix
  vscode --install-extension ./jump2test-*.vsix
elif [ "$1" == "cursor" ]; then
  cursor --uninstall-extension ./jump2test-*.vsix
  cursor --install-extension ./jump2test-*.vsix
else
  echo -e "\x1b[91merror: invalid argument:\x1b[0m \x1b[96m$1\x1b[0m"
  exit 3
fi

echo -e "\n\x1b[92msuccess:\x1b[0m installed \x1b[93mjump2test-*.vsix\x1b[0m"
