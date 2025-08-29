import { ErrMsg } from "@common/msg/const";
import { Err, Ok } from "@common/result";
import { Result } from "@common/result/types";
import {
  CUCUMBER_FEATURE_PATTERN,
  MINITEST_PREFIX_PATTERN,
  MINITEST_TEST_PATTERN,
  RAILS_SUFFIXES,
  RSPEC_TEST_PATTERN,
  RUBY_ALLOWED_EXTS,
} from "@impl/ruby/const";
import { Stack } from "@stack/interface";
import path from "path";

function isTestFile(name: string, fp: string): boolean {
  if (RSPEC_TEST_PATTERN.test(name)) return true;
  if (MINITEST_TEST_PATTERN.test(name)) return true;
  if (MINITEST_PREFIX_PATTERN.test(name)) return true;
  if (CUCUMBER_FEATURE_PATTERN.test(fp)) return true;
  return false;
}

function extractBaseName(name: string): string {
  let base = name;
  for (const sfx of RAILS_SUFFIXES) {
    if (base.endsWith(sfx)) {
      base = base.slice(0, -sfx.length);
      break;
    }
  }
  return base;
}

function getTestDirMapping(srcDir: string): {
  rspec: string[];
  minitest: string[];
} {
  const maps: Record<string, { rspec: string[]; minitest: string[] }> = {
    "app/models": {
      rspec: ["spec/models"],
      minitest: ["test/models", "test/unit"],
    },
    "app/controllers": {
      rspec: ["spec/controllers", "spec/requests"],
      minitest: ["test/controllers", "test/functional"],
    },
    "app/helpers": {
      rspec: ["spec/helpers"],
      minitest: ["test/helpers"],
    },
    "app/mailers": {
      rspec: ["spec/mailers"],
      minitest: ["test/mailers"],
    },
    "app/jobs": {
      rspec: ["spec/jobs"],
      minitest: ["test/jobs"],
    },
    "app/services": {
      rspec: ["spec/services"],
      minitest: ["test/services"],
    },
    "app/workers": {
      rspec: ["spec/workers"],
      minitest: ["test/workers"],
    },
    "app/views": {
      rspec: ["spec/views"],
      minitest: ["test/views"],
    },
    lib: {
      rspec: ["spec/lib", "spec"],
      minitest: ["test/lib", "test"],
    },
  };

  for (const [k, v] of Object.entries(maps)) {
    if (srcDir === k || srcDir.startsWith(`${k}/`)) return v;
  }

  if (srcDir.startsWith("app/")) {
    const sub = srcDir.replace("app/", "");
    return {
      rspec: [`spec/${sub}`, "spec"],
      minitest: [`test/${sub}`, "test"],
    };
  }

  const engMatch = srcDir.match(/^engines\/([^/]+)\/app\/(.+)/);
  if (engMatch) {
    const [, eng, appSub] = engMatch;
    return {
      rspec: [`engines/${eng}/spec/${appSub}`, `engines/${eng}/spec`],
      minitest: [`engines/${eng}/test/${appSub}`, `engines/${eng}/test`],
    };
  }

  return { rspec: ["spec"], minitest: ["test"] };
}

function genTestPatterns(fp: string, root: string): string[] {
  const rel = path.relative(root, fp);
  const parsed = path.parse(rel);
  const name = parsed.name;
  const dir = path.dirname(rel);

  const base = extractBaseName(name);
  const pats: string[] = [];

  const { rspec, minitest } = getTestDirMapping(dir);

  for (const sd of rspec) {
    pats.push(`${sd}/${base}_spec.rb`);

    if (name.endsWith("_controller")) {
      const res = base.replace(/_controller$/, "");
      pats.push(`spec/requests/${res}_spec.rb`);
      pats.push(`spec/requests/${name}_spec.rb`);
    }

    if (dir.includes("/")) {
      const sub = dir.split("/").slice(1).join("/");
      pats.push(`${sd}/${sub}/${base}_spec.rb`);
    }
  }

  for (const td of minitest) {
    pats.push(`${td}/${base}_test.rb`);
    pats.push(`${td}/test_${base}.rb`);

    if (dir.includes("/")) {
      const sub = dir.split("/").slice(1).join("/");
      pats.push(`${td}/${sub}/${base}_test.rb`);
      pats.push(`${td}/${sub}/test_${base}.rb`);
    }
  }

  pats.push(
    `spec/system/**/*${base}*_spec.rb`,
    `spec/features/**/*${base}*_spec.rb`,
    `test/system/**/*${base}*_test.rb`,
    `features/**/*${base}*.feature`,
    `spec/**/${base}_spec.rb`,
    `test/**/${base}_test.rb`,
    `test/**/test_${base}.rb`
  );

  return pats;
}

const ruby: Stack = {
  id: "ruby",
  exts: RUBY_ALLOWED_EXTS,

  files: [
    "Gemfile",
    "Gemfile.lock",
    "Rakefile",
    ".rspec",
    "spec/spec_helper.rb",
    "test/test_helper.rb",
    "features/support/env.rb",
  ],

  getGlob(fp: string, root: string): Result<string[]> {
    const rel = path.relative(root, fp);
    const parsed = path.parse(rel);
    const name = parsed.name;
    const dir = path.dirname(rel);

    if (isTestFile(name, fp)) return Err(ErrMsg.ALREADY_IN_TEST);

    const pats = genTestPatterns(fp, root);
    return Ok(Array.from(new Set(pats)));
  },

  getFallbackGlob(fp: string): string[] {
    const name = path.parse(fp).name;
    const base = extractBaseName(name);

    return [
      `**/*${base}*_spec.rb`,
      `**/${base}_spec.rb`,
      `**/*${base}*_test.rb`,
      `**/${base}_test.rb`,
      `**/test_${base}.rb`,
      `features/**/*${base}*.feature`,
    ];
  },
};

export default ruby;
