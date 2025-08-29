import { StackId } from "@stack/types";

type StackSet = Set<StackId>;

type Config = {
  autoOpen: boolean;
  allowFallback: boolean;
  keepSourceOpen: boolean;
  enabledStacks: StackSet;
};

export { Config, StackSet };
