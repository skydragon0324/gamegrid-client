const loadComplyCubeScript = (src: string, id: string) => {
  const script = document.createElement("script");
  script.src = src;
  script.id = id;
  document.body.appendChild(script);
};

export default loadComplyCubeScript;
