// Re-adicionar funcões dos botões após a edição de um todo

const convert_date_to_back = (date) => {
    return date.split("/").reverse().join("-");
}

const convert_date_to_front = (date) => {
    return date.split("-").reverse().join("/");
}
const delete_todo = (todo) => {
    todo.querySelector(".todo-footer .todo-header-icons .remove-todo").addEventListener(
        "click", () => {
            const id = todo.classList[2];
            const crsf = document.querySelector("[name=csrfmiddlewaretoken]").value;
            fetch(`/delete_todo/${id}/`, {
                method: 'POST',
                headers: {
                    "X-CSRFToken": crsf,
                },
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if (data.status == "ok") {
                    todo.remove();
                }
            })
        }
    )
}

const delete_link = (todo) => {
    todo.querySelectorAll(".todo-body .link-container .todo-link .remove-link").forEach((rm_button) => {
        rm_button.addEventListener("click", () => {
            const todo_id = todo.classList[2];
            const link_id = rm_button.parentNode.classList[1];
            const crsf = document.querySelector("[name=csrfmiddlewaretoken]").value;
            let data = new FormData();
            data.append("id", link_id);
            fetch(`/delete_link/${todo_id}/`, {
                method: 'POST',
                headers: {
                    "X-CSRFToken": crsf,
                },
                body: data,
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if (data.status == "ok") {
                    console.log(todo)
                    rm_button.parentNode.remove();
                }
            })
        })

    })
}
const add_link = (todo) => {
    todo.querySelector(".todo-body .add-link-container .send-link").addEventListener("click", () => {
        const id = todo.classList[2];
        const crsf = document.querySelector("[name=csrfmiddlewaretoken]").value;
        const link = todo.querySelector(".todo-body .add-link-container .link-input-url").value;
        const title = todo.querySelector(".todo-body .add-link-container .link-input-title").value;
        const bg = window.getComputedStyle(todo).backgroundColor;
        console.log(bg + " " + id + " " + link + " " + title)
        if (link == "" || title == "") {
            alert("Preencha todos os campos");
            return;
        }
        let data = new FormData();
        data.append("link", link);
        data.append("title", title);
        data.append("todo", id);
        data.append("bg", bg);
        fetch(`/add_link/${id}/`, {
            method: 'POST',
            headers: {
                "X-CSRFToken": crsf,
            },
            body: data,
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.status == "ok") {
                let link_container = document.createElement("div");
                const background = getRandomColor(data.bg);
                link_container.innerHTML = `
                <a href="/redirector/${data.url}" target="_blank">${data.title}</a>
                <a class="remove-link"><i class="fas fa-times"></i></a>
                `;
                link_container.style.backgroundColor = `rgb(${background.r}, ${background.g}, ${background.b})`;
                link_container.classList = `todo-link ${data.id}`;
                link_container.querySelector("a").style.color = getContrastColor(background);
                link_container.querySelector("a i").style.color = getContrastColor(background);
                todo.querySelector(".todo-body .add-link-container .link-input-url").value = "";
                todo.querySelector(".todo-body .add-link-container .link-input-title").value = "";
                todo.querySelector(".todo-body .link-container").appendChild(link_container);

                delete_link(todo);
            } else {
                alert(data.message);
            }
        }).catch((error) => {
            alert("Erro ao adicionar link");
        })
    });
}


