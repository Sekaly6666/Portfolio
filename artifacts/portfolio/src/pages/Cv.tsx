import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Download, Briefcase, GraduationCap, Wrench, User, Wrench as ToolIcon, Languages, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Cv() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-muted/30 print:pt-0 print:pb-0" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      <div className="container mx-auto px-4 md:px-8 max-w-[1000px] print:p-0">
        
        <div className="flex justify-end mb-6 print:hidden">
          <Button onClick={() => window.print()} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Télécharger CV
          </Button>
        </div>

        <style>{`
          @media print {
            @page { margin: 0mm; size: A4; }
            body, html { margin: 0; padding: 0; width: 210mm; height: 297mm; overflow: hidden; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .cv-print-wrapper {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}</style>

        {/* CV Paper Container */}
        <div className="bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row print:flex-row min-h-[1200px] print:min-h-0 cv-print-wrapper">
          
          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-[35%] print:w-[35%] bg-[#2b2b2b] text-white relative">
            
            {/* Top geometric accent shape */}
            <div 
              className="absolute top-0 left-0 w-full h-[280px] print:h-[200px] bg-primary z-0" 
              style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
            ></div>

            {/* Profile Photo */}
            <div className="relative z-10 w-48 h-48 print:w-28 print:h-28 mx-auto mt-16 print:mt-4 rounded-full overflow-hidden border-[6px] print:border-[3px] border-white ring-4 ring-accent bg-white shadow-lg print:shadow-none">
              <img 
                src="/cv-photo.jpg" 
                alt="Ibrahim Matche Cissé" 
                className="w-full h-full object-cover"
                style={{ objectPosition: "center 10%", transform: "scale(1.5)" }}
              />
            </div>

            <div className="relative z-10 mt-32 print:mt-24 pb-12 print:pb-2 flex flex-col gap-10 print:gap-4">
              
              {/* CONTACT */}
              <div className="px-8 print:px-4">
                <div className="flex items-center gap-3 mb-6 print:mb-3">
                  <div className="w-1.5 h-5 print:h-4 bg-accent rounded-full"></div>
                  <User className="w-5 h-5 print:w-4 print:h-4 text-accent" />
                  <h3 className="font-bold tracking-widest text-sm print:text-xs uppercase text-white">Contact</h3>
                </div>
                <ul className="space-y-4 print:space-y-4 text-xs font-medium pl-2">
                  <li className="flex gap-4 items-center relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent absolute -left-3.5"></div>
                    <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center shrink-0">
                      <Phone className="w-3 h-3" />
                    </div>
                    <span>+225 07 77 25 31 37</span>
                  </li>
                  <li className="flex gap-4 items-center relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent absolute -left-3.5"></div>
                    <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center shrink-0">
                      <Mail className="w-3 h-3 text-white" />
                    </div>
                    <span className="break-all">cissei931brahim@gmail.com</span>
                  </li>
                  <li className="flex gap-4 items-center relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent absolute -left-3.5"></div>
                    <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center shrink-0">
                      <MapPin className="w-3 h-3" />
                    </div>
                    <span>Abidjan, Côte d'Ivoire</span>
                  </li>
                </ul>
              </div>

              <div className="w-full px-8"><div className="w-full border-t border-gray-600/50 border-dashed"></div></div>

              {/* OUTILS */}
              <div className="px-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-5 bg-accent rounded-full"></div>
                  <ToolIcon className="w-5 h-5 text-accent" />
                  <h3 className="font-bold tracking-widest text-sm uppercase text-white">Outils</h3>
                </div>
                <ul className="space-y-3 text-xs pl-2 font-medium">
                  {["Revit", "Autocad", "Word", "Permis de conduire"].map((tool) => (
                    <li key={tool} className="flex gap-4 items-center relative">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent absolute -left-3.5"></div>
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full px-8"><div className="w-full border-t border-gray-600/50 border-dashed"></div></div>

              {/* LANGUES */}
              <div className="px-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-5 bg-accent rounded-full"></div>
                  <Languages className="w-5 h-5 text-accent" />
                  <h3 className="font-bold tracking-widest text-sm uppercase text-white">Langues</h3>
                </div>
                <ul className="space-y-4 text-xs pl-2">
                  <li className="flex gap-4 items-start relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent absolute -left-3.5 top-1.5"></div>
                    <div>
                      <span className="font-bold uppercase tracking-wider block mb-0.5">Français</span>
                      <span className="text-gray-400 italic">Lu, parlé et écrit</span>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent absolute -left-3.5 top-1.5"></div>
                    <div>
                      <span className="font-bold uppercase tracking-wider block mb-0.5">Anglais</span>
                      <span className="text-gray-400 italic">Moyen</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="w-full px-8"><div className="w-full border-t border-gray-600/50 border-dashed"></div></div>

              {/* CENTRES D'INTÉRÊT */}
              <div className="px-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-5 bg-accent rounded-full"></div>
                  <Heart className="w-5 h-5 text-accent" />
                  <h3 className="font-bold tracking-widest text-sm uppercase text-white">Centres d'intérêt</h3>
                </div>
                <ul className="space-y-3 text-xs pl-2 font-medium">
                  <li className="flex gap-4 items-center relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent absolute -left-3.5"></div>
                    <span>SPORT : <span className="text-gray-400 font-normal italic">Football</span></span>
                  </li>
                  <li className="flex gap-4 items-center relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent absolute -left-3.5"></div>
                    <span>COUTURE</span>
                  </li>
                  <li className="flex gap-4 items-center relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent absolute -left-3.5"></div>
                    <span>LECTURE</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* RIGHT MAIN CONTENT */}
          <div className="w-full md:w-[65%] print:w-[65%] bg-white relative py-12 print:py-4">
            
            {/* The continuous vertical line */}
            <div className="absolute left-10 md:left-14 top-0 bottom-0 w-px bg-gray-300"></div>

            {/* HEADER NAME */}
            <div className="relative pl-24 md:pl-32 py-10 print:py-4 mb-12 print:mb-4">
              {/* Gray background extending right */}
              <div className="absolute left-10 md:left-14 top-0 bottom-0 right-0 bg-gray-100/80"></div>
              {/* Accent bar on the line */}
              <div className="absolute left-[39px] md:left-[55px] top-1/2 -translate-y-1/2 w-1.5 h-16 print:h-10 bg-accent"></div>
              
              <div className="relative z-10">
                <h1 className="text-3xl md:text-5xl font-black uppercase text-gray-800 tracking-tight leading-tight">
                  Cissé Ibrahim <br/><span className="text-accent">Matche</span>
                </h1>
                <h2 className="text-gray-500 uppercase tracking-widest text-xs mt-3 font-semibold">
                  Technicien Supérieur en Génie Civil (Option : Bâtiment)
                </h2>
              </div>
            </div>

            <div className="space-y-12 print:space-y-4 pb-12 print:pb-0">
              
              {/* À PROPOS DE MOI */}
              <section>
                <div className="relative pl-24 md:pl-32 mb-6 print:mb-3">
                  {/* Icon on the line */}
                  <div className="absolute left-[28px] md:left-[44px] top-1/2 -translate-y-1/2 w-6 h-6 print:w-5 print:h-5 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-white">
                    <User className="w-3 h-3 print:w-2.5 print:h-2.5" />
                  </div>
                  <h3 className="text-lg print:text-sm font-black uppercase tracking-widest text-gray-800">À Propos De Moi</h3>
                </div>
                <div className="relative pl-24 md:pl-32 pr-12 text-gray-600 text-sm leading-relaxed print:leading-normal text-justify">
                  <p>
                    Je suis né le <strong>10/09/2000</strong> à Odienné.<br/>
                    Je suis célibataire et sans enfant. Polyvalent et très motivé, je suis prêt à mettre en pratique mes compétences techniques en suivi de chantier et métré pour contribuer au succès de vos projets de construction.
                  </p>
                </div>
              </section>

              {/* EXPÉRIENCES PROFESSIONNELLES */}
              <section>
                <div className="relative pl-24 md:pl-32 mb-8 print:mb-3">
                  <div className="absolute left-[28px] md:left-[44px] top-1/2 -translate-y-1/2 w-6 h-6 print:w-5 print:h-5 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-white">
                    <Briefcase className="w-3 h-3 print:w-2.5 print:h-2.5" />
                  </div>
                  <h3 className="text-lg print:text-sm font-black uppercase tracking-widest text-gray-800">Expériences Pro.</h3>
                </div>
                
                <div className="space-y-8 print:space-y-3">
                  {/* Exp 1 */}
                  <div className="relative pl-24 md:pl-32 pr-12">
                    <div className="absolute left-[37px] md:left-[53px] top-1.5 print:top-1 w-2 h-2 rounded-full bg-accent ring-4 print:ring-2 ring-white"></div>
                    <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                      <h4 className="font-bold text-gray-800 uppercase text-sm">Métreur</h4>
                      <span className="font-bold text-gray-800 text-xs shrink-0">2023 - Présent</span>
                    </div>
                    <div className="text-primary text-xs font-bold mb-2 italic">YAPGI CONSTRUCTION</div>
                    <p className="text-gray-500 text-xs leading-relaxed print:leading-normal">
                      Métreur dans l'entreprise. Réalisation de devis, quantitatifs et estimatifs des matériaux nécessaires à la réalisation de différents projets de construction.
                    </p>
                  </div>

                  {/* Exp 2 */}
                  <div className="relative pl-24 md:pl-32 pr-12">
                    <div className="absolute left-[37px] md:left-[53px] top-1.5 print:top-1 w-2 h-2 rounded-full bg-accent ring-4 print:ring-2 ring-white"></div>
                    <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                      <h4 className="font-bold text-gray-800 uppercase text-sm">Stagiaire Suivi et Contrôle</h4>
                      <span className="font-bold text-gray-800 text-xs shrink-0">6 Mois</span>
                    </div>
                    <div className="text-primary text-xs font-bold mb-2 italic">HOUSE CARE INTERNATIONAL</div>
                    <p className="text-gray-500 text-xs leading-relaxed print:leading-normal">
                      Suivi et contrôle des travaux sur le chantier. Jeune qualifié & diplômée. Survie et contrôle de la fondation de trois (3) villa duplex et un immeuble R+3 à SONGON.
                    </p>
                  </div>
                  
                  {/* Exp 3 */}
                  <div className="relative pl-24 md:pl-32 pr-12">
                    <div className="absolute left-[37px] md:left-[53px] top-1.5 print:top-1 w-2 h-2 rounded-full bg-accent ring-4 print:ring-2 ring-white"></div>
                    <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                      <h4 className="font-bold text-gray-800 uppercase text-sm">Attestation Stratégie Marketing</h4>
                      <span className="font-bold text-gray-800 text-xs shrink-0"></span>
                    </div>
                    <div className="text-primary text-xs font-bold mb-2 italic">3B CONSEILS & MANAGEMENT</div>
                    <p className="text-gray-500 text-xs leading-relaxed print:leading-normal">
                      Une attestation délivrée en stratégie marketing par le cabinet.
                    </p>
                  </div>
                </div>
              </section>

              {/* EDUCATION */}
              <section>
                <div className="relative pl-24 md:pl-32 mb-8 print:mb-3">
                  <div className="absolute left-[28px] md:left-[44px] top-1/2 -translate-y-1/2 w-6 h-6 print:w-5 print:h-5 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-white">
                    <GraduationCap className="w-3 h-3 print:w-2.5 print:h-2.5" />
                  </div>
                  <h3 className="text-lg print:text-sm font-black uppercase tracking-widest text-gray-800">Formations</h3>
                </div>
                
                <div className="space-y-6 print:space-y-2">
                  {/* Edu 1 */}
                  <div className="relative pl-24 md:pl-32 pr-12">
                    <div className="absolute left-[37px] md:left-[53px] top-1.5 print:top-1 w-2 h-2 rounded-full bg-accent ring-4 print:ring-2 ring-white"></div>
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-bold text-gray-800 uppercase text-sm">Brevet de Technicien Supérieur (BTS)</h4>
                      <span className="font-bold text-gray-800 text-xs shrink-0">2021 - 2022</span>
                    </div>
                    <div className="text-primary text-xs font-bold mb-1 italic">Groupe Loko</div>
                  </div>

                  {/* Edu 2 */}
                  <div className="relative pl-24 md:pl-32 pr-12">
                    <div className="absolute left-[37px] md:left-[53px] top-1.5 print:top-1 w-2 h-2 rounded-full bg-accent ring-4 print:ring-2 ring-white"></div>
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-bold text-gray-800 uppercase text-sm">Baccalauréat (BAC)</h4>
                      <span className="font-bold text-gray-800 text-xs shrink-0">2019 - 2020</span>
                    </div>
                    <div className="text-primary text-xs font-bold mb-1 italic">Lycée Moderne 1 Odienné</div>
                  </div>

                  {/* Edu 3 */}
                  <div className="relative pl-24 md:pl-32 pr-12">
                    <div className="absolute left-[37px] md:left-[53px] top-1.5 print:top-1 w-2 h-2 rounded-full bg-accent ring-4 print:ring-2 ring-white"></div>
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-bold text-gray-800 uppercase text-sm">BEPC</h4>
                      <span className="font-bold text-gray-800 text-xs shrink-0">2016 - 2017</span>
                    </div>
                    <div className="text-primary text-xs font-bold mb-1 italic">Lycée Moderne 2 Odienné</div>
                  </div>
                </div>
              </section>

              {/* SKILLS */}
              <section>
                <div className="relative pl-24 md:pl-32 mb-8 print:mb-3">
                  <div className="absolute left-[28px] md:left-[44px] top-1/2 -translate-y-1/2 w-6 h-6 print:w-5 print:h-5 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-white">
                    <Wrench className="w-3 h-3 print:w-2.5 print:h-2.5" />
                  </div>
                  <h3 className="text-lg print:text-sm font-black uppercase tracking-widest text-gray-800">Compétences</h3>
                </div>
                
                <div className="relative pl-24 md:pl-32 pr-12 grid grid-cols-1 md:grid-cols-2 print:grid-cols-1 gap-x-8 gap-y-6 print:gap-y-5">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-gray-800 mb-1.5 tracking-wider">
                      <span>TRAVAIL D'ÉQUIPE</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-gray-800 mb-1.5 tracking-wider">
                      <span>OUVERT D'ESPRIT</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-gray-800 mb-1.5 tracking-wider">
                      <span>TRAVAIL SOUS PRESSION</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: '80%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-gray-800 mb-1.5 tracking-wider">
                      <span>PONCTUALITÉ</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
