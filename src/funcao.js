import React, { useState, useEffect } from "react";
//resolvi usar a biblioteca axios pois o objeto fetch nao era suportado por certos navegadores antigos
import { createClient } from "@supabase/supabase-js";

function GetLocation() {
  //use state é uma função que registra e atualiza o estado do componente, nesse caso o GetLocation()
  // a location é o valor, e o setLocation é a função que muda ese valor
  const [location, setLocation] = useState({});
  const [hasRun, setHasRun] = useState(false);

  //Essa função permita que eu execute alguma logica toda vez que um prop ou estado do componente mude
  useEffect(() => {
    // o objeto navigator é um objeto global que forcene informações sobre o navegador, que nesse caso
    // serão usadas para o pwa
    navigator.geolocation.getCurrentPosition(
      //na primeira execução dessa função, é requisitado ao usuário a permissão para o navegador (pwa)
      // ver a localização dele

      //essa função é executada caso a coordenada seja recebida com sucesso
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },

      //essa função é executada caso aconteça algum erro com a aquisição da coordenada
      //caso necessário, podemos mostrar alguma informação para o usuário de acordo com o erro
      (error) => {
        switch (error.code) {
          case 1:
            // dificilmente o navegador não suporta geolozalição, então na maioria das vezes vai ser
            // o usuario negando a permissão
            console.log(error);
            break;
          case 2:
            //como estamos trabalhando com um pwa e geralemnte a localização depende da internet, é possivel
            // que caso o usuário esteja sem internet ocorra um erro e caia nesse caso.
            console.log(error);
            break;
          case 3:
            //um timeout padrao
            console.log(error);
            break;
          default:
            console.log(error);
            break;
        }
      },
      //podemos diminuir ou aumentar a precisão da localização mudando o valor de enableHighAcurracy
      // caso necessario, modifique o maximumAge, isso permite que a geolocalização seja usada por mais tempo
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    //caso necessário, podemos colocar algum prop ou estado dentro dos colchetes []
    // para o componente executar a sua função useEffect novamente, geralmente para renderizar
    // com dados novos
  }, []);
  if (location.latitude !== undefined) {
    if (!hasRun) {
      const sendDataToServer = async () => {
        try {
          const supabase = createClient(
            "https://hyziqtsgbwyzmpxphdov.supabase.co",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5emlxdHNnYnd5em1weHBoZG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzUxMTEwNzEsImV4cCI6MTk5MDY4NzA3MX0.TA8vKLK-CgqzQyIVH6DiquPQgbzVwBqZZQ7YVlXnyic"
          );
          const { error } = await supabase
            .from("countries")
            .insert({ x: location.latitude, y: location.longitude });
          console.log(error);
        } catch (error) {
          console.error(error);
        }
      };
      sendDataToServer();
      setHasRun(true);
    }
  }

  return (
    <div className="GeoLocation">
      Latitude: {location.latitude} Longitude: {location.longitude}
    </div>
  );
}

export default GetLocation;
