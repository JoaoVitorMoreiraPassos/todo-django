let convert_date = (date) => {
    return date.split("/").reverse().join("-");
}

let todos = document.querySelectorAll(".todo");
todos.forEach((todo) => {
    todo.childNodes[7].childNodes[3].childNodes[1].addEventListener("click", () => {
        openEditor(todo);
    });
});
let openEditor = (todo) => {
    let titulo = todo.childNodes[3].childNodes[1].textContent;
    let descricao = todo.childNodes[5].childNodes[1].textContent;
    let data = todo.childNodes[7].childNodes[5].textContent;
    data = convert_date(data);
    let categoria = todo.childNodes[3].childNodes[3].textContent;
    // let categoria = todo.childNodes[7].childNodes[1].textContent;
    let criacao = todo.childNodes[7].childNodes[3].textContent;
    let id = todo.childNodes[7].childNodes[3].childNodes[3].href.split("/")[4];
    // Cria o formúlario
    let form = document.createElement("form");
    form.classList = "edit-form"
    let crsf = document.querySelector("input[name='csrfmiddlewaretoken']");
    form.appendChild(crsf);
    form.method = "POST";
    form.action = `/edit_todo/${id}/`;
    // Cria o header do formúlario
    form_todo_header = document.createElement("div");
    form_todo_header.classList = "todo-header";
    let form_titulo = document.createElement("input");
    form_titulo.type = "text";
    form_titulo.name = "titulo";
    form_titulo.classList.toggle("form-input")
    form_titulo.value = titulo;
    form_todo_header.appendChild(form_titulo);
    let form_todo_header_category = document.createElement("select");
    form_todo_header_category.classList = "category-todo";
    form_todo_header_category.classList.toggle("form-input")
    form_todo_header_category.name = "categoria";
    let options = document.querySelector("#id_category");
    options.childNodes.forEach((option) => {
        if (option.value != "" && option.value != undefined) {
            let form_todo_footer_category_option = document.createElement("option");
            form_todo_footer_category_option.value = option.value;
            form_todo_footer_category_option.textContent = option.textContent;
            if (option.textContent == categoria) {
                form_todo_footer_category_option.selected = true;
            }
            form_todo_header_category.appendChild(form_todo_footer_category_option);
        }
    });
    form_todo_header.appendChild(form_todo_header_category);
    form.appendChild(form_todo_header);

    // Cria o body do formúlario
    let form_todo_body = document.createElement("div");
    form_todo_body.classList = "todo-body";
    let form_todo_body_description = document.createElement("textarea");
    form_todo_body_description.classList = "todo-description";
    form_todo_body_description.classList.toggle("form-input-text")
    form_todo_body_description.name = "descricao";
    form_todo_body_description.value = descricao;
    form_todo_body.appendChild(form_todo_body_description);
    let form_todo_date_to_complete = document.createElement("input");
    form_todo_date_to_complete.type = "date";
    form_todo_date_to_complete.name = "data";
    form_todo_date_to_complete.classList.toggle("form-input")
    console.log(data)
    form_todo_date_to_complete.value = data;
    form_todo_body.appendChild(form_todo_body_description);
    form.appendChild(form_todo_body);

    // Cria o footer do formúlario
    let form_todo_footer = document.createElement("div");
    form_todo_footer.classList = "todo-footer";

    let form_todo_footer_icons = document.createElement("div");
    form_todo_footer_icons.classList = "todo-header-icons";

    let submit = document.createElement("button");
    submit.classList = "edit-todo-button";
    let form_todo_header_icon_edit = document.createElement("i");
    form_todo_header_icon_edit.classList = "fas fa-check-square close-editor";
    submit.appendChild(form_todo_header_icon_edit);
    form_todo_footer_icons.appendChild(submit)

    let form_todo_footer_icon_remove = document.createElement("a");
    form_todo_footer_icon_remove.classList = "remove-todo";
    form_todo_footer_icon_remove.href = `/delete_todo/${id}/`;

    let form_todo_header_icon_remove_i = document.createElement("i");
    form_todo_header_icon_remove_i.classList = "fas fa-trash-alt";
    form_todo_footer_icon_remove.appendChild(form_todo_header_icon_remove_i);
    form_todo_footer_icons.appendChild(form_todo_footer_icon_remove);
    form_todo_footer.appendChild(form_todo_footer_icons);

    let form_todo_footer_created_at = document.createElement("span");
    form_todo_footer_created_at.classList = "created-at";
    form_todo_footer_created_at.textContent = criacao;
    form_todo_footer.appendChild(form_todo_footer_created_at);
    form_todo_footer.appendChild(form_todo_date_to_complete);
    form.appendChild(form_todo_footer);

    for (let i = 0; i < 8; i++) {
        console.log(i)
        todo.removeChild(todo.childNodes[0])
    }
    todo.appendChild(form);
};