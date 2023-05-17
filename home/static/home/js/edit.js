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
                <a href="${data.url}" target="_blank">${data.title}</a>
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

const done_todo = (todo) => {
    todo.querySelector(".complete-todo").addEventListener(
        "click", () => {
            const id = todo.classList[2];
            const crsf = document.querySelector("[name=csrfmiddlewaretoken]").value;
            let data = new FormData();
            data.append("id", id);
            fetch('/complete_todo/', {
                method: 'POST',
                headers: {
                    "X-CSRFToken": crsf,
                },
                body: data
            }).then((response) => {
                return responseo.json();
            }).then((data) => {
                if (data.status == "ok") {
                    todo.remove();
                }
            })
        }
    )
}


const open_editor = (todo) => {
    todo.querySelector(".open-editor").addEventListener(
        "click", async () => {
            const id = todo.classList[2];
            const title = todo.querySelector(".todo-header .todo-title").textContent;
            const description = todo.querySelector(".todo-body .todo-description").textContent;
            const date_to_complete = todo.querySelector(".todo-footer .date_to_complete").textContent;
            const links = todo.querySelector(".todo-body .link-container").innerHTML;
            const crsf = document.querySelector("[name=csrfmiddlewaretoken]").value;

            const todo_header = document.createElement("div");
            todo_header.classList.add("todo-header");
            let categories;
            await fetch('/get_categories/', {
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

                    if (category.name == category_todo) {
                        option.selected = true;
                    }
                    category_select.appendChild(option);
                })
                todo_header.innerHTML = `
                <input type="text" class="todo-title form-input" value="${title}">
                `
                todo_header.appendChild(category_select);
                const todo_body = document.createElement("div");
                todo_body.classList.add("todo-body");
                todo_body.innerHTML = `
                <textarea class="todo-description form-input" cols="30" rows="10">${description}</textarea>
                `

                const todo_footer = document.createElement("div");
                todo_footer.classList.add("todo-footer");
                todo_footer.innerHTML = `
                <div class="todo-header-icons">
                    <i class="fas fa-check close-editor"></i>
                    <a class="remove-todo" href="{% url 'home:delete_todo' pk=todo.id %}">
                        <i class="fas fa-trash-alt"></i>
                    </a>
                </div>
                <input type="date" class="date_to_complete form-input" value="${convert_date_to_back(date_to_complete)}">
                `
                todo.innerHTML = ""
                todo.appendChild(todo_header);
                todo.appendChild(todo_body);
                todo.appendChild(todo_footer);

                todo.querySelector(".todo-footer .todo-header-icons .close-editor").addEventListener("click", () => {
                    const title = todo_header.querySelector(".todo-title").value;
                    const description = todo_body.querySelector(".todo-description").value;
                    const date_to_complete = todo_footer.querySelector(".date_to_complete").value;
                    const category = todo_header.querySelector(".category-todo").value;

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
                                    <i class="fas fa-check complete-todo"></i>
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
                                    open_close_link(linkContainer);
                                })
                            });
                            delete_link(todo);
                            add_link(todo);
                            open_editor(todo);
                            delete_todo(todo);
                            done_todo(todo);
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
    done_todo(todo);
})
