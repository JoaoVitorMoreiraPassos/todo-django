document.querySelector(".filter-choices").addEventListener("change", (event) => {
    document.querySelector(".todo-container").innerHTML = "";

    const id = event.target.value;
    const url = `/choose_category/`;
    const crsf = document.querySelector("input[name='csrfmiddlewaretoken']").value;
    let data = new FormData();
    data.append('id', id);
    fetch(url, {
        method: "POST",
        headers: {
            "X-CSRFToken": crsf,
        },
        body: data,
    }).then((response) => {
        return response.json();
    }).then((data) => {
        const createTodo = (todo_infos) => {
            const colors = ["#31be31", "#ffec5e", "#ff9f5e", "#ff5e5e"]
            const todo_body = document.createElement("div");
            todo_body.classList.add("todo");
            todo_body.classList.add(`${todo_infos.priority}`);
            todo_body.classList.add(`${todo_infos.id}`);
            let links = "";
            todo_infos.link.forEach((link) => {
                let bg_color = "";
                switch (todo_infos.priority) {
                    case "long-term":
                        bg_color = getRandomColor(colors[0]);
                        break;
                    case "normal-term":
                        bg_color = getRandomColor(colors[1]);
                        break;
                    case "near-deadline":
                        bg_color = getRandomColor(colors[2]);
                        break;
                    case "deadline":
                        bg_color = getRandomColor(colors[3]);
                        break
                }
                const font_color = getContrastColor(bg_color);
                links += `
                <div class="todo-link ${link.id}" style="background-color: rgb(${bg_color.r}, ${bg_color.r}, ${bg_color.b})">
                    <a href="/redirector/${link.url}" style="color: ${font_color}" target="_blank">${link.title}</a>
                    <a class="remove-link"><i class="fas fa-times" style="color: ${font_color}"></i></a>
                </div> 
                `
            })
            const todo_html = `
            <div class="todo-header">
                <p class="todo-title">${todo_infos.title}</p>
                <p class="category-todo">${todo_infos.category}</p>
            </div>
            <div class="todo-body">
            <p class="todo-description">${todo_infos.description}</p>
            <div class="link-container">
            <p class="label-links">Links: </p>
                ${links}
            </div>
            <div class="add-link-container ${todo_infos.id}">
                <input type="text" name="link" id="link" class="link-input-url"
                placeholder="https://www.example.com">
                <input type="text" name="title" id="title" class="link-input-title" placeholder="Titulo">
                <button class="send-link">Adicionar</button>
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
                <p class="date_to_complete">${todo_infos.date_to_complete}</p>
            </div>
            `
            todo_body.innerHTML = todo_html;
            return todo_body;
        }
        if (data.todos.length > 0) {
            data.todos.forEach((todo) => {
                const new_todo = createTodo(todo);
                add_link(new_todo);
                delete_link(new_todo);
                open_editor(new_todo);
                delete_todo(new_todo);
                new_todo.querySelector(".add-link-button").addEventListener("click", () => {
                    open_close_link(new_todo);
                })
                document.querySelector(".todo-container").appendChild(new_todo);
            });
        } else {
            const void_alert = document.createElement("h2");
            void_alert.classList.add("void-alert");
            void_alert.innerHTML = "Nenhum Todo encontrado";
            document.querySelector(".todo-container").appendChild(void_alert);
        }
    }).catch((error) => {
        console.log(error);
    })
})