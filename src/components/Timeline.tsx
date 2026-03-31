const timelineData = [
  {
    year: "1930",
    title: "El nacimiento del sueño en Uruguay",
    description: "La primera edición se llevó a cabo en Uruguay, país elegido por ser el vigente campeón olímpico. El 30 de julio de 1930, en el Estadio Centenario, el anfitrión derrotó a Argentina 4-2. Figuras como el capitán uruguayo José Nasazzi y el delantero Héctor Castro (conocido como \"el Divino Manco\") pasaron a la posteridad como los primeros campeones mundiales bajo la gestión del presidente de la FIFA, Jules Rimet."
  },
  {
    year: "1950",
    title: "El estruendo del \"Maracanazo\"",
    description: "Tras el parón por la Segunda Guerra Mundial, el torneo regresó en Brasil. El 16 de julio de 1950, ante casi 200,000 personas en el Estadio Maracaná, ocurrió la mayor sorpresa de la historia: Uruguay venció 2-1 a Brasil en el partido decisivo. El capitán uruguayo Obdulio Varela fue el líder psicológico del equipo, mientras que Alcides Ghiggia anotó el gol del triunfo, silenciando a toda una nación que ya celebraba el título."
  },
  {
    year: "1954",
    title: "El Milagro de Berna",
    description: "En la final de Suiza 1954, la \"Poderosa Hungría\" de Ferenc Puskás, que llevaba 33 partidos invicta, se enfrentó a Alemania Federal. A pesar de que los húngaros empezaron ganando 2-0, los alemanes, liderados por su capitán Fritz Walter y con dos goles de Helmut Rahn, remontaron para ganar 3-2. Este suceso es recordado como un símbolo de la reconstrucción alemana tras la guerra."
  },
  {
    year: "1958",
    title: "El surgimiento del Rey Pelé",
    description: "El Mundial de Suecia 1958 marcó el debut de un joven de 17 años llamado Edson Arantes do Nascimento, \"Pelé\". Junto a figuras como Garrincha y el capitán Bellini, Pelé guio a Brasil a su primer título mundial tras vencer al anfitrión 5-2 en la final del 29 de junio. Fue la primera vez que un país americano ganaba un Mundial en suelo europeo."
  },
  {
    year: "1970",
    title: "La consagración del \"Fútbol Arte\"",
    description: "México 1970 es considerado por muchos como el mejor mundial de la historia. El 21 de junio, el Brasil de Pelé, Tostão, Jairzinho y Carlos Alberto derrotó a Italia 4-1 en la final. Este torneo marcó el adiós de Pelé de las copas del mundo (siendo el único jugador con tres títulos) y fue el primero en ser transmitido a color, mostrando al mundo la perfección del juego colectivo brasileño."
  },
  {
    year: "1974",
    title: "El Fútbol Total de la \"Naranja Mecánica\"",
    description: "Aunque no ganaron la final, la selección de los Países Bajos en Alemania 1974 revolucionó el deporte. Liderados por Johan Cruyff y el técnico Rinus Michels, implementaron el \"fútbol total\", donde ningún jugador tenía una posición fija. Sin embargo, en la final del 7 de julio, la Alemania Federal de Franz Beckenbauer y el goleador Gerd Müller se impuso 2-1, demostrando una eficacia defensiva y mental superior."
  },
  {
    year: "1986",
    title: "La mano de Dios y el Gol del Siglo",
    description: "En México 1986, Diego Armando Maradona protagonizó los dos goles más famosos de la historia en un mismo partido contra Inglaterra, el 22 de junio. Primero, \"La mano de Dios\", un gol anotado con el puño, y minutos después, el \"Gol del Siglo\", donde regateó a media selección inglesa. Argentina terminaría venciendo a Alemania 3-2 en la final, con Maradona elevándose como el máximo ícono del fútbol mundial."
  },
  {
    year: "1994",
    title: "El primer drama de los penales en una final",
    description: "En el Mundial de Estados Unidos 1994, por primera vez una final se decidió en tanda de penaltis tras un empate 0-0 entre Brasil e Italia. El 17 de julio, el astro italiano Roberto Baggio, que había sido la figura del torneo, falló el último disparo enviando el balón por encima del travesaño. Esto le otorgó a Brasil su tetracampeonato, de la mano de Romário y el capitán Dunga."
  },
  {
    year: "2014",
    title: "El histórico 7-1 (Mineirazo)",
    description: "Durante el Mundial de Brasil 2014, se vivió un resultado que rompió todos los esquemas lógicos del fútbol moderno. En las semifinales del 8 de julio, Alemania humilló al anfitrión Brasil con un marcador de 7-1. Jugadores como Thomas Müller, Toni Kroos y Miroslav Klose (quien se convirtió ese día en el máximo goleador histórico de los mundiales) fueron los verdugos de una selección brasileña que colapsó sin su estrella Neymar."
  },
  {
    year: "2022",
    title: "La gloria eterna de Messi en Qatar",
    description: "La final de Qatar 2022, disputada el 18 de diciembre, es citada frecuentemente como la mejor de todos los tiempos. Argentina y Francia empataron 3-3 en un duelo épico entre Lionel Messi (que anotó dos goles) y Kylian Mbappé (que marcó un hat-trick). Tras una tanda de penaltis perfecta y una atajada histórica de Emiliano \"Dibu\" Martínez, Argentina consiguió su tercera estrella, permitiendo que Messi finalmente levantara el trofeo que le faltaba a su legendaria carrera."
  }
];

