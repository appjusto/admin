import {useState, useEffect } from 'react';

const useSharingUrlMsg = () => {
  const [mainUrl, setMainUrl] = useState("")
  const [sharingMsg, setSharingMsg] = useState("")
  useEffect(() => {
    let url = "https://app-justo-site.web.app/"
    if(process.env.NODE_ENV === "production") {
      const newUrl = window.location.href
      const main = newUrl.split("//")[1].split("/")[0]
      url = `https://${main}`
    }
    //const message = encodeURIComponent(`Oi! O AppJusto é um movimento para construir uma plataforma de delivery mais justa para todos.\n\nJá fiz o pré-cadastro. Faça você também em ${url}.\n\nQuanto mais gente ajudar a divulgar, mais rápido o app chegará na sua região!`)
    const message = encodeURIComponent(`AppJusto. Mais do que um app de entregas. Somo um movimento por relações mais justas e transparentes. Faça parte agora!\n\n${url}`);
    setMainUrl(url)
    setSharingMsg(message)
  }, [])
  return { mainUrl, sharingMsg }
}

export default useSharingUrlMsg;
