class GitlabGroupProjectCloner < Formula
    desc "This package clones project from gitlab."
    homepage "https://gitlab.com/nabs107/gitlabprojectcloner.git"
    url "https://gitlab.com/nabs107/gitlabprojectcloner/-/archive/1.0.0/gitlabprojectcloner-1.0.0.tar.gz"
    sha256 "eb28774b04ca1022d439fdd0ba1ff6f228b7389bfbed"  # The SHA-256 hash of the release tarball
  
    depends_on "node"
  
    def install
      libexec.install Dir["*"]
      bin.install_symlink Dir["#{libexec}/bin/*"]
    end
  
    test do
      system "#{bin}/cloner", "--version"
    end
  end
  