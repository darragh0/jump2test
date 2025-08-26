import path from "path";
import { Ok } from "../../common/main";
import { Result } from "../../common/types";
import { Framework } from "../interface";

const RUBY_ALLOWED_EXTS = [".rb"];
const TEST_REGEX = /_test$|_spec$|^test_|^spec_/;

function isTestFile(name: string): boolean {
  return TEST_REGEX.test(name);
}

function stripTestPattern(name: string): string {
  return name.replace(TEST_REGEX, "");
}

const ruby: Framework = {
  name: "Ruby",
  deps: ["rails", "rspec", "minitest"],
  devDeps: ["rspec", "rspec-rails", "minitest", "minitest-rails", "test-unit"],
  files: ["Gemfile", "Rakefile", ".rspec", "spec/spec_helper.rb", "test/test_helper.rb"],
  allowedExts: RUBY_ALLOWED_EXTS,

  getGlob(fPath: string, rootDir: string): Result<string[]> {
    const rel = path.relative(rootDir, fPath);
    const parsed = path.parse(rel);
    const name = parsed.name;
    const dir = path.dirname(rel);
    const patterns: string[] = [];

    if (isTestFile(name)) {
      const sourceName = stripTestPattern(name);

      if (dir.includes("spec")) {
        const appPath = dir.replace(/^spec/, "app");
        const libPath = dir.replace(/^spec/, "lib");
        patterns.push(
          `${appPath}/${sourceName}.rb`,
          `${libPath}/${sourceName}.rb`,
          `app/**/${sourceName}.rb`,
          `lib/**/${sourceName}.rb`
        );
      } else if (dir.includes("test")) {
        const appPath = dir.replace(/^test/, "app");
        const libPath = dir.replace(/^test/, "lib");
        patterns.push(
          `${appPath}/${sourceName}.rb`,
          `${libPath}/${sourceName}.rb`,
          `app/**/${sourceName}.rb`,
          `lib/**/${sourceName}.rb`
        );
      }

      patterns.push(`**/${sourceName}.rb`);
    } else {
      if (dir.startsWith("app/")) {
        const specPath = dir.replace(/^app/, "spec");
        const testPath = dir.replace(/^app/, "test");
        patterns.push(`${specPath}/${name}_spec.rb`, `${testPath}/${name}_test.rb`);

        if (dir.includes("controllers")) {
          const requestPath = dir.replace(/controllers/, "requests");
          patterns.push(
            `spec/${requestPath.replace(/^app\//, "")}/${name.replace(/_controller$/, "")}_spec.rb`
          );
        }
      }

      if (dir.startsWith("lib/")) {
        const specPath = dir.replace(/^lib/, "spec");
        const testPath = dir.replace(/^lib/, "test");
        patterns.push(
          `${specPath}/${name}_spec.rb`,
          `${testPath}/${name}_test.rb`,
          `${testPath}/test_${name}.rb`
        );
      }

      patterns.push(
        `${dir}/${name}_spec.rb`,
        `${dir}/${name}_test.rb`,
        `${dir}/test_${name}.rb`,
        `${dir}/spec_${name}.rb`
      );

      patterns.push(
        `spec/${dir}/${name}_spec.rb`,
        `test/${dir}/${name}_test.rb`,
        `test/${dir}/test_${name}.rb`
      );

      patterns.push(
        `spec/**/${name}_spec.rb`,
        `test/**/${name}_test.rb`,
        `test/**/test_${name}.rb`
      );
    }

    return Ok(patterns);
  },

  getFallbackGlob(fPath: string): string[] {
    const name = path.parse(fPath).name;
    const baseName = stripTestPattern(name);

    return [
      `**/${baseName}_spec.rb`,
      `**/${baseName}_test.rb`,
      `**/test_${baseName}.rb`,
      `**/spec_${baseName}.rb`,
      `**/*${baseName}*_spec.rb`,
      `**/*${baseName}*_test.rb`,
      isTestFile(name) ? `**/${baseName}.rb` : `**/${name}.rb`,
    ];
  },
};

export default ruby;
