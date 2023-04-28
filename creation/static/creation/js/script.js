let delete_category = (element, data) => {
    const csrf = document.querySelector("[name=csrfmiddlewaretoken]").value;
    fetch("/delete_category/", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrf,
        },
        body: data,
    }).then((response) => {
        return;
    }).then(() => {
        element.remove();
    }).catch((error) => {
        alert.log(error);
    })
}

document.querySelector(".create-category").addEventListener("click", () => {
    const category = document.querySelector(".new-category").value;
    if (category == "") {
        return;
    }
    console.log(category)
    const csrf = document.querySelector("[name=csrfmiddlewaretoken]").value;

    let data = new FormData()
    data.append("category", category);
    console.log(data)
    fetch("/create_category/", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrf,
        },
        body: data,

    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        let newCategory = document.createElement("div");
        newCategory.classList = `category`;
        let name = document.createElement("p");
        name.classList = "category-name";
        name.innerHTML = data.name;
        let deleteButton = document.createElement("button");
        deleteButton.addEventListener("click", () => {
            data_id = new FormData()
            data_id.append("id", data.id)
            delete_category(newCategory, data_id);
        })
        deleteButton.classList = "remove-category";
        let deleteIcon = document.createElement("i");
        deleteIcon.classList = "fas fa-times";
        deleteButton.appendChild(deleteIcon);
        newCategory.appendChild(name);
        newCategory.appendChild(deleteButton);
        document.querySelector(".categorys").appendChild(newCategory);
        let option = document.createElement("option");
        option.value = data.id;
        option.innerHTML = data.name;
        document.querySelector(".todo-category").appendChild(option);
        document.querySelector(".new-category").value = "";
    }).catch((error) => {
        alert.log(error);
    })
})

document.querySelectorAll(".category").forEach((category) => {
    category.childNodes[3].addEventListener("click", () => {
        const id = category.classList[1];
        let data = new FormData()
        data.append("id", id);
        delete_category(category, data);

    })
})

document.querySelector(".create-todo").addEventListener("click", () => {
    const todo = document.querySelector(".todo-title");
    const description = document.querySelector(".todo-description");
    const date = document.querySelector(".todo-date");
    const category = document.querySelector(".todo-category");
    const csrf = document.querySelector("[name=csrfmiddlewaretoken]").value;
    if (todo.value == "" || date.value == "" || category.value == "") {
        return;
    }
    let data = new FormData()
    data.append("title", todo.value);
    data.append("description", description.value);
    data.append("date", date.value);
    data.append("category", category.value);
    fetch("/create_todo/", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrf,
        },
        body: data,
    }).then((response) => {
        return response.json();
    }
    ).then((data) => {
        todo.value = "";
        description.value = "";
        date.value = "";
        category.value = "";
        alert("Todo created");
    }).catch((error) => {
        alert(error);
    })
})