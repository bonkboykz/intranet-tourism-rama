{ }:

let pkgs = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/dbc4f15b899ac77a8d408d8e0f89fa9c0c5f2b78.tar.gz") { overlays = [ (import (builtins.fetchTarball "https://github.com/railwayapp/nix-npm-overlay/archive/main.tar.gz"))
(import (builtins.fetchTarball "https://github.com/railwayapp/nix-npm-overlay/archive/main.tar.gz")) ]; };
in with pkgs;
  let
    APPEND_LIBRARY_PATH = "${lib.makeLibraryPath [ libmysqlclient libmysqlclient ] }";
    myLibraries = writeText "libraries" ''
      export LD_LIBRARY_PATH="${APPEND_LIBRARY_PATH}:$LD_LIBRARY_PATH"
      
    '';
  in
    buildEnv {
      name = "dbc4f15b899ac77a8d408d8e0f89fa9c0c5f2b78-env";
      paths = [
        (runCommand "dbc4f15b899ac77a8d408d8e0f89fa9c0c5f2b78-env" { } ''
          mkdir -p $out/etc/profile.d
          cp ${myLibraries} $out/etc/profile.d/dbc4f15b899ac77a8d408d8e0f89fa9c0c5f2b78-env.sh
        '')
        (php.withExtensions (pe: pe.enabled ++ [])) (php.withExtensions (pe: pe.enabled ++ [])) libmysqlclient libmysqlclient nginx nginx nodejs_20 nodejs_20 npm-9_x npm-9_x php83Extensions.gd phpPackages.composer phpPackages.composer
      ];
    }
