const RUBY_ALLOWED_EXTS = [".rb", ".rake", ".erb", ".haml", ".slim"];

const RSPEC_TEST_PATTERN = /_spec$/;
const MINITEST_TEST_PATTERN = /_test$/;
const MINITEST_PREFIX_PATTERN = /^test_/;
const CUCUMBER_FEATURE_PATTERN = /\.feature$/;

// Rails conventional suffixes to strip when finding base name
const RAILS_SUFFIXES = [
  "_controller",
  "_helper",
  "_mailer",
  "_job",
  "_worker",
  "_service",
  "_presenter",
  "_decorator",
  "_serializer",
  "_policy",
  "_validator",
  "_concern",
];

export {
  CUCUMBER_FEATURE_PATTERN,
  MINITEST_PREFIX_PATTERN,
  MINITEST_TEST_PATTERN,
  RAILS_SUFFIXES,
  RSPEC_TEST_PATTERN,
  RUBY_ALLOWED_EXTS,
};
