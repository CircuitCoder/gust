# Gust

This repository contains the primary source code for [gust.construction](https://gust.construction/).

This repo itself contains the source code for the frontend, the build script (powered by GitHub Actions), as well as serves as the GitHub Pages host of the public site. The raw content and a pre-processor are placed in separate repositories, contained as submodules in this master repo. You can find those code at:

- [CircuitCoder/gust-gen](https://github.com/CircuitCoder/gust-gen): The data pre-processor written in Rust
- [CircuitCoder/gust-data](https://github.com/CircuitCoder/gust-data/commits/master): The raw content source files

## Build
We recommend using [nektos/act](https://github.com/nektos/act) for running GitHub Actions locally. If you don't have a docker environment, or prefer to build step by step, you may check out the GitHub Actions workflow spec.

## License
All code and documents included in this repository (excluding submodules) are distributed under the MIT license. You can find a full copy of the license at the LICENSE file.

Source code and materials within submodule may be distributed under a different license. Please checkout their respective repositories.
