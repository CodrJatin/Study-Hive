export default function LoginPage() {
  return (
    <>
      {/* TopAppBar */}
      <header className="w-full top-0 sticky bg-[#fcf9f8] z-50">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#785900] tracking-tight font-headline">StudyHive</span>
          </div>
          <div className="flex items-center gap-6"></div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4 md:p-8">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-surface-container-low rounded-xl overflow-hidden shadow-sm">
          {/* Side: Brand Area Redesigned */}
          <div className="relative hidden md:flex flex-col items-center justify-center p-12 text-center paper-texture border-r border-outline-variant/20">
            <div className="relative z-10 max-w-sm">
              <div className="mb-8 flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest/80 backdrop-blur-sm rounded-full text-primary font-bold text-sm shadow-sm border border-outline-variant/30">
                  <span className="material-symbols-outlined text-sm" data-icon="auto_awesome">auto_awesome</span>
                  <span>Curating Knowledge Daily</span>
                </div>
              </div>
              <h1 className="font-headline text-2xl font-bold text-primary mb-4 tracking-tight">StudyHive</h1>
              <h2 className="font-headline text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight">
                Organize by topic, <br/>
                <span className="text-primary">conquer by Track.</span>
              </h2>
              <p className="mt-8 text-on-surface-variant text-lg leading-relaxed font-medium">
                Join 50,000+ students organizing their academic life in the digital atelier of focus.
              </p>
            </div>
          </div>

          {/* Side: Auth Form */}
          <div className="bg-surface-container-lowest p-8 md:p-16 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              <div className="mb-10 text-center md:text-left">
                <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Welcome Back</h2>
                <p className="text-on-surface-variant font-body">Please enter your details to access your hive.</p>
              </div>

              <form className="space-y-6">
                {/* Google Login */}
                <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full border border-outline-variant hover:bg-surface-container-low transition-colors duration-200 group" type="button">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span className="text-on-surface font-medium">Continue with Google</span>
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-outline-variant/30"></div>
                  <span className="flex-shrink mx-4 text-outline text-xs uppercase tracking-widest">or email</span>
                  <div className="flex-grow border-t border-outline-variant/30"></div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1.5 ml-1" htmlFor="email">Email Address</label>
                    <input className="w-full px-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-200 placeholder:text-outline" id="email" placeholder="curator@studyhive.edu" type="email" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5 ml-1">
                      <label className="block text-sm font-medium text-on-surface-variant" htmlFor="password">Password</label>
                      <a className="text-xs text-tertiary hover:underline" href="#">Forgot Password?</a>
                    </div>
                    <input className="w-full px-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-200 placeholder:text-outline" id="password" placeholder="••••••••" type="password" />
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full cta-gradient text-on-primary font-bold py-4 rounded-full shadow-lg hover:opacity-90 transform active:scale-[0.98] transition-all duration-200" type="submit">
                  Sign In
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-on-surface-variant text-sm">
                  Don&apos;t have an account? 
                  <a className="text-primary font-bold hover:underline ml-1" href="#">Sign up</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-[#fcf9f8] border-t-[0px]">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4">
          <div className="text-[#1b1c1c]/60 font-body text-xs tracking-wide">
            © 2024 StudyHive. Secured by Academic Encryption.
          </div>
          <div className="flex gap-6">
            <a className="text-[#1b1c1c]/60 font-body text-xs tracking-wide transition-colors hover:text-[#006877]" href="#">Privacy Policy</a>
            <a className="text-[#1b1c1c]/60 font-body text-xs tracking-wide transition-colors hover:text-[#006877]" href="#">Terms of Service</a>
            <a className="text-[#1b1c1c]/60 font-body text-xs tracking-wide transition-colors hover:text-[#006877]" href="#">Security Standards</a>
          </div>
        </div>
      </footer>
    </>
  );
}
