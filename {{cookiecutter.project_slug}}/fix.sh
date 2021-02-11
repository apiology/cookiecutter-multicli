#!/bin/bash -eu

ensure_bundle() {
  bundle --version >/dev/null 2>&1 || gem install bundler
  bundle install
}

ensure_bundle