export function Timeline() {
  return (
    <div className="px-6 my-10 relative max-w-2xl mx-auto">
      <div className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-8 text-center bg-white/50 backdrop-blur-xs py-2 rounded-full border border-gray-200/50 shadow-xs inline-block mx-auto w-[calc(100%-2rem)] max-w-sm absolute -top-4 z-10 left-1/2 transform -translate-x-1/2 opacity-0 pointer-events-none">Hitos de los Mundiales</div>
      
      <div className="flex items-center justify-center mb-8">
        <div className="h-px bg-linear-to-r from-transparent via-wc-red/50 to-transparent flex-1"></div>
        <h2 className="text-lg font-black text-wc-dark-bg uppercase tracking-widest px-4 text-center">Hitos Históricos</h2>
        <div className="h-px bg-linear-to-r from-wc-red/50 via-wc-red/50 to-transparent flex-1"></div>
      </div>

      <div className="relative border-l-4 border-wc-red/20 ml-3 md:ml-8 space-y-8 pb-8 pt-4 mix-blend-multiply">
        {timelineData.map((event) => (
          <div key={event.year} className="relative pl-8 md:pl-10 group">
            {/* Indicador con micro-animación */}
            <div className="absolute -left-[14px] top-1.5 w-6 h-6 rounded-full bg-wc-gold border-4 border-white shadow-[0_0_10px_rgba(255,215,0,0.5)] group-hover:scale-125 group-hover:bg-wc-red group-hover:border-wc-light-bg group-hover:shadow-[0_0_15px_rgba(230,57,70,0.6)] transition-all duration-300 z-10" />
            
            {/* Tarjeta de evento */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-400 relative overflow-hidden">
                
              {/* Decoración de la tarjeta */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-wc-red/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                <span className="text-3xl font-black text-wc-red tracking-tighter drop-shadow-xs shrink-0">{event.year}</span>
                <div className="hidden md:block h-1.5 w-1.5 rounded-full bg-gray-300 shrink-0"></div>
                <h3 className="font-extrabold text-gray-800 text-base leading-tight drop-shadow-xs">{event.title}</h3>
              </div>
              
              <p className="text-gray-600 text-sm md:text-base leading-relaxed group-hover:text-gray-900 transition-colors duration-300 font-medium">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
