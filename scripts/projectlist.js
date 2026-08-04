const categoriesDiv = document.getElementById("category-list");
const projectListDiv = document.getElementById("project-list")
const displayText = document.getElementById("text");

async function loadJSON(path) {
	const response = await fetch(`${path}.json`);
	const data = await response.json();
	return data;
}
function setParams(searchParamObject,values){
    values.forEach(value=>{
        searchParamObject.set(value.key,value.value)
    })
    return searchParamObject
}


loadJSON("projects").then(projects => {
	console.log(projects);
    function createProjectListEntry(data){//create a new button that links to a project
        const newButton=document.createElement("button")
        const headerText=document.createElement("h2")
        headerText.textContent=data.name
        headerText.className="entry-text"
        newButton.appendChild(headerText)
        if (data.description){
            const description=document.createElement("p")
            description.textContent=data.description
            description.className="entry-text"
            newButton.appendChild(description)
        }
        newButton.onclick=()=>{
        const params = new URLSearchParams(window.location.search);
		const currentCategory = params.get("category");    
        window.location.href = `project_page.html?${setParams(new URLSearchParams(),[{"key":"type","value":currentCategory},{"key":"projectData","value":JSON.stringify(data)}]).toString()}`;

        }
        newButton.className="project-list-entry"
        projectListDiv.appendChild(newButton)
    }
    function fillProjectList(entries){
        console.log(`Filling with entries:\n ${JSON.stringify(entries)}`)
        entries.forEach(entry=>{
            createProjectListEntry(entry)
        })
    }
    function updateProjectList(){
        console.log('populating project list!')
        projectListDiv.innerHTML=""
        const params = new URLSearchParams(window.location.search);
		const currentCategory = params.get("category");
        if (Object.keys(projects).includes(currentCategory)){
            console.log(`Seaching for category with ID ${currentCategory}`)
            fillProjectList(projects[currentCategory].projects)
            return;
        }
        console.log('populating project lsit with entries from all categories')
        let collated=[]
        Object.keys(projects).forEach(category=>{
            collated=collated.concat(projects[category].projects)
        })
        fillProjectList(collated)

    }
    function createCategoryButton(data, id) {//category header tag
        const newButton = document.createElement("button");
        newButton.className = "stylise";
        newButton.classList.add("category-list-entry")
        newButton.textContent = data.display_name;
        newButton.onclick = () => {
            const params = new URLSearchParams(window.location.search);
            const currentCategory = params.get("category");
            if (currentCategory==id){
                params.delete("category");
                history.pushState({}, "", `?${params.toString()}`);
            }else{
                params.set("category", id);
                history.pushState({}, "", `?${params.toString()}`);
                updateProjectList();
            }
        };
        categoriesDiv.appendChild(newButton);
    }
	function renderScreen() {
		const params = new URLSearchParams(window.location.search);
		const currentCategory = params.get("category");
        
		if (currentCategory) {
            const currentCategoryName=currentCategory!="everything"?projects[currentCategory].display_name:"everything"
            if (currentCategory!= "everything") {
                displayText.textContent = `${currentCategoryName} made by me:`;
            }else{
                displayText.textContent = `Basically everything made by me:`;
            }
            categoriesDiv.querySelectorAll("button").forEach(button=>{
                if (button.textContent==(currentCategoryName)){
                    if (!button.classList.contains("selected")){
                        button.classList.add("selected")
                    }
                    
                }else{
                    button.classList.remove("selected")
                }
            })
			
		} else {
			params.set("category", "everything");
            history.pushState({}, "", `?${params.toString()}`);
            updateProjectList();
		}
        requestAnimationFrame(renderScreen)
	}
	requestAnimationFrame(renderScreen)
	categoriesDiv.innerHTML = "";
    const backButton=document.createElement('button');
    backButton.className="stylise";
    backButton.textContent="Back"
    backButton.onclick=()=>{
        window.location.href = `index.html`;
    }
    categoriesDiv.appendChild(backButton)
	Object.keys(projects).forEach(projectID => {
		createCategoryButton(projects[projectID], projectID);
	});
    updateProjectList();
});