function setParams(values) {//expects a list of {"param","value"} objects
  window.history.pushState({}, "", window.location.pathname);//clear previous search params first
  for (let i = 0; i < values.length; i++) {
    const params = new URLSearchParams(window.location.search);
    const p = values[i]
    params.set(p["p"],p["v"]); // change or add
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  }
  updateMainPage()
}
//data used for the whole page
const params = new URLSearchParams(window.location.search);
const projectData=JSON.parse(params.get("projectData"))
//create the back button
const backButton=document.createElement('button');
backButton.className="stylise";
backButton.textContent="Back"
backButton.onclick=()=>{
    const currentCategory = params.get("type");
    const backParams=new URLSearchParams()
    backParams.set('category',currentCategory)
    window.location.href = `project_list.html?${backParams.toString()}`;
}
//create the button to go to the repo
const repoButton=document.createElement('button');
repoButton.className="stylise";
repoButton.textContent="GitHub repository"
repoButton.onclick=()=>{
    window.location.href = projectData.repo_link;
}
document.getElementById("header-bar").appendChild(backButton)
document.getElementById("header-bar").appendChild(repoButton)
//buttons with special functionality
if (Object.keys(projectData).includes("parseType")){
    //For turbowarp extensions only
    if (projectData.parseType=="ext"){
        //copy extension JS to clipboard
        const extJSbutton=document.createElement('button');
        extJSbutton.className="stylise";
        extJSbutton.textContent="Copy extension JS to clipboard"
        extJSbutton.onclick = async () => {
            try {
                const src = await copyJSsrc(projectData.js_src_link);
                await navigator.clipboard.writeText(src);
                console.log("extension SRC copied");
            } catch (err) {
                console.error("copy failed:", err);
            }
        };
        document.getElementById("header-bar").appendChild(extJSbutton)
    }
}
document.getElementById("text").textContent=projectData.name
//readme description from URL
async function getReadmeContainer(readmeURL){
    try {
        console.log(readmeURL)
        const container = document.createElement("div");
        const resp = await fetch(readmeURL);
        if (resp.ok) {
        const mdText = await resp.text();
        container.innerHTML = DOMPurify.sanitize(marked.parse(mdText));
    } else {
        container.textContent="error:README not found"
    }
    container.style.margin="0"
    container.style.padding="0"
    return(container)
    } catch (err) {
        console.warn("Error fetching README: ", err);
    }
}
getReadmeContainer(projectData.readme_link).then(container=>{
    document.getElementById("body").appendChild(container)
})
async function copyJSsrc(srcURL){
    try {
        const resp = await fetch(srcURL);
        let copiedSRC="error:JS not found"
        if (resp.ok) {
        copiedSRC = await resp.text();
    } else {
        copiedSRC="error in coping JS"
    };
    return copiedSRC;

    } catch (err) {
        console.warn("Error fetching README: ", err);
    }
}