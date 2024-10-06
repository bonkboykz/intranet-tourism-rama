{ }:

let pkgs = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/5148520bfab61f99fd25fb9ff7bfbb50dad3c9db.tar.gz") { overlays = [ (import (builtins.fetchTarball "https://github.com/railwayapp/nix-npm-overlay/archive/main.tar.gz"))
(import (builtins.fetchTarball "https://github.com/railwayapp/nix-npm-overlay/archive/main.tar.gz")) ]; };
in with pkgs;
  let
    APPEND_LIBRARY_PATH = "${lib.makeLibraryPath [ libmysqlclient libmysqlclient ] }";
    myLibraries = writeText "libraries" ''
      export LD_LIBRARY_PATH="${APPEND_LIBRARY_PATH}:$LD_LIBRARY_PATH"
      
    '';
  in
    buildEnv {
      name = "5148520bfab61f99fd25fb9ff7bfbb50dad3c9db-env";
      paths = [
        (runCommand "5148520bfab61f99fd25fb9ff7bfbb50dad3c9db-env" { } ''
          mkdir -p $out/etc/profile.d
          cp ${myLibraries} $out/etc/profile.d/5148520bfab61f99fd25fb9ff7bfbb50dad3c9db-env.sh
        '')
        (php82.withExtensions (pe: pe.enabled ++ [])) (php82.withExtensions (pe: pe.enabled ++ [])) libmysqlclient libmysqlclient nginx nginx nodejs_20 nodejs_20 npm-9_x npm-9_x php82Packages.composer php82Packages.composer php83Extensions.gd
      ];
    }
