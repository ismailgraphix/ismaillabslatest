const team = [
  {
    name: "Charlotte Amitina",
    role: "UI/UX Designer",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/team-1.webp",
  },
  {
    name: "William Edward",
    role: "Project Manager",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/team-2.webp",
  },
  {
    name: "Hannah Chloe",
    role: "Product Designer",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/team-3.webp",
  },
  {
    name: "Maiselan Willam",
    role: "Web Developer",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/team-4.webp",
  },
];

const socials = ["f", "in", "tw", "be"];

export default function Team() {
  return (
    <section className="py-28 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#4A6CF7]/10 rounded-full px-4 py-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7]" />
            <span className="font-heading font-semibold text-sm text-[#4A6CF7] uppercase tracking-widest">Team Members</span>
          </div>
          <h2 className="font-heading font-black text-[clamp(2rem,4vw,3.5rem)] leading-tight text-[#0A0A0A]">
            Experience Team Member
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="group relative overflow-hidden rounded-2xl bg-white cursor-pointer">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />

                {/* Social links */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  {socials.map((s) => (
                    <div key={s} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0A0A0A] font-heading font-bold text-xs hover:bg-[#4A6CF7] hover:text-white transition-colors cursor-pointer">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-heading font-black text-lg text-[#0A0A0A] group-hover:text-[#4A6CF7] transition-colors">
                  {member.name}
                </h3>
                <p className="font-body text-sm text-gray-500 mt-1">{member.role}</p>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4A6CF7] group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
