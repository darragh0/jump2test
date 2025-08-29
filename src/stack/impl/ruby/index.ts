import { ErrMsg } from "@common/msg/const";
import { Err, Ok } from "@common/result";
import { Result } from "@common/result/types";
import { getConfigVal } from "@ext/config/main";
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

function extractBaseFromTest(name: string): string {
  if (RSPEC_TEST_PATTERN.test(name)) return name.replace(RSPEC_TEST_PATTERN, "");
  if (MINITEST_TEST_PATTERN.test(name)) return name.replace(MINITEST_TEST_PATTERN, "");
  if (MINITEST_PREFIX_PATTERN.test(name)) return name.replace(MINITEST_PREFIX_PATTERN, "");
  return name;
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

  // Only add system/feature test patterns (they don't overlap with directory mappings)
  pats.push(
    `spec/system/**/*${base}*_spec.rb`,
    `spec/features/**/*${base}*_spec.rb`,
    `test/system/**/*${base}*_test.rb`,
    `features/**/*${base}*.feature`
  );

  return pats;
}

function genSrcPatterns(fp: string, root: string): string[] {
  const rel = path.relative(root, fp);
  const parsed = path.parse(rel);
  const name = parsed.name;
  const dir = path.dirname(rel);

  const base = extractBaseFromTest(name);
  const pats: string[] = [];

  const testToSrcMaps: Record<string, string[]> = {
    "spec/models": ["app/models"],
    "spec/controllers": ["app/controllers"],
    "spec/requests": ["app/controllers"],
    "spec/helpers": ["app/helpers"],
    "spec/mailers": ["app/mailers"],
    "spec/jobs": ["app/jobs"],
    "spec/services": ["app/services"],
    "spec/workers": ["app/workers"],
    "spec/views": ["app/views"],
    "spec/lib": ["lib"],
    "test/models": ["app/models"],
    "test/unit": ["app/models"],
    "test/controllers": ["app/controllers"],
    "test/functional": ["app/controllers"],
    "test/helpers": ["app/helpers"],
    "test/mailers": ["app/mailers"],
    "test/jobs": ["app/jobs"],
    "test/services": ["app/services"],
    "test/workers": ["app/workers"],
    "test/views": ["app/views"],
    "test/lib": ["lib"],
  };

  for (const [td, sds] of Object.entries(testToSrcMaps)) {
    if (dir === td || dir.startsWith(`${td}/`)) {
      const sub = dir.startsWith(`${td}/`) ? dir.slice(td.length + 1) : "";
      for (const sd of sds) {
        for (const sfx of ["", ...RAILS_SUFFIXES]) {
          const fn = `${base}${sfx}.rb`;
          pats.push(sub ? `${sd}/${sub}/${fn}` : `${sd}/${fn}`);
        }
      }
    }
  }

  if (dir.startsWith("spec/") || dir.startsWith("test/")) {
    const sub = dir.replace(/^(spec|test)\//, "");
    pats.push(`app/${sub}/${base}.rb`, `lib/${sub}/${base}.rb`);
    for (const sfx of RAILS_SUFFIXES) {
      pats.push(`app/${sub}/${base}${sfx}.rb`);
    }
  }

  const engMatch = dir.match(/^engines\/([^/]+)\/(spec|test)\/(.+)/);
  if (engMatch) {
    const [, eng, , testSub] = engMatch;
    pats.push(`engines/${eng}/app/${testSub}/${base}.rb`, `engines/${eng}/lib/${base}.rb`);
  }

  // Only add Cucumber-specific patterns if it's a feature file
  if (CUCUMBER_FEATURE_PATTERN.test(fp)) {
    pats.push(`app/**/${base}.rb`, `lib/**/${base}.rb`);
    for (const sfx of RAILS_SUFFIXES) {
      pats.push(`app/**/${base}${sfx}.rb`);
    }
  }

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

    if (isTestFile(name, fp) || dir.startsWith("spec/") || dir.startsWith("test/") || dir.startsWith("features/")) {
      if (getConfigVal("jumpToSourceBeta")) {
        const pats = genSrcPatterns(fp, root);
        return Ok(Array.from(new Set(pats)));
      }
      return Err(ErrMsg.ALREADY_IN_TEST);
    }

    const pats = genTestPatterns(fp, root);
    return Ok(Array.from(new Set(pats)));
  },

  getFallbackGlob(fp: string): string[] {
    const name = path.parse(fp).name;
    const isTest = isTestFile(name, fp);
    const base = isTest ? extractBaseFromTest(name) : extractBaseName(name);

    if (isTest && getConfigVal("jumpToSourceBeta")) {
      return [
        `**/${base}.rb`,
        `**/*${base}*.rb`,
      ];
    }

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