
//let config = editJsonFile(`${__dirname}/assets/data/config.json`);

if(config.get("theme") == "dark"){
  document.body.setAttribute('data-theme', 'dark');
} else {
  document.body.removeAttribute('data-theme');
}