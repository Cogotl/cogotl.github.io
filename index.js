const categoriesDiv = document.getElementById("mini-category-list");


async function loadJSON(path) {
	const response = await fetch(`${path}.json`);
	const data = await response.json();
	return data;
}


loadJSON("projects").then(projects => {
    function createCategoryButton(category) {//category header tag
        const newButton = document.createElement("button");
        newButton.className = "stylise";
        newButton.classList.add("category-list-entry")
        newButton.textContent = projects[category].display_name;
        newButton.onclick = () => {
            const params = new URLSearchParams();
            params.set("category",category)
            window.location.href = `project_list.html?${params.toString()}`;
        };
        categoriesDiv.appendChild(newButton);
    }
    Object.keys(projects).forEach(category => {
        createCategoryButton(category)
        
    });
});