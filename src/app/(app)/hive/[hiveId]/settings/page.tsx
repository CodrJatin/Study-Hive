import React from "react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Main Header Added */}
      <div>
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">Manage Hive</h1>
      </div>

      {/* Section 1: General Details */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-on-surface">General Details</h2>
          <p className="text-on-surface-variant">Update your hive&apos;s identity and visual presence.</p>
        </div>

        <div className="bg-surface-container-lowest rounded-[1.5rem] p-8 space-y-8 transition-all clay-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant px-1">Hive Name</label>
              <input
                className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all outline-none"
                type="text"
                defaultValue="Organic Chemistry"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant px-1">Short Code</label>
              <input
                className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all outline-none"
                type="text"
                defaultValue="CHEM-302"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant px-1">Description</label>
            <textarea
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all outline-none"
              rows={4}
              defaultValue="Advanced mechanisms, synthesis pathways, and molecular orbital theory. Collaborative space for CHEM-302 students."
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button className="cta-gradient text-white px-8 py-3 rounded-full font-bold transition-transform active:scale-95 shadow-md">
              Save Changes
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Manage Members */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-on-surface">Manage Members</h2>
            <p className="text-on-surface-variant">Control who can access and edit this workspace.</p>
          </div>
          <button className="bg-[#FFC107] text-[#261a00] px-6 py-2.5 rounded-full font-bold transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-md">
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>Add Member</span>
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-[1.5rem] overflow-hidden clay-card">
          <div className="divide-y divide-surface-container">
            {/* Member Row 1 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-surface-container-low transition-colors gap-4">
              <div className="flex items-center gap-4">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuALdL6qkPhvid8yrmEgxLrfuNhDRqo5LbxkCCT5Ff6RAwK4OpVoKb7KzAz7Fo_k8-HCMruP8VfMeopOrL9XXFluYodMox1D7RJjTKqnBjr6OOQksRNAxucNmo2XwJRzm0IkKctiFoSktdG3i__k_YIJWy6-_JYxZL5sLF1LzmdydntYZMBS8hhQxJXy_uzVr3W8wKbD-FCidC7AHxUa3illcRDI95n8vPcRe5iSLslrBIV6G5t_JFnJivAQOhmD94wXnfhHnALcXQ"
                  alt="Member"
                />
                <div>
                  <p className="font-semibold text-on-surface">Alex Rivera</p>
                  <p className="text-sm text-on-surface-variant">arivera@university.edu</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                <select className="bg-surface-container-high border-none rounded-lg text-sm font-medium py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-primary-container outline-none">
                  <option defaultValue="Admin">Admin</option>
                  <option>Member</option>
                  <option>View Only</option>
                </select>
                <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person_remove</span>
                </button>
              </div>
            </div>

            {/* Member Row 2 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-surface-container-low transition-colors gap-4">
              <div className="flex items-center gap-4">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2Q-Hjnfq2vESCJTtheSLV-wX37PF-1FD57emMuAy1VHjfpELC6mtC_gxJORCYAXwvSy6RQJQJr3fGvM1o6hRNf5YlTSoirAxJ8v8h7Vcx84UM_WkSOW3_oSXgpXQ8_qev-Y5O65w7E6TacQLHsguDtPiute0UVBLUKXeFaSt_hY6sMYI55btQatslHhjAw3m0A5LaiEUICKN-maIpccbuj5e4KVemywnmAea-UPD_MnQ3z3NN-1HemiMuaahVe2_UfPyg4I101w"
                  alt="Member"
                />
                <div>
                  <p className="font-semibold text-on-surface">Jordan Chen</p>
                  <p className="text-sm text-on-surface-variant">jchen@university.edu</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                <select className="bg-surface-container-high border-none rounded-lg text-sm font-medium py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-primary-container outline-none">
                  <option>Admin</option>
                  <option defaultValue="Member">Member</option>
                  <option>View Only</option>
                </select>
                <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person_remove</span>
                </button>
              </div>
            </div>

            {/* Member Row 3 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-surface-container-low transition-colors gap-4">
              <div className="flex items-center gap-4">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa64WRorLAsy5pK30MUlHx0wzPCi3lR5_iEn_ZwUQgPQS_qF986DO4QFkU1f2KCfzLhAlJXfTJjnrRTZBabw8hhTTq4Cv_TIssKAykcuJxMpBd_Kqus8UyYUHSRaAV0b3m1D8zKj3A47Q_SRv0XzcW2wuH2N-iMNyb4o6Y1cuf2iiaRJ_k-CfpF1mibKt57-QGbFuQMGbJ1I2iICID3Lu--FzPAW5HKTBNYs4AaZpS_a168PMrR9-l-cur6GE9d6ExYk8jJmaVGQ"
                  alt="Member"
                />
                <div>
                  <p className="font-semibold text-on-surface">Sarah Miller</p>
                  <p className="text-sm text-on-surface-variant">smiller@university.edu</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                <select className="bg-surface-container-high border-none rounded-lg text-sm font-medium py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-primary-container outline-none">
                  <option>Admin</option>
                  <option>Member</option>
                  <option defaultValue="View Only">View Only</option>
                </select>
                <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person_remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Danger Zone */}
      <section className="pt-8 border-t border-outline-variant/10">
        <div className="bg-error-container/30 rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-error/10">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-error">Danger Zone</h3>
            <p className="text-on-surface-variant max-w-lg">
              Deleting a hive is permanent. All notes, members, and collaborative progress will be erased forever.
            </p>
          </div>
          <button className="bg-error text-on-error px-8 py-3 rounded-full font-bold hover:bg-opacity-80 transition-transform active:scale-95 whitespace-nowrap">
            Delete Hive
          </button>
        </div>
      </section>
    </div>
  );
}
