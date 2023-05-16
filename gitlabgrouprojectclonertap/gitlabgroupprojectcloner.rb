class GitlabGroupProjectCloner < Formula
    desc "This package clones project from gitlab."
    homepage "https://gitlab.com/nabs107/gitlabprojectcloner.git"
    url "https://github.com/your-username/your-project/archive/v1.0.0.tar.gz"
    sha256 "..."  # The SHA-256 hash of the release tarball
  
    depends_on "node"
  
    def install
      libexec.install Dir["*"]
      bin.install_symlink Dir["#{libexec}/bin/*"]
    end
  
    test do
      system "#{bin}/your-command", "--version"
    end
  end
  