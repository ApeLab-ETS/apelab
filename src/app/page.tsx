import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Festa in primo piano */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 text-center">
        <p className="font-medium">🎉 Prossimo evento: <span className="font-bold">AperiTech Summer Edition</span> - 15 Luglio 2024</p>
      </div>
      
      <header className="container mx-auto px-4 py-16 md:py-20">
        {/* Card evento in evidenza */}
        <div className="max-w-4xl mx-auto mb-16 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 bg-blue-600">
              <div className="h-64 md:h-full bg-blue-600 bg-opacity-90 flex items-center justify-center p-8">
                <div className="text-center text-white">
                  <div className="text-5xl mb-2">📅</div>
                  <h3 className="text-2xl font-bold mb-1">15 Luglio</h3>
                  <p className="text-lg font-medium">ore 19:00</p>
                  <div className="mt-6 bg-white bg-opacity-20 rounded-full py-2 px-4 inline-block">
                    <p className="text-sm font-semibold">Milano, Navigli</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-3/5 p-8">
              <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">Evento in evidenza</div>
              <h2 className="text-3xl font-extrabold tracking-tight mt-1 mb-3">AperiTech Summer Edition</h2>
              <p className="text-slate-600 mb-6">
                Unisciti a noi per una serata all'insegna della tecnologia e del networking in un'atmosfera 
                rilassata ai Navigli. Aperitivo incluso e possibilità di conoscere professionisti del settore.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Networking</span>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Tech</span>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Aperitivo</span>
              </div>
              <a href="/eventi/aperitech-summer" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all">
                Scopri di più
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
            <span className="text-blue-600">Apelab</span>, dove la tecnologia incontra la convivialità
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-10">
            Una no profit dedicata alla creazione di eventi che uniscono networking, 
            tecnologia e momenti di condivisione in un ambiente rilassato e stimolante.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/login"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-all"
            >
              Accedi
            </a>
            <a
              href="/eventi"
              className="px-8 py-3 bg-white text-blue-600 font-medium border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 transition-all"
            >
              Scopri gli eventi
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Chi siamo */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-6 text-slate-900">
            Chi Siamo
          </h2>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="md:w-1/2">
                <p className="text-lg text-slate-700 mb-4">
                  <span className="font-semibold text-blue-600">Apelab</span> è nata nel 2020 con un'idea semplice: creare un punto d'incontro tra professionisti del tech che vogliono conoscersi in un contesto informale e stimolante.
                </p>
                <p className="text-lg text-slate-700 mb-4">
                  La nostra missione è promuovere la cultura tecnologica attraverso eventi che favoriscono lo scambio di idee e la creazione di una community solida e inclusiva.
                </p>
                <p className="text-lg text-slate-700">
                  Organizziamo regolarmente aperitivi tech, workshop e serate a tema in diverse città italiane, mettendo sempre al centro le persone e le loro storie.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="rounded-xl overflow-hidden h-64 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center p-6">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-3">I nostri numeri</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-4xl font-extrabold">42+</div>
                        <div className="text-sm font-medium">Eventi organizzati</div>
                      </div>
                      <div>
                        <div className="text-4xl font-extrabold">1200+</div>
                        <div className="text-sm font-medium">Partecipanti</div>
                      </div>
                      <div>
                        <div className="text-4xl font-extrabold">8</div>
                        <div className="text-sm font-medium">Città italiane</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          
        {/* Tipi di eventi */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            I nostri eventi
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                🍹
              </div>
              <h3 className="text-xl font-semibold mb-2">AperiTech</h3>
              <p className="text-slate-600">
                Aperitivi informali dove tecnologia e networking si fondono in un'atmosfera rilassata e stimolante.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                👨‍💻
              </div>
              <h3 className="text-xl font-semibold mb-2">Tech Talks</h3>
              <p className="text-slate-600">
                Presentazioni e discussioni su temi tecnologici d'attualità con esperti del settore.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                🧩
              </div>
              <h3 className="text-xl font-semibold mb-2">Hackathon</h3>
              <p className="text-slate-600">
                Eventi competitivi dove team di sviluppatori collaborano per creare soluzioni innovative.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white">Apelab</h2>
              <p className="text-slate-400 mt-2">Tecnologia, networking e convivialità</p>
            </div>
            
            <div className="flex gap-6">
              <a href="/chi-siamo" className="text-slate-300 hover:text-white">Chi siamo</a>
              <a href="/eventi" className="text-slate-300 hover:text-white">Eventi</a>
              <a href="/contatti" className="text-slate-300 hover:text-white">Contatti</a>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} Apelab. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