const open_editor = (todo) => {
    todo.querySelector(".todo-footer .todo-header-icons .open-editor").addEventListener(
        "click", () => {
            const id = todo.classList[2];
            const title = todo.querySelector(".todo-header .todo-title").textContent;
            const description = todo.querySelector(".todo-body .todo-description").textContent;
            const date_to_complete = todo.querySelector(".todo-footer .date_to_complete").textContent;
            const links = todo.querySelector(".todo-body .link-container").innerHTML;
            const crsf = document.querySelector("[name=csrfmiddlewaretoken]").value;

            const header = document.createElement("div");
            header.classList.add("todo-header");
            let categories;
            fetch('/get_categories/', {
                method: 'POST',
                headers: {
                    "X-CSRFToken": crsf,
                },
            }).then((response) => {
                return response.json();
            }).then((data) => {
                categories = data;
                const category_select = document.createElement("select");
                category_select.classList.add("category-todo");
                category_select.classList.add("form-input");
                const category_todo = todo.querySelector(".todo-header .category-todo").textContent;
                categories.categories.forEach((category) => {
                    const option = document.createElement("option");
                    option.value = category.id;
                    option.innerHTML = category.name;

                    console.log(category.name, category_todo)
                    if (category.name == category_todo) {
                        option.selected = true;
                    }
                    category_select.appendChild(option);
                })
                header.innerHTML = `
                <input type="text" class="todo-title form-input" value="${title}">
                `
                header.appendChild(category_select);
                const body = document.createElement("div");
                body.classList.add("todo-body");
                body.innerHTML = `
                <textarea class="todo-description form-input" cols="30" rows="10">${description}</textarea>
                `

                const footer = document.createElement("div");
                footer.classList.add("todo-footer");
                footer.innerHTML = `
                <div class="todo-header-icons">
                    <i class="fas fa-check close-editor"></i>
                    <a class="remove-todo" href="{% url 'home:delete_todo' pk=todo.id %}">
                        <i class="fas fa-trash-alt"></i>
                    </a>
                </div>
                <input type="date" class="date_to_complete form-input" value="${convert_date_to_back(date_to_complete)}">
                `
                todo.innerHTML = ""
                todo.appendChild(header);
                todo.appendChild(body);
                todo.appendChild(footer);

                todo.querySelector(".todo-footer .todo-header-icons .close-editor").addEventListener("click", () => {
                    const title = header.querySelector(".todo-title").value;
                    const description = body.querySelector(".todo-description").value;
                    const date_to_complete = footer.querySelector(".date_to_complete").value;
                    const category = header.querySelector(".category-todo").value;

                    let data = new FormData();
                    data.append("id", id);
                    data.append("title", title);
                    data.append("description", description);
                    data.append("date_to_complete", date_to_complete);
                    data.append("category", category);

                    fetch(`/edit_todo/${id}/`, {
                        method: "POST",
                        headers: {
                            "X-CSRFToken": crsf,
                        },
                        body: data,
                    }).then((response) => {
                        return response.json();
                    }).then((data) => {
                        if (data.status == "ok") {
                            todo.innerHTML = `
                            <div class="todo-header">
                                <p class="todo-title">${data.title}</p>
                                <p class="category-todo">${data.category}</p>
                            </div>
                            <div class="todo-body">
                                <p class="todo-description">${data.description}</p>
                                <div class="link-container">
                                ${links}
                                </div>
                                <div class="add-link-container ${id}">
                                    <input type="text" name="link" id="link" class="link-input-url" placeholder="www.todolist.com">
                                    <input type="text" name="title" id="title" class="link-input-title" placeholder="Titulo">
                                    <button class="send-link">Adicionar<i class="fas fa-check"></i></button>
                                </div>
                                <div class="add-link-button open"><i class="fas fa-chevron-down"></i></div>
                            </div>
                            <div class="todo-footer">
                                <div class="todo-header-icons">
                                    <i class="fas fa-edit open-editor"></i>
                                    <a class="remove-todo">
                                        <i class="fas fa-trash-alt"></i>
                                    </a>
                                </div>
                                <p class="date_to_complete">${convert_date_to_front(data.date_to_complete)}</p>
                            </div>
                            `
                            document.querySelectorAll('.todo-body').forEach(linkContainer => {
                                linkContainer.querySelector(".add-link-button").addEventListener("click", () => {
                                    if (linkContainer.querySelector(".add-link-button").classList[1] == "open") {
                                        linkContainer.querySelector(".add-link-container").style.animation = "open-link .3s linear forwards";
                                        setTimeout(() => {
                                            linkContainer.querySelector(".add-link-button").childNodes[0].classList = "fas fa-chevron-up";
                                        }, 300);
                                        linkContainer.querySelector(".add-link-container").style.padding = ".5rem";
                                        linkContainer.querySelector(".add-link-button").classList.remove("open");
                                        linkContainer.querySelector(".add-link-button").classList.add("close");
                                    }
                                    else {
                                        linkContainer.querySelector(".add-link-container").style.animation = "close-link .3s linear forwards";
                                        setTimeout(() => {
                                            linkContainer.querySelector(".add-link-button").childNodes[0].classList = "fas fa-chevron-down";
                                        }, 300);
                                        linkContainer.querySelector(".add-link-container").style.padding = "0";
                                        linkContainer.querySelector(".add-link-button").classList.remove("close");
                                        linkContainer.querySelector(".add-link-button").classList.add("open");
                                    }
                                })
                            });
                            delete_link(todo);
                            add_link(todo);
                            open_editor(todo);
                            delete_todo(todo);
                        }
                    })
                })
            }).catch((error) => {
                console.log(error);
            })
        })
}

document.querySelectorAll(".todo").forEach((todo) => {
    add_link(todo);
    delete_link(todo);
    open_editor(todo);
    delete_todo(todo);
})
