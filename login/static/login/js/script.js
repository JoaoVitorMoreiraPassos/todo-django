document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('eye').addEventListener('click', () => {
        let input1 = document.getElementById("id_password");
        if (input1.type === "password") {
            input1.type = "text";
            document.getElementById("eye").classList = "fas fa-eye-slash";

        }
        else {
            input1.type = "password";
            document.getElementById("eye").classList = "fas fa-eye";
        }
    })
})